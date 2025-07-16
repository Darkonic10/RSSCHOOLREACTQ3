import React from 'react';
import AnimeCard from '../ui/anime-card/anime-card.tsx';
import styles from './main.component.module.css';
import Spinner from '../ui/spinner/spinner.tsx';
import type { AnimeSearchResponse } from '@/types/jikan.interface.ts';

interface MainComponentProps {
  searchResults: AnimeSearchResponse | undefined;
  isLoading: boolean;
  error: string | undefined;
}

const MainComponent: React.FC<MainComponentProps> = ({ isLoading, error, searchResults }) => {
  if (isLoading) {
    return (
      <div className={styles.fullscreenCentered}>
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
        <div className={styles.grid}>
          {searchResults.data.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default MainComponent;
