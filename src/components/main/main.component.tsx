import React from 'react';
import AnimeCard from '../ui/anime-card/anime-card.tsx';
import styles from './main.component.module.css';
import type { AppState } from '../../App.tsx';
import Spinner from '../ui/spinner/spinner.tsx';

class MainComponent extends React.Component<AppState> {
  render() {
    const { isLoading, error, searchResults } = this.props;

    if (isLoading) {
      return (
        <div className={`${styles.fullscreenCentered}`}>
          <Spinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className={`${styles.fullscreenCentered} ${styles.mainError}`}>
          <p>{error}</p>
        </div>
      );
    }

    if (!searchResults || searchResults.data.length === 0) {
      return (
        <div className={`${styles.fullscreenCentered} ${styles.mainEmpty}`}>
          <p>No results found.</p>
        </div>
      );
    }

    return (
      <main className={styles.main}>
        <div className={styles.resultsContainer}>
          <h2>Search Results ({searchResults.data.length} items found)</h2>

          <div className={styles.grid}>
            {searchResults.data.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </div>
      </main>
    );
  }
}

export default MainComponent;
