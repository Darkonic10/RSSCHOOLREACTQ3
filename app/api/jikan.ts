import type { AnimeData, AnimeSearchResponse } from '../types/jikan.interface.ts';

const BASE = 'https://api.jikan.moe/v4/';

export async function searchAnime(query: string, page = 1, limit = 12): Promise<AnimeSearchResponse> {
  const url = new URL('anime', BASE);
  url.searchParams.set('q', query);
  url.searchParams.set('page', String(page));
  url.searchParams.set('limit', String(limit));

  const res = await fetch(url.toString());

  if (!res.ok) throw new Error(`Jikan API error: ${res.statusText}`);
  return (await res.json()) as AnimeSearchResponse;
}

export async function getAnimeById(id: string): Promise<{ data: AnimeData }> {
  const url = new URL(`anime/${encodeURIComponent(id)}/full`, BASE);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Jikan API error: ${res.statusText}`);
  return (await res.json()) as { data: AnimeData };
}
