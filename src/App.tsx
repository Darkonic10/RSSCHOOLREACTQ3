import React from 'react';
import HeaderComponent from './components/header/header.component.tsx';
import MainComponent from './components/main/main.component.tsx';
import { searchAnime } from './api/jikan.ts';

class App extends React.Component {
  state = {
    searchResults: [],
  };

  handleSearch = async (query: string) => {
    try {
      console.log('Sending search request for:', query);
      const responseData = await searchAnime(query);
      console.log('Fetched data:', responseData);
      this.setState({ searchResults: responseData });
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  render() {
    return (
      <>
        <HeaderComponent onSearch={this.handleSearch} />
        <MainComponent />
      </>
    );
  }
}

export default App;
