/**
 * Optional convenience script: pushes the local seed data in
 * src/data/products.ts into a connected Supabase project.
 * Usage: npm run seed  (requires .env.local with SUPABASE_SERVICE_ROLE_KEY)
 */
import { createClient } from '@supabase/supabase-js';
import { products } from '../src/data/products';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

async function seed() {
  for (const p of products) {
    const { error } = await supabase.from('products').upsert(
      {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        story: p.story,
        price: p.price,
        compare_at_price: p.compareAtPrice ?? null,
        size: p.size,
        category: p.category,
        hero_image: p.heroImage,
        gallery: p.gallery,
        ingredients: p.ingredients,
        how_to_use: p.howToUse,
        rating: p.rating,
        review_count: p.reviewCount,
        stock: p.stock,
        bestseller: p.bestseller ?? false,
        is_new: p.isNew ?? false,
      },
      { onConflict: 'slug' }
    );
    if (error) console.error(`Failed to seed ${p.slug}:`, error.message);
    else console.log(`Seeded ${p.slug}`);
  }
}

seed();
