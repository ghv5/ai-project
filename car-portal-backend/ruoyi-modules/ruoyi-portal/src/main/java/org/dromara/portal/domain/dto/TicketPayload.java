package org.dromara.portal.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
public class TicketPayload implements Serializable {

    private Long userId;

    private String platform;

    private Long createTime;

    private Long expireTime;
}
