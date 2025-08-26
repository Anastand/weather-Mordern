import { Link, useSearchParams } from "react-router-dom";

function Details() {
  const RawstoredValue = localStorage.getItem("searchedCityWeather");
  const storedValue = RawstoredValue ? JSON.parse(RawstoredValue) : null;
  const [searchedParm] = useSearchParams();
  const city = searchedParm.get("city");
  console.log(city);
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
      </div>
    </div>
  );
}

export default Details;
