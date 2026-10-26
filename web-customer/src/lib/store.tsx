'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from './supabase';

export interface CartLineItem {
  id: string; // unique item hash
  product: Product;
  quantity: number;
  size: 'Regular' | 'Large';
  temperature: 'Ice' | 'Hot';
  sugar_level: 'Normal 100%' | 'Less Sugar 50%' | 'No Sugar 0%';
  ice_level: 'Normal Ice' | 'Less Ice' | 'No Ice';
  notes?: string;
  unitPrice: number;
  totalPrice: number;
}

interface CartContextType {
  cart: CartLineItem[];
  addToCart: (
    product: Product,
    options: {
      size: 'Regular' | 'Large';
      temperature?: 'Ice' | 'Hot';
      sugar_level?: 'Normal 100%' | 'Less Sugar 50%' | 'No Sugar 0%';
      ice_level?: 'Normal Ice' | 'Less Ice' | 'No Ice';
      notes?: string;
    }
  ) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  totalAmount: number;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  orderType: 'dine_in' | 'take_away';
  setOrderType: (t: 'dine_in' | 'take_away') => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLineItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [orderType, setOrderType] = useState<'dine_in' | 'take_away'>('dine_in');
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kopikita_customer_cart');
      if (stored) {
        try {
          setCart(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('kopikita_customer_cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (
    product: Product,
    options: {
      size: 'Regular' | 'Large';
      temperature?: 'Ice' | 'Hot';
      sugar_level?: 'Normal 100%' | 'Less Sugar 50%' | 'No Sugar 0%';
      ice_level?: 'Normal Ice' | 'Less Ice' | 'No Ice';
      notes?: string;
    }
  ) => {
    const extraPrice = options.size === 'Large' ? 4000 : 0;
    const unitPrice = product.price + extraPrice;
    const temp = options.temperature || (product.category === 'Hot Brew' ? 'Hot' : 'Ice');
    const sugar = options.sugar_level || 'Normal 100%';
    const ice = options.ice_level || 'Normal Ice';
    const noteText = options.notes?.trim() || '';

    const lineId = `${product.id}-${options.size}-${temp}-${sugar}-${ice}-${noteText}`;

    setCart((prev) => {
      const existing = prev.find((it) => it.id === lineId);
      if (existing) {
        return prev.map((it) =>
          it.id === lineId
            ? {
                ...it,
                quantity: it.quantity + 1,
                totalPrice: (it.quantity + 1) * unitPrice,
              }
            : it
        );
      } else {
        const newLine: CartLineItem = {
          id: lineId,
          product,
          quantity: 1,
          size: options.size,
          temperature: temp,
          sugar_level: sugar,
          ice_level: ice,
          notes: noteText || undefined,
          unitPrice,
          totalPrice: unitPrice,
        };
        return [...prev, newLine];
      }
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const nextQty = it.quantity + delta;
            return {
              ...it,
              quantity: nextQty,
              totalPrice: nextQty * it.unitPrice,
            };
          }
          return it;
        })
        .filter((it) => it.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((it) => it.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setCouponCode('');
  };

  const subtotal = cart.reduce((acc, it) => acc + it.totalPrice, 0);

  const applyCoupon = (code: string) => {
    const upper = code.trim().toUpperCase();
    if (upper === 'SENJA30') {
      setCouponCode(upper);
      setDiscount(Math.round(subtotal * 0.3));
      return true;
    } else if (upper === 'KOPIKITA5K') {
      setCouponCode(upper);
      setDiscount(Math.min(5000, subtotal));
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
  };

  const totalItems = cart.reduce((acc, it) => acc + it.quantity, 0);
  const totalAmount = Math.max(0, subtotal - discount);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        discount,
        totalAmount,
        couponCode,
        applyCoupon,
        removeCoupon,
        orderType,
        setOrderType,
        customerName,
        setCustomerName,
        tableNumber,
        setTableNumber,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
