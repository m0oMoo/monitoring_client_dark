import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type TimeRangePickerProps = {
  from: string | null;
  to: string | null;
  onChange: (type: "from" | "to", value: string | null) => void;
};

const TimeRangePicker = ({ from, to, onChange }: TimeRangePickerProps) => {
  return (
    <div className="flex gap-2 items-center">
      <label className="text-sm_bold text-modern-text">From:</label>
      <DatePicker
        selected={from ? new Date(from) : null}
        onChange={(date: Date | null) =>
          onChange("from", date ? date.toISOString() : null)
        }
        showTimeSelect
        dateFormat="yyyy.MM.dd HH:mm"
        className="border border-modern-border py-1 px-2 text-sm1
        bg-modern-bg text-modern-text focus:outline-none"
      />

      <label className="text-sm_bold text-modern-text">To:</label>
      <DatePicker
        selected={to ? new Date(to) : null}
        onChange={(date: Date | null) =>
          onChange("to", date ? date.toISOString() : null)
        }
        showTimeSelect
        dateFormat="yyyy.MM.dd HH:mm"
        className="border border-modern-border py-1 px-2 text-sm1
        bg-modern-bg text-modern-text focus:outline-none"
      />
    </div>
  );
};

export default TimeRangePicker;
