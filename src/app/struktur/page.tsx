"use client";

import React, { useState, useEffect } from "react";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import { usePageVisitor } from "@/hooks/usePageVisitor";

const StrukturContent = () => {
  const [mounted, setMounted] = useState(false);

  usePageVisitor("Struktur");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className={`pt-12 pb-16 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="w-full max-w-6xl">
              <img
                src="/struktur.png"
                alt="Struktur Pengurus RW 02"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StrukturContent;

