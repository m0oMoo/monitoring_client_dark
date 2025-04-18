import { create } from "zustand";

interface ThemeState {
  theme: "modern" | "blue" | "pink" | "orange" | "ivory";
  setTheme: (theme: ThemeState["theme"]) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "modern",
  setTheme: (theme) => set({ theme }),
}));
