"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";

import { MoreVertical } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Alert from "@/components/alert/alert";
import TabMenu from "@/components/menu/tabMenu";
import CustomTable from "@/components/table/customTable";
import {
  MIN_WIDGET_HEIGHT,
  MIN_CHART_WIDTH,
  MIN_CHART_HEIGHT,
  MIN_WIDGET_WIDTH,
} from "@/data/chart/chartDetail";
import { useChartStore } from "@/store/useChartStore";
import { useDashboardStore, PanelLayout } from "@/store/useDashboardStore";
import { useWidgetStore } from "@/store/useWidgetStore";
import { convertToTable } from "@/utils/convertToTable";
import AddChartBar from "@/components/bar/addChartBar";
import TimeRangeBar from "@/components/bar/timeRangeBar";
import ChartPannel from "@/components/pannel/chart/chartPannel";
import WidgetPannel from "@/components/pannel/widget/widgetPannel";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DetailDashboard = () => {
  const router = useRouter();
  const id = useSearchParams();
  const dashboardId = id.get("id") || "1";

  const { charts, addChart, removeChart } = useChartStore();
  const { widgets, addWidget, removeWidget } = useWidgetStore();
  const { dashboardPanels, addPanelToDashboard, dashboardList, saveDashboard } =
    useDashboardStore();

  console.log("📌 현재 대시보드 ID:", dashboardId);
  console.log("📌 해당 대시보드의 차트 목록:", charts[dashboardId]);

  console.log(charts);

  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [refreshTime, setRefreshTime] = useState<number | "autoType">(10);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [menuOpenIndex, setMenuOpenIndex] = useState<string | null>(null);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState<boolean>(false);
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(
    null
  );
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [gridLayout, setGridLayout] = useState<
    { i: string; x: number; y: number; w: number; h: number }[]
  >([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [prevLayout, setPrevLayout] = useState<Layout[]>([]);

  const layouts = useMemo(() => ({ lg: gridLayout }), [gridLayout]);

  const handleEditClick = () => {
    if (isEditing) {
      const updatedLayouts: PanelLayout[] = gridLayout.map((layout) => ({
        panelId: layout.i,
        type: charts[dashboardId]?.some((chart) => chart.chartId === layout.i)
          ? "chart"
          : "widget",
        gridPos: {
          x: layout.x,
          y: layout.y,
          w: layout.w,
          h: layout.h,
        },
      }));

      console.log("저장할 패널 데이터:", updatedLayouts);
      saveDashboard(dashboardId, updatedLayouts);
      setPrevLayout(
        updatedLayouts.map((panel) => ({ ...panel.gridPos, i: panel.panelId }))
      );
    }
    setIsEditing((prev) => !prev);
  };

  const chartDataList = charts[dashboardId] || [];

  const widgetDataList = widgets[dashboardId] || [];

  const handleTabClone = (itemId: string) => {
    setSelectedItem(itemId);
    setIsCloneModalOpen(true);
  };

  const confirmClone = () => {
    if (!selectedDashboard || !selectedItem) return;

    const targetDashboardId = selectedDashboard;
    let newItemId: string | null = null;

    // 차트 복제
    const existingChart = Object.values(charts)
      .flat()
      .find((chart) => chart.chartId === selectedItem);

    if (existingChart) {
      const newChartId = uuidv4();
      const clonedChartOptions = { ...existingChart.chartOptions };
      const clonedDatasets = existingChart.datasets.map((dataset) => ({
        ...dataset,
      }));

      // gridPos 복사 (기존 위치 유지)
      const clonedGridPos = { ...existingChart.gridPos };

      addChart(targetDashboardId, clonedChartOptions, clonedDatasets);
      addPanelToDashboard(targetDashboardId, newChartId, "chart");

      newItemId = newChartId;

      saveDashboard(targetDashboardId, [
        ...(dashboardPanels[targetDashboardId] || []),
        {
          panelId: newChartId,
          type: "chart",
          gridPos: clonedGridPos, // 기존 gridPos를 유지
        },
      ]);
    }

    // 위젯 복제
    const existingWidget = Object.values(widgets)
      .flat()
      .find((widget) => widget.widgetId === selectedItem);

    if (existingWidget) {
      const newWidgetId = uuidv4();
      const clonedWidgetOptions = {
        ...existingWidget.widgetOptions,
        widgetId: newWidgetId,
      };

      // gridPos 복사 (기존 위치 유지)
      const clonedGridPos = { ...existingWidget.gridPos };

      addWidget(targetDashboardId, clonedWidgetOptions);
      addPanelToDashboard(targetDashboardId, newWidgetId, "widget");

      newItemId = newWidgetId;

      saveDashboard(targetDashboardId, [
        ...(dashboardPanels[targetDashboardId] || []),
        {
          panelId: newWidgetId,
          type: "widget",
          gridPos: clonedGridPos, // 기존 gridPos를 유지
        },
      ]);
    }

    setIsCloneModalOpen(false);
    setAlertMessage("복제 완료!");
  };

  console.log("이거 왜 안보일까 >>>", dashboardPanels[dashboardId]);

  useEffect(() => {
    if (
      dashboardPanels[dashboardId] &&
      dashboardPanels[dashboardId].length > 0 &&
      gridLayout.length === 0
    ) {
      const savedLayout = dashboardPanels[dashboardId].map((panel) => ({
        i: panel.panelId,
        x: panel.gridPos?.x ?? 0,
        y: panel.gridPos?.y ?? 0,
        w: panel.gridPos?.w ?? 4,
        h: panel.gridPos?.h ?? 4,
      }));

      console.log("📌 Zustand에서 불러온 gridLayout 설정: ", savedLayout);
      setGridLayout(savedLayout);
      setPrevLayout(savedLayout);
    }
  }, [dashboardPanels, dashboardId]);

  const closeCloneModal = () => {
    setIsCloneModalOpen(false);
    setSelectedDashboard(null);
  };

  const handleLayoutChange = (layout: Layout[]) => {
    if (JSON.stringify(prevLayout) === JSON.stringify(layout)) {
      return;
    }

    const updatedLayouts: PanelLayout[] = layout.map((l) => {
      const chartExists = charts[dashboardId]?.some(
        (chart) => chart.chartId === l.i
      );
      const widgetExists = widgets[dashboardId]?.some(
        (widget) => widget.widgetId === l.i
      );

      return {
        panelId: l.i,
        type: chartExists ? "chart" : widgetExists ? "widget" : "chart",
        gridPos: {
          // gridPos를 올바르게 업데이트
          x: l.x,
          y: l.y,
          w: l.w,
          h: l.h,
        },
      };
    });

    setGridLayout(layout);
    setPrevLayout(layout);
    saveDashboard(dashboardId, updatedLayouts);
  };

  return (
    <div className=" min-h-[calc(100vh-80px)]">
      <AddChartBar
        isEdit={isEditing}
        onCreateClick={() => router.push(`/d?id=${dashboardId}`)}
        modifiable={true}
        onEditClick={handleEditClick}
      />

      <TimeRangeBar
        from={from}
        to={to}
        lastUpdated={lastUpdated}
        refreshTime={refreshTime}
        onChange={(type, value) =>
          type === "from" ? setFrom(value) : setTo(value)
        }
        onRefreshChange={setRefreshTime}
      />
      <div className="relative w-full">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          rowHeight={70}
          isDraggable={isEditing}
          isResizable={isEditing}
          compactType={null}
          preventCollision={true}
          onLayoutChange={handleLayoutChange}
          maxRows={20} // 최대 줄 수 제한
          draggableHandle=".drag-handle"
          resizeHandles={["se"]}
        >
          {chartDataList.map((chart) => {
            const chartLayout = gridLayout.find(
              (item) => item.i === chart.chartId
            ) || {
              i: chart.chartId,
              x: 0,
              y: 0,
              w: 4,
              h: Math.max(MIN_WIDGET_HEIGHT, 4),
              minW: MIN_CHART_WIDTH,
              minH: MIN_CHART_HEIGHT,
            };

            return (
              <div
                key={chart.chartId}
                data-grid={{
                  ...chartLayout,
                  minW: MIN_CHART_WIDTH,
                  minH: MIN_CHART_HEIGHT,
                }}
                className={`drag-handle cursor-grab`}
              >
                <div className=" p-2 h-full flex flex-col relative">
                  {/* 메뉴 버튼 (기존 유지) */}
                  <div className="absolute top-2 right-2 z-10 pointer-events-auto">
                    <MoreVertical
                      className="text-text3 cursor-pointer hover:text-text2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenIndex(
                          menuOpenIndex === chart.chartId ? null : chart.chartId
                        );
                      }}
                    />
                    {menuOpenIndex === chart.chartId && (
                      <TabMenu
                        index={chart.chartId}
                        setEditingTabIndex={() =>
                          router.push(
                            `/d?id=${dashboardId}&chartId=${chart.chartId}`
                          )
                        }
                        setIsModalOpen={() => {}}
                        setMenuOpenIndex={setMenuOpenIndex}
                        handleTabDelete={() =>
                          removeChart(dashboardId, chart.chartId)
                        }
                        handleTabClone={handleTabClone}
                      />
                    )}
                  </div>

                  {/* 제목 */}
                  <h2 className="text-base font-normal mb-2 text-modern-text">
                    {chart.chartOptions.titleText}
                  </h2>

                  {/* 차트 또는 테이블 렌더링 */}
                  <div className="flex-1 overflow-hidden">
                    {chart.chartOptions.displayMode === "chart" ? (
                      <ChartPannel
                        type={chart.chartOptions.chartType}
                        datasets={chart.datasets || []}
                        options={chart.chartOptions}
                      />
                    ) : (
                      <CustomTable
                        columns={[
                          { key: "name", label: "ID" },
                          ...chart.datasets.map((dataset) => ({
                            key: dataset.label,
                            label: dataset.label,
                          })),
                        ]}
                        data={convertToTable(chart.datasets).rows}
                        title={chart.chartOptions.titleText}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {widgetDataList.map((widget) => {
            const widgetLayout = gridLayout.find(
              (item) => item.i === widget.widgetId
            ) || {
              i: widget.widgetId,
              x: 0,
              y: 0,
              w: 4, // 기본 가로 크기
              h: Math.max(MIN_WIDGET_HEIGHT, 4), // 기본 세로 크기
              minW: MIN_WIDGET_WIDTH, // 최소 가로 크기 설정
              minH: MIN_WIDGET_HEIGHT, // 최소 세로 크기 설정
            };

            return (
              <div
                key={widget.widgetId}
                data-grid={{
                  ...widgetLayout, // widgetLayout에서 x, y, w, h 값을 그대로 사용
                  minW: 2,
                  maxW: 4,
                  minH: MIN_WIDGET_HEIGHT, // 최소 세로 크기 설정
                }}
                className="drag-handle cursor-grab widget-item"
              >
                {/* max-h-[230px] max-w-[530px] */}
                <div className="relative flex flex-col h-full min-w-72 min-h-32">
                  <div className="absolute top-2 right-2 z-10 pointer-events-auto">
                    <MoreVertical
                      className="text-text3 cursor-pointer hover:text-text2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenIndex(
                          menuOpenIndex === widget.widgetId
                            ? null
                            : widget.widgetId
                        );
                      }}
                    />
                    {menuOpenIndex === widget.widgetId && (
                      <TabMenu
                        index={widget.widgetId}
                        setEditingTabIndex={() =>
                          router.push(
                            `/d?id=${dashboardId}&chartId=${widget.widgetId}`
                          )
                        }
                        setIsModalOpen={() => {}}
                        setMenuOpenIndex={setMenuOpenIndex}
                        handleTabDelete={() =>
                          removeWidget(dashboardId, widget.widgetId)
                        }
                        handleTabClone={handleTabClone}
                      />
                    )}
                  </div>
                  {/* 위젯 렌더링 */}
                  <WidgetPannel
                    backgroundColor={widget.widgetOptions.widgetBackgroundColor}
                    {...widget.widgetOptions}
                    className="scale-[1] w-full h-full"
                  />
                </div>
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </div>
      {isCloneModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">대시보드 선택</h2>
            <ul>
              {dashboardList.map((dashboard) => (
                <li
                  key={dashboard.id}
                  onClick={() => setSelectedDashboard(dashboard.id)}
                  className={`cursor-pointer p-2 rounded ${
                    selectedDashboard === dashboard.id
                      ? "bg-modern-btn text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {dashboard.label}
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeCloneModal}
                className="mr-2 px-4 py-2 bg-gray-200 rounded text-md2"
              >
                취소
              </button>
              <button
                onClick={confirmClone}
                disabled={!selectedDashboard}
                className={`px-4 py-2 rounded text-md2 text-white ${
                  selectedDashboard
                    ? "bg-modern-btn"
                    : "bg-modern-btn opacity-80"
                }`}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
      {alertMessage && <Alert message={alertMessage} />}
    </div>
  );
};

export default DetailDashboard;
