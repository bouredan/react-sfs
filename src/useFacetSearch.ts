import {useEffect, useState} from "react";
import {Results, SfsApi} from "sfs-api";

export interface UseFacetSearchResult {
  /**
   * Current filtered results of facet search.
   */
  results: Results | undefined,
  /**
   * True if fetching results is in progress.
   */
  isFetching: boolean,
  /**
   * Last search pattern used for fetching results.
   */
  lastSearchPattern: string,
  /**
   * Error of the latest results fetch. It is undefined if no errors.
   */
  error: any,
}

/**
 * React hook for using facet search state.
 *
 * @param sfsApi - {@link SfsApi} to subscribe
 */
export function useFacetSearch(sfsApi: SfsApi): UseFacetSearchResult {

  const [results, setResults] = useState<Results>();
  const [lastSearchPattern, setLastSearchPattern] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    sfsApi.eventStream.on("NEW_SEARCH", (event) => setLastSearchPattern(event.searchPattern));
    sfsApi.eventStream.on("FETCH_RESULTS_PENDING", () => {
      setIsFetching(true);
      setError(undefined);
    });
    sfsApi.eventStream.on("FETCH_RESULTS_SUCCESS", (event) => {
      setIsFetching(false);
      setResults(event.results as Results);
    });
    sfsApi.eventStream.on("FETCH_RESULTS_ERROR", (event) => {
      setIsFetching(false);
      setError(event.error);
    });
    sfsApi.fetchResults();
  }, []);

  return {
    results,
    lastSearchPattern,
    isFetching,
    error,
  };
}
