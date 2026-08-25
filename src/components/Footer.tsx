import Link from 'next/link';
import { Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-obsidian text-cream mt-32">
      <div className="container-vl py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <p className="font-display text-3xl mb-4">VELARA</p>
          <p className="text-cream/60 text-sm max-w-xs leading-relaxed">
            Liquid gold for hair. Small-batch oils and serums, blended for a finish that
            looks effortless and feels indulgent.
          </p>
          <div className="flex gap-4 mt-6">
            <Instagram size={18} className="text-cream/70 hover:text-gold transition-colors cursor-pointer" />
            <Twitter size={18} className="text-cream/70 hover:text-gold transition-colors cursor-pointer" />
            <Youtube size={18} className="text-cream/70 hover:text-gold transition-colors cursor-pointer" />
          </div>
        </div>
        <div>
          <p className="eyebrow text-gold mb-4">Shop</p>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link href="/shop">All Products</Link></li>
            <li><Link href="/shop?category=Elixirs">Elixirs</Link></li>
            <li><Link href="/shop?category=Sets">Gift Sets</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-gold mb-4">Support</p>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link href="/track-order">Track Order</Link></li>
            <li><Link href="/#faq">FAQ</Link></li>
            <li><Link href="/#contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-gold mb-4">Company</p>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link href="/#story">Our Story</Link></li>
            <li><Link href="/#sustainability">Sustainability</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-6">
        <p className="container-vl text-xs text-cream/40 tracking-wide">© {new Date().getFullYear()} Velara. All rights reserved.</p>
      </div>
    </footer>
  );
}
