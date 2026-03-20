# Proposal: 阶段规则管理

## Why

当前系统的层级结构为「部门 → 阶段 → 规则」，部门管理与阶段模板管理均已完成并投入使用。但阶段规则（`phaseRules`）仍以硬编码数组形式存在于 `/Users/topmian/Documents/gehui/ai-project/src/js/api.js` 第 321–330 行，共 8 条固定记录，无法动态增删改查。

这导致两个问题：
1. **运维受阻**：新增、修改、禁用规则必须修改源码，无法通过界面操作。
2. **引擎对接无入口**：后续规划的规则引擎需要一个前端管理界面来配置规则元数据，当前缺少此入口。

## What Changes

在现有前端 mock 架构中新增一个**阶段规则列表页**，提供规则的完整 CRUD 能力，同时为未来规则引擎对接预留灵活的数据模型。

变更范围严格限定：
- **新增**：规则列表页面（路由、渲染、交互）
- **新增**：规则 CRUD 的 mock API 方法（`api.js`）
- **新增**：侧边栏导航菜单项（"阶段列表"下方）
- **不改动**：部门列表页、部门配置页（含规则绑定 checkbox）、阶段模板页、评估页、报告页、仪表盘

## New Capabilities

### C1: 规则列表展示
用户可在独立页面查看所有阶段规则，支持按分类筛选。每条规则展示名称、描述、分类标签、启用状态。

### C2: 创建规则
用户通过 drawer 面板填写规则基本信息（名称、描述、分类、启用状态），保存后立即出现在列表中，并可在部门配置页的规则绑定 checkbox 中被选择。

### C3: 编辑规则
用户可修改已有规则的名称、描述、分类、启用状态。编辑后所有引用该规则的部门阶段计划自动反映新名称/描述（因为绑定关系通过 `ruleId` 引用）。

### C4: 删除规则
用户可删除未被任何部门阶段计划绑定的规则。若规则已被绑定，阻止删除并提示具体绑定位置。

### C5: 规则启用/禁用
用户可快速切换规则的启用状态，禁用的规则在部门配置页的绑定 checkbox 列表中不显示（或显示为灰色不可勾选），但不影响已有绑定关系的历史数据。

## Modified Capabilities

### M1: 侧边栏导航
在现有侧边栏菜单中，"阶段列表"菜单项下方新增"规则列表"菜单项，图标使用 `fa-solid fa-scale-balanced`。

### M2: 部门配置页规则绑定区域（最小化改动）
部门配置页（`/Users/topmian/Documents/gehui/ai-project/src/js/app.js` 第 1228–1239 行）中的规则 checkbox 列表数据源从 `API.getPhaseRules()` 获取，该方法已存在（第 940–942 行），本次仅确保新增/删除规则后此列表同步更新，无需修改渲染逻辑。

## Impact

| 影响项 | 文件 | 改动类型 |
|--------|------|----------|
| 规则 CRUD API | `src/js/api.js` | 新增方法：createPhaseRule, updatePhaseRule, deletePhaseRule |
| 规则列表页渲染 | `src/js/app.js` | 新增方法：renderPhaseRuleList, openRulePanel, submitRule, deleteRule 等 |
| 路由注册 | `src/js/app.js` registerRoutes() | 新增路由：`/rules` |
| 侧边栏菜单 | `src/js/app.js` renderWithLayout() | 新增菜单项 |
| 规则数据模型 | `src/js/api.js` phaseRules | 扩展字段：category, enabled |
| 样式 | `src/css/style.css` | 复用现有 card/drawer/table 样式，无新增或极少量新增 |

## Out of Scope

- 规则引擎逻辑实现（条件-动作表达式解析、自动评分计算）
- 规则权重/阈值/严重级别字段（当前模型仅保留基础字段 + 分类 + 启用状态）
- 部门配置页规则绑定交互的重新设计
- 维度规则（`ruleSets` / `rules`）的管理
- 评估评分逻辑的修改
- 后端 API 对接
