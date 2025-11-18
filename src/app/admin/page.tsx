
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, ShoppingBag, List, PlusCircle, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { menuItems, categories } from '@/lib/menu-data';
import type { MenuItem } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'products':
        return <ProductManagement setDialogOpen={setIsProductDialogOpen} />;
      case 'categories':
        return <CategoryManagement />;
      case 'dashboard':
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="border-b p-6">
           <h1 className="text-2xl font-bold" style={{fontFamily: "'Ms Madi', cursive"}}>Fly Admin</h1>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <Button variant={activeView === 'dashboard' ? 'secondary' : 'ghost'} className="justify-start" onClick={() => setActiveView('dashboard')}>
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant={activeView === 'products' ? 'secondary' : 'ghost'} className="justify-start" onClick={() => setActiveView('products')}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Productos
          </Button>
          <Button variant={activeView === 'categories' ? 'secondary' : 'ghost'} className="justify-start" onClick={() => setActiveView('categories')}>
            <List className="mr-2 h-4 w-4" />
            Categorías
          </Button>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-6">
           <h2 className="text-xl font-semibold capitalize">{activeView}</h2>
          {activeView === 'products' && (
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Añadir Producto
                </Button>
              </DialogTrigger>
              <ProductDialog setDialogOpen={setIsProductDialogOpen} />
            </Dialog>
          )}
        </header>
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
}

function DashboardOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Productos</CardTitle>
          <CardDescription>Número total de productos en el menú.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{menuItems.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Categorías</CardTitle>
          <CardDescription>Número total de categorías de productos.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{categories.length}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductManagement({ setDialogOpen }: { setDialogOpen: (isOpen: boolean) => void; }) {
  // Mock function - in a real app this would delete from a DB
  const handleDelete = (id: string) => {
    alert(`(Simulado) Producto con ID: ${id} eliminado.`);
  };

  return (
     <Card>
      <CardHeader>
        <CardTitle>Productos</CardTitle>
        <CardDescription>Gestiona los productos de tu menú.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>S/ {item.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ProductDialog({ setDialogOpen, product }: { setDialogOpen: (isOpen: boolean) => void; product?: MenuItem }) {
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you would handle form submission to an API
    alert('(Simulado) Producto guardado con éxito.');
    setDialogOpen(false);
  };
  
  return (
    <DialogContent className="sm:max-w-[480px]">
      <DialogHeader>
        <DialogTitle>{product ? 'Editar' : 'Añadir'} Producto</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Nombre</Label>
          <Input id="name" defaultValue={product?.name} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">Descripción</Label>
          <Textarea id="description" defaultValue={product?.description} className="col-span-3" />
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">Categoría</Label>
          <Select defaultValue={product?.category}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">Precio</Label>
          <Input id="price" type="number" defaultValue={product?.price} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="image" className="text-right">URL de Imagen</Label>
          <Input id="image" defaultValue={product?.image} className="col-span-3" />
        </div>
        <DialogFooter>
          <Button type="submit">Guardar Cambios</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function CategoryManagement() {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  // Mock function
  const handleDelete = (id: string) => {
    alert(`(Simulado) Categoría con ID: ${id} eliminada.`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Categorías</CardTitle>
          <CardDescription>Gestiona las categorías de tu menú.</CardDescription>
        </div>
         <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Añadir Categoría
            </Button>
          </DialogTrigger>
          <CategoryDialog setDialogOpen={setIsCategoryDialogOpen} />
        </Dialog>
      </CardHeader>
      <CardContent>
         <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>ID</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell>{cat.id}</TableCell>
                <TableCell className="text-right">
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsCategoryDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(cat.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function CategoryDialog({ setDialogOpen }: { setDialogOpen: (isOpen: boolean) => void; }) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('(Simulado) Categoría guardada.');
    setDialogOpen(false);
  };
  
  return (
     <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Añadir/Editar Categoría</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Nombre</Label>
          <Input id="name" placeholder="Ej: Bebidas" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="id" className="text-right">ID</Label>
          <Input id="id" placeholder="Ej: bebidas" className="col-span-3" />
        </div>
        <DialogFooter>
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

    