
'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { BusinessInfo, Location } from '@/lib/types';
import { collection, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function LocalesPage() {
  const firestore = useFirestore();
  
  const locationsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'locations') : null, [firestore]);
  const { data: locations, isLoading: locationsLoading } = useCollection<Location>(locationsQuery);

  const businessInfoDoc = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'businessInfo') : null, [firestore]);
  const { data: businessInfo, isLoading: infoLoading } = useDoc<BusinessInfo>(businessInfoDoc);
  
  const whatsappNumber = businessInfo?.footerWhatsapp || '';
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\s/g, '')}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">NUESTROS LOCALES</h1>
            <p className="text-muted-foreground mt-2 text-lg">Visítanos en cualquiera de nuestras ubicaciones y disfruta de la mejor comida</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {locationsLoading ? (
            [...Array(3)].map((_, index) => (
              <Card key={index} className="shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-10 w-full mt-4" />
                </CardContent>
              </Card>
            ))
          ) : (
            locations && locations.map((local) => (
              <Card key={local.id} className="bg-card text-card-foreground shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground mb-4">{local.name}</h2>
                  <div className="flex items-start space-x-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                    <p>{local.address}</p>
                  </div>
                  <div className="flex items-start space-x-3 text-muted-foreground">
                    <Clock className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                    {/* Hours are not in location model, using static for now */}
                    <p>Lunes a Domingo: 11:00 AM - 11:00 PM</p>
                  </div>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                    <p>{local.phone}</p>
                  </div>
                  <Button asChild className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold" disabled={!local.mapUrl}>
                      <Link href={local.mapUrl || '#'} target="_blank" rel="noopener noreferrer">
                        <Send className="mr-2 h-4 w-4" /> Cómo llegar
                      </Link>
                    </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-center bg-card p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-foreground mb-2">¿Tienes alguna pregunta?</h3>
            <p className="text-muted-foreground mb-6">Contáctanos por WhatsApp y te atenderemos de inmediato</p>
            <Button asChild size="lg" className="bg-[#841515] hover:bg-[#6a1010] text-white font-bold px-8 py-6 rounded-lg" disabled={infoLoading || !whatsappNumber}>
              <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                 Contactar por WhatsApp
              </Link>
            </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
