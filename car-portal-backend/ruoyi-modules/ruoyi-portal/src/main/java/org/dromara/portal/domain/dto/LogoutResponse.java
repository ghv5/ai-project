package org.dromara.portal.domain.dto;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class LogoutResponse implements Serializable {

    private Boolean localLogout;

    @Builder.Default
    private List<String> successPlatforms = new ArrayList<>();

    @Builder.Default
    private List<String> failedPlatforms = new ArrayList<>();
}
