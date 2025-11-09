"use client";

import React, { useState, useEffect } from "react";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import { VisiSection, MisiSection, SmartBerkahSection, PetaLokasiSection, TamanBacaSection } from "@/component/profil";
import usePageVisitor from "@/hooks/usePageVisitor";

const ProfilPage = () => {
  const [mounted, setMounted] = useState(false);

  usePageVisitor("Profil");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <Header />


      <section className="bg-[#00a753] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Profil RW 02 Rangkah</h1>
            <p className="text-base text-white/90 max-w-2xl mx-auto">Kecamatan Tambaksari, Kabupaten Surabaya, Jawa Timur</p>
          </div>
        </div>
      </section>

      <div className="flex-grow">

        <VisiSection />


        <MisiSection />


        <SmartBerkahSection />


        <PetaLokasiSection />


        <TamanBacaSection />
      </div>

      <Footer />
    </div>
  );
};

export default ProfilPage;

