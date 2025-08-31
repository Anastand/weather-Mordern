import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
// import refreshIcon from "../assets/Refresh CCW Alt 2 Icon.svg";
import { cityWeather } from "../services/api";

function Details() {
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState(() => {
    try {
      const raw = localStorage.getItem("searchedCityWeather");
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  });
  const [searchedParm] = useSearchParams();
  const city = searchedParm.get("city");

  const refreshWeather = async () => {
    if (!weather) return;
    let lati = Number(weather.city.latitude);
    let longi = Number(weather.city.longitude);
    try {
      const response = await cityWeather(lati, longi);
      const newdata = {
        city: weather.city,
        cityWeather: response,
        fetchedAt: Date.now(),
      };
      setWeather(newdata)
      console.log(newdata);
    } catch (error: any) {
      setError("City not found or API error in getting weather details");
      console.log(
        `the func has failed to get geocode with following Error : {error.message}`
      );
    }
  };
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
    !weather ||
    !weather.city ||
    !weather.city.name ||
    !city ||
    weather.city.name.toLowerCase() !== city.toLowerCase()
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
      {weather && (
        <div>
          <p>
            Weather for <strong>{weather?.city?.name ?? "-"}</strong> is:{" "}
            {weather?.cityWeather?.hourly?.temperature_2m?.[0] ?? "-"}°C
          </p>
          <button
            className="outline bg-sky-200 active:bg-sky-700"
            onClick={refreshWeather}
          >
            {/* <img src={refreshIcon} alt="refresh" width={24} height={24} /> */}
            refresh
          </button>
        </div>
      )}
    </div>
  );
}

export default Details;
