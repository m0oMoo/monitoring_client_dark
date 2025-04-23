"use client";

import { useThemeStore } from "@/store/useThemeStore";
import React, { useState, useEffect } from "react";

interface SnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
}

const SnapshotModal = ({ isOpen, onClose, onSave }: SnapshotModalProps) => {
  const { theme } = useThemeStore();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const bgClass = {
    modern: "bg-modern-bg",
    blue: "bg-blue-bg",
    pink: "bg-pink-bg",
    orange: "bg-orange-bg",
    ivory: "bg-ivory-bg",
  }[theme];

  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (name.trim()) {
      onSave(name, description);
      onClose();
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
        <div
          className={`${bgClass} p-6 w-96 border border-modern-border rounded-xl shadow-lg`}
        >
          <h2 className="text-lg text-modern-text font-semibold mb-4">
            스냅샷 저장
          </h2>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-sm p-2 mb-3 rounded-md bg-modern-bg1 text-modern-text placeholder-modern-subtext border border-modern-border focus:outline-none focus:ring-2 focus:ring-point-50 transition"
            placeholder="스냅샷 이름을 입력하세요"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm p-2 mb-4 rounded-md bg-modern-bg1 text-modern-text placeholder-modern-subtext border border-modern-border focus:outline-none focus:ring-2 focus:ring-point-50 transition"
            placeholder="스냅샷 설명을 입력하세요"
          />

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 text-sm text-modern-text bg-modern-hover hover:bg-modern-bg1 rounded-md transition"
              onClick={onClose}
            >
              취소
            </button>
            <button
              className="px-4 py-2 text-sm text-point bg-modern-point_10 hover:bg-point_20 rounded-md transition"
              onClick={handleSubmit}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default SnapshotModal;
