import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { ArrowDown, ArrowUp } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

interface CardWidgetProps {
  title: string;
  value: string;
  unit?: string;
  changePercent?: number;
  backgroundColor?: string;
  textColor?: string;
  arrowVisible?: boolean;
  className?: string;
}

const WidgetOnlyNumber = ({
  value,
  unit,
  changePercent,
  backgroundColor = "#fdfaf2",
  textColor = "#1d2e41",
  arrowVisible = false,
  className,
}: CardWidgetProps) => {
  const valueNumber = parseFloat(value);

  return (
    <div
      className={`${className} p-4 rounded-lg shadow-md flex w-72 h-32 justify-center items-center`}
      style={{ backgroundColor }}
    >
      <div className="flex gap-1 items-center">
        {/* 값 (value) */}
        <h1 className="text-title_3xl" style={{ color: textColor }}>
          {value}
        </h1>

        {/* 단위 (unit) */}
        {unit && (
          <span
            className="text-title_md pl-1 self-end"
            style={{ color: textColor }}
          >
            {unit}
          </span>
        )}

        {/* 변화율 아이콘 (arrowVisible이 true이고, changePercent가 존재할 때만) */}
        {arrowVisible &&
          changePercent !== undefined &&
          (valueNumber < changePercent ? (
            <ArrowDown size={20} className="text-red-800" />
          ) : (
            <ArrowUp size={20} className="text-green-800" />
          ))}
      </div>
    </div>
  );
};

export default WidgetOnlyNumber;
