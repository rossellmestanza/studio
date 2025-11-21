
'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

import type { MenuItem, MenuItemExtra } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const firestore = useFirestore();

  const [selectedExtras, setSelectedExtras] = useState<MenuItemExtra[]>([]);

  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const productDocRef = useMemoFirebase(() => (firestore && productId) ? doc(firestore, 'products', productId) : null, [firestore, productId]);
  const { data: item, isLoading, error } = useDoc<MenuItem>(productDocRef);

  const totalPrice = useMemo(() => {
    if (!item) return 0;
    const extrasPrice = selectedExtras.reduce((total, extra) => total + extra.price, 0);
    return item.price + extrasPrice;
  }, [item, selectedExtras]);

  const handleExtraChange = (extra: MenuItemExtra, checked: boolean) => {
    setSelectedExtras(prev => {
      if (checked) {
        return [...prev, extra];
      } else {
        return prev.filter(e => e.name !== extra.name);
      }
    });
  };

  const handleAddToCart = () => {
    if (!item) return;
    addToCart(item, 1, '', selectedExtras);
  };
  
  if (isLoading) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                 <div className="mb-6">
                    <Skeleton className="h-10 w-24" />
                </div>
                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    <Skeleton className="aspect-square rounded-lg" />
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-2/3" />
                         <Skeleton className="h-20 w-full" />
                         <Skeleton className="h-12 w-40" />
                         <Skeleton className="h-14 w-full md:w-60" />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
          <p className="text-muted-foreground mt-2">
            {error ? 'Error al cargar el producto.' : 'El producto que buscas no existe.'}
          </p>
          <Button asChild className="mt-6">
            <Link href="/carta">Volver a la carta</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

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
            
            {item.extras && item.extras.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Añadir Extras:</h3>
                <div className="space-y-3">
                  {item.extras.map((extra) => (
                    <div key={extra.name} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`extra-${extra.name}`}
                          onCheckedChange={(checked) => handleExtraChange(extra, !!checked)}
                        />
                        <Label htmlFor={`extra-${extra.name}`} className="text-base cursor-pointer">
                          {extra.name}
                        </Label>
                      </div>
                      {extra.price > 0 && (
                        <span className="font-medium">+ S/ {extra.price.toFixed(2)}</span>
                      )}
                    </div>
                  ))}
                </div>
                <Separator className="my-6" />
              </div>
            )}
            
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-muted-foreground">Total:</span>
              <p className="text-3xl font-bold text-primary">S/ {totalPrice.toFixed(2)}</p>
              {item.originalPrice && !selectedExtras.length && (
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
