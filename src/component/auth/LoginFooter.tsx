import { FC } from "react";
import Link from "next/link";

interface LoginFooterProps {
  mounted: boolean;
}

const LoginFooter: FC<LoginFooterProps> = ({ mounted }) => {
  return (
    <div className={`mt-6 text-center flex flex-col items-center smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
      <p className="text-sm text-gray-600 smooth-transition">
        Belum punya akun?{" "}
        <Link href="/register" className="text-green-600 hover:underline font-medium smooth-transition hover:text-green-800">
          Daftar
        </Link>
      </p>

      <div className="flex items-center gap-3 mt-10">
        <img
          src="/logo-upn.png"
          alt="Logo UB"
          className="w-8 h-8 object-contain smooth-transition hover:scale-110 flex-shrink-0"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = "none";
          }}
        />
        <img
          src="/logo-blu.png"
          alt="Logo FILKOM"
          className="w-auto h-5 object-contain smooth-transition hover:scale-110 flex-shrink-0"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = "none";
          }}
        />
        <img
          src="/logo-diktisaintek.png"
          alt="Logo Diktisaintek Berdampak"
          className="w-auto h-6 object-contain smooth-transition hover:scale-110 flex-shrink-0"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = "none";
          }}
        />
        <img
          src="/logo.png"
          alt="Logo MMD"
          className="w-8 h-8 object-contain smooth-transition hover:scale-110 flex-shrink-0"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      </div>
      <div className="text-center items-center mt-3">
        <p className="text-black font-medium text-[10px] md:text-[10px] mb-[2px] smooth-transition">Dikembangkan oleh KKN Kelompok 03 Kelurahan Rangkah</p>
        <p className="text-black/70 text-[10px] md:text-[10px] leading-relaxed smooth-transition">Kuliah Kerja Nyata SDGs Periode II Universitas Pembangunan Nasional "Veteran" Jawa Timur 2025</p>
      </div>
    </div>
  );
};

export default LoginFooter;
