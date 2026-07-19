# CONVENTIONS — the one blessed path

> **DRAFT** — pending Harvey's R&D deep-dive sign-off (M1 gate). Canonical copy travels inside
> every generated app via `app-template`. Every pack skill quotes this doc.
>
> Scope tags: **[A]** = individual-attendee-specific, **[O]** = org-compatible as-is. The
> company-training variant must be an extension of the [O] set, not a rewrite.

## The path

1. **One repo per app.** [O] Every app is exactly one GitHub repository, born private under the
   owner's own account from the `selrai-company/app-template` template.
2. **GitHub is the source of truth.** [O] If it isn't committed and pushed, it doesn't exist.
   No local-only apps, no drag-and-drop deploys, no second hosting target.
3. **`main` is production.** [A] Main-only — no branches, no PRs, no preview flow in v1.
   (Org variant may need a branch flow — that's an extension decision for the deep-dive.)
4. **Push = deploy, for code AND schema.** [O]
   - Code: Vercel's GitHub integration builds and ships every push to `main`.
   - Schema: Supabase's GitHub-linked production deploy applies committed migration files in
     `supabase/migrations/` on push to `main` (free-plan feature). Schema never changes except
     from a committed migration.
   - Deploys happen only via `git push` — never `vercel deploy`, never the dashboard.
5. **The undo is Vercel's one-click rollback.** [O] It covers **code only** — data/schema
   recovery is Claude-assisted restore from the pre-migration export (owned by app-iterate, M2).
6. **Envs live in Vercel.** [O] Set environment variables in the Vercel project; pull them
   locally with `vercel env pull`. No secrets in the repo — `.env*` is gitignored;
   `.env.example` documents the required names.
7. **One Supabase project per app.** [A] Free-tier cliffs, stated up front:
   - **Project cap**: ~2 active free projects per org — the 3rd app, or the first app the
     business actually uses, triggers Supabase Pro ($25/mo + usage-based compute beyond the
     included quota — never quote it as a flat price).
   - **Auto-pause**: free projects pause after ~1 week idle → the app breaks with opaque 500s.
     Unpause from the Supabase dashboard; deploy-doctor (M4) detects this.
8. **GitHub SSO chains all identity.** [A] Vercel and Supabase sign in with GitHub — one
   account to protect instead of three. Mandatory: business email the owner controls, 2FA
   enabled, recovery codes saved (owner names where). Claude never sees the codes.
9. **Vercel Hobby is an evaluation tier only.** [A] Personal-audience only (family/friends —
   no customer traffic, no links from the business site). Any app the business will actually
   use or promote goes to Vercel Pro ($20/mo) **before** that happens.
