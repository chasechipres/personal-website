---
name: stop-web-server
description: Stop the local Next.js dev server on port 3000. Use when the user asks to stop or shut down the local site.
disable-model-invocation: true
---

# Stop the local dev server

1. **Running?** Find the process listening on port 3000:
   - Windows (PowerShell): `Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue`
     → `OwningProcess`.
   - macOS / Linux: `lsof -ti tcp:3000 -sTCP:LISTEN`.
   If nothing is listening, say the dev server isn't running and stop.
2. **Check it's ours.** Confirm the process is `node` (Windows: `Get-Process -Id <pid>`; macOS:
   `ps -p <pid> -o comm=`). If it's something else, tell the user what holds port 3000 and don't kill it.
3. **Stop it.** If this session started it as a background task, stop that task. Otherwise stop the
   process: `Stop-Process -Id <pid>` on Windows, `kill <pid>` on macOS / Linux.
4. **Verify.** Port 3000 should no longer be listening and `http://localhost:3000` should refuse the
   connection. Report "Dev server stopped".
