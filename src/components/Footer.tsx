
"use client";

import Link from 'next/link';
import { MapPin, Clock, Phone, Facebook, Instagram } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { BusinessInfo } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import Image from 'next/image';

export default function Footer() {
  const firestore = useFirestore();
  const businessInfoDoc = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'businessInfo') : null, [firestore]);
  const { data: businessInfo, isLoading } = useDoc<BusinessInfo>(businessInfoDoc);

  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Columna Izquierda */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Link href="/" className="inline-block">
              {isLoading ? (
                <Skeleton className="h-12 w-24 rounded-md"/>
              ) : businessInfo?.logoUrl ? (
                <Image src={businessInfo.logoUrl} alt={businessInfo.businessName || 'Logo'} width={100} height={100} className="rounded-md object-contain h-24 w-auto" />
              ) : (
                <span className="text-5xl font-headline" style={{fontFamily: "'Ms Madi', cursive"}}>{businessInfo?.businessName || 'Fly'}</span>
              )}
            </Link>
            <p className="text-gray-400 max-w-xs mx-auto md:mx-0">
              Los mejores sabores de casa, preparados con amor y dedicación.
            </p>
          </div>

          {/* Columna Central */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white uppercase tracking-wider">Contacto</h3>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            ) : (
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center justify-center md:justify-start">
                <MapPin className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>{businessInfo?.footerAddress || 'Av. Principal 123, Lima, Perú'}</span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Clock className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>{businessInfo?.footerHours || 'Lun - Dom: 11:00 AM - 11:00 PM'}</span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Phone className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>{businessInfo?.footerPhone || '+51 973 282 798'}</span>
              </li>
            </ul>
            )}
          </div>

          {/* Columna Derecha */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white uppercase tracking-wider">Síguenos</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href={businessInfo?.facebookUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white bg-gray-800 p-3 rounded-full transition-colors">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href={businessInfo?.instagramUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white bg-gray-800 p-3 rounded-full transition-colors">
                <Instagram className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {businessInfo?.businessName || 'Fly'}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
