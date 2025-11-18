"use client";

import { useState } from "react";
import { categories, menuItems } from "@/lib/menu-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuItemCard from "@/components/MenuItemCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800" style={{fontFamily: "'PT Sans', sans-serif"}}>NUESTRA CARTA</h1>
        <p className="text-muted-foreground mt-2 text-lg">Descubre todos nuestros deliciosos platos</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:flex h-auto bg-transparent p-0">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-md rounded-md mr-2 bg-secondary">Todos</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-md rounded-md mr-2 bg-secondary"
              >
                {category.name.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full md:w-auto md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="pl-10 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredMenuItems.map(item => (
          <MenuItemCard key={item.id} item={item} variant="compact" />
        ))}
      </div>
    </>
  );
}
