import { searchAnime } from '@/api/jikan.ts';
import { type LoaderFunctionArgs, redirect } from 'react-router-dom';
import type { AnimeSearchResponse } from '@/types/jikan.interface.ts';

export interface LoaderReturnType {
  searchResults?: AnimeSearchResponse;
  error?: string;
}

export async function homePageLoader({ request }: LoaderFunctionArgs): Promise<LoaderReturnType | Response> {
  const url = new URL(request.url);

  const hasQuery = url.searchParams.has('q');
  const hasPage = url.searchParams.has('page');

  const lastSearchStorage = localStorage.getItem('lastSearch');
  const query = lastSearchStorage ? JSON.parse(lastSearchStorage) : (url.searchParams.get('q') ?? '');

  const page = Number(url.searchParams.get('page') ?? '1');

  if (!hasQuery || !hasPage) {
    const redirectParams = new URLSearchParams(url.searchParams);
    if (!hasQuery) redirectParams.set('q', query);
    if (!hasPage) redirectParams.set('page', '1');

    return redirect(`/?${redirectParams.toString()}`);
  }

  try {
    const data = await searchAnime(query, page, 20);
    return { searchResults: data };
  } catch (e) {
    return { error: String(e) };
  }
}
