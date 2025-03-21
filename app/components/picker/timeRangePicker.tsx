import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // 기본 스타일 추가

type TimeRangePickerProps = {
  from: string | null;
  to: string | null;
  onChange: (type: "from" | "to", value: string | null) => void; // `string | null` 처리
};

const TimeRangePicker = ({ from, to, onChange }: TimeRangePickerProps) => {
  return (
    <div className="flex gap-2 items-center">
      <label className="text-sm_bold text-modern-text">From:</label>
      <DatePicker
        selected={from ? new Date(from) : null} // 날짜가 없으면 `null`
        onChange={(date: Date | null) =>
          onChange("from", date ? date.toISOString() : null)
        } // 날짜 선택 안되면 `null` 처리
        showTimeSelect
        dateFormat="Pp"
        className="border border-modern-border py-1 px-2 text-sm1
        bg-modern-bg text-modern-text focus:outline-none"
      />

      <label className="text-sm_bold text-modern-text">To:</label>
      <DatePicker
        selected={to ? new Date(to) : null} // 날짜가 없으면 `null`
        onChange={(date: Date | null) =>
          onChange("to", date ? date.toISOString() : null)
        } // 날짜 선택 안되면 `null` 처리
        showTimeSelect
        dateFormat="Pp"
        className="border border-modern-border py-1 px-2 text-sm1
        bg-modern-bg text-modern-text focus:outline-none"
      />
    </div>
  );
};

export default TimeRangePicker;
