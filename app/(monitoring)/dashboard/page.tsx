"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import Alert from "@/components/alert/alert";
import TabMenu from "@/components/menu/tabMenu";
import { useChartStore } from "@/store/useChartStore";
import { useDashboardStore, PanelLayout } from "@/store/useDashboardStore";
import { useWidgetStore } from "@/store/useWidgetStore";
import AddTabModal from "@/components/modal/addTabModal";
import SearchInput from "@/components/search/searchInput";

const Dashboard2Page = () => {
  const router = useRouter();
  const {
    dashboardList,
    addDashboard,
    removeDashboard,
    dashboardPanels,
    addPanelToDashboard,
    updateDashboard,
  } = useDashboardStore();
  const { charts, addChart } = useChartStore();
  const { widgets, addWidget } = useWidgetStore();
  const { saveDashboard } = useDashboardStore();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTabIndex, setEditingTabIndex] = useState<string | null>(null);
  const [menuOpenIndex, setMenuOpenIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredTabs = dashboardList.filter(
    (tab) =>
      typeof tab.label === "string" &&
      tab.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 대시보드 추가
  const handleTabAdd = (newTabName: string, newTabDescription: string) => {
    addDashboard({
      id: uuidv4(),
      label: newTabName,
      description: newTabDescription,
    });
    setIsModalOpen(false);
    setAlertMessage("새로운 탭이 추가되었습니다!");
  };

  // 대시보드 수정
  const handleTabEdit = (
    id: string,
    newName: string,
    newDescription: string
  ) => {
    updateDashboard(id, newName, newDescription);
    setEditingTabIndex(null);
    setAlertMessage("탭이 수정되었습니다!");
  };

  // 대시보드 삭제
  const handleTabDelete = (dashboardId: string) => {
    removeDashboard(dashboardId);
    setMenuOpenIndex(null);
    setIsModalOpen(false);
    setAlertMessage("대시보드가 삭제되었습니다!");
  };

  // 대시보드 복제 (차트 & 위젯 포함)
  const handleTabClone = (
    dashboardId: string,
    label: string,
    description: string
  ) => {
    const newDashboardId = uuidv4();
    const newLabel = `${label}_copy`;

    // 새 대시보드 추가
    addDashboard({ id: newDashboardId, label: newLabel, description });

    // 대시보드가 추가된 후 패널을 복제
    const panelsToClone = dashboardPanels[dashboardId] || [];
    const newDashboardPanels: PanelLayout[] = [];

    panelsToClone.forEach((panel) => {
      const { panelId, type, gridPos } = panel;

      if (type === "chart") {
        const existingChart = Object.values(charts)
          .flat()
          .find((chart) => chart.chartId === panelId);

        if (existingChart) {
          const newChartId = uuidv4();
          const clonedChartOptions = { ...existingChart.chartOptions };
          const clonedDatasets = existingChart.datasets.map((dataset) => ({
            ...dataset,
          }));

          const clonedGridPos = { ...gridPos };

          addChart(
            newDashboardId,
            clonedChartOptions,
            clonedDatasets,
            clonedGridPos
          );
          addPanelToDashboard(newDashboardId, newChartId, "chart");

          newDashboardPanels.push({
            panelId: newChartId,
            type: "chart",
            gridPos: clonedGridPos,
          });
        }
      }

      if (type === "widget") {
        const existingWidget = Object.values(widgets)
          .flat()
          .find((widget) => widget.widgetId === panelId);

        if (existingWidget) {
          const newWidgetId = uuidv4();
          const clonedWidgetOptions = {
            ...existingWidget.widgetOptions,
            widgetId: newWidgetId,
          };

          const clonedGridPos = { ...gridPos };

          addWidget(newDashboardId, clonedWidgetOptions, clonedGridPos);
          addPanelToDashboard(newDashboardId, newWidgetId, "widget");

          newDashboardPanels.push({
            panelId: newWidgetId,
            type: "widget",
            gridPos: clonedGridPos,
          });
        }
      }
    });

    // 복제된 패널을 저장할 때 `dashboardPanels` 업데이트
    console.log("복제된 패널 리스트:", newDashboardPanels);
    saveDashboard(newDashboardId, newDashboardPanels);

    setAlertMessage("대시보드가 복제되었습니다!");
    router.push(`/detail?id=${newDashboardId}`);
  };

  const handleTabClick = (tab: any) => {
    router.push(`/detail?id=${tab.id}`);
  };

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  return (
    <div
      className="bg-modern-bg text-modern-text min-h-screen p-4 pt-[44px]"
      onClick={() => setMenuOpenIndex(null)}
    >
      <header className="flex justify-between items-center my-3">
        <h1 className="text-xl font-bold tracking-wide">
          📊 모니터링 대시보드
        </h1>
        <div className="flex gap-4">
          <SearchInput
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex bg-modern-point_10 py-1.5 px-2 text-modern-point border border-modern-point text-sm
        hover:bg-modern-point_20 justify-self-end"
          >
            + 대시보드 추가
          </button>
        </div>
      </header>

      {alertMessage && <Alert message={alertMessage} />}
      <div className="w-full mb-2 border-b border-0.5 border-modern-border" />
      <ul className="space-y-2">
        {filteredTabs.map((tab, index) => (
          <li
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            className="relative p-4 cursor-pointer rounded-md hover:bg-modern-hover active:bg-modern-pressed"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{tab.label}</h3>
                <p className="text-sm text-modern-subtext">{tab.description}</p>
              </div>
              <div className="relative">
                <MoreVertical
                  className="text-text3 cursor-pointer hover:text-text2"
                  onClick={(e) => {
                    e.stopPropagation(); // 메뉴 클릭 유지
                    setMenuOpenIndex(menuOpenIndex === tab.id ? null : tab.id);
                  }}
                />
                {menuOpenIndex === tab.id && (
                  <TabMenu
                    index={tab.id}
                    setEditingTabIndex={() => setEditingTabIndex(tab.id)}
                    setIsModalOpen={() => setIsModalOpen(true)}
                    setMenuOpenIndex={() => setMenuOpenIndex(null)}
                    handleTabDelete={() => handleTabDelete(tab.id)}
                    handleTabClone={() =>
                      handleTabClone(tab.id, tab.label, tab.description)
                    }
                  />
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <AddTabModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTab={handleTabAdd}
        initialTabName=""
        initialTabDescription=""
        onEditTab={handleTabEdit}
        editingIndex={editingTabIndex}
      />
    </div>
  );
};

export default Dashboard2Page;
