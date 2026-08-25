-- =====================================================================
-- VELARA — Supabase / Postgres schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- =====================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- PRODUCTS
-- ---------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  tagline text,
  description text,
  story text,
  price numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2),
  size text,
  category text not null check (category in ('Elixirs','Serums','Treatments','Sets')),
  hero_image text,
  gallery text[] default '{}',
  ingredients text[] default '{}',
  how_to_use text[] default '{}',
  rating numeric(2,1) default 5.0,
  review_count int default 0,
  stock int not null default 0,
  bestseller boolean default false,
  is_new boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- CUSTOMERS
-- ---------------------------------------------------------------------
create table if not exists customers (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text unique not null,
  phone text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- ORDERS
-- ---------------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  customer_id uuid references customers(id) on delete set null,
  email text not null,
  items jsonb not null default '[]',
  subtotal numeric(10,2) not null default 0,
  shipping numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status text not null default 'pending' check (status in ('pending','processing','shipped','delivered','cancelled')),
  shipping_address jsonb,
  tracking_number text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_orders_order_number on orders(order_number);
create index if not exists idx_orders_email on orders(email);

-- ---------------------------------------------------------------------
-- REVIEWS
-- ---------------------------------------------------------------------
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  author text not null,
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  verified boolean default false,
  approved boolean default false,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- DISCOUNTS
-- ---------------------------------------------------------------------
create table if not exists discounts (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  type text not null check (type in ('percentage','fixed')),
  value numeric(10,2) not null,
  active boolean default true,
  usage_count int default 0,
  usage_limit int,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- UPDATED_AT TRIGGER
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at before update on products
  for each row execute procedure set_updated_at();

drop trigger if exists trg_orders_updated_at on orders;
create trigger trg_orders_updated_at before update on orders
  for each row execute procedure set_updated_at();

-- ---------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------
alter table products enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table reviews enable row level security;
alter table discounts enable row level security;

-- Public (anon) can read products and approved reviews only.
create policy "Public can view products" on products for select using (true);
create policy "Public can view approved reviews" on reviews for select using (approved = true);

-- Public (anon) can insert an order and their own customer row (checkout flow).
create policy "Public can create orders" on orders for insert with check (true);
create policy "Public can create customers" on customers for insert with check (true);
create policy "Public can create reviews" on reviews for insert with check (true);

-- All other writes (updates/deletes, admin reads of orders/customers/discounts)
-- go through the service-role key from server-side admin routes only, which
-- bypasses RLS by design — never expose the service role key to the client.

-- ---------------------------------------------------------------------
-- SEED DATA (matches src/data/products.ts so the store works immediately)
-- ---------------------------------------------------------------------
insert into products (slug, name, tagline, description, price, compare_at_price, size, category, hero_image, bestseller, is_new, stock, rating, review_count)
values
  ('gold-elixir', 'Gold Elixir', 'The original 24-karat hair oil', 'Signature formula with 24-karat gold flake in argan, marula, and prickly pear oils.', 68, 82, '50ml', 'Elixirs', 'https://images.unsplash.com/photo-1594035910387-fea47794261f', true, false, 148, 4.9, 312),
  ('rosehip-repair-oil', 'Rosehip & Argan Repair Oil', 'Deep repair for colour-treated hair', 'Restorative rosehip, argan and camellia oil blend for chemically treated or heat-damaged hair.', 54, null, '50ml', 'Treatments', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be', true, false, 96, 4.8, 201),
  ('scalp-renewal-serum', 'Scalp Renewal Serum', 'A cooling tonic for a balanced scalp', 'Lightweight tonic with peppermint, rosemary and niacinamide.', 46, null, '30ml', 'Serums', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883', false, true, 210, 4.7, 154),
  ('overnight-silk-oil', 'Overnight Silk Oil', 'Wake up to softer, smoother hair', 'Night-only formula with hyaluronic acid and silk amino acids.', 62, null, '50ml', 'Treatments', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108', false, true, 84, 4.9, 178),
  ('discovery-trio', 'The Discovery Trio', 'Three signature oils, travel-sized', 'Travel-sized trio of our three signature formulas.', 89, 112, '3x15ml', 'Sets', 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd', true, false, 132, 4.9, 267),
  ('amber-shine-drops', 'Amber Shine Drops', 'A glass-finish topcoat for any style', 'Featherweight finishing oil with light heat protection.', 42, null, '30ml', 'Elixirs', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539', false, false, 175, 4.6, 98)
on conflict (slug) do nothing;

insert into discounts (code, type, value, active, usage_count, usage_limit, expires_at) values
  ('GOLD10', 'percentage', 10, true, 214, 1000, '2026-12-31'),
  ('WELCOME15', 'percentage', 15, true, 88, 500, null),
  ('FREESHIP', 'fixed', 6.5, true, 341, null, null)
on conflict (code) do nothing;
