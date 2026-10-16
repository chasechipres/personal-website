# chasechipres.com

Source for [chasechipres.com](https://chasechipres.com): a personal site, a home for my projects,
and a live dashboard for [rh-gex-trader](#rh-gex-trader-live-dashboard), my options trading bot.

> **Status:** early. The design system is in place ([DESIGN.md](DESIGN.md)); the app is being
> built in the open. See the [roadmap](#roadmap).

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js (static export), React, TypeScript |
| API | Go |
| Database | Postgres |
| Cache and live fan-out | Redis |
| Edge | Cloudflare (DNS, CDN, TLS) |
| Serving | nginx, Docker Compose |
| Hosting | Oracle Cloud, Ubuntu 24.04 on ARM (VM.Standard.A1.Flex, 1 OCPU / 6 GB) |
| CI/CD | GitHub Actions (planned) |

## Architecture

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

The centerpiece: a live view of the bot's trades and performance.

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
- [ ] **v1:** Next.js site with intro, profile links, project cards, light/dark toggle
- [ ] Deploy script: build locally, sync the static export to the VM
- [ ] Go API skeleton: health check, config, structured logging, tests
- [ ] Postgres schema and migrations for trades; idempotent ingest endpoint
- [ ] Redis caching for summaries; SSE live feed
- [ ] Live dashboard replaces the "coming soon" preview card
- [ ] GitHub Actions: test, build arm64 images, deploy on push to `main`
- [ ] Live GitHub activity card (cached GitHub API)
- [ ] More projects, each with a short write-up

## Repo layout (planned)

```
web/      Next.js app (pages, components, project content)
api/      Go service
deploy/   nginx config, docker-compose.yml
```

## Development

Tool versions will be pinned in `mise.toml` so Windows and macOS builds match. The VM is ARM
(`aarch64`): Go builds use `GOARCH=arm64`, and Docker images are built for `linux/arm64`.

## Deploy (current)

Until the deploy script lands, the live site is a static page copied to the VM by hand
(replace `<vm-ip>` with the VM's public IP from the Oracle console):

```powershell
ssh -i $HOME\.ssh\oracle.key ubuntu@<vm-ip> "rm -rf ~/site-upload && mkdir ~/site-upload"
scp -i $HOME\.ssh\oracle.key index.html style.css ubuntu@<vm-ip>:~/site-upload/
ssh -i $HOME\.ssh\oracle.key ubuntu@<vm-ip> "sudo cp -r ~/site-upload/* /var/www/html/ && sudo chown -R www-data:www-data /var/www/html"
```

Then purge the Cloudflare cache (Caching → Purge Everything) or hard-refresh.
