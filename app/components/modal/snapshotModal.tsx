"use client";

import React, { useState, useEffect } from "react";

interface SnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
}

const SnapshotModal = ({ isOpen, onClose, onSave }: SnapshotModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-[#2E2E2E] p-6 w-96 border border-[#4E4E4E]">
          <h2 className="text-lg text-modern-text mb-4">스냅샷 저장</h2>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus:outline focus:outline-modern-border p-2 mb-4 w-full text-sm bg-[#3E3E3E] text-[#DFDFDF] placeholder-[#707070]"
            placeholder="스냅샷 이름을 입력하세요"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 mb-4 w-full text-sm focus:outline focus:outline-modern-border bg-[#3E3E3E] text-[#DFDFDF] placeholder-[#707070]"
            placeholder="스냅샷 설명을 입력하세요"
          />

          <div className="flex justify-end gap-3">
            <button
              className="px-3 py-1.5 bg-modern-bg text-sm text-[#CFCFCF] hover:bg-modern-bg1"
              onClick={onClose}
            >
              취소
            </button>
            <button
              className="px-3 py-1.5 bg-modern-bg2 text-sm text-[#CFCFCF] hover:bg-modern-bg3"
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
