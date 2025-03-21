import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { useDashboardStore } from "./useDashboardStore";
import { WidgetOptions } from "../types/options";

interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Widget {
  widgetId: string;
  widgetOptions: WidgetOptions;
  gridPos: GridPosition; // gridPos를 필수 필드로 변경
}

interface WidgetStore {
  widgets: Record<string, Widget[]>; // 대시보드 ID → 위젯 배열
  addWidget: (
    dashboardId: string,
    widgetOptions: Omit<WidgetOptions, "widgetId">,
    gridPos?: GridPosition
  ) => void;
  updateWidget: (
    dashboardId: string,
    widgetId: string,
    widgetOptions: WidgetOptions,
    gridPos?: GridPosition
  ) => void;
  removeWidget: (dashboardId: string, widgetId: string) => void;
  cloneWidget: (dashboardId: string, widgetId: string) => void;
}

export const useWidgetStore = create<WidgetStore>()(
  persist(
    devtools((set, get) => ({
      widgets: {},

      // 위젯 추가 (gridPos 기본값 추가)
      addWidget: (
        dashboardId,
        widgetOptions,
        gridPos = { x: 0, y: 0, w: 4, h: 4 }
      ) => {
        const newWidgetId = uuidv4();
        const newWidget: Widget = {
          widgetId: newWidgetId,
          widgetOptions: { ...widgetOptions, widgetId: newWidgetId },
          gridPos,
        };

        set((state) => ({
          widgets: {
            ...state.widgets,
            [dashboardId]: [...(state.widgets[dashboardId] || []), newWidget],
          },
        }));

        useDashboardStore
          .getState()
          .addPanelToDashboard(dashboardId, newWidgetId, "widget", gridPos);
      },

      // 위젯 수정 (gridPos 필수 적용)
      updateWidget: (dashboardId, widgetId, widgetOptions, gridPos) => {
        set((state) => ({
          widgets: {
            ...state.widgets,
            [dashboardId]: state.widgets[dashboardId]?.map((widget) =>
              widget.widgetId === widgetId
                ? {
                    ...widget,
                    widgetOptions,
                    gridPos: gridPos || widget.gridPos,
                  }
                : widget
            ),
          },
        }));
      },
    })),
    {
      name: "widget-storage",
    }
  )
);
