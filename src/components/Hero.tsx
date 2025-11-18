"use client";

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImages = [
  PlaceHolderImages.find(img => img.id === 'hero-1'),
  PlaceHolderImages.find(img => img.id === 'hero-2'),
  PlaceHolderImages.find(img => img.id === 'ceviche'),
].filter(Boolean) as any[];


export default function Hero() {
  return (
    <section className="relative w-full h-[calc(100vh-80px)] overflow-hidden">
      <Carousel
        className="w-full h-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="h-full">
          {heroImages.map((item, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative w-full h-full">
                <Image
                  src={item.imageUrl}
                  alt={item.description}
                  fill
                  className="object-cover"
                  data-ai-hint={item.imageHint}
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                  <div className="relative">
                    <Sparkles className="absolute -top-4 -left-12 h-8 w-8 text-yellow-300" />
                    <Sparkles className="absolute -top-8 -right-12 h-6 w-6 text-yellow-200" />
                    <Sparkles className="absolute bottom-0 -right-16 h-10 w-10 text-yellow-300" />
                    
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tighter">
                      <span className="block">Promoción 2x1</span>
                      <span className="text-gray-300">Pollo Entero</span>
                    </h1>
                  </div>

                  <p className="mt-4 text-lg md:text-xl max-w-2xl relative">
                    En todos nuestros pollos a la brasa
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-primary/70 -skew-x-12"></span>
                    <span className="relative">% DESCUENTO</span>
                  </p>

                  <Button asChild size="lg" className="mt-8 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-lg rounded-full px-8 py-6">
                    <Link href="/carta">¡APROVECHA LA OFERTA!</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/30 border-none" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/30 border-none" />
      </Carousel>
    </section>
  );
}