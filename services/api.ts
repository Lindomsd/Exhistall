import { mockStalls, mockPartnershipRequests, mockUsers } from '../data/mockData';
import type { Stall, PartnershipRequest, User, Product } from '../types';

// Simulate a database and session storage
let stalls: Stall[] = JSON.parse(JSON.stringify(mockStalls));
let users: User[] = JSON.parse(JSON.stringify(mockUsers));
let partnershipRequests: PartnershipRequest[] = JSON.parse(JSON.stringify(mockPartnershipRequests));
let currentUser: User | null = null; // No one is logged in initially

const MOCK_API_DELAY = 300; // ms

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Denormalize partnership requests for easier use in the UI
const denormalizePartnershipRequests = (requests: PartnershipRequest[]): PartnershipRequest[] => {
  return requests.map(req => ({
    ...req,
    proposerStall: stalls.find(s => s.id === req.proposerStallId),
    recipientStall: stalls.find(s => s.id === req.recipientStallId),
  }));
}

export const api = {
  async getStalls(): Promise<Stall[]> {
    await delay(MOCK_API_DELAY);
    console.log('Mock API: Fetched stalls');
    // Filter out pending stalls for public view
    return JSON.parse(JSON.stringify(stalls.filter(s => s.status === 'active')));
  },

  async getAllStallsForAdmin(): Promise<Stall[]> {
    await delay(MOCK_API_DELAY);
    console.log('Mock API: Fetched all stalls for admin');
    return JSON.parse(JSON.stringify(stalls));
  },

  async getStallById(id: string): Promise<Stall | null> {
    await delay(MOCK_API_DELAY);
    const stall = stalls.find(s => s.id === id);
    console.log(`Mock API: Fetched stall by id ${id}`);
    return stall ? JSON.parse(JSON.stringify(stall)) : null;
  },
  
  async login(email: string, password: string): Promise<User | null> {
    await delay(MOCK_API_DELAY);
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      currentUser = { ...user };
      console.log(`Mock API: User ${user.name} logged in`);
      return JSON.parse(JSON.stringify(currentUser));
    }
    console.log('Mock API: Login failed');
    currentUser = null;
    return null;
  },

  async logout(): Promise<void> {
    await delay(MOCK_API_DELAY / 2);
    currentUser = null;
    console.log('Mock API: User logged out');
  },
  
  async getCurrentUser(): Promise<User | null> {
    await delay(MOCK_API_DELAY / 2);
    return currentUser ? JSON.parse(JSON.stringify(currentUser)) : null;
  },
  
  async getUsers(): Promise<User[]> {
      await delay(MOCK_API_DELAY);
      console.log('Mock API: Fetched all users');
      return JSON.parse(JSON.stringify(users));
  },

  async createStall(stallData: Omit<Stall, 'id' | 'ownerId' | 'status' >): Promise<Stall | null> {
      if (!currentUser) return null;
      await delay(MOCK_API_DELAY);
      const newStall: Stall = {
        ...stallData,
        id: `stall-${Date.now()}`,
        ownerId: currentUser.id,
        status: 'pending_review',
        featured: false,
        products: [],
        gallery: [],
        reviews: [],
      };
      stalls.push(newStall);
      // Also update the user record
      const userIndex = users.findIndex(u => u.id === currentUser!.id);
      if(userIndex > -1) {
          users[userIndex].stallId = newStall.id;
          if (currentUser) {
            currentUser.stallId = newStall.id;
          }
      }
      console.log(`Mock API: Created new stall "${newStall.name}" for user ${currentUser.name}`);
      return JSON.parse(JSON.stringify(newStall));
  },

  async updateStall(stallId: string, updates: Partial<Stall>): Promise<Stall | null> {
      await delay(MOCK_API_DELAY);
      const stallIndex = stalls.findIndex(s => s.id === stallId);
      if(stallIndex > -1) {
          stalls[stallIndex] = { ...stalls[stallIndex], ...updates };
          console.log(`Mock API: Updated stall ${stallId}`);
          return JSON.parse(JSON.stringify(stalls[stallIndex]));
      }
      return null;
  },

  async updateStallStatus(stallId: string, status: Stall['status']): Promise<Stall | null> {
    await delay(MOCK_API_DELAY);
    const stallIndex = stalls.findIndex(s => s.id === stallId);
    if (stallIndex !== -1) {
      stalls[stallIndex].status = status;
      console.log(`Mock API: Updated stall ${stallId} status to ${status}`);
      return JSON.parse(JSON.stringify(stalls[stallIndex]));
    }
    console.error(`Mock API: Stall with id ${stallId} not found`);
    return null;
  },

  async proposePartnership(proposerStall: Stall, recipientStall: Stall, message: string): Promise<PartnershipRequest> {
      await delay(MOCK_API_DELAY);
      const newRequest: PartnershipRequest = {
        id: `pr-${Date.now()}`,
        proposerStallId: proposerStall.id,
        recipientStallId: recipientStall.id,
        message,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
      };
      partnershipRequests.push(newRequest);
      console.log('Mock API: Created new partnership request');
      return denormalizePartnershipRequests([newRequest])[0];
  },
  
  async getPartnershipRequestsForStall(stallId: string): Promise<PartnershipRequest[]> {
      await delay(MOCK_API_DELAY);
      const requests = partnershipRequests.filter(
        req => req.proposerStallId === stallId || req.recipientStallId === stallId
      );
      console.log(`Mock API: Fetched partnership requests for stall ${stallId}`);
      return denormalizePartnershipRequests(JSON.parse(JSON.stringify(requests)));
  },
  
  async updatePartnershipRequestStatus(requestId: string, status: 'accepted' | 'declined'): Promise<PartnershipRequest | null> {
      await delay(MOCK_API_DELAY);
      const requestIndex = partnershipRequests.findIndex(req => req.id === requestId);
      if(requestIndex > -1) {
          partnershipRequests[requestIndex].status = status;
          console.log(`Mock API: Updated partnership request ${requestId} to ${status}`);
          return denormalizePartnershipRequests([partnershipRequests[requestIndex]])[0];
      }
      return null;
  },
  
  async addProduct(stallId: string, productData: Omit<Product, 'id'>): Promise<Stall | null> {
      await delay(MOCK_API_DELAY);
      const stallIndex = stalls.findIndex(s => s.id === stallId);
      if(stallIndex > -1) {
          const newProduct: Product = { ...productData, id: `prod-${Date.now()}` };
          stalls[stallIndex].products.push(newProduct);
          console.log(`Mock API: Added product to stall ${stallId}`);
          return JSON.parse(JSON.stringify(stalls[stallIndex]));
      }
      return null;
  },
  
  async updateProduct(stallId: string, productId: string, updates: Partial<Product>): Promise<Stall | null> {
      await delay(MOCK_API_DELAY);
      const stallIndex = stalls.findIndex(s => s.id === stallId);
      if(stallIndex > -1) {
          const productIndex = stalls[stallIndex].products.findIndex(p => p.id === productId);
          if (productIndex > -1) {
              stalls[stallIndex].products[productIndex] = { ...stalls[stallIndex].products[productIndex], ...updates };
              console.log(`Mock API: Updated product ${productId} in stall ${stallId}`);
              return JSON.parse(JSON.stringify(stalls[stallIndex]));
          }
      }
      return null;
  },
  
  async deleteProduct(stallId: string, productId: string): Promise<Stall | null> {
      await delay(MOCK_API_DELAY);
      const stallIndex = stalls.findIndex(s => s.id === stallId);
      if(stallIndex > -1) {
          stalls[stallIndex].products = stalls[stallIndex].products.filter(p => p.id !== productId);
          console.log(`Mock API: Deleted product ${productId} from stall ${stallId}`);
          return JSON.parse(JSON.stringify(stalls[stallIndex]));
      }
      return null;
  }
};
