
"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuItemCard from "@/components/MenuItemCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "./ui/skeleton";

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const firestore = useFirestore();

  const categoriesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'categories') : null, [firestore]);
  const { data: categories, isLoading: categoriesLoading } = useCollection<MenuCategory>(categoriesQuery);

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    
    let q = query(collection(firestore, 'products'));

    if (activeTab !== 'all') {
      q = query(q, where('category', '==', activeTab));
    }
    
    // The filter below is done on the client side because Firestore doesn't support native text search.
    // For a production app, a dedicated search service like Algolia or Typesense would be better.
    return q;
  }, [firestore, activeTab]);

  const { data: menuItems, isLoading: productsLoading } = useCollection<MenuItem>(productsQuery);

  const filteredMenuItems = menuItems?.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800" style={{fontFamily: "'PT Sans', sans-serif"}}>NUESTRA CARTA</h1>
        <p className="text-muted-foreground mt-2 text-lg">Descubre todos nuestros deliciosos platos</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
         <div className="w-full md:hidden">
             <Select onValueChange={setActiveTab} defaultValue="all">
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {categories && categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full md:w-auto hidden md:block">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:flex h-auto bg-transparent p-0">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-md rounded-md mr-2 bg-secondary">Todos</TabsTrigger>
            {categories && categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.name}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {productsLoading ? (
            [...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-[350px] w-full rounded-lg" />
            ))
        ) : (
            filteredMenuItems.map(item => (
                <MenuItemCard key={item.id} item={item} variant="compact" />
            ))
        )}
      </div>
    </>
  );
}
