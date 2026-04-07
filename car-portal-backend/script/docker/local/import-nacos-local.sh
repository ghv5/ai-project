#!/bin/sh
set -eu

NACOS_HOST="${NACOS_HOST:-127.0.0.1}"
NACOS_PORT="${NACOS_PORT:-8848}"
NACOS_USERNAME="${NACOS_USERNAME:-nacos}"
NACOS_PASSWORD="${NACOS_PASSWORD:-nacos}"
NAMESPACE_ID="${NAMESPACE_ID:-dev}"
GROUP_NAME="${GROUP_NAME:-DEFAULT_GROUP}"
CONFIG_DIR="$(CDPATH= cd -- "$(dirname "$0")/../../config/nacos" && pwd)"

echo "Waiting for Nacos at http://${NACOS_HOST}:${NACOS_PORT} ..."
i=0
until [ "$i" -ge 60 ]; do
  if curl -fsS "http://${NACOS_HOST}:${NACOS_PORT}/nacos/actuator/health" >/dev/null 2>&1; then
    break
  fi
  i=$((i + 1))
  sleep 2
done

if [ "$i" -ge 60 ]; then
  echo "Nacos did not become ready in time."
  exit 1
fi

TOKEN="$(curl -fsS -X POST "http://${NACOS_HOST}:${NACOS_PORT}/nacos/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "username=${NACOS_USERNAME}" \
  --data-urlencode "password=${NACOS_PASSWORD}" 2>/dev/null | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p' || true)"

AUTH_QUERY=""
if [ -n "${TOKEN}" ]; then
  AUTH_QUERY="?accessToken=${TOKEN}"
fi

curl -fsS -X POST "http://${NACOS_HOST}:${NACOS_PORT}/nacos/v1/console/namespaces${AUTH_QUERY}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "customNamespaceId=${NAMESPACE_ID}" \
  --data-urlencode "namespaceName=${NAMESPACE_ID}" >/dev/null 2>&1 || true

for file in "${CONFIG_DIR}"/*; do
  [ -f "${file}" ] || continue
  data_id="$(basename "${file}")"
  case "${data_id}" in
    *.properties) config_type="properties" ;;
    *.yaml|*.yml) config_type="yaml" ;;
    *) config_type="text" ;;
  esac

  echo "Importing ${data_id}"
  curl -fsS -X POST "http://${NACOS_HOST}:${NACOS_PORT}/nacos/v1/cs/configs${AUTH_QUERY}" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    --data-urlencode "tenant=${NAMESPACE_ID}" \
    --data-urlencode "group=${GROUP_NAME}" \
    --data-urlencode "dataId=${data_id}" \
    --data-urlencode "type=${config_type}" \
    --data-urlencode "content@${file}" >/dev/null
done

echo "Imported Nacos configs into namespace ${NAMESPACE_ID}."
