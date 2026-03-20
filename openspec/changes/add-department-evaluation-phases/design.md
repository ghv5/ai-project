## Context

### Current Local State (Verified From Code)

- 当前存在部门概念，但其来源主要依附于数仓结构和内置部门清单：
  - `src/js/api.js`: `warehouses` 嵌套 `departments`；另有 `API.departments`
- 当前评估记录数据结构：
  - `src/js/api.js`: `evaluations[]` 含 `dimensionScores`、`issues`，无阶段得分字段
- 当前页面路由/侧边栏存在“数仓列表”入口（需更名为“数据工程”）：
  - `src/js/app.js`

### Target Architecture

新增架构要求：

```
Department
  ├─ Phase[1] (ordered)
  ├─ Phase[2]
  └─ Phase[N]

Evaluation (per warehouse, in a department context)
  ├─ PhaseScore[1] : 0..100
  ├─ PhaseScore[2] : 0..100
  └─ PhaseScore[N] : 0..100
```

每个阶段满分固定 100，阶段之间存在顺序。

### Confirmed Decisions (2026-03-19)

- 阶段得分为评估时产生的结果数据（不是阶段模板的静态属性）
- 数仓所属部门以“部门清单”为准（seed 内置 + 支持在“新建部门”新增，并全局同步）
- 阶段支持两种得分方式：
  - 手工录入阶段得分（0..100）
  - 规则计算阶段得分：阶段绑定多个规则，阶段得分为这些规则得分的平均值（0..100）
- 规则计算的具体规则体系尚未完全确定，但“阶段绑定规则 + 规则得分均值”作为当前计算口径已确定
- 阶段绑定规则使用独立规则库（不复用现有 `API.rules` 维度规则集规则）
- `rules_avg` 模式下，规则得分先采用手工录入（自动计算规则得分暂不确定）
- 整体架构为：部门 -> N 个阶段（有序）；阶段 -> N 个规则（绑定关系）
- 维度规则集仍只保留分数展示；阶段与部门具备分数和等级
- 部门阶段编排与规则配置入口放在“部门配置（阶段+规则）”页面（新建部门仅基本信息）
- 评估入口约束：部门未配置阶段时不可评估，也不会生成评估报告
- 独立规则库当前仅做“内置 + 绑定使用”，规则维护页不在本 change 范围内

## Hard Constraints

- 阶段必须可排序（同一部门内有唯一顺序）
- 评估结果必须能表达每个阶段的得分（0-100），并且不依赖维度规则集得分存在与否
- 必须提供“评估阶段列表”页面，可新增阶段
- 新建阶段时必须支持配置常规表单组件（至少：输入框、下拉框、附件）
- 部门阶段配置必须支持绑定多个规则，并支持基于规则得分均值生成阶段得分
- 左侧菜单“数仓列表”必须改名为“数据工程”
- 部门未配置阶段时不允许开始评估，且不产生评估报告

## Soft Constraints

- 保持现有亮色后台风格与左侧固定菜单结构
- 动态表单以“schema 驱动”的最小实现为目标，避免引入过重的表单引擎
- 附件组件在 mock 阶段可以只做“选择文件并显示文件名”，不要求真实上传存储

## Proposed Domain Model (Front-End Mock)

### PhaseTemplate

- `id: string`
- `name: string`
- `description: string`
- `formSchema: PhaseFormSchema`
- `scoringMode: 'manual' | 'rules_avg'`

### Rule (Phase Rule Library)

- `id: string`
- `name: string`
- `description: string`

### PhaseFormSchema

- `fields: PhaseField[]`

### PhaseField (minimum set)

- `id: string`
- `type: 'text' | 'select' | 'attachment'`
- `label: string`
- `required: boolean`
- `options?: { label: string, value: string }[]` (for select)

### DepartmentPhasePlan

- `departmentId: string`
- `phases: { phaseId: string, order: number, ruleBindings?: { ruleId: string }[] }[]`

说明：该编排在“新增部门”页面配置并保存。

规则绑定的存储层级（已确认）：
- 规则绑定不存于阶段模板；存于“部门配置（阶段+规则）”中的部门阶段配置
- 当阶段模板 `scoringMode='rules_avg'` 时，对应的部门阶段配置应提供 2+ 条 `ruleBindings`

### Department Score/Grade (Derived)

- `departmentScore: number` in `0..100`
- `departmentGrade: string` (等级阈值待复用现有 `gradeLevels` 或独立定义)

已确认口径（2026-03-19）：
- `departmentScore = average(phaseScore[])`
- `departmentGrade = gradeLevels(departmentScore)` (复用现有 `gradeLevels`)

### Evaluation Extension

在评估记录上新增：

- `phaseScores: { phaseId: string, score: number, scoringMode: 'manual' | 'rules_avg' }[]` where `0 <= score <= 100`
- `phaseRuleScores?: { phaseId: string, ruleId: string, score: number }[]` where `0 <= score <= 100` (for computed scoring input)

可选（若评估流程要保存表单数据）：

- `phaseSubmissions: { phaseId: string, data: Record<string, unknown> }[]`

## Page Boundaries

### Boundary A: Phase Template Management

新增页面：
- 阶段列表页：展示阶段模板（名称、描述、配置字段概览）
- 新建阶段页：编辑阶段基本信息，并配置表单字段（添加/删除/排序字段）

### Boundary B: Department -> Phase Ordering

需要一个地方维护“部门阶段编排”：
- 已确认：在“新建部门”与“部门配置（阶段+规则）”拆分完成
  - “新建部门”：仅基本信息（含 code/owner）
  - “部门配置（阶段+规则）”：为指定部门选择阶段并排序，并配置每个阶段绑定的规则

### Boundary C: Evaluation Integration

评估详情页需要展示：
- 当前数仓所属部门对应的阶段列表（按顺序）
- 每阶段得分（0-100）

评估过程需要能写入阶段得分（来源待确认：手动输入 or 计算）。

已确认：
- 若阶段采用 `manual`：阶段得分由用户手工输入并保存
- 若阶段采用 `rules_avg`：阶段得分按“绑定规则得分均值”计算并保存

规则得分采集当前确认的最小实现：
- `rules_avg` 下规则得分先手工录入，再由均值计算阶段得分

## Risks

| Risk | Why it matters | Mitigation |
|------|----------------|------------|
| 阶段“得分”语义不清 | 阶段模板是否含默认得分 vs 评估结果得分 | Plan 前锁定数据口径 |
| 部门阶段配置入口不清 | 需要可操作 UI 才能满足“部门下有多个阶段” | 单独加“部门阶段编排”页或在阶段页中配置 |
| 动态表单复杂度 | 附件、下拉选项、字段排序都会引入状态管理 | 先做最小字段集与最小交互 |
| 与现有维度评估并存 | 阶段得分与维度得分如何汇总/展示 | 明确“并列展示”或“阶段主导” |

## Open Questions

- 无（本 change 范围内已完成口径锁定）

## Success Criteria

- 能为一个部门配置多个阶段并设置顺序
- 能新增阶段模板并配置至少三类字段：输入框、下拉框、附件
- 评估记录可保存并展示每阶段得分（0-100）
- 部门总分按阶段得分均值汇总，并按现有 `gradeLevels` 展示部门等级
- 左侧菜单“数仓列表”文案变为“数据工程”
