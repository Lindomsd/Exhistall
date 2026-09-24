import type { Stall, PartnershipRequest, TeamMember, FaqItem, BlogPost, Job } from '../types';

// This file supplies editorial placeholder content for static pages only.
// Authentication and marketplace data are loaded from Supabase.

export const mockStalls: Stall[] = [
  {
    id: '1',
    ownerId: 'user-1',
    name: 'Artisan Bakes',
    slogan: 'Handcrafted bread and pastries, baked with love.',
    category: 'Food & Drink',
    logo_url: 'https://picsum.photos/seed/ablogo/200/200',
    banner_url: 'https://picsum.photos/seed/abbanner/1200/400',
    description: 'Artisan Bakes is a small, family-owned bakery specializing in traditional sourdough bread, flaky croissants, and decadent cakes. We use only the finest locally-sourced ingredients to ensure every bite is a delight.',
    mission: 'To bring joy to our community through the simple pleasure of freshly baked goods, crafted with passion and integrity.',
    products: [
      { id: 'p1', name: 'Sourdough Loaf', description: 'Classic crusty sourdough, perfect for any occasion.', price: 8.50, imageUrl: 'https://picsum.photos/seed/abp1/400/300' },
      { id: 'p2', name: 'Almond Croissant', description: 'Flaky, buttery croissant with a sweet almond filling.', price: 4.75, imageUrl: 'https://picsum.photos/seed/abp2/400/300' },
      { id: 'p3', name: 'Chocolate Celebration Cake', description: 'Rich, multi-layered chocolate cake for special events.', price: 45.00, imageUrl: 'https://picsum.photos/seed/abp3/400/300' },
      { id: 'p4', name: 'Box of Macarons', description: 'Assorted French macarons, a delicate treat.', price: 18.00, imageUrl: 'https://picsum.photos/seed/abp4/400/300' },
    ],
    gallery: [
      { id: 'g1', type: 'image', url: 'https://picsum.photos/seed/abg1/800/600' },
      { id: 'g2', type: 'image', url: 'https://picsum.photos/seed/abg2/800/600' },
      { id: 'g3', type: 'image', url: 'https://picsum.photos/seed/abg3/800/600' },
      { id: 'g4', type: 'video', url: '#', thumbnailUrl: 'https://picsum.photos/seed/abg4/800/600' },
    ],
    reviews: [
      { id: 'r1', author: 'Jane D.', rating: 5, comment: 'The best sourdough in town! I am a regular here.', date: '2023-10-15' },
      { id: 'r2', author: 'Mark T.', rating: 4, comment: 'Great pastries, but can be a bit busy on weekends.', date: '2023-10-12' },
    ],
    location: { address: '123 Bread St, Foodville', lat: 34.0522, lng: -118.2437 },
    contact: { phone: '555-0101', email: 'contact@artisanbakes.com', website: 'artisanbakes.com' },
    featured: true,
    status: 'active',
  },
  {
    id: '2',
    ownerId: 'user-2',
    name: 'Evergreen Leather',
    slogan: 'Timeless leather goods, crafted to last a lifetime.',
    category: 'Fashion & Apparel',
    logo_url: 'https://picsum.photos/seed/ellogo/200/200',
    banner_url: 'https://picsum.photos/seed/elbanner/1200/400',
    description: 'At Evergreen Leather, we create high-quality, handcrafted leather products. From wallets and belts to bespoke bags, each item is meticulously made by our skilled artisans using sustainably sourced full-grain leather.',
    mission: 'To create beautiful, functional, and durable leather goods that stand the test of time and become cherished heirlooms.',
    products: [
      { id: 'p5', name: 'The Voyager Wallet', description: 'A minimalist bifold wallet with space for cards and cash.', price: 75.00, imageUrl: 'https://picsum.photos/seed/elp1/400/300' },
      { id: 'p6', name: 'Classic Leather Belt', description: 'A sturdy, versatile belt that pairs with anything.', price: 90.00, imageUrl: 'https://picsum.photos/seed/elp2/400/300' },
      { id: 'p7', name: 'The Journeyman Duffel', description: 'The perfect weekend bag, spacious and stylish.', price: 350.00, imageUrl: 'https://picsum.photos/seed/elp3/400/300' },
    ],
    gallery: [
      { id: 'g5', type: 'image', url: 'https://picsum.photos/seed/elg1/800/600' },
      { id: 'g6', type: 'video', url: '#', thumbnailUrl: 'https://picsum.photos/seed/elg2/800/600' },
      { id: 'g7', type: 'image', url: 'https://picsum.photos/seed/elg3/800/600' },
    ],
    reviews: [
      { id: 'r3', author: 'Sam K.', rating: 5, comment: 'The quality is incredible. My wallet is aging beautifully.', date: '2023-09-20' },
      { id: 'r4', author: 'Chloe B.', rating: 5, comment: 'I ordered a custom bag and it exceeded all my expectations. Worth every penny.', date: '2023-08-05' },
    ],
    location: { address: '45 Craft Ave, Styleburg', lat: 40.7128, lng: -74.0060 },
    contact: { phone: '555-0102', email: 'support@evergreenleather.com', website: 'evergreenleather.com' },
    status: 'active',
  },
  {
    id: '3',
    ownerId: 'mock-admin-user',
    name: 'Pixel Perfect Design',
    slogan: 'Bringing your digital vision to life.',
    category: 'Digital Services',
    logo_url: 'https://picsum.photos/seed/pplogo/200/200',
    banner_url: 'https://picsum.photos/seed/ppbanner/1200/400',
    description: 'We are a boutique digital design agency offering a range of services including branding, web design, and UI/UX consultations. We help small businesses make a big impact online with stunning, user-friendly designs.',
    mission: 'To empower businesses with creative and effective digital solutions that drive growth and engagement.',
    products: [
      { id: 'p8', name: 'Logo Design Package', description: 'Includes 3 concepts and final vector files.', price: 500.00, imageUrl: 'https://picsum.photos/seed/ppp1/400/300' },
      { id: 'p9', name: '1-Hour UX Consultation', description: 'Book a session to improve your website or app.', price: 150.00, imageUrl: 'https://picsum.photos/seed/ppp2/400/300' },
      { id: 'p10', name: 'Landing Page Design', description: 'A custom-designed, responsive landing page.', price: 1200.00, imageUrl: 'https://picsum.photos/seed/ppp3/400/300' },
    ],
    gallery: [
      { id: 'g8', type: 'image', url: 'https://picsum.photos/seed/ppg1/800/600' },
      { id: 'g9', type: 'image', url: 'https://picsum.photos/seed/ppg2/800/600' },
    ],
    reviews: [
      { id: 'r5', author: 'TechStart Inc.', rating: 5, comment: 'Pixel Perfect rebranded our company and the result was phenomenal. Highly recommend.', date: '2023-11-01' },
    ],
    location: { address: '789 Digital Dr, Tech City', lat: 37.7749, lng: -122.4194 },
    contact: { phone: '555-0103', email: 'hello@pixelperfect.design', website: 'pixelperfect.design' },
    featured: true,
    status: 'active',
  },
    {
    id: '4',
    ownerId: 'user-3',
    name: 'Green Thumb Gardens',
    slogan: 'Your partner in creating beautiful green spaces.',
    category: 'Home & Craft',
    logo_url: 'https://picsum.photos/seed/gtglogo/200/200',
    banner_url: 'https://picsum.photos/seed/gtgbanner/1200/400',
    description: 'Green Thumb Gardens offers professional landscaping services and a wide variety of plants and gardening supplies. Whether you need a complete garden redesign or just a few new plants, our experts are here to help you cultivate your dream garden.',
    mission: 'To connect people with nature by making gardening accessible, enjoyable, and sustainable for everyone.',
    products: [
      { id: 'p11', name: 'Garden Consultation', description: 'One-hour consultation with a landscape designer.', price: 100.00, imageUrl: 'https://picsum.photos/seed/gtgp1/400/300' },
      { id: 'p12', name: 'Native Wildflower Mix', description: 'A mix of seeds for a beautiful, low-maintenance wildflower patch.', price: 25.00, imageUrl: 'https://picsum.photos/seed/gtgp2/400/300' },
      { id: 'p13', name: 'Hand-Painted Ceramic Pot', description: 'A unique, artisan pot to brighten up your space.', price: 40.00, imageUrl: 'https://picsum.photos/seed/gtgp3/400/300' },
    ],
    gallery: [
      { id: 'g10', type: 'image', url: 'https://picsum.photos/seed/gtgg1/800/600' },
      { id: 'g11', type: 'image', url: 'https://picsum.photos/seed/gtgg2/800/600' },
    ],
    reviews: [
      { id: 'r6', author: 'Maria S.', rating: 5, comment: 'They transformed my backyard! So professional and creative.', date: '2023-07-22' },
    ],
    location: { address: '15 Bloom Lane, Gardenia', lat: 43.6532, lng: -79.3832 },
    contact: { phone: '555-0104', email: 'grow@greenthumb.com', website: 'greenthumb.com' },
    featured: false,
    status: 'pending_review',
  },
];

export const mockPartnershipRequests: PartnershipRequest[] = [
    { id: 'pr-1', proposerStallId: '2', recipientStallId: '1', message: 'Hey! Love your baked goods. We should do a collab for a gift basket.', status: 'pending', date: '2023-11-05' },
    { id: 'pr-2', proposerStallId: '3', recipientStallId: '1', message: 'I can redesign your website to help you sell more cakes!', status: 'accepted', date: '2023-10-28' },
    { id: 'pr-3', proposerStallId: '3', recipientStallId: '2', message: 'I love your leather work! Could I design a new logo for you?', status: 'declined', date: '2023-11-02' },
];

export const mockTeamMembers: TeamMember[] = [
  { id: 'tm1', name: 'Linda Dlamini', title: 'Founder & CEO', imageUrl: 'https://picsum.photos/seed/tm1/400/400' },
  { id: 'tm2', name: 'Bongani Moyo', title: 'Lead Developer', imageUrl: 'https://picsum.photos/seed/tm2/400/400' },
  { id: 'tm3', name: 'Thandiwe Khumalo', title: 'Community Manager', imageUrl: 'https://picsum.photos/seed/tm3/400/400' },
  { id: 'tm4', name: 'Sipho Ndlovu', title: 'UX/UI Designer', imageUrl: 'https://picsum.photos/seed/tm4/400/400' },
];

export const mockFaqs: { [key: string]: FaqItem[] } = {
  general: [
    { question: 'What is Exhistalls?', answer: 'Exhistalls is a virtual marketplace platform that allows small businesses to create online stalls, showcase their products, and connect with customers and other businesses.' },
    { question: 'How do I create an account?', answer: 'You can create an account by clicking the "Create a Stall" button on our homepage and following the registration process. It\'s quick and easy!' },
  ],
  stallholders: [
    { question: 'What are the fees for selling on Exhistalls?', answer: 'We offer various pricing plans, including a free tier to get you started. Please visit our Pricing page for more details on features and fees.' },
    { question: 'How do I get my stall featured?', answer: 'Our "Featured" plan gives your stall premium placement on the homepage and in search results. You can upgrade your plan at any time from your stall dashboard.' },
     { question: 'My stall is "Pending Review". What does that mean?', answer: 'After you create a stall, our admin team reviews it to ensure it meets our community guidelines. This process usually takes 24-48 hours. You will be notified once your stall is approved and live.' },
  ],
  shoppers: [
    { question: 'How do I contact a stallholder?', answer: 'On each stall page, you can find contact information, including email and a messaging feature to communicate directly with the business.' },
    { question: 'Is my payment information secure?', answer: 'Yes, we use industry-standard encryption and partner with trusted payment processors to ensure all transactions are secure.' },
  ],
};

export const mockBlogPosts: BlogPost[] = [
  { id: 'bp1', title: '5 Tips for a Stunning Virtual Stall Display', excerpt: 'Learn how to make your online stall stand out with these simple and effective visual merchandising tips.', imageUrl: 'https://picsum.photos/seed/bp1/600/400', author: 'Jane Doe', date: '2023-10-25' },
  { id: 'bp2', title: 'Success Story: How Artisan Bakes Grew Their Business', excerpt: 'Discover how a local bakery used Exhistalls to reach a wider audience and increase their online sales by 200%.', imageUrl: 'https://picsum.photos/seed/bp2/600/400', author: 'John Smith', date: '2023-10-18' },
  { id: 'bp3', title: 'Networking 101: Building Partnerships on Exhistalls', excerpt: 'Your fellow stallholders are not just competitors; they can be powerful partners. Here\'s how to build valuable B2B connections.', imageUrl: 'https://picsum.photos/seed/bp3/600/400', author: 'Emily White', date: '2023-10-11' },
];

export const mockJobs: Job[] = [
  { id: 'job1', title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
  { id: 'job2', title: 'Product Manager', department: 'Product', location: 'Remote', type: 'Full-time' },
  { id: 'job3', title: 'Digital Marketing Specialist', department: 'Marketing', location: 'New York, NY', type: 'Full-time' },
  { id: 'job4', title: 'Customer Support Associate', department: 'Support', location: 'Remote', type: 'Part-time' },
];
