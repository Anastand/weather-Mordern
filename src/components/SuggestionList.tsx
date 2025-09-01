import type { GeoResult } from "../types";

interface props {
  suggopt: GeoResult[];
  sugError: string | null;
  loading: boolean;
  selected: boolean;
  query: string;
  activeIndex: number;
  onselect: (city: GeoResult) => void;
}
function SuggestionList({
  suggopt,
  sugError,
  loading,
  query,
  onselect,
  selected,
  activeIndex,
}: props) {
  return (
    <>
      {loading && <div>loading...</div>}
      {query && query.length <= 2 && <div>type 3 letters for suggestions</div>}
      {sugError && query.length >= 3 && <div>we are habinf an error </div>}
      {!loading &&
        !sugError &&
        suggopt.length == 0 &&
        query.length >= 3 &&
        !selected && <div>no result found</div>}
      {suggopt.length > 0 && (
        <ul>
          {suggopt.map((item, i) => (
            <li
              key={`${item.name}-${item.latitude}-${item.longitude}`}
              className={i === activeIndex ? "bg-blue-200" : ""}
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
