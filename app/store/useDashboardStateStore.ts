import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface DashboardState {
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
}

export const useDashboardStateStore = create<DashboardState>()(
  devtools(
    persist(
      (set) => ({
        title: "",
        description: "",
        setTitle: (title) => set({ title }),
        setDescription: (description) => set({ description }),
      }),
      {
        name: "dashboard-state",
      }
    )
  )
);
