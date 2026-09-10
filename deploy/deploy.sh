#!/usr/bin/env bash
# Deploy IronMan (איש הברזל) Next.js to the frontend VPS.
# Usage: ./deploy/deploy.sh
set -euo pipefail

SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519}"
JUMP="${JUMP_HOST:-root@37.60.230.148}"
FRONT="${FRONTEND_HOST:-root@84.46.253.85}"
REMOTE_KEY="/tmp/ironman_deploy_key"
REMOTE_DIR="${REMOTE_DIR:-/opt/ironman}"
PORT="${IRONMAN_PORT:-3012}"
DOMAIN="${IRONMAN_DOMAIN:-theironman.co.il}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

read_env_val() {
  local file="$1" key="$2"
  [[ -f "$file" ]] || return 0
  grep -E "^${key}=" "$file" 2>/dev/null | head -1 | cut -d= -f2- | tr -d '\r' | sed 's/^"//; s/"$//' || true
}

ensure_jump_key() {
  scp -i "$SSH_KEY" -o BatchMode=yes "$SSH_KEY" "${JUMP}:${REMOTE_KEY}"
  ssh -i "$SSH_KEY" -o BatchMode=yes "$JUMP" "chmod 600 ${REMOTE_KEY}"
}

use_jump=true
if [[ "${IRONMAN_FORCE_DIRECT:-0}" == "1" ]]; then
  use_jump=false
elif [[ "${IRONMAN_FORCE_JUMP:-0}" == "1" ]]; then
  use_jump=true
elif ssh -i "$SSH_KEY" -o BatchMode=yes -o ConnectTimeout=8 "$FRONT" "echo ok" >/dev/null 2>&1; then
  use_jump=false
fi

front_ssh() {
  if [[ "$use_jump" == true ]]; then
    ssh -i "$SSH_KEY" -o BatchMode=yes "$JUMP" \
      ssh -i "$REMOTE_KEY" -o StrictHostKeyChecking=no -o BatchMode=yes "$FRONT" "$@"
  else
    ssh -i "$SSH_KEY" -o BatchMode=yes "$FRONT" "$@"
  fi
}

front_scp() {
  local src="$1" dest="$2"
  if [[ "$use_jump" == true ]]; then
    scp -i "$SSH_KEY" -o BatchMode=yes "$src" "${JUMP}:/tmp/ironman_scp_tmp"
    ssh -i "$SSH_KEY" -o BatchMode=yes "$JUMP" \
      "scp -i ${REMOTE_KEY} -o BatchMode=yes /tmp/ironman_scp_tmp ${FRONT}:${dest} && rm -f /tmp/ironman_scp_tmp"
  else
    scp -i "$SSH_KEY" -o BatchMode=yes "$src" "${FRONT}:${dest}"
  fi
}

cd "$ROOT"

echo "# Ensuring jump deploy key…"
if [[ "$use_jump" == true ]]; then
  ensure_jump_key
fi

echo "# Ensuring remote dir ${REMOTE_DIR}…"
front_ssh "mkdir -p ${REMOTE_DIR}/public/uploads"

REMOTE_ENV_SNIP="$(mktemp)"
front_ssh "cat ${REMOTE_DIR}/.env.production 2>/dev/null || true" > "$REMOTE_ENV_SNIP" || true

DB_PASSWORD="$(read_env_val "$REMOTE_ENV_SNIP" DATABASE_URL | sed -n 's|postgresql://[^:]*:\([^@]*\)@.*|\1|p')"
if [[ -z "${DB_PASSWORD}" ]]; then
  DB_PASSWORD="$(openssl rand -hex 16)"
fi

NEXTAUTH_SECRET="$(read_env_val "$REMOTE_ENV_SNIP" NEXTAUTH_SECRET)"
if [[ -z "${NEXTAUTH_SECRET}" || "${NEXTAUTH_SECRET}" == change-me* ]]; then
  NEXTAUTH_SECRET="$(openssl rand -hex 32)"
fi

ADMIN_PASSWORD="$(read_env_val "$REMOTE_ENV_SNIP" ADMIN_PASSWORD)"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-ChangeMe123!}"

CENTRAL_SERVICE_KEY_VAL="$(read_env_val "$ROOT/.env" CENTRAL_SERVICE_KEY)"
CENTRAL_SERVICE_KEY_VAL="${CENTRAL_SERVICE_KEY_VAL:-$(read_env_val "$ROOT/../central-platform/.env" CENTRAL_SERVICE_KEY)}"
CENTRAL_SERVICE_KEY_VAL="${CENTRAL_SERVICE_KEY_VAL:-$(read_env_val "$REMOTE_ENV_SNIP" CENTRAL_SERVICE_KEY)}"

SITE_URL="https://${DOMAIN}"
rm -f "$REMOTE_ENV_SNIP"

echo "# Syncing project…"
tar -czf - \
  --exclude node_modules \
  --exclude .git \
  --exclude .next \
  --exclude .env \
  --exclude '.env.*' \
  --exclude 'public/uploads/*' \
  . | front_ssh "tar -xzf - -C ${REMOTE_DIR}"

echo "# Ensuring Postgres database…"
front_ssh "bash -lc '
  set -euo pipefail
  sudo -u postgres psql -tAc \"SELECT 1 FROM pg_roles WHERE rolname='\''ironman_app'\''\" | grep -q 1 || \
    sudo -u postgres psql -v ON_ERROR_STOP=1 -c \"CREATE ROLE ironman_app LOGIN PASSWORD '\''${DB_PASSWORD}'\'';\"
  sudo -u postgres psql -tAc \"SELECT 1 FROM pg_database WHERE datname='\''ironman'\''\" | grep -q 1 || \
    sudo -u postgres psql -v ON_ERROR_STOP=1 -c \"CREATE DATABASE ironman OWNER ironman_app;\"
  sudo -u postgres psql -v ON_ERROR_STOP=1 -c \"ALTER ROLE ironman_app PASSWORD '\''${DB_PASSWORD}'\'';\"
  sudo -u postgres psql -v ON_ERROR_STOP=1 -c \"GRANT ALL PRIVILEGES ON DATABASE ironman TO ironman_app;\"
'"

ENV_TMP="$(mktemp)"
cat > "$ENV_TMP" <<EOF
NODE_ENV=production
DATABASE_URL=postgresql://ironman_app:${DB_PASSWORD}@127.0.0.1:5432/ironman?schema=public
NEXTAUTH_URL=${SITE_URL}
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXT_PUBLIC_SITE_URL=${SITE_URL}
NEXT_PUBLIC_WHATSAPP_NUMBER=972507562842
ADMIN_EMAIL=admin@ironman.co.il
ADMIN_PASSWORD=${ADMIN_PASSWORD}
EOF
if [[ -n "${CENTRAL_SERVICE_KEY_VAL:-}" ]]; then
  echo "CENTRAL_SERVICE_KEY=${CENTRAL_SERVICE_KEY_VAL}" >> "$ENV_TMP"
fi

echo "# Writing production env…"
front_scp "$ENV_TMP" "${REMOTE_DIR}/.env.production"
rm -f "$ENV_TMP"

echo "# Installing, migrating, building…"
front_ssh "bash -lc '
  set -euo pipefail
  cd ${REMOTE_DIR}
  npm ci --include=dev
  set -a && source .env.production && set +a
  npx prisma generate
  npx prisma db push
  npm run db:seed
  npm run build
'"

echo "# PM2 ironman-web :${PORT}…"
front_ssh "bash -lc '
  set -euo pipefail
  if pm2 describe ironman-web >/dev/null 2>&1; then
    pm2 delete ironman-web
  fi
  cd ${REMOTE_DIR}
  set -a && source .env.production && set +a
  pm2 start npm --name ironman-web -- start -- -H 127.0.0.1 -p ${PORT}
  pm2 save
'"

echo "# Nginx ${DOMAIN}…"
# Self-signed origin cert for Cloudflare SSL "Full" (HTTPS → origin :443).
front_ssh "bash -lc '
  set -euo pipefail
  mkdir -p /etc/nginx/ssl
  if [[ ! -f /etc/nginx/ssl/ironman.pem || ! -f /etc/nginx/ssl/ironman.key ]]; then
    openssl req -x509 -nodes -newkey rsa:2048 -days 825 \
      -keyout /etc/nginx/ssl/ironman.key \
      -out /etc/nginx/ssl/ironman.pem \
      -subj \"/CN=${DOMAIN}\" \
      -addext \"subjectAltName=DNS:${DOMAIN},DNS:www.${DOMAIN},DNS:ironman.mela-media.co.il,DNS:ironman.co.il,DNS:www.ironman.co.il\"
  fi
'"
NGX_TMP="$(mktemp)"
cp "$ROOT/deploy/nginx-ironman.conf" "$NGX_TMP"
front_scp "$NGX_TMP" "/etc/nginx/sites-available/ironman"
rm -f "$NGX_TMP"
front_ssh "ln -sfn /etc/nginx/sites-available/ironman /etc/nginx/sites-enabled/ironman && nginx -t && systemctl reload nginx"

echo "# Health check…"
front_ssh "curl -sS -o /dev/null -w 'local=%{http_code}\n' -H 'Host: ${DOMAIN}' http://127.0.0.1:${PORT}/ || true"
front_ssh "curl -sS -o /dev/null -w 'nginx=%{http_code}\n' -H 'Host: ${DOMAIN}' http://127.0.0.1/ || true"

echo ""
echo "# Deploy complete."
echo "  URL:  https://${DOMAIN}"
echo "  Admin: https://${DOMAIN}/admin"
echo "  Login: admin@ironman.co.il / ${ADMIN_PASSWORD}"

# shellcheck source=../../scripts/deploy-notify.sh
source "$ROOT/../scripts/deploy-notify.sh"
DEPLOY_ROOT="$ROOT" notify_central_deploy ironman "web+admin"
