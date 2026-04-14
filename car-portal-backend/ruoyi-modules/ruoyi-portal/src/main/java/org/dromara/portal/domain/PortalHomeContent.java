package org.dromara.portal.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;
import org.apache.ibatis.type.JdbcType;
import org.dromara.portal.domain.dto.NewsItemDto;
import org.dromara.portal.domain.dto.ServiceCenterItemDto;
import org.dromara.portal.domain.dto.StatItemDto;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 门户首页内容表 portal_home_content
 */
@Data
@TableName(value = "portal_home_content", autoResultMap = true)
public class PortalHomeContent implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id")
    private Long id;

    /**
     * 租户编号
     */
    private Long tenantId;

    /**
     * 首页主标题
     */
    private String heroTitle;

    /**
     * 首页副标题
     */
    private String heroSubtitle;

    /**
     * 流程步骤
     */
    @TableField(value = "flow_steps_json", typeHandler = JacksonTypeHandler.class, jdbcType = JdbcType.OTHER)
    private List<String> flowSteps;

    /**
     * 统计项
     */
    @TableField(value = "stats_json", typeHandler = JacksonTypeHandler.class, jdbcType = JdbcType.OTHER)
    private List<StatItemDto> stats;

    /**
     * 服务中心项
     */
    @TableField(value = "services_json", typeHandler = JacksonTypeHandler.class, jdbcType = JdbcType.OTHER)
    private List<ServiceCenterItemDto> services;

    /**
     * 新闻项
     */
    @TableField(value = "news_json", typeHandler = JacksonTypeHandler.class, jdbcType = JdbcType.OTHER)
    private List<NewsItemDto> news;

    /**
     * 版本号
     */
    private Integer version;

    /**
     * 更新人
     */
    private Long updateBy;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 删除标志（0代表存在 1代表删除）
     */
    @TableLogic
    private String delFlag;

}
