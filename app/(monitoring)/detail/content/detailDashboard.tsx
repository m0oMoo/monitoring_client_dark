"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { MoreVertical } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

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
import { useEditStateStore } from "@/store/useEditStateStore";
import CloneModal from "@/components/modal/cloneModal";

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
    tempPanels,
    targetDashboardId,
    setTempPanels,
    setTempPanel,
    updateTempPanelLayout,
    clearTempPanels,
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
  const [panels, setPanels] = useState<any[]>([]);
  const [deletedPanelIds, setDeletedPanelIds] = useState<string[]>([]);

  const layouts = useMemo(() => ({ lg: gridLayout }), [gridLayout]);

  const isEditing = useEditStateStore(
    (state) => state.editStates[dashboardId] ?? false
  );
  const setEditState = useEditStateStore((state) => state.setEditState);

  // 대시보드 및 패널 로딩
  useEffect(() => {
    // draftDashboard가 있을 때만 설정
    if (dashboardId === draftDashboard?.id) {
      setDashboard(draftDashboard); // 기존 대시보드 로드
      setEditState(draftDashboard?.id, true);
    } else {
      const fetchedDashboard = getDashboardById(dashboardId);
      if (fetchedDashboard) {
        setDashboard(fetchedDashboard); // 기존 대시보드 로드
      } else {
        console.log("대시보드가 없습니다."); // 대시보드가 없을 경우 로깅
      }
    }
  }, [dashboardId, draftDashboard]);

  const handleLayoutChange = (layout: Layout[]) => {
    const updatedPanels = panels.map((panel) => {
      const updatedLayout = layout.find((item) => item.i === panel.pannelId);
      if (!updatedLayout) return panel;

      const updatedPanel = {
        ...panel,
        gridPos: {
          x: updatedLayout.x,
          y: updatedLayout.y,
          w: updatedLayout.w,
          h: updatedLayout.h,
        },
      };

      // 임시 패널이면 store에도 반영
      if (targetDashboardId === dashboardId && tempPanels[panel.pannelId]) {
        updateTempPanelLayout(panel.pannelId, updatedPanel.gridPos);
      } else if (targetDashboardId === dashboardId) {
        // 기존 패널이지만 위치만 변경한 경우에도 store에 등록
        setTempPanel(updatedPanel, dashboardId);
      }

      return updatedPanel;
    });

    setPanels(updatedPanels);
    setGridLayout(layout);
  };

  const handleSaveDashboard = () => {
    if (panels.length === 0) {
      setAlertMessage(
        "패널을 하나 이상 추가해야 대시보드를 저장할 수 있습니다."
      );
      return;
    }

    // tempPanel 병합 처리
    let finalPanels = [...panels];

    // tempPanels 병합
    if (targetDashboardId === dashboardId) {
      Object.entries(tempPanels).forEach(([pannelId, tempPanel]) => {
        const isEdit = finalPanels.some((p) => p.pannelId === pannelId);
        if (isEdit) {
          finalPanels = finalPanels.map((p) =>
            p.pannelId === pannelId ? tempPanel : p
          );
        } else {
          finalPanels.push(tempPanel);
        }
      });
    }

    const updatedDashboard: Dashboard = {
      id: dashboardId === draftDashboard?.id ? draftDashboard?.id : dashboardId,
      label: title,
      description,
      pannels: finalPanels,
    };

    if (dashboardId !== draftDashboard?.id) {
      updateDashboard(updatedDashboard);
      setDashboard(updatedDashboard);
      setAlertMessage("대시보드가 업데이트되었습니다.");
    } else {
      addDashboard(updatedDashboard);
      setDashboard(updatedDashboard);
      const newId = uuidv4();
      setDashboardId(newId);
      // router.replace(`/detail?id=${newId}`);
      setAlertMessage("대시보드가 저장되었습니다.");
    }

    clearTempPanels(); // 💥 저장 후 임시 저장 제거
  };

  const handleEditClick = () => {
    if (isEditing) {
      handleSaveDashboard(); // 저장 버튼 클릭 시 저장 처리
    }
    setEditState(dashboardId, !isEditing);
  };

  const handleTabClone = (itemId: string) => {
    setSelectedItem(itemId);
    setIsCloneModalOpen(true);
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

  // 항상 병합 기준: dashboard.pannels + panels + tempPanel (가장 우선순위)
  type PanelMapValue = any; // 필요 시 타입 정리 가능
  useEffect(() => {
    if (!dashboard) return;

    const savedPanels = dashboard.pannels ?? [];
    const panelMap = new Map<string, PanelMapValue>();

    // 1. dashboard에 저장된 패널
    savedPanels.forEach((p) => {
      if (!deletedPanelIds.includes(p.pannelId)) {
        panelMap.set(p.pannelId, p);
      }
    });

    // 2. panels 상태값 (위치 최신화 반영)
    panels.forEach((p) => {
      if (!deletedPanelIds.includes(p.pannelId)) {
        const prev = panelMap.get(p.pannelId);
        panelMap.set(p.pannelId, {
          ...(prev || p),
          gridPos: p.gridPos, // 위치 최신 반영
        });
      }
    });

    // 3. tempPanels는 최종적으로 덮어쓰기 (가장 우선순위)
    if (targetDashboardId === dashboardId) {
      Object.entries(tempPanels).forEach(([pannelId, tempPanel]) => {
        if (!deletedPanelIds.includes(pannelId)) {
          panelMap.set(pannelId, tempPanel);
        }
      });
    }

    const mergedPanels = Array.from(panelMap.values());
    setPanels(mergedPanels);
    setGridLayout(
      mergedPanels.map((panel) => ({
        i: panel.pannelId,
        x: panel.gridPos.x,
        y: panel.gridPos.y,
        w: panel.gridPos.w,
        h: panel.gridPos.h,
        minW:
          panel.pannelType === "widget" ? MIN_WIDGET_WIDTH : MIN_CHART_WIDTH,
        minH:
          panel.pannelType === "widget" ? MIN_WIDGET_HEIGHT : MIN_CHART_HEIGHT,
      }))
    );
  }, [
    dashboard?.id,
    JSON.stringify(dashboard?.pannels),
    JSON.stringify(tempPanels),
    targetDashboardId,
    dashboardId,
    JSON.stringify(panels),
    JSON.stringify(deletedPanelIds),
  ]);

  const handleCancel = () => {
    clearTempPanels();
    setDeletedPanelIds([]);

    if (dashboard) {
      setPanels(dashboard.pannels);
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

      setGridLayout(originalLayout);
    }

    setEditState(dashboardId, false);
  };

  const handlePanelDelete = (pannelId: string) => {
    if (!isEditing) {
      setAlertMessage("편집 모드에서만 패널을 삭제할 수 있습니다.");
      return;
    }

    const newPanels = panels.filter((p) => p.pannelId !== pannelId);
    const newLayout = gridLayout.filter((l) => l.i !== pannelId);

    const isTempPanel = tempPanels[pannelId];
    const isInOriginalDashboard =
      dashboard?.pannels.some((p) => p.pannelId === pannelId) ?? false;

    // tempPanel인데, 원래 대시보드에는 없는 완전 신규 → 임시 패널 삭제
    if (isTempPanel && !isInOriginalDashboard) {
      const updated = { ...tempPanels };
      delete updated[pannelId];

      setTempPanels(updated);
      setPanels(newPanels);
      setGridLayout(newLayout);
      setAlertMessage("임시 패널이 삭제되었습니다.");
      return;
    }

    // 기존 대시보드에 있던 패널 삭제
    setDeletedPanelIds((prev) => [...prev, pannelId]);

    // 임시 저장에 있으면 같이 제거 (위치만 바꿔서 들어간 경우)
    if (isTempPanel) {
      const updated = { ...tempPanels };
      delete updated[pannelId];
      setTempPanels(updated);
    }

    setPanels(newPanels);
    setGridLayout(newLayout);
    setAlertMessage("패널이 삭제되었습니다. 저장하려면 Save를 누르세요.");
  };

  // 패널 수정으로 이동하는 함수 (라우팅)
  const handlePanelEdit = (pannelId: string) => {
    if (isEditing) {
      router.push(`/d?id=${dashboardId}&pannelId=${pannelId}`);
    } else {
      setAlertMessage("편집 모드에서만 패널을 수정할 수 있습니다.");
    }
  };

  return (
    <div className=" min-h-[calc(100vh-80px)] pt-6">
      <DashboardLayout
        onCreateClick={() => {
          router.push(`/d?id=${dashboardId}`);
        }}
        onGridChange={() => {}}
        modifiable={true}
        onEditClick={handleEditClick}
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
          {panels.map((panel) => {
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
              <div
                key={panel.pannelId}
                data-grid={layout}
                //   className="drag-handle cursor-grab"
              >
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
                <div className="drag-handle cursor-grab  p-2 h-full flex flex-col relative">
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
        <CloneModal
          dashboardList={dashboardList}
          selectedDashboard={selectedDashboard}
          setSelectedDashboard={setSelectedDashboard}
          setIsCloneModalOpen={setIsCloneModalOpen}
          confirmClone={confirmClone}
        />
      )}

      {alertMessage && <Alert message={alertMessage} />}
    </div>
  );
};

export default DetailDashboard;
