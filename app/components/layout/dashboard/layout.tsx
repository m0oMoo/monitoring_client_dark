import React, { ReactNode, useEffect, useState } from "react";
import AddChartBar from "@/components/bar/addChartBar";
import TimeRangeBar from "@/components/bar/timeRangeBar";
import { useSearchParams } from "next/navigation";
import { useEditStateStore } from "@/store/useEditStateStore";

const DashboardLayout = ({
  children,
  onCreateClick,
  onGridChange,
  modifiable,
  onEditClick,
  onCancelClick,
  onCallback,
}: {
  children: ReactNode;
  onCreateClick: () => void;
  onGridChange?: () => void;
  modifiable?: boolean;
  onEditClick?: () => void;
  onCancelClick?: () => void;
  onCallback?: (title: string, desc: string) => void;
}) => {
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [refreshTime, setRefreshTime] = useState<number | "autoType">(10);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const dashboardId = searchParams.get("id") || "default"; // 대시보드 ID 가져오기
  const isEdit = useEditStateStore(
    (state) => state.editStates[dashboardId] ?? false
  );

  // 시간 초기화
  useEffect(() => {
    const now = new Date();
    const formatted = now.toISOString().slice(0, 16);
    setFrom(formatted);
    setTo(formatted);
    setLastUpdated(now.toLocaleTimeString());
  }, []);

  return (
    <div>
      <AddChartBar
        isEdit={isEdit}
        onCreateClick={onCreateClick}
        modifiable={modifiable}
        onEditClick={onEditClick}
        onCancelClick={onCancelClick}
      />
      <TimeRangeBar
        from={from}
        to={to}
        lastUpdated={lastUpdated}
        refreshTime={refreshTime}
        onChange={(type, value) =>
          type === "from" ? setFrom(value) : setTo(value)
        }
        onRefreshChange={setRefreshTime}
      />
      <main>{children}</main>
    </div>
  );
};

export default DashboardLayout;
