#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_PID_DIR="$ROOT_DIR/car-portal-backend/.local-run"

STOP_FRONTEND="${STOP_FRONTEND:-0}"
FORCE_KILL="${FORCE_KILL:-0}"

SYSTEM_PORT=9201
AUTH_PORT=9210
GATEWAY_PORT=8080
FRONTEND_PORT=9527

info() { echo "[stop-services] $*"; }
warn() { echo "[stop-services][warn] $*"; }

kill_pid() {
  local pid="$1"
  local name="$2"
  if ! kill -0 "$pid" 2>/dev/null; then
    warn "$name pid=$pid is not running"
    return 0
  fi

  info "Stopping $name (pid=$pid)"
  kill "$pid" 2>/dev/null || true

  for _ in {1..8}; do
    if ! kill -0 "$pid" 2>/dev/null; then
      info "$name stopped"
      return 0
    fi
    sleep 1
  done

  if [[ "$FORCE_KILL" == "1" ]]; then
    warn "$name did not stop in time, force killing pid=$pid"
    kill -9 "$pid" 2>/dev/null || true
  else
    warn "$name still running (set FORCE_KILL=1 to force)"
  fi
}

stop_by_pid_file() {
  local name="$1"
  local pid_file="$BACKEND_PID_DIR/$name.pid"
  if [[ -f "$pid_file" ]]; then
    local pid
    pid="$(cat "$pid_file" || true)"
    if [[ -n "$pid" ]]; then
      kill_pid "$pid" "$name"
    fi
    rm -f "$pid_file"
  else
    warn "No pid file for $name ($pid_file)"
  fi
}

stop_by_port() {
  local port="$1"
  local name="$2"
  local pids
  pids="$(lsof -ti tcp:"$port" -sTCP:LISTEN 2>/dev/null || true)"
  if [[ -z "$pids" ]]; then
    warn "No listener on :$port for $name"
    return 0
  fi
  for pid in $pids; do
    kill_pid "$pid" "$name:port:$port"
  done
}

main() {
  mkdir -p "$BACKEND_PID_DIR"

  stop_by_pid_file "ruoyi-system"
  stop_by_pid_file "ruoyi-auth"
  stop_by_pid_file "ruoyi-gateway"

  # Fallback by port in case pid files are missing or stale.
  stop_by_port "$SYSTEM_PORT" "ruoyi-system"
  stop_by_port "$AUTH_PORT" "ruoyi-auth"
  stop_by_port "$GATEWAY_PORT" "ruoyi-gateway"

  if [[ "$STOP_FRONTEND" == "1" ]]; then
    stop_by_port "$FRONTEND_PORT" "frontend-vite"
  fi

  info "Done."
}

main "$@"
