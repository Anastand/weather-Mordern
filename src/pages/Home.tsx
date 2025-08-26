interface GeocodeResult {
  latitude: number;
  longitude: number;
  name: string;
}
// interface WeatherData {
//   hourly: { temperature_2m: number[] };
//   daily: { weather_code: number[] };
// }
import React, { useEffect, useState } from "react";
import { cityWeather, fetchViaGeocoding } from "../services/api";
import SearchForm from "../components/SearchForm";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate(); // cant declare in any block
  const [CitySearched, setCitySearched] = useState<GeocodeResult | null>(null);
  // const [cityweatherData, setCityWeatherData] = useState<WeatherData | null>(
  //   null
  // );
  const [error, setError] = useState<string | null>(null);
  const [searchedterm, SetSearchedTerm] = useState<any>("");

  // this function fetches the data of the searched city
  const geocode = async () => {
    try {
      const geocodeCity = await fetchViaGeocoding(searchedterm);
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
        navigate(`/detail?city=${searchedterm}`);
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
    </>
  );
}

export default Home;
