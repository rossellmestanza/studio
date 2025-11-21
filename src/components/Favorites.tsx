
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import MenuItemCard from "./MenuItemCard"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { MenuItem } from "@/lib/types";
import { collection, limit, query } from "firebase/firestore";
import { Skeleton } from "./ui/skeleton";

export default function Favorites() {
  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'products'), limit(5)) : null, [firestore]);
  const { data: favoriteItems, isLoading } = useCollection<MenuItem>(productsQuery);

  return (
    <section className="w-full py-12 md:py-20" style={{ backgroundColor: '#f7b602' }}>
      <div className="container mx-auto">
        <div className="text-center mb-10 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">LOS FAVORITOS DE CASA</h2>
          <p className="mt-2 text-md md:text-lg text-gray-800 max-w-2xl mx-auto">
            Los más pedidos y sabrosos de nuestra carta. Una experiencia que no querrás perderte.
          </p>
        </div>

        {isLoading ? (
          <div className="flex space-x-4 px-12 md:px-0">
             {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full sm:basis-1/2 lg:basis-1/4 p-1">
                    <Skeleton className="h-[350px] w-full rounded-lg" />
                </div>
            ))}
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full px-12 md:px-0"
          >
            <CarouselContent className="-ml-4">
              {favoriteItems && favoriteItems.map((item) => (
                <CarouselItem key={item.id} className="pl-4 sm:basis-1/2 lg:basis-1/4">
                  <div className="p-1">
                    <MenuItemCard item={item} variant="compact" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-5px] top-1/2 -translate-y-1/2 text-gray-800 bg-white/50 hover:bg-white/80 border-none md:left-[-20px]" />
            <CarouselNext className="absolute right-[-5px] top-1/2 -translate-y-1/2 text-gray-800 bg-white/50 hover:bg-white/80 border-none md:right-[-20px]" />
          </Carousel>
        )}
      </div>
    </section>
  )
}
