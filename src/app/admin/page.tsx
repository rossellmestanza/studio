
'use client';

import React, { useState } from 'react';
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
import { Home, ShoppingBag, List, PlusCircle, MoreHorizontal, Trash2, Edit, ClipboardList, DollarSign, Store, Upload, Clock, Phone, MapPin, Menu as MenuIcon, LogOut, Image as ImageIcon } from 'lucide-react';
import { menuItems, categories } from '@/lib/menu-data';
import type { MenuItem, MenuItemExtra } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';


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

const heroItems = [
  {
    id: "hero-delivery",
    title: "DELIVERY GRATIS",
    description: "Todo el día en compras mayores a S/. 30",
    buttonText: "¡ORDENA YA!",
    imageUrl: "https://static.wixstatic.com/media/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png/v1/fill/w_568,h_320,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9755d8_08527ef57aba40f99b1b3478991bc73a~mv2.png",
    href: "/carta",
  },
  {
    id: "hero-pollo-brasa",
    title: "EL FAVORITO DE TODOS",
    description: "Nuestro jugoso Pollo a la Brasa con papas y ensalada.",
    buttonText: "VER PROMOCIONES",
    imageUrl: "https://cdn.cuponidad.pe/images/Deals/polloalalenalinceofertas.jpg",
    href: "/carta",
  },
];


export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/auth');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'products':
        return <ProductManagement setDialogOpen={setIsProductDialogOpen} />;
      case 'categories':
        return <CategoryManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'banners':
        return <BannerManagement setDialogOpen={setIsBannerDialogOpen} />;
      case 'local':
        return <LocalManagement />;
      case 'dashboard':
      default:
        return <DashboardOverview />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'orders', label: 'Pedidos', icon: ClipboardList },
    { id: 'products', label: 'Productos', icon: ShoppingBag },
    { id: 'categories', label: 'Categorías', icon: List },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
    { id: 'local', label: 'Mi Local', icon: Store },
  ];

  const NavLinks = ({ isSheet = false }: { isSheet?: boolean }) => (
    <nav className={`flex flex-col gap-2 ${isSheet ? 'p-4' : 'p-4'}`}>
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant={activeView === item.id ? 'secondary' : 'ghost'}
          className="justify-start"
          onClick={() => setActiveView(item.id)}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
        </Button>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="border-b p-6">
           <h1 className="text-2xl font-bold" style={{fontFamily: "'Ms Madi', cursive"}}>Fly Admin</h1>
        </div>
        <NavLinks />
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-6 sm:justify-end">
            <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="sm:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:hidden p-0">
                 <SheetHeader className="border-b p-6">
                    <SheetTitle>
                        <Link href="#" className="flex items-center gap-2 font-semibold">
                        <h1 className="text-2xl font-bold" style={{fontFamily: "'Ms Madi', cursive"}}>Fly Admin</h1>
                        </Link>
                    </SheetTitle>
                 </SheetHeader>
                 <NavLinks isSheet />
            </SheetContent>
          </Sheet>

           <h2 className="text-xl font-semibold capitalize sm:hidden">{activeView === 'local' ? "Mi Local" : activeView}</h2>
          
           <div className="flex items-center gap-4">
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
               {activeView === 'banners' && (
                <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1">
                      <PlusCircle className="h-4 w-4" />
                      Añadir
                    </Button>
                  </DialogTrigger>
                  <BannerDialog setDialogOpen={setIsBannerDialogOpen} />
                </Dialog>
              )}
               <Button variant="outline" size="icon" onClick={handleSignOut} aria-label="Cerrar Sesión">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
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

  const ActionMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Actualizar estado</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Pendiente</DropdownMenuItem>
              <DropdownMenuItem>En preparación</DropdownMenuItem>
              <DropdownMenuItem>Entregado</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos</CardTitle>
        <CardDescription>Gestiona los pedidos de tus clientes.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Vista de tabla para pantallas medianas y grandes */}
        <div className="hidden md:block">
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
                    <ActionMenu />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Vista de tarjetas para pantallas pequeñas */}
        <div className="grid gap-4 md:hidden">
          {orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{order.customer}</p>
                  <p className="text-sm text-muted-foreground">{order.id}</p>
                </div>
                <ActionMenu />
              </div>
              <Separator className="my-3" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Fecha</p>
                  <p>{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-semibold">S/ {order.total.toFixed(2)}</p>
                </div>
              </div>
               <div className="mt-3">
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge variant={getStatusVariant(order.status) as any} className="w-full justify-center">
                    {order.status}
                  </Badge>
                </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


function ProductManagement({ setDialogOpen }: { setDialogOpen: (isOpen: boolean) => void; }) {
  const handleDelete = (id: string) => {
    alert(`(Simulado) Producto con ID: ${id} eliminado.`);
  };

  const ActionMenu = ({ item }: { item: MenuItem }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
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
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos</CardTitle>
        <CardDescription>Gestiona los productos de tu menú.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Vista de tabla para pantallas grandes */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Extras</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>S/ {item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.extras ? item.extras.length : 0}</TableCell>
                  <TableCell className="text-right">
                    <ActionMenu item={item} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Vista de tarjetas para pantallas pequeñas */}
        <div className="grid gap-4 md:hidden">
          {menuItems.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <ActionMenu item={item} />
                  </div>
                  <p className="font-semibold mt-2">S/ {item.price.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Extras: {item.extras ? item.extras.length : 0}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


function ProductDialog({ setDialogOpen, product }: { setDialogOpen: (isOpen: boolean) => void; product?: MenuItem }) {
  const [extras, setExtras] = useState<MenuItemExtra[]>(product?.extras || []);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddExtra = () => {
    setExtras([...extras, { name: '', price: 0 }]);
  };

  const handleRemoveExtra = (index: number) => {
    setExtras(extras.filter((_, i) => i !== index));
  };

  const handleExtraChange = (index: number, field: 'name' | 'price', value: string) => {
    const newExtras = [...extras];
    if (field === 'price') {
      newExtras[index][field] = parseFloat(value) || 0;
    } else {
      newExtras[index][field] = value;
    }
    setExtras(newExtras);
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setIsUploading(false);
        // In a real app, you would start the upload to a storage service here
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you would handle form submission to an API
    alert('(Simulado) Producto guardado con éxito.');
    setDialogOpen(false);
  };
  
  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{product ? 'Editar' : 'Añadir'} Producto</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto pr-6">
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
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="image" className="text-right pt-2">Imagen</Label>
          <div className="col-span-3 space-y-2">
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="col-span-3" />
             {isUploading && <p className="text-sm text-muted-foreground">Cargando...</p>}
             {imagePreview && !isUploading && (
                <div className="relative w-32 h-32 mt-2 rounded-md overflow-hidden">
                    <Image src={imagePreview} alt="Vista previa" layout="fill" objectFit="cover" />
                </div>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-2 text-center">Extras / Variables</h3>
          <div className="space-y-4">
            {extras.map((extra, index) => (
              <div key={index} className="grid grid-cols-10 items-center gap-2">
                <Input
                  placeholder="Nombre del extra"
                  value={extra.name}
                  onChange={(e) => handleExtraChange(index, 'name', e.target.value)}
                  className="col-span-5"
                />
                <Input
                  type="number"
                  placeholder="Precio"
                  value={extra.price}
                  onChange={(e) => handleExtraChange(index, 'price', e.target.value)}
                  className="col-span-3"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveExtra(index)}
                  className="col-span-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleAddExtra} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Extra
          </Button>
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

  const ActionMenu = ({ catId }: { catId: string }) => (
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
        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(catId)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

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
        {/* Vista de tabla para pantallas grandes */}
        <div className="hidden md:block">
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-right">
                    <ActionMenu catId={cat.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Vista de tarjetas para pantallas pequeñas */}
        <div className="grid gap-4 md:hidden">
            {categories.map((cat) => (
                <Card key={cat.id} className="p-4">
                    <div className="flex justify-between items-center">
                        <p className="font-bold">{cat.name}</p>
                         <ActionMenu catId={cat.id} />
                    </div>
                </Card>
            ))}
        </div>

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
        <DialogFooter>
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function BannerManagement({ setDialogOpen }: { setDialogOpen: (isOpen: boolean) => void; }) {
  const handleDelete = (id: string) => {
    alert(`(Simulado) Banner con ID: ${id} eliminado.`);
  };

  const ActionMenu = ({ item }: { item: typeof heroItems[0] }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setDialogOpen(true)}>
          <Edit className="mr-2 h-4 w-4" /> Editar
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(item.id)}>
          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Banners</CardTitle>
        <CardDescription>Gestiona los banners de la página principal.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Vista de tabla para pantallas grandes */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagen</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {heroItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={100}
                      height={56}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">
                    <ActionMenu item={item} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Vista de tarjetas para pantallas pequeñas */}
        <div className="grid gap-4 md:hidden">
          {heroItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative h-32 w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <ActionMenu item={item} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


function BannerDialog({ setDialogOpen }: { setDialogOpen: (isOpen: boolean) => void; }) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('(Simulado) Banner guardado.');
    setDialogOpen(false);
  };
  
  return (
     <DialogContent className="sm:max-w-[480px]">
      <DialogHeader>
        <DialogTitle>Añadir/Editar Banner</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="banner-title" className="text-right">Título</Label>
          <Input id="banner-title" placeholder="Ej: DELIVERY GRATIS" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="banner-description" className="text-right">Descripción</Label>
          <Textarea id="banner-description" placeholder="Ej: En compras mayores a S/. 30" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="banner-image" className="text-right">URL de Imagen</Label>
          <Input id="banner-image" placeholder="https://ejemplo.com/imagen.png" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="banner-button-text" className="text-right">Texto del Botón</Label>
          <Input id="banner-button-text" placeholder="Ej: ¡ORDENA YA!" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="banner-href" className="text-right">Enlace</Label>
          <Input id="banner-href" placeholder="Ej: /carta" className="col-span-3" />
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
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = React.useRef<HTMLInputElement>(null);


  const handleDelete = (id: string) => {
    alert(`(Simulado) Local con ID: ${id} eliminado.`);
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const ActionMenu = ({ locId }: { locId: string }) => (
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
        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(locId)}>
          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

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
              <Label htmlFor="logo-upload">Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
                    {logoPreview ? (
                        <Image src={logoPreview} alt="Vista previa del logo" layout="fill" objectFit="cover" />
                    ) : (
                        <span className="text-2xl font-bold" style={{fontFamily: "'Ms Madi', cursive"}}>Fly</span>
                    )}
                </div>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  ref={logoInputRef}
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <Button variant="outline" type="button" onClick={() => logoInputRef.current?.click()}>
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
          {/* Vista de tabla para pantallas grandes */}
          <div className="hidden md:block">
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
                       <ActionMenu locId={loc.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Vista de tarjetas para pantallas pequeñas */}
          <div className="grid gap-4 md:hidden">
            {locations.map((loc) => (
              <Card key={loc.id} className="p-4">
                <div className="flex justify-between items-start">
                    <div className="font-bold">{loc.name}</div>
                    <ActionMenu locId={loc.id} />
                </div>
                 <Separator className="my-3" />
                 <div className="space-y-2 text-sm text-muted-foreground">
                    <p><span className="font-semibold text-foreground">Dirección:</span> {loc.address}</p>
                    <p><span className="font-semibold text-foreground">Teléfono:</span> {loc.phone}</p>
                 </div>
              </Card>
            ))}
          </div>
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
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location-map-url" className="text-right">URL de Ubicación (Mapa)</Label>
          <Input id="location-map-url" placeholder="https://maps.app.goo.gl/..." className="col-span-3" />
        </div>
        <DialogFooter>
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

    

    
