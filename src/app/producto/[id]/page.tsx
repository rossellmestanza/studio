
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

import { menuItems } from '@/lib/menu-data';
import type { MenuItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const item: MenuItem | undefined = menuItems.find(
    (menuItem) => menuItem.id === params.id
  );

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
          <p className="text-muted-foreground mt-2">
            El producto que buscas no existe.
          </p>
          <Button asChild className="mt-6">
            <Link href="/carta">Volver a la carta</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(item, 1, '');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={item.imageHint}
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{item.name.toUpperCase()}</h1>
            <p className="text-muted-foreground text-lg mb-6">{item.description}</p>
            <div className="flex items-baseline gap-4 mb-8">
              <p className="text-3xl font-bold text-primary">S/ {item.price.toFixed(2)}</p>
              {item.originalPrice && (
                <p className="text-xl text-muted-foreground line-through">
                  S/ {item.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
            <Button size="lg" className="w-full md:w-auto bg-[#841515] hover:bg-[#6a1010] text-white text-lg py-7 px-8" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Agregar al Carrito
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
