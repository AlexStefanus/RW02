import { IconType } from "react-icons";
import { 
  FiSun, 
  FiCloud, 
  FiCloudRain, 
  FiCloudSnow, 
  FiCloudDrizzle,
  FiWind
} from "react-icons/fi";
import { 
  WiThunderstorm, 
  WiDaySunny, 
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloudy,
  WiRain,
  WiSnow,
  WiFog
} from "react-icons/wi";

export const useWeatherIcon = () => {
  const getWeatherIcon = (iconCode: string, description: string): IconType => {
    if (!iconCode) return FiSun;

    const descLower = description?.toLowerCase() || "";
    
    // Thunderstorm
    if (iconCode.startsWith("11")) return WiThunderstorm;
    
    // Drizzle
    if (iconCode.startsWith("09") || iconCode.startsWith("10")) {
      if (descLower.includes("light")) return FiCloudDrizzle;
      return WiRain;
    }
    
    // Rain
    if (iconCode.startsWith("10") || iconCode.startsWith("09")) return FiCloudRain;
    
    // Snow
    if (iconCode.startsWith("13")) return FiCloudSnow;
    
    // Atmosphere (fog, mist, etc)
    if (iconCode.startsWith("50")) return WiFog;
    
    // Clear
    if (iconCode === "01d") return WiDaySunny;
    if (iconCode === "01n") return WiNightClear;
    
    // Few clouds
    if (iconCode === "02d") return WiDayCloudy;
    if (iconCode === "02n") return WiNightAltCloudy;
    
    // Scattered/broken/overcast clouds
    if (iconCode.startsWith("03") || iconCode.startsWith("04")) return WiCloudy;
    
    return FiSun;
  };

  return { getWeatherIcon };
};
