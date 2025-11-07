import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  code: string;
}

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const capitalizeWords = (text: string): string => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const lat = -7.2469;
        const lon = 112.7654;
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

        console.log("API Key status:", apiKey ? `Found (${apiKey.substring(0, 8)}...)` : "NOT FOUND");

        if (!apiKey) {
          console.error("OpenWeather API key is not configured");
          throw new Error("API key not configured");
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=id`;
        console.log("Fetching weather from:", url.replace(apiKey, "***"));

        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Weather API error:", response.status, errorData);
          throw new Error(`Weather API error: ${response.status} - ${errorData.message || "Unknown error"}`);
        }

        const data = await response.json();
        console.log("Weather data received:", data);

        setWeather({
          temperature: Math.round(data.main.temp),
          description: capitalizeWords(data.weather[0].description),
          icon: data.weather[0].icon,
          code: data.weather[0].id.toString(),
        });
        setError(null);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch weather");
        setWeather({
          temperature: 28,
          description: "Cerah berawan",
          icon: "02d",
          code: "802",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { weather, loading, error };
};
