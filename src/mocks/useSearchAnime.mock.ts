import { type Mock, vi } from 'vitest';
import type { AnimeData, SearchPagination } from '@/types/jikan.interface.ts';

export const mockUseSearchAnime: Mock<
  () => {
    data?: {
      data: AnimeData[];
      pagination?: SearchPagination;
    };
    isLoading: boolean;
    error: null | Error;
  }
> = vi.fn(() => ({
  data: { data: [] },
  isLoading: false,
  error: null,
}));

export const mockUseAnimeDetails: Mock<
  () => {
    data?: AnimeData;
    isLoading: boolean;
    error: null | Error;
  }
> = vi.fn(() => ({
  data: undefined,
  isLoading: false,
  error: null,
}));
