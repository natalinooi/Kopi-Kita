export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderStatus = 'pesanan_masuk' | 'sedang_diseduh' | 'siap_diambil' | 'selesai' | 'dibatalkan';
export type PaymentMethod = 'qris' | 'cash';
export type PaymentStatus = 'paid' | 'pending';
export type UserRole = 'cashier' | 'owner';
export type OrderType = 'dine_in' | 'take_away';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string | null;
  image_url: string | null;
  is_available: boolean;
  stock_count: number;
  created_at?: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  size: 'Regular' | 'Large';
  temperature: 'Ice' | 'Hot';
  sugar_level: 'Normal 100%' | 'Less Sugar 50%' | 'No Sugar 0%';
  customization_notes?: string;
  created_at?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  order_type: OrderType;
  status: OrderStatus;
  total_amount: number;
  discount_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  cashier_name: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string;
  role: UserRole;
  outlet_name: string;
  created_at: string;
}

export interface CartItem {
  id: string; // unique cart line id
  product: Product;
  quantity: number;
  size: 'Regular' | 'Large';
  temperature: 'Ice' | 'Hot';
  sugar_level: 'Normal 100%' | 'Less Sugar 50%' | 'No Sugar 0%';
  notes?: string;
  unitPrice: number;
  totalPrice: number;
}

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Partial<Product>;
        Update: Partial<Product>;
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: Partial<Order>;
        Update: Partial<Order>;
        Relationships: [];
      };
      order_items: {
        Row: OrderItem;
        Insert: Partial<OrderItem>;
        Update: Partial<OrderItem>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
