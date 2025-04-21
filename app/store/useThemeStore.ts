import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: "modern" | "blue" | "pink" | "orange" | "ivory";
  setTheme: (theme: ThemeState["theme"]) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "modern",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage",
    }
  )
);
