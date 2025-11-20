import type { MenuItem, MenuCategory } from '@/lib/types';
import { Soup, Beef, GlassWater, Cake, Fish } from 'lucide-react';

export const categories: MenuCategory[] = [
  { id: 'principales', name: 'Brasas', icon: Beef },
  { id: 'chaufa', name: 'Chaufa', icon: Soup },
  { id: 'postres', name: 'Postres', icon: Cake },
];

export const menuItems: MenuItem[] = [
  {
    id: 'lomo-saltado',
    name: 'Lomo Saltado',
    description: 'Trozos de lomo de res salteados con cebolla, tomate, ají amarillo y papas fritas. Acompañado de arroz.',
    price: 55.00,
    category: 'principales',
    image: 'https://static.wixstatic.com/media/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png/v1/fill/w_568,h_320,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png',
    imageHint: 'lomo saltado',
    extras: [
      { name: 'Huevo Frito', price: 2.50 },
      { name: 'Porción de Plátano', price: 5.00 },
      { name: 'Extra Lomo', price: 10.00 }
    ]
  },
  {
    id: 'aji-de-gallina',
    name: 'Ají de Gallina',
    description: 'Pechuga de gallina deshilachada en una cremosa salsa de ají amarillo, pan y leche. Servido con papas y huevo.',
    price: 48.00,
    category: 'principales',
    image: 'https://static.wixstatic.com/media/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png/v1/fill/w_568,h_320,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png',
    imageHint: 'aji gallina',
  },
  {
    id: 'ceviche-clasico',
    name: 'Ceviche Clásico',
    description: 'Pescado fresco del día marinado en jugo de limón, con cebolla roja, ají limo y cilantro. Acompañado de camote y choclo.',
    price: 52.00,
    category: 'ceviches',
    image: 'https://static.wixstatic.com/media/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png/v1/fill/w_568,h_320,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png',
    imageHint: 'ceviche peruvian',
  },
  {
    id: 'causa-limena',
    name: 'Causa Limeña de Pollo',
    description: 'Pastel de papa amarilla prensada y sazonada con ají amarillo y limón, relleno de pollo y mayonesa.',
    price: 35.00,
    category: 'entradas',
    image: 'https://static.wixstatic.com/media/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png/v1/fill/w_568,h_320,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png',
    imageHint: 'peruvian causa',
  },
   {
    id: 'pollo-brasa',
    name: 'Pollo a la Brasa',
    description: 'Pollo entero a la parrilla, acompañado con papas fritas, ensalada fresca y cremas especiales.',
    price: 65.00,
    originalPrice: 70.00,
    category: 'principales',
    image: 'https://static.wixstatic.com/media/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png/v1/fill/w_568,h_320,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png',
    imageHint: 'roasted chicken salad',
    extras: [
        { name: 'Porción de arroz', price: 4.00 },
        { name: 'Todas las cremas', price: 3.00 }
    ]
  },
  {
    id: 'medio-pollo-brasa',
    name: '1/2 Pollo a la Brasa',
    description: 'Medio pollo jugoso a la parrilla con papas fritas y ensalada. Ideal para compartir.',
    price: 35.00,
    originalPrice: 42.00,
    category: 'principales',
    image: 'https://static.wixstatic.com/media/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png/v1/fill/w_568,h_320,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png',
    imageHint: 'half roasted chicken',
  },
  {
    id: 'cuarto-pollo-brasa',
    name: '1/4 Pollo a la Brasa',
    description: 'Cuarto de pollo dorado a la perfección, incluye papas y ensalada.',
    price: 20.00,
    originalPrice: 25.00,
    category: 'principales',
    image: 'https://static.wixstatic.com/media/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png/v1/fill/w_568,h_320,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png',
    imageHint: 'quarter roasted chicken',
  },
  {
    id: 'pollo-brasa-familiar',
    name: 'Pollo a la Brasa Familiar',
    description: 'Pollo entero + papas grandes + ensalada + 2L de gaseosa. Perfecto para la familia.',
    price: 85.00,
    originalPrice: 95.00,
    category: 'principales',
    image: 'https://static.wixstatic.com/media/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png/v1/fill/w_568,h_320,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png',
    imageHint: 'family roasted chicken',
  },
  {
    id: 'chicha-morada',
    name: 'Chicha Morada',
    description: 'Bebida tradicional peruana hecha de maíz morado, frutas y especias.',
    price: 12.00,
    category: 'bebidas',
    image: 'https://static.wixstatic.com/media/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png/v1/fill/w_568,h_320,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png',
    imageHint: 'purple drink',
  },
  {
    id: 'pisco-sour',
    name: 'Pisco Sour',
    description: 'El cóctel bandera de Perú, preparado con pisco, jugo de limón, jarabe de goma y clara de huevo.',
    price: 28.00,
    category: 'bebidas',
    image: 'https://static.wixstatic.com/media/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png/v1/fill/w_568,h_320,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png',
    imageHint: 'cocktail glass',
  },
  {
    id: 'suspiro-limena',
    name: 'Suspiro a la Limeña',
    description: 'Dulce de leche cremoso (manjar blanco) cubierto con un merengue italiano al oporto.',
    price: 25.00,
    category: 'postres',
    image: 'https://static.wixstatic.com/media/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png/v1/fill/w_568,h_320,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png',
    imageHint: 'dessert glass',
  }
];
