## Context

### Current Local State (Verified From Code)

- 阶段规则以硬编码数组存在，共 8 条固定记录，无 CRUD 方法：
  - `src/js/api.js` 第 321–330 行：`phaseRules: [{ id, name, description }, ...]`
  - `src/js/api.js` 第 940–942 行：`getPhaseRules()` 仅返回静态数组
- 规则绑定关系存储在 `departmentPhasePlans` 中，通过 `ruleBindings: [{ ruleId }]` 引用规则 ID：
  - `src/js/api.js` 第 332–348 行
- 部门配置页通过 checkbox 列表展示规则并允许绑定/解绑：
  - `src/js/app.js` 第 1228–1239 行：遍历 `rules`（来自 `API.getPhaseRules()`）渲染 checkbox
  - `src/js/app.js` 第 1285–1294 行：`toggleDepartmentPhaseRule()` 操作绑定关系
- 评估详情页在 `rules_avg` 模式下展示规则评分输入：
  - `src/js/app.js` 第 1689–1707 行：通过 `phaseRules` 查找规则名称和描述
- 侧边栏菜单在 `src/js/app.js` 第 32–56 行，"阶段列表"在第 41–43 行
- 路由注册在 `src/js/app.js` 第 9–23 行
- 现有规则数据模型仅含 `{ id, name, description }`，无分类、无启用状态

### Confirmed Decisions (2026-03-20)

- 本次需求目标为 `phaseRules`（阶段规则），不涉及 `ruleSets/rules`（维度规则）
- 规则数据模型在现有基础上扩展 `category`（分类）和 `enabled`（启用状态）两个字段
- 规则绑定关系保持在部门配置页通过 checkbox 操作，本次不改动绑定逻辑
- 侧边栏新增"规则列表"菜单项，位于"阶段列表"下方
- 前端 mock 阶段仅实现基础 CRUD，不实现规则引擎条件-动作表达式
- 改动范围严格限定：不修改部门、阶段、评估、报告、仪表盘页面的现有逻辑

## Goals / Non-Goals

### Goals

- 为阶段规则提供独立的管理页面，支持完整 CRUD
- 规则数据模型预留分类和启用状态，为后续规则引擎对接提供结构基础
- 复用现有 UI 模式（卡片列表 + drawer 面板），保持视觉一致性
- 删除保护：被部门阶段计划绑定的规则不可删除

### Non-Goals

- 不实现规则引擎逻辑（条件解析、自动评分）
- 不修改部门配置页的规则绑定交互
- 不修改评估评分流程
- 不引入规则权重、阈值、严重级别字段
- 不对接后端 API

## Hard Constraints

- 新增规则必须立即出现在部门配置页的 checkbox 列表中（数据源一致性）
- 已被 `departmentPhasePlans` 中任意部门阶段绑定的规则不可删除，需提示绑定位置
- 禁用的规则在部门配置页的 checkbox 列表中标记为灰色不可勾选，但不影响已有绑定
- 规则 ID 生成使用 `pr_` 前缀 + 时间戳，与现有 `pr_01`~`pr_08` ID 格式保持一致
- 路由 `/rules` 不得与现有路由冲突（已验证无冲突）
- 规则名称不可为空，保存前必须校验

## Soft Constraints

- 保持现有亮色后台风格与左侧固定菜单布局
- 优先复用现有 CSS class（`report-grid`, `report-card`, `data-source-drawer` 等）
- 规则列表页使用与阶段列表页相同的布局模式（hero + 卡片网格 + drawer 面板）
- 分类筛选使用与评估列表页相同的 tab 切换模式

## Proposed Domain Model (Front-End Mock)

### PhaseRule (Extended)

```
id: string              // 'pr_' prefix + timestamp
name: string            // required, non-empty
description: string     // optional
category: string        // e.g. '交付质量', '过程管控', '安全合规', '技术实施'
enabled: boolean        // true = active, false = disabled
```

现有 8 条规则数据需迁移，补充 `category` 和 `enabled` 字段：

| id | name | category (补充) |
|----|------|----------------|
| pr_01 | 阶段交付物完整性 | 交付质量 |
| pr_02 | 过程合规性 | 过程管控 |
| pr_03 | 数据建模规范性 | 技术实施 |
| pr_04 | ETL链路稳定性 | 技术实施 |
| pr_05 | 质量校验覆盖率 | 交付质量 |
| pr_06 | 安全策略落实 | 安全合规 |
| pr_07 | 演示可用性 | 交付质量 |
| pr_08 | 问题整改闭环 | 过程管控 |

默认分类集合：`['交付质量', '过程管控', '安全合规', '技术实施']`，可通过创建规则时输入新分类自动扩展。

### 与现有模型关系（不变）

```
DepartmentPhasePlan.phases[].ruleBindings[].ruleId  →  PhaseRule.id
```

部门配置页读取 `API.getPhaseRules()` 获取可绑定规则列表，该方法已存在且返回完整列表。本次仅需确保 CRUD 后该列表同步更新。

## Page Boundary: 规则列表页

### 路由

`/rules` → `App.renderPhaseRuleList()`

### 信息架构

```
┌─────────────────────────────────────────────────┐
│  Page Hero (背景图 + 标题 + 标签)                │
├─────────────────────────────────────────────────┤
│  Page Header                                     │
│  ┌──────────────┐                 ┌───────────┐  │
│  │ 阶段规则管理  │                 │ 新建规则   │  │
│  └──────────────┘                 └───────────┘  │
├─────────────────────────────────────────────────┤
│  Category Tabs                                   │
│  [全部] [交付质量] [过程管控] [安全合规] [技术实施]│
├─────────────────────────────────────────────────┤
│  Card Grid (report-grid)                         │
│  ┌──────────────┐  ┌──────────────┐              │
│  │ icon         │  │ icon         │              │
│  │ 规则名称     │  │ 规则名称     │              │
│  │ 描述         │  │ 描述         │              │
│  │ [分类] [状态] │  │ [分类] [状态] │              │
│  │ [编辑] [删除] │  │ [编辑] [删除] │              │
│  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────┘
```

### Drawer 面板（创建/编辑）

```
┌─────────────────────────────────────┐
│  新建规则 / 编辑规则          [关闭] │
│  配置规则基本信息                    │
├─────────────────────────────────────┤
│  基本信息                            │
│  ┌───────────┐  ┌───────────┐       │
│  │ 规则名称*  │  │ 分类       │       │
│  └───────────┘  └───────────┘       │
│  ┌──────────────────────────┐       │
│  │ 描述                      │       │
│  └──────────────────────────┘       │
│  ┌──────────┐                       │
│  │ □ 启用    │                       │
│  └──────────┘                       │
├─────────────────────────────────────┤
│            [取消]  [保存规则]         │
└─────────────────────────────────────┘
```

分类字段使用 `<select>` 下拉框，选项从现有规则的 category 值动态聚合 + 预设默认分类，另提供一个"自定义"选项弹出 input 输入。

## API Design (Mock Layer)

在 `src/js/api.js` 中新增以下方法：

### createPhaseRule(data)

```
Input:  { name: string, description?: string, category?: string, enabled?: boolean }
Output: { success: boolean, id?: string, message?: string }
Logic:
  - name 为空 → return { success: false, message: '规则名称不能为空' }
  - 生成 id: 'pr_' + Date.now()
  - category 默认 '交付质量'
  - enabled 默认 true
  - push 到 this.phaseRules
```

### updatePhaseRule(ruleId, data)

```
Input:  ruleId: string, { name?: string, description?: string, category?: string, enabled?: boolean }
Output: { success: boolean, message?: string }
Logic:
  - 找不到 ruleId → return { success: false, message: '规则不存在' }
  - name 为空字符串 → return { success: false, message: '规则名称不能为空' }
  - 合并更新字段
```

### deletePhaseRule(ruleId)

```
Input:  ruleId: string
Output: { success: boolean, message?: string }
Logic:
  - 检查 this.departmentPhasePlans 中是否有任意部门阶段的 ruleBindings 引用该 ruleId
  - 如有引用 → return { success: false, message: '该规则已被部门 [X] 的阶段 [Y] 绑定，请先解绑再删除' }
  - 无引用 → 从 this.phaseRules 中移除
```

### getPhaseRules() (已存在，无需修改)

```
现有实现：return this.phaseRules;
本次确保 CRUD 操作直接修改 this.phaseRules 数组，该方法自动返回最新数据。
```

## Sidebar Modification

在 `src/js/app.js` 的 `renderWithLayout()` 方法中，"阶段列表"菜单项（第 41–43 行）之后插入：

```html
<div class="menu-item ${activeMenu === 'rule-list' ? 'active' : ''}" onclick="Router.navigate('/rules')">
    <i class="menu-item-icon fa-solid fa-scale-balanced" aria-hidden="true"></i>
    <span>规则列表</span>
</div>
```

## Interaction with Department Config Page

### 当前行为（不改动）

部门配置页 `renderDepartmentConfig()` 第 1163 行调用 `API.getPhaseRules()` 获取规则列表，第 1231–1236 行遍历渲染 checkbox。

### 新增行为的自然传导

- 创建规则后 → `this.phaseRules` 数组更新 → 部门配置页重新渲染时自动展示新规则
- 删除规则后 → `this.phaseRules` 数组更新 → 部门配置页重新渲染时新规则消失
- 禁用规则后 → 部门配置页 checkbox 渲染时需对 `enabled === false` 的规则做特殊处理

### 禁用规则在部门配置页的展示

部门配置页第 1231 行的规则遍历逻辑需做**最小化改动**：

```
现有：(rules || []).map(r => `<label>...`)
改为：(rules || []).map(r => {
    const disabled = r.enabled === false;
    const alreadyBound = bound.has(r.id);
    // 已绑定的禁用规则仍显示（不可操作）；未绑定的禁用规则不显示
    if (disabled && !alreadyBound) return '';
    return `<label style="${disabled ? 'opacity:0.45; pointer-events:none;' : ''}">...`;
})
```

这是**唯一一处**对现有页面的修改，且仅影响 checkbox 的可见性/可操作性，不改变绑定逻辑本身。

## Risks

| Risk | Why it matters | Mitigation |
|------|----------------|------------|
| 规则删除后评估历史数据引用断裂 | 已完成的评估中 `phaseRuleScores` 仍引用已删除的 ruleId | 删除保护已覆盖（被绑定不可删除），且历史 ruleId 仅用于分数展示不影响计算 |
| 分类标签失控 | 用户可自定义分类导致分类膨胀 | 预设 4 个默认分类，自定义输入仅在"其他"选项下开放 |
| 禁用规则与已有绑定冲突 | 禁用规则但部门配置页已绑定该规则 | 已绑定的禁用规则保留展示但不可操作，不自动解绑 |

## Open Questions

无。本 change 范围内所有口径已锁定。

## Success Criteria

- 规则列表页可展示所有阶段规则，按分类 tab 筛选
- 可通过 drawer 面板创建新规则（名称、描述、分类、启用状态）
- 可编辑已有规则的所有字段
- 被部门阶段绑定的规则删除时，弹出阻止提示并说明绑定位置
- 未被绑定的规则可正常删除
- 新建的规则在部门配置页的 checkbox 列表中立即可见
- 禁用的规则在部门配置页中不可被新绑定（已绑定的保持但灰显）
- 侧边栏"规则列表"菜单项正确高亮
- 现有 8 条规则数据完整保留，补充 category 和 enabled 字段
- 部门列表页、阶段模板页、评估页、报告页、仪表盘页行为无变化
