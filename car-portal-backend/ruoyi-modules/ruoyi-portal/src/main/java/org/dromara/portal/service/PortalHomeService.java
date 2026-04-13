package org.dromara.portal.service;

import lombok.RequiredArgsConstructor;
import org.dromara.common.core.utils.MapstructUtils;
import org.dromara.portal.domain.PortalHomeContent;
import org.dromara.portal.domain.dto.*;
import org.dromara.portal.mapper.PortalHomeContentMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class PortalHomeService {

    private static final Long HOME_CONTENT_ID = 1L;

    private final PortalHomeContentMapper portalHomeContentMapper;

    public HomeContentDto getHomeContent() {
        HomeContentDto dto = portalHomeContentMapper.selectVoById(HOME_CONTENT_ID);
        if (dto != null) {
            return dto;
        }
        HomeContentDto defaultContent = buildDefault();
        saveHomeContent(defaultContent);
        return defaultContent;
    }

    @Transactional(rollbackFor = Exception.class)
    public void saveHomeContent(HomeContentDto dto) {
        PortalHomeContent entity = MapstructUtils.convert(dto, PortalHomeContent.class);
        entity.setId(HOME_CONTENT_ID);
        entity.setUpdateTime(LocalDateTime.now());
        entity.setDelFlag("0");
        if (portalHomeContentMapper.selectById(HOME_CONTENT_ID) == null) {
            portalHomeContentMapper.insert(entity);
        } else {
            portalHomeContentMapper.updateById(entity);
        }
    }

    private HomeContentDto buildDefault() {
        HomeContentDto dto = new HomeContentDto();
        dto.setHeroTitle("汽车数据门户平台");
        dto.setHeroSubtitle("面向汽车仿真、标注与案例运营的一体化门户");

        StatItemDto stat1 = new StatItemDto();
        stat1.setLabel("登录主体");
        stat1.setValue("142");

        StatItemDto stat2 = new StatItemDto();
        stat2.setLabel("服务机构");
        stat2.setValue("28");

        StatItemDto stat3 = new StatItemDto();
        stat3.setLabel("发布案例");
        stat3.setValue("311");

        dto.setStats(List.of(stat1, stat2, stat3));
        dto.setFlowSteps(List.of("提交申请", "登记受理", "登记审查", "登记公示", "证书发放"));

        ServiceCenterItemDto service = new ServiceCenterItemDto();
        service.setCategory("数据合规服务");
        service.setTitle("数据合规评估服务");
        service.setDescription("提供数据合规评估相关法律服务，并出具数据合规评估报告。");
        service.setPartnerNames(List.of("合作机构A", "合作机构B", "合作机构C"));
        dto.setServices(List.of(service));

        NewsItemDto news = new NewsItemDto();
        news.setId(1L);
        news.setTitle("门户初始化完成");
        news.setSummary("后台运营可在管理端配置首页内容、资讯与案例。\n");
        news.setHighlight(Boolean.TRUE);
        dto.setNews(List.of(news));

        return dto;
    }
}
