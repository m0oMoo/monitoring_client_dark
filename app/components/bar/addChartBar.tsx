import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDashboardStateStore } from "@/store/useDashboardStateStore";
import { useDashboardStore2 } from "@/store/useDashboard2Store";
import { useDraftDashboardStore } from "@/store/useDraftDashboardStore";

interface AddChartBarProps {
  isEdit: boolean;
  onCreateClick: () => void;
  onEditClick?: () => void;
  onSaveClick?: () => void;
  onCancelClick?: () => void;
  modifiable?: boolean;
  isEditingTitleValue?: boolean;
  isEditingDescValue?: boolean;
}

const AddChartBar = ({
  isEdit,
  onCreateClick,
  onEditClick,
  onSaveClick,
  onCancelClick,
  modifiable = false,
  isEditingTitleValue = true,
  isEditingDescValue = true,
}: AddChartBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dashboardId = searchParams.get("id") || "1";

  const { getDashboardById } = useDashboardStore2();
  const { draftDashboard } = useDraftDashboardStore();
  const { title, description, setTitle, setDescription } =
    useDashboardStateStore();

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isEditingDesc, setIsEditingDesc] = useState<boolean>(false);

  // 대시보드 및 패널 로딩
  useEffect(() => {
    // 대시보드 ID를 기준으로 대시보드 선택
    const currentDashboard =
      dashboardId === draftDashboard?.id
        ? draftDashboard
        : getDashboardById(dashboardId);

    if (currentDashboard) {
      // 첫 로딩 시 title과 description 세팅
      setTitle(currentDashboard.label);
      setDescription(currentDashboard.description || "");
    } else {
      console.log("대시보드가 없습니다.");
    }
  }, [dashboardId, draftDashboard, getDashboardById, setTitle, setDescription]);

  const handleSaveTitleDesc = () => {
    const updateStore = draftDashboard
      ? useDraftDashboardStore.getState().updateDraftDashboard
      : useDashboardStore2.getState().updateDashboard;

    const currentDashboard = draftDashboard || getDashboardById(dashboardId);

    if (currentDashboard) {
      updateStore({
        ...currentDashboard,
        label: title,
        description: description,
      });
    }

    setIsEditingTitle(false);
    setIsEditingDesc(false);
  };

  // title, description 수정 시 저장
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value); // 실시간으로 Zustand 상태 업데이트
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value); // 실시간으로 Zustand 상태 업데이트
  };

  const handleGoBack = () => {
    router.push("/dashboard2");
  };

  return (
    <div className="flex justify-between items-center mt-[44px] bg-modern-bg border-b border-modern-border border-0.5 py-1.5 px-4">
      {/* breadcrumb + 이름/설명 인라인 수정 */}
      <div>
        <div className="text-lg1 text-modern-text_disable">
          <span
            className="text-text1 cursor-pointer hover:underline"
            onClick={handleGoBack}
          >
            Dashboard
          </span>
          &nbsp; {">"} &nbsp;
          {isEditingTitleValue ? (
            <>
              {isEditingTitle ? (
                <input
                  value={title}
                  autoFocus
                  onChange={handleTitleChange}
                  onBlur={() => {
                    setIsEditingTitle(false);
                    handleSaveTitleDesc(); // 실시간 저장
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingTitle(false);
                      handleSaveTitleDesc(); // 실시간 저장
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
            </>
          ) : (
            <span className="text-modern-text ml-1">
              {title || "제목 없음"}
            </span>
          )}
        </div>
        {isEditingDescValue ? (
          <>
            {isEditingDesc ? (
              <input
                value={description}
                autoFocus
                onChange={handleDescChange}
                onBlur={() => {
                  setIsEditingDesc(false);
                  handleSaveTitleDesc(); // 실시간 저장
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsEditingDesc(false);
                    handleSaveTitleDesc(); // 실시간 저장
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
          </>
        ) : (
          <p className="text-sm mt-1 text-modern-subtext">
            {description || "설명 없음"}
          </p>
        )}
      </div>

      {/* 버튼들 */}
      <div className="flex flex-row gap-5">
        <div className="flex flex-row gap-2 text-sm1">
          {!isEdit && (
            <button
              className="hover:bg-modern-point_20 bg-modern-point_10 px-2 py-0.5 text-modern-point border-modern-point"
              onClick={onCancelClick}
            >
              cancel
            </button>
          )}
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
