package org.dromara.portal.service;

import org.dromara.common.core.domain.R;
import org.dromara.portal.config.PortalSsoProperties;
import org.dromara.portal.domain.dto.CreateTicketResponse;
import org.dromara.portal.domain.dto.TicketExchangeRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@Tag("dev")
public class PortalSsoServiceTest {

    @Mock
    private PortalUserMappingService userMappingService;

    private PortalSsoService portalSsoService;

    @BeforeEach
    public void setUp() {
        PortalSsoProperties properties = new PortalSsoProperties();
        properties.setCallbackSecret("test-secret");
        properties.setAllowedTimestampSkewSeconds(300);
        portalSsoService = new PortalSsoService(properties, userMappingService);
    }

    @Test
    public void createTicketShouldFailWhenMappingMissing() {
        when(userMappingService.getAccountByPlatform(1L, "annotate")).thenReturn(null);

        R<CreateTicketResponse> result = portalSsoService.createTicket(1L, "annotate");

        assertEquals(R.FAIL, result.getCode());
        assertTrue(result.getMsg().contains("未配置annotate平台账号映射"));
    }

    @Test
    public void createTicketShouldFailWhenPlatformUnsupported() {
        R<CreateTicketResponse> result = portalSsoService.createTicket(1L, "unknown");

        assertEquals(R.FAIL, result.getCode());
        assertTrue(result.getMsg().contains("不支持的平台类型"));
    }

    @Test
    public void exchangeShouldFailWhenSignInvalid() {
        TicketExchangeRequest request = new TicketExchangeRequest();
        request.setTicket("abc");
        request.setNonce("n1");
        request.setTimestamp(System.currentTimeMillis() / 1000);
        request.setSign("invalid");

        assertEquals(R.FAIL, portalSsoService.exchange(request).getCode());
    }
}
