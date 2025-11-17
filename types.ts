export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface Review {
  id: string;
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
}

export interface Stall {
  id: string;
  name: string;
  slogan: string;
  category: string;
  logoUrl: string;
  bannerUrl: string;
  description: string;
  mission: string;
  products: Product[];
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
  };
  featured?: boolean;
}

export interface PartnershipRequest {
    id: string;
    proposerStall: Stall;
    recipientStall: Stall;
    message: string;
    status: 'pending' | 'accepted' | 'declined';
    date: string;
}