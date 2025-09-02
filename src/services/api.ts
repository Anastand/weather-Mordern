const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search?";
const URL_OPTIONS = "&count=1&language=en&format=json";

export const fetchViaGeocoding = async (cityName: string) => {
  const response = await fetch(
    `${BASE_URL}name=${encodeURIComponent(cityName)}${URL_OPTIONS}`
  );
  const data = await response.json();
  // console.log(data);
  return data.results[0];
};
export const SuggestionCall = async (cityquery: string) => {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      cityquery
    )}&count=10&language=en&format=json`
  );

  const data = await response.json();
  // console.log(data);
  return data.results;
};

// export const cityWeather = async (lat: number, long: number) => {
//   const res = await fetch(
//     `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code&hourly=temperature_2m`

//   );
//   const dat = await res.json();
//   return dat;
// };
export const cityWeather = async (lat: number, long: number) => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m`
  );
  const dat = await res.json();
  return dat;
};
