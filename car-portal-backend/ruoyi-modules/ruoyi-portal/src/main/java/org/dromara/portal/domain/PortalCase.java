package org.dromara.portal.domain;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 门户案例表 portal_case
 */
@Data
@TableName("portal_case")
public class PortalCase implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "case_id")
    private Long caseId;

    /**
     * 租户编号
     */
    private Long tenantId;

    /**
     * 标题
     */
    private String title;

    /**
     * 描述
     */
    private String description;

    /**
     * 封面地址
     */
    private String coverUrl;

    /**
     * 视频地址
     */
    private String videoUrl;

    /**
     * 标签
     */
    private String tags;

    /**
     * 行业
     */
    private String industry;

    /**
     * 场景
     */
    private String scenario;

    /**
     * 排序值
     */
    private Integer sortOrder;

    /**
     * 是否发布
     */
    private Boolean published;

    /**
     * 是否置顶
     */
    private Boolean pinned;

    /**
     * 发布时间
     */
    private LocalDateTime publishTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 创建人
     */
    private String createBy;

    /**
     * 更新人
     */
    private String updateBy;

    /**
     * 删除标志（0代表存在 1代表删除）
     */
    @TableLogic
    private Integer delFlag;

}
