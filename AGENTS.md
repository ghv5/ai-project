# Repository Guidelines

## Project Structure & Module Organization
This repository is a full-stack workspace with two main projects:

- `car-portal-frontend/`: Vue 3 + TypeScript admin frontend (Vite + pnpm workspace).
- `car-portal-backend/`: Java microservices backend (Spring Boot/Spring Cloud, Maven multi-module).

Frontend source is under `car-portal-frontend/src`, shared packages under `car-portal-frontend/packages/*`, and static assets under `car-portal-frontend/public` and `src/assets`.
Backend services are split by module (for example `ruoyi-gateway`, `ruoyi-auth`, `ruoyi-modules/ruoyi-system`), with local infra/config scripts in `car-portal-backend/script`.

## Build, Test, and Development Commands
Run commands in each project directory, not repository root.

- Frontend install: `cd car-portal-frontend && pnpm install`
- Frontend dev: `pnpm dev` (default at `http://localhost:9527`)
- Frontend quality: `pnpm typecheck`, `pnpm lint`, `pnpm fmt`
- Frontend build: `pnpm build` (or `pnpm build:dev`, `pnpm build:test`)
- Backend build: `cd car-portal-backend && mvn -DskipTests package`
- Backend tests: `mvn -DskipTests=false test`
- Local dependencies: `docker compose -f car-portal-backend/script/docker/docker-compose.local.yml up -d`

## Coding Style & Naming Conventions
Frontend uses ESLint + Oxlint + OXfmt. Follow existing conventions:

- Vue SFC files: PascalCase (for components), route/view files follow existing folder style.
- TypeScript variables/functions: `camelCase`; constants: `UPPER_SNAKE_CASE`.
- Prefer composition API and strict typings.

Backend follows standard Java conventions:

- 4-space indentation, `UpperCamelCase` for classes, `lowerCamelCase` for methods/fields.
- Keep module boundaries clear; avoid cross-module shortcuts.

## Testing Guidelines
Frontend currently emphasizes static checks (`typecheck`, `lint`) and manual page verification for changed views.
Backend tests run with Maven Surefire. Add tests in module `src/test/java` near changed logic and run targeted tests first (for example `mvn -pl ruoyi-modules/ruoyi-system -DskipTests=false test`).

## Commit & Pull Request Guidelines
Use Conventional Commits. This repo includes commit verification logic expecting:

- `type(scope): description`
- Example: `feat(system): add tenant status filter`

Before opening a PR:

- Rebase/sync with latest branch.
- Include change summary, affected modules, config or SQL impacts.
- Attach screenshots for UI changes.
- List verification steps and executed commands.

## Security & Configuration Tips
Do not commit real secrets. Treat `.env*`, Nacos config, and key material as environment-specific.
For backend local setup, import Nacos configs from `car-portal-backend/script/config/nacos` using the provided script in `script/docker/local`.
