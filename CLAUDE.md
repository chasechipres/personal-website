# CLAUDE.md

Personal website for https://chasechipres.com. See README.md for hosting and deploy.

## Shipping
`main` is protected and every merge to it deploys to production
(`.github/workflows/deploy.yml`). Work goes through pull requests:
1. Branch from an up-to-date `main` (`feat/…`, `fix/…`, `chore/…`, `docs/…`).
2. Commit, push the branch, open a PR with `gh pr create`. Reference issues with "Closes #N".
3. The `check` job (`.github/workflows/ci.yml`: lint, build) must pass.
4. Squash-merge only, and only with the user's go-ahead; merging ships it.
The `main` ruleset has no bypass, not even for admins. For an emergency the user temporarily
disables the "Protect main" ruleset in repo settings; never do that yourself.
`deploy/deploy.sh --rollback` (or the Deploy workflow's "rollback" option) restores the previous
release.

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
