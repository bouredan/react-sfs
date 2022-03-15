import {useCallback, useContext, useEffect, useState} from "react"
import {FacetOptions, Facet} from "@bouredan/sfs-api";

import {SfsContext} from "./SfsContext";

export function useFacet<Value>(facet: Facet<Value>) {

  const [selectedValue, setSelectedValue] = useState(facet.getValue());
  const [facetOptions, setFacetOptions] = useState<FacetOptions>({});

  const {sfsApi, setSearchResults} = useContext(SfsContext);

  const onValueChange = useCallback((selectedValue: Value) => {
    setSelectedValue(selectedValue);
    facet.setValue(selectedValue);
    sfsApi.search()
      .then(newSearchResults => {
        setSearchResults(newSearchResults);
      });
  }, [facet, setSearchResults, sfsApi]);

  const onOptionsChange = useCallback((newFacetOptions: FacetOptions) => {
    setFacetOptions(newFacetOptions);
  }, []);

  useEffect(() => {
    facet.attachSubscriber(onOptionsChange);
    return () => {
      facet.detachSubscriber(onOptionsChange);
    };
  }, [facet, onOptionsChange]);

  return {
    facetOptions,
    selectedValue,
    onChange: onValueChange,
  };
}
