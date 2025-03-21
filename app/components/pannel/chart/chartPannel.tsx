import { Dataset } from "@/context/chartOptionContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type ChartWidgetProps = {
  type: "bar" | "line" | "pie" | "doughnut";
  datasets: Dataset[];
  options?: any;
};

const ChartPannel = ({ type, datasets, options }: ChartWidgetProps) => {
  // 도넛/파이 차트용 데이터 변환
  const isPieOrDoughnut = type === "pie" || type === "doughnut";

  const chartData = isPieOrDoughnut
    ? {
        labels: datasets.map((dataset) => dataset.label),
        datasets: [
          {
            data: datasets.map((dataset, index) =>
              dataset.data.reduce((a, b) => a + b, 0)
            ), // 모든 데이터 합산하여 변환
            backgroundColor: datasets.map((dataset, index) =>
              options?.isSingleColorMode
                ? options?.backgroundColor
                : options?.backgroundColors?.[
                    index % options?.backgroundColors?.length
                  ]
            ),
            borderColor: datasets.map((dataset, index) =>
              options?.isSingleColorMode
                ? options?.borderColor
                : options?.borderColors?.[index % options?.borderColors?.length]
            ),
            borderWidth: options?.crosshairWidth ?? 1,
          },
        ],
      }
    : {
        labels: [
          "12:00",
          "12:05",
          "12:10",
          "12:15",
          "12:20",
          "12:25",
          "12:30",
          "12:35",
          "12:40",
          "12:45",
          "12:50",
          "12:55",
          "13:00",
        ],
        datasets: datasets.map((dataset, index) => ({
          ...dataset,
          borderColor: options?.isSingleColorMode
            ? options?.borderColor
            : options?.borderColors?.[index % options?.borderColors?.length],
          backgroundColor: options?.isSingleColorMode
            ? options?.backgroundColor
            : options?.backgroundColors?.[
                index % options?.backgroundColors?.length
              ],
          borderWidth: options?.crosshairWidth ?? 1,
          fill: options.fill,
        })),
      };

  // 차트 옵션 정의
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: options?.showLegend ?? true,
        position: options?.legendPosition ?? "top",
        labels: { color: options?.legendColor ?? "#000" },
      },
      tooltip: { backgroundColor: options?.tooltipBgColor ?? "#4B4B4B" },
      zoom: {
        pan: { enabled: options?.enableZoom, mode: options?.zoomMode },
        zoom: {
          wheel: { enabled: options?.enableZoom },
          pinch: { enabled: options?.enableZoom },
          mode: options?.zoomMode,
          speed: options?.zoomSensitivity,
        },
      },
    },
    scales: !isPieOrDoughnut
      ? {
          x: { grid: { display: options?.xGridDisplay ?? true } },
          y: { grid: { display: options?.yGridDisplay ?? true } },
        }
      : undefined,
    interaction: { mode: options?.hoverMode ?? "index", intersect: false },
    hover: { mode: options?.hoverMode ?? "index", intersect: false },
    elements: {
      point: {
        radius: options?.showCrosshair ? options?.radius ?? 3 : 0,
        borderWidth: options?.crosshairWidth ?? 1,
      },
      line: { tension: options?.tension ?? 0.3 },
    },
  };

  switch (type) {
    case "bar":
      return <Bar data={chartData} options={chartOptions} />;
    case "line":
      return <Line data={chartData} options={chartOptions} />;
    case "pie":
      return <Pie data={chartData} options={chartOptions} />;
    case "doughnut":
      return <Doughnut data={chartData} options={chartOptions} />;
    default:
      return <p>Invalid chart type</p>;
  }
};

export default ChartPannel;
