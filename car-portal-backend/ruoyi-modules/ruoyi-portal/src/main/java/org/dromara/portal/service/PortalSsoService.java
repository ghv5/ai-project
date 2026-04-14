package org.dromara.portal.service;

import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.digest.DigestUtil;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.dromara.common.core.domain.R;
import org.dromara.common.redis.utils.RedisUtils;
import org.dromara.portal.config.PortalSsoProperties;
import org.dromara.portal.constant.PortalRedisKeys;
import org.dromara.portal.domain.dto.*;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PortalSsoService {

    private final PortalSsoProperties properties;
    private final PortalUserMappingService userMappingService;

    public R<CreateTicketResponse> createTicket(Long userId, String platform) {
        if (!isSupportedPlatform(platform)) {
            return R.fail("不支持的平台类型: " + platform);
        }

        String account = userMappingService.getAccountByPlatform(userId, platform);
        if (StrUtil.isBlank(account)) {
            return R.fail("当前用户未配置" + platform + "平台账号映射");
        }

        String ticket = UUID.randomUUID().toString().replace("-", "");
        long now = System.currentTimeMillis();
        long expireIn = properties.getTicketExpireSeconds();
        TicketPayload payload = TicketPayload.builder()
            .userId(userId)
            .platform(platform)
            .createTime(now)
            .expireTime(now + expireIn * 1000)
            .build();

        RedisUtils.setCacheObject(
            PortalRedisKeys.SSO_TICKET_KEY_PREFIX + ticket,
            payload,
            Duration.ofSeconds(expireIn)
        );

        String entryUrl = getEntryUrl(platform);
        CreateTicketResponse response = CreateTicketResponse.builder()
            .platform(platform)
            .ticket(ticket)
            .entryUrl(StrUtil.isBlank(entryUrl) ? "" : entryUrl + "?ticket=" + ticket)
            .expireIn(expireIn)
            .build();

        return R.ok(response);
    }

    public R<TicketExchangeResponse> exchange(TicketExchangeRequest request) {
        if (!isValidSignature(request)) {
            return R.fail("签名校验失败");
        }

        String ticketKey = PortalRedisKeys.SSO_TICKET_KEY_PREFIX + request.getTicket();
        TicketPayload payload = RedisUtils.getCacheObject(ticketKey);
        if (payload == null) {
            return R.fail("ticket 不存在或已过期");
        }

        RedisUtils.deleteObject(ticketKey);

        String account = userMappingService.getAccountByPlatform(payload.getUserId(), payload.getPlatform());
        if (StrUtil.isBlank(account)) {
            return R.fail("账号映射不存在");
        }

        String sessionToken = UUID.randomUUID().toString().replace("-", "");
        long expireIn = properties.getSessionExpireSeconds();
        String sessionKey = buildSessionKey(payload.getUserId(), payload.getPlatform());
        RedisUtils.setCacheObject(sessionKey, sessionToken, Duration.ofSeconds(expireIn));

        TicketExchangeResponse response = TicketExchangeResponse.builder()
            .userId(payload.getUserId())
            .platform(payload.getPlatform())
            .thirdPartyAccount(account)
            .sessionToken(sessionToken)
            .expireIn(expireIn)
            .build();

        return R.ok(response);
    }

    public LogoutResponse logout(Long userId) {
        List<String> successPlatforms = new ArrayList<>();
        List<String> failedPlatforms = new ArrayList<>();

        logoutPlatform(userId, "annotate", properties.getAnnotateLogoutUrl(), successPlatforms, failedPlatforms);
        logoutPlatform(userId, "simulate", properties.getSimulateLogoutUrl(), successPlatforms, failedPlatforms);

        return LogoutResponse.builder()
            .localLogout(Boolean.TRUE)
            .successPlatforms(successPlatforms)
            .failedPlatforms(failedPlatforms)
            .build();
    }

    private void logoutPlatform(Long userId, String platform, String logoutUrl,
                                List<String> successPlatforms, List<String> failedPlatforms) {
        String sessionKey = buildSessionKey(userId, platform);
        String sessionToken = RedisUtils.getCacheObject(sessionKey);
        RedisUtils.deleteObject(sessionKey);
        if (StrUtil.isBlank(logoutUrl)) {
            successPlatforms.add(platform);
            return;
        }

        try {
            HttpResponse response = HttpRequest.post(logoutUrl)
                .form("userId", userId)
                .form("platform", platform)
                .form("sessionToken", StrUtil.nullToEmpty(sessionToken))
                .timeout(3000)
                .execute();
            if (response.isOk()) {
                successPlatforms.add(platform);
            } else {
                failedPlatforms.add(platform);
            }
        } catch (Exception ex) {
            log.warn("回调第三方登出失败, platform={}, userId={}", platform, userId, ex);
            failedPlatforms.add(platform);
        }
    }

    private boolean isValidSignature(TicketExchangeRequest request) {
        long nowSeconds = System.currentTimeMillis() / 1000;
        long ts = request.getTimestamp();
        if (Math.abs(nowSeconds - ts) > properties.getAllowedTimestampSkewSeconds()) {
            return false;
        }

        String plain = request.getTicket() + "|" + request.getTimestamp() + "|" + request.getNonce() + "|" + properties.getCallbackSecret();
        String expected = DigestUtil.sha256Hex(plain);
        return StrUtil.equalsIgnoreCase(expected, request.getSign());
    }

    private boolean isSupportedPlatform(String platform) {
        return "annotate".equals(platform) || "simulate".equals(platform);
    }

    private String getEntryUrl(String platform) {
        return "annotate".equals(platform) ? properties.getAnnotateEntryUrl() : properties.getSimulateEntryUrl();
    }

    private String buildSessionKey(Long userId, String platform) {
        return PortalRedisKeys.SSO_SESSION_KEY_PREFIX + userId + ":" + platform;
    }
}
