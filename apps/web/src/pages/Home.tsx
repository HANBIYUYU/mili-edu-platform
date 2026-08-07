import TransparentNav from '../components/TransparentNav';
import BackToTop from '../components/BackToTop';
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import VideosSection from '../sections/VideosSection';
import MaterialsSection from '../sections/MaterialsSection';
import GallerySection from '../sections/GallerySection';
import ContactSection from '../sections/ContactSection';
import Footer from '../components/Footer';

/**
 * Home 页面
 * 长滚动单页首页，包含 6 个 Section + Footer
 * 所有内容在同一页面内滚动，通过锚点导航
 */
export default function Home() {
  return (
    <div style={{ background: '#FAF9F6' }}>
      <TransparentNav />
      <HeroSection />
      <AboutSection />
      <VideosSection />
      <MaterialsSection />
      <GallerySection />
      <ContactSection />
      <Footer />
      <BackToTop />
    </div>
  );
}
