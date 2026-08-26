'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ProductCard from '@/components/ProductCard';
import RevealSection from '@/components/RevealSection';

const CATEGORIES = ['All', 'Elixirs', 'Serums', 'Treatments', 'Sets'] as const;
const SORTS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Top Rated'] as const;

function ShopContent() {
  const params = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<string>(
    params.get('category') || 'All'
  );
  const [sort, setSort] = useState<string>('Featured');

  useEffect(() => {
    const supabase = createClient();

    async function loadProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Products error:', error);
        return;
      }

      const mappedProducts = (data || []).map((p) => ({
        ...p,
        compareAtPrice: p.compare_at_price,
        heroImage: p.hero_image,
        reviewCount: p.review_count,
        howToUse: p.how_to_use,
      }));

      setProducts(mappedProducts);
    }

    loadProducts();
  }, []);

  const list = useMemo(() => {
    let items =
      category === 'All'
        ? products
        : products.filter((p) => p.category === category);

    if (sort === 'Price: Low to High') {
      items = [...items].sort((a, b) => a.price - b.price);
    }

    if (sort === 'Price: High to Low') {
      items = [...items].sort((a, b) => b.price - a.price);
    }

    if (sort === 'Top Rated') {
      items = [...items].sort((a, b) => b.rating - a.rating);
    }

    return items;
  }, [category, sort, products]);

  return (
    <div className="container-vl py-16">
      <RevealSection>
        <p className="eyebrow text-center">Full Collection</p>

        <h1 className="font-display text-4xl md:text-5xl text-center mt-3">
          Shop Velara
        </h1>
      </RevealSection>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mt-12 border-b border-obsidian/10 pb-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={
                category === c
                  ? 'px-4 py-2 text-xs tracking-widest2 uppercase border bg-obsidian text-cream border-obsidian'
                  : 'px-4 py-2 text-xs tracking-widest2 uppercase border border-obsidian/20 hover:border-obsidian'
              }
            >
              {c}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-cream border border-obsidian/20 px-4 py-2 text-xs tracking-widest2 uppercase focus:outline-none"
        >
          {SORTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14 mt-14">
        {list.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            index={i}
          />
        ))}
      </div>

      {list.length === 0 && (
        <p className="text-center text-obsidian/50 mt-20">
          No products match this filter yet.
        </p>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}
