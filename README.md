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
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key; unset hides the captcha (Asclepius must have the matching secret) |
| `NEXT_PUBLIC_ALLOWED_RETURN_ORIGINS` | Extra origins the `?redirect=` param may point at, comma-separated; the store origin is always allowed |
| `NEXT_PUBLIC_STORE_URL` | Storefront origin for navbar and footer links, default `https://www.bhmhlth.com` |

## Design system dependency

`@asclepius/ui` is installed from its GitHub repo (`git+ssh://git@github.com/bohemia-health/asclepius.git#main`), so a fresh clone and Vercel both get the real package. On Vercel, set `GITHUB_TOKEN` to a fine-grained token with read access to the asclepius repo; `vercel.json` rewrites the SSH URL to HTTPS with it during install.

To work on the package and this app at the same time, link the local folder without changing `package.json`:

```bash
npm install --legacy-peer-deps --no-save ../asclepius
```

A normal `npm install` puts the GitHub copy back.

## Pages

`/signup`, `/login`, `/forgot-password`, `/reset-password`, `/verify-email`, `/consent`. The last is where Asclepius sends people when another app requests access to their account.
