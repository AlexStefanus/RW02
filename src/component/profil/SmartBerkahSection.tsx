"use client";

import React from "react";

const SmartBerkahSection = () => {
  const smartItems = [
    { letter: "S", meaning: "Semangat" },
    { letter: "M", meaning: "Menyenangkan" },
    { letter: "A", meaning: "Aman" },
    { letter: "R", meaning: "Ramah" },
    { letter: "T", meaning: "Tertib" },
  ];

  const berkahItems = [
    { letter: "B", meaning: "Berbuat baik selalu" },
    { letter: "E", meaning: "Etika selalu dijaga" },
    { letter: "R", meaning: "Ramah dengan orang lain" },
    { letter: "K", meaning: "Kasih sayang sesama" },
    { letter: "A", meaning: "Amanah dijaga" },
    { letter: "H", meaning: "Hidup kita akan berkah" },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Nilai-Nilai RW
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Prinsip SMART dan BERKAH sebagai pedoman warga
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* SMART Section */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-100">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-400 text-gray-900 font-bold text-xl md:text-2xl px-8 py-3 rounded-full shadow-md">
                SMART
              </div>
            </div>
            <div className="space-y-4">
              {smartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white/70 rounded-lg p-4 hover:bg-white transition-colors duration-200"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {item.letter}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold text-base md:text-lg">
                      {item.meaning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BERKAH Section */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-100">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-400 text-gray-900 font-bold text-xl md:text-2xl px-8 py-3 rounded-full shadow-md">
                BERKAH
              </div>
            </div>
            <div className="space-y-4">
              {berkahItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white/70 rounded-lg p-4 hover:bg-white transition-colors duration-200"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {item.letter}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold text-base md:text-lg">
                      {item.meaning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartBerkahSection;
