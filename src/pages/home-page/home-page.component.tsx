import React, { useCallback } from "react";
import AnimeCardComponent from "@/components/anime-card/anime-card.component.tsx";
import styles from "./home-page.component.module.css";
import Spinner from "../../components/ui/spinner/spinner.tsx";
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import type { LoaderReturnType } from "@/pages/home-page/home-page.loader.ts";
import Pagination from "@/components/paginator/paginator.component.tsx";
import type { AnimeData } from "@/types/jikan.interface.ts";
import AnimeDetailsComponent from "@/components/anime-details/anime-details.component.tsx";
import { useCurrentValue } from "@/common/hooks";
import SelectedFooter from "@/components/selected-footer/selected-footer.component.tsx";

const HomePageComponent: React.FC = () => {
  const { error, searchResults } = useLoaderData<LoaderReturnType>();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSearchParams = useCurrentValue(searchParams);

  const handleCardClick = useCallback(
    (event: React.MouseEvent, anime: AnimeData) => {
      event.stopPropagation();
      const newParams = new URLSearchParams(currentSearchParams.current);
      newParams.set("details", String(anime.mal_id));
      setSearchParams(newParams);
    },
    [currentSearchParams, setSearchParams],
  );

  if (navigation.state === "loading") {
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
    <>
      <main className={styles.main}>
        <div className={styles.resultsContainer}>
          <div className={styles.grid}>
            {searchResults.data.map((anime, i) => (
              <AnimeCardComponent
                key={`${anime.mal_id}-${i}`}
                anime={anime}
                onClick={handleCardClick}
              />
            ))}
          </div>

          <Pagination
            currentPage={current_page}
            totalPages={last_visible_page}
          />
        </div>

        {searchParams.has("details") && (
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
