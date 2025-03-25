import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

import {
  ChartOptionData,
  Dashboard,
  DashboardPannel,
  WidgetOptionData,
} from "@/types/dashboard";

interface DashboardStore {
  dashboardList: Dashboard[];
  addDashboard: (dashboard: Dashboard) => string;
  updateDashboard: (dashboard: Dashboard) => void;
  deleteDashboard: (dashboardId: string) => void;
  cloneDashboard: (dashboardId: string) => void;
  getDashboardById: (dashboardId: string) => Dashboard | undefined;
  addPannelToDashboard: (dashboardId: string, pannel: DashboardPannel) => void;
  deletePannelFromDashboard: (dashboardId: string, pannelId: string) => void;
  updatePannelInDashboard: (
    dashboardId: string,
    updatedPannel: DashboardPannel
  ) => void;
  clonePannelToDashboard: (
    sourceDashboardId: string,
    pannelId: string,
    targetDashboardId: string
  ) => void;
}

export const useDashboardStore2 = create<DashboardStore>()(
  persist(
    (set, get) => ({
      dashboardList: [],

      addDashboard: (newDashboard: Dashboard) => {
        const newId = uuidv4(); // 새로운 ID 생성
        const dashboardWithId = { ...newDashboard, id: newId }; // ID 추가
        set((state) => ({
          dashboardList: [...state.dashboardList, dashboardWithId],
        }));
        return newId; // 새로운 ID 리턴
      },

      updateDashboard: (updatedDashboard: Dashboard) => {
        set((state) => ({
          dashboardList: state.dashboardList.map((db) =>
            db.id === updatedDashboard.id ? updatedDashboard : db
          ),
        }));
      },

      deleteDashboard: (dashboardId) => {
        set((state) => ({
          dashboardList: state.dashboardList.filter(
            (db) => db.id !== dashboardId
          ),
        }));
      },

      cloneDashboard: (dashboardId) => {
        const dashboard = get().dashboardList.find(
          (db) => db.id === dashboardId
        );
        if (!dashboard) return;

        const clonedDashboard: Dashboard = {
          ...dashboard,
          id: uuidv4(),
          label: `${dashboard.label}_copy`,
          pannels: dashboard.pannels.map((pannel) => {
            if (pannel.pannelType === "widget") {
              return {
                ...pannel,
                pannelId: uuidv4(),
                datasets: pannel.datasets.map((ds) => ({
                  label: ds.label,
                  data: [...ds.data],
                })),
                gridPos: { ...pannel.gridPos },
                pannelOptions: {
                  ...(pannel.pannelOptions as WidgetOptionData),
                },
                pannelType: "widget",
              };
            } else {
              return {
                ...pannel,
                pannelId: uuidv4(),
                datasets: pannel.datasets.map((ds) => ({
                  label: ds.label,
                  data: [...ds.data],
                })),
                gridPos: { ...pannel.gridPos },
                pannelOptions: {
                  ...(pannel.pannelOptions as ChartOptionData),
                },
                pannelType: pannel.pannelType, // "chart" | "table"
              };
            }
          }),
        };

        set((state) => ({
          dashboardList: [...state.dashboardList, clonedDashboard],
        }));
      },

      getDashboardById: (dashboardId) => {
        return get().dashboardList.find((db) => db.id === dashboardId);
      },

      addPannelToDashboard: (dashboardId, pannel) => {
        set((state) => ({
          dashboardList: state.dashboardList.map((db) =>
            db.id === dashboardId
              ? { ...db, pannels: [...db.pannels, pannel] }
              : db
          ),
        }));
      },

      deletePannelFromDashboard: (dashboardId, pannelId) => {
        set((state) => ({
          dashboardList: state.dashboardList.map((db) =>
            db.id === dashboardId
              ? {
                  ...db,
                  pannels: db.pannels.filter((p) => p.pannelId !== pannelId),
                }
              : db
          ),
        }));
      },

      updatePannelInDashboard: (dashboardId, updatedPannel) => {
        set((state) => ({
          dashboardList: state.dashboardList.map((db) =>
            db.id === dashboardId
              ? {
                  ...db,
                  pannels: db.pannels.map((p) =>
                    p.pannelId === updatedPannel.pannelId ? updatedPannel : p
                  ),
                }
              : db
          ),
        }));
      },

      clonePannelToDashboard: (
        sourceDashboardId,
        pannelId,
        targetDashboardId
      ) => {
        const sourceDashboard = get().dashboardList.find(
          (db) => db.id === sourceDashboardId
        );
        const targetDashboard = get().dashboardList.find(
          (db) => db.id === targetDashboardId
        );

        if (!sourceDashboard || !targetDashboard) return;

        const pannelToClone = sourceDashboard.pannels.find(
          (p) => p.pannelId === pannelId
        );
        if (!pannelToClone) return;

        const clonedPannel: DashboardPannel =
          pannelToClone.pannelType === "widget"
            ? {
                ...pannelToClone,
                pannelId: uuidv4(),
                datasets: pannelToClone.datasets.map((ds) => ({
                  label: ds.label,
                  data: [...ds.data],
                })),
                gridPos: { ...pannelToClone.gridPos },
                pannelOptions: {
                  ...(pannelToClone.pannelOptions as WidgetOptionData),
                },
                pannelType: "widget",
              }
            : {
                ...pannelToClone,
                pannelId: uuidv4(),
                datasets: pannelToClone.datasets.map((ds) => ({
                  label: ds.label,
                  data: [...ds.data],
                })),
                gridPos: { ...pannelToClone.gridPos },
                pannelOptions: {
                  ...(pannelToClone.pannelOptions as ChartOptionData),
                },
                pannelType: pannelToClone.pannelType, // "chart" | "table"
              };

        set((state) => ({
          dashboardList: state.dashboardList.map((db) =>
            db.id === targetDashboardId
              ? { ...db, pannels: [...db.pannels, clonedPannel] }
              : db
          ),
        }));
      },
    }),
    {
      name: "dashboard2-storage",
    }
  )
);
