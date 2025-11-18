"use client";

import { useState } from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { categories, menuItems } from "@/lib/menu-data";
import MenuItemCard from "./MenuItemCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function HomeMenuPreview() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).slice(0, 8);

  return (
    <section className="w-full py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{fontFamily: "'PT Sans', sans-serif"}}>NUESTRA CARTA</h2>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="w-full md:hidden">
             <Select onValueChange={setActiveTab} defaultValue="all">
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full md:w-auto hidden md:block">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {filteredMenuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} variant="compact" />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-[#851515] hover:bg-[#6a1010] text-white">
            <Link href="/carta">Ver toda la carta</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
