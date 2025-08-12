import { useEffect, useState } from "react";
import "./App.css";
import { fetchViaGeocoding } from "./services/api";

function App() {
  const [searhCity, setSearhCity] = useState < any | null > (null);
  const [error, setError] = useState<null>(null);

  useEffect(() => {
    const getCityweather=()=>{}
    geocode();
  }, []);
  const geocode = async () => {
    try {
      const geocodeCity = await fetchViaGeocoding("delhi");
      const checkvalue = geocodeCity;
      console.log(checkvalue.name);
      setSearhCity;
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
        <h1 className="text-2xl">hellow orld </h1>
      </div>
    </>
  );
}

export default App;
