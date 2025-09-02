const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const URL_OPTIONS = "&count=1&language=en&format=json";

// 🔎 Forward Geocoding: city name → lat/lon
export const fetchViaGeocoding = async (cityName: string) => {
  const response = await fetch(
    `${BASE_URL}?name=${encodeURIComponent(cityName)}${URL_OPTIONS}`
  );
  if (!response.ok) throw new Error("Failed to fetch geocoding data");
  const data = await response.json();
  return data.results?.[0] || null;
};

// 🔎 Suggestions (autocomplete search)
export const SuggestionCall = async (cityquery: string) => {
  const response = await fetch(
    `${BASE_URL}?name=${encodeURIComponent(
      cityquery
    )}&count=10&language=en&format=json`
  );
  if (!response.ok) throw new Error("Failed to fetch suggestions");
  const data = await response.json();
  return data.results || [];
};

// 🔄 Reverse Geocoding (lat/lon → city name)
// ⚠️ Using OpenStreetMap Nominatim since Open-Meteo has no reverse API
export const reverseGeocoding = async (lat: number, lon: number) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  );
  if (!response.ok) throw new Error("Failed to fetch reverse geocoding data");
  const data = await response.json();

  return {
    name:
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.state ||
      "Unknown",
    country: data.address.country || "",
    latitude: lat,
    longitude: lon,
  };
};

// 🌤 Weather API: includes hourly + daily weather codes
export const cityWeather = async (lat: number, long: number) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,weather_code&timezone=auto`
  );
  if (!response.ok) throw new Error("Failed to fetch weather data");
  const data = await response.json();
  return data;
};
