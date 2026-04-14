package org.dromara.portal.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
public class CreateTicketResponse implements Serializable {

    private String platform;

    private String ticket;

    private String entryUrl;

    private Long expireIn;
}
