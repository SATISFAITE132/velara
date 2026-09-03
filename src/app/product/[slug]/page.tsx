import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/ProductGallery';
import AddToBagPanel from '@/components/AddToBagPanel';
import ProductCard from '@/components/ProductCard';
import RevealSection from '@/components/RevealSection';
import ReviewForm from '@/components/ReviewForm';
import { Star } from 'lucide-react';
import type { Product, Review } from '@/lib/types';
import { getCurrencySymbol } from '@/lib/currency';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function parseArray(value: any): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item));
      }
    } catch {}

    return value
      .replace(/^\{|\}$/g, '')
      .split(',')
      .map((item) => item.trim().replace(/^"|"$/g, ''))
      .filter(Boolean);
  }

  return [];
}

function normalizeProduct(p: any): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline ?? '',
    description: p.description ?? '',
    story: p.story ?? '',
    price: Number(p.price ?? 0),
    compareAtPrice: p.compare_at_price ?? undefined,
    size: p.size ?? '',
    category: p.category,
    heroImage: p.hero_image ?? '',
    gallery: parseArray(p.gallery),
    ingredients: parseArray(p.ingredients),
    howToUse: parseArray(p.how_to_use),
    rating: Number(p.rating ?? 0),
    reviewCount: Number(p.review_count ?? 0),
    stock: Number(p.stock ?? 0),
    bestseller: p.bestseller ?? false,
    isNew: p.is_new ?? false,
  };
}

function normalizeReview(r: any): Review {
  return {
    id: r.id,
    productId: r.product_id,
    author: r.author ?? '',
    rating: Number(r.rating ?? 0),
    title: r.title ?? '',
    body: r.body ?? '',
    date: r.date ?? r.created_at ?? '',
    verified: r.verified ?? false,
  };
}

export async function generateStaticParams() {
  return [];
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createClient();

  const { data: productData, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (productError || !productData) {
    return notFound();
  }

  const product = normalizeProduct(productData);

  const { data: settingsData } = await supabase
    .from('store_settings')
    .select('currency')
    .eq('id', 1)
    .single();

  const currency = 'MAD';
  const currencySymbol = getCurrencySymbol(currency);

 const { data: reviewData } = await supabase
  .from('reviews')
  .select('*')
  .eq('product_id', product.id)
  .eq('approved', true)
  .order('created_at', { ascending: false });

  const reviews: Review[] = (reviewData ?? []).map(normalizeReview);

  const { data: relatedData } = await supabase
    .from('products')
    .select('*')
    .eq('category', productData.category)
    .neq('id', productData.id)
    .limit(3);

  const related: Product[] = (relatedData ?? []).map(normalizeProduct);

  const gallery =
    product.gallery.length > 0
      ? product.gallery
      : product.heroImage
        ? [product.heroImage]
        : [];

  return (
    <div className="container-vl py-12">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        <ProductGallery
          images={gallery}
          name={product.name}
        />

        <div>
          <p className="eyebrow">{product.category}</p>

          <h1 className="font-display text-3xl md:text-4xl mt-2">
            {product.name}
          </h1>

          <p className="text-obsidian/60 mt-2">
            {product.tagline}
          </p>

          <div className="flex items-center gap-2 mt-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(product.rating)
                      ? 'fill-gold text-gold'
                      : 'text-obsidian/20'
                  }
                />
              ))}
            </div>

           <span className="text-sm text-obsidian/50">
  {product.rating} · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
</span>
          </div>

          <div className="flex items-baseline gap-3 mt-6">
            <span className="text-2xl font-medium">
              {currencySymbol}{product.price}
            </span>

            {product.compareAtPrice && (
              <span className="text-obsidian/40 line-through">
                {currencySymbol}{product.compareAtPrice}
              </span>
            )}

            <span className="text-xs text-obsidian/50 ml-2">
              {product.size}
            </span>
          </div>

          <p className="text-obsidian/70 leading-relaxed mt-6">
            {product.description}
          </p>

          <AddToBagPanel product={product} />

          <div className="mt-10 space-y-6 border-t border-obsidian/10 pt-8">
            <div>
              <h3 className="font-display text-lg mb-2">
                Key Ingredients
              </h3>

              <p className="text-sm text-obsidian/60">
                {product.ingredients.length > 0
                  ? product.ingredients.join(' · ')
                  : 'Details coming soon.'}
              </p>
            </div>

            <div>
              <h3 className="font-display text-lg mb-2">
                How to Use
              </h3>

              {product.howToUse.length > 0 ? (
                <ol className="list-decimal list-inside text-sm text-obsidian/60 space-y-1">
                  {product.howToUse.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-obsidian/60">
                  Instructions coming soon.
                </p>
              )}
            </div>

            <div>
              <h3 className="font-display text-lg mb-2">
                The Story
              </h3>

              <p className="text-sm text-obsidian/60 leading-relaxed">
                {product.story || 'More about this product coming soon.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <RevealSection className="mt-24 max-w-3xl">
  <details className="group">
    <summary className="cursor-pointer list-none">
      <div className="flex items-center justify-between border-b border-obsidian/10 pb-6">
        <div>
          <h2 className="font-display text-2xl">
            Customer Reviews
          </h2>

          <p className="text-sm text-obsidian/50 mt-1">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        <span className="text-sm underline underline-offset-4">
          View Reviews
        </span>
      </div>
    </summary>

    <div className="pt-8">
      <div className="space-y-6">
        {reviews.length === 0 && (
          <p className="text-sm text-obsidian/50">
            No reviews yet for this product.
          </p>
        )}

        {reviews.map((r) => (
          <div
            key={r.id}
            className="border-b border-obsidian/10 pb-6"
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={
                      i < r.rating
                        ? 'fill-gold text-gold'
                        : 'text-obsidian/20'
                    }
                  />
                ))}
              </div>

              {r.verified && (
                <span className="text-[10px] uppercase tracking-wide text-success">
                  Verified
                </span>
              )}
            </div>

            <div className="mt-2 w-full max-w-full overflow-y-auto max-h-20">
  <p className="text-sm text-obsidian/60 leading-6 max-w-[75%] break-words">
    {r.body}
  </p>
</div>

            <p className="text-xs text-obsidian/40 mt-2">
              {r.author} · {r.date}
            </p>
          </div>
        ))}
      </div>

      <ReviewForm productId={product.id} />
    </div>
  </details>
</RevealSection>

      {related.length > 0 && (
        <section className="mt-28">
          <h2 className="font-display text-2xl text-center mb-12">
            You May Also Love
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {related.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}



