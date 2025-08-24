interface GeocodeResult {
  latitude: number;
  longitude: number;
  name: string;
}
interface WeatherData {
  hourly: { temperature_2m: number[] };
  daily: { weather_code: number[] };
}
import React, { useEffect, useState } from "react";
import { cityWeather, fetchViaGeocoding } from "../services/api";
import SearchForm from "../components/SearchForm";

function Home() {
  const [searhCity, setSearhCity] = useState<GeocodeResult | null>(null);
  const [cityweatherData, setCityWeatherData] = useState<WeatherData | null>();
  const [error, setError] = useState<string | null>(null);
  const [searchedterm, SetSearchedTerm] = useState<any>("");

  // this function fetches the data of the searched city
  const geocode = async () => {
    try {
      const geocodeCity = await fetchViaGeocoding(searchedterm);
      const checkvalue = geocodeCity;
      console.log("here form geocode function ");
      console.log(checkvalue);
      console.log(checkvalue.name);
      setSearhCity(checkvalue);
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
    if (!searhCity) return;
    const lati = Number(searhCity.latitude);
    const longi = Number(searhCity.longitude);
    const getWeather = async (lati: number, longi: number) => {
      try {
        const response = await cityWeather(lati, longi);
        const checkv2 = response;
        console.log(checkv2);
        setCityWeatherData(checkv2);
      } catch (error: any) {
        setError("City not found or API error in getting weather details");
        console.log(
          `the func has failed to get geocode with following error : ${error.message}`
        );
      }
    };
    console.log(longi);
    console.log(lati);
    getWeather(lati, longi);
  }, [searhCity]);

  const handelCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedterm) return;
    try {
      geocode();
    } catch (error: any) {
      setError("error in handling search");
      console.log(
        `the func has failed to handle search with following error : ${error.message}`
      );
    }
  };

  return (
    <>
        <SearchForm onSubmit={handelCitySearch}>
          <input
            type="text"
            placeholder="Enter City"
            value={searchedterm}
            onChange={(e) => SetSearchedTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </SearchForm>
        {/* error handling */}
        {error && (
          <div>
            <p>we suffered from an error ${error} pls reload the page</p>
          </div>
        )}
        {cityweatherData && (
          <div>
            <h1>Weather for {searhCity?.name || "Unknown"}</h1>
            <p>
              Temperature:{" "}
              {cityweatherData.hourly?.temperature_2m?.[0] || "N/A"}°C
            </p>
            <p>
              Weather Code: {cityweatherData?.daily?.weather_code?.[0] || "N/A"}
            </p>
          </div>
        )}
    </>
  );
}

export default Home;
