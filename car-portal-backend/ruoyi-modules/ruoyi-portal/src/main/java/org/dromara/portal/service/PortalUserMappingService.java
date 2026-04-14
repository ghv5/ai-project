package org.dromara.portal.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import lombok.RequiredArgsConstructor;
import org.dromara.common.core.constant.TenantConstants;
import org.dromara.common.core.utils.MapstructUtils;
import org.dromara.common.mybatis.utils.IdGeneratorUtil;
import org.dromara.portal.domain.PortalUserMapping;
import org.dromara.portal.domain.dto.UserMappingDto;
import org.dromara.portal.mapper.PortalUserMappingMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class PortalUserMappingService {

    private static final Long DEFAULT_TENANT_ID = Long.valueOf(TenantConstants.DEFAULT_TENANT_ID);

    private final PortalUserMappingMapper portalUserMappingMapper;

    public UserMappingDto getByUserId(Long userId) {
        LambdaQueryWrapper<PortalUserMapping> lqw = Wrappers.lambdaQuery();
        lqw.eq(PortalUserMapping::getUserId, userId);
        return portalUserMappingMapper.selectVoOne(lqw);
    }

    @Transactional(rollbackFor = Exception.class)
    public void save(Long userId, UserMappingDto mapping, Long operator) {
        LambdaQueryWrapper<PortalUserMapping> lqw = Wrappers.lambdaQuery();
        lqw.eq(PortalUserMapping::getUserId, userId);
        PortalUserMapping dbEntity = portalUserMappingMapper.selectOne(lqw);

        PortalUserMapping entity = MapstructUtils.convert(mapping, PortalUserMapping.class);
        entity.setUserId(userId);
        entity.setTenantId(DEFAULT_TENANT_ID);
        entity.setUpdatedAt(LocalDateTime.now());
        entity.setUpdatedBy(operator);
        entity.setDelFlag("0");
        if (dbEntity == null) {
            entity.setId(IdGeneratorUtil.nextLongId());
            portalUserMappingMapper.insert(entity);
        } else {
            entity.setId(dbEntity.getId());
            portalUserMappingMapper.updateById(entity);
        }
    }

    public String getAccountByPlatform(Long userId, String platform) {
        UserMappingDto mapping = getByUserId(userId);
        if (mapping == null) {
            return null;
        }
        if ("annotate".equals(platform)) {
            return mapping.getAnnotateAccount();
        }
        if ("simulate".equals(platform)) {
            return mapping.getSimulateAccount();
        }
        return null;
    }
}
