-- Exhistall: owner operations for catalogue, services, offers and contact readiness.
-- Apply after the Phase 1–3 migrations. This is additive and keeps existing stalls usable.

alter table public.stalls
  add column if not exists trading_hours text not null default $$$$,
  add column if not exists whatsapp text not null default $$$$,
  add column if not exists instagram text not null default $$$$,
  add column if not exists facebook text not null default $$$$;

alter table public.products
  add column if not exists listing_type text not null default $$product$$
    check (listing_type in ($$product$$, $$service$$)),
  add column if not exists category text not null default $$$$,
  add column if not exists price_note text not null default $$$$,
  add column if not exists compare_at_price numeric(12,2)
    check (compare_at_price is null or compare_at_price >= 0),
  add column if not exists is_available boolean not null default true,
  add column if not exists featured boolean not null default false,
  add column if not exists sort_order integer not null default 0;

alter table public.gallery_items
  add column if not exists caption text not null default $$$$,
  add column if not exists sort_order integer not null default 0;

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  stall_id uuid not null references public.stalls(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 2 and 120),
  description text not null default $$$$,
  image_url text not null default $$$$,
  promotion_label text not null default $$$$,
  start_at timestamptz,
  end_at timestamptz,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promotions_valid_dates check (end_at is null or start_at is null or end_at >= start_at)
);

drop trigger if exists promotions_updated_at on public.promotions;
create trigger promotions_updated_at before update on public.promotions
for each row execute function public.set_updated_at();

-- Keep unpublished catalogue items visible to their owner/admin only. The original
-- Phase 1 policy exposes every product of an active stall, so replace it explicitly.
drop policy if exists "products: visible with visible stall" on public.products;
create policy "products: visible when available" on public.products for select
  using (
    exists (
      select 1 from public.stalls s
      where s.id = products.stall_id
        and (
          s.owner_id = auth.uid()
          or public.is_admin()
          or (s.status = $$active$$ and products.is_available = true)
        )
    )
  );

create index if not exists products_stall_listing_idx
  on public.products (stall_id, listing_type, is_available, featured desc, sort_order, created_at desc);
create index if not exists gallery_items_stall_sort_idx
  on public.gallery_items (stall_id, sort_order, created_at desc);
create index if not exists promotions_stall_live_idx
  on public.promotions (stall_id, is_active, start_at, end_at, sort_order, created_at desc);

alter table public.promotions enable row level security;

create policy "promotions: visible with active stall" on public.promotions for select
  using (
    exists (
      select 1 from public.stalls s
      where s.id = promotions.stall_id
        and (
          s.owner_id = auth.uid()
          or public.is_admin()
          or (s.status = $$active$$ and promotions.is_active = true and (promotions.start_at is null or promotions.start_at <= now()) and (promotions.end_at is null or promotions.end_at >= now()))
        )
    )
  );
create policy "promotions: owner manages" on public.promotions for all
  using (exists (select 1 from public.stalls s where s.id = promotions.stall_id and s.owner_id = auth.uid()))
  with check (exists (select 1 from public.stalls s where s.id = promotions.stall_id and s.owner_id = auth.uid()));