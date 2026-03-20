## Task 1: 数据层 — 规则模型扩展与 CRUD API

- [ ] 1.1 扩展 `phaseRules` 数据结构：为现有 8 条记录补充 `category` 和 `enabled` 字段
- [ ] 1.2 新增 `createPhaseRule(data)` 方法：校验名称非空，生成 `pr_` 前缀 ID，push 到 `phaseRules`
- [ ] 1.3 新增 `updatePhaseRule(ruleId, data)` 方法：查找并合并更新字段
- [ ] 1.4 新增 `deletePhaseRule(ruleId)` 方法：检查 `departmentPhasePlans` 绑定关系，有引用则阻止并返回绑定位置

## Task 2: 路由与导航

- [ ] 2.1 在 `registerRoutes()` 中注册 `/rules` 路由，指向 `renderPhaseRuleList()`
- [ ] 2.2 在 `renderWithLayout()` 侧边栏"阶段列表"下方新增"规则列表"菜单项（`fa-scale-balanced`，activeMenu: `rule-list`）

## Task 3: 规则列表页渲染

- [ ] 3.1 实现 `renderPhaseRuleList()` 方法：hero 区 + 分类 tab 筛选 + 卡片网格
- [ ] 3.2 分类 tab 逻辑：从 `phaseRules` 动态聚合 category 值，加上"全部"选项，点击切换过滤
- [ ] 3.3 卡片内容：规则名称、描述、分类 badge、启用状态 badge、编辑/删除按钮

## Task 4: 规则创建/编辑 Drawer 面板

- [ ] 4.1 实现 `openRulePanel()` / `openRuleEditPanel(ruleId)` / `closeRulePanel()`
- [ ] 4.2 实现 `renderRulePanel()`：drawer 面板含名称输入、分类下拉、描述输入、启用 checkbox
- [ ] 4.3 分类下拉：预设 4 个默认分类 + 动态聚合已有分类 + "自定义"选项（触发 input 输入）
- [ ] 4.4 实现 `submitRule()`：读取表单值，调用 create/update API，关闭面板并刷新列表

## Task 5: 规则删除

- [ ] 5.1 实现 `deletePhaseRule(ruleId)` 交互：confirm 确认 → 调用 API → 成功则刷新，失败则 alert 提示绑定位置

## Task 6: 部门配置页最小化适配

- [ ] 6.1 修改 `renderDepartmentConfig()` 第 1231 行规则遍历：禁用且未绑定的规则不渲染，禁用但已绑定的规则灰显不可操作

## Verification

### Acceptance Checklist (Manual)

- 规则列表页：展示全部规则，分类 tab 切换正确过滤
- 创建规则：填写名称 + 分类 + 描述 + 启用状态，保存后卡片出现在列表
- 编辑规则：修改字段后保存，列表和部门配置页同步展示新内容
- 删除保护：尝试删除已被部门阶段绑定的规则，弹出阻止提示并说明绑定的部门和阶段
- 删除成功：未被绑定的规则可正常删除
- 部门配置页联动：新建的启用规则在 checkbox 列表出现；禁用的未绑定规则不出现；禁用的已绑定规则灰显
- 侧边栏：规则列表菜单项正确高亮
- 回归验证：部门列表、阶段模板、评估、报告、仪表盘页面行为无变化
