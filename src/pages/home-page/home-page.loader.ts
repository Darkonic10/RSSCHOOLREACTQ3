import { type LoaderFunctionArgs, redirect } from 'react-router-dom';

export interface LoaderReturnType {
  q: string;
  page: number;
  details?: number;
}

export async function homePageLoader({ request }: LoaderFunctionArgs): Promise<LoaderReturnType | Response> {
  const url = new URL(request.url);

  const page = Number(url.searchParams.get('page'));
  const isValidPage = Number.isInteger(page) && page > 0;

  const rawDetails = url.searchParams.get('details');
  const isHasDetails = rawDetails !== null;
  const details = isHasDetails ? Number(rawDetails) : undefined;
  const isValidDetails = details === undefined || (Number.isInteger(details) && details >= 0);

  const q = (url.searchParams.get('q') ?? '').trim();

  if (!isValidPage || (isHasDetails && !isValidDetails)) {
    const redirectParams = new URLSearchParams(url.searchParams);
    if (!isValidPage) redirectParams.set('page', '1');
    if (!isValidDetails) redirectParams.delete('details');
    return redirect(`/?${redirectParams.toString()}`);
  }

  return { q, page, details };
}
