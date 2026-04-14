package org.dromara.portal.domain.dto;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;

@Data
public class NewsItemDto implements Serializable {

    private Long id;

    private String title;

    private String summary;

    private LocalDate publishDate;

    private Boolean highlight;
}
