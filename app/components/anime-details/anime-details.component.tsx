import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';
import Spinner from '@/components/ui/spinner/spinner.tsx';
import styles from './anime-details.component.module.css';
import { useAnimeDetails, useSearchAnime } from '@/common/hooks';

const AnimeDetailsComponent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('details');

  const { data: searchResults } = useSearchAnime();
  const initialAnime = React.useMemo(() => {
    return searchResults?.data.find((a) => String(a.mal_id) === id) ?? null;
  }, [searchResults?.data, id]);

  const { data: anime, isLoading, error } = useAnimeDetails(id ?? undefined, initialAnime);

  const handleClose = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('details');
    void router.replace(`/?${newParams.toString()}`);
  }, [router, searchParams]);

  return (
    <div className={styles.detailsContainer}>
      <button onClick={handleClose} className={styles.closeButton}>
        ×
      </button>

      {isLoading ? (
        <Spinner />
      ) : error ? (
        <div className={styles.mainError}>
          <p>{error.message}</p>
        </div>
      ) : anime ? (
        <>
          <h2 title={anime.titles[0].title}>{anime.titles[0].title}</h2>
          <img src={anime.images.jpg.image_url} alt={anime.titles[0].title} />
          <p>{anime.synopsis}</p>
        </>
      ) : (
        <p>No details available.</p>
      )}
    </div>
  );
};

export default AnimeDetailsComponent;
