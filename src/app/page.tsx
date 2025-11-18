import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Favorites from '@/components/Favorites';
import HomeMenuPreview from '@/components/HomeMenuPreview';
import GalleryCarousel from '@/components/GalleryCarousel';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <GalleryCarousel />
        <Favorites />
        <HomeMenuPreview />
      </main>
      <Footer />
    </div>
  );
}
