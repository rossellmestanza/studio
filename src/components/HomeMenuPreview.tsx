"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { menuItems } from "@/lib/menu-data";
import MenuItemCard from "./MenuItemCard";

export default function HomeMenuPreview() {
  const previewItems = menuItems.slice(0, 8);

  return (
    <section className="w-full py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{fontFamily: "'PT Sans', sans-serif"}}>NUESTRA CARTA</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {previewItems.map((item) => (
            <MenuItemCard key={item.id} item={item} variant="compact" />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-[#851515] text-white hover:bg-[#6a1010]">
            <Link href="/carta">Ver toda la carta</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
