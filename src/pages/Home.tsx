import type { GeoResult, GeocodeResult } from "../types";
import React, { useEffect, useState } from "react";
import {
  cityWeather,
  fetchViaGeocoding,
  SuggestionCall,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import SuggestionList from "../components/SuggestionList";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// theme toggle
import { useTheme } from "../context/ThemeProvider";
import { Moon, Sun } from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const [CitySearched, setCitySearched] = useState<GeocodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, Setquery] = useState<string>("");

  const [suggestions, setsuggestions] = useState<GeoResult[]>([]);
  const [loadingSug, setLoadingSug] = useState(false);
  const [sugError, setSugError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [selected, setSelected] = useState<boolean>(false);

  const { theme, toggleTheme } = useTheme();

  // suggestion effect
  useEffect(() => {
    if (selected) return;

    setsuggestions([]);
    setSugError(null);

    if (query.trim().length <= 0) {
      return;
    } else if (query.trim().length < 3) {
      setsuggestions([]);
      setSugError("Type at least 3 letters");
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSug(true);
      const suggestionList = await SuggestionCall(query);
      setsuggestions(suggestionList);
      setLoadingSug(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, selected]);

  // fetch weather after selecting a city
  useEffect(() => {
    if (!CitySearched) return;
    const lati = Number(CitySearched.latitude);
    const longi = Number(CitySearched.longitude);
    const getWeather = async () => {
      try {
        const response = await cityWeather(lati, longi);
        localStorage.setItem(
          "searchedCityWeather",
          JSON.stringify({
            city: CitySearched,
            cityWeather: response,
            fetchedAt: Date.now(),
          })
        );
        navigate(`/detail?city=${encodeURIComponent(CitySearched.name)}`);
      } catch (error: any) {
        setError("City not found or API error in getting weather details");
      }
    };
    getWeather();
  }, [CitySearched]);

  const handelCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    try {
      fetchViaGeocoding(query).then(setCitySearched);
    } catch (error: any) {
      setError("error in handling search");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      setActiveIndex(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const selectedCity = suggestions[activeIndex];
      Setquery(selectedCity.name);
      setCitySearched(selectedCity);
      setsuggestions([]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground px-4 transition-colors">
      <Card className="w-full max-w-lg shadow-lg bg-card text-card-foreground border border-border">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-center text-3xl font-bold w-full">
            🌤️ Weather App
          </CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="absolute right-4 top-4"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handelCitySearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city-input">Search Weather</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  id="city-input"
                  placeholder="Enter City"
                  value={query}
                  autoComplete="off"
                  onChange={(e) => {
                    Setquery(e.target.value);
                    setSelected(false);
                  }}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
                <Button type="submit" className="shrink-0">
                  Search
                </Button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-3 text-red-600 text-sm bg-red-50 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-800 rounded-md p-2">
              {error}
            </div>
          )}

          <div className="mt-2">
            <SuggestionList
              suggopt={suggestions}
              selected={selected}
              sugError={sugError}
              loading={loadingSug}
              activeIndex={activeIndex}
              query={query}
              onselect={(city) => {
                Setquery(city.name);
                setCitySearched(city);
                setSelected(true);
                setsuggestions([]);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Home;
