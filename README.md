# Velara — Luxury Hair Oil E-Commerce

A production-structured e-commerce storefront and admin dashboard for **Velara**, a
small-batch luxury hair oil brand. Built with Next.js 14 (App Router), TypeScript,
Tailwind CSS, Framer Motion, Supabase, and Cloudinary.

See `BRAND.md` for the visual identity/packaging concept and `MARKETING.md` for the
launch strategy.

## Stack
- **Framework:** Next.js 14 (App Router, Server + Client Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom design tokens (`tailwind.config.ts`)
- **Animation:** Framer Motion (hero sequence, scroll reveals, cart drawer, "Gold Pour" signature motif)
- **Database:** Supabase (Postgres) — schema in `supabase/schema.sql`
- **Media:** Cloudinary (`src/lib/cloudinary.ts`)
- **State:** Zustand (cart, persisted to localStorage)
- **Forms/validation:** react-hook-form + zod
- **Charts:** Recharts (admin analytics)

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Cloudinary keys
npm run dev
```

The storefront runs at `/`, the admin dashboard at `/admin`. The app works out of
the box with in-memory/mock data (`src/data/products.ts`, `src/data/admin-mock.ts`)
even before Supabase is connected, so you can preview the full UI immediately.

## Connecting Supabase
1. Create a project at supabase.com.
2. In the SQL editor, run `supabase/schema.sql` — it creates all tables (products,
   customers, orders, reviews, discounts), row-level security policies, and seeds
   the six launch products + starter discount codes.
3. Copy your Project URL, anon key, and service role key into `.env.local`.
4. The checkout API route (`src/app/api/checkout/route.ts`) and order tracking
   route (`src/app/api/track/route.ts`) will automatically start persisting to
   Supabase — no code changes required.

## Connecting Cloudinary
1. Create a Cloudinary account and an unsigned upload preset named
   `velara_unsigned` (or update `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`).
2. Fill in `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and
   `CLOUDINARY_API_SECRET` in `.env.local`.
3. Replace the Unsplash placeholder URLs in `src/data/products.ts` with your
   uploaded product photography, or wire the admin Products form to upload
   directly via `next-cloudinary`.

## Project Structure

```
src/
  app/
    page.tsx                # Home
    shop/page.tsx            # Shop / catalog with filters
    product/[slug]/page.tsx  # Product detail
    cart/page.tsx            # Cart
    checkout/page.tsx        # Checkout
    thank-you/page.tsx       # Order confirmation
    track-order/page.tsx     # Order tracking
    admin/
      page.tsx               # Analytics dashboard
      orders/                # Order management
      products/              # Product CRUD
      customers/              # Customer list
      discounts/              # Discount codes
      reviews/                # Review moderation
      settings/               # Store settings
    api/
      checkout/route.ts      # Creates orders (Supabase or in-memory fallback)
      track/route.ts         # Order lookup
  components/                # Header, Footer, CartDrawer, ProductCard, GoldPour, etc.
  lib/                       # Supabase clients, Cloudinary helper, shared types
  data/                      # Seed product/review/admin data
  store/cart.ts              # Zustand cart store
supabase/schema.sql          # Full DB schema + RLS + seed data
```

## Payments
The checkout form is wired end-to-end (validation → API route → order number →
thank-you page) but ships payment-provider-agnostic: card fields are captured in
the UI and the order is created immediately for demo purposes. To take real
payments, wire `src/app/checkout/page.tsx` and `src/app/api/checkout/route.ts` to
Stripe (env vars already scaffolded in `.env.example`) or your PSP of choice before
going live.

## Deployment
Configured for Vercel (`vercel.json`):

```bash
vercel deploy
```

Set the same environment variables from `.env.example` in your Vercel project
settings. Any Node-compatible host works too (`npm run build && npm run start`).

## Design System
Full token reference in `tailwind.config.ts` and `BRAND.md`. The signature visual
motif — "The Pour", an animated ribbon of gold that pools into a droplet — appears
in `src/components/GoldPour.tsx` and is echoed in the product-card hover sheen and
the hero's drifting droplets.
