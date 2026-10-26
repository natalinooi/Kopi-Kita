-- ========================================================
-- KOPI KITA - Owner & POS Backoffice Database Schema
-- Run this in your Supabase SQL Editor
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Table: products (Menu Catalog & Stock)
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  price integer not null,
  description text,
  image_url text,
  is_available boolean default true,
  stock_count integer default 50,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Table: orders (Header Transactions & Kitchen Status)
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique,
  customer_name text not null,
  order_type text default 'dine_in', -- 'dine_in' or 'take_away'
  status text default 'pesanan_masuk', -- 'pesanan_masuk' -> 'sedang_diseduh' -> 'siap_diambil' -> 'selesai'
  total_amount integer not null,
  discount_amount integer default 0,
  payment_method text not null, -- 'qris' or 'cash'
  payment_status text default 'paid', -- 'paid' or 'pending'
  cashier_name text default 'Kasir Sudirman',
  notes text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. Table: order_items (Item Line Details)
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null default 1,
  unit_price integer not null,
  subtotal integer not null,
  size text default 'Regular',
  temperature text default 'Ice',
  sugar_level text default 'Normal 100%',
  customization_notes text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 4. Table: profiles (Cashier / Owner Roles)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text not null,
  role text not null check (role in ('cashier', 'owner')),
  outlet_name text default 'Sudirman Roastery Hub',
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.profiles enable row level security;

-- Drop existing policies if any (prevents error 42710)
drop policy if exists "Allow read products to all" on public.products;
drop policy if exists "Allow insert products to authenticated" on public.products;
drop policy if exists "Allow update products to authenticated" on public.products;
drop policy if exists "Allow all access to orders" on public.orders;
drop policy if exists "Allow all access to order_items" on public.order_items;
drop policy if exists "Allow all access to profiles" on public.profiles;

-- Permissive policies for POS and Kitchen backoffice
create policy "Allow read products to all" on public.products for select using (true);
create policy "Allow insert products to authenticated" on public.products for insert with check (true);
create policy "Allow update products to authenticated" on public.products for update using (true);

create policy "Allow all access to orders" on public.orders for all using (true) with check (true);
create policy "Allow all access to order_items" on public.order_items for all using (true) with check (true);
create policy "Allow all access to profiles" on public.profiles for all using (true) with check (true);

-- Enable Realtime publication for orders and products safely
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'order_items'
  ) then
    alter publication supabase_realtime add table public.order_items;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'products'
  ) then
    alter publication supabase_realtime add table public.products;
  end if;
end $$;

-- Initial Seed Data: Products (Inserted safely without duplicates)
insert into public.products (name, category, price, description, image_url, is_available, stock_count)
select 'Es Kopi Susu Senja', 'Es Kopi', 18000, 'Espresso + Fresh Milk + Organic Aren aren palm syrup and creamy cold milk', '/images/07_artisanal_photo_es_kopi_susu_senja.png', true, 85
where not exists (select 1 from public.products where name = 'Es Kopi Susu Senja');

insert into public.products (name, category, price, description, image_url, is_available, stock_count)
select 'Hot Oat Cappuccino', 'Hot Brew', 26000, 'Gayo Honey Roast + Creamy Oatside microfoam rosette', '/images/06_explore_and_menu_catalog.jpg', true, 42
where not exists (select 1 from public.products where name = 'Hot Oat Cappuccino');

insert into public.products (name, category, price, description, image_url, is_available, stock_count)
select 'Manual Brew V60 Flores', 'Manual Brew', 32000, 'Single origin notes of Jasmine, Peach & Wildflower Honey', '/images/03_slow_bar_menu_and_customizer.png', true, 28
where not exists (select 1 from public.products where name = 'Manual Brew V60 Flores');

insert into public.products (name, category, price, description, image_url, is_available, stock_count)
select 'Almond Croissant Toast', 'Artisan Bakery', 28000, 'Flaky French butter pastry topped with roasted sliced almonds', '/images/04_brew_tray_and_order_checkout.png', true, 19
where not exists (select 1 from public.products where name = 'Almond Croissant Toast');

insert into public.products (name, category, price, description, image_url, is_available, stock_count)
select 'Es Kopi Pandan Skena', 'Es Kopi', 22000, 'Double shot arabica with fresh daun suji pandan extract', '/images/02_discover_and_daily_roast.jpg', true, 50
where not exists (select 1 from public.products where name = 'Es Kopi Pandan Skena');

insert into public.products (name, category, price, description, image_url, is_available, stock_count)
select 'Matcha Ceremonial Latte', 'Non-Coffee', 27000, 'Artisanal Uji Kyoto matcha whisked fresh with oat milk', '/images/09_product_detail_and_cup_customizer.png', true, 34
where not exists (select 1 from public.products where name = 'Matcha Ceremonial Latte');

insert into public.products (name, category, price, description, image_url, is_available, stock_count)
select 'Cold Brew White Velvet', 'Es Kopi', 24000, 'Steeped 18 hours in stone roastery with sweet vanilla cream float', '/images/10_pesanan_and_checkout.png', true, 20
where not exists (select 1 from public.products where name = 'Cold Brew White Velvet');

insert into public.products (name, category, price, description, image_url, is_available, stock_count)
select 'Earl Grey Choco Scone', 'Artisan Bakery', 25000, 'English bergamot infusion with 70% dark Belgian chocolate', '/images/05_roastery_club_and_passport.png', true, 15
where not exists (select 1 from public.products where name = 'Earl Grey Choco Scone');

