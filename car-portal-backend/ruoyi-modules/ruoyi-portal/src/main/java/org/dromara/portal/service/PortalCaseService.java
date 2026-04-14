package org.dromara.portal.service;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import lombok.RequiredArgsConstructor;
import org.dromara.common.core.constant.TenantConstants;
import org.dromara.common.mybatis.utils.IdGeneratorUtil;
import org.dromara.portal.domain.PortalCase;
import org.dromara.portal.domain.dto.PortalCaseDto;
import org.dromara.portal.mapper.PortalCaseMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class PortalCaseService {

    private static final Long DEFAULT_TENANT_ID = Long.valueOf(TenantConstants.DEFAULT_TENANT_ID);

    private final PortalCaseMapper portalCaseMapper;

    public List<PortalCaseDto> listPublicCases(String keyword) {
        return listAll(keyword, true, null);
    }

    public List<PortalCaseDto> listAdminCases(String keyword, Boolean published) {
        return listAll(keyword, false, published);
    }

    public PortalCaseDto getById(Long caseId) {
        PortalCase entity = portalCaseMapper.selectById(caseId);
        if (entity == null || Integer.valueOf(1).equals(entity.getDelFlag()) || !Boolean.TRUE.equals(entity.getPublished())) {
            return null;
        }
        return toDto(entity);
    }

    @Transactional(rollbackFor = Exception.class)
    public Long create(PortalCaseDto request, Long operatorId) {
        PortalCase entity = toEntity(request);
        entity.setCaseId(IdGeneratorUtil.nextLongId());
        entity.setTenantId(DEFAULT_TENANT_ID);
        entity.setCreateBy(operatorId == null ? null : String.valueOf(operatorId));
        entity.setUpdateBy(operatorId == null ? null : String.valueOf(operatorId));
        entity.setUpdateTime(LocalDateTime.now());
        entity.setPublished(Boolean.TRUE.equals(request.getPublished()));
        entity.setPinned(Boolean.TRUE.equals(request.getPinned()));
        entity.setSortOrder(request.getSortOrder() == null ? 999 : request.getSortOrder());
        entity.setPublishTime(entity.getPublished() ? LocalDateTime.now() : null);
        entity.setDelFlag(0);
        portalCaseMapper.insert(entity);
        return entity.getCaseId();
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean update(PortalCaseDto request, Long operatorId) {
        if (request.getCaseId() == null) {
            return false;
        }
        PortalCase dbEntity = portalCaseMapper.selectById(request.getCaseId());
        if (dbEntity == null) {
            return false;
        }
        PortalCase entity = toEntity(request);
        entity.setUpdateBy(operatorId == null ? null : String.valueOf(operatorId));
        entity.setUpdateTime(LocalDateTime.now());
        entity.setPublished(Boolean.TRUE.equals(request.getPublished()));
        entity.setPinned(Boolean.TRUE.equals(request.getPinned()));
        entity.setSortOrder(request.getSortOrder() == null ? 999 : request.getSortOrder());
        entity.setPublishTime(Boolean.TRUE.equals(request.getPublished()) ? LocalDateTime.now() : null);
        return portalCaseMapper.updateById(entity) > 0;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean delete(Long caseId) {
        return portalCaseMapper.deleteById(caseId) > 0;
    }

    private List<PortalCaseDto> listAll(String keyword, boolean publicOnly, Boolean published) {
        LambdaQueryWrapper<PortalCase> lqw = Wrappers.lambdaQuery();
        if (publicOnly) {
            lqw.eq(PortalCase::getPublished, Boolean.TRUE);
        } else if (published != null) {
            lqw.eq(PortalCase::getPublished, published);
        }
        if (StrUtil.isNotBlank(keyword)) {
            lqw.and(w -> w.like(PortalCase::getTitle, keyword)
                .or()
                .like(PortalCase::getDescription, keyword)
                .or()
                .like(PortalCase::getTags, keyword));
        }
        lqw.orderByDesc(PortalCase::getPinned)
            .orderByAsc(PortalCase::getSortOrder)
            .orderByDesc(PortalCase::getUpdateTime);
        return portalCaseMapper.selectList(lqw).stream().map(this::toDto).toList();
    }

    private PortalCaseDto toDto(PortalCase entity) {
        PortalCaseDto dto = new PortalCaseDto();
        dto.setCaseId(entity.getCaseId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setCoverUrl(entity.getCoverUrl());
        dto.setVideoUrl(entity.getVideoUrl());
        dto.setTags(entity.getTags());
        dto.setIndustry(entity.getIndustry());
        dto.setScenario(entity.getScenario());
        dto.setSortOrder(entity.getSortOrder());
        dto.setPinned(entity.getPinned());
        dto.setPublished(entity.getPublished());
        dto.setPublishTime(entity.getPublishTime());
        dto.setUpdateTime(entity.getUpdateTime());
        return dto;
    }

    private PortalCase toEntity(PortalCaseDto dto) {
        PortalCase entity = new PortalCase();
        entity.setCaseId(dto.getCaseId());
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setCoverUrl(dto.getCoverUrl());
        entity.setVideoUrl(dto.getVideoUrl());
        entity.setTags(dto.getTags());
        entity.setIndustry(dto.getIndustry());
        entity.setScenario(dto.getScenario());
        entity.setSortOrder(dto.getSortOrder());
        entity.setPinned(dto.getPinned());
        entity.setPublished(dto.getPublished());
        entity.setPublishTime(dto.getPublishTime());
        entity.setUpdateTime(dto.getUpdateTime());
        return entity;
    }
}
