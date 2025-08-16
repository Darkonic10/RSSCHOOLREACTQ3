import type { AnimeData } from '@/types/jikan.interface.ts';
import { getAnimeById, searchAnime } from '@/api/jikan.ts';
import HomePageClient from '@/page-client.tsx';
import { redirect } from 'next/navigation';

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

  const searchResults = await searchAnime(query, page, 12);

  let detailsData: AnimeData | null = null;
  if (details) {
    const res = await getAnimeById(String(details));
    detailsData = res.data;
  }

  return <HomePageClient query={query} page={page} searchResults={searchResults} details={details} initialDetails={detailsData} />;
}
