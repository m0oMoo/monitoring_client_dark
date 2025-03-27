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
  onGridChange?: (change: number) => void;
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
  onGridChange,
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
    // draftDashboard가 있을 때만 설정
    if (dashboardId === draftDashboard?.id) {
      // title과 description이 실제로 변경된 경우에만 상태를 업데이트
      if (
        draftDashboard.label !== title ||
        draftDashboard.description !== description
      ) {
        const updatedDraftDashboard = {
          ...draftDashboard, // 기존 draftDashboard 정보
          label: title, // 새로운 title 값
          description: description, // 새로운 description 값
        };
        useDraftDashboardStore
          .getState()
          .updateDraftDashboard(updatedDraftDashboard); // 임시 대시보드 업데이트
      }
    } else {
      const fetchedDashboard = getDashboardById(dashboardId);
      if (fetchedDashboard) {
        // title과 description이 실제로 변경된 경우에만 상태를 업데이트
        if (
          fetchedDashboard.label !== title ||
          fetchedDashboard.description !== description
        ) {
          const updatedDashboard = {
            ...fetchedDashboard, // 기존 대시보드 정보
            label: title, // 새로운 title 값
            description: description, // 새로운 description 값
          };
          useDashboardStore2.getState().updateDashboard(updatedDashboard); // 기존 대시보드 업데이트
        }
      } else {
        console.log("대시보드가 없습니다."); // 대시보드가 없을 경우 로깅
      }
    }
  }, [dashboardId, draftDashboard, title, description, getDashboardById]);

  const handleGoBack = () => {
    router.push("/dashboard");
  };

  const handleSaveTitleDesc = () => {
    // 상태 업데이트: title과 description 변경 시 바로바로 Zustand로 저장
    setTitle(title);
    setDescription(description);
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
          &nbsp; {">"}
          {isEditingTitleValue ? (
            <>
              {isEditingTitle ? (
                <input
                  value={title}
                  autoFocus
                  onChange={(e) => {
                    setTitle(e.target.value); // 실시간으로 Zustand 상태 업데이트
                  }}
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
                onChange={(e) => {
                  setDescription(e.target.value); // 실시간으로 Zustand 상태 업데이트
                }}
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
