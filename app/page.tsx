"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Camera, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import Alert from "@/components/alert/alert";
import TabMenu from "@/components/menu/tabMenu";
import SearchInput from "@/components/search/searchInput";
import { useDashboardStore2 } from "@/store/useDashboard2Store";
import { useDraftDashboardStore } from "@/store/useDraftDashboardStore";
import { useThemeStore } from "./store/useThemeStore";
import BorderBtn from "./components/button/borderBtn";

export default function Home() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const { dashboardList } = useDashboardStore2();
  const { startDraftDashboard } = useDraftDashboardStore();

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

  // 대시보드 삭제
  const handleTabDelete = (dashboardId: string) => {
    const dashboard = dashboardList.find((db) => db.id === dashboardId);
    if (dashboard) {
      if (window.confirm(`"${dashboard.label}" 대시보드를 삭제하시겠습니까?`)) {
        useDashboardStore2.getState().deleteDashboard(dashboardId);
        setAlertMessage("대시보드가 삭제되었습니다.");
      }
    }
  };

  // 대시보드 복제 (차트 & 위젯 포함)
  const handleTabClone = (dashboardId: string) => {
    useDashboardStore2.getState().cloneDashboard(dashboardId);
    setAlertMessage("대시보드가 복제되었습니다.");
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

  // 대시보드 추가 버튼 클릭 시 처리
  const handleAddDashboard = async () => {
    const newDashboardId = uuidv4();

    startDraftDashboard({
      id: newDashboardId,
      label: "새 대시보드",
      description: "대시보드 설명",
    });

    router.push(`/detail?id=${newDashboardId}`);
  };

  return (
    <div
      className=" text-modern-text min-h-screen p-4 pt-[44px]"
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
            onClick={() => {
              router.push("/snapshot");
            }}
            className="flex items-center gap-2 bg-transparent py-1.5 px-2 text-modern-text border-modern-text text-sm
  hover:bg-modern-white_10 justify-self-end border"
          >
            <Camera size={18} className="text-modern-text" /> 스냅샷 보기
          </button>
          <BorderBtn title={"+ 대시보드 추가"} onClick={handleAddDashboard} />
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
                    e.stopPropagation();
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
                    handleTabClone={() => handleTabClone(tab.id)}
                  />
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
