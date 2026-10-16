---
name: start-web-server
description: Start the local Next.js dev server for web/ on http://localhost:3000 in the background. Use when the user asks to start, run or preview the site locally.
disable-model-invocation: true
---

# Start the local dev server

1. **Already running?** Request `http://localhost:3000`. If it answers, say so with the URL and stop.
2. **Find mise.** Run `mise --version`. If it isn't on PATH:
   - Windows: it's usually at
     `%LOCALAPPDATA%\Microsoft\WinGet\Packages\jdx.mise_Microsoft.Winget.Source_8wekyb3d8bbwe\mise\bin\mise.exe`.
   - macOS: `~/.local/bin/mise` or `$(brew --prefix)/bin/mise`.
   If it's missing entirely, tell the user to install it (`winget install jdx.mise` or `brew install mise`)
   and stop.
3. **Dependencies.** If `web/node_modules` doesn't exist, run `mise exec -C web -- pnpm install` first.
4. **Start it in the background** from the repo root, with telemetry off:
   `mise exec -C web -- pnpm dev --port 3000` (set `NEXT_TELEMETRY_DISABLED=1`). Run it as a background
   command so the session stays usable.
5. **Wait until it answers**: request `http://localhost:3000` every couple of seconds, up to ~30 s. If it
   never comes up, show the last lines of the server output and stop.
6. Report: "Dev server running at http://localhost:3000". Mention `/stop-web-server` to stop it.
