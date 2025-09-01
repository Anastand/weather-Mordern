import type { GeoResult } from "../types";

interface props {
  suggopt: GeoResult[];
  sugError: string | null;
  loading: boolean;
  query: string;
  onselect: (city: GeoResult) => void;
}
function SuggestionList({
  suggopt,
  sugError,
  loading,
  query,
  onselect,
}: props) {
  return (
    <>
      {loading && <div>loading...</div>}
      {sugError && query.length >= 3 && <div>we are habinf an error </div>}
      {!loading && !sugError && suggopt.length == 0 && query.length >= 3 && (
        <div>no result found</div>
      )}
      {suggopt.length > 0 && (
        <ul>
          {suggopt.map((item) => (
            <li
              key={`${item.name}-${item.latitude}-${item.longitude}`}
              onClick={() => {
                onselect(item);
              }}
            >
              {item.name} , {item.country}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default SuggestionList;
