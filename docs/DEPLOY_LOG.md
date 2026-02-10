# DEPLOY_LOG

> Production deploy log (Vercel). Keep this file append-only.

## 2026-02-10
- **Resolved production deployment (Vercel):** https://hrsignal-292fn55nc-agastyalabs-projects.vercel.app
- **Alias:** https://hrsignal.vercel.app
- **Notes:**
  - Deployed `main` to production (no code changes in this deploy). Confirmed `/vendors/freshteam` renders. Freshteam vendor brief benchmark-format content is live.
  - Disabled caching for HTML routes (Cache-Control: no-store / max-age=0,must-revalidate) so Safari/iOS normal refresh picks up latest deploy without hard refresh; static hashed assets remain immutable-cached.
