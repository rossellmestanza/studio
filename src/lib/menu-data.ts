import type { MenuItem, MenuCategory } from '@/lib/types';
import { Soup, Beef, GlassWater, Cake, Fish } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

export const categories: MenuCategory[] = [
  { id: 'entradas', name: 'Entradas', icon: Soup },
  { id: 'principales', name: 'Platos Principales', icon: Beef },
  { id: 'ceviches', name: 'Ceviches', icon: Fish },
  { id: 'bebidas', name: 'Bebidas', icon: GlassWater },
  { id: 'postres', name: 'Postres', icon: Cake },
];

export const menuItems: MenuItem[] = [
  {
    id: 'lomo-saltado',
    name: 'Lomo Saltado',
    description: 'Trozos de lomo de res salteados con cebolla, tomate, ají amarillo y papas fritas. Acompañado de arroz.',
    price: 55.00,
    category: 'principales',
    image: getImage('lomo-saltado')?.imageUrl || '',
    imageHint: getImage('lomo-saltado')?.imageHint || 'lomo saltado',
  },
  {
    id: 'aji-de-gallina',
    name: 'Ají de Gallina',
    description: 'Pechuga de gallina deshilachada en una cremosa salsa de ají amarillo, pan y leche. Servido con papas y huevo.',
    price: 48.00,
    category: 'principales',
    image: getImage('aji-de-gallina')?.imageUrl || '',
    imageHint: getImage('aji-de-gallina')?.imageHint || 'aji gallina',
  },
  {
    id: 'ceviche-clasico',
    name: 'Ceviche Clásico',
    description: 'Pescado fresco del día marinado en jugo de limón, con cebolla roja, ají limo y cilantro. Acompañado de camote y choclo.',
    price: 52.00,
    category: 'ceviches',
    image: getImage('ceviche')?.imageUrl || '',
    imageHint: getImage('ceviche')?.imageHint || 'ceviche peruvian',
  },
  {
    id: 'causa-limena',
    name: 'Causa Limeña de Pollo',
    description: 'Pastel de papa amarilla prensada y sazonada con ají amarillo y limón, relleno de pollo y mayonesa.',
    price: 35.00,
    category: 'entradas',
    image: getImage('causa')?.imageUrl || '',
    imageHint: getImage('causa')?.imageHint || 'peruvian causa',
  },
  {
    id: 'chicha-morada',
    name: 'Chicha Morada',
    description: 'Bebida tradicional peruana hecha de maíz morado, frutas y especias.',
    price: 12.00,
    category: 'bebidas',
    image: getImage('chicha-morada')?.imageUrl || '',
    imageHint: getImage('chicha-morada')?.imageHint || 'purple drink',
  },
  {
    id: 'pisco-sour',
    name: 'Pisco Sour',
    description: 'El cóctel bandera de Perú, preparado con pisco, jugo de limón, jarabe de goma y clara de huevo.',
    price: 28.00,
    category: 'bebidas',
    image: getImage('pisco-sour')?.imageUrl || '',
    imageHint: getImage('pisco-sour')?.imageHint || 'cocktail glass',
  },
  {
    id: 'suspiro-limena',
    name: 'Suspiro a la Limeña',
    description: 'Dulce de leche cremoso (manjar blanco) cubierto con un merengue italiano al oporto.',
    price: 25.00,
    category: 'postres',
    image: getImage('suspiro-limena')?.imageUrl || '',
    imageHint: getImage('suspiro-limena')?.imageHint || 'dessert glass',
  }
];
