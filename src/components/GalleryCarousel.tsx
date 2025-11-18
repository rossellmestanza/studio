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

const galleryItems = [
  {
    id: "gallery-ceviche",
    title: "Ceviche Fresco",
    description: "La frescura del mar en tu plato.",
    imageId: "ceviche"
  },
  {
    id: "gallery-lomo",
    title: "Lomo Saltado",
    description: "Sabor intenso que te encantará.",
    imageId: "lomo-saltado"
  },
  {
    id: "gallery-aji",
    title: "Ají de Gallina",
    description: "Cremosidad y tradición en cada bocado.",
    imageId: "aji-de-gallina"
  },
  {
    id: "gallery-causa",
    title: "Causa Limeña",
    description: "Una explosión de sabor peruano.",
    imageId: "causa"
  }
];

export default function GalleryCarousel() {
  const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

  return (
    <section 
      className="w-full py-12 md:py-20 relative bg-cover bg-center" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593361688533-31a89467d35b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Galería de Sabores</h2>
          <p className="mt-2 text-md md:text-lg text-gray-300 max-w-2xl mx-auto">
            Un vistazo a la pasión que ponemos en cada plato.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {galleryItems.map((item) => {
              const image = getImage(item.imageId);
              return (
                <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <div className="relative aspect-video w-full h-full rounded-lg overflow-hidden">
                       {image && (
                        <Image
                          src={image.imageUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          data-ai-hint={image.imageHint}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
                        <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                        <p className="text-gray-200 mt-2">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/60 border-none" />
          <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/60 border-none" />
        </Carousel>
      </div>
    </section>
  )
}
