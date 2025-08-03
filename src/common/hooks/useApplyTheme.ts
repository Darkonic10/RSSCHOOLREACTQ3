import { useUIStore } from "@/store/ui-store.ts";
import { useEffect } from "react";

export const useApplyTheme = () => {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.remove("light-theme", "dark-theme");
    document.documentElement.classList.add(`${theme}-theme`);
  }, [theme]);
};
