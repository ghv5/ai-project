package org.dromara.portal.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import lombok.RequiredArgsConstructor;
import org.dromara.common.core.domain.R;
import org.dromara.common.satoken.utils.LoginHelper;
import org.dromara.portal.domain.dto.UserMappingDto;
import org.dromara.portal.service.PortalUserMappingService;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/user-mapping")
public class PortalUserMappingController {

    private final PortalUserMappingService portalUserMappingService;

    @SaCheckPermission("portal:mapping:query")
    @GetMapping("/{userId}")
    public R<UserMappingDto> getUserMapping(@PathVariable Long userId) {
        UserMappingDto dto = portalUserMappingService.getByUserId(userId);
        return dto == null ? R.fail("用户映射不存在") : R.ok(dto);
    }

    @SaCheckPermission("portal:mapping:edit")
    @PutMapping("/{userId}")
    public R<Void> updateUserMapping(@PathVariable Long userId, @RequestBody UserMappingDto request) {
        portalUserMappingService.save(userId, request, LoginHelper.getUserId());
        return R.ok();
    }
}
