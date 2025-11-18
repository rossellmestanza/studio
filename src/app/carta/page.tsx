import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import MenuPage from '@/components/MenuPage';
import Footer from '@/components/Footer';

export default function Menu() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <MenuPage />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
