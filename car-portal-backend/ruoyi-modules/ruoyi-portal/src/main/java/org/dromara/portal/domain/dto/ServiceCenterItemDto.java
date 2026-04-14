package org.dromara.portal.domain.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class ServiceCenterItemDto implements Serializable {

    private String category;

    private String title;

    private String description;

    private List<String> partnerNames = new ArrayList<>();
}
