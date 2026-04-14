package org.dromara.portal.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class TicketExchangeRequest implements Serializable {

    @NotBlank(message = "ticket 不能为空")
    private String ticket;

    @NotBlank(message = "nonce 不能为空")
    private String nonce;

    @NotBlank(message = "sign 不能为空")
    private String sign;

    @NotNull(message = "timestamp 不能为空")
    private Long timestamp;
}
