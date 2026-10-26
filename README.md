# authOS

Bohemia Health's account site: sign up, log in, email verification, password reset, and OAuth consent for every Bohemia app. Served at `auth.bhmhlth.com`.

It holds no auth logic and no database. Every call goes to the Asclepius API (`/auth/*`) through the Better Auth client in `src/lib/auth-client.ts`. The look comes from the shared design system, `@asclepius/ui`.

## Run locally

```bash
npm install --legacy-peer-deps
cp .env.example .env
npm run dev            # http://localhost:3000, expects Asclepius on :8787
```

## Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Asclepius origin, `http://localhost:8787` locally, `https://api.bhmhlth.com` in production |
| `NEXT_PUBLIC_STORE_URL` | Storefront origin for navbar and footer links, default `https://www.bhmhlth.com` |

## Pages

`/signup`, `/login`, `/forgot-password`, `/reset-password`, `/verify-email`, `/consent`. The last is where Asclepius sends people when another app requests access to their account.
