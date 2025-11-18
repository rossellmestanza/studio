"use client";

import Link from 'next/link';
import CartSheet from '@/components/CartSheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'INICIO' },
    { href: '/carta', label: 'CARTA' },
    { href: '/locales', label: 'LOCALES' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-black text-white">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-4xl font-headline" style={{fontFamily: "'Ms Madi', cursive"}}>Fly</span>
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
        </div>
      </div>
    </header>
  );
}
