import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DashboardPannel } from "@/types/dashboard";

interface TempPanelStore {
  tempPanel: DashboardPannel | null;
  tempPanelTargetDashboardId: string | null;
  setTempPanel: (panel: DashboardPannel, dashboardId: string) => void;
  clearTempPanel: () => void;
}

/**
 * 이미 존재하는 대시보드에 패널을 생성/수정 할 때 사용
 */
export const useTempPanelStore = create<TempPanelStore>()(
  persist(
    (set) => ({
      tempPanel: null,
      tempPanelTargetDashboardId: null,
      setTempPanel: (panel, dashboardId) =>
        set({ tempPanel: panel, tempPanelTargetDashboardId: dashboardId }),
      clearTempPanel: () =>
        set({ tempPanel: null, tempPanelTargetDashboardId: null }),
    }),
    {
      name: "temp-panel-storage",
    }
  )
);
