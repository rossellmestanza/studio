
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { CustomerData } from '@/context/CartContext';
import { Utensils, Package, Bike } from 'lucide-react';

type OrderType = 'delivery' | 'pickup' | 'table';

export default function DatosClientePage() {
  const { setCustomerData } = useCart();
  const router = useRouter();
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [formData, setFormData] = useState<Partial<CustomerData>>({
    name: '',
    phone: '',
    address: '',
    reference: '',
    tableNumber: '',
    paymentMethod: 'Efectivo',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  }

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData: CustomerData = {
      orderType,
      name: formData.name || '',
      phone: formData.phone || '',
      address: orderType === 'delivery' ? formData.address : '',
      reference: orderType === 'delivery' ? formData.reference : '',
      tableNumber: orderType === 'table' ? formData.tableNumber : '',
      paymentMethod: orderType === 'delivery' ? formData.paymentMethod : '',
    };
    setCustomerData(finalData);
    router.push('/confirmar-pedido');
  };
  
  const renderFields = () => {
    switch(orderType) {
      case 'table':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre <span className="text-destructive">*</span></Label>
              <Input id="name" placeholder="Ingresa tu nombre" required value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tableNumber">Número de Mesa <span className="text-destructive">*</span></Label>
              <Input id="tableNumber" placeholder="Ej: 12" required value={formData.tableNumber} onChange={handleInputChange} />
            </div>
          </>
        );
      case 'pickup':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre <span className="text-destructive">*</span></Label>
              <Input id="name" placeholder="Ingresa tu nombre" required value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Número de Celular <span className="text-destructive">*</span></Label>
              <Input id="phone" type="tel" placeholder="999 999 999" required value={formData.phone} onChange={handleInputChange} />
            </div>
          </>
        );
      case 'delivery':
      default:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo <span className="text-destructive">*</span></Label>
              <Input id="name" placeholder="Ingresa tu nombre completo" required value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Celular <span className="text-destructive">*</span></Label>
              <Input id="phone" type="tel" placeholder="999 999 999" required value={formData.phone} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección <span className="text-destructive">*</span></Label>
              <Input id="address" placeholder="Av. Principal 123, Distrito" required value={formData.address} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Referencia</Label>
              <Textarea id="reference" placeholder="Casa de dos pisos, portón negro..." value={formData.reference} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label>Método de Pago <span className="text-destructive">*</span></Label>
              <RadioGroup defaultValue="Efectivo" onValueChange={handleRadioChange} className="grid grid-cols-2 gap-4">
                <div><RadioGroupItem value="Yape" id="yape" /><Label htmlFor="yape" className="ml-2">Yape</Label></div>
                <div><RadioGroupItem value="Plin" id="plin" /><Label htmlFor="plin" className="ml-2">Plin</Label></div>
                <div><RadioGroupItem value="Efectivo" id="efectivo" /><Label htmlFor="efectivo" className="ml-2">Efectivo</Label></div>
                <div><RadioGroupItem value="Otro" id="otro" /><Label htmlFor="otro" className="ml-2">Otro</Label></div>
              </RadioGroup>
            </div>
          </>
        );
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-lg shadow-lg">
            <CardHeader>
                <CardTitle className="text-3xl font-bold">Completa tu Pedido</CardTitle>
                <CardDescription>Selecciona el tipo de pedido y completa tus datos.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <Label>Tipo de Pedido</Label>
                      <RadioGroup defaultValue="delivery" onValueChange={(value) => setOrderType(value as OrderType)} className="grid grid-cols-3 gap-4">
                        <Label htmlFor="delivery" className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer ${orderType === 'delivery' ? 'border-primary' : 'border-muted'}`}>
                          <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
                          <Bike className="mb-2" /> Delivery
                        </Label>
                         <Label htmlFor="pickup" className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer ${orderType === 'pickup' ? 'border-primary' : 'border-muted'}`}>
                          <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
                          <Package className="mb-2" /> Para Llevar
                        </Label>
                         <Label htmlFor="table" className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer ${orderType === 'table' ? 'border-primary' : 'border-muted'}`}>
                          <RadioGroupItem value="table" id="table" className="sr-only" />
                          <Utensils className="mb-2" /> Mesa
                        </Label>
                      </RadioGroup>
                    </div>

                    {renderFields()}

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
