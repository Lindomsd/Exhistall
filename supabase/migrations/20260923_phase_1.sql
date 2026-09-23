-- Exhistall Phase 1: authentication, stalls, products and moderation.
-- Apply this migration in the Supabase SQL editor before configuring the web app.
-- The first administrator is set manually at the bottom of this file.

create extension if not exists pgcrypto;

create type public.app_role as enum ('user', 'admin');
create type public.stall_status as enum ('pending_review', 'active', 'suspended', 'banned');
create type public.partnership_status as enum ('pending', 'accepted', 'declined');
create type public.media_type as enum ('image', 'video');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 100),
  email text not null,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stalls (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.profiles(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 120),
  slogan text not null default '',
  category text not null,
  logo_url text not null default '',
  banner_url text not null default '',
  description text not null default '',
  mission text not null default '',
  address text not null default '',
  latitude double precision,
  longitude double precision,
  phone text not null default '',
  email text not null default '',
  website text not null default '',
  featured boolean not null default false,
  status public.stall_status not null default 'pending_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  stall_id uuid not null references public.stalls(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 160),
  description text not null default '',
  price numeric(12,2) not null check (price >= 0),
  image_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  stall_id uuid not null references public.stalls(id) on delete cascade,
  type public.media_type not null default 'image',
  url text not null,
  thumbnail_url text,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  stall_id uuid not null references public.stalls(id) on delete cascade,
  author text not null check (char_length(trim(author)) between 2 and 100),
  rating smallint not null check (rating between 1 and 5),
  comment text not null check (char_length(trim(comment)) between 2 and 1000),
  created_at timestamptz not null default now()
);

create table public.partnership_requests (
  id uuid primary key default gen_random_uuid(),
  proposer_stall_id uuid not null references public.stalls(id) on delete cascade,
  recipient_stall_id uuid not null references public.stalls(id) on delete cascade,
  message text not null check (char_length(trim(message)) between 10 and 1500),
  status public.partnership_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint partnership_not_self check (proposer_stall_id <> recipient_stall_id)
);

create unique index one_pending_partnership_per_pair
  on public.partnership_requests (proposer_stall_id, recipient_stall_id)
  where status = 'pending';
create index stalls_public_listing_idx on public.stalls (status, featured desc, created_at desc);
create index products_stall_id_idx on public.products (stall_id);
create index partnership_requests_recipient_idx on public.partnership_requests (recipient_stall_id, status);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger stalls_updated_at before update on public.stalls
for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products
for each row execute function public.set_updated_at();
create trigger partnership_requests_updated_at before update on public.partnership_requests
for each row execute function public.set_updated_at();

-- A profile is created whenever an authenticated user is created.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger auth_user_profile
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Owners and admins may change business content; protected columns are enforced here.
create or replace function public.guard_stall_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() and (
    new.owner_id is distinct from old.owner_id
    or new.status is distinct from old.status
    or new.featured is distinct from old.featured
  ) then
    raise exception 'Only administrators can change stall ownership, status or featuring';
  end if;
  return new;
end;
$$;
create trigger stalls_guard_protected_fields before update on public.stalls
for each row execute function public.guard_stall_update();

create or replace function public.guard_partnership_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() and (
    new.proposer_stall_id is distinct from old.proposer_stall_id
    or new.recipient_stall_id is distinct from old.recipient_stall_id
    or new.message is distinct from old.message
    or old.status <> 'pending'
    or new.status not in ('accepted', 'declined')
  ) then
    raise exception 'Only a pending request can be accepted or declined by its recipient';
  end if;
  return new;
end;
$$;
create trigger partnerships_guard_fields before update on public.partnership_requests
for each row execute function public.guard_partnership_update();

-- Status changes use a narrowly scoped RPC rather than trusting the browser.
create or replace function public.admin_update_stall_status(target_stall_id uuid, next_status public.stall_status)
returns public.stalls language plpgsql security definer set search_path = public as $$
declare updated_stall public.stalls;
begin
  if not public.is_admin() then
    raise exception 'Administrator access required';
  end if;
  update public.stalls set status = next_status where id = target_stall_id
  returning * into updated_stall;
  if updated_stall.id is null then
    raise exception 'Stall not found';
  end if;
  return updated_stall;
end;
$$;

alter table public.profiles enable row level security;
alter table public.stalls enable row level security;
alter table public.products enable row level security;
alter table public.gallery_items enable row level security;
alter table public.reviews enable row level security;
alter table public.partnership_requests enable row level security;

create policy "profiles: read self or admin" on public.profiles for select
  using (id = auth.uid() or public.is_admin());
create policy "stalls: active visible publicly" on public.stalls for select
  using (status = 'active' or owner_id = auth.uid() or public.is_admin());
create policy "stalls: authenticated users create their own" on public.stalls for insert
  with check (owner_id = auth.uid() and status = 'pending_review' and featured = false);
create policy "stalls: owners or admins update" on public.stalls for update
  using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());

create policy "products: visible with visible stall" on public.products for select
  using (exists (select 1 from public.stalls s where s.id = stall_id and (s.status = 'active' or s.owner_id = auth.uid() or public.is_admin())));
create policy "products: owner creates" on public.products for insert
  with check (exists (select 1 from public.stalls s where s.id = stall_id and s.owner_id = auth.uid()));
create policy "products: owner changes" on public.products for update
  using (exists (select 1 from public.stalls s where s.id = stall_id and s.owner_id = auth.uid()))
  with check (exists (select 1 from public.stalls s where s.id = stall_id and s.owner_id = auth.uid()));
create policy "products: owner deletes" on public.products for delete
  using (exists (select 1 from public.stalls s where s.id = stall_id and s.owner_id = auth.uid()));

create policy "gallery: visible with visible stall" on public.gallery_items for select
  using (exists (select 1 from public.stalls s where s.id = stall_id and (s.status = 'active' or s.owner_id = auth.uid() or public.is_admin())));
create policy "gallery: owner manages" on public.gallery_items for all
  using (exists (select 1 from public.stalls s where s.id = stall_id and s.owner_id = auth.uid()))
  with check (exists (select 1 from public.stalls s where s.id = stall_id and s.owner_id = auth.uid()));

create policy "reviews: visible with visible stall" on public.reviews for select
  using (exists (select 1 from public.stalls s where s.id = stall_id and s.status = 'active'));
-- Phase 1 intentionally has no public review write policy.

create policy "partnerships: participants or admin read" on public.partnership_requests for select
  using (
    public.is_admin()
    or exists (select 1 from public.stalls s where s.id = proposer_stall_id and s.owner_id = auth.uid())
    or exists (select 1 from public.stalls s where s.id = recipient_stall_id and s.owner_id = auth.uid())
  );
create policy "partnerships: proposer creates" on public.partnership_requests for insert
  with check (
    exists (select 1 from public.stalls s where s.id = proposer_stall_id and s.owner_id = auth.uid())
    and exists (select 1 from public.stalls s where s.id = recipient_stall_id and s.status = 'active')
    and status = 'pending'
  );
create policy "partnerships: recipient responds" on public.partnership_requests for update
  using (public.is_admin() or exists (select 1 from public.stalls s where s.id = recipient_stall_id and s.owner_id = auth.uid()))
  with check (public.is_admin() or exists (select 1 from public.stalls s where s.id = recipient_stall_id and s.owner_id = auth.uid()));

-- Public asset bucket. Uploads are restricted to each signed-in user's folder.
insert into storage.buckets (id, name, public) values ('stall-assets', 'stall-assets', true)
on conflict (id) do update set public = true;
create policy "stall assets: public read" on storage.objects for select using (bucket_id = 'stall-assets');
create policy "stall assets: owner uploads" on storage.objects for insert to authenticated
  with check (bucket_id = 'stall-assets' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "stall assets: owner updates" on storage.objects for update to authenticated
  using (bucket_id = 'stall-assets' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'stall-assets' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "stall assets: owner deletes" on storage.objects for delete to authenticated
  using (bucket_id = 'stall-assets' and (storage.foldername(name))[1] = auth.uid()::text);

-- After creating the first administrator's account in Supabase, promote it from the SQL editor:
-- update public.profiles set role = 'admin' where email = '<administrator-email>';
