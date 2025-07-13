import React from 'react';
import type { AnimeData } from '../../../types/jikan.interface.ts';
import ColorThief from 'colorthief';
import styles from './anime-card.module.css';
import { generateRadialGradient } from '../../../common/common.ts';

interface Props {
  anime: AnimeData;
}

interface AnimeCardState {
  background: string;
}

class AnimeCard extends React.Component<Props, AnimeCardState> {
  imgRef: React.RefObject<HTMLImageElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      background: 'linear-gradient(to bottom, #222, #000)',
    };
    this.imgRef = React.createRef() as React.RefObject<HTMLImageElement>;
  }

  componentDidMount() {
    const img = this.imgRef.current;
    if (!img) return;

    img.addEventListener('load', this.handleImageLoad);
  }

  componentWillUnmount() {
    const img = this.imgRef.current;
    if (img) {
      img.removeEventListener('load', this.handleImageLoad);
    }
  }

  handleImageLoad = () => {
    const img = this.imgRef.current;
    if (!img) return;

    try {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(img, 4);
      const gradient = generateRadialGradient(palette);
      this.setState({ background: gradient });
    } catch (error) {
      console.error('Failed to extract color', error);
    }
  };

  render() {
    const data = this.props.anime;
    const title = data.titles[0]?.title ?? 'Untitled';
    const imageUrl = data.images?.jpg?.image_url;
    const { background } = this.state;

    return (
      <div className={styles.animeCardContainer} style={{ background }}>
        <div className={styles.animeScore}>★ {data.score ?? 'N/A'}</div>
        {imageUrl && (
          <img className={styles.animeImg} ref={this.imgRef} src={imageUrl} crossOrigin="anonymous" alt={title} />
        )}
        <h3 className={styles.animeTitle}>{title}</h3>
        <p>
          <strong>Episodes:</strong> {data.episodes ?? 'Unknown'}
        </p>
        <p>
          <strong>Source:</strong> {data.source ?? 'Unknown'}
        </p>
        <p>
          <strong>Status:</strong> {data.status ?? 'Unknown'}
        </p>
      </div>
    );
  }
}

export default AnimeCard;
