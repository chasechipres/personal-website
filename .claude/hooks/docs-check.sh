#!/usr/bin/env bash
# Stop hook: if code changed (uncommitted or unpushed) but no docs changed, ask
# Claude to check README.md / DESIGN.md before finishing. Runs once per stop:
# when Claude is already continuing because of this hook, it lets it stop.
input=$(cat)
case "$input" in
  *'"stop_hook_active":true'* | *'"stop_hook_active": true'*) exit 0 ;;
esac

cd "$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0

changed=$({
  git diff --name-only HEAD
  git ls-files --others --exclude-standard
  git diff --name-only '@{u}..HEAD' 2>/dev/null
} | sort -u)

code=$(grep -E '^(web/src/|web/next\.config|web/package\.json|deploy/|api/|\.github/|mise\.toml)' <<<"$changed")
docs=$(grep -E '^(README\.md|DESIGN\.md|CLAUDE\.md)$' <<<"$changed")

if [ -n "$code" ] && [ -z "$docs" ]; then
  files=$(tr '\n' ' ' <<<"$code" | sed 's/ $//')
  printf '{"decision":"block","reason":"Code changed (%s) but README.md, DESIGN.md and CLAUDE.md did not. Check whether the docs need updating (README Capabilities, Stack, Roadmap, Deploy or Development sections; DESIGN.md for visual changes) and update them if so. If no doc change is needed, say why in one line and finish."}\n' "$files"
fi
exit 0
