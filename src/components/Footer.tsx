"use client";

import Link from 'next/link';
import { MapPin, Clock, Phone, Facebook, Instagram } from 'lucide-react';

export default function Footer() {

  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Columna Izquierda */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Link href="/" className="inline-block">
              <span className="text-5xl font-headline" style={{fontFamily: "'Ms Madi', cursive"}}>Fly</span>
            </Link>
            <p className="text-gray-400 max-w-xs mx-auto md:mx-0">
              Los mejores sabores de casa, preparados con amor y dedicación.
            </p>
          </div>

          {/* Columna Central */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white uppercase tracking-wider">Contacto</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center justify-center md:justify-start">
                <MapPin className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>Av. Principal 123, Lima, Perú</span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Clock className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>Lun - Dom: 11:00 AM - 11:00 PM</span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Phone className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>+51 973 282 798</span>
              </li>
            </ul>
          </div>

          {/* Columna Derecha */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white uppercase tracking-wider">Síguenos</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white bg-gray-800 p-3 rounded-full transition-colors">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white bg-gray-800 p-3 rounded-full transition-colors">
                <Instagram className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; 2025 Fly. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
