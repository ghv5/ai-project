# ai-project

本仓库是一个前后端分离的业务脚手架，包含：

- `car-portal-frontend`：Vue 3 + TypeScript + Vite + pnpm 的管理端前端
- `car-portal-backend`：Spring Boot / Spring Cloud 微服务后端（Maven 多模块）

设计文档入口：

- 架构设计文档：`docs/architecture-design.md`
- 数据库设计文档：`docs/database-design.md`

当前推荐运行模式：

- Nacos 使用 Docker 启动并集中管理配置
- 后端服务本地 JVM 启动（不打 Docker 服务镜像）
- 前端使用 Vite 本地开发服务器启动

## 1. 项目脚手架说明

### 1.1 目录结构

```text
ai-project/
├── car-portal-frontend/    # 前端项目（Vite + Vue3 + TS）
└── car-portal-backend/     # 后端微服务（Maven multi-module）
```

### 1.2 后端核心服务（本地联调常用）

- `ruoyi-gateway`：网关（默认 `8080`）
- `ruoyi-auth`：认证服务（默认 `9210`）
- `ruoyi-system`：系统服务（默认 `9201`）

## 2. 启动说明

## 2.1 环境准备

- JDK 17
- Maven 3.9+
- Node.js 18+（建议 LTS）
- pnpm 8+
- Docker（用于启动 Nacos）

> 注意：后端运行时使用 Nacos 配置，务必保证 Nacos 中 `dev` 命名空间配置完整且可读取。

## 2.2 启动 Nacos（Docker）

在后端目录执行：

```bash
cd car-portal-backend
docker compose -f script/docker/docker-compose.local.yml up -d
```

确认 Nacos 可用（默认 `8848`）：

```bash
curl -i http://127.0.0.1:8848/nacos/actuator/health
```

## 2.3 启动后端（本地 JVM）

### 方式 A：先构建再启动（推荐）

```bash
cd car-portal-backend
mvn -U -Pdev -pl ruoyi-auth,ruoyi-gateway,ruoyi-modules/ruoyi-system -am -DskipTests package

java -jar ruoyi-modules/ruoyi-system/target/ruoyi-system.jar
java -jar ruoyi-auth/target/ruoyi-auth.jar
java -jar ruoyi-gateway/target/ruoyi-gateway.jar
```

### 方式 B：按模块单独开发启动

可在对应模块下执行 `mvn -Pdev spring-boot:run`（需依赖已准备完整）。

## 2.4 启动前端

```bash
cd car-portal-frontend
pnpm install
pnpm dev
```

默认访问地址：

- 前端：`http://localhost:9527`
- 网关：`http://localhost:8080`

## 2.5 启动后快速验收

```bash
# 网关 -> 认证服务
curl -s http://127.0.0.1:8080/auth/tenant/list
curl -s http://127.0.0.1:8080/auth/code
```

预期：返回 JSON 且 `code` 为 `200`。

## 2.6 门户联调（car-portal-public + ruoyi-portal + mock-sso）

1. 启动门户 mock 服务：

```bash
cd car-portal-public-mock
npm install
npm run dev
```

2. 构建并启动门户后端服务：

```bash
cd car-portal-backend
mvn -Pdev -pl ruoyi-modules/ruoyi-portal -am -DskipTests package
java -jar ruoyi-modules/ruoyi-portal/target/ruoyi-portal.jar
```

3. 启动网关与基础依赖服务（auth/system/gateway），确保 `/portal/**` 路由可达。

4. 启动门户前端：

```bash
cd car-portal-public
pnpm install
pnpm dev
```

5. 快速验证：

```bash
curl -s http://127.0.0.1:8080/portal/home
curl -s http://127.0.0.1:8080/portal/cases
curl -s -X POST http://127.0.0.1:3001/mock/annotate/exchange
```

## 3. 常规修改配置说明

## 3.1 修改 Nacos 配置（推荐）

后端核心运行配置建议统一放在 Nacos：

- `application-common.yml`：公共配置（Redis、日志、公共开关等）
- `datasource.yml`：数据库连接配置
- `ruoyi-auth.yml` / `ruoyi-gateway.yml` / `ruoyi-system.yml`：服务级配置

修改流程建议：

1. 先在 Nacos 的 `dev` 命名空间修改配置
2. 确认服务日志出现配置监听或刷新日志
3. 必要时重启对应服务

## 3.2 修改后端本地运行参数

默认使用 `dev` profile。若要切换环境，可在启动参数中覆盖：

```bash
java -jar xxx.jar --spring.profiles.active=dev
```

## 3.3 修改前端代理地址

前端开发环境通过 `/dev-api` 代理网关（`8080`）。
若后端网关地址变更，请调整前端 Vite 代理配置（通常在 `vite.config.*` 或等效配置文件中）。

## 3.4 常见问题排查

- 现象：启动日志提示 `config data not exist`
  - 检查 Nacos 命名空间是否正确（`dev`）
  - 检查对应 `dataId` 是否存在于该命名空间
- 现象：接口 404/502
  - 检查 `gateway/auth/system` 服务是否都已启动
  - 检查网关路由配置 `ruoyi-gateway.yml`
- 现象：前端登录页转圈/验证码失败
  - 检查前端代理是否正确指向 `http://localhost:8080`
  - 检查 `GET /auth/code` 是否返回 `code=200`

## 4. 开发建议

- 新增配置优先走 Nacos，避免把环境差异写死在代码中
- 提交前执行最小验证：
  - 后端至少验证网关与认证接口可用
  - 前端至少验证登录页与基础接口联通

## 5. 测试/生产环境部署说明

## 5.1 环境分层建议

- `dev`：本地联调环境（默认）
- `test`：测试环境（联调、回归）
- `prod`：生产环境

建议每个环境在 Nacos 使用独立命名空间，至少保证以下配置独立：

- 数据库连接（`datasource.yml`）
- Redis 地址与密码（`application-common.yml`）
- 外部服务地址（短信、对象存储、回调域名等）
- 日志级别、监控与告警开关

## 5.2 部署前检查清单

- 代码分支与提交版本已确认
- Nacos 对应环境命名空间配置齐全
- PostgreSQL/Redis/中间件网络可达
- 网关路由配置与服务名一致
- 关键密钥与账号不写入仓库（仅放 Nacos 或安全配置中心）

## 5.3 后端发布流程（通用）

1. 构建产物（建议在 CI 或统一构建机）：

```bash
cd car-portal-backend
mvn -Pprod -DskipTests package
```

2. 发布服务（按实际部署方式执行）：
- 方式 A：JVM 进程部署（`java -jar`）
- 方式 B：容器部署（由平台构建镜像并发布）

3. 启动参数建议：

```bash
java -jar xxx.jar --spring.profiles.active=prod
```

4. 发布顺序建议：
- 先发布基础依赖服务
- 再发布 `system/auth`
- 最后发布 `gateway`

## 5.4 前端发布流程（通用）

```bash
cd car-portal-frontend
pnpm install
pnpm build
```

将打包产物（通常在 `dist/`）发布到静态资源服务或 Nginx。

发布前确认：

- 前端 API 基础路径与网关地址匹配
- 登录、菜单、核心业务页面请求均可达

## 5.5 发布后核验清单

- 网关健康检查可通过
- 登录接口、验证码接口可正常返回
- 核心业务接口响应时间与错误率正常
- 日志无持续异常堆栈
- Nacos 服务实例注册状态正常

## 5.6 回滚建议

- 保留最近稳定版本制品（后端 jar/镜像、前端静态包）
- 使用“版本号 + 配置快照”双回滚：
  1. 回滚应用版本
  2. 回滚 Nacos 配置到对应历史版本

避免只回滚代码不回滚配置，导致版本与配置不匹配。

## 6. 发布命令模板（test/prod）

以下模板按“后端构建 + 后端启动 + 前端构建”给出，可直接按环境替换使用。

## 6.1 test 环境模板

### 一键脚本（推荐）

```bash
cd ai-project
./scripts/deploy-test.sh
```

常用参数（可选）：

```bash
NACOS_NAMESPACE=test SKIP_START=1 ./scripts/deploy-test.sh
```

### 后端构建

```bash
cd car-portal-backend
mvn -Pprod -DskipTests package
```

> 说明：当前后端仅定义了 `dev/prod` profile。测试环境通常使用 `prod` 打包，再通过 test 命名空间配置区分。

### 后端启动（示例：三核心服务）

```bash
# system
java -jar ruoyi-modules/ruoyi-system/target/ruoyi-system.jar \
  --spring.profiles.active=prod

# auth
java -jar ruoyi-auth/target/ruoyi-auth.jar \
  --spring.profiles.active=prod

# gateway
java -jar ruoyi-gateway/target/ruoyi-gateway.jar \
  --spring.profiles.active=prod
```

### 前端构建

```bash
cd car-portal-frontend
pnpm install
pnpm build:test
```

若未维护 `build:test`，可先用：

```bash
pnpm build
```

## 6.2 prod 环境模板

### 一键脚本（推荐）

```bash
cd ai-project
./scripts/deploy-prod.sh
```

常用参数（可选）：

```bash
NACOS_NAMESPACE=prod SKIP_FRONTEND_BUILD=1 ./scripts/deploy-prod.sh
```

### 后端构建

```bash
cd car-portal-backend
mvn -Pprod -DskipTests package
```

### 后端启动（示例：三核心服务）

```bash
# system
java -jar ruoyi-modules/ruoyi-system/target/ruoyi-system.jar \
  --spring.profiles.active=prod

# auth
java -jar ruoyi-auth/target/ruoyi-auth.jar \
  --spring.profiles.active=prod

# gateway
java -jar ruoyi-gateway/target/ruoyi-gateway.jar \
  --spring.profiles.active=prod
```

### 前端构建

```bash
cd car-portal-frontend
pnpm install
pnpm build
```

## 6.3 发布后快速检查命令

```bash
# 网关认证链路
curl -s http://127.0.0.1:8080/auth/tenant/list
curl -s http://127.0.0.1:8080/auth/code

# 端口监听（按部署机实际端口）
lsof -nP -iTCP:8080 -sTCP:LISTEN
lsof -nP -iTCP:9210 -sTCP:LISTEN
lsof -nP -iTCP:9201 -sTCP:LISTEN
```

## 7. 停止服务脚本

```bash
cd ai-project
./scripts/stop-services.sh
```

可选参数：

```bash
# 同时停止前端 vite（9527）
STOP_FRONTEND=1 ./scripts/stop-services.sh

# 进程未正常退出时强制 kill -9
FORCE_KILL=1 ./scripts/stop-services.sh
```
