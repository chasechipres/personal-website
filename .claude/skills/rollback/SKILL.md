---
name: rollback
description: Roll chasechipres.com back to the previous release through the Deploy workflow. Use when the user asks to roll back or undo the last deploy.
disable-model-invocation: true
---

# Roll back the live site

Rolling back changes production, so confirm with the user before step 3.

1. **Show what's live.** If the `chasechipres-deploy` SSH alias works, run
   `ssh chasechipres-deploy "readlink /var/www/chasechipres/current; ls -1 /var/www/chasechipres/releases"`
   and show the current release and the one before it. Otherwise list recent Deploy runs:
   `gh run list -R chasechipres/personal-website --workflow deploy.yml -L 5`.
2. **Confirm.** Say which release is live and which one the rollback switches to (the previous one), and
   that only one step back is possible per rollback. Ask the user to confirm.
3. **Roll back** through GitHub Actions, the same path as the "rollback" button:
   `gh workflow run deploy.yml -R chasechipres/personal-website -f action=rollback`
4. **Watch it**: find the new run with
   `gh run list -R chasechipres/personal-website --workflow deploy.yml -L 1`, then
   `gh run watch <id> -R chasechipres/personal-website --exit-status`.
5. **Verify**: fetch `https://chasechipres.com/` and, if the SSH alias works, show the new `current`.
6. **Report** what's live now, and how to undo it: merge a fix through a PR, or run the Deploy workflow with
   `deploy` (`gh workflow run deploy.yml -R chasechipres/personal-website -f action=deploy`) to rebuild
   `main`. If the bad change is still on `main`, it needs a revert PR before the next deploy, or the next
   merge ships it again.
