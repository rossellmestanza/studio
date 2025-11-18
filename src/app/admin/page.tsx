
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
import { Home, ShoppingBag, List, PlusCircle, MoreHorizontal, Trash2, Edit, ClipboardList, DollarSign, Store, Upload, Clock, Phone, MapPin } from 'lucide-react';
import { menuItems, categories } from '@/lib/menu-data';
import type { MenuItem } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';


// Mock data for orders
const orders = [
  { id: 'ORD001', customer: 'Juan Perez', date: '2024-05-20', total: 75.50, status: 'Entregado' },
  { id: 'ORD002', customer: 'Maria Garcia', date: '2024-05-20', total: 45.00, status: 'Pendiente' },
  { id: 'ORD003', customer: 'Carlos Sanchez', date: '2024-05-19', total: 120.00, status: 'En preparación' },
  { id: 'ORD004', customer: 'Ana Lopez', date: '2024-05-19', total: 35.50, status: 'Entregado' },
];

const monthlyRevenue = [
    { month: 'Enero', revenue: 1200 },
    { month: 'Febrero', revenue: 1800 },
    { month: 'Marzo', revenue: 1500 },
    { month: 'Abril', revenue: 2100 },
    { month: 'Mayo', revenue: orders.filter(o => o.status === 'Entregado').reduce((sum, o) => sum + o.total, 0) },
    { month: 'Junio', revenue: 2300 },
];

const locations = [
  { id: 'san-isidro', name: 'Local San Isidro', address: 'Av. Javier Prado Este 456, San Isidro', phone: '+51 973 282 798' },
  { id: 'miraflores', name: 'Local Miraflores', address: 'Av. Larco 789, Miraflores', phone: '+51 949 992 148' },
  { id: 'surco', name: 'Local Surco', address: 'Av. Primavera 321, Surco', phone: '+51 949 992 149' },
];


export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'products':
        return <ProductManagement setDialogOpen={setIsProductDialogOpen} />;
      case 'categories':
        return <CategoryManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'local':
        return <LocalManagement />;
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
           <Button variant={activeView === 'orders' ? 'secondary' : 'ghost'} className="justify-start" onClick={() => setActiveView('orders')}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Pedidos
          </Button>
          <Button variant={activeView === 'products' ? 'secondary' : 'ghost'} className="justify-start" onClick={() => setActiveView('products')}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Productos
          </Button>
          <Button variant={activeView === 'categories' ? 'secondary' : 'ghost'} className="justify-start" onClick={() => setActiveView('categories')}>
            <List className="mr-2 h-4 w-4" />
            Categorías
          </Button>
           <Button variant={activeView === 'local' ? 'secondary' : 'ghost'} className="justify-start" onClick={() => setActiveView('local')}>
            <Store className="mr-2 h-4 w-4" />
            Mi Local
          </Button>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-6">
           <h2 className="text-xl font-semibold capitalize">{activeView === 'local' ? "Mi Local" : activeView}</h2>
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
    const totalRevenue = orders.filter(o => o.status === 'Entregado').reduce((sum, o) => sum + o.total, 0);

    return (
        <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ganancias del Mes</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">S/ {totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                    <CardTitle>Total Pedidos</CardTitle>
                    <CardDescription>Número total de pedidos recibidos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <p className="text-4xl font-bold">{orders.length}</p>
                    </CardContent>
                </Card>
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
            <Card>
                <CardHeader>
                    <CardTitle>Resumen de Ganancias</CardTitle>
                    <CardDescription>Gráfico de ganancias de los últimos 6 meses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis prefix="S/ " />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderColor: 'hsl(var(--border))'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Ganancia" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}

function OrderManagement() {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Entregado': return 'default';
      case 'Pendiente': return 'destructive';
      case 'En preparación': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos</CardTitle>
        <CardDescription>Gestiona los pedidos de tus clientes.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>S/ {order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                      <DropdownMenuItem>Actualizar estado</DropdownMenuItem>
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

function LocalManagement() {
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    alert(`(Simulado) Local con ID: ${id} eliminado.`);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del Negocio</CardTitle>
          <CardDescription>Actualiza los datos generales de tu restaurante.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="business-name">Nombre del Negocio</Label>
              <Input id="business-name" defaultValue="Fly" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center">
                  <span className="text-2xl font-bold" style={{fontFamily: "'Ms Madi', cursive"}}>Fly</span>
                </div>
                <Button variant="outline" type="button">
                  <Upload className="mr-2 h-4 w-4" /> Cambiar Logo
                </Button>
              </div>
            </div>
             <Button>Guardar Cambios</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto (Footer)</CardTitle>
          <CardDescription>Edita la información que aparece en el pie de página.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
             <div className="space-y-2">
              <Label htmlFor="footer-address">Dirección</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="footer-address" className="pl-10" defaultValue="Av. Principal 123, Lima, Perú" />
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="footer-hours">Horario</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="footer-hours" className="pl-10" defaultValue="Lun - Dom: 11:00 AM - 11:00 PM" />
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="footer-phone">Teléfono</Label>
               <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="footer-phone" className="pl-10" defaultValue="+51 973 282 798" />
              </div>
            </div>
            <Button>Actualizar Contacto</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestionar Locales</CardTitle>
            <CardDescription>Añade o edita las sucursales de tu negocio.</CardDescription>
          </div>
          <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Añadir Local
              </Button>
            </DialogTrigger>
            <LocationDialog setDialogOpen={setIsLocationDialogOpen} />
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((loc) => (
                <TableRow key={loc.id}>
                  <TableCell className="font-medium">{loc.name}</TableCell>
                  <TableCell>{loc.address}</TableCell>
                  <TableCell>{loc.phone}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setIsLocationDialogOpen(true)}>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(loc.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
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
    </div>
  );
}


function LocationDialog({ setDialogOpen }: { setDialogOpen: (isOpen: boolean) => void; }) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('(Simulado) Local guardado.');
    setDialogOpen(false);
  };
  
  return (
     <DialogContent className="sm:max-w-[480px]">
      <DialogHeader>
        <DialogTitle>Añadir/Editar Local</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location-name" className="text-right">Nombre</Label>
          <Input id="location-name" placeholder="Ej: Local Miraflores" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location-address" className="text-right">Dirección</Label>
          <Input id="location-address" placeholder="Ej: Av. Larco 123" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location-phone" className="text-right">Teléfono</Label>
          <Input id="location-phone" placeholder="Ej: +51 987654321" className="col-span-3" />
        </div>
        <DialogFooter>
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
