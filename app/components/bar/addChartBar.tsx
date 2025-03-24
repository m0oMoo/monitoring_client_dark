"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDashboardStore2 } from "@/store/useDashboard2Store";
import { useState, useEffect } from "react";

interface AddChartBarProps {
  isEdit: boolean;
  onCreateClick: () => void;
  onEditClick?: () => void;
  onSaveClick?: () => void;
  gridCols?: number;
  onGridChange?: (change: number) => void;
  gridVisible?: boolean;
  modifiable?: boolean;
  onCallback?: (title: string, description: string) => void;
}

const AddChartBar = ({
  isEdit,
  onCreateClick,
  onEditClick,
  onSaveClick,
  gridCols,
  onGridChange,
  gridVisible = false,
  modifiable = false,
  onCallback,
}: AddChartBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dashboardId = searchParams.get("id") || undefined;
  const { getDashboardById, updateDashboard } = useDashboardStore2();
  const dashboard = dashboardId ? getDashboardById(dashboardId) : undefined;

  const [title, setTitle] = useState<string | undefined>(undefined); // Initial value as undefined to handle hydration issue
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  useEffect(() => {
    if (dashboard) {
      setTitle(dashboard.label);
      setDescription(dashboard.description || "");
    }
  }, [dashboard]);

  const handleGoBack = () => {
    router.push("/dashboard");
  };

  const handleSaveTitleDesc = () => {
    if (dashboardId && dashboard) {
      updateDashboard({
        ...dashboard,
        label: title!,
        description: description!,
      });
    }
  };

  useEffect(() => {
    if (typeof title !== "undefined" && typeof description !== "undefined") {
      if (onCallback) {
        onCallback(title, description);
      }
    }
  }, [title, description, onCallback]);

  return (
    <div
      className={`flex justify-between items-center mt-[44px] bg-modern-bg
      border-b border-modern-border border-0.5 py-1.5 px-4`}
    >
      {/* breadcrumb + 이름/설명 인라인 수정 */}
      <div>
        <div className="text-lg1 text-modern-text_disable">
          <span
            className="text-text1 cursor-pointer hover:underline"
            onClick={handleGoBack}
          >
            Dashboard
          </span>
          &nbsp; {">"}
          {isEditingTitle ? (
            <input
              value={title}
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                setIsEditingTitle(false);
                handleSaveTitleDesc();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsEditingTitle(false);
                  handleSaveTitleDesc();
                }
              }}
              className="border bg-transparent px-2 py-0.5 rounded ml-1 text-modern-text w-64"
            />
          ) : (
            <span
              onClick={() => setIsEditingTitle(true)}
              className="text-modern-text ml-1 cursor-pointer hover:underline"
            >
              {title || "제목 없음"}
            </span>
          )}
        </div>
        {isEditingDesc ? (
          <input
            value={description}
            autoFocus
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => {
              setIsEditingDesc(false);
              handleSaveTitleDesc();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setIsEditingDesc(false);
                handleSaveTitleDesc();
              }
            }}
            className="text-sm mt-1 text-modern-subtext bg-transparent border px-2 py-0.5 rounded"
            placeholder="설명 입력"
          />
        ) : (
          <p
            onClick={() => setIsEditingDesc(true)}
            className="text-sm mt-1 text-modern-subtext cursor-pointer hover:underline"
          >
            {description || "설명 없음"}
          </p>
        )}
      </div>

      {/* 버튼들 */}
      <div className="flex flex-row gap-5">
        <div className="flex flex-row gap-2 text-sm1">
          {modifiable && (
            <button
              className="hover:bg-modern-point_20 bg-modern-point_10 px-2 py-0.5 text-modern-point border-modern-point"
              onClick={onEditClick}
            >
              {isEdit ? "Edit" : "Save"}
            </button>
          )}
          <button
            className="border hover:bg-modern-point_20 bg-modern-point_10 px-2 py-1 text-modern-point border-modern-point"
            onClick={onCreateClick}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddChartBar;
