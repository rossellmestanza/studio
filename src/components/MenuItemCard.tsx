"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/context/CartContext';
import type { MenuItem } from '@/lib/types';
import { Minus, Plus } from 'lucide-react';

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const { addToCart } = useCart();
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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg">
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
          <div className="p-4 pb-0">
            <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
          </div>
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
