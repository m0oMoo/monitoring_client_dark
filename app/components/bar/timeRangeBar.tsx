import React, { useState } from "react";
import TimeRangePicker from "../picker/timeRangePicker";
import { useSearchParams } from "next/navigation";
import { useDraftDashboardStore } from "@/store/useDraftDashboardStore";
import { useDashboardStore2 } from "@/store/useDashboard2Store";
import { useSnapshotStore } from "@/store/useSnapshotStore";
import { Camera } from "lucide-react";
import SnapshotModal from "@/components/modal/snapshotModal";
import Alert from "../alert/alert";
import { useEditStateStore } from "@/store/useEditStateStore"; // Add this import

interface TimeRangeBarProps {
  from: string | null;
  to: string | null;
  lastUpdated: string | null;
  refreshTime: number | "autoType";
  onChange: (type: "from" | "to", value: string | null) => void;
  onRefreshChange: (value: number | "autoType") => void;
  className?: string;
}

/**
 * TimeRangeBar 컴포넌트는 시간 범위 선택 및 새로 고침 주기 설정
 *
 * @param from - 시작 시간 (ISO 형식 문자열 또는 null)
 * @param to - 종료 시간 (ISO 형식 문자열 또는 null)
 * @param lastUpdated - 마지막 업데이트 시간 (ISO 형식 문자열 또는 null)
 * @param refreshTime - 데이터 새로 고침 주기 (초 단위로 숫자 또는 "autoType")
 * @param onChange - 시간 범위 변경 시 호출되는 콜백 함수 (from 또는 to 값 변경)
 * @param onRefreshChange - 새로 고침 주기 변경 시 호출되는 콜백 함수 (refreshTime 변경)
 * @param className - 추가적인 클래스명을 지정할 수 있는 선택적 prop (기본값은 없음)
 *
 * @returns JSX 요소로 구성된 TimeRangeBar 컴포넌트
 */
const TimeRangeBar: React.FC<TimeRangeBarProps> = ({
  from,
  to,
  lastUpdated,
  refreshTime,
  onChange,
  onRefreshChange,
  className,
}) => {
  const searchParams = useSearchParams();
  const dashboardId = searchParams.get("id") || "1";
  const { draftDashboard } = useDraftDashboardStore();
  const { getDashboardById } = useDashboardStore2();
  const { createSnapshot } = useSnapshotStore();
  const { editStates } = useEditStateStore();

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const currentDashboard =
    dashboardId === draftDashboard?.id
      ? draftDashboard
      : getDashboardById(dashboardId);

  const isDraft = dashboardId === draftDashboard?.id;
  const isEditing = editStates[dashboardId] || false;

  const handleSnapshotSave = (name: string, description: string) => {
    if (!currentDashboard) return;

    const data = {
      dashboards: [currentDashboard],
      charts: {},
      widgets: {},
      from,
      to,
    };

    createSnapshot(name, description, data);
    setAlertMessage("스냅샷이 저장되었습니다.");
    setIsOpenModal(false);
  };

  return (
    <div
      className={`flex items-center justify-between  text-modern-text border-b border-modern-border border-0.5 mb-4 ${className}`}
    >
      <div className="pl-4">
        <TimeRangePicker from={from} to={to} onChange={onChange} />
      </div>
      <div className="flex items-center py-1.5 px-3 gap-2">
        <div className="flex flex-row">
          <p className=" text-sm2 mr-1">Last Update : </p>
          <p className="text-sm mr-3">{lastUpdated}</p>
        </div>
        <label className="text-sm_bold">Refresh:</label>
        <select
          value={refreshTime}
          onChange={(e) =>
            onRefreshChange(
              e.target.value === "autoType"
                ? "autoType"
                : Number(e.target.value)
            )
          }
          className="border border-modern-border py-1 px-2 text-sm1 bg-modern-bg text-modern-text"
        >
          <option value="autoType">Auto</option>
          <option value={5}>5s</option>
          <option value={10}>10s</option>
          <option value={15}>15s</option>
          <option value={30}>30s</option>
        </select>

        {/* 새로운 대시보드를 생성한 경우 & 편집 상태인 경우 스냅샷 버튼 hidden */}
        {!isDraft && !isEditing && (
          <button
            onClick={() => setIsOpenModal(true)}
            className="ml-2 p-1 px-1.5 border border-modern-border hover:bg-modern-hover"
            title="스냅샷 저장"
          >
            <Camera size={18} className="text-modern-text" />
          </button>
        )}

        <SnapshotModal
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          onSave={handleSnapshotSave}
        />
      </div>
      {alertMessage && <Alert message={alertMessage} />}
    </div>
  );
};

export default TimeRangeBar;
