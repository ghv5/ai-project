package org.dromara.portal.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 门户 SSO 配置
 */
@Data
@Component
@ConfigurationProperties(prefix = "portal.sso")
public class PortalSsoProperties {

    /**
     * ticket 有效期（秒）
     */
    private long ticketExpireSeconds = 60;

    /**
     * 会话有效期（秒）
     */
    private long sessionExpireSeconds = 28800;

    /**
     * 签名密钥（第三方调用 exchange 接口）
     */
    private String callbackSecret = "portal-change-me";

    /**
     * 时间戳容差（秒）
     */
    private long allowedTimestampSkewSeconds = 300;

    /**
     * 标注平台入口地址
     */
    private String annotateEntryUrl = "";

    /**
     * 仿真平台入口地址
     */
    private String simulateEntryUrl = "";

    /**
     * 标注平台登出回调地址
     */
    private String annotateLogoutUrl = "";

    /**
     * 仿真平台登出回调地址
     */
    private String simulateLogoutUrl = "";
}
