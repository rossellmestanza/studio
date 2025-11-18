"use client";

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
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
    <section className="w-full py-12 md:py-20 bg-card">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{fontFamily: "'PT Sans', sans-serif"}}>Galería de Sabores</h2>
          <p className="mt-2 text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Un vistazo a la pasión que ponemos en cada plato.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {galleryImages.map((image, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-video items-center justify-center p-0 relative rounded-lg overflow-hidden">
                       <Image
                          src={image.imageUrl}
                          alt={image.description}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          data-ai-hint={image.imageHint}
                        />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}