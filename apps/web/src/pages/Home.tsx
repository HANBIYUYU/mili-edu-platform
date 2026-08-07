import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TransparentNav from '../components/TransparentNav';
import BackToTop from '../components/BackToTop';
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import VideosSection from '../sections/VideosSection';
import MaterialsSection from '../sections/MaterialsSection';
import GallerySection from '../sections/GallerySection';
import ContactSection from '../sections/ContactSection';
import FloatingNext from '../components/FloatingNext';
import Footer from '../components/Footer';

/**
 * Home 页面
 * 长滚动单页首页，包含 6 个 Section + Footer
 * 所有内容在同一页面内滚动，通过锚点导航
 */
export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      // 延迟一帧等 DOM 渲染完再滚动
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [hash]);

  return (
    <div style={{ background: '#FAF9F6' }}>
      <TransparentNav />
      <HeroSection />
      <AboutSection />
      <VideosSection />
      <MaterialsSection />
      <GallerySection />
      <ContactSection />
      <FloatingNext />
      <Footer />
      <BackToTop />
    </div>
  );
}
