package org.dromara.portal.domain.dto;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class UserMappingDto implements Serializable {

    private Long userId;

    private String annotateAccount;

    private String simulateAccount;

    private LocalDateTime updatedAt;

    private Long updatedBy;
}
