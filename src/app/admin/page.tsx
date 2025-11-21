

'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { Home, ShoppingBag, List, PlusCircle, MoreHorizontal, Trash2, Edit, ClipboardList, DollarSign, Store, Upload, Clock, Phone, MapPin, Menu as MenuIcon, LogOut, Image as ImageIcon, MessageCircle } from 'lucide-react';
import type { MenuItem, MenuItemExtra, Order, Banner, Location, MenuCategory, BusinessInfo } from '@/lib/types';
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
import { useAuth, useUser, useFirestore, useCollection, useDoc, useMemoFirebase, useStorage } from '@/firebase';
import { collection, doc, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Progress } from '@/components/ui/progress';

const monthlyRevenueData = [
    { month: 'Enero', revenue: 1200 },
    { month: 'Febrero', revenue: 1800 },
    { month: 'Marzo', revenue: 1500 },
    { month: 'Abril', revenue: 2100 },
    { month: 'Mayo', revenue: 1900 },
    { month: 'Junio', revenue: 2300 },
];


export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (auth) {
        await signOut(auth);
        router.push('/auth');
    }
  };

  const handleEditProduct = (product: MenuItem) => {
    setSelectedProduct(product);
    setIsProductDialogOpen(true);
  };
  
  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    setIsProductDialogOpen(true);
  }

  const handleEditBanner = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsBannerDialogOpen(true);
  };
  
  const handleAddNewBanner = () => {
    setSelectedBanner(null);
    setIsBannerDialogOpen(true);
  }
  
  const renderContent = () => {
    switch (activeView) {
      case 'products':
        return <ProductManagement onEdit={handleEditProduct} />;
      case 'categories':
        return <CategoryManagement selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} isCategoryDialogOpen={isCategoryDialogOpen} setIsCategoryDialogOpen={setIsCategoryDialogOpen} />;
      case 'orders':
        return <OrderManagement />;
      case 'banners':
        return <BannerManagement onEdit={handleEditBanner} />;
      case 'local':
        return <LocalManagement selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} isLocationDialogOpen={isLocationDialogOpen} setIsLocationDialogOpen={setIsLocationDialogOpen} />;
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
                <Dialog open={isProductDialogOpen} onOpenChange={(isOpen) => { setIsProductDialogOpen(isOpen); if (!isOpen) setSelectedProduct(null); }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1" onClick={handleAddNewProduct}>
                      <PlusCircle className="h-4 w-4" />
                      Añadir Producto
                    </Button>
                  </DialogTrigger>
                  <ProductDialog setDialogOpen={setIsProductDialogOpen} product={selectedProduct} />
                </Dialog>
              )}
               {activeView === 'banners' && (
                <Dialog open={isBannerDialogOpen} onOpenChange={(isOpen) => { setIsBannerDialogOpen(isOpen); if (!isOpen) setSelectedBanner(null); }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1" onClick={handleAddNewBanner}>
                      <PlusCircle className="h-4 w-4" />
                      Añadir
                    </Button>
                  </DialogTrigger>
                  <BannerDialog setDialogOpen={setIsBannerDialogOpen} banner={selectedBanner} />
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
    const firestore = useFirestore();
    const ordersQuery = useMemoFirebase(() => firestore ? collection(firestore, 'orders') : null, [firestore]);
    const productsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
    const categoriesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'categories') : null, [firestore]);

    const { data: orders, isLoading: ordersLoading } = useCollection<Order>(ordersQuery);
    const { data: products, isLoading: productsLoading } = useCollection<MenuItem>(productsQuery);
    const { data: categories, isLoading: categoriesLoading } = useCollection<MenuCategory>(categoriesQuery);

    const totalRevenue = useMemo(() => {
        return orders?.filter(o => o.status === 'Entregado').reduce((sum, o) => sum + o.total, 0) || 0;
    }, [orders]);

    const monthlyRevenue = useMemo(() => {
        const currentMonthRevenue = { 
            month: new Date().toLocaleString('es-PE', { month: 'long' }),
            revenue: totalRevenue 
        };
        const existingMonthIndex = monthlyRevenueData.findIndex(d => d.month.toLowerCase() === currentMonthRevenue.month.toLowerCase());
        
        let updatedData = [...monthlyRevenueData];
        if (existingMonthIndex !== -1) {
            updatedData[existingMonthIndex] = {
                ...updatedData[existingMonthIndex],
                revenue: currentMonthRevenue.revenue
            };
        }
        
        return updatedData;
    }, [totalRevenue]);

    if (ordersLoading || productsLoading || categoriesLoading) {
        return <div>Cargando dashboard...</div>;
    }

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
                    <p className="text-4xl font-bold">{orders?.length ?? 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                    <CardTitle>Total Productos</CardTitle>
                    <CardDescription>Número total de productos en el menú.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <p className="text-4xl font-bold">{products?.length ?? 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                    <CardTitle>Total Categorías</CardTitle>
                    <CardDescription>Número total de categorías de productos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <p className="text-4xl font-bold">{categories?.length ?? 0}</p>
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
  const firestore = useFirestore();
  const ordersQuery = useMemoFirebase(() => firestore ? collection(firestore, 'orders') : null, [firestore]);
  const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Entregado': return 'default';
      case 'Pendiente': return 'destructive';
      case 'En preparación': return 'secondary';
      default: return 'outline';
    }
  };
  
  const handleStatusChange = (orderId: string, status: Order['status']) => {
      if (!firestore) return;
      const orderRef = doc(firestore, 'orders', orderId);
      updateDoc(orderRef, { status });
  };


  const ActionMenu = ({ order }: { order: Order }) => (
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
              <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Pendiente')}>Pendiente</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'En preparación')}>En preparación</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Entregado')}>Entregado</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isLoading) return <div>Cargando pedidos...</div>

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
              {orders && orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.substring(0, 6)}...</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>S/ {order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionMenu order={order} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Vista de tarjetas para pantallas pequeñas */}
        <div className="grid gap-4 md:hidden">
          {orders && orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{order.customer}</p>
                  <p className="text-sm text-muted-foreground">#{order.id.substring(0, 6)}</p>
                </div>
                <ActionMenu order={order} />
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


function ProductManagement({ onEdit }: { onEdit: (product: MenuItem) => void; }) {
  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
  const { data: products, isLoading } = useCollection<MenuItem>(productsQuery);

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            await deleteDoc(doc(firestore, 'products', id));
            alert('Producto eliminado con éxito.');
        } catch (error) {
            console.error("Error deleting product: ", error);
            alert('Error al eliminar el producto. Revisa la consola para más detalles.');
        }
    }
  };
  
  const ActionMenu = ({ item, onEdit, onDelete }: { item: MenuItem, onEdit: (item: MenuItem) => void, onDelete: (id: string) => void }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(item)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(item.id)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isLoading) return <div>Cargando productos...</div>

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
              {products && products.map((item) => (
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
                    <ActionMenu item={item} onEdit={onEdit} onDelete={handleDelete} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Vista de tarjetas para pantallas pequeñas */}
        <div className="grid gap-4 md:hidden">
          {products && products.map((item) => (
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
                    <ActionMenu item={item} onEdit={onEdit} onDelete={handleDelete} />
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


function ProductDialog({ setDialogOpen, product }: { setDialogOpen: (isOpen: boolean) => void; product?: MenuItem | null }) {
  const firestore = useFirestore();
  const storage = useStorage();
  const categoriesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'categories') : null, [firestore]);
  const { data: categories, isLoading: categoriesLoading } = useCollection<MenuCategory>(categoriesQuery);
  
  const [formData, setFormData] = useState<Partial<MenuItem>>({});
  const [extras, setExtras] = useState<MenuItemExtra[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setExtras(product.extras || []);
      setImagePreview(product.image || null);
    } else {
      setFormData({price: 0, originalPrice: undefined});
      setExtras([]);
      setImagePreview(null);
    }
    setImageFile(null);
    setIsUploading(false);
    setUploadProgress(0);
  }, [product]);

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
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({...prev, category: value }));
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore || !storage) return;

    setIsUploading(true);
    
    let imageUrl = product?.image || '';

    if (imageFile) {
        setUploadProgress(20);
        const imageRef = storageRef(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        setUploadProgress(80);
        imageUrl = await getDownloadURL(imageRef);
        setUploadProgress(100);
    }

    const productData: Omit<MenuItem, 'id'> = {
        name: formData.name || '',
        description: formData.description || '',
        price: parseFloat(String(formData.price)) || 0,
        originalPrice: parseFloat(String(formData.originalPrice)) || undefined,
        category: formData.category || '',
        image: imageUrl,
        imageHint: formData.imageHint || '',
        extras: extras,
    };

    if (product?.id) {
        // Update existing product
        const productRef = doc(firestore, 'products', product.id);
        await updateDoc(productRef, productData);
    } else {
        // Add new product
        const productsCollection = collection(firestore, 'products');
        await addDoc(productsCollection, productData);
    }

    setIsUploading(false);
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
          <Input id="name" value={formData.name || ''} onChange={handleChange} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">Descripción</Label>
          <Textarea id="description" value={formData.description || ''} onChange={handleChange} className="col-span-3" />
        </div>
         <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">Categoría</Label>
          <Select value={formData.category} onValueChange={handleSelectChange}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categoriesLoading ? <SelectItem value="loading" disabled>Cargando...</SelectItem> :
              categories?.map(cat => (
                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">Precio</Label>
          <Input id="price" type="number" step="0.01" value={formData.price || ''} onChange={handleChange} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="originalPrice" className="text-right">Precio Original</Label>
          <Input id="originalPrice" type="number" step="0.01" value={formData.originalPrice || ''} onChange={handleChange} className="col-span-3" placeholder="(Opcional)" />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="image-upload" className="text-right pt-2">Imagen</Label>
          <div className="col-span-3 space-y-2">
            <Input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="col-span-3" />
             {isUploading && <Progress value={uploadProgress} className="w-full" />}
             {imagePreview && (
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
          <Button type="submit" disabled={isUploading}>{isUploading ? 'Guardando...' : 'Guardar Cambios'}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function CategoryManagement({ selectedCategory, setSelectedCategory, isCategoryDialogOpen, setIsCategoryDialogOpen }: { selectedCategory: MenuCategory | null, setSelectedCategory: (category: MenuCategory | null) => void; isCategoryDialogOpen: boolean; setIsCategoryDialogOpen: (isOpen: boolean) => void; }) {
  const firestore = useFirestore();
  const categoriesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'categories') : null, [firestore]);
  const { data: categories, isLoading } = useCollection<MenuCategory>(categoriesQuery);
  
  const handleDelete = (id: string) => {
    if (!firestore) return;
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
        deleteDoc(doc(firestore, 'categories', id));
    }
  };

  const handleEdit = (category: MenuCategory) => {
      setSelectedCategory(category);
      setIsCategoryDialogOpen(true);
  }

  const handleAddNew = () => {
      setSelectedCategory(null);
      setIsCategoryDialogOpen(true);
  }

  const ActionMenu = ({ cat }: { cat: MenuCategory }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleEdit(cat)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(cat.id)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isLoading) return <div>Cargando categorías...</div>

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Categorías</CardTitle>
          <CardDescription>Gestiona las categorías de tu menú.</CardDescription>
        </div>
         <Dialog open={isCategoryDialogOpen} onOpenChange={(isOpen) => { setIsCategoryDialogOpen(isOpen); if (!isOpen) setSelectedCategory(null); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1" onClick={handleAddNew}>
              <PlusCircle className="h-4 w-4" />
              Añadir Categoría
            </Button>
          </DialogTrigger>
          <CategoryDialog setDialogOpen={setIsCategoryDialogOpen} category={selectedCategory}/>
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
              {categories && categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-right">
                    <ActionMenu cat={cat} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Vista de tarjetas para pantallas pequeñas */}
        <div className="grid gap-4 md:hidden">
            {categories && categories.map((cat) => (
                <Card key={cat.id} className="p-4">
                    <div className="flex justify-between items-center">
                        <p className="font-bold">{cat.name}</p>
                         <ActionMenu cat={cat} />
                    </div>
                </Card>
            ))}
        </div>

      </CardContent>
    </Card>
  );
}

function CategoryDialog({ setDialogOpen, category }: { setDialogOpen: (isOpen: boolean) => void; category?: MenuCategory | null }) {
  const firestore = useFirestore();
  const [name, setName] = useState(category?.name || '');

  useEffect(() => {
    setName(category?.name || '');
  }, [category])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore || !name) return;

    const categoryData = { name };

    if (category?.id) {
        updateDoc(doc(firestore, 'categories', category.id), categoryData);
    } else {
        addDoc(collection(firestore, 'categories'), categoryData);
    }

    setDialogOpen(false);
  };
  
  return (
     <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{category ? 'Editar' : 'Añadir'} Categoría</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Nombre</Label>
          <Input id="name" placeholder="Ej: Bebidas" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
        </div>
        <DialogFooter>
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function BannerManagement({ onEdit }: { onEdit: (banner: Banner) => void; }) {
  const firestore = useFirestore();
  const bannersQuery = useMemoFirebase(() => firestore ? collection(firestore, 'banners') : null, [firestore]);
  const { data: banners, isLoading } = useCollection<Banner>(bannersQuery);
  
  const handleDelete = (id: string) => {
    if (!firestore) return;
    if (confirm('¿Estás seguro de que quieres eliminar este banner?')) {
        deleteDoc(doc(firestore, 'banners', id));
    }
  };

  const ActionMenu = ({ item }: { item: Banner }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(item)}>
          <Edit className="mr-2 h-4 w-4" /> Editar
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(item.id)}>
          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isLoading) return <div>Cargando banners...</div>

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
              {banners && banners.map((item) => (
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
          {banners && banners.map((item) => (
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


function BannerDialog({ setDialogOpen, banner }: { setDialogOpen: (isOpen: boolean) => void; banner?: Banner | null }) {
  const firestore = useFirestore();
  const storage = useStorage();
  const [formData, setFormData] = useState<Partial<Banner>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  useEffect(() => {
    if (banner) {
        setFormData(banner);
        setImagePreview(banner.imageUrl);
    } else {
        setFormData({});
        setImagePreview(null);
    }
    setImageFile(null);
    setIsUploading(false);
    setUploadProgress(0);
  }, [banner]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({ ...prev, [id.replace('banner-','')]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore || !storage) return;

    setIsUploading(true);
    let imageUrl = banner?.imageUrl || '';

    if (imageFile) {
        setUploadProgress(20);
        const imageRef = storageRef(storage, `banners/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        setUploadProgress(80);
        imageUrl = await getDownloadURL(imageRef);
        setUploadProgress(100);
    }


    const bannerData: Omit<Banner, 'id'> = {
        title: formData.title || '',
        description: formData.description || '',
        buttonText: formData.buttonText || '',
        imageUrl: imageUrl,
        href: formData.href || '',
    };
    
    if (banner?.id) {
        await updateDoc(doc(firestore, 'banners', banner.id), bannerData);
    } else {
        await addDoc(collection(firestore, 'banners'), bannerData);
    }

    setIsUploading(false);
    setDialogOpen(false);
  };
   
  return (
     <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Añadir/Editar Banner</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto pr-6">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="banner-title" className="text-right">Título</Label>
          <Input id="banner-title" value={formData.title || ''} onChange={handleChange} placeholder="Ej: DELIVERY GRATIS" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="banner-description" className="text-right">Descripción</Label>
          <Textarea id="banner-description" value={formData.description || ''} onChange={handleChange} placeholder="Ej: En compras mayores a S/. 30" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="image-upload" className="text-right pt-2">Imagen</Label>
          <div className="col-span-3 space-y-2">
            <Input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="col-span-3" />
             {isUploading && <Progress value={uploadProgress} className="w-full" />}
             {imagePreview && !isUploading && (
                <div className="relative w-full aspect-video mt-2 rounded-md overflow-hidden">
                    <Image src={imagePreview} alt="Vista previa del banner" layout="fill" objectFit="cover" />
                </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="banner-buttonText" className="text-right">Texto del Botón</Label>
          <Input id="banner-buttonText" value={formData.buttonText || ''} onChange={handleChange} placeholder="Ej: ¡ORDENA YA!" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="banner-href" className="text-right">Enlace</Label>
          <Input id="banner-href" value={formData.href || ''} onChange={handleChange} placeholder="Ej: /carta" className="col-span-3" />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isUploading}>{isUploading ? 'Guardando...' : 'Guardar'}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function LocalManagement({ selectedLocation, setSelectedLocation, isLocationDialogOpen, setIsLocationDialogOpen }: { selectedLocation: Location | null; setSelectedLocation: (location: Location | null) => void; isLocationDialogOpen: boolean; setIsLocationDialogOpen: (isOpen: boolean) => void; }) {
  const firestore = useFirestore();
  const storage = useStorage();
  const businessInfoDoc = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'businessInfo') : null, [firestore]);
  const { data: businessInfo, isLoading: infoLoading } = useDoc<BusinessInfo>(businessInfoDoc);
  const locationsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'locations') : null, [firestore]);
  const { data: locations, isLoading: locationsLoading } = useCollection<Location>(locationsQuery);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [infoFormData, setInfoFormData] = useState<Partial<BusinessInfo>>({});
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      if (businessInfo) {
          setInfoFormData(businessInfo);
          setLogoPreview(businessInfo.logoUrl);
      }
  }, [businessInfo]);

  const handleDeleteLocation = (id: string) => {
    if (!firestore) return;
    if (confirm('¿Estás seguro de que quieres eliminar este local?')) {
        deleteDoc(doc(firestore, 'locations', id));
    }
  };
  
  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location);
    setIsLocationDialogOpen(true);
  }

  const handleAddNewLocation = () => {
    setSelectedLocation(null);
    setIsLocationDialogOpen(true);
  }

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInfoFormData(prev => ({...prev, [id]: value }));
  }
  
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !businessInfoDoc || !storage) return;
    setIsLogoUploading(true);

    let logoUrl = businessInfo?.logoUrl || '';

    if (logoFile) {
        const logoRef = storageRef(storage, `logos/${Date.now()}_${logoFile.name}`);
        await uploadBytes(logoRef, logoFile);
        logoUrl = await getDownloadURL(logoRef);
    }

    const dataToSave = { 
        ...infoFormData,
        logoUrl,
    };
    
    await setDoc(businessInfoDoc, dataToSave, { merge: true });
    setIsLogoUploading(false);
    alert('Información del negocio guardada.');
  }
  
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !businessInfoDoc) return;
     const dataToSave = {
        footerAddress: infoFormData.footerAddress,
        footerHours: infoFormData.footerHours,
        footerPhone: infoFormData.footerPhone,
        footerWhatsapp: infoFormData.footerWhatsapp,
    };
    await setDoc(businessInfoDoc, dataToSave, { merge: true });
    alert('Información de contacto guardada.');
  }

  const ActionMenu = ({ loc }: { loc: Location }) => (
    <DropdownMenu>
       <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleEditLocation(loc)}>
          <Edit className="mr-2 h-4 w-4" /> Editar
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteLocation(loc.id)}>
          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (infoLoading || locationsLoading) return <div>Cargando información del local...</div>

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del Negocio</CardTitle>
          <CardDescription>Actualiza los datos generales de tu restaurante.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInfoSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nombre del Negocio</Label>
              <Input id="businessName" value={infoFormData.businessName || ''} onChange={handleInfoChange} />
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
             <Button type="submit" disabled={isLogoUploading}>
                {isLogoUploading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto (Footer)</CardTitle>
          <CardDescription>Edita la información que aparece en el pie de página.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContactSubmit} className="space-y-6">
             <div className="space-y-2">
              <Label htmlFor="footerAddress">Dirección</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="footerAddress" className="pl-10" value={infoFormData.footerAddress || ''} onChange={handleInfoChange} />
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="footerHours">Horario</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="footerHours" className="pl-10" value={infoFormData.footerHours || ''} onChange={handleInfoChange} />
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="footerPhone">Teléfono</Label>
               <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="footerPhone" className="pl-10" value={infoFormData.footerPhone || ''} onChange={handleInfoChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="footerWhatsapp">WhatsApp para Pedidos</Label>
               <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="footerWhatsapp" className="pl-10" value={infoFormData.footerWhatsapp || ''} onChange={handleInfoChange} />
              </div>
            </div>
            <Button type="submit">Actualizar Contacto</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestionar Locales</CardTitle>
            <CardDescription>Añade o edita las sucursales de tu negocio.</CardDescription>
          </div>
           <Dialog open={isLocationDialogOpen} onOpenChange={(isOpen) => { setIsLocationDialogOpen(isOpen); if (!isOpen) setSelectedLocation(null); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1" onClick={handleAddNewLocation}>
                <PlusCircle className="h-4 w-4" />
                Añadir Local
              </Button>
            </DialogTrigger>
            <LocationDialog setDialogOpen={setIsLocationDialogOpen} location={selectedLocation}/>
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
                {locations && locations.map((loc) => (
                  <TableRow key={loc.id}>
                    <TableCell className="font-medium">{loc.name}</TableCell>
                    <TableCell>{loc.address}</TableCell>
                    <TableCell>{loc.phone}</TableCell>
                    <TableCell className="text-right">
                       <ActionMenu loc={loc} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Vista de tarjetas para pantallas pequeñas */}
          <div className="grid gap-4 md:hidden">
            {locations && locations.map((loc) => (
              <Card key={loc.id} className="p-4">
                <div className="flex justify-between items-start">
                    <div className="font-bold">{loc.name}</div>
                    <ActionMenu loc={loc} />
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


function LocationDialog({ setDialogOpen, location }: { setDialogOpen: (isOpen: boolean) => void; location?: Location | null }) {
  const firestore = useFirestore();
  const [formData, setFormData] = useState<Partial<Location>>({});
  
  useEffect(() => {
      if (location) {
          setFormData(location)
      } else {
          setFormData({});
      }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({ ...prev, [id.replace('location-', '')]: value }));
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) return;

    const locationData: Omit<Location, 'id'> = {
        name: formData.name || '',
        address: formData.address || '',
        phone: formData.phone || '',
        mapUrl: formData.mapUrl || '',
    };
    
    if (location?.id) {
        await updateDoc(doc(firestore, 'locations', location.id), locationData);
    } else {
        await addDoc(collection(firestore, 'locations'), locationData);
    }
    setDialogOpen(false);
  };
  
  return (
     <DialogContent className="sm:max-w-[480px]">
      <DialogHeader>
        <DialogTitle>{location ? 'Editar' : 'Añadir'} Local</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location-name" className="text-right">Nombre</Label>
          <Input id="location-name" value={formData.name || ''} onChange={handleChange} placeholder="Ej: Local Miraflores" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location-address" className="text-right">Dirección</Label>
          <Input id="location-address" value={formData.address || ''} onChange={handleChange} placeholder="Ej: Av. Larco 123" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location-phone" className="text-right">Teléfono</Label>
          <Input id="location-phone" value={formData.phone || ''} onChange={handleChange} placeholder="Ej: +51 987654321" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location-mapUrl" className="text-right">URL de Ubicación (Mapa)</Label>
          <Input id="location-mapUrl" value={formData.mapUrl || ''} onChange={handleChange} placeholder="https://maps.app.goo.gl/..." className="col-span-3" />
        </div>
        <DialogFooter>
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}



    
