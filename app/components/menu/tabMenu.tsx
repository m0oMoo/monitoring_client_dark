import React, { useState } from "react";
import { Edit2, File, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";

interface TabMenuProps {
  index: string;
  setEditingTabIndex: (index: string) => void;
  setIsModalOpen: (open: boolean) => void;
  setMenuOpenIndex: (index: string | null) => void;
  handleTabDelete: (index: string) => void;
  handleTabClone: (dashboardId: string) => void;
}

const TabMenu: React.FC<TabMenuProps> = ({
  index,
  setEditingTabIndex,
  setIsModalOpen,
  setMenuOpenIndex,
  handleTabDelete,
  handleTabClone,
}) => {
  const pathname = usePathname();

  return (
    <div
      className="absolute right-0 mt-2 w-40 bg-modern-bg shadow-lg
    border border-modern-border rounded-md z-50"
    >
      {/* 수정 버튼 */}
      <button
        className="flex items-center w-full px-4 py-2 text-sm text-modern-text 
        hover:bg-modern-bg2 hover:rounded-t-md"
        onClick={(e) => {
          e.stopPropagation();
          setEditingTabIndex(index);
          setIsModalOpen(true);
          setMenuOpenIndex(null);
        }}
      >
        <Edit2 className="w-4 h-4 mr-2" /> 수정
      </button>
      <div className="px-2">
        <p className="h-[0.5px] bg-modern-border" />
      </div>
      {/* 삭제 버튼 */}
      <button
        className="flex items-center w-full px-4 py-2 text-sm text-red-400 
        hover:bg-modern-bg2"
        onClick={(e) => {
          e.stopPropagation();
          if (
            typeof window !== "undefined" &&
            window.confirm("대시보드를 삭제하시겠습니까?")
          ) {
            handleTabDelete(index);
          }
          setMenuOpenIndex(null);
        }}
      >
        <Trash2 className="w-4 h-4 mr-2" /> 삭제
      </button>
      <div className="px-2">
        <p className="h-[0.5px] bg-modern-border" />
      </div>
      {/* 복제 버튼 */}
      <button
        className="flex items-center w-full px-4 py-2 text-modern-text text-sm
        hover:bg-modern-bg2 hover:rounded-b-md"
        onClick={(e) => {
          e.stopPropagation();
          handleTabClone(index);
          setMenuOpenIndex(null);
        }}
      >
        <File className="w-4 h-4 mr-2" /> 복제
      </button>
    </div>
  );
};

export default TabMenu;
