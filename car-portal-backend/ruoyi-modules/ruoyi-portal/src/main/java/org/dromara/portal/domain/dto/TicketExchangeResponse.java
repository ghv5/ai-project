package org.dromara.portal.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
public class TicketExchangeResponse implements Serializable {

    private Long userId;

    private String platform;

    private String thirdPartyAccount;

    private String sessionToken;

    private Long expireIn;
}
