import React from 'react';
import AnimeCard from '../../components/ui/anime-card/anime-card.tsx';
import styles from './home-page.component.module.css';
import Spinner from '../../components/ui/spinner/spinner.tsx';
import { useLoaderData, useNavigation } from 'react-router-dom';
import type { LoaderReturnType } from '@/pages/home-page/home-page.loader.ts';
import Pagination from '@/components/paginator/paginator.component.tsx';

const HomePageComponent: React.FC = () => {
  const { error, searchResults } = useLoaderData() as LoaderReturnType;
  const navigation = useNavigation();

  if (navigation.state === 'loading') {
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

  const { current_page, last_visible_page } = searchResults.pagination;

  return (
    <main className={styles.main}>
      <div className={styles.resultsContainer}>
        <div className={styles.grid}>
          {searchResults.data.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>

        <Pagination currentPage={current_page} totalPages={last_visible_page} />
      </div>
    </main>
  );
};

export default HomePageComponent;
