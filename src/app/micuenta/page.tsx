
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, CookingPot, Truck, Package, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

// Mock data for user's orders
const userOrders = [
  {
    id: 'ORD-2024-12345',
    date: '2024-07-26',
    status: 'En preparación',
    total: 85.00,
    phone: '987654321', // Associated phone number
    items: [
      { name: '1 x Pollo a la Brasa Familiar', price: 85.00 },
    ],
  },
  {
    id: 'ORD-2024-12344',
    date: '2024-07-25',
    status: 'Entregado',
    total: 55.00,
    phone: '123456789', // Associated phone number
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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [foundOrder, setFoundOrder] = useState<typeof userOrders[0] | null | undefined>(undefined);
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const order = userOrders.find(o => o.phone === phoneNumber);
    setFoundOrder(order);
  };
  
  const renderContent = () => {
    if (foundOrder === undefined) {
      return null;
    }
    
    if (foundOrder) {
      return (
         <Card className="shadow-lg mt-8">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <CardTitle>Pedido #{foundOrder.id.split('-')[2]}</CardTitle>
                    <CardDescription>Realizado el: {foundOrder.date}</CardDescription>
                </div>
                <div className="mt-4 md:mt-0 text-left md:text-right">
                    <p className="font-bold text-lg">Total: S/ {foundOrder.total.toFixed(2)}</p>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-4">Estado del Pedido:</h3>
                <OrderTracker status={foundOrder.status} />
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-2">Resumen del pedido:</h4>
                <ul className="text-sm text-muted-foreground list-disc pl-5">
                  {foundOrder.items.map((item, i) => (
                    <li key={i}>{item.name}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
      );
    }

    return (
       <div className="text-center bg-card p-8 md:p-12 rounded-xl shadow-lg max-w-2xl mx-auto mt-8">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">No se encontró tu pedido</h2>
            <p className="text-muted-foreground mb-6">
              Verifica el número de teléfono o comunícate con nosotros si tienes problemas.
            </p>
            <Button asChild size="lg">
              <Link href="/carta">
                Ir a la carta
              </Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
              <h1 className="text-4xl font-bold">Seguimiento de Pedido</h1>
              <p className="text-muted-foreground mt-1">Ingresa tu número de celular para ver el estado de tu pedido.</p>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSearchOrder} className="flex flex-col sm:flex-row items-end gap-4">
                <div className="w-full space-y-2">
                  <Label htmlFor="phone-number">Número de Celular</Label>
                   <div className="relative">
                    <Input
                      id="phone-number"
                      type="tel"
                      placeholder="999 999 999"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  <Search className="mr-2 h-4 w-4" /> Buscar Pedido
                </Button>
              </form>
            </CardContent>
          </Card>

          {renderContent()}

        </div>
      </main>
      <Footer />
    </div>
  );
}
