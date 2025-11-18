"use client";

import { useState } from "react";
import { categories, menuItems } from "@/lib/menu-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuItemCard from "@/components/MenuItemCard";

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-5xl md:text-6xl font-headline text-primary">Nuestro Menú</h2>
        <p className="text-muted-foreground mt-2 text-lg">Sabores auténticos de la cocina peruana</p>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center">
            <TabsList className="grid grid-cols-3 sm:flex sm:flex-wrap sm:w-auto mb-8 h-auto">
                <TabsTrigger value="all">Todos</TabsTrigger>
                {categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id}>
                        <category.icon className="mr-2 h-4 w-4" />
                        {category.name}
                    </TabsTrigger>
                ))}
            </TabsList>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems
            .filter(item => activeTab === 'all' || item.category === activeTab)
            .map(item => (
              <MenuItemCard key={item.id} item={item} />
            ))}
        </div>
      </Tabs>
    </>
  );
}
