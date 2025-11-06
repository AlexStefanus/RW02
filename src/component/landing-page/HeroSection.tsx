import { useEffect, useState } from "react";
import Link from "next/link";
import { useActiveGalleryImages } from "@/hooks/useGallery";
import SlideIndicator from "./SlideIndicator";
import HeroContent from "./HeroContent";
import ImageSlider from "./ImageSlider";
import { FiArrowRight } from "react-icons/fi";

const useImageSlider = (images: string[], galleryLoading: boolean) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isManualControl, setIsManualControl] = useState(false);

  useEffect(() => {
    if (!galleryLoading && images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      setCurrentImageIndex(randomIndex);
    }
  }, [galleryLoading, images.length]);

  useEffect(() => {
    if (isManualControl || images.length === 0) return;

    const slideInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000);

    return () => clearInterval(slideInterval);
  }, [images.length, isManualControl]);

  useEffect(() => {
    if (!isManualControl) return;

    const resetTimer = setTimeout(() => {
      setIsManualControl(false);
    }, 16000);

    return () => clearTimeout(resetTimer);
  }, [isManualControl, currentImageIndex]);

  const handleManualSlide = (index: number) => {
    setCurrentImageIndex(index);
    setIsManualControl(true);
  };

  return { currentImageIndex, handleManualSlide };
};


const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  const { images: galleryImages, loading: galleryLoading } = useActiveGalleryImages(5);

  const fallbackImages = ["/senam.png", "/jalan.png", "/balai.png", "/merdeka.png", "/pahlawan.png"];

  const images = galleryImages.length > 0 ? galleryImages.map((img) => img.imageUrl) : fallbackImages;
  const { currentImageIndex, handleManualSlide } = useImageSlider(images, galleryLoading);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <ImageSlider images={images} currentImageIndex={currentImageIndex} fallbackImages={fallbackImages} />

      <div className="absolute inset-0 bg-black/70"></div>

      <HeroContent mounted={mounted} />

      <SlideIndicator images={images} currentImageIndex={currentImageIndex} onSlideChange={handleManualSlide} />

      <div className={`hidden md:flex absolute bottom-5 right-8 z-20 smooth-transition ${mounted ? "smooth-reveal stagger-6" : "animate-on-load"}`}>
        <Link
          href="/galeri"
          className="group flex items-center gap-1 px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white/60 text-xs font-medium hover:bg-white/10 hover:text-white/80 transition-all duration-300"
        >
          Temukan lebih banyak foto di Galeri
          <FiArrowRight />
        </Link>
      </div>

      <div className={`flex md:hidden absolute bottom-5 right-8 z-20 smooth-transition ${mounted ? "smooth-reveal stagger-6" : "animate-on-load"}`}>
        <Link
          href="/galeri"
          className="group flex items-center gap-1 px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white/60 text-xs font-medium hover:bg-white/10 hover:text-white/80 transition-all duration-300"
        >
          Galeri Desa
          <FiArrowRight />
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;

