
'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export default function ConfirmarPedidoPage() {
  const { cartItems, cartTotal, customerData } = useCart();
  const router = useRouter();

  const handleConfirmOrder = () => {
    const name = customerData?.name || 'No especificado';
    const phone = customerData?.phone || 'No especificado';
    const address = customerData?.address || 'No especificado';
    const reference = customerData?.reference || 'No especificado';
    
    const itemsText = cartItems.map(item => 
      `${item.quantity} x ${item.name} - S/ ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const totalText = `*Total: S/ ${cartTotal.toFixed(2)}*`;

    const message = `
¡Hola! Quiero hacer un pedido:
*-------------------*
*Datos de Entrega:*
*Nombre:* ${name}
*Celular:* ${phone}
*Dirección:* ${address}
*Referencia:* ${reference}
*-------------------*
*Mi Pedido:*
${itemsText}
*-------------------*
${totalText}
    `;

    const whatsappNumber = "+51973282798";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    router.push('/confirmacion');
  };

  if (!customerData) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center text-center">
                <div>
                    <p className="text-xl text-muted-foreground">No hay datos de cliente. Por favor, completa tus datos primero.</p>
                    <Button onClick={() => router.push('/datos-cliente')} className="mt-4">
                        Ir a datos de entrega
                    </Button>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex justify-center">
        <div className="w-full max-w-2xl space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Confirmar Pedido</h1>
                <p className="text-muted-foreground mt-1">Revisa tu pedido antes de enviarlo por WhatsApp</p>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Datos de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>Nombre:</strong> {customerData.name}</p>
                    <p><strong>Celular:</strong> {customerData.phone}</p>
                    <p><strong>Dirección:</strong> {customerData.address}</p>
                    <p><strong>Referencia:</strong> {customerData.reference}</p>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Tu Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {cartItems.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                                </div>
                            </div>
                            <p className="font-semibold text-primary">S/ {item.price.toFixed(2)}</p>
                        </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-primary">S/ {cartTotal.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center space-y-2">
                 <Button onClick={handleConfirmOrder} className="w-full bg-[#841515] hover:bg-[#6a1010] text-white text-lg py-6">
                    Confirmar Pedido
                </Button>
                <p className="text-xs text-muted-foreground">
                    Al confirmar, serás redirigido a WhatsApp con tu pedido completo
                </p>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
