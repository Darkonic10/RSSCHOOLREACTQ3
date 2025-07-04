import React from 'react';
import HeaderComponent from './components/header/header.component.tsx';
import MainComponent from './components/main/main.component.tsx';
import { searchAnime } from './api/jikan.ts';
import type { AnimeSearchResponse } from './types/jikan.interface.ts';

export interface AppState {
  searchResults?: AnimeSearchResponse;
  isLoading: boolean;
  error?: string;
}

class App extends React.Component<object, AppState> {
  state: AppState = {
    searchResults: undefined,
    isLoading: false,
    error: undefined,
  };

  handleSearch = async (query: string) => {
    this.setState({ isLoading: true, error: undefined });

    try {
      const responseData = await searchAnime(query);
      this.setState({ searchResults: responseData, isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false, error: String(error) });
    }
  };

  render() {
    const { searchResults, isLoading, error } = this.state;
    return (
      <>
        <HeaderComponent onSearch={this.handleSearch} />
        <MainComponent searchResults={searchResults} error={error} isLoading={isLoading} />
      </>
    );
  }
}

export default App;
