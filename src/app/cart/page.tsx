'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/store/cart';

export default function CartPage() {
  const { lines, setQuantity, removeItem, subtotal } = useCart();
  const shipping = lines.length > 0 && subtotal() < 75 ? 6.5 : 0;

  if (lines.length === 0) {
    return (
      <div className="container-vl py-32 text-center">
        <h1 className="font-display text-3xl">Your bag is empty</h1>
        <p className="text-obsidian/60 mt-3">Discover the collection and start your ritual.</p>
        <Link href="/shop" className="btn-primary inline-flex mt-8">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="container-vl py-16">
      <h1 className="font-display text-3xl md:text-4xl mb-12">Your Bag</h1>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {lines.map((l) => (
            <div key={l.productId} className="flex gap-5 border-b border-obsidian/10 pb-8">
              <div className="relative w-28 h-32 bg-blush shrink-0 overflow-hidden">
                <Image src={l.image} alt={l.name} fill className="object-cover" sizes="112px" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <p className="font-display text-lg">{l.name}</p>
                    <p className="text-sm text-obsidian/50 mt-1">{l.size}</p>
                  </div>
                  <p className="font-medium">€{(l.price * l.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-obsidian/20">
                    <button className="p-2" onClick={() => setQuantity(l.productId, l.quantity - 1)} aria-label="Decrease quantity"><Minus size={13} /></button>
                    <span className="px-4 text-sm">{l.quantity}</span>
                    <button className="p-2" onClick={() => setQuantity(l.productId, l.quantity + 1)} aria-label="Increase quantity"><Plus size={13} /></button>
                  </div>
                  <button onClick={() => removeItem(l.productId)} className="flex items-center gap-1 text-xs text-obsidian/50 hover:text-error">
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blush/60 p-8 h-fit">
          <h2 className="font-display text-xl mb-6">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>€{subtotal().toFixed(2)}</span></div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && <p className="text-xs text-obsidian/50">Free shipping on orders over €75.</p>}
          </div>
          <div className="border-t border-obsidian/15 mt-4 pt-4 flex justify-between font-medium">
            <span>Total</span>
            <span>€{(subtotal() + shipping).toFixed(2)}</span>
          </div>
          <Link href="/checkout" className="btn-primary w-full mt-6">Proceed to Checkout</Link>
          <Link href="/shop" className="block text-center text-xs tracking-widest2 uppercase mt-4 text-obsidian/60 hover:text-obsidian">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}



