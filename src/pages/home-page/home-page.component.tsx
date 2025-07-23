import React from 'react';
import AnimeCardComponent from '@/components/anime-card/anime-card.component.tsx';
import styles from './home-page.component.module.css';
import Spinner from '../../components/ui/spinner/spinner.tsx';
import { useLoaderData, useNavigate, useNavigation, useSearchParams } from 'react-router-dom';
import type { LoaderReturnType } from '@/pages/home-page/home-page.loader.ts';
import Pagination from '@/components/paginator/paginator.component.tsx';
import type { AnimeData } from '@/types/jikan.interface.ts';
import AnimeDetailsComponent from '@/components/anime-details/anime-details.component.tsx';

const HomePageComponent: React.FC = () => {
  const { error, searchResults } = useLoaderData() as LoaderReturnType;
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleCardClick = (anime: AnimeData) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('details', String(anime.mal_id));
    navigate({ search: newParams.toString() });
  };

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
            <AnimeCardComponent key={anime.mal_id} anime={anime} onClick={() => handleCardClick(anime)} />
          ))}
        </div>

        <Pagination currentPage={current_page} totalPages={last_visible_page} />
      </div>

      {searchParams.has('details') && (
        <div className={styles.detailsContainer}>
          <AnimeDetailsComponent />
        </div>
      )}
    </main>
  );
};

export default HomePageComponent;
