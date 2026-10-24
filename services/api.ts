import { requireSupabase } from '../supabaseClient';
import type {
  Exhibition,
  ExhibitionBookingRequest,
  ExhibitionBookingRequestInput,
  ExhibitionBookingStatus,
  ExhibitionInput,
  GalleryItem,
  PartnershipRequest,
  Product,
  ProductInput,
  Promotion,
  PromotionInput,
  QuoteRequest,
  QuoteRequestInput,
  QuoteRequestStatus,
  Stall,
  StallInput,
  User,
} from '../types';

/** A row shape returned by Supabase's JSON API (snake_case, loosely typed at the boundary). */
type DbRow = Record<string, any>;

const STALL_SELECT = '*, products(*), promotions(*), gallery_items(*), reviews(*)';
const EXHIBITION_SELECT = `*, exhibition_stalls(booth_label, sort_order, stalls(${STALL_SELECT}))`;

/* ------------------------------------------------------------------ */
/* Row -> domain mappers                                               */
/* ------------------------------------------------------------------ */

function mapProduct(row: DbRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    imageUrl: row.image_url,
    listingType: row.listing_type ?? 'product',
    category: row.category ?? '',
    priceNote: row.price_note ?? '',
    compareAtPrice: row.compare_at_price == null ? undefined : Number(row.compare_at_price),
    isAvailable: row.is_available ?? true,
    featured: row.featured ?? false,
    sortOrder: row.sort_order ?? 0,
  };
}

function mapPromotion(row: DbRow): Promotion {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    promotionLabel: row.promotion_label,
    startAt: row.start_at ?? undefined,
    endAt: row.end_at ?? undefined,
    isActive: row.is_active,
    sortOrder: row.sort_order ?? 0,
  };
}

function mapGalleryItem(row: DbRow): GalleryItem {
  return {
    id: row.id,
    type: row.type,
    url: row.url,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    caption: row.caption ?? '',
    sortOrder: row.sort_order ?? 0,
  };
}

function mapStall(row: DbRow): Stall {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    slogan: row.slogan,
    category: row.category,
    logo_url: row.logo_url,
    banner_url: row.banner_url,
    description: row.description,
    mission: row.mission,
    products: (row.products ?? [])
      .map(mapProduct)
      .sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      ),
    promotions: (row.promotions ?? []).map(mapPromotion).sort((a, b) => a.sortOrder - b.sortOrder),
    gallery: (row.gallery_items ?? [])
      .map(mapGalleryItem)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    reviews: (row.reviews ?? []).map((review: DbRow) => ({
      id: review.id,
      author: review.author,
      rating: review.rating,
      comment: review.comment,
      date: review.created_at,
    })),
    location: {
      address: row.address,
      lat: row.latitude ?? 0,
      lng: row.longitude ?? 0,
    },
    contact: {
      phone: row.phone,
      email: row.email,
      website: row.website,
      whatsapp: row.whatsapp ?? '',
      instagram: row.instagram ?? '',
      facebook: row.facebook ?? '',
    },
    tradingHours: row.trading_hours ?? '',
    featured: row.featured,
    status: row.status,
  };
}

function mapExhibition(row: DbRow): Exhibition {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    heroImageUrl: row.hero_image_url ?? '',
    location: row.location ?? '',
    startsAt: row.starts_at ?? undefined,
    endsAt: row.ends_at ?? undefined,
    status: row.status,
    sortOrder: row.sort_order ?? 0,
    stalls: (row.exhibition_stalls ?? [])
      .filter((entry: DbRow) => entry.stalls)
      .map((entry: DbRow) => ({
        stall: mapStall(entry.stalls),
        boothLabel: entry.booth_label || undefined,
        sortOrder: entry.sort_order ?? 0,
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

function mapQuoteRequest(row: DbRow): QuoteRequest {
  return {
    id: row.id,
    stallId: row.stall_id,
    productId: row.product_id ?? undefined,
    productName: row.products?.name,
    requesterName: row.requester_name,
    requesterPhone: row.requester_phone ?? '',
    requesterEmail: row.requester_email ?? '',
    preferredContact: row.preferred_contact,
    message: row.message,
    budgetNote: row.budget_note ?? '',
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapBookingRequest(row: DbRow): ExhibitionBookingRequest {
  return {
    id: row.id,
    exhibitionId: row.exhibition_id,
    exhibitionTitle: row.exhibitions?.title,
    stallId: row.stall_id ?? undefined,
    stallName: row.stalls?.name,
    businessName: row.business_name,
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone,
    requestedPackage: row.requested_package,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

async function mapPartnershipRequest(row: DbRow): Promise<PartnershipRequest> {
  const [proposerStall, recipientStall] = await Promise.all([
    getStallById(row.proposer_stall_id),
    getStallById(row.recipient_stall_id),
  ]);
  return {
    id: row.id,
    proposerStallId: row.proposer_stall_id,
    recipientStallId: row.recipient_stall_id,
    proposerStall: proposerStall ?? undefined,
    recipientStall: recipientStall ?? undefined,
    message: row.message,
    status: row.status,
    date: row.created_at,
  };
}

async function toUser(
  sessionUser: { id: string; email?: string | null } | null | undefined,
): Promise<User | null> {
  if (!sessionUser) return null;
  const client = requireSupabase();

  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('id, name, email, role')
    .eq('id', sessionUser.id)
    .maybeSingle();
  if (profileError) throw profileError;

  const { data: stall, error: stallError } = await client
    .from('stalls')
    .select('id')
    .eq('owner_id', sessionUser.id)
    .maybeSingle();
  if (stallError) throw stallError;

  return {
    id: sessionUser.id,
    email: profile?.email ?? sessionUser.email ?? undefined,
    name: profile?.name ?? sessionUser.email?.split('@')[0] ?? 'Member',
    role: profile?.role ?? 'user',
    stallId: stall?.id,
  };
}

/* ------------------------------------------------------------------ */
/* Domain -> row builders (only include provided fields)              */
/* ------------------------------------------------------------------ */

function toStallRow(input: Partial<StallInput>): DbRow {
  const row: DbRow = {};
  if (input.name !== undefined) row.name = input.name.trim();
  if (input.slogan !== undefined) row.slogan = input.slogan.trim();
  if (input.category !== undefined) row.category = input.category;
  if (input.logo_url !== undefined) row.logo_url = input.logo_url.trim();
  if (input.banner_url !== undefined) row.banner_url = input.banner_url.trim();
  if (input.description !== undefined) row.description = input.description.trim();
  if (input.mission !== undefined) row.mission = input.mission.trim();
  if (input.location?.address !== undefined) row.address = input.location.address.trim();
  if (input.location?.lat !== undefined) row.latitude = input.location.lat;
  if (input.location?.lng !== undefined) row.longitude = input.location.lng;
  if (input.contact?.phone !== undefined) row.phone = input.contact.phone.trim();
  if (input.contact?.email !== undefined) row.email = input.contact.email.trim();
  if (input.contact?.website !== undefined) row.website = input.contact.website.trim();
  if (input.contact?.whatsapp !== undefined) row.whatsapp = input.contact.whatsapp.trim();
  if (input.contact?.instagram !== undefined) row.instagram = input.contact.instagram.trim();
  if (input.contact?.facebook !== undefined) row.facebook = input.contact.facebook.trim();
  if (input.tradingHours !== undefined) row.trading_hours = input.tradingHours.trim();
  return row;
}

function toProductRow(input: Partial<ProductInput>): DbRow {
  const row: DbRow = {};
  if (input.name !== undefined) row.name = input.name.trim();
  if (input.description !== undefined) row.description = input.description.trim();
  if (input.price !== undefined) row.price = input.price;
  if (input.imageUrl !== undefined) row.image_url = input.imageUrl.trim();
  if (input.listingType !== undefined) row.listing_type = input.listingType;
  if (input.category !== undefined) row.category = input.category.trim();
  if (input.priceNote !== undefined) row.price_note = input.priceNote.trim();
  // compareAtPrice may be intentionally set to null, so check presence not value.
  if (Object.prototype.hasOwnProperty.call(input, 'compareAtPrice')) {
    row.compare_at_price = input.compareAtPrice ?? null;
  }
  if (input.isAvailable !== undefined) row.is_available = input.isAvailable;
  if (input.featured !== undefined) row.featured = input.featured;
  if (input.sortOrder !== undefined) row.sort_order = input.sortOrder;
  return row;
}

function toPromotionRow(input: Partial<PromotionInput>): DbRow {
  const row: DbRow = {};
  if (input.title !== undefined) row.title = input.title.trim();
  if (input.description !== undefined) row.description = input.description.trim();
  if (input.imageUrl !== undefined) row.image_url = input.imageUrl.trim();
  if (input.promotionLabel !== undefined) row.promotion_label = input.promotionLabel.trim();
  if (input.startAt !== undefined) row.start_at = input.startAt || null;
  if (input.endAt !== undefined) row.end_at = input.endAt || null;
  if (input.isActive !== undefined) row.is_active = input.isActive;
  if (input.sortOrder !== undefined) row.sort_order = input.sortOrder;
  return row;
}

function toExhibitionRow(input: Partial<ExhibitionInput>): DbRow {
  const row: DbRow = {};
  if (input.title !== undefined) row.title = input.title.trim();
  if (input.description !== undefined) row.description = input.description.trim();
  if (input.heroImageUrl !== undefined) row.hero_image_url = input.heroImageUrl.trim();
  if (input.location !== undefined) row.location = input.location.trim();
  if (input.startsAt !== undefined) row.starts_at = input.startsAt || null;
  if (input.endsAt !== undefined) row.ends_at = input.endsAt || null;
  if (input.status !== undefined) row.status = input.status;
  if (input.sortOrder !== undefined) row.sort_order = input.sortOrder;
  return row;
}

function toQuoteRow(input: QuoteRequestInput): DbRow {
  return {
    requester_name: input.requesterName.trim(),
    requester_phone: input.requesterPhone.trim(),
    requester_email: input.requesterEmail.trim(),
    preferred_contact: input.preferredContact,
    ...(input.productId ? { product_id: input.productId } : {}),
    message: input.message.trim(),
    budget_note: input.budgetNote.trim(),
  };
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export interface AdminMfaState {
  enrolled: boolean;
  verified: boolean;
  factorId?: string;
  pendingFactorId?: string;
}

async function getAdminMfaState(): Promise<AdminMfaState> {
  const client = requireSupabase();
  const [aal, factors] = await Promise.all([
    client.auth.mfa.getAuthenticatorAssuranceLevel(),
    client.auth.mfa.listFactors(),
  ]);
  if (aal.error) throw aal.error;
  if (factors.error) throw factors.error;

  const totp = factors.data.totp[0];
  const pending = factors.data.all.find(
    (factor) => factor.factor_type === 'totp' && factor.status === 'unverified',
  );
  return {
    enrolled: Boolean(totp),
    verified: aal.data.currentLevel === 'aal2',
    factorId: totp?.id,
    pendingFactorId: pending?.id,
  };
}

async function enrolAdminMfa(): Promise<{ factorId: string; qrCode: string }> {
  const state = await getAdminMfaState();
  if (state.pendingFactorId) {
    throw new Error(
      'Two-factor setup is already waiting for verification. Enter a code from the authenticator entry you scanned to finish setup.',
    );
  }
  const { data, error } = await requireSupabase().auth.mfa.enroll({
    factorType: 'totp',
    friendlyName: 'Exhistall administrator',
  });
  if (error) throw error;
  return { factorId: data.id, qrCode: data.totp.qr_code };
}

async function verifyAdminMfa(factorId: string, code: string): Promise<void> {
  const client = requireSupabase();
  const { data, error: challengeError } = await client.auth.mfa.challenge({ factorId });
  if (challengeError) throw challengeError;
  const { error: verifyError } = await client.auth.mfa.verify({
    factorId,
    challengeId: data.id,
    code,
  });
  if (verifyError) throw verifyError;
}

async function getStalls(): Promise<Stall[]> {
  const { data, error } = await requireSupabase()
    .from('stalls')
    .select(STALL_SELECT)
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapStall);
}

async function getAllStallsForAdmin(): Promise<Stall[]> {
  const { data, error } = await requireSupabase()
    .from('stalls')
    .select(STALL_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapStall);
}

async function getExhibitions(): Promise<Exhibition[]> {
  const { data, error } = await requireSupabase()
    .from('exhibitions')
    .select(EXHIBITION_SELECT)
    .eq('status', 'published')
    .order('starts_at', { ascending: true, nullsFirst: false })
    .order('sort_order');
  if (error) throw error;
  return (data ?? [])
    .map(mapExhibition)
    .filter((exhibition) => !exhibition.endsAt || new Date(exhibition.endsAt) >= new Date());
}

async function getAllExhibitionsForAdmin(): Promise<Exhibition[]> {
  const { data, error } = await requireSupabase()
    .from('exhibitions')
    .select(EXHIBITION_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapExhibition);
}

async function createExhibition(input: ExhibitionInput): Promise<Exhibition> {
  const { data, error } = await requireSupabase()
    .from('exhibitions')
    .insert(toExhibitionRow(input))
    .select(EXHIBITION_SELECT)
    .single();
  if (error) throw error;
  return mapExhibition(data);
}

async function updateExhibition(
  id: string,
  input: Partial<ExhibitionInput>,
): Promise<Exhibition | null> {
  const { data, error } = await requireSupabase()
    .from('exhibitions')
    .update(toExhibitionRow(input))
    .eq('id', id)
    .select(EXHIBITION_SELECT)
    .maybeSingle();
  if (error) throw error;
  return data ? mapExhibition(data) : null;
}

async function deleteExhibition(id: string): Promise<void> {
  const { error } = await requireSupabase().from('exhibitions').delete().eq('id', id);
  if (error) throw error;
}

async function assignStallToExhibition(
  exhibitionId: string,
  stallId: string,
  boothLabel = '',
  sortOrder = 0,
): Promise<void> {
  const { error } = await requireSupabase().from('exhibition_stalls').insert({
    exhibition_id: exhibitionId,
    stall_id: stallId,
    booth_label: boothLabel.trim(),
    sort_order: sortOrder,
  });
  if (error) throw error;
}

async function removeStallFromExhibition(exhibitionId: string, stallId: string): Promise<void> {
  const { error } = await requireSupabase()
    .from('exhibition_stalls')
    .delete()
    .eq('exhibition_id', exhibitionId)
    .eq('stall_id', stallId);
  if (error) throw error;
}

async function createExhibitionBookingRequest(
  exhibitionId: string,
  input: ExhibitionBookingRequestInput,
): Promise<ExhibitionBookingRequest> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Please sign in before requesting an exhibition stall.');
  const { data, error } = await requireSupabase()
    .from('exhibition_booking_requests')
    .insert({
      exhibition_id: exhibitionId,
      requester_id: user.id,
      ...(user.stallId ? { stall_id: user.stallId } : {}),
      business_name: input.businessName.trim(),
      contact_name: input.contactName.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      requested_package: input.requestedPackage,
      message: input.message.trim(),
    })
    .select('*, exhibitions(title), stalls(name)')
    .single();
  if (error) throw error;
  return mapBookingRequest(data);
}

async function getExhibitionBookingRequestsForAdmin(): Promise<ExhibitionBookingRequest[]> {
  const { data, error } = await requireSupabase()
    .from('exhibition_booking_requests')
    .select('*, exhibitions(title), stalls(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapBookingRequest);
}

async function updateExhibitionBookingRequestStatus(
  id: string,
  status: ExhibitionBookingStatus,
): Promise<ExhibitionBookingRequest | null> {
  const { data, error } = await requireSupabase()
    .from('exhibition_booking_requests')
    .update({ status })
    .eq('id', id)
    .select('*, exhibitions(title), stalls(name)')
    .maybeSingle();
  if (error) throw error;
  return data ? mapBookingRequest(data) : null;
}

async function getStallById(id: string): Promise<Stall | null> {
  const { data, error } = await requireSupabase()
    .from('stalls')
    .select(STALL_SELECT)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapStall(data) : null;
}

async function login(email: string, password: string): Promise<User | null> {
  const { data, error } = await requireSupabase().auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) return null;
  return toUser(data.user);
}

async function signUp(
  name: string,
  email: string,
  password: string,
): Promise<{ user: User | null; confirmationRequired: boolean }> {
  const { data, error } = await requireSupabase().auth.signUp({
    email: email.trim(),
    password,
    options: { data: { name: name.trim() } },
  });
  if (error) throw error;
  return {
    user: data.session ? await toUser(data.user) : null,
    confirmationRequired: !data.session,
  };
}

async function logout(): Promise<void> {
  const { error } = await requireSupabase().auth.signOut();
  if (error) throw error;
}

async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await requireSupabase().auth.getUser();
  if (error) return null;
  return toUser(data.user);
}

async function getUsers(): Promise<User[]> {
  const client = requireSupabase();
  const { data: profiles, error: profilesError } = await client
    .from('profiles')
    .select('id, name, email, role')
    .order('created_at', { ascending: false });
  if (profilesError) throw profilesError;

  const { data: stalls, error: stallsError } = await client.from('stalls').select('id, owner_id');
  if (stallsError) throw stallsError;

  const stallIdByOwner = new Map<string, string>(
    (stalls ?? []).map((stall: DbRow) => [stall.owner_id, stall.id]),
  );
  return (profiles ?? []).map((profile: DbRow): User => ({
    id: profile.id,
    email: profile.email ?? undefined,
    name: profile.name,
    role: profile.role ?? 'user',
    stallId: stallIdByOwner.get(profile.id),
  }));
}

async function createStall(input: StallInput): Promise<Stall> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Please sign in before creating a stall.');
  if (user.stallId) throw new Error('You already have a stall.');
  const { data, error } = await requireSupabase()
    .from('stalls')
    .insert({ ...toStallRow(input), owner_id: user.id, status: 'pending_review', featured: false })
    .select(STALL_SELECT)
    .single();
  if (error) throw error;
  return mapStall(data);
}

async function updateStall(id: string, input: Partial<StallInput>): Promise<Stall | null> {
  const { data, error } = await requireSupabase()
    .from('stalls')
    .update(toStallRow(input))
    .eq('id', id)
    .select(STALL_SELECT)
    .maybeSingle();
  if (error) throw error;
  return data ? mapStall(data) : null;
}

async function updateStallStatus(id: string, status: Stall['status']): Promise<Stall | null> {
  const { data, error } = await requireSupabase().rpc('admin_update_stall_status', {
    target_stall_id: id,
    next_status: status,
  });
  if (error) throw error;
  return data ? getStallById(id) : null;
}

async function proposePartnership(
  proposerStall: Stall,
  recipientStall: Stall,
  message: string,
): Promise<PartnershipRequest> {
  const { data, error } = await requireSupabase()
    .from('partnership_requests')
    .insert({
      proposer_stall_id: proposerStall.id,
      recipient_stall_id: recipientStall.id,
      message: message.trim(),
      status: 'pending',
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapPartnershipRequest(data);
}

async function getPartnershipRequestsForStall(stallId: string): Promise<PartnershipRequest[]> {
  const { data, error } = await requireSupabase()
    .from('partnership_requests')
    .select('*')
    .or(`proposer_stall_id.eq.${stallId},recipient_stall_id.eq.${stallId}`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return Promise.all((data ?? []).map(mapPartnershipRequest));
}

async function updatePartnershipRequestStatus(
  id: string,
  status: PartnershipRequest['status'],
): Promise<PartnershipRequest | null> {
  const { data, error } = await requireSupabase()
    .from('partnership_requests')
    .update({ status })
    .eq('id', id)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data ? mapPartnershipRequest(data) : null;
}

async function addGalleryItem(stallId: string, url: string): Promise<Stall> {
  const { error } = await requireSupabase()
    .from('gallery_items')
    .insert({ stall_id: stallId, type: 'image', url: url.trim() });
  if (error) throw error;
  return requireStall(stallId);
}

async function deleteGalleryItem(stallId: string, itemId: string): Promise<Stall> {
  const { error } = await requireSupabase()
    .from('gallery_items')
    .delete()
    .eq('id', itemId)
    .eq('stall_id', stallId);
  if (error) throw error;
  return requireStall(stallId);
}

async function addProduct(stallId: string, input: ProductInput): Promise<Stall> {
  const { error } = await requireSupabase()
    .from('products')
    .insert({ stall_id: stallId, ...toProductRow(input) });
  if (error) throw error;
  return requireStall(stallId);
}

async function updateProduct(
  stallId: string,
  productId: string,
  input: Partial<ProductInput>,
): Promise<Stall> {
  const { error } = await requireSupabase()
    .from('products')
    .update(toProductRow(input))
    .eq('id', productId)
    .eq('stall_id', stallId);
  if (error) throw error;
  return requireStall(stallId);
}

async function deleteProduct(stallId: string, productId: string): Promise<Stall> {
  const { error } = await requireSupabase()
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('stall_id', stallId);
  if (error) throw error;
  return requireStall(stallId);
}

async function addPromotion(stallId: string, input: PromotionInput): Promise<Stall> {
  const { error } = await requireSupabase()
    .from('promotions')
    .insert({ stall_id: stallId, ...toPromotionRow(input) });
  if (error) throw error;
  return requireStall(stallId);
}

async function updatePromotion(
  stallId: string,
  promotionId: string,
  input: Partial<PromotionInput>,
): Promise<Stall> {
  const { error } = await requireSupabase()
    .from('promotions')
    .update(toPromotionRow(input))
    .eq('id', promotionId)
    .eq('stall_id', stallId);
  if (error) throw error;
  return requireStall(stallId);
}

async function deletePromotion(stallId: string, promotionId: string): Promise<Stall> {
  const { error } = await requireSupabase()
    .from('promotions')
    .delete()
    .eq('id', promotionId)
    .eq('stall_id', stallId);
  if (error) throw error;
  return requireStall(stallId);
}

async function createQuoteRequest(stallId: string, input: QuoteRequestInput): Promise<void> {
  const { error } = await requireSupabase()
    .from('quote_requests')
    .insert({ stall_id: stallId, ...toQuoteRow(input) });
  if (error) throw error;
}

async function getQuoteRequestsForStall(stallId: string): Promise<QuoteRequest[]> {
  const { data, error } = await requireSupabase()
    .from('quote_requests')
    .select('*, products(name)')
    .eq('stall_id', stallId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapQuoteRequest);
}

async function updateQuoteRequestStatus(
  id: string,
  status: QuoteRequestStatus,
): Promise<QuoteRequest | null> {
  const { data, error } = await requireSupabase()
    .from('quote_requests')
    .update({ status })
    .eq('id', id)
    .select('*, products(name)')
    .maybeSingle();
  if (error) throw error;
  return data ? mapQuoteRequest(data) : null;
}

/** Stall id is always valid right after a mutation; surface a clear error instead of `null`. */
async function requireStall(id: string): Promise<Stall> {
  const stall = await getStallById(id);
  if (!stall) throw new Error('Stall could not be reloaded after the change.');
  return stall;
}

export const api = {
  // admin MFA
  getAdminMfaState,
  enrolAdminMfa,
  verifyAdminMfa,
  // public catalogue
  getStalls,
  getStallById,
  getExhibitions,
  // stallholder operations
  createStall,
  updateStall,
  addProduct,
  updateProduct,
  deleteProduct,
  addPromotion,
  updatePromotion,
  deletePromotion,
  addGalleryItem,
  deleteGalleryItem,
  // networking + quotes
  proposePartnership,
  getPartnershipRequestsForStall,
  updatePartnershipRequestStatus,
  createQuoteRequest,
  getQuoteRequestsForStall,
  updateQuoteRequestStatus,
  // exhibitions (admin)
  getAllStallsForAdmin,
  getAllExhibitionsForAdmin,
  createExhibition,
  updateExhibition,
  deleteExhibition,
  assignStallToExhibition,
  removeStallFromExhibition,
  createExhibitionBookingRequest,
  getExhibitionBookingRequestsForAdmin,
  updateExhibitionBookingRequestStatus,
  // admin
  updateStallStatus,
  getUsers,
  // auth
  login,
  signUp,
  logout,
  getCurrentUser,
};
