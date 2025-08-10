import React, { useCallback, useEffect, useRef } from 'react';
import AnimeCardComponent from '@/components/anime-card/anime-card.component.tsx';
import styles from './home-page.component.module.css';
import Spinner from '../../components/ui/spinner/spinner.tsx';
import { useLoaderData, useNavigation, useSearchParams } from 'react-router-dom';
import type { LoaderReturnType } from '@/pages/home-page/home-page.loader.ts';
import Pagination from '@/components/paginator/paginator.component.tsx';
import type { AnimeData } from '@/types/jikan.interface.ts';
import AnimeDetailsComponent from '@/components/anime-details/anime-details.component.tsx';
import { useCurrentValue, useSearchAnime } from '@/common/hooks';
import SelectedFooter from '@/components/selected-footer/selected-footer.component.tsx';
import { useSearchStore } from '@/store/search-list-store.ts';
import CustomButton from '@/components/ui/custom-button/custom-button.tsx';
import { useQueryClient } from '@tanstack/react-query';

const HomePageComponent: React.FC = () => {
  const queryClient = useQueryClient();
  const { details } = useLoaderData<LoaderReturnType>();
  const { data: searchResults, isLoading, error } = useSearchAnime();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSearchParams = useCurrentValue(searchParams);
  const hasSyncedUrl = useRef(false);
  const query = useSearchStore((state) => state.query);

  useEffect(() => {
    if (hasSyncedUrl.current) return;

    const urlQ = searchParams.get('q') ?? '';
    if (urlQ !== query) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('q', query);
      setSearchParams(newParams, { replace: true });
    }

    hasSyncedUrl.current = true;
  }, [query, searchParams, setSearchParams]);

  const handleCardClick = useCallback(
    (event: React.MouseEvent, anime: AnimeData) => {
      event.stopPropagation();
      const newParams = new URLSearchParams(currentSearchParams.current);
      newParams.set('details', String(anime.mal_id));
      setSearchParams(newParams);
    },
    [currentSearchParams, setSearchParams],
  );

  const handleRefetchAll = useCallback(() => {
    void queryClient.invalidateQueries();
  }, [queryClient]);

  if (navigation.state === 'loading' || isLoading) {
    return (
      <div className={styles.fullscreenCentered}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.fullscreenCentered} ${styles.mainError}`}>
        <p>{error.message}</p>
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
    <>
      <main className={styles.main}>
        <div className={styles.resultsContainer}>
          <div className={styles.grid}>
            {searchResults.data.map((anime, i) => (
              <AnimeCardComponent key={`${anime.mal_id}-${i}`} anime={anime} onClick={handleCardClick} />
            ))}
          </div>

          <Pagination currentPage={current_page} totalPages={last_visible_page} />
          <CustomButton onClick={handleRefetchAll}>Refetch</CustomButton>
        </div>

        {details && (
          <div className={styles.detailsContainer}>
            <AnimeDetailsComponent />
          </div>
        )}
      </main>
      <SelectedFooter />
    </>
  );
};

export default HomePageComponent;
