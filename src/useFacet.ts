import {useCallback, useEffect, useState} from "react"
import {Facet, FacetOption} from "sfs-api";

export interface UseFacetResult<Value> {
  /**
   * Facet options.
   */
  options: FacetOption[],
  /**
   * Facet value.
   */
  value: Value | undefined,
  /**
   * Callback for changing facet value.
   *
   * @param newValue - new facet value
   */
  onValueChange: (newValue: Value) => void,
  /**
   * True if fetching facet options is in progress.
   */
  isFetching: boolean,
  /**
   * Error of the latest options fetch. It is undefined if no errors.
   */
  error: any,
}

/**
 * React hook for using facet state.
 * @param facet - facet to subscribe
 */
export function useFacet<Value>(facet: Facet<Value>): UseFacetResult<Value> {
  const [options, setOptions] = useState<FacetOption[]>([]);
  const [value, setValue] = useState<Value>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();

  const onValueChange = useCallback((newValue: Value) => {
    facet.value = newValue;
  }, [facet]);

  useEffect(() => {
    facet.sfsApi.eventStream.on("RESET_STATE", () => {
      setValue(undefined);
    });
    facet.sfsApi.eventStream.on("FACET_VALUE_CHANGED", (event) => {
      if (event.facetId === facet.id) {
        setValue(event.value as Value);
      }
    });
    facet.sfsApi.eventStream.on("FETCH_FACET_OPTIONS_PENDING", (event) => {
      if (event.facetId === facet.id) {
        setIsFetching(true);
        setError(undefined);
      }
    });
    facet.sfsApi.eventStream.on("FETCH_FACET_OPTIONS_SUCCESS", (event) => {
      if (event.facetId === facet.id) {
        setIsFetching(false);
        setOptions(event.options);
      }
    });
    facet.sfsApi.eventStream.on("FETCH_FACET_OPTIONS_ERROR", (event) => {
      if (event.facetId === facet.id) {
        setIsFetching(false);
        setError(event.error);
      }
    });
    facet.refreshOptions();
  }, [facet]);

  return {
    options,
    value,
    onValueChange,
    isFetching,
    error
  };
}
