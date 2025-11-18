
'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, CookingPot, Truck, Package } from 'lucide-react';
import Link from 'next/link';

// Mock data for user's orders
const userOrders = [
  {
    id: 'ORD-2024-12345',
    date: '2024-07-26',
    status: 'En preparación',
    total: 85.00,
    items: [
      { name: '1 x Pollo a la Brasa Familiar', price: 85.00 },
    ],
  },
  {
    id: 'ORD-2024-12344',
    date: '2024-07-25',
    status: 'Entregado',
    total: 55.00,
    items: [
      { name: '1 x Lomo Saltado', price: 55.00 },
    ],
  },
];

const statusSteps = [
  { status: 'Recibido', icon: Package, description: 'Tu pedido ha sido recibido' },
  { status: 'En preparación', icon: CookingPot, description: 'Estamos preparando tu pedido' },
  { status: 'En camino', icon: Truck, description: 'Tu pedido ya salió a tu domicilio' },
  { status: 'Entregado', icon: CheckCircle, description: 'Tu pedido ha sido entregado' },
];

function OrderTracker({ status }: { status: string }) {
  const activeIndex = statusSteps.findIndex(step => step.status === status);

  return (
    <div className="flex justify-between items-start pt-4">
      {statusSteps.map((step, index) => {
        const isActive = index <= activeIndex;
        return (
          <div key={step.status} className="flex flex-col items-center text-center w-1/4 relative">
            {index > 0 && (
              <div
                className={`absolute top-[18px] left-[-50%] w-full h-1 ${isActive ? 'bg-primary' : 'bg-muted'}`}
                style={{ transform: 'translateY(-50%)' }}
              />
            )}
            <div className={`z-10 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              <step.icon className="h-6 w-6" />
            </div>
            <p className={`mt-2 text-xs md:text-sm font-semibold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step.status}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function MyAccountPage() {
  // For now, we'll display a generic message if there are no orders.
  // In a real app, this would be tied to a logged-in user.
  const hasOrders = userOrders.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">Mi Cuenta</h1>
            <p className="text-muted-foreground mt-1">Revisa el estado de tus pedidos</p>
        </div>

        {hasOrders ? (
          <div className="space-y-8">
            {userOrders.map((order) => (
              <Card key={order.id} className="shadow-lg">
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle>Pedido #{order.id.split('-')[2]}</CardTitle>
                        <CardDescription>Realizado el: {order.date}</CardDescription>
                    </div>
                    <div className="mt-4 md:mt-0 text-left md:text-right">
                        <p className="font-bold text-lg">Total: S/ {order.total.toFixed(2)}</p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-4">Estado del Pedido:</h3>
                    <OrderTracker status={order.status} />
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold mb-2">Resumen del pedido:</h4>
                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                      {order.items.map((item, i) => (
                        <li key={i}>{item.name}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center bg-card p-8 md:p-12 rounded-xl shadow-lg max-w-2xl mx-auto">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">No tienes pedidos recientes</h2>
            <p className="text-muted-foreground mb-6">
              ¿Qué esperas para probar nuestras delicias?
            </p>
            <Button asChild size="lg">
              <Link href="/carta">
                Ir a la carta
              </Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
