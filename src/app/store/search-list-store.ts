import { create } from 'zustand';

const LOCAL_STORAGE_KEY = 'lastSearch';

interface SearchState {
  query: string;
  page: number;
  setQuery: (query: string) => void;
  setPage: (page: number) => void;
}

const getInitialQuery = () => {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);

  const storage = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storage) return JSON.parse(storage);

  const queryFromUrl = params.get('q')?.trim();
  if (queryFromUrl) return queryFromUrl;

  return '';
};

const getInitialPage = () => {
  if (typeof window === 'undefined') return 1;
  const params = new URLSearchParams(window.location.search);
  const pageFromUrl = Number(params.get('page'));
  if (Number.isInteger(pageFromUrl) && pageFromUrl > 0) return pageFromUrl;
  return 1;
};

export const useSearchStore = create<SearchState>((set) => ({
  query: getInitialQuery(),
  page: getInitialPage(),
  setQuery: (query) => {
    set({ query, page: 1 });
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(query));
    }
  },
  setPage: (page) => set({ page }),
}));
