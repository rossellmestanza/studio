
"use client";

import Link from 'next/link';
import CartSheet from '@/components/CartSheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Menu, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useUser, useAuth, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { signOut } from 'firebase/auth';
import type { BusinessInfo, User as UserType } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';


export default function Header() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const businessInfoDoc = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'businessInfo') : null, [firestore]);
  const { data: businessInfo, isLoading: isInfoLoading } = useDoc<BusinessInfo>(businessInfoDoc);
  
  const userDocRef = useMemoFirebase(() => (firestore && user) ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userData } = useDoc<UserType>(userDocRef);


  const handleSignOut = () => {
    if (!auth) return;
    signOut(auth);
  };

  const navLinks = [
    { href: '/', label: 'INICIO' },
    { href: '/carta', label: 'CARTA' },
    { href: '/locales', label: 'LOCALES' },
  ];
  
  const isAdmin = userData?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-black text-white">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          {isInfoLoading ? <Skeleton className="h-10 w-20" /> : (
            <span className="text-4xl font-headline" style={{fontFamily: "'Ms Madi', cursive"}}>{businessInfo?.businessName || 'Fly'}</span>
          )}
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-white/80"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <CartSheet />
          {!isUserLoading && !user && (
            <Button asChild variant="outline" size="sm" className="hidden md:inline-flex bg-yellow-400 text-black border-none hover:bg-yellow-400">
              <Link href="/auth">Iniciar Sesión</Link>
            </Button>
          )}
           {!isUserLoading && user && (
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative rounded-full bg-transparent border-gray-600 hover:bg-gray-700">
                    <User className="h-5 w-5 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black text-white border-gray-700">
                   {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/micuenta" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Cuenta</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-900/50">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full bg-transparent border-gray-600 hover:bg-gray-700">
                  <Menu className="h-5 w-5 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black text-white border-gray-700 w-screen">
                {navLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "py-2 px-4 text-lg justify-center",
                        pathname === link.href ? "text-primary bg-gray-800" : ""
                      )}
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                 {user && (
                  <>
                    <DropdownMenuSeparator className="bg-gray-700" />
                     {isAdmin && (
                       <DropdownMenuItem asChild>
                         <Link
                          href="/admin"
                          className={cn(
                            "py-2 px-4 text-lg justify-center",
                            pathname === "/admin" ? "text-primary bg-gray-800" : ""
                          )}
                        >
                          DASHBOARD
                        </Link>
                       </DropdownMenuItem>
                     )}
                    <DropdownMenuItem asChild>
                       <Link
                        href="/micuenta"
                        className={cn(
                          "py-2 px-4 text-lg justify-center",
                          pathname === "/micuenta" ? "text-primary bg-gray-800" : ""
                        )}
                      >
                        MI CUENTA
                      </Link>
                    </DropdownMenuItem>
                  </>
                  )}
                  <DropdownMenuSeparator className="bg-gray-700" />
                  {!user && !isUserLoading ? (
                     <DropdownMenuItem asChild>
                       <Link
                        href="/auth"
                        className="py-3 px-4 text-lg justify-center bg-yellow-400 text-black focus:bg-yellow-400 focus:text-black"
                      >
                        INICIAR SESIÓN
                      </Link>
                    </DropdownMenuItem>
                  ) : !isUserLoading && (
                     <DropdownMenuItem onClick={handleSignOut} className="py-3 px-4 text-lg justify-center text-red-400 focus:text-red-400 focus:bg-red-900/50 cursor-pointer">
                        <LogOut className="mr-2 h-5 w-5" />
                        CERRAR SESIÓN
                    </DropdownMenuItem>
                  )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
