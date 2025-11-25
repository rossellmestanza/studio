
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Gift } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function ConfirmationPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart when the confirmation page loads
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-center p-8 md:p-12 bg-card rounded-xl shadow-lg max-w-2xl">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            ¡Gracias por tu compra! Hemos recibido tu pedido y ya lo estamos preparando con mucho cariño.
          </p>
          <div className="space-y-2 text-left bg-background/50 p-6 rounded-lg">
             <p><strong>Tiempo estimado de entrega:</strong> 30-45 minutos.</p>
             <p>Te contactaremos por WhatsApp si tenemos alguna consulta sobre tu pedido.</p>
          </div>
          <div className="flex flex-col items-center gap-4 mt-8">
            <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90">
              <Link href="/carta">
                Seguir comprando
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full text-secondary-foreground hover:bg-secondary/80">
              <Link href="/auth">
                <Gift className="mr-2 h-4 w-4"/>
                Regístrate para acumular puntos y ganar recompensas
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
