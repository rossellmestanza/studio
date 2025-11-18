
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartSheet() {
  const { cartItems, cartCount, cartTotal, removeFromCart, updateItemQuantity, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handlePlaceOrder = () => {
    setIsOpen(false); // Cierra el sheet
    // In a real app, this would trigger an API call
    console.log("Redirecting to checkout:", cartItems);
    router.push('/datos-cliente');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full bg-transparent border-gray-600 hover:bg-gray-700">
          <ShoppingCart className="h-5 w-5 text-white" />
          {cartCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center p-0">
              {cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[440px] flex flex-col bg-background p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" /> Tu Pedido
          </SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-grow my-4">
              <div className="space-y-4 px-6">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.notes}`} className="flex items-center space-x-4 p-3 rounded-lg bg-card shadow-sm">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                       <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                       />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-primary font-bold">S/ {item.price.toFixed(2)}</p>
                      {item.notes && <p className="text-xs text-muted-foreground italic mt-1">Notas: {item.notes}</p>}
                       <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-secondary"
                          onClick={() => updateItemQuantity(item.id, item.notes, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold w-4 text-center">{item.quantity}</span>
                        <Button
                          size="icon"
                          className="h-7 w-7 bg-secondary text-secondary-foreground"
                          onClick={() => updateItemQuantity(item.id, item.notes, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => removeFromCart(item.id, item.notes)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto bg-card p-6 rounded-t-lg">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">S/ {cartTotal.toFixed(2)}</span>
                </div>
                <Button className="w-full text-lg py-6 bg-[#841515] hover:bg-[#6a1010] text-white" onClick={handlePlaceOrder}>
                  Pedir Ahora
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center space-y-4 text-center px-6">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <h3 className="font-semibold text-xl">Tu carrito está vacío</h3>
            <p className="text-muted-foreground">Agrega algunos platos deliciosos del menú para empezar.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
