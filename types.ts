export type CatalogueItemType = 'product' | 'service';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  listingType?: CatalogueItemType;
  category?: string;
  priceNote?: string;
  compareAtPrice?: number;
  isAvailable?: boolean;
  featured?: boolean;
  sortOrder?: number;
}

export type ProductInput = Omit<Product, 'id'>;

export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  promotionLabel: string;
  startAt?: string;
  endAt?: string;
  isActive: boolean;
  sortOrder: number;
}

export type PromotionInput = Omit<Promotion, 'id'>;

export interface Review {
  id:string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  sortOrder?: number;
}

export interface Stall {
  id: string;
  ownerId: string;
  name: string;
  slogan: string;
  category: string;
  logo_url: string;
  banner_url: string;
  description: string;
  mission: string;
  products: Product[];
  promotions?: Promotion[];
  gallery: GalleryItem[];
  reviews: Review[];
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
    whatsapp?: string;
    instagram?: string;
    facebook?: string;
  };
  tradingHours?: string;
  featured?: boolean;
  status: 'active' | 'suspended' | 'banned' | 'pending_review';
}

export interface PartnershipRequest {
    id: string;
    proposerStallId: string;
    recipientStallId: string;
    proposerStall?: Stall; // Denormalized for easier display
    recipientStall?: Stall; // Denormalized for easier display
    message: string;
    status: 'pending' | 'accepted' | 'declined';
    date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  date: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time';
}

export interface Exhibition {
  id: string;
  title: string;
  date: string;
  description: string;
  status: 'upcoming' | 'past';
  imageUrl: string;
}

export type StallInput = Omit<Stall, 'id' | 'ownerId' | 'status' | 'featured' | 'products' | 'promotions' | 'gallery' | 'reviews'>;

export interface User {
  id: string;
  email?: string;
  role: 'admin' | 'user';
  name: string;
  stallId?: string;
}
