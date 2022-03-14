import {createContext, ReactNode, useCallback, useContext, useState} from "react";
import {SearchResults, SfsApi} from "@bouredan/sfs-api";

interface ISfsContext {
  sfsApi: SfsApi,
  setSearchResults: (newSearchResults: SearchResults) => void,
  searchResults?: SearchResults
}

export const SfsContext = createContext<ISfsContext>(null as any);

export function useFacetSearch() {

  const {
    sfsApi,
    searchResults,
    setSearchResults
  } = useContext(SfsContext);

  const fetchResults = useCallback(() => {
    return sfsApi.search()
      .then(newResults => {
        setSearchResults(newResults);
      });
  }, [setSearchResults, sfsApi]);

  return {
    sfsApi,
    fetchResults,
    searchResults,
  };
}

interface SfsContextProviderProps {
  sfsApi: SfsApi,
  children?: ReactNode
}

export function SfsContextProvider({sfsApi, children}: SfsContextProviderProps) {
  const [searchResults, setSearchResults] = useState<SearchResults | undefined>(undefined);

  return (
    <SfsContext.Provider value={{
      sfsApi,
      setSearchResults,
      searchResults,
    }}>
      {children}
    </SfsContext.Provider>
  );
}