import type { AnimeData, AnimeSearchResponse } from '@/types/jikan.interface.ts';
import { getAnimeById, searchAnime } from '@/api/jikan.ts';
import HomePageClient from '@/[locale]/page-client.tsx';
import { redirect } from 'next/navigation';
import styles from '@/[locale]/page.module.css';
import React from 'react';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string; details?: string; page?: string }> }) {
  const resolvedParams = await searchParams;

  const query = resolvedParams.q ?? '';
  const page = Number(resolvedParams.page ?? 1);

  if (!Number.isInteger(page) || page < 1) {
    return redirect(`/?q=${encodeURIComponent(query)}&page=1`);
  }

  const details: number | undefined = resolvedParams.details ? Number(resolvedParams.details) : undefined;
  if (details != null && (!Number.isInteger(details) || details < 0)) {
    return redirect(`/?q=${encodeURIComponent(query)}&page=${page}`);
  }

  let searchResults: AnimeSearchResponse | null = null;
  let searchError: string | null = null;

  try {
    searchResults = await searchAnime(query, page, 12);
  } catch (err: unknown) {
    if (err instanceof Error) {
      searchError = err.message;
    } else {
      searchError = String(err);
    }
    console.error('Error fetching searchAnime:', err);
  }

  let detailsData: AnimeData | null = null;
  let detailsError: string | null = null;

  if (details) {
    try {
      const res = await getAnimeById(String(details));
      detailsData = res.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        detailsError = err.message;
      } else {
        detailsError = String(err);
      }
      console.error('Error fetching getAnimeById:', err);
    }
  }

  if (searchError) {
    return (
      <div className={`${styles.fullscreenCentered} ${styles.mainError}`}>
        <p>{searchError}</p>
      </div>
    );
  }

  return (
    <HomePageClient
      query={query}
      page={page}
      searchResults={searchResults}
      details={details}
      initialDetails={detailsData}
      detailsError={detailsError}
    />
  );
}
