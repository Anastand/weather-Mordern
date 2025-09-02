import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cityWeather } from "../services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
// Apple-like mapping of weather codes to icon + label
const codeToCondition = (code: number): { label: string; icon: string } => {
  if ([0].includes(code)) return { label: "Clear", icon: "☀️" };
  if ([1, 2, 3].includes(code)) return { label: "Cloudy", icon: "⛅" };
  if ([45, 48].includes(code)) return { label: "Foggy", icon: "🌫️" };
  if ([51, 53, 55, 61, 63, 65].includes(code))
    return { label: "Rain", icon: "🌧️" };
  if ([71, 73, 75, 77].includes(code)) return { label: "Snow", icon: "❄️" };
  if ([95, 96, 99].includes(code)) return { label: "Storm", icon: "⛈️" };
  return { label: "Unknown", icon: "❓" };
};

function Details() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<any>(() => {
    try {
      const raw = localStorage.getItem("searchedCityWeather");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

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
    } catch (error) {
      toast.error("Failed to fetch weather. Try again.");
      setError("Failed to fetch weather. Try again.");
    } finally {
      setLoading(false);
    }
  };
  const currentHour = new Date().getHours();
  const hourlyTimes = weather?.cityWeather?.hourly?.time || [];
  const hourlyTemps = weather?.cityWeather?.hourly?.temperature_2m || [];

  // Match current hour
  const currentHourIndex = hourlyTimes.findIndex(
    (t: string) => new Date(t).getHours() === currentHour
  );

  const currentTemp =
    currentHourIndex !== -1 ? hourlyTemps[currentHourIndex] : "-";

  useEffect(() => {
    const FIVE_MIN = 5 * 60 * 1000;
    if (weather && Date.now() - weather.fetchedAt > FIVE_MIN) {
      refreshWeather();
    }
  }, []);

  useEffect(() => {
    if (weather) {
      localStorage.setItem("searchedCityWeather", JSON.stringify(weather));
    }
  }, [weather]);

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
  if (
    !weather ||
    !weather.city ||
    !weather.city.name ||
    weather.city.name.toLowerCase() !== city.toLowerCase()
  ) {
    return (
      <div className="p-6 text-center">
        <p>
          Couldn’t find weather for <strong>{city}</strong>. Try again on{" "}
          <Link to="/" className="underline text-blue-600">
            Home
          </Link>
        </p>
      </div>
    );
  }

  // Hourly forecast
  const hourly =
    weather?.cityWeather?.hourly?.time?.map((t: string, i: number) => {
      const hour = new Date(t).getHours();
      const code = weather.cityWeather?.hourly?.weather_code?.[i] ?? 0;
      const cond = codeToCondition(code);
      return {
        hour: `${hour}:00`,
        temp: Math.round(weather.cityWeather?.hourly?.temperature_2m?.[i]),
        icon: cond.icon,
      };
    }) || [];

  // Daily forecast
  const daily =
    weather?.cityWeather?.daily?.time?.map((d: string, i: number) => {
      const cond = codeToCondition(
        weather.cityWeather?.daily?.weather_code?.[i] ?? 0
      );
      return {
        day: new Date(d).toLocaleDateString("en-US", { weekday: "short" }),
        min: Math.round(weather.cityWeather?.daily?.temperature_2m_min?.[i]),
        max: Math.round(weather.cityWeather?.daily?.temperature_2m_max?.[i]),
        icon: cond.icon,
      };
    }) || [];

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl space-y-8">
      {/* Top section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{weather.city.name}</h1>
        <Button onClick={refreshWeather} disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin w-4 h-4 mr-2" />
          ) : (
            "Refresh"
          )}
        </Button>
      </div>

      {/* Current Weather */}
      <Card className="mb-6 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-6">
          <h2 className="text-xl font-semibold mb-2">Current Weather</h2>
          <p className="text-6xl font-bold">{currentTemp}°C</p>
          <p className="text-gray-500 mt-2">
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
        <h2 className="text-lg font-semibold mb-3">Hourly Forecast</h2>
        <div className="flex overflow-x-auto gap-6 bg-gray-50 p-4 rounded-xl">
          {hourly
            .slice(0, 24)
            .map(
              (h: { hour: string; temp: number; icon: string }, i: number) => (
                <div
                  key={i}
                  className="flex flex-col items-center min-w-[60px] text-center"
                >
                  <p className="text-sm text-gray-600">{h.hour}</p>
                  <p className="text-2xl">{h.icon}</p>
                  <p className="text-lg font-medium">{h.temp}°</p>
                </div>
              )
            )}
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">7-Day Forecast</h2>
        <div className="space-y-3">
          {daily.map(
            (
              d: { day: string; min: number; max: number; icon: string },
              i: number
            ) => (
              <Card key={i} className="shadow-sm">
                <CardContent className="flex items-center justify-between p-4">
                  {/* Day */}
                  <p className="w-16 font-medium">{d.day}</p>

                  {/* Icon */}
                  <span className="text-2xl">{d.icon}</span>

                  {/* Temp Range */}
                  <div className="flex-1 mx-4 relative h-2">
                    {/* gradient bar */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500" />

                    {/* min-max highlight */}
                    <div
                      className="absolute top-0 h-2 rounded-full bg-white/70"
                      style={{
                        left: `${((d.min + 20) / 60) * 100}%`,
                        width: `${((d.max - d.min) / 60) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Min/Max */}
                  <p className="w-28 text-right font-medium">
                    {d.min}° / <span className="font-bold">{d.max}°</span>
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Details;
