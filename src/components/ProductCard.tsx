'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';
import { useCart } from '@/store/cart';
import { Star } from 'lucide-react';

import { useEffect, useState } from 'react';
import { getCurrencySymbol } from '@/lib/currency';
export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
const addItem = useCart((s) => s.addItem);

const [currency, setCurrency] = useState('EUR');

useEffect(() => {
  async function loadCurrency() {
    try {
      const response = await fetch('/api/settings');

      if (!response.ok) return;

      const data = await response.json();

      setCurrency(data.currency ?? 'USD');
    } catch (error) {
      console.error('Currency load error:', error);
    }
  }

  loadCurrency();
}, []);

return (
  
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        delay: (index % 4) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      <Link
        href={`/product/${product.slug}`}
        className="block"
      >
        <div className="relative aspect-[4/5] bg-blush overflow-hidden oil-sheen-hover">
          {product.heroImage ? (
            <Image
              src={product.heroImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-obsidian/40">
              No image
            </div>
          )}

          {product.bestseller && (
            <span className="absolute top-3 left-3 bg-obsidian text-cream text-[10px] tracking-widest2 uppercase px-2.5 py-1">
              Bestseller
            </span>
          )}

          {product.isNew && (
            <span className="absolute top-3 right-3 bg-gold text-obsidian text-[10px] tracking-widest2 uppercase px-2.5 py-1">
              New
            </span>
          )}
        </div>

        <div className="mt-4">
          <p className="text-[11px] tracking-widest2 uppercase text-obsidian/50">
            {product.category}
          </p>

          <h3 className="font-display text-lg mt-1">
            {product.name}
          </h3>

          <p className="text-sm text-obsidian/60 mt-0.5">
            {product.tagline}
          </p>

          <div className="flex items-center gap-1 mt-2">
            <Star
              size={12}
              className="fill-gold text-gold"
            />

            <span className="text-xs text-obsidian/50">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="font-medium">
              {getCurrencySymbol(currency as any)}{product.price}
            </span>

            {product.compareAtPrice && (
              <span className="text-sm text-obsidian/40 line-through">
                {getCurrencySymbol(currency as any)}{product.compareAtPrice}
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          addItem(product);
        }}
        className="mt-3 w-full btn-outline text-xs py-2.5"
      >
        Add to Bag
      </button>
    </motion.div>
  );
}

