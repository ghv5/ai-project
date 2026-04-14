package org.dromara.portal.controller;

import cn.dev33.satoken.annotation.SaIgnore;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.dromara.common.core.domain.R;
import org.dromara.common.satoken.utils.LoginHelper;
import org.dromara.portal.domain.dto.*;
import org.dromara.portal.service.PortalSsoService;
import org.dromara.system.api.model.LoginUser;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/sso")
public class PortalSsoController {

    private final PortalSsoService portalSsoService;

    @PostMapping("/ticket")
    public R<CreateTicketResponse> createTicket(@Valid @RequestBody CreateTicketRequest request) {
        LoginUser loginUser = LoginHelper.getLoginUser();
        return portalSsoService.createTicket(loginUser.getUserId(), request.getPlatform());
    }

    @SaIgnore
    @PostMapping("/ticket/exchange")
    public R<TicketExchangeResponse> exchange(@Valid @RequestBody TicketExchangeRequest request) {
        return portalSsoService.exchange(request);
    }

    @PostMapping("/logout")
    public R<LogoutResponse> logout() {
        LogoutResponse response = portalSsoService.logout(LoginHelper.getUserId());
        return R.ok(response);
    }
}
