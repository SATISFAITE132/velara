import { Product, Review } from '@/lib/types';

// NOTE: heroImage/gallery use Unsplash placeholders so the storefront renders
// out of the box. Replace with your real Cloudinary asset URLs (see
// src/lib/cloudinary.ts) once product photography is uploaded.
const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const products: Product[] = [
  {
    id: '1',
    slug: 'gold-elixir',
    name: 'Gold Elixir',
    tagline: 'The original 24-karat hair oil',
    description:
      'Our signature formula suspends 24-karat gold flake in a base of cold-pressed argan, marula, and prickly pear oils. A weightless veil that seals in shine, tames frizz, and leaves hair feeling silk-finished from root to end.',
    story:
      'Gold Elixir began as a single batch, hand-mixed in small copper vessels and gifted to twelve stylists across three cities. Within a season, it was the product clients asked for by name. Every bottle is still blended in small runs to protect the integrity of the oils.',
    price: 68,
    compareAtPrice: 82,
    size: '50ml / 1.7 fl oz',
    category: 'Elixirs',
    heroImage: img('photo-1594035910387-fea47794261f'),
    gallery: [img('photo-1594035910387-fea47794261f'), img('photo-1522338242992-e1a54906a8da'), img('photo-1571875257727-256c39da42af')],
    ingredients: ['Argan Oil', 'Marula Oil', 'Prickly Pear Seed Oil', '24k Gold Flake', 'Vitamin E'],
    howToUse: [
      'Warm 2–3 drops between palms.',
      'Distribute through damp or dry lengths, avoiding the scalp.',
      'For overnight repair, apply a dime-size amount to ends and sleep on a silk pillowcase.',
    ],
    rating: 4.9,
    reviewCount: 312,
    stock: 148,
    bestseller: true,
  },
  {
    id: '2',
    slug: 'rosehip-repair-oil',
    name: 'Rosehip & Argan Repair Oil',
    tagline: 'Deep repair for colour-treated hair',
    description:
      'A restorative blend of rosehip, argan, and camellia oils formulated for chemically treated or heat-damaged hair. Rich in essential fatty acids, it rebuilds the hair\'s lipid layer and restores elasticity within weeks of nightly use.',
    story:
      'Developed with colourists who saw the same problem daily: vibrant colour, compromised strands. This formula was built to protect the investment of a fresh balayage without weighing down the finish.',
    price: 54,
    size: '50ml / 1.7 fl oz',
    category: 'Treatments',
    heroImage: img('photo-1620916566398-39f1143ab7be'),
    gallery: [img('photo-1620916566398-39f1143ab7be'), img('photo-1608248543803-ba4f8c70ae0b'), img('photo-1585232351009-aa87416fca90')],
    ingredients: ['Rosehip Oil', 'Argan Oil', 'Camellia Seed Oil', 'Panthenol'],
    howToUse: ['Apply to towel-dried hair before styling.', 'Use nightly on ends for intensive repair.'],
    rating: 4.8,
    reviewCount: 201,
    stock: 96,
    bestseller: true,
  },
  {
    id: '3',
    slug: 'scalp-renewal-serum',
    name: 'Scalp Renewal Serum',
    tagline: 'A cooling tonic for a balanced scalp',
    description:
      'A lightweight, fast-absorbing tonic that combines peppermint, rosemary, and niacinamide to soothe the scalp and support a healthier-looking growth environment. Non-greasy and safe for daily use.',
    story: 'Because we believe great hair starts at the scalp — this serum was formulated to earn a place in a daily ritual, not just a weekly treatment.',
    price: 46,
    size: '30ml dropper',
    category: 'Serums',
    heroImage: img('photo-1556228578-8c89e6adf883'),
    gallery: [img('photo-1556228578-8c89e6adf883'), img('photo-1571781926291-c477ebfd024b')],
    ingredients: ['Rosemary Extract', 'Peppermint Oil', 'Niacinamide', 'Caffeine'],
    howToUse: ['Apply 8–10 drops directly to scalp.', 'Massage for 60 seconds.', 'Use morning or night, no rinse required.'],
    rating: 4.7,
    reviewCount: 154,
    stock: 210,
    isNew: true,
  },
  {
    id: '4',
    slug: 'overnight-silk-oil',
    name: 'Overnight Silk Oil',
    tagline: 'Wake up to softer, smoother hair',
    description:
      'A richer, night-only formula with hyaluronic acid and silk amino acids that works while you sleep to visibly reduce breakage and morning frizz.',
    story: 'Built for the eight hours nobody thinks about — the quiet repair window between wash days.',
    price: 62,
    size: '50ml / 1.7 fl oz',
    category: 'Treatments',
    heroImage: img('photo-1608571423902-eed4a5ad8108'),
    gallery: [img('photo-1608571423902-eed4a5ad8108'), img('photo-1522335789203-aabd1fc54bc9')],
    ingredients: ['Silk Amino Acids', 'Hyaluronic Acid', 'Baobab Oil', 'Squalane'],
    howToUse: ['Apply to dry hair before bed.', 'Focus on mid-lengths and ends.', 'Rinse or leave in — suitable both ways.'],
    rating: 4.9,
    reviewCount: 178,
    stock: 84,
    isNew: true,
  },
  {
    id: '5',
    slug: 'discovery-trio',
    name: 'The Discovery Trio',
    tagline: 'Three signature oils, travel-sized',
    description:
      'A curated introduction to the Velara line — travel-sized Gold Elixir, Rosehip & Argan Repair Oil, and Scalp Renewal Serum in a keepsake box lined with hand-pressed cotton paper.',
    story: 'For first-time customers and seasoned devotees travelling light — the full ritual, scaled down without compromise.',
    price: 89,
    compareAtPrice: 112,
    size: '3 x 15ml',
    category: 'Sets',
    heroImage: img('photo-1611930022073-b7a4ba5fcccd'),
    gallery: [img('photo-1611930022073-b7a4ba5fcccd'), img('photo-1570194065650-d99fb4bedf0a')],
    ingredients: ['See individual product listings'],
    howToUse: ['Follow individual product instructions included in the box.'],
    rating: 4.9,
    reviewCount: 267,
    stock: 132,
    bestseller: true,
  },
  {
    id: '6',
    slug: 'amber-shine-drops',
    name: 'Amber Shine Drops',
    tagline: 'A glass-finish topcoat for any style',
    description:
      'The finishing step — a featherweight amber-toned oil that adds mirror shine and light heat protection without a trace of residue. Ideal for fine or oily-prone hair.',
    story: 'The last thirty seconds of any styling routine, reimagined — a single drop for a professional, glass-like finish.',
    price: 42,
    size: '30ml / 1 fl oz',
    category: 'Elixirs',
    heroImage: img('photo-1592945403244-b3fbafd7f539'),
    gallery: [img('photo-1592945403244-b3fbafd7f539'), img('photo-1595425964272-4a834d8b7dd8')],
    ingredients: ['Sunflower Seed Oil', 'Jojoba Oil', 'Vitamin E', 'Heat Shield Complex'],
    howToUse: ['Rub one drop between palms.', 'Smooth over finished style, avoiding roots.'],
    rating: 4.6,
    reviewCount: 98,
    stock: 175,
  },
];

export const reviews: Review[] = [
  { id: 'r1', productId: '1', author: 'Amelia R.', rating: 5, title: 'Holy grail status', body: 'Two drops and my ends look glass-like. Worth every cent.', date: '2026-06-14', verified: true },
  { id: 'r2', productId: '1', author: 'Noor K.', rating: 5, title: 'Smells incredible', body: 'A warm, subtle scent that doesn\'t clash with perfume. Absorbs fast too.', date: '2026-05-30', verified: true },
  { id: 'r3', productId: '2', author: 'Priya S.', rating: 5, title: 'Saved my balayage', body: 'My colourist noticed the difference at my last appointment.', date: '2026-06-02', verified: true },
  { id: 'r4', productId: '3', author: 'Jonas W.', rating: 4, title: 'Cooling and clean', body: 'Lovely tingle, no greasy residue. Would buy again.', date: '2026-04-21', verified: true },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getReviewsForProduct(productId: string) {
  return reviews.filter((r) => r.productId === productId);
}
