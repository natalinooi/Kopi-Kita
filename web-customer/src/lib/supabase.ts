import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseUrl.includes('demo-kopi-kita')
);

const safeUrl = supabaseUrl && supabaseUrl.startsWith('http')
  ? supabaseUrl
  : 'https://demo-kopi-kita.supabase.co';
const safeKey = supabaseAnonKey || 'dummy_anon_key_kopi_kita';

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string | null;
  image_url: string | null;
  is_available: boolean;
  stock_count: number;
}

export type OrderStatus = 'pesanan_masuk' | 'sedang_diseduh' | 'siap_diambil' | 'selesai' | 'dibatalkan';

export interface OrderItem {
  id?: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  size: 'Regular' | 'Large';
  temperature: 'Ice' | 'Hot';
  sugar_level: 'Normal 100%' | 'Less Sugar 50%' | 'No Sugar 0%';
  customization_notes?: string;
}

export interface CustomerOrder {
  id: string;
  order_number: string;
  customer_name: string;
  order_type: 'dine_in' | 'take_away';
  table_number?: string;
  status: OrderStatus;
  total_amount: number;
  discount_amount: number;
  payment_method: 'qris' | 'cash';
  payment_status: 'paid' | 'pending';
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Es Kopi Susu Senja',
    category: 'Es Kopi',
    price: 18000,
    description: 'Espresso + Fresh Milk + Organic Aren aren palm syrup, slow extracted dark roast',
    image_url: '/images/products/es_kopi_susu_senja.png',
    is_available: true,
    stock_count: 85,
  },
  {
    id: 'prod-002',
    name: 'Hot Oat Cappuccino',
    category: 'Hot Brew',
    price: 26000,
    description: 'Gayo Honey Roast + Creamy Oatside microfoam rosette latte art',
    image_url: '/images/products/hot_oat_cappuccino.png',
    is_available: true,
    stock_count: 42,
  },
  {
    id: 'prod-003',
    name: 'Manual Brew V60 Flores',
    category: 'Manual Brew',
    price: 32000,
    description: 'Single origin filter extraction with notes of Jasmine, Peach & Wildflower Honey',
    image_url: '/images/products/manual_brew_v60_flores.png',
    is_available: true,
    stock_count: 28,
  },
  {
    id: 'prod-004',
    name: 'Almond Croissant Toast',
    category: 'Artisan Bakery',
    price: 28000,
    description: 'Flaky French butter pastry topped with toasted sliced almonds & vanilla sugar',
    image_url: '/images/products/almond_croissant_toast.png',
    is_available: true,
    stock_count: 19,
  },
  {
    id: 'prod-005',
    name: 'Es Kopi Pandan Skena',
    category: 'Es Kopi',
    price: 22000,
    description: 'Double shot arabica blend with fresh pandan suji extract and condensed milk',
    image_url: '/images/products/es_kopi_pandan_skena.png',
    is_available: true,
    stock_count: 50,
  },
  {
    id: 'prod-006',
    name: 'Matcha Ceremonial Latte',
    category: 'Non-Coffee',
    price: 27000,
    description: 'Artisanal Uji Kyoto ceremonial matcha whisked fresh with velvety oat milk',
    image_url: '/images/products/matcha_ceremonial_latte.png',
    is_available: true,
    stock_count: 34,
  },
  {
    id: 'prod-007',
    name: 'Cold Brew White Velvet',
    category: 'Es Kopi',
    price: 24000,
    description: 'Steeped 18 hours in stone roastery with sweet vanilla cream float',
    image_url: '/images/products/cold_brew_white_velvet.png',
    is_available: true,
    stock_count: 20,
  },
  {
    id: 'prod-008',
    name: 'Earl Grey Choco Scone',
    category: 'Artisan Bakery',
    price: 25000,
    description: 'English bergamot black tea infusion with 70% dark Belgian chocolate chunks',
    image_url: '/images/products/earl_grey_choco_scone.png',
    is_available: true,
    stock_count: 15,
  },
];

// Fetch available products from Supabase (or local fallback)
export async function getAvailableProducts(): Promise<Product[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .gt('stock_count', 0)
        .order('name');
      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    } catch (err) {
      console.warn('Supabase fetch failed, fallback to seed products:', err);
    }
  }

  // Local sync check
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('kopikita_products');
    if (local) {
      try {
        const parsed: Product[] = JSON.parse(local);
        return parsed.filter((p) => p.is_available && p.stock_count > 0);
      } catch {
        // use seed
      }
    }
  }
  return SEED_PRODUCTS.filter((p) => p.is_available && p.stock_count > 0);
}

// Create new customer order in Supabase
export async function createCustomerOrder(
  order: Omit<CustomerOrder, 'id' | 'created_at' | 'updated_at'>,
  items: Omit<OrderItem, 'id'>[]
): Promise<CustomerOrder> {
  const newId = 'kpk-' + Date.now();
  const now = new Date().toISOString();

  const completeOrder: CustomerOrder = {
    ...order,
    id: newId,
    created_at: now,
    updated_at: now,
    items: items.map((it, idx) => ({ ...it, id: `${newId}-${idx + 1}` })),
  };

  if (isSupabaseConfigured) {
    try {
      const { data: insertedOrder, error } = await supabase
        .from('orders')
        .insert({
          order_number: completeOrder.order_number,
          customer_name: completeOrder.customer_name,
          order_type: completeOrder.order_type,
          status: completeOrder.status,
          total_amount: completeOrder.total_amount,
          discount_amount: completeOrder.discount_amount,
          payment_method: completeOrder.payment_method,
          payment_status: completeOrder.payment_status,
          notes: completeOrder.notes || (completeOrder.table_number ? `Meja: ${completeOrder.table_number}` : null),
        })
        .select()
        .single();

      if (!error && insertedOrder) {
        completeOrder.id = insertedOrder.id;
        const linePayload = items.map((it) => ({
          order_id: insertedOrder.id,
          product_id: it.product_id,
          product_name: it.product_name,
          quantity: it.quantity,
          unit_price: it.unit_price,
          subtotal: it.subtotal,
          size: it.size,
          temperature: it.temperature,
          sugar_level: it.sugar_level,
          customization_notes: it.customization_notes,
        }));
        await supabase.from('order_items').insert(linePayload);
      }
    } catch (err) {
      console.warn('Supabase order creation failed, saved locally:', err);
    }
  }

  // Save to localStorage for tracker access & cross-app sync
  if (typeof window !== 'undefined') {
    const existingOrders = JSON.parse(localStorage.getItem('kopikita_orders') || '[]');
    localStorage.setItem('kopikita_orders', JSON.stringify([completeOrder, ...existingOrders]));
    window.dispatchEvent(new CustomEvent('kopikita_state_updated'));
  }

  return completeOrder;
}

// Retrieve single order for live tracker
export async function getOrderById(id: string): Promise<CustomerOrder | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('id', id)
        .single();
      if (!error && data) {
        return data as CustomerOrder;
      }
    } catch (err) {
      console.warn('Supabase fetch order failed:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const orders: CustomerOrder[] = JSON.parse(localStorage.getItem('kopikita_orders') || '[]');
    const found = orders.find((o) => o.id === id || o.order_number === id);
    if (found) return found;
  }

  return null;
}
