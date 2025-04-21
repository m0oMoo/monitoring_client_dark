import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDashboardStateStore } from "@/store/useDashboardStateStore";
import { useDashboardStore2 } from "@/store/useDashboard2Store";
import { useDraftDashboardStore } from "@/store/useDraftDashboardStore";
import { Eye, EyeOff } from "lucide-react";
import BasicBtn from "../button/borderBtn";
import BorderBtn from "../button/basicBtn";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dashboardId = searchParams.get("id") || "1";

  const { getDashboardById } = useDashboardStore2();
  const { draftDashboard } = useDraftDashboardStore();
  const { title, description, setTitle, setDescription } =
    useDashboardStateStore();

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isEditingDesc, setIsEditingDesc] = useState<boolean>(false);
  const [isDescriptionVisible, setIsDescriptionVisible] =
    useState<boolean>(false);

  // 대시보드 및 패널 로딩
  useEffect(() => {
    // 1. draftDashboard와 ID가 일치하면 draft에서 가져오기
    if (dashboardId === draftDashboard?.id && draftDashboard) {
      setTitle(draftDashboard.label);
      setDescription(draftDashboard.description || "");
      return;
    }
    // 2. 아니라면 기존 대시보드에서 가져오기
    const matchedDashboard = getDashboardById(dashboardId);
    if (matchedDashboard) {
      setTitle(matchedDashboard.label);
      setDescription(matchedDashboard.description || "");
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
    router.push("/dashboard");
  };

  return (
    <>
      <div className="flex justify-between items-center mt-5  border-b border-modern-border border-0.5 py-1.5 px-3">
        {/* breadcrumb + 이름/설명 인라인 수정 */}
        <div>
          <div className="flex text-lg1 text-modern-text_disable">
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
                  <div className="flex gap-3 items-center justify-center">
                    <span
                      onClick={() => setIsEditingTitle(true)}
                      className="text-modern-text ml-1 cursor-pointer hover:underline"
                    >
                      {title || "제목 없음"}
                    </span>
                    <button
                      className="px-2 py-0.5 rounded text-modern-subtext"
                      onClick={() => setIsDescriptionVisible((prev) => !prev)}
                    >
                      {isDescriptionVisible ? (
                        <Eye size={16} />
                      ) : (
                        <EyeOff size={16} />
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex gap-3 items-center justify-center">
                <span className="text-modern-text ml-1">
                  {title || "제목 없음"}
                </span>
                <button
                  className="hover:bg-modern-border border px-2 py-0.5 rounded text-modern-subtext"
                  onClick={() => setIsDescriptionVisible((prev) => !prev)}
                >
                  {isDescriptionVisible ? (
                    <Eye size={16} />
                  ) : (
                    <EyeOff size={16} />
                  )}
                </button>
              </div>
            )}
          </div>
          {isDescriptionVisible &&
            (isEditingDescValue ? (
              isEditingDesc ? (
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
              )
            ) : (
              <p className="text-sm mt-1 text-modern-subtext">
                {description || "설명 없음"}
              </p>
            ))}
        </div>

        {/* 버튼들 */}
        <div className="flex flex-row gap-5">
          <div className="flex flex-row gap-2 text-sm1">
            {isEdit && <BasicBtn title="cancel" onClick={onCancelClick} />}
            {modifiable && (
              <BorderBtn
                title={isEdit ? "Save" : "Edit"}
                onClick={onEditClick}
              />
            )}
            {isEdit && <BorderBtn title="Create" onClick={onCreateClick} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddChartBar;
