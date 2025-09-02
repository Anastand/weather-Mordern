import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cityWeather, fetchViaGeocoding } from "../services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Moon, Sun } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { useTheme } from "../context/ThemeProvider";

// Weather codes -> label, icon, background gradient, text color
const codeToCondition = (
  code: number,
  isDay: boolean
): { label: string; icon: string; bg: string; text: string; card: string } => {
  if ([0].includes(code))
    return {
      label: "Clear",
      icon: isDay ? "☀️" : "🌙",
      bg: isDay ? "from-blue-400 to-yellow-200" : "from-gray-900 to-blue-900",
      text: isDay ? "text-gray-900" : "text-white",
      card: isDay ? "bg-black/10" : "bg-white/20",
    };

  if ([1, 2, 3].includes(code))
    return {
      label: "Cloudy",
      icon: isDay ? "⛅" : "☁️",
      bg: "from-gray-400 to-gray-600",
      text: "text-white",
      card: "bg-white/20",
    };

  if ([45, 48].includes(code))
    return {
      label: "Foggy",
      icon: "🌫️",
      bg: "from-gray-300 to-gray-500",
      text: "text-gray-900",
      card: "bg-black/10",
    };

  if ([51, 53, 55, 61, 63, 65].includes(code))
    return {
      label: "Rain",
      icon: "🌧️",
      bg: "from-blue-600 to-gray-700",
      text: "text-white",
      card: "bg-white/20",
    };

  if ([71, 73, 75, 77].includes(code))
    return {
      label: "Snow",
      icon: "❄️",
      bg: "from-blue-200 to-white",
      text: "text-gray-900",
      card: "bg-black/10",
    };

  if ([95, 96, 99].includes(code))
    return {
      label: "Storm",
      icon: "⛈️",
      bg: "from-gray-800 to-black",
      text: "text-white",
      card: "bg-white/20",
    };

  return {
    label: "Unknown",
    icon: "❓",
    bg: "from-slate-200 to-slate-400",
    text: "text-gray-900",
    card: "bg-black/10",
  };
};

function Details() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingCity, setFetchingCity] = useState(true);

  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { theme, toggleTheme } = useTheme();

  const [weather, setWeather] = useState<any>(() => {
    try {
      const raw = localStorage.getItem("searchedCityWeather");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const isFav = weather?.city?.name && favorites.includes(weather.city.name);
  const [searchedParm] = useSearchParams();
  const city = searchedParm.get("city");

  const refreshWeather = async () => {
    if (!weather) return;
    setLoading(true);

    try {
      const response = await cityWeather(
        Number(weather.city.latitude),
        Number(weather.city.longitude)
      );
      const newdata = {
        city: weather.city,
        cityWeather: response,
        fetchedAt: Date.now(),
      };
      setWeather(newdata);
      toast.success(`Weather updated for ${weather.city.name}`);
    } catch {
      toast.error("Failed to fetch weather. Try again.");
      setError("Failed to fetch weather. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch weather when city changes
  useEffect(() => {
    if (!city) return;

    const saved = localStorage.getItem("searchedCityWeather");
    const parsed = saved ? JSON.parse(saved) : null;

    if (parsed && parsed.city?.name.toLowerCase() === city.toLowerCase()) {
      setWeather(parsed);
      setFetchingCity(false);
      return;
    }

    (async () => {
      try {
        setFetchingCity(true);
        const geoRes = await fetchViaGeocoding(city);
        if (!geoRes) throw new Error("City not found");

        const response = await cityWeather(
          Number(geoRes.latitude),
          Number(geoRes.longitude)
        );

        const newData = {
          city: geoRes,
          cityWeather: response,
          fetchedAt: Date.now(),
        };

        setWeather(newData);
        localStorage.setItem("searchedCityWeather", JSON.stringify(newData));
      } catch {
        setError("Couldn’t fetch weather for " + city);
      } finally {
        setFetchingCity(false);
      }
    })();
  }, [city]);

  const currentHour = new Date().getHours();
  const isDayNow = currentHour >= 6 && currentHour < 18;

  const hourlyTimes = weather?.cityWeather?.hourly?.time || [];
  const hourlyTemps = weather?.cityWeather?.hourly?.temperature_2m || [];
  const hourlyCodes = weather?.cityWeather?.hourly?.weather_code || [];

  const currentHourIndex = hourlyTimes.findIndex(
    (t: string) => new Date(t).getHours() === currentHour
  );
  const currentTemp =
    currentHourIndex !== -1 ? hourlyTemps[currentHourIndex] : "-";

  const currentCode =
    weather?.cityWeather?.hourly?.weather_code?.[currentHourIndex] ?? 0;
  const condition = codeToCondition(currentCode, isDayNow);

  // Loader
  if (fetchingCity) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-slate-200 to-slate-400">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="ml-4 text-lg text-gray-700">Fetching weather...</p>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="p-6 text-center">
        <p>
          No city selected. Please visit{" "}
          <Link to="/" className="underline text-blue-600">
            Home
          </Link>
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error}</p>
        <Link to="/" className="underline text-blue-600">
          Go back Home
        </Link>
      </div>
    );
  }

  // Hourly forecast
  const hourly =
    weather?.cityWeather?.hourly?.time?.map((t: string, i: number) => {
      const hour = new Date(t).getHours();
      const isDay = hour >= 6 && hour < 18;
      const code = hourlyCodes?.[i] ?? 0;
      const cond = codeToCondition(code, isDay);
      return {
        hour: `${hour}:00`,
        temp: Math.round(hourlyTemps?.[i]),
        icon: cond.icon,
      };
    }) || [];

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-b ${condition.bg} flex items-start justify-center`}
    >
      <div
        className={`container mx-auto px-4 pt-12 pb-6 max-w-3xl space-y-8 ${condition.text}`}
      >
        {/* Top section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link to="/" className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
              {weather.city.name}
            </h1>
          </Link>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <Button
              onClick={refreshWeather}
              disabled={loading}
              className={`${
                condition.text.includes("white")
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "bg-black/20 text-black hover:bg-black/30"
              } backdrop-blur-md border border-white/30 text-sm sm:text-base`}
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : (
                "Refresh"
              )}
            </Button>

            <Button
              variant={isFav ? "destructive" : "default"}
              onClick={() =>
                isFav
                  ? removeFavorite(weather.city.name)
                  : addFavorite(weather.city.name)
              }
              className={`${
                condition.text.includes("white")
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "bg-black/20 text-black hover:bg-black/30"
              } backdrop-blur-md border border-white/30 text-sm sm:text-base`}
            >
              {isFav ? "Remove Fav" : "Add Fav"}
            </Button>

            <Button
              variant="outline"
              onClick={toggleTheme}
              className={`flex items-center gap-2 ${
                condition.text.includes("white")
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "bg-black/20 text-black hover:bg-black/30"
              } backdrop-blur-md border border-white/30 text-sm sm:text-base`}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              {theme === "light" ? "Dark" : "Light"}
            </Button>
          </div>
        </div>

        {/* Current Weather */}
        <Card
          className={`mb-6 shadow-lg ${condition.card} backdrop-blur-lg border border-white/20`}
        >
          <CardContent className="flex flex-col items-center justify-center py-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              Current Weather
            </h2>
            <p className="text-5xl sm:text-6xl font-bold">{currentTemp}°C</p>
            <p className="mt-2 text-sm sm:text-base opacity-80">
              {weather.city.name} •{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </CardContent>
        </Card>

        {/* Hourly Forecast */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold mb-3">
            Hourly Forecast
          </h2>
          <div
            className={`flex overflow-x-auto gap-4 sm:gap-6 ${condition.card} backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/20`}
          >
            {hourly
              .slice(0, 24)
              .map(
                (
                  h: { hour: string; temp: number; icon: string },
                  i: number
                ) => (
                  <div
                    key={i}
                    className="flex flex-col items-center min-w-[50px] sm:min-w-[60px] text-center"
                  >
                    <p className="text-xs sm:text-sm">{h.hour}</p>
                    <p className="text-lg sm:text-2xl">{h.icon}</p>
                    <p className="text-sm sm:text-lg font-medium">{h.temp}°</p>
                  </div>
                )
              )}
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="mt-6 sm:mt-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            7-Day Forecast
          </h2>
          <div className="space-y-3">
            {weather?.cityWeather?.daily?.time?.map((d: string, i: number) => {
              const dayCode =
                weather.cityWeather?.daily?.weather_code?.[i] ?? 0;
              const cond = codeToCondition(dayCode, true);
              const min = Math.round(
                weather.cityWeather?.daily?.temperature_2m_min?.[i]
              );
              const max = Math.round(
                weather.cityWeather?.daily?.temperature_2m_max?.[i]
              );
              return (
                <Card
                  key={i}
                  className={`shadow-sm ${cond.card} backdrop-blur-md border border-white/10`}
                >
                  <CardContent className="flex items-center justify-between p-3 sm:p-4 text-sm sm:text-base">
                    <p className="w-14 sm:w-16 font-medium">
                      {new Date(d).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </p>
                    <span className="text-xl sm:text-2xl">{cond.icon}</span>
                    <div className="flex-1 mx-3 sm:mx-4 relative h-2">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500 opacity-60" />
                      <div
                        className="absolute top-0 h-2 rounded-full bg-white/80"
                        style={{
                          left: `${((min + 20) / 60) * 100}%`,
                          width: `${((max - min) / 60) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="w-24 sm:w-28 text-right font-medium">
                      {min}° / <span className="font-bold">{max}°</span>
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
