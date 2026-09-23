import { requireSupabase } from '../supabaseClient';
import type { GalleryItem, PartnershipRequest, Product, ProductInput, Review, Stall, StallInput, User } from '../types';

type DbProfile = { id: string; name: string; email: string; role: 'user' | 'admin' };
type DbProduct = { id: string; name: string; description: string; price: number | string; image_url: string };
type DbGallery = { id: string; type: 'image' | 'video'; url: string; thumbnail_url?: string | null };
type DbReview = { id: string; author: string; rating: number; comment: string; created_at: string };
type DbStall = {
  id: string; owner_id: string; name: string; slogan: string; category: string;
  logo_url: string; banner_url: string; description: string; mission: string;
  address: string; latitude: number | null; longitude: number | null;
  phone: string; email: string; website: string; featured: boolean;
  status: Stall['status']; products?: DbProduct[]; gallery_items?: DbGallery[]; reviews?: DbReview[];
};
type DbPartnership = {
  id: string; proposer_stall_id: string; recipient_stall_id: string;
  message: string; status: PartnershipRequest['status']; created_at: string;
};

export type AdminMfaState = {
  enrolled: boolean;
  verified: boolean;
  factorId?: string;
};

const stallSelect = '*, products(*), gallery_items(*), reviews(*)';

const toProduct = (row: DbProduct): Product => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: Number(row.price),
  imageUrl: row.image_url,
});

const toStall = (row: DbStall): Stall => ({
  id: row.id,
  ownerId: row.owner_id,
  name: row.name,
  slogan: row.slogan,
  category: row.category,
  logo_url: row.logo_url,
  banner_url: row.banner_url,
  description: row.description,
  mission: row.mission,
  products: (row.products ?? []).map(toProduct),
  gallery: (row.gallery_items ?? []).map((item): GalleryItem => ({
    id: item.id,
    type: item.type,
    url: item.url,
    thumbnailUrl: item.thumbnail_url ?? undefined,
  })),
  reviews: (row.reviews ?? []).map((review): Review => ({
    id: review.id,
    author: review.author,
    rating: review.rating,
    comment: review.comment,
    date: review.created_at,
  })),
  location: { address: row.address, lat: row.latitude ?? 0, lng: row.longitude ?? 0 },
  contact: { phone: row.phone, email: row.email, website: row.website },
  featured: row.featured,
  status: row.status,
});

const toUser = async (authUser: { id: string; email?: string } | null): Promise<User | null> => {
  if (!authUser) return null;
  const client = requireSupabase();
  const { data: profile, error } = await client
    .from('profiles')
    .select('id, name, email, role')
    .eq('id', authUser.id)
    .maybeSingle<DbProfile>();
  if (error) throw error;

  const { data: stall, error: stallError } = await client
    .from('stalls')
    .select('id')
    .eq('owner_id', authUser.id)
    .maybeSingle<{ id: string }>();
  if (stallError) throw stallError;

  return {
    id: authUser.id,
    email: profile?.email ?? authUser.email,
    name: profile?.name ?? authUser.email?.split('@')[0] ?? 'Member',
    role: profile?.role ?? 'user',
    stallId: stall?.id,
  };
};

const fetchStall = async (id: string): Promise<Stall | null> => {
  const client = requireSupabase();
  const { data, error } = await client.from('stalls').select(stallSelect).eq('id', id).maybeSingle<DbStall>();
  if (error) throw error;
  return data ? toStall(data) : null;
};

const toPartnership = async (row: DbPartnership): Promise<PartnershipRequest> => {
  const [proposerStall, recipientStall] = await Promise.all([
    fetchStall(row.proposer_stall_id),
    fetchStall(row.recipient_stall_id),
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
};

const stallPayload = (stall: Partial<Stall>) => ({
  ...(stall.name !== undefined && { name: stall.name.trim() }),
  ...(stall.slogan !== undefined && { slogan: stall.slogan.trim() }),
  ...(stall.category !== undefined && { category: stall.category }),
  ...(stall.logo_url !== undefined && { logo_url: stall.logo_url }),
  ...(stall.banner_url !== undefined && { banner_url: stall.banner_url }),
  ...(stall.description !== undefined && { description: stall.description.trim() }),
  ...(stall.mission !== undefined && { mission: stall.mission.trim() }),
  ...(stall.location?.address !== undefined && { address: stall.location.address.trim() }),
  ...(stall.location?.lat !== undefined && { latitude: stall.location.lat }),
  ...(stall.location?.lng !== undefined && { longitude: stall.location.lng }),
  ...(stall.contact?.phone !== undefined && { phone: stall.contact.phone.trim() }),
  ...(stall.contact?.email !== undefined && { email: stall.contact.email.trim() }),
  ...(stall.contact?.website !== undefined && { website: stall.contact.website.trim() }),
});

export const api = {
  async getAdminMfaState(): Promise<AdminMfaState> {
    const client = requireSupabase();
    const [{ data: assurance, error: assuranceError }, { data: factors, error: factorsError }] = await Promise.all([
      client.auth.mfa.getAuthenticatorAssuranceLevel(),
      client.auth.mfa.listFactors(),
    ]);
    if (assuranceError) throw assuranceError;
    if (factorsError) throw factorsError;
    const factor = factors.totp.find((item) => item.status === 'verified');
    return { enrolled: Boolean(factor), verified: assurance.currentLevel === 'aal2', factorId: factor?.id };
  },

  async enrolAdminMfa(): Promise<{ factorId: string; qrCode: string }> {
    const { data, error } = await requireSupabase().auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Exhistall administrator' });
    if (error) throw error;
    return { factorId: data.id, qrCode: data.totp.qr_code };
  },

  async verifyAdminMfa(factorId: string, code: string): Promise<void> {
    const client = requireSupabase();
    const { data: challenge, error: challengeError } = await client.auth.mfa.challenge({ factorId });
    if (challengeError) throw challengeError;
    const { error: verifyError } = await client.auth.mfa.verify({ factorId, challengeId: challenge.id, code });
    if (verifyError) throw verifyError;
  },

  async getStalls(): Promise<Stall[]> {
    const client = requireSupabase();
    const { data, error } = await client.from('stalls').select(stallSelect).eq('status', 'active').order('featured', { ascending: false }).order('created_at', { ascending: false });
    if (error) throw error;
    return ((data ?? []) as DbStall[]).map(toStall);
  },

  async getAllStallsForAdmin(): Promise<Stall[]> {
    const client = requireSupabase();
    const { data, error } = await client.from('stalls').select(stallSelect).order('created_at', { ascending: false });
    if (error) throw error;
    return ((data ?? []) as DbStall[]).map(toStall);
  },

  getStallById: fetchStall,

  async login(email: string, password: string): Promise<User | null> {
    const client = requireSupabase();
    const { data, error } = await client.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return null;
    return toUser(data.user);
  },

  async signUp(name: string, email: string, password: string): Promise<{ user: User | null; confirmationRequired: boolean }> {
    const client = requireSupabase();
    const { data, error } = await client.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { name: name.trim() } },
    });
    if (error) throw error;
    // With email confirmation enabled Supabase returns a user but no session.
    // Do not treat that unconfirmed user as signed in in the browser.
    return { user: data.session ? await toUser(data.user) : null, confirmationRequired: !data.session };
  },

  async logout(): Promise<void> {
    const { error } = await requireSupabase().auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await requireSupabase().auth.getUser();
    if (error) return null;
    return toUser(data.user);
  },

  async getUsers(): Promise<User[]> {
    const client = requireSupabase();
    const { data: profiles, error } = await client.from('profiles').select('id, name, email, role').order('created_at', { ascending: false });
    if (error) throw error;
    const { data: stalls, error: stallsError } = await client.from('stalls').select('id, owner_id');
    if (stallsError) throw stallsError;
    const stallByOwner = new Map((stalls ?? []).map((stall: { id: string; owner_id: string }) => [stall.owner_id, stall.id]));
    return ((profiles ?? []) as DbProfile[]).map(profile => ({ ...profile, stallId: stallByOwner.get(profile.id) }));
  },

  async createStall(stallData: StallInput): Promise<Stall | null> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Please sign in before creating a stall.');
    if (user.stallId) throw new Error('You already have a stall.');
    const client = requireSupabase();
    const payload = {
      ...stallPayload(stallData),
      owner_id: user.id,
      status: 'pending_review' as const,
      featured: false,
    };
    const { data, error } = await client.from('stalls').insert(payload).select(stallSelect).single<DbStall>();
    if (error) throw error;
    return toStall(data);
  },

  async updateStall(stallId: string, updates: Partial<Stall>): Promise<Stall | null> {
    const payload = stallPayload(updates);
    const { data, error } = await requireSupabase().from('stalls').update(payload).eq('id', stallId).select(stallSelect).maybeSingle<DbStall>();
    if (error) throw error;
    return data ? toStall(data) : null;
  },

  async updateStallStatus(stallId: string, status: Stall['status']): Promise<Stall | null> {
    const { data, error } = await requireSupabase().rpc('admin_update_stall_status', { target_stall_id: stallId, next_status: status });
    if (error) throw error;
    return data ? fetchStall(stallId) : null;
  },

  async proposePartnership(proposerStall: Stall, recipientStall: Stall, message: string): Promise<PartnershipRequest> {
    const { data, error } = await requireSupabase()
      .from('partnership_requests')
      .insert({ proposer_stall_id: proposerStall.id, recipient_stall_id: recipientStall.id, message: message.trim(), status: 'pending' })
      .select('*').single<DbPartnership>();
    if (error) throw error;
    return toPartnership(data);
  },

  async getPartnershipRequestsForStall(stallId: string): Promise<PartnershipRequest[]> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('partnership_requests')
      .select('*')
      .or(`proposer_stall_id.eq.\${stallId},recipient_stall_id.eq.\${stallId}`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return Promise.all(((data ?? []) as DbPartnership[]).map(toPartnership));
  },

  async updatePartnershipRequestStatus(requestId: string, status: 'accepted' | 'declined'): Promise<PartnershipRequest | null> {
    const { data, error } = await requireSupabase().from('partnership_requests').update({ status }).eq('id', requestId).select('*').maybeSingle<DbPartnership>();
    if (error) throw error;
    return data ? toPartnership(data) : null;
  },

  async addGalleryItem(stallId: string, url: string): Promise<Stall | null> {
    const { error } = await requireSupabase().from('gallery_items').insert({
      stall_id: stallId,
      type: 'image',
      url: url.trim(),
    });
    if (error) throw error;
    return fetchStall(stallId);
  },

  async deleteGalleryItem(stallId: string, galleryItemId: string): Promise<Stall | null> {
    const { error } = await requireSupabase().from('gallery_items').delete().eq('id', galleryItemId).eq('stall_id', stallId);
    if (error) throw error;
    return fetchStall(stallId);
  },

  async addProduct(stallId: string, productData: ProductInput): Promise<Stall | null> {
    const { error } = await requireSupabase().from('products').insert({
      stall_id: stallId, name: productData.name.trim(), description: productData.description.trim(),
      price: productData.price, image_url: productData.imageUrl.trim(),
    });
    if (error) throw error;
    return fetchStall(stallId);
  },

  async updateProduct(stallId: string, productId: string, updates: Partial<Product>): Promise<Stall | null> {
    const payload = {
      ...(updates.name !== undefined && { name: updates.name.trim() }),
      ...(updates.description !== undefined && { description: updates.description.trim() }),
      ...(updates.price !== undefined && { price: updates.price }),
      ...(updates.imageUrl !== undefined && { image_url: updates.imageUrl.trim() }),
    };
    const { error } = await requireSupabase().from('products').update(payload).eq('id', productId).eq('stall_id', stallId);
    if (error) throw error;
    return fetchStall(stallId);
  },

  async deleteProduct(stallId: string, productId: string): Promise<Stall | null> {
    const { error } = await requireSupabase().from('products').delete().eq('id', productId).eq('stall_id', stallId);
    if (error) throw error;
    return fetchStall(stallId);
  },
};
