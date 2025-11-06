"use client";

import { useState, useEffect } from "react";
import Header from "@/component/landing-page/Header";
import HeroSection from "@/component/landing-page/HeroSection";
import ScrollingBadge from "@/component/landing-page/ScrollingBadge";
import InfoCards from "@/component/landing-page/InfoCards";
import NewsSection from "@/component/landing-page/NewsSection";
import AgendaSection from "@/component/landing-page/AgendaSection";
import GallerySection from "@/component/landing-page/GallerySection";
import Footer from "@/component/landing-page/Footer";
import usePageVisitor from "@/hooks/usePageVisitor";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  usePageVisitor("Home");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen overflow-x-hidden smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <Header />
      <HeroSection />
      <ScrollingBadge />
      <InfoCards />
      <NewsSection />
      <AgendaSection />
      <GallerySection />
      <Footer />
    </div>
  );
}
