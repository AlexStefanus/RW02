import React from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc: string;
  title: string;
  subtitle: string;
  mounted?: boolean;
}

const AuthLayout = ({ children, imageSrc, title, subtitle, mounted = true }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      <div className={`hidden lg:flex lg:w-1/2 relative smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
        <div
          className="absolute inset-0 bg-cover bg-center smooth-transition"
          style={{
            backgroundImage: `url('${imageSrc}')`,
          }}
        />

        <div className="absolute inset-0 bg-[#1226459e] smooth-transition"></div>

        <div className={`relative z-10 flex flex-col justify-start items-start p-8 text-white w-full smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
          <div className={`mb-4 mt-4 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
            <Link href="/" className="flex items-center mb-6 group cursor-pointer">
              <img
                src="/logo.png"
                alt="RW 02 Rangkah Logo"
                className="w-14 h-14 object-contain smooth-transition group-hover:scale-110"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  const svgElement = target.nextElementSibling as HTMLElement;
                  target.style.display = "none";
                  if (svgElement) {
                    svgElement.style.display = "block";
                  }
                }}
              />
              <div className="pl-2 smooth-transition">
                <h2 className="text-lg font-bold text-white smooth-transition group-hover:text-green-200">RW 02 Rangkah</h2>
                <p className="text-sm text-green-200 smooth-transition">Panel Admin</p>
              </div>
            </Link>
          </div>

          <div className={`max-w-sm smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}>
            <h1 className="text-2xl font-semibold mb-4 leading-tight text-white smooth-transition">{title}</h1>
          </div>
        </div>
      </div>

      <div className={`w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
        <div className={`w-full max-w-sm smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
