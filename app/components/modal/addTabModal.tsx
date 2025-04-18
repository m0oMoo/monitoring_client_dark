"use client";

import { useDashboardStore } from "@/store/useDashboardStore";
import React, { useState, useEffect } from "react";

interface AddTabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTab: (tabName: string, tabDescription: string) => void;
  initialTabName: string;
  initialTabDescription: string;
  onEditTab: (id: string, newName: string, newDescription: string) => void;
  editingIndex: string | null;
}

const AddTabModal = ({
  isOpen,
  onClose,
  onAddTab,
  initialTabName,
  initialTabDescription,
  onEditTab,
  editingIndex,
}: AddTabModalProps) => {
  const { dashboardList } = useDashboardStore(); // navy-btn대시보드 목록 가져오기
  const [newTabName, setNewTabName] = useState<string>("");
  const [newTabDescription, setNewTabDescription] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      if (editingIndex !== null) {
        // navy-btneditingIndex가 존재하면 해당 대시보드의 데이터를 찾아서 설정
        const existingDashboard = dashboardList.find(
          (tab) => tab.id === editingIndex
        );
        if (existingDashboard) {
          setNewTabName(existingDashboard.label);
          setNewTabDescription(existingDashboard.description);
        }
      } else {
        // navy-btn새 탭 추가 시 초기값 설정
        setNewTabName(initialTabName);
        setNewTabDescription(initialTabDescription);
      }
    }
  }, [isOpen, editingIndex, dashboardList]); // navy-btneditingIndex와 dashboardList 변경 시 업데이트

  const handleClose = () => {
    setNewTabName("");
    setNewTabDescription("");
    onClose();
  };

  const handleSubmit = () => {
    if (newTabName.trim()) {
      if (editingIndex !== null) {
        onEditTab(editingIndex, newTabName, newTabDescription);
      } else {
        onAddTab(newTabName, newTabDescription);
      }
      handleClose();
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-[#2E2E2E] p-6 w-96 border border-[#4E4E4E]">
          <h2 className="mb-4 text-lg text-modern-text">
            {editingIndex !== null ? "Edit Dashboard" : "Add New Dashboard"}
          </h2>
          <input
            type="text"
            value={newTabName}
            onChange={(e) => setNewTabName(e.target.value)}
            className="focus:outline focus:outline-modern-border p-2 mb-4 w-full text-sm bg-[#3E3E3E] 
            text-[#DFDFDF] placeholder-[#707070] "
            placeholder="Dashboard Name"
          />
          <textarea
            value={newTabDescription}
            onChange={(e) => setNewTabDescription(e.target.value)}
            className=" p-2 mb-4 w-full text-sm focus:border-[#4E4E4E] focus:outline focus:outline-modern-border 
            bg-[#3E3E3E] text-[#DFDFDF] placeholder-[#707070]"
            placeholder="Dashboard Description"
          />
          <div className="flex justify-end gap-3">
            <button
              className="px-3 py-1.5 bg-modern-bg text-sm text-[#CFCFCF] hover:bg-modern-bg1"
              onClick={handleClose}
            >
              취소
            </button>
            <button
              className="px-3 py-1.5 bg-modern-bg2 text-sm text-[#CFCFCF] hover:bg-modern-bg3"
              onClick={handleSubmit}
            >
              {editingIndex !== null ? "수정" : "추가"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddTabModal;
