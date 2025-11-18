
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
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
          <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90">
            <Link href="/carta">
              Seguir comprando
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
