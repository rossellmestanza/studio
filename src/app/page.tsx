import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Favorites from '@/components/Favorites';
import HomeMenuPreview from '@/components/HomeMenuPreview';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Favorites />
        <HomeMenuPreview />
      </main>
      <Footer />
    </div>
  );
}
