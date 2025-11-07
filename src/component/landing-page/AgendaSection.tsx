"use client";

import React, { useState, useEffect } from "react";
import { useNationalHolidays } from "@/hooks/useNationalHolidays";
import { getUpcomingAgendas, type Agenda } from "@/lib/agendaService";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface AgendaItem {
  id: string | number;
  title: string;
  date: string;
  time: string;
  category: string;
  color: string;
  isToday: boolean;
  type: string;
  description?: string;
}

const AgendaSection = () => {
  const [mounted, setMounted] = useState(false);
  const { holidays, loading: holidaysLoading, error } = useNationalHolidays();
  const [customAgendas, setCustomAgendas] = useState<Agenda[]>([]);
  const [agendasLoading, setAgendasLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadCustomAgendas();
  }, []);

  const loadCustomAgendas = async () => {
    try {
      setAgendasLoading(true);
      const agendas = await getUpcomingAgendas();
      setCustomAgendas(agendas.slice(0, 5));
    } catch (error) {
      console.error("Error loading custom agendas:", error);
    } finally {
      setAgendasLoading(false);
    }
  };

  const formatDate = (dateString: string, daysFromToday: number) => {
    try {
      const date = new Date(dateString);

      if (daysFromToday === 0) {
        return "Hari ini";
      } else if (daysFromToday === 1) {
        return "Besok";
      } else if (daysFromToday === -1) {
        return "Kemarin";
      } else if (daysFromToday > 0 && daysFromToday <= 7) {
        return format(date, "EEEE", { locale: idLocale });
      } else {
        return format(date, "dd MMMM yyyy", { locale: idLocale });
      }
    } catch (error) {
      return dateString;
    }
  };

  const getCategoryColor = (type: string, isToday: boolean) => {
    if (isToday) {
      return "bg-red-600 hover:bg-red-700";
    }

    return "bg-[#00a753] hover:bg-[#008c45]";
  };

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case "national":
        return "Hari Nasional";
      case "religious":
        return "Hari Keagamaan";
      case "regional":
        return "Hari Regional";
      default:
        return "Agenda";
    }
  };

  const calculateDaysFromToday = (dateString: string): number => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isDateToday = (dateString: string): boolean => {
    const today = new Date();
    const targetDate = new Date(dateString);
    return today.toDateString() === targetDate.toDateString();
  };

  const formatTime = (dateString: string): string => {
    try {
      return format(new Date(dateString), "HH:mm", { locale: idLocale });
    } catch {
      return "";
    }
  };

  const customAgendaItems: AgendaItem[] = customAgendas.map(
    (agenda): AgendaItem => {
      const daysFromToday = calculateDaysFromToday(agenda.date);
      const isToday = isDateToday(agenda.date);
      return {
        id: `custom-${agenda.id}`,
        title: agenda.title,
        date: formatDate(agenda.date, daysFromToday),
        time: formatTime(agenda.date),
        category: "Agenda RW",
        color: isToday ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600",
        isToday,
        type: "custom",
        description: agenda.description,
      };
    }
  );

  const holidayItems: AgendaItem[] = holidays.map(
    (holiday, index): AgendaItem => ({
      id: `holiday-${index}`,
      title: holiday.name,
      date: formatDate(holiday.date, holiday.daysFromToday),
      time: "",
      category: getCategoryLabel(holiday.type),
      color: getCategoryColor(holiday.type, holiday.isToday),
      isToday: holiday.isToday,
      type: holiday.type,
      description: holiday.description,
    })
  );

  const agendaItems: AgendaItem[] = [...customAgendaItems, ...holidayItems].slice(0, 6);

  return (
    <section className={`py-12 md:py-16 bg-gray-50 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          <div className={`lg:col-span-2 smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6 smooth-transition">Agenda RW 02 Rangkah</h2>
            <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg leading-relaxed smooth-transition">
              Tetap terhubung dengan berbagai kegiatan dan pengumuman penting di RW 02 Rangkah. Lihat jadwal hari ini, besok, maupun agenda yang akan datang informasi, kegiatan dan pengumuman informatif.
            </p>
          </div>


          <div className={`lg:col-span-1 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 smooth-transition">Agenda & Hari Besar</h3>

              {(holidaysLoading || agendasLoading) ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-gray-200 animate-pulse rounded-lg p-4 h-20" />
                  ))}
                </div>
              ) : error ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">Tidak dapat memuat hari besar nasional.</p>
                </div>
              ) : agendaItems.length === 0 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">Tidak ada data hari besar nasional yang tersedia.</p>
                </div>
              ) : null}

              {agendaItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`${item.color} text-white rounded-lg p-4 smooth-transition cursor-pointer hover-lift ${mounted ? "smooth-reveal" : "animate-on-load"} ${item.isToday ? "ring-2 ring-yellow-300 ring-opacity-50" : ""}`}
                  style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider smooth-transition">
                      {item.category}
                      {item.isToday && <span className="ml-2 px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">HARI INI</span>}
                    </span>
                    {item.time && <span className="text-xs smooth-transition">{item.time}</span>}
                  </div>
                  <h4 className="font-semibold mb-1 text-sm line-clamp-2 smooth-transition hover:text-yellow-200">{item.title}</h4>
                  <p className="text-xs text-blue-200 smooth-transition">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;

