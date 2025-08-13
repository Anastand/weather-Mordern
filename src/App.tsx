import { useEffect, useState } from "react";
import "./App.css";
import { cityWeather, fetchViaGeocoding } from "./services/api";

function App() {
  const [searhCity, setSearhCity] = useState<any | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<null>(null);
  const [searchedterm, SetSearchedTerm] = useState<any>("");

  // this function fetches the data of the searched city
  const geocode = async () => {
    try {
      const geocodeCity = await fetchViaGeocoding(searchedterm);
      const checkvalue = geocodeCity;
      console.log(checkvalue.name);
      setSearhCity(checkvalue);
    } catch (error) {
      setError(error);
      console.log(
        `the func has failed to get geocode with following error : ${error}`
      );
    }
  };

  useEffect(() => {
    // this works to get long and lat data from the searched city as to display weather
    console.log("here");
    if (!searhCity) return;
    const lati = Number(searhCity.latitude);
    const longi = Number(searhCity.longitude);
    const getWeather = async (lati, longi) => {
      try {
        const response = await cityWeather(lati, longi);
        const checkv2 = response;
        console.log(checkv2);
      } catch (error) {
        setError(error);
        console.log(
          `the func has failed to get geocode with following error : ${error}`
        );
      }
    };
    console.log(longi);
    console.log(lati);
    getWeather(lati, longi);
  }, [searhCity]);

  const handelCitySearch = (e) => {
    e.preventDefault();
    if (!searchedterm) return;
    try {
      geocode();
    } catch (error) {
      setError(error);
      console.log(
        `the func has failed to get geocode with following error : ${error}`
      );
    }
  };

  return (
    <>
      <div>
        <form type="submit" onSubmit={handelCitySearch}>
          <input
            type="text"
            placeholder="Enter City"
            value={searchedterm}
            onChange={(e) => SetSearchedTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <h1 className="text-2xl">hellow orld </h1>
      </div>
    </>
  );
}

export default App;
