import React from 'react';
import type { AnimeData } from '../../../types/jikan.interface.ts';
import styles from './anime-card.module.css';

interface Props {
  anime: AnimeData;
}

class AnimeCard extends React.Component<Props> {
  render() {
    const data = this.props.anime;
    const title = data.titles[0]?.title ?? 'Untitled';
    const imageUrl = data.images?.jpg?.image_url;

    return (
      <div className={styles.animeCardContainer}>
        {imageUrl && <img src={imageUrl} alt={title} className={styles.animeImg} />}
        <h3 className={styles.animeTitle}>{title}</h3>
        <p>
          <strong>Score:</strong> {data.score ?? 'N/A'}
        </p>
        <p>
          <strong>Episodes:</strong> {data.episodes ?? 'Unknown'}
        </p>
        <p>
          <strong>Status:</strong> {data.status ?? 'Unknown'}
        </p>
      </div>
    );
  }
}

export default AnimeCard;
