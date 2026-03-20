## ADDED Requirements

### Requirement: View Evaluation List
系统 SHALL 提供评估记录列表页面，展示所有历史评估记录。

#### Scenario: Display evaluation list with filters
- **WHEN** 用户访问评估列表页
- **THEN** 系统显示评估记录表格，包含数仓名称、评估时间、状态、得分列
- **AND** 系统提供搜索框，支持按数仓名称模糊搜索
- **AND** 系统提供评估状态筛选（全部/进行中/已完成/失败）
- **AND** 系统提供时间范围筛选

#### Scenario: Navigate to create evaluation
- **WHEN** 用户点击"新建评估"按钮
- **THEN** 系统跳转到新建评估页面

#### Scenario: Navigate to evaluation detail
- **WHEN** 用户点击某条评估记录的"查看详情"操作
- **THEN** 系统跳转到该评估的详情页

### Requirement: Create New Evaluation
系统 SHALL 提供新建评估页面，允许用户选择数仓和规则并启动评估。

#### Scenario: Display create evaluation form
- **WHEN** 用户访问新建评估页
- **THEN** 系统显示表单，包含数仓下拉选择（预配置列表）
- **AND** 系统显示评估规则集下拉选择，默认选中"完整规则集"
- **AND** 系统显示评估维度多选框，默认全选
- **AND** 系统显示可选的数据时间范围选择

#### Scenario: Submit evaluation successfully
- **WHEN** 用户选择数仓并点击"启动评估"按钮
- **THEN** 系统创建评估任务
- **AND** 系统跳转到评估详情页，显示评估进行中状态

#### Scenario: Cancel create evaluation
- **WHEN** 用户点击"取消"按钮
- **THEN** 系统返回评估列表页

### Requirement: View Evaluation Detail
系统 SHALL 提供评估详情页面，展示单个评估的完整结果。

#### Scenario: Display evaluation overview
- **WHEN** 用户访问评估详情页
- **THEN** 系统显示数仓名称、评估时间、评估状态
- **AND** 系统显示总得分（0-100）和评估等级（A/B/C/D）
- **AND** 如评估进行中，显示进度条

#### Scenario: Display dimension scores
- **WHEN** 用户查看评估详情
- **THEN** 系统通过 Tab 切换展示各评估维度（数据工程、数据治理等）
- **AND** 每个维度显示子维度列表及对应得分
- **AND** 每个子维度显示状态（正常/警告/问题）

#### Scenario: Display issue list
- **WHEN** 用户查看问题清单
- **THEN** 系统显示问题列表，包含规则名称、严重程度（高/中/低）、问题描述、改进建议
- **AND** 系统提供按严重程度和维度筛选功能

#### Scenario: Generate report from evaluation
- **WHEN** 用户点击"生成报告"按钮
- **THEN** 系统跳转到报告生成配置页，预填充当前评估记录

#### Scenario: Re-evaluate
- **WHEN** 用户点击"重新评估"按钮
- **THEN** 系统跳转到新建评估页，预填充当前数仓

#### Scenario: Export evaluation result
- **WHEN** 用户点击"导出结果"按钮
- **THEN** 系统提供 JSON/Excel 格式下载
