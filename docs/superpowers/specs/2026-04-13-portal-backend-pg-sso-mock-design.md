# Portal Backend PG Persistence And Mock SSO Design

## 1. Scope

Design a backend-focused joint-debug solution for `car-portal-public` + `ruoyi-portal` with these constraints:

- Replace Redis-based business storage in `ruoyi-portal` with PostgreSQL persistence.
- Keep Redis only for short-lived SSO/session and framework permission/session cache behavior.
- Use an independent Node.js + Express mock service to simulate third-party platform SSO callbacks.
- Complete local startup and end-to-end joint debugging for home/cases/admin edit/SSO/logout flows.

## 2. Goals

- Persist portal home content, case library data, and user-platform mapping in PostgreSQL.
- Keep existing public/admin API paths stable for frontend integration.
- Support full SSO mock flow: ticket create -> exchange -> logout callback.
- Provide a deterministic local startup order and validation checklist.

## 3. Non-Goals

- No production-grade third-party platform integration in this iteration.
- No new microservice split for portal content vs SSO.
- No immediate deep normalization for all home-page JSON sections.

## 4. Architecture

### 4.1 Service Boundaries

- `car-portal-public`: frontend, calls gateway only (`/portal/**`, `/auth/**`).
- `ruoyi-gateway`: unified entry routing.
- `ruoyi-portal`: single business backend for portal home/cases/user mapping + SSO ticket/session logic.
- `portal-mock-sso` (new, Node.js + Express): independent mock third-party callback service.

### 4.2 Storage Responsibility

- PostgreSQL (`ry_cloud`) is the source of truth for portal business data.
- Redis stores only temporary SSO state (`ticket`, short-lived session tokens) and existing framework caches.

## 5. Data Model (PostgreSQL)

All portal business tables use `portal_` prefix.

### 5.1 `portal_home_content`

Purpose: operational home-page content.

Suggested columns:

- `id` bigint primary key
- `hero_title` varchar
- `hero_subtitle` varchar
- `flow_steps_json` jsonb
- `stats_json` jsonb
- `services_json` jsonb
- `news_json` jsonb
- `version` int
- `updated_by` bigint
- `updated_at` timestamp
- `del_flag` char(1)

### 5.2 `portal_case`

Purpose: portal case library.

Suggested columns:

- `case_id` bigint primary key
- `title` varchar
- `description` text
- `cover_url` varchar
- `video_url` varchar
- `tags` varchar
- `industry` varchar
- `scenario` varchar
- `sort_order` int
- `published` boolean
- `pinned` boolean
- `publish_time` timestamp
- `update_time` timestamp
- `create_by` bigint
- `update_by` bigint
- `del_flag` char(1)

Indexes:

- `idx_portal_case_published_pinned_sort (published, pinned, sort_order)`
- `idx_portal_case_update_time (update_time desc)`

### 5.3 `portal_user_mapping`

Purpose: system user to third-party account mapping.

Suggested columns:

- `id` bigint primary key
- `user_id` bigint not null
- `annotate_account` varchar
- `simulate_account` varchar
- `updated_by` bigint
- `updated_at` timestamp
- `del_flag` char(1)

Constraints:

- `uk_portal_user_mapping_user_id (user_id)` unique

## 6. API Contract

### 6.1 Portal Content

- `GET /portal/home` public read
- `PUT /portal/home` admin update (`portal:home:edit`)
- `GET /portal/cases` public list
- `GET /portal/cases/{caseId}` public detail
- `GET /portal/cases/admin/list` admin list (`portal:case:list`)
- `POST /portal/cases` create (`portal:case:add`)
- `PUT /portal/cases` update (`portal:case:edit`)
- `DELETE /portal/cases/{caseId}` delete (`portal:case:remove`)

### 6.2 User Mapping

- `GET /portal/user-mapping/{userId}` (`portal:mapping:query`)
- `PUT /portal/user-mapping/{userId}` (`portal:mapping:edit`)

### 6.3 SSO

- `POST /portal/sso/ticket`
  - Input: platform (`annotate` | `simulate`)
  - Behavior: read account mapping from PG, write ticket payload to Redis
- `POST /portal/sso/ticket/exchange`
  - Behavior: validate signature + ticket TTL/one-time consume
- `POST /portal/sso/logout`
  - Behavior: clear local session token, callback mock service logout endpoints

## 7. Mock Service Design (`portal-mock-sso`)

Node.js + Express standalone service.

Endpoints:

- `POST /mock/annotate/exchange`
- `POST /mock/simulate/exchange`
- `POST /mock/annotate/logout`
- `POST /mock/simulate/logout`

Rules:

- Returns stable mock success payload by default.
- Supports optional forced failure flag for joint-debug testing.
- Logs request body + timestamp + correlation id for troubleshooting.

## 8. Local Startup And Joint Debug Flow

Startup order:

1. Infrastructure: Nacos + PostgreSQL + Redis
2. Backend services: `ruoyi-system` -> `ruoyi-auth` -> `ruoyi-portal` -> `ruoyi-gateway`
3. Mock service: `portal-mock-sso`
4. Frontend: `car-portal-public`

Joint-debug scenarios:

1. Home page reads `GET /portal/home` from PG-backed data.
2. Cases page reads `GET /portal/cases`; detail reads `GET /portal/cases/{id}`.
3. Admin modifies home/cases, frontend reflects persisted changes after refresh/restart.
4. Logged-in user creates SSO ticket and completes mock exchange flow.
5. Logout triggers local cleanup plus mock platform callback.

## 9. Error Handling

- Unsupported platform: `不支持的平台类型`
- Missing mapping: `当前用户未配置<platform>平台账号映射`
- Invalid signature: `签名校验失败`
- Invalid/expired ticket: `ticket 不存在或已过期`
- Missing case: `案例不存在`
- Mock callback failure: record failure platform but do not block local logout completion

## 10. Verification Plan

- SQL verification: create and validate `portal_*` tables/indexes in PG.
- Backend verification: run portal module tests first (`mvn -pl ruoyi-modules/ruoyi-portal -DskipTests=false test`).
- API verification: run curl checks for home/cases/sso endpoints through gateway.
- Frontend verification: manual checks for home/cases/login/third-party jump/logout.

## 11. Risks And Mitigations

- Risk: schema evolution for home JSON blocks.
  - Mitigation: keep version field and explicit DTO validation.
- Risk: mock/real third-party contract divergence.
  - Mitigation: isolate mock adapter config and keep callback payload documented.
- Risk: mixed old Redis data and new PG logic during migration.
  - Mitigation: remove Redis business read/write paths in portal services and keep Redis only for SSO/session.
