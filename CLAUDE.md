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
