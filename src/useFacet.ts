import {useCallback, useEffect, useState} from "react"
import {Facet, FacetOption, FacetState} from "@bouredan/sfs-api";


export function useFacet<Value>(facet: Facet<Value>): {
  facetOptions: FacetOption[],
  selectedValue: Value | undefined,
  onValueChange: (selectedValue: Value) => void,
} {
  const [value, setValue] = useState<Value>();
  const [options, setOptions] = useState<FacetOption[]>([]);

  const onValueChange = useCallback((newValue: Value) => {
    facet.setValue(newValue);
  }, [facet]);

  const onStateChange = useCallback((newFacetState: FacetState<Value>) => {
    setValue(newFacetState.value);
    setOptions(newFacetState.options);
  }, []);

  useEffect(() => {
    facet.attachSubscriber(onStateChange);
    return () => {
      facet.detachSubscriber(onStateChange);
    };
  }, [facet, onStateChange]);

  return {
    facetOptions: options,
    selectedValue: value,
    onValueChange,
  };
}
