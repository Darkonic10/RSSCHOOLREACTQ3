'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchStore } from '@/store/search-list-store.ts';
import { useSearchAnime } from '@/common/hooks';
import Spinner from '@/components/ui/spinner/spinner.tsx';
import AnimeCardComponent from '@/components/anime-card/anime-card.component.tsx';
import Pagination from '@/components/paginator/paginator.component.tsx';
import CustomButton from '@/components/ui/custom-button/custom-button.tsx';
import AnimeDetailsComponent from '@/components/anime-details/anime-details.component.tsx';
import type { AnimeData } from '@/types/jikan.interface.ts';
import styles from './page.module.css';
import SelectedFooter from '@/components/selected-footer/selected-footer.component.tsx';

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const hasSyncedUrl = useRef(false);
  const query = useSearchStore((state) => state.query);

  const q = searchParams.get('q') ?? '';
  const details = searchParams.get('details') ? Number(searchParams.get('details')) : undefined;

  const { data: searchResults, isLoading, error } = useSearchAnime();

  useEffect(() => {
    if (hasSyncedUrl.current) return;
    if (q !== query) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('q', query);
      void router.replace(`/?${params.toString()}`);
    }
    hasSyncedUrl.current = true;
  }, [query, q, searchParams, router]);

  const handleCardClick = useCallback(
    (anime: AnimeData) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('details', String(anime.mal_id));
      router.push(`/?${params.toString()}`);
    },
    [searchParams, router],
  );

  const handleRefetchAll = useCallback(() => {
    void queryClient.invalidateQueries();
  }, [queryClient]);

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
        <p>{(error as Error).message}</p>
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
    <>
      <main className={styles.main}>
        <div className={styles.resultsContainer}>
          <div className={styles.grid}>
            {searchResults.data.map((anime, i) => (
              <AnimeCardComponent key={`${anime.mal_id}-${i}`} anime={anime} onClick={() => handleCardClick(anime)} />
            ))}
          </div>

          <Pagination currentPage={searchResults.pagination.current_page} totalPages={searchResults.pagination.last_visible_page} />
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
}
