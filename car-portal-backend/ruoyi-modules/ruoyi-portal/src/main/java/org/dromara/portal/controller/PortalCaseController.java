package org.dromara.portal.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import cn.dev33.satoken.annotation.SaIgnore;
import lombok.RequiredArgsConstructor;
import org.dromara.common.core.domain.R;
import org.dromara.common.satoken.utils.LoginHelper;
import org.dromara.portal.domain.dto.PortalCaseDto;
import org.dromara.portal.service.PortalCaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/cases")
public class PortalCaseController {

    private final PortalCaseService portalCaseService;

    @SaIgnore
    @GetMapping
    public R<List<PortalCaseDto>> listPublicCases(@RequestParam(required = false) String keyword) {
        return R.ok(portalCaseService.listPublicCases(keyword));
    }

    @SaIgnore
    @GetMapping("/{caseId}")
    public R<PortalCaseDto> getCaseDetail(@PathVariable Long caseId) {
        PortalCaseDto dto = portalCaseService.getById(caseId);
        return dto == null ? R.fail("案例不存在") : R.ok(dto);
    }

    @SaCheckPermission("portal:case:list")
    @GetMapping("/admin/list")
    public R<List<PortalCaseDto>> listAdminCases(@RequestParam(required = false) String keyword,
                                                  @RequestParam(required = false) Boolean published) {
        return R.ok(portalCaseService.listAdminCases(keyword, published));
    }

    @SaCheckPermission("portal:case:add")
    @PostMapping
    public R<Long> createCase(@RequestBody PortalCaseDto request) {
        return R.ok(portalCaseService.create(request, LoginHelper.getUserId()));
    }

    @SaCheckPermission("portal:case:edit")
    @PutMapping
    public R<Void> updateCase(@RequestBody PortalCaseDto request) {
        return portalCaseService.update(request, LoginHelper.getUserId()) ? R.ok() : R.fail("更新失败，案例不存在");
    }

    @SaCheckPermission("portal:case:remove")
    @DeleteMapping("/{caseId}")
    public R<Void> deleteCase(@PathVariable Long caseId) {
        return portalCaseService.delete(caseId) ? R.ok() : R.fail("删除失败，案例不存在");
    }
}
