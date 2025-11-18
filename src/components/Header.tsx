"use client";

import Link from 'next/link';
import CartSheet from '@/components/CartSheet';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-3xl font-headline text-foreground">Fly Menú</span>
        </Link>
        <div className="flex items-center space-x-4">
          <CartSheet />
        </div>
      </div>
    </header>
  );
}
