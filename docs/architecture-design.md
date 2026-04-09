# Car Portal Scaffold Architecture Design

## 1. Document Scope

This document describes the current scaffold architecture in this repository, including:

- Frontend and backend architecture overview
- Request routing
- Functional module map
- Deployment topology (local/test/prod)

## 2. Technology Stack

## 2.1 Frontend

- Vue 3 + TypeScript
- Vite 7
- Pinia
- Vue Router
- Naive UI
- Request proxy via Vite dev server (`/dev-api` -> gateway)

## 2.2 Backend

- Spring Boot 3 + Spring Cloud + Spring Cloud Alibaba
- Nacos (config + service discovery)
- Gateway (WebFlux)
- Multi-service modules (`ruoyi-auth`, `ruoyi-system`, `ruoyi-gen`, `ruoyi-resource`, `ruoyi-workflow`, etc.)
- Redis + PostgreSQL
- Maven multi-module build

## 3. Frontend/Backend Overall Architecture

```mermaid
flowchart LR
  U[Browser/User] --> FE[car-portal-frontend\nVue3 + Vite]
  FE -->|/dev-api/*| GW[ruoyi-gateway:8080]

  GW --> AUTH[ruoyi-auth:9210]
  GW --> SYS[ruoyi-system:9201]
  GW --> GEN[ruoyi-gen]
  GW --> RES[ruoyi-resource]
  GW --> WF[ruoyi-workflow]
  GW --> DEMO[ruoyi-demo]
  GW --> MQ[ruoyi-test-mq]

  AUTH --> NACOS[(Nacos)]
  SYS --> NACOS
  GW --> NACOS
  GEN --> NACOS
  RES --> NACOS
  WF --> NACOS

  AUTH --> REDIS[(Redis)]
  SYS --> REDIS
  GW --> REDIS

  SYS --> PG[(PostgreSQL)]
  GEN --> PG
  WF --> PG
  JOB[ruoyi-job / snailjob] --> PG
```

## 4. Request Routing Design

Routing source: `car-portal-backend/script/config/nacos/ruoyi-gateway.yml`

```mermaid
flowchart TB
  C[Client Request] --> G[Gateway]
  G -->|/auth/**| A[ruoyi-auth]
  G -->|/tool/**| T[ruoyi-gen]
  G -->|/system/** /monitor/**| S[ruoyi-system]
  G -->|/resource/**| R[ruoyi-resource]
  G -->|/workflow/**| W[ruoyi-workflow]
  G -->|/warm-flow-ui/** /warm-flow/**| W
  G -->|/demo/**| D[ruoyi-demo]
  G -->|/test-mq/**| M[ruoyi-test-mq]
```

## 5. Functional Module Map

```mermaid
flowchart LR
  P[Car Portal Platform]
  P --> F1[Auth & User Login]
  P --> F2[System Management]
  P --> F3[Code Generator]
  P --> F4[Resource Service]
  P --> F5[Workflow]
  P --> F6[Job/Scheduler]
  P --> F7[Monitoring]
  P --> F8[Demo/Test-MQ]

  F1 --> M1[ruoyi-auth]
  F2 --> M2[ruoyi-system]
  F3 --> M3[ruoyi-gen]
  F4 --> M4[ruoyi-resource]
  F5 --> M5[ruoyi-workflow]
  F6 --> M6[ruoyi-job + ruoyi-snailjob-server]
  F7 --> M7[ruoyi-monitor]
  F8 --> M8[ruoyi-demo + ruoyi-test-mq]
```

## 6. Deployment Topology

```mermaid
flowchart TB
  subgraph Local Dev
    L1[Frontend Vite\nlocalhost:9527]
    L2[Gateway\nlocalhost:8080]
    L3[Auth\nlocalhost:9210]
    L4[System\nlocalhost:9201]
    LN[(Nacos Docker)]
    LR[(Redis)]
    LP[(PostgreSQL)]
    L1 --> L2
    L2 --> L3
    L2 --> L4
    L3 --> LN
    L4 --> LN
    L2 --> LN
    L3 --> LR
    L4 --> LR
    L4 --> LP
  end

  subgraph Test/Prod
    T0[Load Balancer / Ingress]
    T1[Frontend Static Hosting]
    T2[Gateway Cluster]
    T3[Microservice Cluster]
    TN[(Nacos Cluster)]
    TR[(Redis Cluster)]
    TP[(PostgreSQL)]
    T1 --> T0 --> T2 --> T3
    T3 --> TN
    T3 --> TR
    T3 --> TP
  end
```

## 7. Key Runtime Notes

- Nacos namespace must match active profile and startup parameters.
- Gateway is the single entry for frontend API calls.
- Core local bootstrap chain: `ruoyi-system` -> `ruoyi-auth` -> `ruoyi-gateway` -> frontend.
- Current repository includes helper scripts:
  - `scripts/deploy-test.sh`
  - `scripts/deploy-prod.sh`
  - `scripts/stop-services.sh`
