#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/car-portal-backend"
FRONTEND_DIR="$ROOT_DIR/car-portal-frontend"

PROFILE="${PROFILE:-prod}"
NACOS_NAMESPACE="${NACOS_NAMESPACE:-test}"
SKIP_BACKEND_BUILD="${SKIP_BACKEND_BUILD:-0}"
SKIP_FRONTEND_BUILD="${SKIP_FRONTEND_BUILD:-0}"
SKIP_START="${SKIP_START:-0}"

BACKEND_LOG_DIR="$BACKEND_DIR/.local-logs"
BACKEND_PID_DIR="$BACKEND_DIR/.local-run"

SYSTEM_JAR="$BACKEND_DIR/ruoyi-modules/ruoyi-system/target/ruoyi-system.jar"
AUTH_JAR="$BACKEND_DIR/ruoyi-auth/target/ruoyi-auth.jar"
GATEWAY_JAR="$BACKEND_DIR/ruoyi-gateway/target/ruoyi-gateway.jar"

SYSTEM_PORT=9201
AUTH_PORT=9210
GATEWAY_PORT=8080

info() { echo "[deploy-test] $*"; }
warn() { echo "[deploy-test][warn] $*"; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

stop_if_running() {
  local name="$1"
  local pid_file="$BACKEND_PID_DIR/$name.pid"
  if [[ -f "$pid_file" ]]; then
    local pid
    pid="$(cat "$pid_file" || true)"
    if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
      info "Stopping existing $name (pid=$pid)"
      kill "$pid" || true
      sleep 1
    fi
    rm -f "$pid_file"
  fi
}

wait_port() {
  local port="$1"
  local name="$2"
  for _ in {1..40}; do
    if nc -z 127.0.0.1 "$port" >/dev/null 2>&1; then
      info "$name is listening on :$port"
      return 0
    fi
    sleep 1
  done
  warn "$name did not listen on :$port in time"
  return 1
}

start_service() {
  local name="$1"
  local jar="$2"
  local port="$3"
  local log_file="$BACKEND_LOG_DIR/$name.log"
  local pid_file="$BACKEND_PID_DIR/$name.pid"

  if [[ ! -f "$jar" ]]; then
    echo "Jar not found: $jar" >&2
    exit 1
  fi

  stop_if_running "$name"
  info "Starting $name"
  nohup java -jar "$jar" \
    --spring.profiles.active="$PROFILE" \
    --spring.cloud.nacos.config.namespace="$NACOS_NAMESPACE" \
    --spring.cloud.nacos.discovery.namespace="$NACOS_NAMESPACE" \
    >"$log_file" 2>&1 &
  echo $! >"$pid_file"
  wait_port "$port" "$name"
}

build_backend() {
  info "Building backend core services"
  (
    cd "$BACKEND_DIR"
    mvn -U -P"$PROFILE" \
      -pl ruoyi-auth,ruoyi-gateway,ruoyi-modules/ruoyi-system \
      -am -DskipTests package
  )
}

build_frontend() {
  info "Building frontend"
  (
    cd "$FRONTEND_DIR"
    pnpm install --frozen-lockfile=false
    if pnpm run | rg -q "build:test"; then
      pnpm build:test
    else
      warn "Script build:test not found, fallback to pnpm build"
      pnpm build
    fi
  )
}

check_api() {
  info "Checking gateway/auth endpoints"
  curl -fsS "http://127.0.0.1:${GATEWAY_PORT}/auth/tenant/list" >/dev/null
  curl -fsS "http://127.0.0.1:${GATEWAY_PORT}/auth/code" >/dev/null
  info "API check passed"
}

main() {
  require_cmd mvn
  require_cmd java
  require_cmd pnpm
  require_cmd curl
  require_cmd nc

  mkdir -p "$BACKEND_LOG_DIR" "$BACKEND_PID_DIR"

  info "ROOT_DIR=$ROOT_DIR"
  info "PROFILE=$PROFILE NACOS_NAMESPACE=$NACOS_NAMESPACE"

  [[ "$SKIP_BACKEND_BUILD" == "1" ]] || build_backend
  if [[ "$SKIP_START" != "1" ]]; then
    start_service "ruoyi-system" "$SYSTEM_JAR" "$SYSTEM_PORT"
    start_service "ruoyi-auth" "$AUTH_JAR" "$AUTH_PORT"
    start_service "ruoyi-gateway" "$GATEWAY_JAR" "$GATEWAY_PORT"
    check_api
  fi
  [[ "$SKIP_FRONTEND_BUILD" == "1" ]] || build_frontend

  info "Done."
  info "Backend logs: $BACKEND_LOG_DIR"
}

main "$@"
