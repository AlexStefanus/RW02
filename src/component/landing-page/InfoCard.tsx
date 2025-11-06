import React from "react";
import { IconType } from "react-icons";

interface InfoCardProps {
  icon: IconType;
  title: string;
  value: string;
  subtitle: string;
  index: number;
  mounted: boolean;
}

const InfoCard = ({ icon: Icon, title, value, subtitle, index, mounted }: InfoCardProps) => {
  return (
    <div
      key={index}
      className={`text-center md:text-left smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="mb-4 md:mb-6 flex justify-center md:justify-start animate-float">
        <Icon size={40} className="text-[#00a753] md:w-12 md:h-12 smooth-transition hover:scale-110" />
      </div>

      <h3 className="text-lg md:text-xl font-semibold text-[#00a753] mb-3 md:mb-4 smooth-transition">
        {title}
      </h3>

      <div className="text-3xl md:text-4xl font-bold text-[#00a753] mb-2 smooth-transition hover:scale-105">
        {value}
      </div>

      <p className="text-sm text-[#00a753] mb-1 smooth-transition">{subtitle}</p>
    </div>
  );
};

export default InfoCard;
