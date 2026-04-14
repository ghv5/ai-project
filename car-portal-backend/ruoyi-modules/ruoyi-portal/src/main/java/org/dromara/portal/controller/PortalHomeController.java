package org.dromara.portal.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import cn.dev33.satoken.annotation.SaIgnore;
import lombok.RequiredArgsConstructor;
import org.dromara.common.core.domain.R;
import org.dromara.portal.domain.dto.HomeContentDto;
import org.dromara.portal.service.PortalHomeService;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/home")
public class PortalHomeController {

    private final PortalHomeService portalHomeService;

    @SaIgnore
    @GetMapping
    public R<HomeContentDto> getHomeContent() {
        return R.ok(portalHomeService.getHomeContent());
    }

    @SaCheckPermission("portal:home:edit")
    @PutMapping
    public R<Void> updateHomeContent(@RequestBody HomeContentDto request) {
        portalHomeService.saveHomeContent(request);
        return R.ok();
    }
}
