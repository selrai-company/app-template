# app-template

The starting point for every app built with the Selr AI full-stack builder pack:
Next.js (App Router) + Supabase + Vercel + GitHub. The home page is a health check
proving the two things every app needs before features exist — environment variables
flow from Vercel, and the app can reach its Supabase project.

Read `CONVENTIONS.md` first — it is the one blessed path every app follows.

## Get your own copy (the golden path)

```sh
gh repo create <your-account>/<your-app> --template selrai-company/app-template --private --clone
cd <your-app>
```

No `gh` CLI? Use the green **"Use this template"** button on GitHub instead.

## Deploy

1. Import the repo at [vercel.com/new](https://vercel.com/new) (sign in with GitHub).
2. In the Vercel project, add the two environment variables from `.env.example`
   (values: Supabase dashboard → Project → Settings → API).
3. Push to `main`. Push = deploy — the live URL updates on every push.

The home page shows green ✓ across the board when envs and Supabase are wired.
Changed an env var in Vercel later? Redeploy (push anything, or Vercel → Redeploy)
for it to take effect.

## Local development

```sh
npm install
npx vercel env pull .env.local   # envs live in Vercel, never in the repo
npm run dev
```

## Layout

- `app.config.ts` — your business name (page heading + tab title)
- `app/` — pages (Next.js App Router)
- `supabase/migrations/` — committed schema migrations, applied on push to `main`
- `CONVENTIONS.md` — the blessed path this app follows
