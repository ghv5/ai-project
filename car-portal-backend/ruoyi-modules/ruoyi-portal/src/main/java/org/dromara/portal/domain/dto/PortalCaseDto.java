package org.dromara.portal.domain.dto;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class PortalCaseDto implements Serializable {

    private Long caseId;

    private String title;

    private String description;

    private String coverUrl;

    private String videoUrl;

    private String tags;

    private String industry;

    private String scenario;

    private Integer sortOrder;

    private Boolean pinned;

    private Boolean published;

    private LocalDateTime publishTime;

    private LocalDateTime updateTime;
}
