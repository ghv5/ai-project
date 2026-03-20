## ADDED Requirements

### Requirement: Display Provincial Dashboard
系统 SHALL 提供省级评估大屏页面，实时展示全省数据仓库评估情况。

#### Scenario: Display dashboard header
- **WHEN** 用户访问省级大屏
- **THEN** 系统显示标题"省级数据仓库评估中心"
- **AND** 系统显示当前时间和数据更新时间

#### Scenario: Display top metric cards
- **WHEN** 用户访问省级大屏
- **THEN** 系统在顶部显示总体指标卡片：部门数、数仓数、已评估覆盖率、平均得分、优秀率、待改进数、报告覆盖率
- **AND** 待改进数按最新一次评估中等级为 C/D 的数仓统计
- **AND** 已评估覆盖率 = 已有最新评估结果的数仓数 / 数仓总数
- **AND** 报告覆盖率 = 已生成报告的评估数 / 已完成评估总数
- **AND** 所有指标数据实时更新

#### Scenario: Display top warehouse ranking
- **WHEN** 用户访问省级大屏
- **THEN** 系统在第二行左侧显示优秀数仓 Top 5
- **AND** 排行依据数仓最新一次评估得分
- **AND** 列表数据实时更新

#### Scenario: Display score distribution chart
- **WHEN** 用户访问省级大屏
- **THEN** 系统在第二行中部显示数仓得分分布图
- **AND** 分布图按最新一次评估得分分箱展示
- **AND** 分布图数据实时更新

#### Scenario: Display grade pie chart
- **WHEN** 用户访问省级大屏
- **THEN** 系统在第二行右侧显示数仓等级分布饼图
- **AND** 饼图按最新一次评估等级 A/B/C/D 聚合
- **AND** 饼图数据实时更新

#### Scenario: Display rule dimension radar chart
- **WHEN** 用户访问省级大屏
- **THEN** 系统在第三行左侧显示规则集维度雷达图
- **AND** 雷达图聚合展示数据工程、数据治理、数据质量、数据安全等维度平均得分
- **AND** 雷达图数据实时更新

#### Scenario: Display top referenced rules
- **WHEN** 用户访问省级大屏
- **THEN** 系统在第三行中部显示规则引用数 Top 5
- **AND** 规则引用数按最新一次评估问题清单中的规则命中次数统计
- **AND** 列表数据实时更新

#### Scenario: Display high priority issues
- **WHEN** 用户访问省级大屏
- **THEN** 系统在第三行右侧显示高频问题清单
- **AND** 列表显示问题名称、频次、涉及部门、责任部门
- **AND** 列表数据实时更新

### Requirement: Dashboard Controls
系统 SHALL 提供大屏悬浮控制功能。

#### Scenario: Auto-refresh control
- **WHEN** 用户操作自动刷新开关
- **THEN** 系统开启/关闭自动刷新
- **AND** 用户可选择刷新间隔（5s/10s/30s）

#### Scenario: Theme toggle
- **WHEN** 用户点击主题切换按钮
- **THEN** 系统在白天/黑夜主题间切换
