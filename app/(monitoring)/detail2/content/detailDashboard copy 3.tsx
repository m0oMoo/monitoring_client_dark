"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { MoreVertical } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { isEqual } from "lodash";

import Alert from "@/components/alert/alert";
import TabMenu from "@/components/menu/tabMenu";
import CustomTable from "@/components/table/customTable";
import ChartPannel from "@/components/pannel/chart/chartPannel";
import WidgetPannel from "@/components/pannel/widget/widgetPannel";

import { useDashboardStore2 } from "@/store/useDashboard2Store";
import { convertToTable } from "@/utils/convertToTable";
import {
  MIN_CHART_HEIGHT,
  MIN_CHART_WIDTH,
  MIN_WIDGET_HEIGHT,
  MIN_WIDGET_WIDTH,
} from "@/data/chart/chartDetail";
import { Dashboard, Dataset } from "@/types/dashboard";
import { useDraftDashboardStore } from "@/store/useDraftDashboardStore";
import DashboardLayout from "@/components/layout/dashboard/layout";
import { useDashboardStateStore } from "@/store/useDashboardStateStore";
import { useTempPanelStore } from "@/store/useTempPanelStore";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DetailDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id");

  const {
    getDashboardById,
    clonePannelToDashboard,
    dashboardList,
    addDashboard,
    updateDashboard,
  } = useDashboardStore2();

  const { draftDashboard } = useDraftDashboardStore();
  const { title, description } = useDashboardStateStore();
  const {
    tempPanel,
    setTempPanel,
    tempPanelTargetDashboardId,
    clearTempPanel,
  } = useTempPanelStore();

  const [dashboardId, setDashboardId] = useState<string>(initialId || "1");
  const [dashboard, setDashboard] = useState<Dashboard>();
  const [menuOpenIndex, setMenuOpenIndex] = useState<string | null>(null);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState<boolean>(false);
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(
    null
  );
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [gridLayout, setGridLayout] = useState<Layout[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const displayedPanels = useMemo(() => {
    const base = dashboard?.pannels ?? [];
    if (tempPanel && tempPanelTargetDashboardId === dashboardId) {
      const isEdit = base.some((p) => p.pannelId === tempPanel.pannelId);
      return isEdit
        ? base.map((p) => (p.pannelId === tempPanel.pannelId ? tempPanel : p))
        : [...base, tempPanel];
    }
    return base;
  }, [dashboard, tempPanel, tempPanelTargetDashboardId, dashboardId]);

  const layouts = useMemo(() => ({ lg: gridLayout }), [gridLayout]);

  useEffect(() => {
    if (dashboard) {
      const newLayout = displayedPanels.map((panel) => ({
        i: panel.pannelId,
        x: panel.gridPos.x,
        y: panel.gridPos.y,
        w: panel.gridPos.w,
        h: panel.gridPos.h,
        minW:
          panel.pannelType === "widget" ? MIN_WIDGET_WIDTH : MIN_CHART_WIDTH,
        minH:
          panel.pannelType === "widget" ? MIN_WIDGET_HEIGHT : MIN_CHART_HEIGHT,
      }));
      setGridLayout(newLayout);
    }
  }, [displayedPanels, dashboard, isEditing]);

  useEffect(() => {
    if (dashboardId === draftDashboard?.id) {
      setDashboard(draftDashboard);
    } else {
      const fetched = getDashboardById(dashboardId);
      if (fetched) setDashboard(fetched);
    }
  }, [dashboardId, draftDashboard]);

  const handleLayoutChange = useCallback(
    (layout: Layout[]) => {
      // 실제 레이아웃 변경 여부를 엄격하게 확인
      const hasActualChange = layout.some((newItem, index) => {
        const oldItem = gridLayout[index];
        return (
          !oldItem ||
          oldItem.x !== newItem.x ||
          oldItem.y !== newItem.y ||
          oldItem.w !== newItem.w ||
          oldItem.h !== newItem.h
        );
      });

      if (!hasActualChange) return;

      // 새로운 레이아웃으로 업데이트
      setGridLayout(layout);

      // 임시 패널의 레이아웃만 업데이트
      if (tempPanel && tempPanelTargetDashboardId === dashboardId) {
        const item = layout.find((l) => l.i === tempPanel.pannelId);
        if (item) {
          const newGridPos = { x: item.x, y: item.y, w: item.w, h: item.h };
          // 실제 그리드 위치가 변경된 경우에만 업데이트
          if (!isEqual(newGridPos, tempPanel.gridPos)) {
            setTempPanel({ ...tempPanel, gridPos: newGridPos }, dashboardId);
          }
        }
      }
    },
    [
      gridLayout,
      tempPanel,
      tempPanelTargetDashboardId,
      dashboardId,
      setTempPanel,
    ]
  );

  const handleSaveDashboard = () => {
    if (displayedPanels.length === 0) {
      setAlertMessage(
        "패널을 하나 이상 추가해야 대시보드를 저장할 수 있습니다."
      );
      return;
    }

    let finalPanels = dashboard?.pannels ?? [];
    if (tempPanel && tempPanelTargetDashboardId === dashboardId) {
      const isEdit = finalPanels.some((p) => p.pannelId === tempPanel.pannelId);
      finalPanels = isEdit
        ? finalPanels.map((p) =>
            p.pannelId === tempPanel.pannelId ? tempPanel : p
          )
        : [...finalPanels, tempPanel];
    }

    // ✅ gridLayout의 위치 정보를 반영
    const updatedPanels = finalPanels.map((panel) => {
      const layout = gridLayout.find((item) => item.i === panel.pannelId);
      if (!layout) return panel;
      return {
        ...panel,
        gridPos: {
          x: layout.x,
          y: layout.y,
          w: layout.w,
          h: layout.h,
        },
      };
    });

    const updated: Dashboard = {
      ...dashboard!,
      label: title,
      description,
      pannels: updatedPanels,
    };

    if (dashboardId !== draftDashboard?.id) {
      updateDashboard(updated);
      setDashboard(updated);
      clearTempPanel();
      setAlertMessage("대시보드가 업데이트되었습니다.");
    } else {
      addDashboard(updated);
      const newId = uuidv4();
      setDashboardId(newId);
      router.replace(`/detail2?id=${newId}`);
      setAlertMessage("대시보드가 저장되었습니다.");
    }
  };

  const handleCancel = () => {
    if (dashboard) {
      // 패널 원복
      setDashboard(dashboard); // 💡 패널 복원

      // 레이아웃 복원
      const originalLayout = dashboard.pannels.map((panel) => ({
        i: panel.pannelId,
        x: panel.gridPos.x,
        y: panel.gridPos.y,
        w: panel.gridPos.w,
        h: panel.gridPos.h,
        minW:
          panel.pannelType === "widget" ? MIN_WIDGET_WIDTH : MIN_CHART_WIDTH,
        minH:
          panel.pannelType === "widget" ? MIN_WIDGET_HEIGHT : MIN_CHART_HEIGHT,
      }));

      setGridLayout(originalLayout); // 💡 레이아웃 복원
    }

    clearTempPanel();
    setIsEditing(false);
    setAlertMessage("Changes canceled");
  };

  const confirmClone = () => {
    if (selectedItem && selectedDashboard) {
      clonePannelToDashboard(dashboardId, selectedItem, selectedDashboard);
      setAlertMessage("복제 완료!");
    }
    setIsCloneModalOpen(false);
    setSelectedItem(null);
    setSelectedDashboard(null);
  };

  // 패널 수정으로 이동하는 함수
  const handlePanelEdit = (pannelId: string) => {
    if (isEditing) {
      router.push(`/d2?id=${dashboardId}&pannelId=${pannelId}`);
    } else {
      setAlertMessage("편집 모드에서만 패널을 수정할 수 있습니다.");
    }
  };

  // 패널 삭제 함수
  const handlePanelDelete = (pannelId: string) => {
    if (!isEditing) {
      setAlertMessage("편집 모드에서만 패널을 삭제할 수 있습니다.");
      return;
    }

    if (tempPanel && tempPanel.pannelId === pannelId) {
      clearTempPanel();
      setAlertMessage("임시 패널이 삭제되었습니다.");
      return;
    }

    if (!dashboard) return;

    const remainingPanels = dashboard.pannels.filter(
      (p) => p.pannelId !== pannelId
    );

    // ✅ 현재 gridLayout 기준으로 위치 정보 갱신
    const updatedPanels = remainingPanels.map((panel) => {
      const layout = gridLayout.find((item) => item.i === panel.pannelId);
      return layout
        ? {
            ...panel,
            gridPos: {
              x: layout.x,
              y: layout.y,
              w: layout.w,
              h: layout.h,
            },
          }
        : panel;
    });

    // ✅ UI에만 반영
    setDashboard({ ...dashboard, pannels: updatedPanels });
    setAlertMessage("패널이 삭제되었습니다. 저장하려면 Save를 누르세요.");
  };

  // 패널 복제 함수
  const handleTabClone = (itemId: string) => {
    setSelectedItem(itemId);
    setIsCloneModalOpen(true);
  };

  return (
    <div className="bg-modern-bg min-h-[calc(100vh-80px)]">
      <DashboardLayout
        isEdit={!isEditing}
        onCreateClick={() => router.push(`/d2?id=${dashboardId}`)}
        modifiable={true}
        onEditClick={() => {
          if (!isEditing) {
            // 읽기 전용 -> 수정 모드로 진입
            setIsEditing(true);
            setAlertMessage("Edit Mode Activated");
          } else {
            // 수정 모드 -> 읽기 전용으로 저장 후 전환
            handleSaveDashboard();
            setIsEditing(false);
          }
        }}
        onCancelClick={handleCancel}
      >
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          rowHeight={70}
          isDraggable={isEditing}
          isResizable={isEditing}
          compactType={null}
          preventCollision={true}
          onLayoutChange={handleLayoutChange}
          maxRows={20}
          draggableHandle=".drag-handle"
          resizeHandles={["se"]}
        >
          {displayedPanels.map((panel) => {
            const layout = gridLayout.find(
              (item) => item.i === panel.pannelId
            ) || {
              i: panel.pannelId,
              x: 0,
              y: 0,
              w: 4,
              h: 4,
              minW: MIN_CHART_WIDTH,
              minH: MIN_CHART_HEIGHT,
            };

            return (
              <div key={panel.pannelId} data-grid={layout}>
                {isEditing && (
                  <div
                    className="absolute top-2 right-2 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <MoreVertical
                      className="text-text3 cursor-pointer hover:text-text2"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setMenuOpenIndex(
                          menuOpenIndex === panel.pannelId
                            ? null
                            : panel.pannelId
                        );
                      }}
                    />
                    {menuOpenIndex === panel.pannelId && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                      >
                        <TabMenu
                          index={panel.pannelId}
                          setEditingTabIndex={() =>
                            handlePanelEdit(panel.pannelId)
                          }
                          setIsModalOpen={() => {}}
                          setMenuOpenIndex={setMenuOpenIndex}
                          handleTabDelete={() =>
                            handlePanelDelete(panel.pannelId)
                          }
                          handleTabClone={handleTabClone}
                        />
                      </div>
                    )}
                  </div>
                )}
                <div className="drag-handle cursor-grab bg-modern-bg p-2 h-full flex flex-col relative">
                  <h2 className="text-base font-normal mb-2 text-modern-text">
                    {panel.pannelType === "widget"
                      ? panel.pannelOptions.label
                      : panel.pannelOptions.titleText}
                  </h2>

                  <div className="flex-1 overflow-hidden">
                    {panel.pannelType === "widget" ? (
                      <WidgetPannel
                        {...panel.pannelOptions}
                        backgroundColor={
                          panel.pannelOptions.widgetBackgroundColor
                        }
                        className="scale-[1] w-full h-full"
                      />
                    ) : panel.pannelOptions.displayMode === "chart" ? (
                      <ChartPannel
                        type={panel.pannelOptions.chartType}
                        datasets={panel.datasets || []}
                        options={panel.pannelOptions}
                      />
                    ) : (
                      <CustomTable
                        columns={[
                          { key: "name", label: "ID" },
                          ...(panel.datasets
                            ? panel.datasets.map((dataset: Dataset) => ({
                                key: dataset.label,
                                label: dataset.label,
                              }))
                            : []), // datasets가 undefined일 경우 빈 배열 반환
                        ]}
                        data={convertToTable(panel.datasets || []).rows}
                        title={panel.pannelOptions.titleText}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </DashboardLayout>

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
                onClick={() => {
                  setIsCloneModalOpen(false);
                  setSelectedDashboard(null);
                }}
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
