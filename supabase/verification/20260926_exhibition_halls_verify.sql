-- Exhistall Exhibition Halls: read-only structural verification
-- Run after 20260926_exhibition_halls.sql.

SELECT
  to_regclass('public.exhibitions') AS exhibitions_table,
  to_regclass('public.exhibition_stalls') AS exhibition_stalls_table,
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.exhibitions'::regclass) AS exhibitions_rls_enabled,
  (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.exhibition_stalls'::regclass) AS exhibition_stalls_rls_enabled;

SELECT table_name, column_name, data_type, udt_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('exhibitions', 'exhibition_stalls')
ORDER BY table_name, ordinal_position;

SELECT conrelid::regclass AS table_name, conname AS constraint_name, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid IN ('public.exhibitions'::regclass, 'public.exhibition_stalls'::regclass)
ORDER BY conrelid::regclass::text, conname;

SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('exhibitions', 'exhibition_stalls')
ORDER BY tablename, policyname;

SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('exhibitions', 'exhibition_stalls')
ORDER BY tablename, indexname;

SELECT tgrelid::regclass AS table_name, tgname AS trigger_name, pg_get_triggerdef(oid) AS definition
FROM pg_trigger
WHERE tgrelid = 'public.exhibitions'::regclass
  AND NOT tgisinternal;
