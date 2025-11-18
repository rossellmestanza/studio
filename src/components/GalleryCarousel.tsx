"use client";

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlaceHolderImages } from '@/lib/placeholder-images';

const galleryImages = [
  PlaceHolderImages.find(img => img.id === 'ceviche'),
  PlaceHolderImages.find(img => img.id === 'lomo-saltado'),
  PlaceHolderImages.find(img => img.id === 'aji-de-gallina'),
  PlaceHolderImages.find(img => img.id === 'causa'),
  PlaceHolderImages.find(img => img.id === 'pisco-sour'),
].filter(Boolean) as (typeof PlaceHolderImages)[0][];

export default function GalleryCarousel() {
  return (
    <section className="relative w-full py-12 md:py-20">
       <Image
        src="https://images.unsplash.com/photo-1547573854-74d2a71d0826?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Fondo de madera oscura"
        fill
        className="object-cover"
        data-ai-hint="dark wood"
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="container mx-auto relative">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white" style={{fontFamily: "'PT Sans', sans-serif"}}>Galería de Sabores</h2>
          <p className="mt-2 text-md md:text-lg text-gray-300 max-w-2xl mx-auto">
            Un vistazo a la pasión que ponemos en cada plato.
          </p>
        </div>
        <Carousel
          opts={{
            loop: true,
          }}
          className="w-full h-[500px] overflow-hidden"
        >
          <CarouselContent className="h-full">
            {galleryImages.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="relative w-full h-full">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    data-ai-hint={image.imageHint}
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <p className="text-white text-2xl font-bold text-center p-4">{image.description}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/30 border-none" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/30 border-none" />
        </Carousel>
      </div>
    </section>
  );
}
