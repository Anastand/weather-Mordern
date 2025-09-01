import type { GeoResult, GeocodeResult } from "../types";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";

import {
  cityWeather,
  fetchViaGeocoding,
  SuggestionCall,
} from "../services/api";
import SearchForm from "../components/SearchForm";
import { useNavigate } from "react-router-dom";
import SuggestionList from "../components/SuggestionList";

function Home() {
  const navigate = useNavigate(); // cant declare in any block
  const [CitySearched, setCitySearched] = useState<GeocodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, Setquery] = useState<string>("");
  // ---
  const [suggestions, setsuggestions] = useState<GeoResult[]>([]);
  const [loadingSug, setLoadingSug] = useState(false);
  const [sugError, setSugError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [selected, setSelected] = useState<boolean>(false);

  // suggestion effect
  useEffect(() => {
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
      console.log("API call for", query);
      setLoadingSug(true);
      const suggestionList = await SuggestionCall(query);
      setsuggestions(suggestionList);
      setLoadingSug(false);
      console.log(suggestionList);
    }, 200);
    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  // this function fetches the data of the searched city
  const geocode = async () => {
    try {
      const geocodeCity = await fetchViaGeocoding(query);
      const cityInfo = geocodeCity;
      console.log("here form geocode function ");
      console.log(cityInfo);
      console.log(cityInfo.name);
      console.log("end of geocode func");
      setCitySearched(cityInfo);
    } catch (error: any) {
      setError("error while obtaining you longitude and latitude");
      console.log(
        `the func has failed to get geocode with following error : ${error.message}`
      );
    }
  };

  useEffect(() => {
    // this works to get long and lat data from the searched city as to display weather
    console.log("here from use effect with lat and long");
    if (!CitySearched) return;
    const lati = Number(CitySearched.latitude);
    const longi = Number(CitySearched.longitude);
    const getWeather = async (lati: number, longi: number) => {
      try {
        const response = await cityWeather(lati, longi);
        const weatherData = response;
        console.log(weatherData);
        if (!weatherData) return;
        localStorage.setItem(
          "searchedCityWeather",
          JSON.stringify({
            city: CitySearched,
            cityWeather: weatherData,
            fetchedAt: Date.now(),
          })
        );
        navigate(`/detail?city=${encodeURIComponent(CitySearched.name)}`);
      } catch (error: any) {
        setError("City not found or API error in getting weather details");
        console.log(
          `the func has failed to get geocode with following Error : {error.message}`
        );
      }
    };
    console.log(longi);
    console.log(lati);
    getWeather(lati, longi);
  }, [CitySearched]);

  const handelCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    try {
      geocode();
    } catch (error: any) {
      setError("error in handling search");
      console.log(
        `the func has failed to handle search with following error : ${error.message}`
      );
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
    <>
      <SearchForm onSubmit={handelCitySearch}>
        <Input
          type="text"
          placeholder="Enter City"
          value={query}
          onChange={(e) => {
            Setquery(e.target.value);
            setSelected(false);
          }}
          onKeyDown={(e) => handleKeyPress(e)}
        />
        {/* <button type="submit">Search</button> */}
        <Button type="submit">Search</Button>
      </SearchForm>
      {/* error handling */}
      {error && (
        <div>
          <p>we suffered from an error {error}. Please reload the page.</p>
        </div>
      )}
      {loadingSug && <div>loading....</div>}
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
        }}
      />
    </>
  );
}

export default Home;
