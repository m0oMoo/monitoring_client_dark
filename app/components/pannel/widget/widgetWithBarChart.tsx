import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import { Bar } from "react-chartjs-2";
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
  chartData?: number[];
  backgroundColor: string;
  textColor?: string;
  arrowVisible: boolean;
  className?: string;
}

const WidgetWithBarChart = ({
  title,
  value,
  subText,
  changePercent,
  chartData,
  backgroundColor,
  textColor,
  arrowVisible,
  className,
}: CardWidgetProps) => {
  const valueNumber = parseFloat(value);

  return (
    <div
      className={`${className} p-4 rounded-lg shadow-md w-72 flex flex-col justify-between`}
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

      {/* 작은 차트 (미니 바 차트) */}
      {chartData && (
        <div className="mt-2 h-10">
          <Bar
            data={{
              labels: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"],
              datasets: [
                {
                  data: chartData,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  borderRadius: 4,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              devicePixelRatio: 4,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
              },
              scales: {
                x: { display: false },
                y: { display: false },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default WidgetWithBarChart;
