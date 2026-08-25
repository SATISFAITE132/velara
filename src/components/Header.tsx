'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/store/cart';

const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop?category=Elixirs', label: 'Elixirs' },
  { href: '/shop?category=Treatments', label: 'Treatments' },
  { href: '/track-order', label: 'Track Order' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [mounted, setMounted] = useState(false);
const { count, open } = useCart();
useEffect(() => {
  setMounted(true);
}, []);

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-obsidian/10">
      <div className="container-vl flex items-center justify-between h-20">
        <button className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>

        <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest2 uppercase">
          {NAV.slice(0, 2).map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-gold-dark transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2 font-display text-2xl md:text-3xl tracking-wide">
          VELARA
        </Link>

        <div className="flex items-center gap-5">
          <button aria-label="Search" className="hidden md:block hover:text-gold-dark transition-colors">
            <Search size={19} />
          </button>
          <Link href="/track-order" className="hidden md:block text-xs tracking-widest2 uppercase hover:text-gold-dark transition-colors">
            Track Order
          </Link>
          <button onClick={open} aria-label="Open cart" className="relative hover:text-gold-dark transition-colors">
            <ShoppingBag size={20} />
            {mounted && count() > 0 && (
  <span className="absolute -top-2 -right-2 bg-gold text-obsidian text-[10px] font-medium w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">
    {count()}
  </span>
)}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-50 bg-obsidian text-cream flex flex-col p-8"
          >
            <button onClick={() => setMobileOpen(false)} className="self-end" aria-label="Close menu">
              <X size={26} />
            </button>
            <nav className="mt-16 flex flex-col gap-6 text-2xl font-display">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
