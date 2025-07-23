import { useLoaderData, useSearchParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import Spinner from '@/components/ui/spinner/spinner.tsx';
import type { AnimeData } from '@/types/jikan.interface.ts';
import styles from './anime-details.component.module.css';
import type { LoaderReturnType } from '@/pages/home-page/home-page.loader.ts';
import { getAnimeById } from '@/api/jikan.ts';

const AnimeDetailsComponent: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get('details');
  const { searchResults } = useLoaderData() as LoaderReturnType;

  const [anime, setAnime] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const searchValueRef = useRef(searchResults);

  useEffect(() => {
    if (!id) return;

    const existing = searchValueRef.current?.data.find((a) => String(a.mal_id) === id);
    if (existing) {
      setAnime(existing);
      setLoading(false);
      return;
    }

    setLoading(true);
    getAnimeById(id)
      .then((data) => setAnime(data.data))
      .catch(() => setAnime(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleClose = () => {
    searchParams.delete('details');
    setSearchParams(searchParams);
  };

  return (
    <div className={styles.detailsContainer}>
      <button onClick={handleClose} className={styles.closeButton}>
        ×
      </button>

      {loading || !anime ? (
        <Spinner />
      ) : (
        <>
          <h2 title={anime.titles[0].title}>{anime.titles[0].title}</h2>
          <img src={anime.images.jpg.image_url} alt={anime.titles[0].title} />
          <p>{anime.synopsis}</p>
        </>
      )}
    </div>
  );
};

export default AnimeDetailsComponent;
