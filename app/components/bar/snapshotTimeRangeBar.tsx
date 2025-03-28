import React, { useState } from "react";
import Alert from "../alert/alert";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface TimeRangeBarProps {
  title: string;
  description: string;
  from: string | null;
  to: string | null;
  lastUpdated: string | null;
  className?: string;
}

const SnapshotTimeRangeBar: React.FC<TimeRangeBarProps> = ({
  title,
  description,
  from,
  to,
  lastUpdated,
  className,
}) => {
  const router = useRouter();

  const [alertMessage, setAlertMessage] = useState<string>("");

  const handleGoBack = () => {
    router.push("/snapshot");
  };

  return (
    <div className="">
      <div
        className={`flex items-center justify-between bg-modern-bg border-b border-modern-border border-0.5 ${className}`}
      >
        <div className="flex justify-between gap-4 pl-4 py-1.5 px-3">
          <span
            className="text-lg1 text-modern-text_disable cursor-pointer hover:underline"
            onClick={handleGoBack}
          >
            Snapshot
          </span>
          <span className="text-modern-text_disable">&nbsp; {">"}</span>
          <span className="text-modern-text ml-1">{title}</span>
          {/* <label className="flex items-center gap-2 text-sm_bold">
            {title}
          </label> */}
          {/* <label className="flex items-center gap-2 text-[12px] font-extralight">
            {description}
          </label> */}
        </div>
      </div>
      <div
        className={`flex items-center justify-between bg-modern-bg text-modern-text border-b border-modern-border border-0.5 mb-4 ${className}`}
      >
        <div className="flex gap-4 pl-4">
          <label className="flex items-center gap-2 text-sm_bold">
            From:
            <p className="text-[12px] font-extralight">
              {format(new Date(from || ""), "yyyy-MM-dd HH:mm:ss")}
            </p>
          </label>
          <label className="flex items-center gap-2 text-sm_bold">
            To:
            <p className="text-[12px] font-extralight">
              {format(new Date(to || ""), "yyyy-MM-dd HH:mm:ss")}
            </p>
          </label>
        </div>
        <div className="flex items-center p-3 gap-2">
          <div className="flex flex-row">
            <p className=" text-sm2 mr-1">저장일시 : </p>
            <p className="text-[12px] font-extralight mr-3">
              {format(new Date(lastUpdated || ""), "yyyy-MM-dd HH:mm:ss")}
            </p>
          </div>
        </div>
        {alertMessage && <Alert message={alertMessage} />}
      </div>
    </div>
  );
};

export default SnapshotTimeRangeBar;
