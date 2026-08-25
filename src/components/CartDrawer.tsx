'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/store/cart';

export default function CartDrawer() {
  const { isOpen, close, lines, setQuantity, removeItem, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-obsidian/50 z-50"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-cream z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-obsidian/10">
              <h2 className="font-display text-xl">Your Bag ({lines.length})</h2>
              <button onClick={close} aria-label="Close cart"><X size={22} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {lines.length === 0 && (
                <p className="text-obsidian/50 text-sm mt-10 text-center">Your bag is empty. Time to add some shine.</p>
              )}
              {lines.map((l) => (
                <div key={l.productId} className="flex gap-4">
                  <div className="relative w-20 h-24 bg-blush shrink-0 overflow-hidden">
                    <Image src={l.image} alt={l.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-display text-sm">{l.name}</p>
                      <button onClick={() => removeItem(l.productId)} aria-label="Remove item">
                        <Trash2 size={15} className="text-obsidian/40 hover:text-error" />
                      </button>
                    </div>
                    <p className="text-xs text-obsidian/50 mt-1">{l.size}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-obsidian/20">
                        <button className="p-1.5" onClick={() => setQuantity(l.productId, l.quantity - 1)} aria-label="Decrease quantity"><Minus size={12} /></button>
                        <span className="px-3 text-sm">{l.quantity}</span>
                        <button className="p-1.5" onClick={() => setQuantity(l.productId, l.quantity + 1)} aria-label="Increase quantity"><Plus size={12} /></button>
                      </div>
                      <p className="text-sm font-medium">${(l.price * l.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {lines.length > 0 && (
              <div className="p-6 border-t border-obsidian/10 space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal().toFixed(2)}</span>
                </div>
                <p className="text-xs text-obsidian/50">Shipping and taxes calculated at checkout.</p>
                <Link href="/checkout" onClick={close} className="btn-primary w-full">Checkout</Link>
                <Link href="/cart" onClick={close} className="btn-outline w-full">View Bag</Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
