'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartLine, Product } from '@/lib/types';

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addItem: (product, quantity = 1) => {
        const lines = [...get().lines];
        const idx = lines.findIndex((l) => l.productId === product.id);
        if (idx > -1) {
          lines[idx] = { ...lines[idx], quantity: lines[idx].quantity + quantity };
        } else {
          lines.push({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            size: product.size,
            image: product.heroImage,
            quantity,
          });
        }
        set({ lines, isOpen: true });
      },
      removeItem: (productId) => set({ lines: get().lines.filter((l) => l.productId !== productId) }),
      setQuantity: (productId, quantity) =>
        set({
          lines: get().lines.map((l) => (l.productId === productId ? { ...l, quantity: Math.max(1, quantity) } : l)),
        }),
      clear: () => set({ lines: [] }),
      subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
      count: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    { name: 'velara-cart' }
  )
);
