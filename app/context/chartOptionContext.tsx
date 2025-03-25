import React, { createContext, useContext, useState } from "react";
import { ChartOptionData, Dataset, TableData } from "@/types/dashboard";

export interface ChartOptions extends ChartOptionData {
  setOptions: (options: Partial<ChartOptionData>) => void;
  setDatasets: (datasets: Dataset[]) => void;
  toggleDisplayMode: () => void;
}

const ChartOptionsContext = createContext<ChartOptions | undefined>(undefined);

export const ChartOptionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [options, setOptionsState] = useState<ChartOptions>({
    chartType: "line",
    showLegend: true,
    fill: true,
    legendPosition: "top",
    legendColor: "#fff",
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
    tooltipMode: "index",
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
    datasets: [],
    displayMode: "chart",
    tableData: { headers: [], rows: [] },
    setOptions: () => {},
    setDatasets: () => {},
    toggleDisplayMode: () => {},
  });

  // 🔹 데이터 변환 함수 (차트 → 테이블)
  const convertToTableData = (datasets: Dataset[]): TableData => {
    if (datasets.length === 0) return { headers: [], rows: [] };

    // 첫 번째 데이터셋의 길이를 기준으로 X축 라벨 생성
    const headers = [
      "항목",
      ...datasets[0].data.map((_, index) => `X${index + 1}`),
    ];

    // 데이터셋을 행(row) 형태로 변환
    const rows = datasets.map((dataset) => ({
      label: dataset.label,
      values: dataset.data,
    }));

    return { headers, rows };
  };

  const setOptions = (newOptions: Partial<ChartOptionData>) => {
    setOptionsState((prev) => ({ ...prev, ...newOptions }));
  };

  const setDatasets = (newDatasets: Dataset[]) => {
    setOptionsState((prev) => ({
      ...prev,
      datasets: newDatasets,
      tableData: convertToTableData(newDatasets),
    }));
  };

  const toggleDisplayMode = () => {
    setOptionsState((prev) => ({
      ...prev,
      displayMode: prev.displayMode === "chart" ? "table" : "chart",
    }));
  };

  return (
    <ChartOptionsContext.Provider
      value={{ ...options, setOptions, setDatasets, toggleDisplayMode }}
    >
      {children}
    </ChartOptionsContext.Provider>
  );
};

export const useChartOptions = () => {
  const context = useContext(ChartOptionsContext);
  if (!context) {
    throw new Error(
      "useChartOptions must be used within a ChartOptionsProvider"
    );
  }
  return context;
};
