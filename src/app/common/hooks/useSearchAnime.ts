import { useQuery } from '@tanstack/react-query';
import { getAnimeById, searchAnime } from '@/api/jikan.ts';
import type { AnimeData, AnimeSearchResponse } from '@/types/jikan.interface.ts';

export function useSearchAnime(query?: string, page?: number, initialData?: AnimeSearchResponse | null) {
  return useQuery({
    queryKey: ['searchAnime', query, page],
    queryFn: () => searchAnime(query?.trim() ?? '', page ?? 1, 12),
    staleTime: 1000 * 60 * 15,
    retry: 1,
    ...(initialData ? { initialData } : {}),
    refetchOnMount: (data) => data == null,
  });
}

export function useAnimeDetails(id?: string, initialData?: AnimeData | null) {
  return useQuery({
    queryKey: ['animeDetails', id],
    queryFn: async () => {
      if (!id) {
        return Promise.reject(new Error('No id provided'));
      }
      const res = await getAnimeById(id);
      return res.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 15,
    ...(initialData ? { initialData } : {}),
    refetchOnMount: (data) => data == null,
  });
}
