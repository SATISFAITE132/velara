// Mock data powering the admin dashboard UI out of the box. Replace each
// export with a Supabase query (see supabase/schema.sql for table shapes)
// once the project is connected to a live database.
import { Order, Customer, Discount } from '@/lib/types';

export const mockOrders: Order[] = [
  { id: 'o1', orderNumber: 'VEL-4821-XQ', email: 'amelia.r@example.com', items: [], subtotal: 122, shipping: 0, discount: 0, total: 122, status: 'delivered', shippingAddress: { fullName: 'Amelia Ross', line1: '12 Baker St', city: 'London', state: '', postalCode: 'NW1', country: 'UK', phone: '' }, createdAt: '2026-08-01' },
  { id: 'o2', orderNumber: 'VEL-5093-KL', email: 'noor.k@example.com', items: [], subtotal: 68, shipping: 6.5, discount: 0, total: 74.5, status: 'shipped', shippingAddress: { fullName: 'Noor Karimi', line1: '88 Elm Ave', city: 'Toronto', state: 'ON', postalCode: 'M5V', country: 'Canada', phone: '' }, createdAt: '2026-08-05' },
  { id: 'o3', orderNumber: 'VEL-5511-PZ', email: 'priya.s@example.com', items: [], subtotal: 89, shipping: 0, discount: 8.9, total: 80.1, status: 'processing', shippingAddress: { fullName: 'Priya Shah', line1: '4 Rue Verte', city: 'Paris', state: '', postalCode: '75001', country: 'France', phone: '' }, createdAt: '2026-08-09' },
  { id: 'o4', orderNumber: 'VEL-6002-QT', email: 'jonas.w@example.com', items: [], subtotal: 46, shipping: 6.5, discount: 0, total: 52.5, status: 'pending', shippingAddress: { fullName: 'Jonas Weber', line1: '9 Bergstrasse', city: 'Zurich', state: '', postalCode: '8001', country: 'Switzerland', phone: '' }, createdAt: '2026-08-12' },
  { id: 'o5', orderNumber: 'VEL-6110-MN', email: 'sara.b@example.com', items: [], subtotal: 210, shipping: 0, discount: 0, total: 210, status: 'cancelled', shippingAddress: { fullName: 'Sara Boone', line1: '1 Ocean Dr', city: 'Miami', state: 'FL', postalCode: '33139', country: 'USA', phone: '' }, createdAt: '2026-08-13' },
];

export const mockCustomers: Customer[] = [
  { id: 'c1', fullName: 'Amelia Ross', email: 'amelia.r@example.com', orders: 6, totalSpent: 512, joinedAt: '2025-11-02' },
  { id: 'c2', fullName: 'Noor Karimi', email: 'noor.k@example.com', orders: 3, totalSpent: 214, joinedAt: '2026-01-18' },
  { id: 'c3', fullName: 'Priya Shah', email: 'priya.s@example.com', orders: 4, totalSpent: 356, joinedAt: '2025-12-30' },
  { id: 'c4', fullName: 'Jonas Weber', email: 'jonas.w@example.com', orders: 1, totalSpent: 46, joinedAt: '2026-08-01' },
  { id: 'c5', fullName: 'Sara Boone', email: 'sara.b@example.com', orders: 2, totalSpent: 210, joinedAt: '2026-06-11' },
];

export const mockDiscounts: Discount[] = [
  { id: 'd1', code: 'GOLD10', type: 'percentage', value: 10, active: true, usageCount: 214, usageLimit: 1000, expiresAt: '2026-12-31' },
  { id: 'd2', code: 'WELCOME15', type: 'percentage', value: 15, active: true, usageCount: 88, usageLimit: 500 },
  { id: 'd3', code: 'FREESHIP', type: 'fixed', value: 6.5, active: true, usageCount: 341 },
  { id: 'd4', code: 'SUMMER26', type: 'percentage', value: 20, active: false, usageCount: 502, usageLimit: 500, expiresAt: '2026-07-01' },
];

export const revenueByMonth = [
  { month: 'Feb', revenue: 8200, orders: 142 },
  { month: 'Mar', revenue: 9600, orders: 168 },
  { month: 'Apr', revenue: 11200, orders: 195 },
  { month: 'May', revenue: 10400, orders: 180 },
  { month: 'Jun', revenue: 13850, orders: 231 },
  { month: 'Jul', revenue: 15920, orders: 268 },
  { month: 'Aug', revenue: 9840, orders: 164 },
];

export const salesByCategory = [
  { name: 'Elixirs', value: 42 },
  { name: 'Treatments', value: 28 },
  { name: 'Serums', value: 16 },
  { name: 'Sets', value: 14 },
];
