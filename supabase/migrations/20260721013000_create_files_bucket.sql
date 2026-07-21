-- Storage pattern (builder pack, data-auth module): one private bucket
-- "files". Only signed-in users can touch it — and under owner-only auth,
-- the only signed-in user is the owner. Downloads use signed URLs; a
-- private bucket has no public links.
--
-- Note: no `alter table storage.objects ...` here — RLS is already enabled
-- on storage tables, and migrations don't own them (the statement would
-- fail with "must be owner").

insert into storage.buckets (id, name, public)
values ('files', 'files', false)
on conflict (id) do nothing;

create policy "Signed-in users can read files"
  on storage.objects for select to authenticated
  using (bucket_id = 'files');

create policy "Signed-in users can add files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'files');

create policy "Signed-in users can update files"
  on storage.objects for update to authenticated
  using (bucket_id = 'files')
  with check (bucket_id = 'files');

create policy "Signed-in users can delete files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'files');
