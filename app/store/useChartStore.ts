import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { Dataset } from "../context/chartOptionContext";
import { ChartOptions } from "../types/options";
import { useDashboardStore } from "./useDashboardStore";

interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Chart {
  chartId: string;
  chartOptions: ChartOptions;
  datasets: Dataset[];
  gridPos: GridPosition; // gridPos를 필수 필드로 변경
}

interface ChartStore {
  charts: Record<string, Chart[]>; // 대시보드 ID → 차트 배열
  addChart: (
    dashboardId: string,
    chartOptions: ChartOptions,
    datasets: Dataset[],
    gridPos?: GridPosition
  ) => void;
  updateChart: (
    dashboardId: string,
    chartId: string,
    chartOptions: ChartOptions,
    datasets: Dataset[],
    gridPos?: GridPosition
  ) => void;
  removeChart: (dashboardId: string, chartId: string) => void;
  cloneChart: (dashboardId: string, chartId: string) => void;
}

export const useChartStore = create<ChartStore>()(
  persist(
    devtools((set, get) => ({
      charts: {},

      // 차트 추가 (gridPos 기본값 추가)
      addChart: (
        dashboardId,
        chartOptions,
        datasets,
        gridPos = { x: 0, y: 0, w: 4, h: 4 }
      ) => {
        const newChartId = uuidv4();
        set((state) => ({
          charts: {
            ...state.charts,
            [dashboardId]: [
              ...(state.charts[dashboardId] || []),
              { chartId: newChartId, chartOptions, datasets, gridPos },
            ],
          },
        }));

        useDashboardStore
          .getState()
          .addPanelToDashboard(dashboardId, newChartId, "chart", gridPos);
      },

      // 차트 수정 (gridPos 필수 적용)
      updateChart: (dashboardId, chartId, chartOptions, datasets, gridPos) => {
        set((state) => ({
          charts: {
            ...state.charts,
            [dashboardId]: state.charts[dashboardId]?.map((chart) =>
              chart.chartId === chartId
                ? {
                    ...chart,
                    chartOptions,
                    datasets,
                    gridPos: gridPos || chart.gridPos,
                  }
                : chart
            ),
          },
        }));
      },

      // 차트 삭제
      removeChart: (dashboardId, chartId) => {
        set((state) => ({
          charts: {
            ...state.charts,
            [dashboardId]: state.charts[dashboardId]?.filter(
              (chart) => chart.chartId !== chartId
            ),
          },
        }));

        useDashboardStore
          .getState()
          .removeChartFromDashboard(dashboardId, chartId);
      },

      // 차트 복제 (gridPos 포함)
      cloneChart: (dashboardId, chartId) => {
        const state = get();
        const chart = state.charts[dashboardId]?.find(
          (c) => c.chartId === chartId
        );
        if (!chart) return;

        const newChartId = uuidv4();
        set((state) => ({
          charts: {
            ...state.charts,
            [dashboardId]: [
              ...state.charts[dashboardId],
              { ...chart, chartId: newChartId, gridPos: { ...chart.gridPos } },
            ],
          },
        }));

        useDashboardStore
          .getState()
          .addPanelToDashboard(dashboardId, newChartId, "chart");
      },
    })),
    {
      name: "chart-storage",
    }
  )
);
