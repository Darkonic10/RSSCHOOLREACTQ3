import React, { useCallback, useState } from 'react';
import HeaderComponent from './components/header/header.component.tsx';
import MainComponent from './components/main/main.component.tsx';
import { searchAnime } from './api/jikan.ts';
import type { AnimeSearchResponse } from './types/jikan.interface.ts';
import ErrorBoundary from './components/error-boundary/error-boundary.component.tsx';

const App: React.FC = () => {
  const [searchResults, setSearchResults] = useState<AnimeSearchResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSearch = useCallback((query: string) => {
    setIsLoading(true);
    setError(undefined);

    searchAnime(query)
      .then((responseData) => {
        setSearchResults(responseData);
      })
      .catch((error) => {
        setError(String(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <ErrorBoundary>
      <HeaderComponent onSearch={handleSearch} />
      <MainComponent searchResults={searchResults} error={error} isLoading={isLoading} />
    </ErrorBoundary>
  );
};

export default App;
