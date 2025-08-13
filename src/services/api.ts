const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search?";
const URL_OPTIONS = "&count=1&language=en&format=json";

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=weather_code&hourly=temperature_2m";

export const fetchViaGeocoding = async (cityName: string) => {
  const response = await fetch(
    `${BASE_URL}name=${encodeURIComponent(cityName)}${URL_OPTIONS}`
  );
  const data = await response.json();
  console.log(data);
  return data.results[0];
};

export const cityWeather = async (lat: any, long: any) => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code&hourly=temperature_2m`
  );
  const dat = await res.json();
  return dat;
};
