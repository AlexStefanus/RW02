import { FiUsers, FiHome, FiSun } from "react-icons/fi";
import { usePublicStats } from "@/hooks/usePublicStats";
import { useWeather } from "@/hooks/useWeather";
import { useWeatherIcon } from "@/hooks/useWeatherIcon";

export const useInfoCardsData = () => {
  const { totalArticles, activeAnnouncements, loading } = usePublicStats();
  const { weather, loading: weatherLoading } = useWeather();
  const { getWeatherIcon } = useWeatherIcon();

  const cardData = [
    {
      icon: FiUsers,
      title: "Jumlah Penduduk",
      value: "3594",
      subtitle: "Jiwa",
    },
    {
      icon: FiHome,
      title: "Jumlah RT",
      value: "4",
      subtitle: "Rukun Tetangga",
    },
    {
      icon: weather ? getWeatherIcon(weather.icon, weather.description) : FiSun,
      title: "Cuaca Hari Ini",
      value: weatherLoading ? "..." : weather ? `${weather.temperature}°C` : "26°C",
      subtitle: weatherLoading ? "Memuat..." : weather ? weather.description : "Partly Cloudy",
    },
  ];

  return { cardData, loading, weatherLoading };
};
