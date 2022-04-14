import {createContext, ReactNode, useCallback, useContext, useState} from "react";
import {SfsApi, Results} from "@bouredan/sfs-api";


interface ISfsContext {
  sfsApi: SfsApi,
  setResults: (newSearchResults: Results) => void,
  results?: Results
}

export const SfsContext = createContext<ISfsContext>(null as any);

export function useFacetSearch() {

  const {
    sfsApi,
    results,
    setResults
  } = useContext(SfsContext);

  const fetchResults = useCallback(() => {
    return sfsApi.fetchResults()
      .then(newResults => {
        setResults(newResults);
      });
  }, [setResults, sfsApi]);

  return {
    sfsApi,
    fetchResults,
    results: results,
  };
}

interface SfsContextProviderProps {
  sfsApi: SfsApi,
  children?: ReactNode
}

export function SfsContextProvider({sfsApi, children}: SfsContextProviderProps) {
  const [results, setResults] = useState<Results | undefined>();

  return (
    <SfsContext.Provider value={{
      sfsApi,
      setResults,
      results: results,
    }}>
      {children}
    </SfsContext.Provider>
  );
}