import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock } from 'lucide-react';

const locations = [
  {
    name: 'Local Principal - Miraflores',
    address: 'Av. Larco 123, Miraflores, Lima',
    phone: '+51 1 1234567',
    hours: 'Lunes a Domingo: 12:00 PM - 11:00 PM',
  },
  {
    name: 'Sucursal - San Isidro',
    address: 'Calle Los Pinos 456, San Isidro, Lima',
    phone: '+51 1 7654321',
    hours: 'Lunes a Sábado: 12:30 PM - 10:30 PM',
  },
  {
    name: 'Patio de Comidas - Jockey Plaza',
    address: 'Av. Javier Prado Este 4200, Santiago de Surco',
    phone: '+51 1 9876543',
    hours: 'Lunes a Domingo: 11:00 AM - 10:00 PM',
  },
];

export default function LocalesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-headline text-primary">Nuestros Locales</h1>
            <p className="text-muted-foreground mt-2 text-lg">Encuentra tu sabor peruano más cercano</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((local, index) => (
            <Card key={index} className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">{local.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                  <p>{local.address}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <p>{local.phone}</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                  <p>{local.hours}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
