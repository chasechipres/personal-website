#!/usr/bin/env bash
# Build the static site and ship it to the web VM as a new release.
#
# Each deploy uploads into releases/<timestamp>/ and then swaps the "current"
# symlink in one rename, so visitors never see a half-uploaded site. The last
# 5 releases are kept; roll back with: deploy/deploy.sh --rollback
#
# DEPLOY_HOST is an SSH host for the restricted "deploy" user (an alias from
# ~/.ssh/config works). The VM's IP is kept out of this public repo so
# Cloudflare can't be bypassed. CI runs this same script on push to main.
set -euo pipefail

HOST="${DEPLOY_HOST:-chasechipres-deploy}"
BASE=/var/www/chasechipres
KEEP=5
cd "$(dirname "$0")/.."

if [[ "${1:-}" == "--rollback" ]]; then
  ssh "$HOST" "set -e; cd $BASE
    prev=\$(ls -1d releases/* | sort | tail -n 2 | head -n 1)
    [ \"\$prev\" != \"\$(readlink current)\" ] || { echo 'No earlier release'; exit 1; }
    ln -sfn \"\$prev\" current.tmp && mv -Tf current.tmp current
    echo \"Rolled back to \$prev\""
  exit 0
fi

echo "Building..."
mise exec -C web -- pnpm build

release="releases/$(date -u +%Y%m%d%H%M%S)"
echo "Uploading $release to $HOST..."
tar -C web/out -czf - . | ssh "$HOST" "set -e; mkdir -p $BASE/$release && tar -xzf - -C $BASE/$release"

echo "Activating..."
ssh "$HOST" "set -e; cd $BASE
  ln -sfn $release current.tmp && mv -Tf current.tmp current
  ls -1d releases/* | sort | head -n -$KEEP | xargs -r rm -rf"

echo "Checking https://chasechipres.com ..."
if curl -fsS https://chasechipres.com/ | grep -q "From iOS apps"; then
  echo "Live: $release"
else
  echo "Deployed, but the live page didn't match. Check it, or run: deploy/deploy.sh --rollback" >&2
  exit 1
fi
