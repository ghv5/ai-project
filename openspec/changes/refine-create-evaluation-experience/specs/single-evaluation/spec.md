## MODIFIED Requirements

### Requirement: Create New Evaluation
系统 SHALL 提供“立即评估”页面，支持规则集配置、规则权重编辑与评估触发。

#### Scenario: Display page structure
- **WHEN** 用户访问 `/evaluations/new`
- **THEN** 页面顶部显示得分球和“立即评估”按钮
- **AND** 页面显示锚点导航（得分球、规则集、规则列表、得分等级）
- **AND** 页面显示得分等级划分说明

#### Scenario: Display rule set cards
- **WHEN** 页面加载完成
- **THEN** 系统以卡片方式展示四个规则集
- **AND** 四个规则集分别为：数据工程实施指南、数据安全、数据质量、数据治理方法论

#### Scenario: Cascade rule list by selected rule set
- **WHEN** 页面首次加载
- **THEN** 默认选中第一个规则集并显示其规则列表
- **WHEN** 用户切换规则集
- **THEN** 规则列表级联更新为该规则集下规则
- **AND** 系统保留各规则集下用户已编辑的规则权重与删除状态

#### Scenario: Rule table editability
- **WHEN** 用户查看规则列表
- **THEN** 规则名称字段为只读
- **AND** 所属维度字段为只读
- **AND** 分值权重字段可编辑
- **AND** 操作列支持删除规则

#### Scenario: Validate weight sum before evaluation
- **WHEN** 用户点击“立即评估”按钮且当前规则集权重总和不等于 100
- **THEN** 系统阻止创建评估记录
- **AND** 系统提示“分值权重总和必须为100”

#### Scenario: Enforce minimum rule count
- **WHEN** 当前规则集仅剩 1 条规则时用户继续点击删除
- **THEN** 系统阻止删除
- **AND** 系统提示“至少保留1条规则”

#### Scenario: Create evaluation and navigate
- **WHEN** 用户点击“立即评估”按钮且当前规则集满足校验条件
- **THEN** 系统创建评估记录
- **AND** 系统跳转到新建评估记录对应的详情页面
