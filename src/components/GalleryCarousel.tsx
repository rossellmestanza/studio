"use client";

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const heroItems = [
  {
    id: "hero-delivery",
    title: "DELIVERY GRATIS",
    description: "Todo el día en compras mayores a S/. 30",
    buttonText: "¡ORDENA YA!",
    imageUrl: "https://static.wixstatic.com/media/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png/v1/fill/w_568,h_320,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png",
    imageHint: "delivery chicken",
    href: "/carta",
  },
  {
    id: "hero-pollo-brasa",
    title: "EL FAVORITO DE TODOS",
    description: "Nuestro jugoso Pollo a la Brasa con papas y ensalada.",
    buttonText: "VER PROMOCIONES",
    imageUrl: "https://cdn.cuponidad.pe/images/Deals/polloalalenalinceofertas.jpg",
    imageHint: "roasted chicken",
    href: "/carta",
  },
  {
    id: "hero-lomo-saltado",
    title: "SABOR PERUANO",
    description: "Prueba nuestro Lomo Saltado, un clásico irresistible.",
    buttonText: "VER EN LA CARTA",
    imageUrl: "https://i.ytimg.com/vi/KfIK9IQixg4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAAkLhHY0GcxJOGvuJ6GlGqslnXRA",
    imageHint: "lomo saltado",
    href: "/carta",
  },
];

export default function GalleryCarousel() {

  return (
    <section className="w-full relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {heroItems.map((item) => (
            <CarouselItem key={item.id}>
              <div className="relative w-full" style={{ height: 'calc(100vh - 80px)' }}>
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  data-ai-hint={item.imageHint}
                  priority={item.id === 'hero-delivery'}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/40">
                  <h2 className="text-4xl md:text-6xl font-extrabold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                    {item.title}
                  </h2>
                  <p className="text-lg md:text-xl text-white mt-2 max-w-lg" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                    {item.description}
                  </p>
                  <Button asChild className="mt-6 bg-[#841515] hover:bg-[#6a1010] text-white font-bold text-lg px-8 py-6 rounded-lg shadow-lg">
                    <Link href={item.href}>{item.buttonText}</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-black bg-yellow-400 hover:bg-yellow-500 border-none" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-black bg-yellow-400 hover:bg-yellow-500 border-none" />
      </Carousel>
    </section>
  )
}
