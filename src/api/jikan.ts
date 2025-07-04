import type { AnimeSearchResponse } from '../types/jikan.interface.ts';

const BASE = 'https://api.jikan.moe/v4';

export async function searchAnime(query: string, page = 1, limit = 20): Promise<AnimeSearchResponse> {
  const res = await fetch(`${BASE}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error(`Jikan API error: ${res.statusText}`);
  return (await res.json()) as AnimeSearchResponse;
}
