package org.dromara.portal.service;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import lombok.RequiredArgsConstructor;
import org.dromara.common.core.utils.MapstructUtils;
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

    private final PortalCaseMapper portalCaseMapper;

    public List<PortalCaseDto> listPublicCases(String keyword) {
        return listAll(keyword, true);
    }

    public List<PortalCaseDto> listAdminCases(String keyword) {
        return listAll(keyword, false);
    }

    public PortalCaseDto getById(Long caseId) {
        return portalCaseMapper.selectVoById(caseId);
    }

    @Transactional(rollbackFor = Exception.class)
    public Long create(PortalCaseDto request) {
        PortalCase entity = MapstructUtils.convert(request, PortalCase.class);
        entity.setCaseId(IdGeneratorUtil.nextLongId());
        entity.setUpdateTime(LocalDateTime.now());
        entity.setPublished(Boolean.TRUE.equals(request.getPublished()));
        entity.setPinned(Boolean.TRUE.equals(request.getPinned()));
        entity.setSortOrder(request.getSortOrder() == null ? 999 : request.getSortOrder());
        entity.setDelFlag("0");
        portalCaseMapper.insert(entity);
        return entity.getCaseId();
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean update(PortalCaseDto request) {
        if (request.getCaseId() == null) {
            return false;
        }
        PortalCase dbEntity = portalCaseMapper.selectById(request.getCaseId());
        if (dbEntity == null) {
            return false;
        }
        PortalCase entity = MapstructUtils.convert(request, PortalCase.class);
        entity.setUpdateTime(LocalDateTime.now());
        entity.setPublished(Boolean.TRUE.equals(request.getPublished()));
        entity.setPinned(Boolean.TRUE.equals(request.getPinned()));
        entity.setSortOrder(request.getSortOrder() == null ? 999 : request.getSortOrder());
        return portalCaseMapper.updateById(entity) > 0;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean delete(Long caseId) {
        return portalCaseMapper.deleteById(caseId) > 0;
    }

    private List<PortalCaseDto> listAll(String keyword, boolean publicOnly) {
        LambdaQueryWrapper<PortalCase> lqw = Wrappers.lambdaQuery();
        if (publicOnly) {
            lqw.eq(PortalCase::getPublished, Boolean.TRUE);
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
        return portalCaseMapper.selectVoList(lqw);
    }
}
