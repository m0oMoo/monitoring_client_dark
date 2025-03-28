"use client";

import React from "react";
import { useSnapshotStore } from "@/store/useSnapshotStore";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Trash2, Eye } from "lucide-react";

const SnapshotMainSection = () => {
  const router = useRouter();
  const { snapshots, deleteSnapshot } = useSnapshotStore();

  const handleViewSnapshot = (snapshotId: string) => {
    const snapshot = snapshots.find((s) => s.snapshotId === snapshotId);
    if (!snapshot) return;
    router.push(`/snapshot/detail?id=${snapshotId}`);
  };

  return (
    <div className="bg-modern-bg text-modern-text min-h-screen p-4 pt-5">
      <header className="flex justify-between items-center my-3">
        <h1 className="text-xl font-bold">📸 스냅샷 목록</h1>
      </header>
      <div className="w-full mb-2 border-b border-0.5 border-modern-border" />

      {snapshots.length === 0 ? (
        <p className="text-sm text-modern-subtext">저장된 스냅샷이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {snapshots.map((snap) => (
            <li
              key={snap.snapshotId}
              className="p-4 py-6 rounded-md border border-modern-border bg-modern-white_0 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{snap.name}</h3>
                <p className="text-sm text-modern-subtext mb-1">
                  {snap.description}
                </p>
                <p className="text-xs text-modern-subtext">
                  저장일시: &nbsp;
                  {format(new Date(snap.createdAt), "yyyy-MM-dd HH:mm:ss")}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 border border-modern-border rounded hover:bg-modern-white_10 cursor-pointer"
                  onClick={() => handleViewSnapshot(snap.snapshotId)}
                  title="스냅샷 보기"
                >
                  <Eye size={16} />
                </button>
                <button
                  className="p-2 border border-modern-border rounded hover:bg-red-500 hover:text-white"
                  onClick={() => deleteSnapshot(snap.snapshotId)}
                  title="삭제"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SnapshotMainSection;
