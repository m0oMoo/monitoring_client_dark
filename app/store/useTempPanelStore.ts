import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DashboardPannel } from "@/types/dashboard";

interface TempPanelStore {
  tempPanels: Record<string, DashboardPannel>;
  targetDashboardId: string | null;
  setTempPanel: (panel: DashboardPannel, dashboardId: string) => void;
  setTempPanels: (panels: Record<string, DashboardPannel>) => void; // ✅ 추가!
  updateTempPanelLayout: (
    pannelId: string,
    gridPos: DashboardPannel["gridPos"]
  ) => void;
  clearTempPanels: () => void;
}

/**
 * 이미 존재하는 대시보드에 패널을 생성/수정 할 때 사용
 */
export const useTempPanelStore = create<TempPanelStore>()(
  persist(
    (set, get) => ({
      tempPanels: {},
      targetDashboardId: null,
      setTempPanel: (panel, dashboardId) => {
        const prev = get().tempPanels;
        set({
          tempPanels: {
            ...prev,
            [panel.pannelId]: panel,
          },
          targetDashboardId: dashboardId,
        });
      },
      setTempPanels: (panels) => set({ tempPanels: panels }),
      updateTempPanelLayout: (pannelId, gridPos) => {
        const prev = get().tempPanels;
        if (!prev[pannelId]) return;
        set({
          tempPanels: {
            ...prev,
            [pannelId]: {
              ...prev[pannelId],
              gridPos,
            },
          },
        });
      },
      clearTempPanels: () => set({ tempPanels: {}, targetDashboardId: null }),
    }),
    {
      name: "temp-panels-storage",
    }
  )
);
