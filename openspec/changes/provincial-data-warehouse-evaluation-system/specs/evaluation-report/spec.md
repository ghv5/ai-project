## ADDED Requirements

### Requirement: View Report List
系统 SHALL 提供报告列表页面，展示所有生成的评估报告。

#### Scenario: Display report list
- **WHEN** 用户访问报告列表页
- **THEN** 系统以卡片形式展示报告列表
- **AND** 每个卡片显示报告标题、数仓名称、生成时间
- **AND** 系统提供搜索框，支持按报告/数仓名称搜索
- **AND** 系统提供生成时间范围筛选

#### Scenario: Report card actions
- **WHEN** 用户查看报告卡片
- **THEN** 系统提供"预览"、"下载"、"删除"操作按钮

### Requirement: Preview Report
系统 SHALL 提供报告预览页面，在线展示报告完整内容。

#### Scenario: Display report preview
- **WHEN** 用户访问报告预览页
- **THEN** 系统显示侧边目录导航
- **AND** 系统显示报告标题、数仓名称、评估日期、报告版本
- **AND** 系统显示执行摘要章节，包含总体评分、等级、关键发现、Top 5 改进项
- **AND** 系统显示得分雷达图
- **AND** 系统显示评估详情章节
- **AND** 系统显示问题清单表格
- **AND** 系统显示改进建议章节

#### Scenario: Download report
- **WHEN** 用户点击"下载 PDF"或"下载 Word"按钮
- **THEN** 系统下载对应格式的报告文件

#### Scenario: Print report
- **WHEN** 用户点击"打印"按钮
- **THEN** 系统调用浏览器打印功能

### Requirement: Configure Report Generation
系统 SHALL 提供报告生成配置页面，允许用户配置报告参数后生成。

#### Scenario: Display generation form
- **WHEN** 用户访问报告生成配置页
- **THEN** 系统显示评估记录下拉选择（支持多选），默认选中最近一次评估
- **AND** 系统显示报告模板单选（标准模板/详版/简版）
- **AND** 系统显示包含章节多选框（执行摘要、评估详情、问题清单、改进建议），支持全选/取消全选
- **AND** 系统显示输出格式单选（PDF/Word/同时生成）

#### Scenario: Submit generation
- **WHEN** 用户点击"生成报告"按钮
- **THEN** 系统创建报告生成任务
- **AND** 系统跳转到报告预览页，显示生成中状态

#### Scenario: Cancel generation
- **WHEN** 用户点击"取消"按钮
- **THEN** 系统返回报告列表页
