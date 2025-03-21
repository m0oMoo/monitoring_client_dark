import { BarChart, LineChart, PieChart, Circle } from "lucide-react";

type ChartType = "pie" | "bar" | "line" | "doughnut";

interface ChartTypeSelectorProps {
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
}

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
  chartType,
  setChartType,
}) => {
  return (
    <div className="mb-4">
      <div className="flex space-x-4">
        <button
          onClick={() => setChartType("pie")}
          className={`p-2 ${
            chartType === "pie"
              ? "bg-modern-border2 text-modern-point" // 버튼 색상과 텍스트 색상
              : "hover:bg-modern-border hover:text-modern-subtext3 active:bg-[#333333] text-modern-subtext4 "
          } rounded-xl transition duration-300`}
        >
          <PieChart size={24} />
        </button>
        <button
          onClick={() => setChartType("bar")}
          className={`p-2 ${
            chartType === "bar"
              ? "bg-modern-border2 text-modern-point" // 버튼 색상과 텍스트 색상
              : "hover:bg-modern-border hover:text-modern-subtext3 active:bg-[#333333] text-modern-subtext4"
          } rounded-xl transition duration-300`}
        >
          <BarChart size={24} />
        </button>
        <button
          onClick={() => setChartType("line")}
          className={`p-2 ${
            chartType === "line"
              ? "bg-modern-border2 text-modern-point" // 버튼 색상과 텍스트 색상
              : "hover:bg-modern-border hover:text-modern-subtext3 active:bg-[#333333] text-modern-subtext4"
          } rounded-xl transition duration-300`}
        >
          <LineChart size={24} />
        </button>
        <button
          onClick={() => setChartType("doughnut")}
          className={`p-2 ${
            chartType === "doughnut"
              ? "bg-modern-border2 text-modern-point" // 버튼 색상과 텍스트 색상
              : "hover:bg-modern-border hover:text-modern-subtext3 active:bg-[#333333] text-modern-subtext4"
          } rounded-xl transition duration-300`}
        >
          <Circle size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChartTypeSelector;
