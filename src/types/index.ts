export interface GeocodeResult {
  latitude: number;
  longitude: number;
  name: string;
}
export interface GeoResult extends GeocodeResult {
  country: string;
  country_code?: string;
}
