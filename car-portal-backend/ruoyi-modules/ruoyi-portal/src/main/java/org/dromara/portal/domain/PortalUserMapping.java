package org.dromara.portal.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 门户用户映射表 portal_user_mapping
 */
@Data
@TableName("portal_user_mapping")
public class PortalUserMapping implements Serializable {

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
     * 用户ID
     */
    private Long userId;

    /**
     * 标注账号
     */
    private String annotateAccount;

    /**
     * 仿真账号
     */
    private String simulateAccount;

    /**
     * 更新人
     */
    @TableField("update_by")
    private Long updatedBy;

    /**
     * 更新时间
     */
    @TableField("update_time")
    private LocalDateTime updatedAt;

    /**
     * 删除标志（0代表存在 1代表删除）
     */
    @TableLogic
    private String delFlag;

}
