"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Minus, Plus } from "lucide-react";

export default function CartSheet() {
  const { cartItems, cartCount, cartTotal, removeFromCart, updateItemQuantity, clearCart } = useCart();
  const { toast } = useToast();

  const handlePlaceOrder = () => {
    // In a real app, this would trigger an API call
    console.log("Order placed:", cartItems);
    clearCart();
    toast({
      title: "¡Pedido Realizado!",
      description: "Tu pedido ha sido enviado a la cocina. ¡Buen provecho!",
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center p-0">
              {cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl">Tu Carrito</SheetTitle>
          <SheetDescription>
            Revisa los productos en tu carrito y finaliza tu pedido.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-grow my-4 pr-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.notes}`} className="flex items-start space-x-4 p-2 rounded-lg hover:bg-secondary">
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
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">S/ {item.price.toFixed(2)}</p>
                      {item.notes && <p className="text-xs text-muted-foreground italic mt-1">Notas: {item.notes}</p>}
                       <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateItemQuantity(item.id, item.notes, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateItemQuantity(item.id, item.notes, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="font-semibold text-right">S/ {(item.price * item.quantity).toFixed(2)}</p>
                      <Button variant="ghost" size="icon" className="text-destructive h-8 w-8 mt-2" onClick={() => removeFromCart(item.id, item.notes)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="mt-auto">
              <div className="w-full space-y-4 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>S/ {cartTotal.toFixed(2)}</span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full text-lg py-6">Realizar Pedido</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Confirmar tu pedido?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tu pedido será enviado a la cocina. ¿Estás seguro que quieres continuar?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handlePlaceOrder}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="outline" className="w-full" onClick={clearCart}>Vaciar Carrito</Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center space-y-4 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <h3 className="font-semibold text-xl">Tu carrito está vacío</h3>
            <p className="text-muted-foreground">Agrega algunos platos deliciosos del menú para empezar.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
