# supabase/

Skeleton for Supabase's GitHub-linked production deploy: migration files committed to
`supabase/migrations/` are applied automatically on push to `main` (CONVENTIONS.md #4).

Empty in the template on purpose — the tracer proves env flow + connectivity only.
Schema, auth, and migration patterns are owned by the data + auth module (M2 #13);
this directory's wiring is provisional until then.
