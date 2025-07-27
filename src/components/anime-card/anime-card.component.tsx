import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { AnimeData } from '@/types/jikan.interface.ts';
import ColorThief from 'colorthief';
import styles from './anime-card.component.module.css';
import { generateRadialGradient } from '@/common/common.ts';

interface Props {
  anime: AnimeData;
  onClick?: (event: React.MouseEvent, anime: AnimeData) => void;
}

const AnimeCardComponent: React.FC<Props> = ({ anime, onClick }) => {
  const [background, setBackground] = useState<string>('linear-gradient(to bottom, #222, #000)');
  const imgRef = useRef<HTMLImageElement | null>(null);

  console.log('rerender', anime.mal_id);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleImageLoad = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 4);
        const gradient = generateRadialGradient(palette);
        setBackground(gradient);
      } catch (error) {
        console.error('Failed to extract color', error);
      }
    };

    if (img.complete && img.naturalHeight !== 0) {
      handleImageLoad();
    } else {
      img.addEventListener('load', handleImageLoad);
    }

    return () => {
      img.removeEventListener('load', handleImageLoad);
    };
  }, []);

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      onClick?.(event, anime);
    },
    [anime, onClick],
  );

  const title = anime.titles[0]?.title ?? 'Untitled';
  const imageUrl = anime.images?.jpg?.image_url;

  return (
    <div className={styles.animeCardContainer} style={{ background }} data-testid="anime-card" onClick={handleClick}>
      <div className={styles.animeScore}>★ {anime.score ?? 'N/A'}</div>
      {imageUrl && <img className={styles.animeImg} ref={imgRef} src={imageUrl} crossOrigin="anonymous" alt={title} />}
      <h3 className={styles.animeTitle} title={title}>
        {title}
      </h3>
      <p>
        <strong>Episodes:</strong> {anime.episodes ?? 'Unknown'}
      </p>
      <p>
        <strong>Source:</strong> {anime.source ?? 'Unknown'}
      </p>
      <p>
        <strong>Status:</strong> {anime.status ?? 'Unknown'}
      </p>
    </div>
  );
};

export default AnimeCardComponent;
