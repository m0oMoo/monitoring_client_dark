import { create } from "zustand";

interface ChartOptions {
  chartType: "bar" | "line" | "pie" | "doughnut";
  showLegend: boolean;
  fill: boolean;
  legendPosition: "top" | "bottom" | "left" | "right";
  legendColor: string;
  isSingleColorMode: boolean;
  borderColor: string;
  backgroundColor: string;
  borderColors: string[];
  backgroundColors: string[];
  titleText: string;
  tooltipBgColor: string;
  hoverMode: "index" | "nearest";
  zoomMode: "xy" | "x" | "y";
  zoomSensitivity: number;
  crosshairColor: string;
  crosshairWidth: number;
  crosshairOpacity: number;
  xGridDisplay: boolean;
  yGridDisplay: boolean;
  showCrosshair: boolean;
  enableZoom: boolean;
  radius: number;
  tension: number;
  setChartOptions: (options: Partial<ChartOptions>) => void;
}

interface ChartOptionStore {
  chartOptions: ChartOptions;
  setChartOptions: (options: Partial<ChartOptions>) => void;
}

export const useChartOptionStore = create<ChartOptionStore>((set) => ({
  chartOptions: {
    chartType: "line",
    fill: true,
    showLegend: true,
    legendPosition: "top",
    legendColor: "#000000",
    isSingleColorMode: false,
    borderColor: "rgba(220, 20, 60, 1)",
    backgroundColor: "rgba(220, 20, 60, 0.3)",
    borderColors: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff"],
    backgroundColors: [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 205, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
    ],
    titleText: "Chart Title",
    tooltipBgColor: "#4B4B4B",
    hoverMode: "index",
    zoomMode: "xy",
    zoomSensitivity: 1.0,
    crosshairColor: "#A0A0A0",
    crosshairWidth: 1,
    crosshairOpacity: 1,
    xGridDisplay: true,
    yGridDisplay: true,
    showCrosshair: true,
    enableZoom: true,
    radius: 3,
    tension: 0.3,
    setChartOptions: () => {},
  },
  setChartOptions: (newOptions) => {
    set((state) => ({
      chartOptions: {
        ...state.chartOptions,
        ...newOptions,
      },
    }));
  },
}));
