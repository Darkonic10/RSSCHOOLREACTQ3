import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { AnimeData } from '@/types/jikan.interface.ts';
import ColorThief from 'colorthief';
import styles from './anime-card.component.module.css';
import { generateRadialGradient } from '@/common/common.ts';
import { usePickedCardStore } from '@/store/picked-card-store.ts';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Props {
  anime: AnimeData;
  onClick?: (event: React.MouseEvent, anime: AnimeData) => void;
}

const AnimeCardComponent: React.FC<Props> = ({ anime, onClick }) => {
  const [background, setBackground] = useState<string>('linear-gradient(to bottom, #222, #000)');
  const imgRef = useRef<HTMLImageElement | null>(null);

  const toggleCard = usePickedCardStore((state) => state.toggleCard);
  const isSelected = usePickedCardStore((state) => state.isSelected(anime.mal_id));
  const t = useTranslations('Card');

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

  const handleCheckboxClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      toggleCard(anime);
    },
    [anime, toggleCard],
  );

  const title = anime.titles[0]?.title ?? t('untitled');
  const imageUrl = anime.images?.jpg?.image_url;

  return (
    <div className={styles.animeCardContainer} style={{ background }} data-testid="anime-card" onClick={handleClick}>
      <div className={styles.animeCheckboxContainer} onClick={handleCheckboxClick}>
        <input type="checkbox" name="pick_card" checked={isSelected} onChange={() => {}} className={styles.animeCheckbox} />
      </div>
      <div className={styles.animeScore}>★ {anime.score ?? t('n/a')}</div>
      {imageUrl && (
        <Image className={styles.animeImg} ref={imgRef} src={imageUrl} crossOrigin="anonymous" alt={title} width={225} height={331} />
      )}
      <h3 className={styles.animeTitle} title={title}>
        {title}
      </h3>
      <p className={styles.description}>
        <strong>{t('episodes')}:</strong> {anime.episodes ?? t('unknown')}
      </p>
      <p className={styles.description}>
        <strong>{t('source')}:</strong> {anime.source ?? t('unknown')}
      </p>
      <p className={styles.description}>
        <strong>{t('status')}:</strong> {anime.status ?? t('unknown')}
      </p>
    </div>
  );
};

export default AnimeCardComponent;
