"use client";

import React from "react";

const PetaLokasiSection = () => {
  return (
    <section className="py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Peta Lokasi RW 02 Rangkah</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247.37163746122144!2d112.76540352108364!3d-7.246963693163314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f900689a0951%3A0x4b8da2574d7cc3bd!2sBALAI%20RW%2002%20RANGKAH!5e0!3m2!1sid!2sid!4v1762427007657!5m2!1sid!2sid"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
            title="Peta RW 02 Rangkah"
          />
        </div>
      </div>
    </section>
  );
};

export default PetaLokasiSection;

