package org.dromara.portal.domain.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class HomeContentDto implements Serializable {

    private String heroTitle;

    private String heroSubtitle;

    private List<StatItemDto> stats = new ArrayList<>();

    private List<String> flowSteps = new ArrayList<>();

    private List<ServiceCenterItemDto> services = new ArrayList<>();

    private List<NewsItemDto> news = new ArrayList<>();
}
