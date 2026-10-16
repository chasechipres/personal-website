# CLAUDE.md

Personal website for https://chasechipres.com. See README.md for hosting and deploy.

## Shipping
Pushing to `main` deploys to production through GitHub Actions (`.github/workflows/deploy.yml`).
Don't push to `main` without the user's go-ahead. `deploy/deploy.sh --rollback` (or the
workflow's "rollback" option) restores the previous release.

## Keep docs current
When a change adds, removes or changes what the site can do, update the docs in the same change:
- README.md: Capabilities (what's live), Stack status, Roadmap checkboxes, Deploy and
  Development steps.
- DESIGN.md: any visual or interaction change.
- Close or update the matching GitHub issue when roadmap work lands.
A Stop hook (`.claude/hooks/docs-check.sh`) flags code changes that have no doc changes.

## Track future work as issues
When you spot hardening, features or follow-ups worth doing later, and they aren't being done
now, propose a GitHub issue on chasechipres/personal-website: a short title, a checklist body,
and one or more labels (`feature`, `infra`, `security`). The repo is public, so ask before
creating it, and never put IPs, keys or other secrets in an issue. Add new roadmap items to the
README Roadmap with a link to the issue.

## Design
Every page, component and style follows DESIGN.md. Use its tokens; don't invent new
colors, sizes, radii or shadows. If something isn't covered, ask before adding it.

@DESIGN.md
