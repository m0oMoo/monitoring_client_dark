import React, { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { v4 as uuidv4 } from "uuid";
import zoomPlugin from "chartjs-plugin-zoom";
import { useRouter, useSearchParams } from "next/navigation";
import CustomTable from "@/components/table/customTable";
import { useChartOptions } from "@/context/chartOptionContext";
import { useSelectedSection } from "@/context/selectedSectionContext";
import { useWidgetOptions } from "@/context/widgetOptionContext";
import { useChartStore } from "@/store/useChartStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useWidgetStore } from "@/store/useWidgetStore";
import { ChartOptions, WidgetOptions } from "@/types/options";
import AddChartBar from "@/components/bar/addChartBar";
import WidgetPannel from "@/components/pannel/widget/widgetPannel";
import TimeRangeBar from "@/components/bar/timeRangeBar";
import ChartPannel from "@/components/pannel/chart/chartPannel";

Chart.register(zoomPlugin);

const DarkChartSection = () => {
  const { selectedSection } = useSelectedSection();
  const {
    datasets,
    chartType,
    fill,
    titleText,
    showLegend,
    legendPosition,
    legendColor,
    tooltipBgColor,
    isSingleColorMode,
    borderColor,
    backgroundColor,
    borderColors,
    backgroundColors,
    hoverMode,
    zoomMode,
    zoomSensitivity,
    xGridDisplay,
    yGridDisplay,
    crosshairColor,
    showCrosshair,
    crosshairWidth,
    enableZoom,
    radius,
    tension,
    tooltipMode,
    crosshairOpacity,
    displayMode,
    toggleDisplayMode,
    setOptions,
    setDatasets,
  } = useChartOptions();

  const {
    widgetType,
    widgetData,
    label,
    maxValue,
    subText,
    changePercent,
    widgetBackgroundColor,
    textColor,
    colors,
    thresholds,
    unit,
    arrowVisible,
    setWidgetOptions,
  } = useWidgetOptions();

  const router = useRouter();
  const id = useSearchParams();
  const dashboardId = id.get("id") || "1";
  const chartId = id.get("chartId") || undefined;

  const { charts, addChart, updateChart, removeChart } = useChartStore();
  const { widgets, addWidget, updateWidget, removeWidget } = useWidgetStore();
  const { addPanelToDashboard } = useDashboardStore();

  const existingChart = chartId
    ? charts[dashboardId]?.find((chart) => chart.chartId === chartId)
    : null;

  const chartRef = useRef<Chart | null>(null);
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [refreshTime, setRefreshTime] = useState<number | "autoType">(10);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    if (existingChart) {
      setOptions(existingChart.chartOptions);
      setDatasets(existingChart.datasets);
    }
  }, [existingChart]);

  const handleTimeChange = (type: "from" | "to", value: string) => {
    if (type === "from") setFrom(value);
    if (type === "to") setTo(value);
  };

  const handleRefreshChange = (value: number | "autoType") => {
    setRefreshTime(value);
  };

  useEffect(() => {
    const now = new Date();
    setFrom(now.toISOString().slice(0, 16));
    setTo(now.toISOString().slice(0, 16));
    setLastUpdated(now.toLocaleTimeString());
  }, []);

  const existingWidget = chartId
    ? widgets[dashboardId]?.find((widget) => widget.widgetId === chartId)
    : null;

  useEffect(() => {
    if (existingChart) {
      setOptions(existingChart.chartOptions);
      setDatasets(existingChart.datasets);
    } else if (existingWidget) {
      setWidgetOptions(existingWidget.widgetOptions);
    }
  }, [existingChart, existingWidget]);

  const newChartOptions: ChartOptions = {
    chartType,
    titleText,
    showLegend,
    fill,
    legendPosition,
    legendColor,
    tooltipBgColor,
    isSingleColorMode,
    borderColor,
    backgroundColor,
    borderColors,
    backgroundColors,
    hoverMode,
    zoomMode,
    zoomSensitivity,
    xGridDisplay,
    yGridDisplay,
    crosshairColor,
    showCrosshair,
    crosshairWidth,
    enableZoom,
    radius,
    tension,
    tooltipMode,
    crosshairOpacity,
    displayMode,
  };

  const newWidgetOptions: WidgetOptions = {
    widgetId: chartId || uuidv4(),
    widgetType,
    widgetData,
    label,
    maxValue,
    subText,
    changePercent,
    widgetBackgroundColor,
    textColor,
    colors,
    thresholds,
    unit,
    arrowVisible,
  };

  const handleCreateClick = () => {
    const newChartId = uuidv4();
    const newWidgetId = uuidv4();
    const defaultGridPos = { x: 0, y: 0, w: 4, h: 4 }; // ✅ 기본 위치값

    if (chartId) {
      if (existingChart) {
        if (selectedSection === "chartOption") {
          updateChart(
            dashboardId,
            chartId,
            newChartOptions,
            datasets,
            existingChart.gridPos
          );
        } else {
          removeChart(dashboardId, chartId);
          addWidget(
            dashboardId,
            newWidgetOptions,
            existingChart.gridPos || defaultGridPos
          );
          addPanelToDashboard(dashboardId, newWidgetId, "widget");
        }
      } else if (existingWidget) {
        if (selectedSection === "widgetOption") {
          updateWidget(
            dashboardId,
            chartId,
            newWidgetOptions,
            existingWidget.gridPos
          );
        } else {
          removeWidget(dashboardId, chartId);
          addChart(
            dashboardId,
            newChartOptions,
            datasets,
            existingWidget.gridPos || defaultGridPos
          );
          addPanelToDashboard(dashboardId, newChartId, "chart");
        }
      }
    } else {
      if (selectedSection === "chartOption") {
        addChart(dashboardId, newChartOptions, datasets, defaultGridPos);
        addPanelToDashboard(dashboardId, newChartId, "chart");
      } else if (selectedSection === "widgetOption") {
        addWidget(dashboardId, newWidgetOptions, defaultGridPos);
        addPanelToDashboard(dashboardId, newWidgetId, "widget");
      }
    }

    router.push(`/detail?id=${dashboardId}`);
  };

  // 🔹 `datasets` 데이터를 `CustomTable` 형식으로 변환
  const convertToTableData = () => {
    if (datasets.length === 0) return { headers: [], rows: [] };

    const headers = [
      "항목",
      ...datasets[0].data.map((_, index) => `X${index + 1}`),
    ];
    const rows = datasets.map((dataset) => ({
      label: dataset.label,
      values: dataset.data,
    }));

    return { headers, rows };
  };

  const tableData = convertToTableData();

  return (
    <div className="mr-[300px] overflow-hidden ">
      <AddChartBar isEdit={true} onCreateClick={handleCreateClick} />
      <TimeRangeBar
        from={from}
        to={to}
        lastUpdated={lastUpdated}
        refreshTime={refreshTime}
        onChange={(type, value) =>
          type === "from" ? setFrom(value) : setTo(value)
        }
        onRefreshChange={handleRefreshChange}
      />

      <div className="px-4 min-h-[500px]">
        {selectedSection === "widgetOption" ? (
          <div className="flex justify-center items-center">
            <WidgetPannel
              widgetType={widgetType}
              widgetData={widgetData}
              label={label}
              maxValue={maxValue}
              thresholds={thresholds}
              colors={colors}
              subText={subText}
              changePercent={changePercent}
              backgroundColor={widgetBackgroundColor}
              textColor={textColor}
              unit={unit}
              arrowVisible={arrowVisible}
              className="scale-[2] origin-center mt-32 will-change-transform"
            />
          </div>
        ) : (
          <>
            {displayMode === "chart" ? (
              <div className="border border-modern-border rounded-lg p-6 shadow-md h-[450px] flex flex-col">
                <h2 className="text-lg font-semibold mb-2 text-modern-text">
                  {titleText}
                </h2>
                <div className="flex-1">
                  <ChartPannel
                    type={chartType}
                    options={newChartOptions}
                    datasets={datasets}
                  />
                </div>
              </div>
            ) : (
              <CustomTable
                columns={[
                  { key: "name", label: "ID" },
                  ...datasets.map((dataset) => ({
                    key: dataset.label,
                    label: dataset.label,
                  })), // 데이터셋의 label을 컬럼명으로 사용
                ]}
                data={datasets[0]?.data.map((_, index) => ({
                  name: `${index + 1}`, // 각 데이터의 인덱스
                  ...datasets.reduce((acc, dataset) => {
                    acc[dataset.label] = dataset.data[index]; // dataset의 label을 key로 사용하여 값 저장
                    return acc;
                  }, {} as Record<string, any>),
                }))}
                title={titleText}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DarkChartSection;
