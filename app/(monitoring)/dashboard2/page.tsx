"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import Alert from "@/components/alert/alert";
import TabMenu from "@/components/menu/tabMenu";
import SearchInput from "@/components/search/searchInput";
import { useDashboardStore2 } from "@/store/useDashboard2Store";

const Dashboard2Page = () => {
  const router = useRouter();
  const { dashboardList } = useDashboardStore2();

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
  const handleTabDelete = (dashboardId: string) => {};

  // 대시보드 복제 (차트 & 위젯 포함)
  const handleTabClone = (dashboardId: string) => {};

  const handleTabClick = (tab: any) => {
    router.push(`/detail2?id=${tab.id}`);
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
            onClick={() => router.push("/detail2")} // ✅ 단순 이동
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
};

export default Dashboard2Page;
