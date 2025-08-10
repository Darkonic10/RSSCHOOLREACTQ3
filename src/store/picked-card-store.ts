import { create } from "zustand";
import type { AnimeData } from "@/types/jikan.interface.ts";

type State = {
  selected: AnimeData[];
  toggleCard: (anime: AnimeData) => void;
  isSelected: (id: number) => boolean;
  clearSelected: () => void;
};

export const usePickedCardStore = create<State>((set, get) => ({
  selected: [],
  toggleCard: (anime) => {
    const current = get().selected;
    const exists = current.some((a) => a.mal_id === anime.mal_id);
    const updated = exists
      ? current.filter((a) => a.mal_id !== anime.mal_id)
      : [...current, anime];
    set({ selected: updated });
  },
  isSelected: (id) => get().selected.some((a) => a.mal_id === id),
  clearSelected: () => set({ selected: [] }),
}));
