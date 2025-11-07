"use client";

import React, { useState, useEffect, Suspense } from "react";
import { FiUsers, FiLoader } from "react-icons/fi";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import { usePageVisitor } from "@/hooks/usePageVisitor";
import { useActiveStructures } from "@/hooks/useStructure";
import OrganizationalChart from "@/component/structure/OrganizationalChart";

const StrukturContent = () => {
  const [mounted, setMounted] = useState(false);

  usePageVisitor("Struktur");
  const { structures, loading, error } = useActiveStructures();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-12 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <FiLoader className="animate-spin h-8 w-8 text-[#00a753] mx-auto mb-4" />
              <p className="text-gray-600">Memuat struktur organisasi...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-12 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!loading && structures.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-12 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUsers className="w-12 h-12 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Struktur Organisasi</h2>
                  <p className="text-gray-600">Struktur kepengurusan RW 02 Rangkah sedang dalam proses pembaruan. Silakan kembali lagi nanti untuk melihat informasi terbaru.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className={`pt-12 pb-16 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#00a753] mb-2">STRUKTUR PENGURUS RW 02</h1>
            <p className="text-gray-600">Periode 2023 - 2027</p>
          </div>

          <div className="min-h-[600px]">
            <OrganizationalChart structures={structures} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const StrukturPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="pt-12 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <FiLoader className="animate-spin h-8 w-8 text-[#00a753] mx-auto mb-4" />
                <p className="text-gray-600">Memuat struktur organisasi...</p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <StrukturContent />
    </Suspense>
  );
};

export default StrukturPage;

