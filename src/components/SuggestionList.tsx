import type { GeoResult } from "../types";
import { Card } from "@/components/ui/card";

interface Props {
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
}: Props) {
  // don’t show anything if no query or already selected
  if (!query || selected) return null;

  return (
    <Card className="absolute mt-2 w-full max-w-md shadow-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 z-50 border border-gray-200 dark:border-gray-700">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {loading && (
          <li className="p-3 text-gray-500 dark:text-gray-400 text-center">
            Loading...
          </li>
        )}
        {sugError && !loading && (
          <li className="p-3 text-red-500 dark:text-red-400 text-center">
            {sugError}
          </li>
        )}
        {!loading && !sugError && suggopt.length === 0 && (
          <li className="p-3 text-gray-500 dark:text-gray-400 text-center">
            No results found
          </li>
        )}
        {!loading &&
          suggopt.map((item, i) => (
            <li
              key={`${item.name}-${item.latitude}-${item.longitude}`}
              className={`p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                i === activeIndex ? "bg-blue-100 dark:bg-blue-900" : ""
              }`}
              onClick={() => onselect(item)}
            >
              {item.name}, {item.country}
            </li>
          ))}
      </ul>
    </Card>
  );
}

export default SuggestionList;
