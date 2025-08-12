const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search?";
const URL_OPTIONS = "&count=1&language=en&format=json";
export const fetchViaGeocoding = async (cityName: string) => {
  const response = await fetch(
    `${BASE_URL}name=${encodeURIComponent(cityName)}${URL_OPTIONS}`
  );
  const data = await response.json();
  console.log(data);
  return data.results[0];
};

export const cityWeather = () => {
  
};
