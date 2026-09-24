-- Exhistall: private buyer-to-stallholder quote requests.
-- Apply after 20260924_stallholder_operations.sql.

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  stall_id uuid not null references public.stalls(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  requester_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  requester_name text not null check (char_length(trim(requester_name)) between 2 and 100),
  requester_phone text not null default left(chr(32), 0),
  requester_email text not null default left(chr(32), 0),
  preferred_contact text not null default (chr(119)||chr(104)||chr(97)||chr(116)||chr(115)||chr(97)||chr(112)||chr(112))
    check (preferred_contact in (
      chr(119)||chr(104)||chr(97)||chr(116)||chr(115)||chr(97)||chr(112)||chr(112),
      chr(112)||chr(104)||chr(111)||chr(110)||chr(101),
      chr(101)||chr(109)||chr(97)||chr(105)||chr(108)
    )),
  message text not null check (char_length(trim(message)) between 10 and 2000),
  budget_note text not null default left(chr(32), 0),
  status text not null default (chr(110)||chr(101)||chr(119))
    check (status in (
      chr(110)||chr(101)||chr(119),
      chr(114)||chr(101)||chr(112)||chr(108)||chr(105)||chr(101)||chr(100),
      chr(99)||chr(108)||chr(111)||chr(115)||chr(101)||chr(100)
    )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quote_requests_contact_present check (
    char_length(trim(requester_phone)) > 0 or char_length(trim(requester_email)) > 0
  )
);

create index if not exists quote_requests_stall_status_created_idx
  on public.quote_requests (stall_id, status, created_at desc);

create or replace function public.guard_quote_request_status_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.status is not distinct from old.status then
    raise exception 'Quote request updates must change the status';
  end if;

  if new.id is distinct from old.id
    or new.stall_id is distinct from old.stall_id
    or new.product_id is distinct from old.product_id
    or new.requester_id is distinct from old.requester_id
    or new.requester_name is distinct from old.requester_name
    or new.requester_phone is distinct from old.requester_phone
    or new.requester_email is distinct from old.requester_email
    or new.preferred_contact is distinct from old.preferred_contact
    or new.message is distinct from old.message
    or new.budget_note is distinct from old.budget_note
    or new.created_at is distinct from old.created_at then
    raise exception 'Only the quote request status can be updated';
  end if;

  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists quote_requests_updated_at on public.quote_requests;
create trigger quote_requests_updated_at before update on public.quote_requests
for each row execute function public.guard_quote_request_status_update();

alter table public.quote_requests enable row level security;

drop policy if exists quote_requests_visitor_creates_for_active_stall on public.quote_requests;
drop policy if exists quote_requests_owner_reads on public.quote_requests;
drop policy if exists quote_requests_owner_updates on public.quote_requests;

create policy quote_requests_visitor_creates_for_active_stall on public.quote_requests for insert
  with check (
    auth.uid() is not null
    and quote_requests.requester_id = auth.uid()
    and exists (
      select 1 from public.stalls s
      where s.id = quote_requests.stall_id
        and s.status = ((chr(97)||chr(99)||chr(116)||chr(105)||chr(118)||chr(101))::public.stall_status)
    )
    and (
      quote_requests.product_id is null
      or exists (
        select 1 from public.products p
        where p.id = quote_requests.product_id and p.stall_id = quote_requests.stall_id
      )
    )
  );

create policy quote_requests_owner_reads on public.quote_requests for select
  using (
    exists (
      select 1 from public.stalls s
      where s.id = quote_requests.stall_id
        and (s.owner_id = auth.uid() or public.is_admin())
    )
  );

create policy quote_requests_owner_updates on public.quote_requests for update
  using (
    exists (
      select 1 from public.stalls s
      where s.id = quote_requests.stall_id
        and (s.owner_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.stalls s
      where s.id = quote_requests.stall_id
        and (s.owner_id = auth.uid() or public.is_admin())
    )
  );
