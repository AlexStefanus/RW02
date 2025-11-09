"use client";

import React from "react";

const TamanBacaSection = () => {
  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Taman Baca Rangkah</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#00a753] rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-sm md:text-medium text-gray-700 leading-relaxed mb-6">
              Dapatkan akses menuju E-Book dari Taman Baca Rangkah
            </p>
            <a
              href="https://drive.google.com/drive/folders/1tAyrTev5Yy0umxxTFPxOXIERtT0VQ-hf?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00a753] text-white text-sm md:text-base font-medium rounded-lg hover:bg-[#008f47] transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Buka Taman Baca
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TamanBacaSection;
