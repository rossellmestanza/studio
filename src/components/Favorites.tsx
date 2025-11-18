
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { menuItems } from "@/lib/menu-data"
import MenuItemCard from "./MenuItemCard"

export default function Favorites() {
  const favoriteItems = menuItems.filter(item => item.id.includes('pollo-brasa'));

  return (
    <section className="w-full py-12 md:py-20" style={{ backgroundColor: '#f7b602' }}>
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">LOS FAVORITOS DE CASA</h2>
          <p className="mt-2 text-md md:text-lg text-gray-800 max-w-2xl mx-auto">
            Los más pedidos y sabrosos de nuestra carta. Una experiencia que no querrás perderte.
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
            {favoriteItems.map((item) => (
              <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                <div className="p-1">
                  <MenuItemCard item={item} variant="compact" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2 text-gray-800 bg-white/50 hover:bg-white/80 border-none" />
          <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2 text-gray-800 bg-white/50 hover:bg-white/80 border-none" />
        </Carousel>
      </div>
    </section>
  )
}
