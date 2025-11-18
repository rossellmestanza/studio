
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function DatosClientePage() {
  const { setCustomerData } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    reference: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerData(formData);
    router.push('/confirmar-pedido');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-lg shadow-lg">
            <CardHeader>
                <CardTitle className="text-3xl font-bold">Datos de Entrega</CardTitle>
                <CardDescription>Completa tus datos para continuar con el pedido</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo <span className="text-destructive">*</span></Label>
                        <Input
                            id="name"
                            placeholder="Ingresa tu nombre completo"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Celular <span className="text-destructive">*</span></Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="999 999 999"
                            required
                             value={formData.phone}
                            onChange={handleInputChange}
                            className="bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Dirección <span className="text-destructive">*</span></Label>
                        <Input
                            id="address"
                            placeholder="Av. Principal 123, Distrito"
                            required
                             value={formData.address}
                            onChange={handleInputChange}
                            className="bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reference">Referencia</Label>
                        <Textarea
                            id="reference"
                            placeholder="Casa de dos pisos, portón negro..."
                             value={formData.reference}
                            onChange={handleInputChange}
                            className="bg-background"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-[#841515] hover:bg-[#6a1010] text-white text-lg py-6">
                        Continuar
                    </Button>
                </form>
            </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
