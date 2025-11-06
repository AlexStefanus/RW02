"use client";

import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import Header from "@/component/landing-page/Header";
import Footer from "@/component/landing-page/Footer";
import NewsCard from "@/component/common/NewsCard";
import Pagination from "@/component/common/Pagination";
import { LoadingSpinner, ErrorState, EmptyState, NewsCardSkeleton } from "@/component/common/LoadingStates";
import { usePublishedArticles } from "@/hooks/useArticles";
import usePageVisitor from "@/hooks/usePageVisitor";

const BeritaPage = () => {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage, setArticlesPerPage] = useState(12);

  const { articles, loading, error, refetch } = usePublishedArticles();

  usePageVisitor("Berita");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.content && article.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setArticlesPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Gagal memuat berita</h2>
            <p className="text-gray-600">{error}</p>
            <button onClick={refetch} className="mt-4 px-4 py-2 bg-[#00a753] text-white rounded hover:bg-[#008c45] transition-colors">
              Coba Lagi
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <Header />

      <section className="bg-[#00a753] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Berita RW 02 Rangkah</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">Dapatkan berita terkini seputar kegiatan, pembangunan, dan perkembangan di RW 02 Rangkah</p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari"
                className="form-input w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a753] focus:border-transparent text-black"
              />
            </div>
          </form>
        </div>
      </section>

      <main className="flex-grow bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <NewsCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} className="py-12" />
          ) : currentArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {currentArticles.map((article) => (
                  <NewsCard key={article.id} id={article.id!} title={article.title} excerpt={article.excerpt} imageUrl={article.imageUrl} authorName={article.authorName} createdAt={article.createdAt} slug={article.slug} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={articlesPerPage}
                totalItems={filteredArticles.length}
                loading={loading}
                onItemsPerPageChange={handleItemsPerPageChange}
                itemsPerPageOptions={[6, 12, 18, 24]}
              />
            </>
          ) : (
            <EmptyState title={searchTerm ? "Tidak ada berita yang ditemukan" : "Belum ada berita"} description={searchTerm ? "Coba gunakan kata kunci yang berbeda" : "Berita akan muncul di sini setelah dipublikasikan"} className="py-12" />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BeritaPage;

