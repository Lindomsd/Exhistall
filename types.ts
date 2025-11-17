
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

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
  status: 'active' | 'suspended' | 'banned';
}

export interface PartnershipRequest {
    id: string;
    proposerStall: Stall;
    recipientStall: Stall;
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

export interface User {
  id: string;
  email: string;
  password?: string; // Should be hashed in a real app
  role: 'admin' | 'user';
  name: string;
}