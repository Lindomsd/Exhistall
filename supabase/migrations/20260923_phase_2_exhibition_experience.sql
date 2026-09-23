-- Exhistall Phase 2: richer public discovery and owner-managed visual galleries.
-- Apply after 20260923_phase_1.sql. The gallery table and storage policies were introduced in Phase 1.

create index if not exists gallery_items_stall_created_idx
  on public.gallery_items (stall_id, created_at desc);

create index if not exists stalls_public_category_idx
  on public.stalls (status, category, featured desc, created_at desc);
