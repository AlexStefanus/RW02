"use client";

import React from "react";

const MisiSection = () => {
  return (
    <section className="py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Misi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <blockquote className="text-sm md:text-medium text-gray-700 leading-relaxed italic">
                "Meningkatkan kualitas infrastruktur dan teknologi untuk mendukung kegiatan masyarakat yang cerdas dan efisien."
              </blockquote>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <blockquote className="text-sm md:text-medium text-gray-700 leading-relaxed italic">
                "Mengembangkan program pendidikan dan pelatihan untuk meningkatkan kesadaran dan keterampilan warga."
              </blockquote>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <blockquote className="text-sm md:text-medium text-gray-700 leading-relaxed italic">
                "Meningkatkan kesejahteraan ekonomi, keamanan, dan kehidupan sosial yang berkah dan harmonis melalui kerja sama dan partisipasi warga."
              </blockquote>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <blockquote className="text-sm md:text-medium text-gray-700 leading-relaxed italic">
                "Melaksanakan Program-Program RW Berbasis Kebutuhan Masyarakat Sesuai Aturan Pemerintah, Norma Agama dan Sosial, Serta Perkembangan Zaman."
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MisiSection;
