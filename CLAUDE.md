# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Car Portal** is a full-stack, multi-tenant enterprise management system with frontend-backend separation.

- **Frontend**: `car-portal-frontend/` — Vue 3 + TypeScript + Vite + Naive UI + Pinia (pnpm monorepo)
- **Backend**: `car-portal-backend/` — Java 17 + Spring Cloud + Spring Boot 3.5 + Sa-Token + MyBatis-Plus (Maven multi-module)

## Architecture

### Frontend (`car-portal-frontend/`)

**pnpm workspace monorepo** with packages in `packages/`:
- `@sa/axios` — HTTP client (Axios-based, handles token injection, RSA/AES encryption, token refresh)
- `@sa/alova` — Alternative HTTP client
- `@sa/hooks` — Reusable Vue composables (`useBoolean`, `useLoading`, `useTable`, `useRequest`)
- `@sa/materials` — UI materials (admin-layout, page-tab, simple-scrollbar)
- `@sa/utils` — Shared utilities (storage, crypto, nanoid)
- `@sa/color`, `@sa/uno-preset`, `@sa/scripts` — Theme/build utilities

**Key source structure** (`src/`):
- `router/` — Uses `@elegant-router/vue` for file-based route generation. Mode: `dynamic` (routes fetched from backend at runtime). Guard handles auth/token checking.
- `store/modules/` — Pinia stores: `app`, `auth`, `route`, `tab`, `theme`, `dict`, `notice`
- `service/api/` — API service layer organized by domain: `auth.ts`, `route.ts`, `system/`, `monitor/`, `tool/`, `demo/`
- `layouts/` — Layout system: `base-layout` (header/sidebar/footer), `blank-layout` (login/404), modular components in `modules/`
- `locales/langs/` — i18n: `zh-cn.ts`, `en-us.ts`

**Dev server**: port `9527`, preview port `9725`. Proxy to backend at `http://localhost:8080` in dev mode.

### Backend (`car-portal-backend/`)

**Spring Cloud microservices** with Nacos service discovery & config:

| Module | Description | Default Port |
|---|---|---|
| `ruoyi-gateway` | API Gateway (Spring Cloud Gateway) | 8080 |
| `ruoyi-gateway-mvc` | Alternative MVC gateway | — |
| `ruoyi-auth` | Authentication (Sa-Token, captcha, login) | 9210 |
| `ruoyi-modules/ruoyi-system` | Core system module (user, role, menu, dept, tenant, etc.) | 9201 |
| `ruoyi-modules/ruoyi-gen` | Code generation | — |
| `ruoyi-modules/ruoyi-resource` | Resource/OSS management | — |
| `ruoyi-modules/ruoyi-job` | Job scheduling (SnailJob) | — |
| `ruoyi-modules/ruoyi-workflow` | Workflow engine (Warm-Flow) | — |
| `ruoyi-api/` | Remote API interfaces (Feign/Dubbo contracts) | — |
| `ruoyi-common/` | 30+ shared common libraries | — |

**Key technologies**: Sa-Token (auth), MyBatis-Plus (ORM), Redis/Redisson (cache), Nacos (config/discovery), SpringDoc (OpenAPI).

## Common Commands

### Frontend

```bash
cd car-portal-frontend
pnpm install          # Install dependencies (required, pnpm only)
pnpm dev              # Dev server (port 9527)
pnpm dev:prod         # Dev with prod env
pnpm dev:test         # Dev with test env
pnpm build            # Production build
pnpm build:dev        # Dev build
pnpm build:test       # Test build
pnpm preview          # Preview build (port 9725)
pnpm typecheck        # TypeScript type check
pnpm lint             # ESLint + oxlint with auto-fix
pnpm gen-route        # Generate routes from file structure
pnpm commit           # Conventional commit
pnpm commit:zh        # Conventional commit (Chinese)
pnpm cleanup          # Clean node_modules, dist, caches
```

### Backend

```bash
cd car-portal-backend
mvn clean install     # Build all modules
mvn clean package     # Package (without tests)
```

Maven profiles are activated via `@profiles.active@`, `@nacos.server@` etc. in `pom.xml` — configure Nacos connection there.

## Key Patterns

- **Adding a new page**: Create a Vue component in `src/views/{module}/{page}/index.vue`. If using static routes, run `pnpm gen-route`. For dynamic routes, add menu via backend admin.
- **Adding an API**: Add function in `src/service/api/{domain}.ts`. Uses `@sa/axios` request instance with auto token injection.
- **Adding a component**: Place in `src/components/` or relevant view subdirectory. Use UnoCSS for styling (priority over custom CSS).
- **State management**: Use Pinia stores in `src/store/modules/`. Follow existing module patterns.
- **Backend service**: Add module under `ruoyi-modules/`, register with Nacos. Config via `application.yml` + Nacos remote config.

## Collaboration Protocol: Claude Code + Codex

### Roles

- **Claude Code (决策者)**: 负责需求分析、架构设计、方案决策、代码审查、质量把控。不直接执行大量编码工作。
- **Codex (执行者)**: 负责具体代码实现、调试、测试编写、重构执行。通过 `codex-plugin-cc` 插件连接。

### Workflow

#### Phase 1: 讨论阶段 (Discussion)

1. Claude Code 分析用户需求，拆解任务，形成初步方案
2. 通过 Codex 插件发起讨论，将方案发给 Codex，征求技术可行性反馈
3. Codex 从实现角度评估：技术选型、潜在陷阱、RuoYi 框架兼容性、依赖影响
4. 双方迭代讨论，直到方案收敛
5. Claude Code 最终拍板，形成明确的实施计划（任务列表、文件变更清单、验收标准）

#### Phase 2: 执行阶段 (Execution)

1. Claude Code 将实施计划通过 Codex 插件下发给 Codex
2. Codex 独立完成编码、自测、diff 输出
3. Claude Code 接收 Codex 返回的 unified diff patch
4. Claude Code 执行 Code Review：
   - 检查是否符合 RuoYi 框架规范
   - 检查是否影响现有功能
   - 检查代码质量（冗余、安全、性能）
5. 如有问题，返回修改意见给 Codex 迭代
6. 审核通过后，Claude Code 将 patch 应用到项目

### RuoYi Framework Guidelines

所有实现必须严格遵循 RuoYi 框架约定：

- **后端**: 继承 `BaseController`，使用 `@SaCheckPermission` 做权限校验，返回 `R<T>` 统一响应体，Entity 继承 `BaseEntity`，Mapper 使用 MyBatis-Plus `BaseMapper`
- **前端**: 页面布局遵循 `NCard` + `NDataTable` + 搜索栏模式，API 调用使用 `@sa/axios`，表格使用 `useTable` hook
- **权限**: 权限标识格式 `{module}:{entity}:{action}`，如 `system:user:add`
- **数据库**: 使用 MyBatis-Plus 注解，禁止手写 SQL（除非复杂查询），分页使用 `PageQuery`

### Skills Usage

- `using-superpowers`: **手动触发** — 用户通过 `/using-superpowers` 主动调用，不自动加载
- `codex:setup` / `codex:rescue`: 与 Codex 的连接和任务委派
- `brainstorming`: 创造性功能开发前的讨论阶段
- `writing-plans` / `executing-plans`: 计划编写与执行分离
- `verification-before-completion`: 交付前必须验证
- `simplify`: 代码审查阶段调用，检查复用性和效率

### Constraints

- 沙箱安全：Codex 不直接写文件系统，输出 unified diff patch
- 代码主权：Codex 产出为 Prototype，Claude Code 负责最终重构把关
- 风格：精简高效、无冗余、非必要不注释
- 影响范围：仅对需求做针对性改动，严禁影响其他功能
- 判断依据：以项目代码和官方文档为准，调用非内置库时必须联网搜索确认
