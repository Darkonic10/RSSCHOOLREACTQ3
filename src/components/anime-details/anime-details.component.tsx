import { useLoaderData, useSearchParams } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner/spinner.tsx";
import type { AnimeData } from "@/types/jikan.interface.ts";
import styles from "./anime-details.component.module.css";
import { getAnimeById } from "@/api/jikan.ts";
import type { LoaderReturnType } from "@/pages/home-page/home-page.loader.ts";
import { useCurrentValue } from "@/common/hooks";

const AnimeDetailsComponent: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("details");
  const { searchResults } = useLoaderData<LoaderReturnType>();

  const [anime, setAnime] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentSearchValue = useCurrentValue(searchResults);

  useEffect(() => {
    if (!id) return;

    setError(null);
    const existing = currentSearchValue.current?.data.find(
      (a) => String(a.mal_id) === id,
    );
    if (existing) {
      setAnime(existing);
      setLoading(false);
      return;
    }

    setLoading(true);
    getAnimeById(id)
      .then((data) => setAnime(data.data))
      .catch(() => {
        setAnime(null);
        setError("Failed to load anime details.");
      })
      .finally(() => setLoading(false));
  }, [currentSearchValue, id]);

  const handleClose = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("details");
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  return (
    <div className={styles.detailsContainer}>
      <button onClick={handleClose} className={styles.closeButton}>
        ×
      </button>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className={styles.mainError}>
          <p>{error}</p>
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
