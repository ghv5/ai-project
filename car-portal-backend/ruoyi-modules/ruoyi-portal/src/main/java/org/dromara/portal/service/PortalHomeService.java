package org.dromara.portal.service;

import lombok.RequiredArgsConstructor;
import org.dromara.common.core.constant.TenantConstants;
import org.dromara.portal.domain.PortalHomeContent;
import org.dromara.portal.domain.dto.*;
import org.dromara.portal.mapper.PortalHomeContentMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;

@RequiredArgsConstructor
@Service
public class PortalHomeService {

    private static final Long HOME_CONTENT_ID = 1L;
    private static final Long DEFAULT_TENANT_ID = Long.valueOf(TenantConstants.DEFAULT_TENANT_ID);

    private final PortalHomeContentMapper portalHomeContentMapper;

    public HomeContentDto getHomeContent() {
        PortalHomeContent entity = portalHomeContentMapper.selectById(HOME_CONTENT_ID);
        if (entity != null) {
            return toDto(entity);
        }
        HomeContentDto empty = new HomeContentDto();
        empty.setHeroTitle("");
        empty.setHeroSubtitle("");
        empty.setFlowSteps(Collections.emptyList());
        empty.setStats(Collections.emptyList());
        empty.setServices(Collections.emptyList());
        empty.setNews(Collections.emptyList());
        return empty;
    }

    @Transactional(rollbackFor = Exception.class)
    public void saveHomeContent(HomeContentDto dto) {
        PortalHomeContent entity = new PortalHomeContent();
        entity.setHeroTitle(dto.getHeroTitle());
        entity.setHeroSubtitle(dto.getHeroSubtitle());
        entity.setFlowSteps(dto.getFlowSteps());
        entity.setStats(dto.getStats());
        entity.setServices(dto.getServices());
        entity.setNews(dto.getNews());
        entity.setId(HOME_CONTENT_ID);
        entity.setTenantId(DEFAULT_TENANT_ID);
        entity.setUpdateTime(LocalDateTime.now());
        entity.setDelFlag("0");
        PortalHomeContent dbEntity = portalHomeContentMapper.selectById(HOME_CONTENT_ID);
        if (dbEntity == null) {
            portalHomeContentMapper.insert(entity);
        } else {
            portalHomeContentMapper.updateById(entity);
        }
    }

    private HomeContentDto toDto(PortalHomeContent entity) {
        HomeContentDto dto = new HomeContentDto();
        dto.setHeroTitle(entity.getHeroTitle());
        dto.setHeroSubtitle(entity.getHeroSubtitle());
        dto.setFlowSteps(entity.getFlowSteps());
        dto.setStats(entity.getStats());
        dto.setServices(entity.getServices());
        dto.setNews(entity.getNews());
        return dto;
    }
}
