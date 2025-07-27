import { searchAnime } from '@/api/jikan.ts';
import { type LoaderFunctionArgs, redirect } from 'react-router-dom';
import type { AnimeSearchResponse } from '@/types/jikan.interface.ts';

export interface LoaderReturnType {
  searchResults?: AnimeSearchResponse;
  error?: string;
}

export async function homePageLoader({ request }: LoaderFunctionArgs): Promise<LoaderReturnType | Response> {
  const url = new URL(request.url);

  const pageValue = Number(url.searchParams.get('page'));
  const isValidPage = Number.isInteger(pageValue) && pageValue > 0;

  const lastSearchStorage = localStorage.getItem('lastSearch');
  const searchParamsSearch = url.searchParams.get('q') ?? '';
  const query = lastSearchStorage ? JSON.parse(lastSearchStorage) : searchParamsSearch;
  const isValidQuery = searchParamsSearch === query;

  const page = isValidPage ? pageValue : 1;

  if (!isValidPage || !isValidQuery) {
    const redirectParams = new URLSearchParams(url.searchParams);
    if (!isValidQuery) redirectParams.set('q', query);
    if (!isValidPage) redirectParams.set('page', '1');
    return redirect(`/?${redirectParams.toString()}`);
  }

  try {
    const data = await searchAnime(query, page);
    return { searchResults: data };
  } catch (e) {
    return { error: String(e) };
  }
}
