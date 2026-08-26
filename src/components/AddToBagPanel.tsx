'use client';
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/lib/types';
import { useCart } from '@/store/cart';

export default function AddToBagPanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);

  return (
    <div className="flex items-center gap-4 mt-8">
      <div className="flex items-center border border-obsidian/20">
        <button className="p-3" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={14} /></button>
        <span className="px-4 text-sm w-8 text-center">{qty}</span>
        <button className="p-3" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity"><Plus size={14} /></button>
      </div>
      <button
        className="btn-primary flex-1"
        onClick={() => {
          addItem(product, qty);
          toast.success(`${product.name} added to your bag`);
        }}
      >
        Add to Bag — €{(product.price * qty).toFixed(2)}
      </button>
    </div>
  );
}


