const storedValue = localStorage.getItem("searchedCityWeather");

function Details() {
  return (
    <div>
      <div>
        {!storedValue && (
          <div>
            <p>
              You Dont Have a city selected pls vist <link to="/">Home</link>{" "}
              and select a city
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Details;
