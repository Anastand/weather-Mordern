import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import refreshIcon from "../assets/Refresh CCW Alt 2 Icon.svg";
import { cityWeather } from "../services/api";

function Details() {
  const RawstoredValue = localStorage.getItem("searchedCityWeather");
  const storedValue = RawstoredValue ? JSON.parse(RawstoredValue) : null;
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState(storedValue);
  const [searchedParm] = useSearchParams();
  const city = searchedParm.get("city");
  const FIVE_MIN = 5 * 60 * 1000;

  const refreshWeather = () => {
    let lati = Number(storedValue.city.latitude);
    let longi = Number(storedValue.city.longitude);
    const weatherResponse = async () => {
      try {
        const response = await cityWeather(lati, longi);
        localStorage.setItem(
          "searchedCityWeather",
          JSON.stringify({
            city: storedValue.city,
            cityWeather: response,
            fetchedAt: Date.now(),
          })
        );
        setWeather(response);
        console.log(response);
      } catch (error: any) {
        setError("City not found or API error in getting weather details");
        console.log(
          `the func has failed to get geocode with following Error : {error.message}`
        );
      }
    };
    weatherResponse();
  };
  useEffect(() => {
    if (storedValue && Date.now() - storedValue.fetchedAt > FIVE_MIN) {
      refreshWeather();
    }
  }, []);

  if (!city) {
    return (
      <div>
        {
          <div>
            <p>
              You Dont Have a city selected pls vist <Link to="/"> Home </Link>{" "}
              and select a city
            </p>
          </div>
        }
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p className="text-red-500">{error}</p>
        <Link to="/">Go back Home</Link>
      </div>
    );
  }
  if (
    !storedValue ||
    !storedValue.city ||
    storedValue.city.name.toLowerCase() !== city.toLowerCase()
  ) {
    return (
      <div>
        <p>
          Couldn't find weather for <strong>{city}</strong>. Try searching again
          from <Link to="/">Home</Link>.
        </p>
      </div>
    );
  }
  return (
    <div>
      <div>
        <p>
          Weather for <strong>{storedValue.city.name}</strong> is:{" "}
          {storedValue.cityWeather.hourly.temperature_2m[0]}°C
        </p>
        <button className="outline bg-sky-200 active:bg-sky-700" onClick={refreshWeather} >
          {/* <img src={refreshIcon} alt="refresh" width={24} height={24} /> */}
          refresh
        </button>
      </div>
    </div>
  );
}

export default Details;
