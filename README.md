# chasechipres.com

Source for [chasechipres.com](https://chasechipres.com): a personal site, a home for my projects,
and a live dashboard for [rh-gex-trader](#rh-gex-trader-live-dashboard), my options trading bot.

> **Status:** v1 is live. The static site and deploy pipeline are done; the Go API and live
> dashboard are next. Built in the open: see the [roadmap](#roadmap) and
> [issues](https://github.com/chasechipres/personal-website/issues).

## Stack

| Layer | Tech | Status |
|---|---|---|
| Frontend | Next.js (static export), React, TypeScript | Live |
| Serving | nginx | Live |
| Edge | Cloudflare (DNS, CDN, TLS) | Live |
| Hosting | Oracle Cloud, Ubuntu 24.04 on ARM (VM.Standard.A1.Flex, 1 OCPU / 6 GB) | Live |
| API | Go | Planned |
| Database | Postgres | Planned |
| Cache and live fan-out | Redis | Planned |
| Containers | Docker Compose | Planned |
| CI/CD | GitHub Actions | Live |

## Capabilities

What's running today.

**Deploys and operations**
- **Pull-request workflow.** `main` is protected: changes land through squash-merged pull
  requests, and a required CI check (install, lint, build) must pass first. Force-pushes and
  branch deletion are blocked.
- **Continuous deployment.** Every merge to `main` that touches the site is linted, built and
  deployed by GitHub Actions. Deploys are serialized, so two merges can't race each other.
- **Atomic releases.** Every deploy uploads to its own `releases/<timestamp>/` folder, then a
  `current` symlink is swapped with a single rename. Visitors get the old site or the new one,
  never a mix.
- **One-click rollback.** Run the Deploy workflow with "rollback" (or `deploy/deploy.sh --rollback`
  locally) to point `current` back at the previous release instantly, with no rebuild or re-upload.
- **Release retention.** The 5 most recent releases are kept on the server; older ones are pruned
  on each deploy.
- **Post-deploy verification.** The deploy script fetches the live page through Cloudflare and
  fails loudly (with the rollback command) if the new content isn't being served.
- **Zero-downtime config changes.** nginx config is versioned in the repo, validated with
  `nginx -t` before every reload, and the server's old config is kept as a backup.
- **Automatic TLS renewal.** Let's Encrypt certificates renew on a systemd timer; renewal is
  verified with a dry run after config changes.
- **Reproducible tooling.** Node, pnpm and Go versions are pinned with `mise`, and line endings are
  normalized to LF, so builds match on Windows and macOS.

**Performance**
- **Static export.** Pages are pre-rendered HTML; there's no Node server in production.
- **Split cache strategy.** Content-hashed build assets are served with
  `Cache-Control: public, max-age=31536000, immutable`; HTML is `no-cache`, so deploys show up
  immediately while assets stay cached at the edge and in browsers.
- **Lean media.** The hero photo is resized for the web (1600 px, ~260 KB).

**Frontend**
- **Light and dark themes.** Follows the system setting by default; a toggle saves the choice.
  An inline script applies it before first paint, so there's no flash of the wrong theme.
- **Design tokens.** Every color, size, radius and shadow comes from [DESIGN.md](DESIGN.md).
- **Mobile-first.** No horizontal scrolling at 375 px, 44 px minimum tap targets, safe-area
  insets for notched phones.
- **Accessible.** Keyboard focus rings, labeled controls, decorative graphics hidden from screen
  readers, `prefers-reduced-motion` respected.

**Security and privacy**
- **Origin IP kept out of the repo.** Deploys use an SSH alias, so the public source doesn't
  reveal the server's address behind Cloudflare.
- **Least-privilege deploys.** CI deploys as a dedicated `deploy` user that can only write the
  website folder (no sudo, no port forwarding), using its own key stored as a GitHub secret. The
  server's host key is pinned, so CI won't talk to an impostor.
- **Hardened access.** SSH is key-only (no passwords); only ports 22, 80 and 443 are open;
  security updates install automatically.
- **No leaked metadata.** Photos are re-encoded with EXIF data (including GPS location) removed.

## Architecture

The target design. Today the visitor → Cloudflare → nginx → static site path is live; the API,
database and live feed are on the [roadmap](#roadmap).

```
visitors (HTTPS, SSE)        rh-gex-trader (separate host)
        │                        │ POST /api/ingest/trades
        │                        │ bearer token + Idempotency-Key
        ▼                        │
   Cloudflare ◄──────────────────┘
        │        CDN cache for static files, no cache for /api
        │
        ▼
      nginx ──────► static site (Next.js export)
        │
        └─ /api ──► Go API ──► Postgres   source of truth
                      │
                      └─────► Redis       cache + pub/sub
```

nginx, the static site, the Go API, Postgres and Redis all run on one VM.

- **The site** is static HTML/CSS/JS served by nginx and cached at Cloudflare's edge.
- **The API** is a single Go binary. It never connects to the trader; the trader pushes events to it.
- **Postgres** stores every trade. **Redis** caches computed summaries and fans live events out
  to every open dashboard.

## rh-gex-trader live dashboard

Planned. The centerpiece: a live view of the bot's trades and performance.

- **Idempotent ingestion.** The trader sends each trade with an `Idempotency-Key`. A unique
  constraint in Postgres guarantees a retried request is stored exactly once, and the retry gets
  the original response back.
- **Concurrency.** One goroutine subscribes to new events and fans them out to every connected
  dashboard over Server-Sent Events, with backpressure so a slow client can't stall the rest.
- **Caching.** P&L summaries are computed once and cached in Redis, invalidated when a new trade
  arrives. Public read endpoints get short edge caching at Cloudflare.
- **Read-only by design.** The site holds no brokerage credentials and cannot place trades.
  Performance is shown as percentages and normalized values.

## Roadmap

- [x] Design system: tokens, type scale, components, mobile and motion rules ([DESIGN.md](DESIGN.md))
- [x] **v1:** Next.js site with intro, profile links, project cards, light/dark toggle
- [x] Deploy script: atomic releases with one-command rollback
- [x] Deploy on merge to `main` with GitHub Actions ([#1](https://github.com/chasechipres/personal-website/issues/1))
- [ ] Only accept web traffic from Cloudflare ([#2](https://github.com/chasechipres/personal-website/issues/2))
- [ ] Server hygiene: backups, unused user, update cadence ([#3](https://github.com/chasechipres/personal-website/issues/3))
- [ ] Pre-launch quality pass: custom 404, social preview, keyboard and zoom checks ([#4](https://github.com/chasechipres/personal-website/issues/4))
- [ ] Go API skeleton: health check, config, structured logging, tests ([#5](https://github.com/chasechipres/personal-website/issues/5))
- [ ] Run the API on the VM with Docker Compose ([#6](https://github.com/chasechipres/personal-website/issues/6))
- [ ] Postgres schema and idempotent trade ingestion ([#7](https://github.com/chasechipres/personal-website/issues/7))
- [ ] Redis caching and SSE live feed ([#8](https://github.com/chasechipres/personal-website/issues/8))
- [ ] Live rh-gex-trader dashboard ([#9](https://github.com/chasechipres/personal-website/issues/9))
- [ ] Live GitHub activity card ([#10](https://github.com/chasechipres/personal-website/issues/10))
- [ ] More projects, each with a short write-up

## Repo layout

```
web/      Next.js app (pages, components, project content)
deploy/   deploy script and nginx config
api/      Go service (planned)
```

## Development

Tool versions are pinned in `mise.toml` so Windows and macOS builds match.

```bash
mise install                      # Node, pnpm and Go at the pinned versions
mise exec -C web -- pnpm install
mise exec -C web -- pnpm dev      # http://localhost:3000
```

The VM is ARM (`aarch64`): Go builds will use `GOARCH=arm64`, and Docker images will be built
for `linux/arm64`.

## Deploy

**Automatic:** open a pull request; once the [CI check](.github/workflows/ci.yml) passes, squash-merge
it. The [Deploy workflow](.github/workflows/deploy.yml) then runs lint, build, deploy and a live
check. To roll back, open Actions → Deploy → Run workflow →
`rollback`.

**From a laptop** (fallback, same script CI uses):

```bash
deploy/deploy.sh             # build web/, upload a new release, switch to it, verify
deploy/deploy.sh --rollback  # switch back to the previous release
```

- Each deploy lands in `/var/www/chasechipres/releases/<timestamp>/`; a `current` symlink is
  swapped in one atomic rename, so visitors never see a half-uploaded site. The last 5 releases
  are kept.
- nginx config lives in [`deploy/nginx/chasechipres.conf`](deploy/nginx/chasechipres.conf):
  hashed assets are cached for a year, HTML always revalidates.
- `DEPLOY_HOST` (default `chasechipres-deploy`) is an SSH host for the `deploy` user, usually an
  alias in `~/.ssh/config`. The server's IP is intentionally kept out of this repo so Cloudflare
  can't be bypassed; CI reads it from the `DEPLOY_HOST_IP` secret.
- Needs `mise`, `ssh`, `tar` and `curl`. On Windows, run it from Git Bash.
