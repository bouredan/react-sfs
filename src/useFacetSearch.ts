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
}

/**
 * React hook for using facet search state.
 *
 * @param sfsApi - {@link SfsApi} to subscribe
 */
export function useFacetSearch(sfsApi: SfsApi): UseFacetSearchResult {

  const [results, setResults] = useState<Results>();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    sfsApi.eventStream.on("FETCH_RESULTS_PENDING", () => setIsFetching(true));
    sfsApi.eventStream.on("FETCH_RESULTS_SUCCESS", (event) => {
      setResults(event.results as Results);
      setIsFetching(false);
    });
    sfsApi.eventStream.on("FETCH_RESULTS_ERROR", () => setIsFetching(false));
    sfsApi.fetchResults();
  }, []);

  return {
    results,
    isFetching,
  };
}
