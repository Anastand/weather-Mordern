import { Link, useSearchParams } from "react-router-dom";

function Details() {
  // const storedValue = localStorage.getItem("searchedCityWeather");
  const [searchedParm] = useSearchParams();
  const city = searchedParm.get("city");
  console.log(city);
  return (
    <div>
      <div>
        {!city && (
          <div>
            <p>
              You Dont Have a city selected pls vist <Link to="/"> Home </Link> and select a city
            </p>
          </div>
        )}
      </div>
      <p>hello from detail page</p>
    </div>
  );
}

export default Details;
