
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { CartItem, MenuItem } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

export interface CustomerData {
  orderType: 'delivery' | 'pickup' | 'table';
  name: string;
  phone: string;
  address?: string;
  reference?: string;
  tableNumber?: string;
  paymentMethod?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem, quantity: number, notes: string) => void;
  removeFromCart: (itemId: string, notes: string | undefined) => void;
  updateItemQuantity: (itemId: string, notes: string | undefined, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  customerData: CustomerData | null;
  setCustomerData: (data: CustomerData) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const { toast } = useToast();

  const addToCart = (item: MenuItem, quantity: number, notes: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id && cartItem.notes === notes);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id && cartItem.notes === notes
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity, notes }];
      }
    });
    toast({
      title: "¡Agregado!",
      description: `${item.name} se agregó a tu carrito.`,
    })
  };

  const removeFromCart = (itemId: string, notes: string | undefined) => {
    setCartItems(prevItems => prevItems.filter(item => !(item.id === itemId && item.notes === notes)));
  };

  const updateItemQuantity = (itemId: string, notes: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId, notes);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          (item.id === itemId && item.notes === notes) ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
        cartTotal,
        cartCount,
        customerData,
        setCustomerData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
