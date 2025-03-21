import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface Dashboard {
  id: string;
  label: string;
  description: string;
  panels?: PanelLayout[];
}

export interface PanelLayout {
  panelId: string;
  type: "chart" | "widget" | "table";
  gridPos: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

interface DashboardStore {
  dashboardList: Dashboard[]; // 전체 대시보드 목록
  dashboardPanels: Record<string, PanelLayout[]>; // 대시보드 ID → 패널 리스트
  addDashboard: (dashboard: Dashboard) => void;
  updateDashboard: (
    dashboardId: string,
    newLabel: string,
    newDescription: string
  ) => void;
  addPanelToDashboard: (
    dashboardId: string,
    panelId: string,
    type: "chart" | "widget" | "table",
    gridPos?: {
      x: number;
      y: number;
      w: number;
      h: number;
    }
  ) => void;
  saveDashboard: (dashboardId: string, layouts: PanelLayout[]) => void;
  removeChartFromDashboard: (dashboardId: string, chartId: string) => void;
  removeDashboard: (dashboardId: string) => void;
  cloneDashboard: (dashboardId: string) => void;
  // 새롭게 추가된 함수들
  getDashboardById: (dashboardId: string) => Dashboard | undefined; // 대시보드 조회
  createDashboard: (label: string, description: string) => void; // 대시보드 생성
  updateDashboardDetails: (
    dashboardId: string,
    label: string,
    description: string
  ) => void; // 대시보드 수정
  cloneDashboardWithPanels: (dashboardId: string) => void; // 대시보드 복제 (패널 포함)
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    devtools((set, get) => ({
      dashboardList: [],
      dashboardPanels: {},

      // 대시보드 추가
      addDashboard: (dashboard) => {
        set((state) => ({
          dashboardList: [...state.dashboardList, dashboard],
          dashboardPanels: {
            ...state.dashboardPanels,
            [dashboard.id]: [], // 초기 패널 배열
          },
        }));
      },

      // 대시보드 이름 및 설명 수정
      updateDashboard: (dashboardId, newLabel, newDescription) => {
        set((state) => ({
          dashboardList: state.dashboardList.map((dashboard) =>
            dashboard.id === dashboardId
              ? { ...dashboard, label: newLabel, description: newDescription }
              : dashboard
          ),
        }));
      },

      // 패널 추가 (차트, 위젯, 테이블)
      addPanelToDashboard: (
        dashboardId,
        panelId,
        type,
        gridPos = { x: 0, y: 0, w: 4, h: 4 }
      ) => {
        set((state) => ({
          dashboardPanels: {
            ...state.dashboardPanels,
            [dashboardId]: [
              ...(state.dashboardPanels[dashboardId] || []),
              { panelId, type, gridPos },
            ],
          },
        }));
      },

      // 대시보드 저장 (패널 위치 정보 포함)
      saveDashboard: (dashboardId, layouts) => {
        set((state) => ({
          dashboardPanels: {
            ...state.dashboardPanels,
            [dashboardId]: layouts.map((layout) => ({
              panelId: layout.panelId,
              type: layout.type,
              gridPos: {
                x: layout.gridPos?.x ?? 0,
                y: layout.gridPos?.y ?? 0,
                w: layout.gridPos?.w ?? 4,
                h: layout.gridPos?.h ?? 4,
              },
            })),
          },
        }));
      },

      // 특정 차트 제거
      removeChartFromDashboard: (dashboardId, chartId) => {
        set((state) => ({
          dashboardPanels: {
            ...state.dashboardPanels,
            [dashboardId]: state.dashboardPanels[dashboardId]?.filter(
              (panel) => panel.panelId !== chartId
            ),
          },
        }));
      },

      // 대시보드 삭제
      removeDashboard: (dashboardId) => {
        set((state) => ({
          dashboardList: state.dashboardList.filter(
            (dashboard) => dashboard.id !== dashboardId
          ),
          dashboardPanels: Object.keys(state.dashboardPanels)
            .filter((id) => id !== dashboardId)
            .reduce((acc, id) => {
              acc[id] = state.dashboardPanels[id];
              return acc;
            }, {} as Record<string, PanelLayout[]>),
        }));
      },

      // 대시보드 복제
      cloneDashboard: (dashboardId) => {
        const newDashboardId = crypto.randomUUID();
        const state = get();

        set((state) => ({
          dashboardList: [
            ...state.dashboardList,
            {
              ...state.dashboardList.find((d) => d.id === dashboardId)!,
              id: newDashboardId,
            },
          ],
          dashboardPanels: {
            ...state.dashboardPanels,
            [newDashboardId]: [...(state.dashboardPanels[dashboardId] || [])],
          },
        }));
      },

      // 대시보드 조회 (ID로 대시보드 정보 조회)
      getDashboardById: (dashboardId) => {
        const state = get();
        return state.dashboardList.find(
          (dashboard) => dashboard.id === dashboardId
        );
      },

      // 대시보드 생성
      createDashboard: (label, description) => {
        const newDashboardId = crypto.randomUUID();
        set((state) => ({
          dashboardList: [
            ...state.dashboardList,
            { id: newDashboardId, label, description },
          ],
          dashboardPanels: {
            ...state.dashboardPanels,
            [newDashboardId]: [],
          },
        }));
      },

      // 대시보드 수정 (이름 및 설명 수정)
      updateDashboardDetails: (dashboardId, label, description) => {
        set((state) => ({
          dashboardList: state.dashboardList.map((dashboard) =>
            dashboard.id === dashboardId
              ? { ...dashboard, label, description }
              : dashboard
          ),
        }));
      },

      // 대시보드 복제 (패널 포함)
      cloneDashboardWithPanels: (dashboardId: string) => {
        const newDashboardId = crypto.randomUUID();
        const state = get();
        const dashboardToClone = state.dashboardList.find(
          (d) => d.id === dashboardId
        );

        if (dashboardToClone) {
          // 패널 복제 (옵션 및 위치 정보 포함)
          const newPanels = dashboardToClone.panels?.map((panel) => ({
            ...panel,
            panelId: crypto.randomUUID(), // 새로운 panelId 생성
          }));

          // 새 대시보드 생성 (패널 정보 포함)
          const newDashboard = {
            ...dashboardToClone,
            id: newDashboardId,
            label: `${dashboardToClone.label}_copy`,
            panels: newPanels,
          };

          set((state) => ({
            dashboardList: [...state.dashboardList, newDashboard],
          }));
        }
      },
    })),
    {
      name: "dashboard-storage", // persist 미들웨어 적용 (새로고침해도 유지)
    }
  )
);
