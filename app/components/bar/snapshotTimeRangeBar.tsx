import React, { useState } from "react";
import Alert from "../alert/alert";
import { format } from "date-fns";

interface TimeRangeBarProps {
  from: string | null;
  to: string | null;
  lastUpdated: string | null;
  className?: string;
}

const SnapshotTimeRangeBar: React.FC<TimeRangeBarProps> = ({
  from,
  to,
  lastUpdated,
  className,
}) => {
  const [alertMessage, setAlertMessage] = useState<string>("");

  return (
    <div
      className={`flex items-center justify-between bg-modern-bg text-modern-text border-b border-modern-border border-0.5 mb-4 ${className}`}
    >
      <div className="flex gap-4 pl-4">
        <label className="flex items-center gap-2 text-sm_bold text-modern-text">
          From:
          <p className="text-sm1">
            {format(new Date(from || ""), "yyyy-MM-dd HH:mm:ss")}
          </p>
        </label>
        <label className="flex items-center gap-2 text-sm_bold text-modern-text">
          To:
          <p className="text-sm1">
            {format(new Date(to || ""), "yyyy-MM-dd HH:mm:ss")}
          </p>
        </label>
      </div>
      <div className="flex items-center p-3 gap-2">
        <div className="flex flex-row">
          <p className=" text-sm2 mr-1">Last Update : </p>
          <p className="text-sm mr-3">
            {format(new Date(lastUpdated || ""), "yyyy-MM-dd HH:mm:ss")}
          </p>
        </div>
      </div>
      {alertMessage && <Alert message={alertMessage} />}
    </div>
  );
};

export default SnapshotTimeRangeBar;
