import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface StatWidgetProps {
  label: string;
  value: number;
  maxValue?: number;
  defaultColor?: string;
  thresholds?: number[];
  colors?: string[];
  className?: string;
}

const StatWidget = ({
  label,
  value,
  maxValue = 100,
  defaultColor = "#4CAF50",
  thresholds = [50, 75],
  colors = ["#4CAF50", "#f5f251", "#fc5353"],
  className,
}: StatWidgetProps) => {
  // value에 맞는 색상을 결정하는 함수
  const getColorByValue = (value: number): string => {
    for (let i = 0; i < thresholds.length; i++) {
      if (value < thresholds[i]) {
        return colors[i];
      }
    }
    return colors[colors.length - 1];
  };

  const activeColor = getColorByValue(value);

  // 최대값을 기준으로 퍼센트 변환
  const percentage = (value / maxValue) * 100;

  const data = {
    datasets: [
      {
        // maxValue 기준으로 퍼센트 변환
        data: [percentage, 100 - percentage],
        backgroundColor: [activeColor, "#E0E0E0"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 4,
    cutout: "80%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      title: {
        display: true,
        // text: label,
        color: "#1F1F1F",
        font: {
          size: 16,
          weight: "bold",
          family: "Pretendard, sans-serif",
        } as any,
      },
    },
  };

  return (
    <div
      className={`${className} border border-modern-border relative flex flex-col items-center justify-center
      border-navy-border pb-3 w-72 h-48 rounded-md shadow-lg `}
    >
      {/* 라벨을 차트 위에 배치 */}
      <div className="absolute top-2 text-lg font-bold text-modern-primary">
        {label}
      </div>

      {/* 도넛 차트 */}
      <Doughnut data={data} options={options} />

      {/* 차트 중앙에 값 배치 */}
      <div className="absolute text-3xl font-bold text-modern-primary mt-8">
        {value}
      </div>
    </div>
  );
};

export default StatWidget;
