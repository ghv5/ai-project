package org.dromara.portal.domain.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class StatItemDto implements Serializable {

    private String label;

    private String value;
}
