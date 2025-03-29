import React, { useState } from "react";
import TimeRangePicker from "../picker/timeRangePicker";
import { useSearchParams } from "next/navigation";
import { useDraftDashboardStore } from "@/store/useDraftDashboardStore";
import { useDashboardStore2 } from "@/store/useDashboard2Store";
import { useSnapshotStore } from "@/store/useSnapshotStore";
import { Camera } from "lucide-react";
import SnapshotModal from "@/components/modal/snapshotModal";
import Alert from "../alert/alert";

interface TimeRangeBarProps {
  from: string | null;
  to: string | null;
  lastUpdated: string | null;
  refreshTime: number | "autoType";
  onChange: (type: "from" | "to", value: string | null) => void;
  onRefreshChange: (value: number | "autoType") => void;
  className?: string;
}

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

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const currentDashboard =
    dashboardId === draftDashboard?.id
      ? draftDashboard
      : getDashboardById(dashboardId);

  const isDraft = dashboardId === draftDashboard?.id;

  const handleSnapshotSave = (name: string, description: string) => {
    if (!currentDashboard) return;

    const data = {
      dashboards: [currentDashboard],
      charts: {}, // 필요 시 차트 상태도 포함
      widgets: {}, // 필요 시 위젯 상태도 포함
      from,
      to,
    };

    createSnapshot(name, description, data);
    setAlertMessage("스냅샷이 저장되었습니다.");
    setIsOpenModal(false);
  };

  return (
    <div
      className={`flex items-center justify-between bg-modern-bg text-modern-text border-b border-modern-border border-0.5 mb-4 ${className}`}
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

        {!isDraft && (
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
