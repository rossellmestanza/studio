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
  image: string;
  imageHint: string;
  category: string;
  extras?: MenuItemExtra[];
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: LucideIcon;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
  selectedExtras?: MenuItemExtra[];
}
