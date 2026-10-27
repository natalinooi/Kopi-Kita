import { createClient } from '@supabase/supabase-js';
import { Order, OrderItem, Product } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate whether a custom, live Supabase project is configured
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseUrl.includes('demo-kopi-kita') &&
  !supabaseAnonKey.includes('dummy_anon_key')
);

// Fallback URL to prevent createClient crashes if env vars are completely empty
const safeUrl = supabaseUrl && supabaseUrl.startsWith('http') 
  ? supabaseUrl 
  : 'https://placeholder-kopi-kita.supabase.co';
const safeKey = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Initial Seed Products
export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Es Kopi Susu Senja',
    category: 'Es Kopi',
    price: 18000,
    description: 'Espresso + Fresh Milk + Organic Aren aren palm sugar & slow-extracted dark roast',
    image_url: '/images/products/es_kopi_susu_senja.png',
    is_available: true,
    stock_count: 85,
    created_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-007',
    name: 'Cold Brew White Velvet',
    category: 'Es Kopi',
    price: 24000,
    description: 'Steeped 18 hours in stone roastery with sweet vanilla cream float',
    image_url: '/images/products/cold_brew_white_velvet.png',
    is_available: false, // demonstrates out of stock state!
    stock_count: 0,
    created_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
  },
];

// Initial Seed Orders for Barista Kanban & Daily Analytics
export const SEED_ORDERS: Order[] = [
  {
    id: 'ord-101',
    order_number: 'KK-1041',
    customer_name: 'Dimas Wicaksono',
    order_type: 'dine_in',
    status: 'pesanan_masuk',
    total_amount: 44000,
    discount_amount: 0,
    payment_method: 'qris',
    payment_status: 'paid',
    cashier_name: 'Kasir 1 (Fajar)',
    notes: 'Less ice untuk Es Kopi Senja',
    created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'item-101-1',
        product_name: 'Es Kopi Susu Senja',
        quantity: 1,
        unit_price: 18000,
        subtotal: 18000,
        size: 'Large',
        temperature: 'Ice',
        sugar_level: 'Less Sugar 50%',
        customization_notes: 'Extra oat foam',
      },
      {
        id: 'item-101-2',
        product_name: 'Hot Oat Cappuccino',
        quantity: 1,
        unit_price: 26000,
        subtotal: 26000,
        size: 'Regular',
        temperature: 'Hot',
        sugar_level: 'No Sugar 0%',
      },
    ],
  },
  {
    id: 'ord-102',
    order_number: 'KK-1040',
    customer_name: 'Anindya Putri',
    order_type: 'take_away',
    status: 'sedang_diseduh',
    total_amount: 60000,
    discount_amount: 0,
    payment_method: 'cash',
    payment_status: 'paid',
    cashier_name: 'Kasir 1 (Fajar)',
    notes: 'Bungkus rapat untuk perjalanan motor',
    created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'item-102-1',
        product_name: 'Manual Brew V60 Flores',
        quantity: 1,
        unit_price: 32000,
        subtotal: 32000,
        size: 'Regular',
        temperature: 'Hot',
        sugar_level: 'No Sugar 0%',
      },
      {
        id: 'item-102-2',
        product_name: 'Almond Croissant Toast',
        quantity: 1,
        unit_price: 28000,
        subtotal: 28000,
        size: 'Regular',
        temperature: 'Hot',
        sugar_level: 'Normal 100%',
        customization_notes: 'Dihangatkan 1 menit',
      },
    ],
  },
  {
    id: 'ord-103',
    order_number: 'KK-1039',
    customer_name: 'Reza Pratama',
    order_type: 'dine_in',
    status: 'siap_diambil',
    total_amount: 36000,
    discount_amount: 0,
    payment_method: 'qris',
    payment_status: 'paid',
    cashier_name: 'Kasir 2 (Bagas)',
    notes: 'Meja No. 04 lantai 2',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'item-103-1',
        product_name: 'Es Kopi Susu Senja',
        quantity: 2,
        unit_price: 18000,
        subtotal: 36000,
        size: 'Regular',
        temperature: 'Ice',
        sugar_level: 'Normal 100%',
      },
    ],
  },
  {
    id: 'ord-104',
    order_number: 'KK-1038',
    customer_name: 'Sarah Amelia',
    order_type: 'dine_in',
    status: 'selesai',
    total_amount: 49000,
    discount_amount: 0,
    payment_method: 'cash',
    payment_status: 'paid',
    cashier_name: 'Kasir 1 (Fajar)',
    notes: null,
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'item-104-1',
        product_name: 'Matcha Ceremonial Latte',
        quantity: 1,
        unit_price: 27000,
        subtotal: 27000,
        size: 'Regular',
        temperature: 'Ice',
        sugar_level: 'Less Sugar 50%',
      },
      {
        id: 'item-104-2',
        product_name: 'Es Kopi Pandan Skena',
        quantity: 1,
        unit_price: 22000,
        subtotal: 22000,
        size: 'Regular',
        temperature: 'Ice',
        sugar_level: 'Normal 100%',
      },
    ],
  },
];

// Local Client State Repository (Seamlessly bridges Supabase / Local Storage)
class KopiKitaStore {
  private products: Product[] = [];
  private orders: Order[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    const storedProducts = localStorage.getItem('kopikita_products');
    if (storedProducts) {
      try {
        this.products = JSON.parse(storedProducts);
      } catch {
        this.products = [...SEED_PRODUCTS];
      }
    } else {
      this.products = [...SEED_PRODUCTS];
      localStorage.setItem('kopikita_products', JSON.stringify(this.products));
    }

    const storedOrders = localStorage.getItem('kopikita_orders');
    if (storedOrders) {
      try {
        this.orders = JSON.parse(storedOrders);
      } catch {
        this.orders = [...SEED_ORDERS];
      }
    } else {
      this.orders = [...SEED_ORDERS];
      localStorage.setItem('kopikita_orders', JSON.stringify(this.orders));
    }
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kopikita_state_updated'));
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  // PRODUCTS API
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');
        if (!error && data && data.length > 0) {
          return data as Product[];
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local store', err);
      }
    }
    if (typeof window !== 'undefined' && this.products.length === 0) {
      this.init();
    }
    return [...this.products];
  }

  async toggleProductAvailability(id: string, is_available: boolean): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('products')
          .update({ is_available })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase update failed:', err);
      }
    }
    this.products = this.products.map((p) =>
      p.id === id ? { ...p, is_available } : p
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem('kopikita_products', JSON.stringify(this.products));
    }
    this.notify();
    return true;
  }

  async updateProductStock(id: string, stock_count: number): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('products')
          .update({ stock_count, is_available: stock_count > 0 })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase update stock failed:', err);
      }
    }
    this.products = this.products.map((p) =>
      p.id === id ? { ...p, stock_count, is_available: stock_count > 0 } : p
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem('kopikita_products', JSON.stringify(this.products));
    }
    this.notify();
    return true;
  }

  // ORDERS API
  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data as Order[];
        }
      } catch (err) {
        console.warn('Supabase getOrders failed, using local store', err);
      }
    }
    if (typeof window !== 'undefined' && this.orders.length === 0) {
      this.init();
    }
    return [...this.orders];
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', orderId);
      } catch (err) {
        console.warn('Supabase updateOrderStatus failed:', err);
      }
    }
    this.orders = this.orders.map((o) =>
      o.id === orderId ? { ...o, status, updated_at: new Date().toISOString() } : o
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem('kopikita_orders', JSON.stringify(this.orders));
    }
    this.notify();
    return true;
  }

  async createOrder(
    orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>,
    items: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[]
  ): Promise<Order> {
    const newId = 'ord-' + Date.now();
    const now = new Date().toISOString();
    const orderItems: OrderItem[] = items.map((it, idx) => ({
      ...it,
      id: `item-${newId}-${idx + 1}`,
      order_id: newId,
      created_at: now,
    }));

    const completeOrder: Order = {
      ...orderData,
      id: newId,
      created_at: now,
      updated_at: now,
      items: orderItems,
    };

    if (isSupabaseConfigured) {
      try {
        const { data: insertedOrder, error: orderErr } = await supabase
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
            cashier_name: completeOrder.cashier_name,
            notes: completeOrder.notes,
          })
          .select()
          .single();

        if (!orderErr && insertedOrder) {
          const itemsPayload = items.map((item) => ({
            order_id: insertedOrder.id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.subtotal,
            size: item.size,
            temperature: item.temperature,
            sugar_level: item.sugar_level,
            customization_notes: item.customization_notes,
          }));
          await supabase.from('order_items').insert(itemsPayload);
          completeOrder.id = insertedOrder.id;
        }
      } catch (err) {
        console.warn('Supabase createOrder failed, keeping local copy:', err);
      }
    }

    this.orders = [completeOrder, ...this.orders];
    if (typeof window !== 'undefined') {
      localStorage.setItem('kopikita_orders', JSON.stringify(this.orders));
    }
    this.notify();
    return completeOrder;
  }

  // Simulation Helper for Demo / Testing Realtime Incoming Order
  simulateCustomerAppOrder(): Order {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const names = ['Rangga Pratama', 'Nabila Syakieb', 'Bima Arya', 'Citra Kirana', 'Bayu Skak', 'Jessica Mila'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const mockOrder: Order = {
      id: `ord-sim-${Date.now()}`,
      order_number: `KK-${randomNum}`,
      customer_name: randomName,
      order_type: Math.random() > 0.5 ? 'dine_in' : 'take_away',
      status: 'pesanan_masuk',
      total_amount: 36000,
      discount_amount: 0,
      payment_method: 'qris',
      payment_status: 'paid',
      cashier_name: 'Android Mobile App',
      notes: 'Customer order via mobile app',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: [
        {
          id: `item-sim-${Date.now()}-1`,
          product_name: 'Es Kopi Susu Senja',
          quantity: 2,
          unit_price: 18000,
          subtotal: 36000,
          size: 'Regular',
          temperature: 'Ice',
          sugar_level: 'Normal 100%',
        },
      ],
    };

    this.orders = [mockOrder, ...this.orders];
    if (typeof window !== 'undefined') {
      localStorage.setItem('kopikita_orders', JSON.stringify(this.orders));
    }
    this.notify();
    return mockOrder;
  }
}

export const store = new KopiKitaStore();
