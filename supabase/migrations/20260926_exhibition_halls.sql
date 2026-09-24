-- Exhistall: Exhibition Halls
-- Additive migration. Apply after the existing Phase 1, Phase 2, Phase 3,
-- stallholder operations and quote-request migrations.
-- Administrators create, publish and curate halls. Stallholders cannot alter halls or assignments.

DO $$
BEGIN
  CREATE TYPE public.exhibition_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END;
$$;

CREATE TABLE IF NOT EXISTS public.exhibitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(trim(title)) BETWEEN 2 AND 140),
  description text NOT NULL DEFAULT '',
  hero_image_url text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  starts_at timestamptz,
  ends_at timestamptz,
  status public.exhibition_status NOT NULL DEFAULT 'draft',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT exhibitions_valid_dates CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at >= starts_at)
);

CREATE TABLE IF NOT EXISTS public.exhibition_stalls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exhibition_id uuid NOT NULL REFERENCES public.exhibitions(id) ON DELETE CASCADE,
  stall_id uuid NOT NULL REFERENCES public.stalls(id) ON DELETE CASCADE,
  booth_label text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT exhibition_stalls_unique_assignment UNIQUE (exhibition_id, stall_id),
  CONSTRAINT exhibition_stalls_booth_label_length CHECK (char_length(trim(booth_label)) <= 80)
);

DROP TRIGGER IF EXISTS exhibitions_updated_at ON public.exhibitions;
CREATE TRIGGER exhibitions_updated_at
BEFORE UPDATE ON public.exhibitions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS exhibitions_public_listing_idx
  ON public.exhibitions (status, ends_at, starts_at, sort_order, created_at DESC);
CREATE INDEX IF NOT EXISTS exhibition_stalls_exhibition_sort_idx
  ON public.exhibition_stalls (exhibition_id, sort_order, created_at);
CREATE INDEX IF NOT EXISTS exhibition_stalls_stall_idx
  ON public.exhibition_stalls (stall_id, exhibition_id);

ALTER TABLE public.exhibitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exhibition_stalls ENABLE ROW LEVEL SECURITY;

-- Published halls remain discoverable before and during their dates. Once an end
-- date has passed, an administrator must archive or republish deliberately.
DROP POLICY IF EXISTS "exhibitions: public published read" ON public.exhibitions;
CREATE POLICY "exhibitions: public published read" ON public.exhibitions FOR SELECT
  USING (
    public.is_admin()
    OR (
      status = 'published'::public.exhibition_status
      AND (ends_at IS NULL OR ends_at >= now())
    )
  );

DROP POLICY IF EXISTS "exhibitions: admin manages" ON public.exhibitions;
CREATE POLICY "exhibitions: admin manages" ON public.exhibitions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- An assignment is visible only where its hall is publicly visible and the
-- assigned stall is active. Assigned stallholders can see their own assignment.
DROP POLICY IF EXISTS "exhibition stalls: visible when hall and stall are public" ON public.exhibition_stalls;
CREATE POLICY "exhibition stalls: visible when hall and stall are public" ON public.exhibition_stalls FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.stalls owned_stall
      WHERE owned_stall.id = exhibition_stalls.stall_id
        AND owned_stall.owner_id = auth.uid()
    )
    OR (
      EXISTS (
        SELECT 1 FROM public.exhibitions hall
        WHERE hall.id = exhibition_stalls.exhibition_id
          AND hall.status = 'published'::public.exhibition_status
          AND (hall.ends_at IS NULL OR hall.ends_at >= now())
      )
      AND EXISTS (
        SELECT 1 FROM public.stalls public_stall
        WHERE public_stall.id = exhibition_stalls.stall_id
          AND public_stall.status = 'active'::public.stall_status
      )
    )
  );

DROP POLICY IF EXISTS "exhibition stalls: admin manages" ON public.exhibition_stalls;
CREATE POLICY "exhibition stalls: admin manages" ON public.exhibition_stalls FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
