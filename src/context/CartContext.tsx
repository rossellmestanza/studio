
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { CartItem, MenuItem, MenuItemExtra } from '@/lib/types';
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
  addToCart: (item: MenuItem, quantity: number, notes: string, selectedExtras?: MenuItemExtra[]) => void;
  removeFromCart: (cartItemId: string) => void;
  updateItemQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  customerData: CustomerData | null;
  setCustomerData: (data: CustomerData) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to generate a unique ID for a cart item based on its extras
const generateCartItemId = (itemId: string, extras: MenuItemExtra[]) => {
    if (!extras || extras.length === 0) {
        return itemId;
    }
    const extraIds = extras.map(e => `${e.name.replace(/\s/g, '-')}:${e.price}`).sort().join('|');
    return `${itemId}_${extraIds}`;
};


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const { toast } = useToast();

  const addToCart = (item: MenuItem, quantity: number, notes: string, selectedExtras: MenuItemExtra[] = []) => {
    const cartItemId = generateCartItemId(item.id, selectedExtras);
    const priceWithExtras = item.price + selectedExtras.reduce((acc, extra) => acc + extra.price, 0);

    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === cartItemId);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === cartItemId
            ? { ...cartItem, quantity: cartItem.quantity + quantity, notes: cartItem.notes || notes } // Append notes if item is the same
            : cartItem
        );
      } else {
        const newItem: CartItem = {
          ...item,
          id: cartItemId, // The unique ID for this specific combination
          originalId: item.id, // Keep track of the base product ID
          price: priceWithExtras, // Price including selected extras
          quantity,
          notes,
          selectedExtras,
        };
        return [...prevItems, newItem];
      }
    });

    toast({
      title: "¡Agregado!",
      description: `${item.name} se agregó a tu carrito.`,
    })
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
  };

  const updateItemQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === cartItemId ? { ...item, quantity } : item
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
