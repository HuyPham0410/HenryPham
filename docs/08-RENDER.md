# Deploy on Render

Create a Node Web Service connected to this repository and the `main` branch.
Leave Root Directory empty when package.json is at the repository root.

- Build command: `npm ci --omit=dev`
- Start command: `npm start`
- Health check path: `/health` (HTTP liveness only, not a database check)
- Environment: `NODE_ENV=production`, `NODE_VERSION=24`
- Secret: `CSRF_SECRET`, a private random value of at least 64 characters

Generate the secret locally with:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Save the result only in Render's environment settings. Never commit it.

Render provides `RENDER=true` and `PORT`. The application uses these to bind
to `0.0.0.0` on the assigned port, overriding any stale local HOST value.
Local development still defaults to `127.0.0.1`.
Do not use the binding address as the public URL: open Render's HTTPS URL.

For an existing service, push the fix and deploy the latest commit. The startup
log should show `http://0.0.0.0:10000` when Render supplies PORT=10000.
Test Home, Work, Resume, the CV download, and Contact over the public HTTPS URL.

Free services have ephemeral storage: local SQLite messages can disappear on
restart, redeploy, or spin-down. Use durable storage before accepting important
messages. A paid persistent disk can store the database via DATABASE_PATH;
upgrading compute alone does not persist the database.

Proxy trust is not automatically enabled. Validate the trusted proxy configuration
before relying on per-client IP rate limiting; do not blindly set TRUST_PROXY=true.
See 03-BAO-MAT-TRIEN-KHAI.md for security and backup considerations.

References:
- https://render.com/docs/environment-variables
- https://render.com/docs/web-services#port-binding
- https://render.com/docs/free
