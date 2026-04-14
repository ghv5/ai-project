package org.dromara.portal.domain.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

@Data
public class CreateTicketRequest implements Serializable {

    @NotBlank(message = "platform 不能为空")
    private String platform;
}
