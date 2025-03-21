import React from "react";
import TimeRangePicker from "../picker/timeRangePicker";

interface TimeRangeBarProps {
  from: string | null;
  to: string | null;
  lastUpdated: string | null;
  refreshTime: number | "autoType";
  onChange: (type: "from" | "to", value: string | null) => void; // 수정: string | null 처리
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
  return (
    <div
      className={`flex items-center justify-between bg-modern-bg text-modern-text
        border-b border-modern-border border-0.5 mb-4 ${className}`}
    >
      <div className="pl-4">
        <TimeRangePicker from={from} to={to} onChange={onChange} />
      </div>
      <div className="flex items-center p-3 gap-2">
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
      </div>
    </div>
  );
};

export default TimeRangeBar;
