import { create } from "zustand";

export type Theme = "light" | "dark";

type UIState = {
  theme: Theme;
  toggleTheme: () => void;
};

const savedTheme = (localStorage.getItem("theme") as Theme) ?? "dark";

export const useUIStore = create<UIState>((set) => ({
  theme: savedTheme,
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),
}));
