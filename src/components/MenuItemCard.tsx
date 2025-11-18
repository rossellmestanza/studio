
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/context/CartContext';
import type { MenuItem } from '@/lib/types';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function MenuItemCard({ item, variant = 'default' }: { item: MenuItem, variant?: 'default' | 'compact' }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddToCart = () => {
    addToCart(item, quantity, notes);
    setIsDialogOpen(false);
    setTimeout(() => {
      setQuantity(1);
      setNotes('');
    }, 300);
  };
  
  const handleSimpleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item, 1, '');
  };

  if (variant === 'compact') {
    return (
      <Link href={`/producto/${item.id}`} className="h-full block">
       <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg bg-card">
        <CardHeader className="p-0">
          <div className="relative w-full h-48">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              data-ai-hint={item.imageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4">
            <h3 className="text-lg font-bold mb-2">{item.name.toUpperCase()}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-4 pt-0 mt-auto">
          <div className='flex items-center gap-2'>
            <p className="text-lg font-bold text-foreground">S/ {item.price.toFixed(2)}</p>
            {item.originalPrice && (
              <p className="text-sm text-muted-foreground line-through">S/ {item.originalPrice.toFixed(2)}</p>
            )}
          </div>
          <Button size="icon" className="rounded-full bg-[#851515] hover:bg-[#6a1010] text-destructive-foreground h-9 w-9" onClick={handleSimpleAddToCart}>
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      </Link>
    );
  }

  // The 'default' variant logic remains for potential future use, 
  // but compact variant will now link to detail page.
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg">
        <CardHeader className="p-0">
          <Link href={`/producto/${item.id}`} className="block">
            <div className="relative w-full h-48">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                data-ai-hint={item.imageHint}
              />
            </div>
            <div className="p-4 pb-0">
              <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
            </div>
          </Link>
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-4 pt-0">
          <p className="text-xl font-bold text-foreground">S/ {item.price.toFixed(2)}</p>
          <DialogTrigger asChild>
            <Button>Agregar</Button>
          </DialogTrigger>
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
             <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              data-ai-hint={item.imageHint}
            />
          </div>
          <DialogTitle className="text-2xl">{item.name}</DialogTitle>
          <DialogDescription>{item.description}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              className="w-16 text-center text-lg font-bold border-0 bg-transparent"
              value={quantity}
              readOnly
            />
            <Button variant="outline" size="icon" onClick={() => setQuantity(q => q + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <Textarea
              placeholder="¿Alguna indicación especial? Ej: sin cebolla, bien cocido..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleAddToCart} className="w-full text-lg py-6">
            Agregar {quantity} al carrito - S/ {(item.price * quantity).toFixed(2)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
