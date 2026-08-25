export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  story: string;
  price: number;
  compareAtPrice?: number;
  size: string;
  category: 'Elixirs' | 'Serums' | 'Treatments' | 'Sets';
  heroImage: string;
  gallery: string[];
  ingredients: string[];
  howToUse: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  bestseller?: boolean;
  isNew?: boolean;
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
};

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
};

export type Address = {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  orderNumber: string;
  email: string;
  items: CartLine[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  createdAt: string;
  trackingNumber?: string;
};

export type Customer = {
  id: string;
  fullName: string;
  email: string;
  orders: number;
  totalSpent: number;
  joinedAt: string;
};

export type Discount = {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  active: boolean;
  usageCount: number;
  usageLimit?: number;
  expiresAt?: string;
};
