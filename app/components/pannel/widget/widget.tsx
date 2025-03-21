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
  subText?: string;
  changePercent?: number;
  backgroundColor: string;
  textColor?: string;
  arrowVisible: boolean;
  className?: string;
}

const Widget = ({
  title,
  value,
  subText,
  changePercent,
  backgroundColor,
  textColor,
  arrowVisible,
  className,
}: CardWidgetProps) => {
  const valueNumber = parseFloat(value);

  return (
    <div
      className={`${className} p-4 rounded-lg shadow-md flex flex-col justify-between w-72 h-32`}
      style={{ backgroundColor }}
    >
      {/* 제목 */}
      <div className="text-sm font-semibold" style={{ color: textColor }}>
        {title}
      </div>

      {/* 메인 값 */}
      <div className="text-2xl font-bold flex items-center gap-1">
        {value}
        {arrowVisible &&
          changePercent !== undefined &&
          (valueNumber < changePercent ? (
            <ArrowDown size={20} className="text-red-800" />
          ) : (
            <ArrowUp size={20} className="text-green-800" />
          ))}
      </div>

      {/* 부가 정보 */}
      {subText && (
        <div className="text-xs" style={{ color: textColor }}>
          {subText}
        </div>
      )}
    </div>
  );
};

export default Widget;
