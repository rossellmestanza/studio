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
import React from 'react';
import Autoplay from "embla-carousel-autoplay"
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Banner } from '@/lib/types';
import { collection } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';

export default function GalleryCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )
  const firestore = useFirestore();
  const bannersQuery = useMemoFirebase(() => firestore ? collection(firestore, 'banners') : null, [firestore]);
  const { data: banners, isLoading } = useCollection<Banner>(bannersQuery);

  return (
    <section className="w-full relative">
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {isLoading ? (
            <CarouselItem>
              <div className="relative w-full" style={{ height: 'calc(100vh - 80px)' }}>
                <Skeleton className="h-full w-full" />
              </div>
            </CarouselItem>
          ) : (
            banners && banners.map((item) => (
            <CarouselItem key={item.id}>
              <div className="relative w-full" style={{ height: 'calc(100vh - 80px)' }}>
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={banners[0] && item.id === banners[0].id}
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
          )))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-black bg-yellow-400 hover:bg-yellow-500 border-none hidden md:inline-flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-black bg-yellow-400 hover:bg-yellow-500 border-none hidden md:inline-flex" />
      </Carousel>
    </section>
  )
}
