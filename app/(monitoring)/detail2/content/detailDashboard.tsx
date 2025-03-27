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

  const [panels, setPanels] = useState<any[]>([]);

  const layouts = useMemo(() => ({ lg: gridLayout }), [gridLayout]);

  // 대시보드 및 패널 로딩
  useEffect(() => {
    // draftDashboard가 있을 때만 설정
    if (dashboardId === draftDashboard?.id) {
      setDashboard(draftDashboard); // 기존 대시보드 로드
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
    setGridLayout(layout);
    if (dashboard) {
      const updatedPanels = panels.map((panel) => {
        const updatedLayout = layout.find((item) => item.i === panel.pannelId);
        if (updatedLayout) {
          return {
            ...panel,
            gridPos: {
              x: updatedLayout.x,
              y: updatedLayout.y,
              w: updatedLayout.w,
              h: updatedLayout.h,
            },
          };
        }
        return panel;
      });
      setPanels(updatedPanels);
      if (!isEditing) {
        updateDashboard({
          ...dashboard,
          pannels: updatedPanels,
        });
      }
    }
  };

  const handleSaveDashboard = () => {
    if (panels.length === 0) {
      setAlertMessage(
        "패널을 하나 이상 추가해야 대시보드를 저장할 수 있습니다."
      );
      return;
    }

    const updatedDashboard: Dashboard = {
      id: dashboardId === draftDashboard?.id ? draftDashboard?.id : dashboardId,
      label: title,
      description,
      pannels: panels,
    };

    if (dashboardId !== draftDashboard?.id) {
      setAlertMessage("대시보드가 업데이트되었습니다.");
      updateDashboard(updatedDashboard); // 기존 대시보드 업데이트
    } else {
      setAlertMessage("대시보드가 저장되었습니다.");
      // draft 대시보드를 저장
      addDashboard(updatedDashboard);
      const newId = uuidv4();
      setDashboardId(newId);
      router.replace(`/detail2?id=${newId}`); // 새 대시보드 상세 페이지로 이동
    }
  };

  const handleEditClick = () => {
    if (isEditing) {
      handleSaveDashboard(); // 저장 버튼 클릭 시 저장 처리
    }
    setIsEditing((prev) => !prev);
  };

  const handleTabClone = (itemId: string) => {
    setSelectedItem(itemId);
    setIsCloneModalOpen(true);
  };

  const confirmClone = () => {
    if (selectedItem && selectedDashboard && dashboardId) {
      clonePannelToDashboard(dashboardId, selectedItem, selectedDashboard);
      setAlertMessage("복제 완료!");
    }
    setIsCloneModalOpen(false);
    setSelectedItem(null);
    setSelectedDashboard(null);
  };

  // dashboard가 변경될 때 패널 정보 업데이트
  useEffect(() => {
    if (dashboard) {
      setPanels(dashboard.pannels);

      // 패널들의 레이아웃 정보 설정
      const newLayout = dashboard.pannels.map((panel) => ({
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
  }, [dashboard]);

  const handleCancel = () => {
    // 원래 대시보드 상태로 복원
    if (dashboard) {
      setPanels(dashboard.pannels);

      // 패널들의 레이아웃 정보 복원
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
    setIsEditing(false);
  };

  const handlePanelDelete = (pannelId: string) => {
    if (isEditing) {
      // Edit 모드에서만 삭제 가능
      // 패널 리스트에서만 삭제 (실제 저장은 Save 버튼 클릭 시)
      const filteredPanels = panels.filter(
        (panel) => panel.pannelId !== pannelId
      );
      setPanels(filteredPanels);

      // 레이아웃에서도 삭제
      const filteredLayout = gridLayout.filter((item) => item.i !== pannelId);
      setGridLayout(filteredLayout);

      setAlertMessage(
        "패널이 삭제되었습니다. 저장하려면 Save 버튼을 클릭하세요."
      );
    } else {
      setAlertMessage("편집 모드에서만 패널을 삭제할 수 있습니다.");
    }
  };

  // 패널 수정으로 이동하는 함수 (라우팅)
  const handlePanelEdit = (pannelId: string) => {
    if (isEditing) {
      router.push(`/d2?id=${dashboardId}&pannelId=${pannelId}`);
    } else {
      setAlertMessage("편집 모드에서만 패널을 수정할 수 있습니다.");
    }
  };

  return (
    <div className="bg-modern-bg min-h-[calc(100vh-80px)]">
      <DashboardLayout
        isEdit={!isEditing}
        onCreateClick={() => router.push(`/d2?id=${dashboardId}`)}
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
