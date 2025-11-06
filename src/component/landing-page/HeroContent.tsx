interface HeroContentProps {
  mounted: boolean;
}

const HeroContent = ({ mounted }: HeroContentProps) => {
  return (
    <div className={`relative z-10 w-full px-4 sm:px-6 lg:px-8 text-left text-white smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>Selamat Datang di RW 02</h1>
        <p className={`text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>Kelurahan Rangkah, Kecamatan Tambaksari, Kota Surabaya, Jawa Timur</p>
      </div>
    </div>
  );
};

export default HeroContent;
