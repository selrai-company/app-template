# supabase/

Skeleton for Supabase's GitHub-linked production deploy: migration files committed to
`supabase/migrations/` are applied automatically on push to `main` (CONVENTIONS.md #4).

Empty in the template on purpose — the tracer proves env flow + connectivity only.
Schema, auth, and migration patterns are owned by the builder pack's data + auth
module (issue M2 #13 in the full-stack builder pack plan — not a CONVENTIONS.md
rule number); this directory's wiring is provisional until then.
