
import type { LucideIcon } from 'lucide-react';

export interface MenuItemExtra {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string; // Can be a URL or a data URI
  imageHint: string;
  category: string;
  extras?: MenuItemExtra[];
}

export interface MenuCategory {
  id: string;
  name:string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
  selectedExtras: MenuItemExtra[];
  originalId: string; // To track the base product
}

export type OrderStatus = 'Recibido' | 'En preparación' | 'En camino' | 'Entregado' | 'Cancelado';
export type OrderType = 'delivery' | 'pickup' | 'table';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  extras?: string;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  address?: string;
  reference?: string;
  orderType: OrderType;
  tableNumber?: string;
  paymentMethod?: string;
  date: string;
  timestamp: any; // Firestore Timestamp
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}


export interface Banner {
    id: string;
    title: string;
    description: string;
    buttonText: string;
    imageUrl: string; // Can be a URL or a data URI
    href: string;
}

export interface Location {
    id: string;
    name: string;
    address: string;
    phone: string;
    mapUrl: string;
}

export interface BusinessInfo {
    id?: string;
    businessName: string;
    logoUrl: string;
    footerAddress: string;
    footerHours: string;
    footerPhone: string;
    footerWhatsapp: string;
    facebookUrl?: string;
    instagramUrl?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}
