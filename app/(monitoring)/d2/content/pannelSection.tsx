"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Chart } from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";

import { useChartOptions } from "@/context/chartOptionContext";
import { useWidgetOptions } from "@/context/widgetOptionContext";
import { useSelectedSection } from "@/context/selectedSectionContext";
import { useDashboardStore2 } from "@/store/useDashboard2Store";

import {
  ChartOptionData,
  WidgetOptionData,
  DashboardPannel,
} from "@/types/dashboard";

import AddChartBar from "@/components/bar/addChartBar";
import TimeRangeBar from "@/components/bar/timeRangeBar";
import ChartPannel from "@/components/pannel/chart/chartPannel";
import WidgetPannel from "@/components/pannel/widget/widgetPannel";
import CustomTable from "@/components/table/customTable";

import { extractWidgetOptionData } from "@/types/extractWidgetOptionData";
import { extractChartOptionData } from "@/types/extractChartOptionData";

Chart.register(zoomPlugin);

const PannelSection = () => {
  const router = useRouter();
  const params = useSearchParams();
  const dashboardId = params.get("id");
  const chartId = params.get("chartId") || undefined;

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const { selectedSection, setSelectedSection } = useSelectedSection();
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

  const {
    addPannelToDashboard,
    updatePannelInDashboard,
    getDashboardById,
    addDashboard,
  } = useDashboardStore2();

  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [refreshTime, setRefreshTime] = useState<number | "autoType">(10);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const dashboard = getDashboardById(dashboardId || "1");
  const existingPannel = chartId
    ? dashboard?.pannels.find((p) => p.pannelId === chartId)
    : null;

  // 기존 패널 수정 시, context에 값 세팅
  useEffect(() => {
    if (!existingPannel) return;

    if (existingPannel.pannelType === "chart") {
      setSelectedSection("chartOption");
      setOptions(existingPannel.pannelOptions as ChartOptionData);
      setDatasets(existingPannel.datasets);
    } else if (existingPannel.pannelType === "widget") {
      setSelectedSection("widgetOption");
      setWidgetOptions(existingPannel.pannelOptions as WidgetOptionData);
    }
  }, [existingPannel]);

  // 시간 초기화
  useEffect(() => {
    const now = new Date();
    const formatted = now.toISOString().slice(0, 16);
    setFrom(formatted);
    setTo(formatted);
    setLastUpdated(now.toLocaleTimeString());
  }, []);

  const handleCreateClick = () => {
    const isEditing = !!existingPannel;
    const panelId = isEditing ? chartId! : uuidv4(); // 새로 생성된 패널에 ID 부여
    const gridPos = existingPannel?.gridPos || { x: 0, y: 0, w: 4, h: 4 };

    let newPannel: DashboardPannel;

    // 패널 종류에 따라 옵션 설정
    if (selectedSection === "chartOption") {
      const chartOptions = extractChartOptionData({
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
        datasets,
        tableData: {
          headers: [
            "항목",
            ...(datasets[0]?.data.map((_, i) => `X${i + 1}`) || []),
          ],
          rows: datasets.map((ds) => ({
            label: ds.label,
            values: ds.data,
          })),
        },
        setOptions: () => {},
        setDatasets: () => {},
        toggleDisplayMode: () => {},
      });

      newPannel = {
        pannelId: panelId,
        pannelType: "chart",
        pannelOptions: chartOptions,
        datasets: chartOptions.datasets,
        gridPos,
      };
    } else {
      const widgetOptions = extractWidgetOptionData({
        widgetType,
        widgetData,
        label,
        maxValue,
        subText,
        changePercent,
        chartData: [],
        widgetBackgroundColor,
        textColor,
        colors,
        thresholds,
        unit,
        arrowVisible,
        setWidgetOptions: () => {},
        setWidgetType: () => {},
        setWidgetData: () => {},
      });

      newPannel = {
        pannelId: panelId,
        pannelType: "widget",
        pannelOptions: widgetOptions,
        datasets: [],
        gridPos,
      };
    }

    // 대시보드가 존재하는지 확인하고, 없으면 새 대시보드 생성
    if (dashboardId && getDashboardById(dashboardId)) {
      // 대시보드가 존재하면 패널을 추가하고, 페이지 이동
      addPannelToDashboard(dashboardId, newPannel);
      router.push(`/detail2?id=${dashboardId}`);
    } else {
      // 대시보드가 없으면 새 대시보드를 생성하고 그 ID로 패널 추가
      console.log("여기에 추가 됩니다.");
      addDashboard({
        id: dashboardId!,
        label: title,
        description,
        pannels: [newPannel], // 새 대시보드에 패널 추가
      });

      router.push(`/detail2?id=${dashboardId}`); // 새 대시보드로 이동
    }
  };

  return (
    <div className="mr-[300px] overflow-hidden">
      <AddChartBar
        isEdit={true}
        onCreateClick={handleCreateClick}
        isEditingDescValue={false}
        isEditingTitleValue={false}
      />

      <TimeRangeBar
        from={from}
        to={to}
        lastUpdated={lastUpdated}
        refreshTime={refreshTime}
        onChange={(type, value) =>
          type === "from" ? setFrom(value) : setTo(value)
        }
        onRefreshChange={setRefreshTime}
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
        ) : displayMode === "chart" ? (
          <div className="border border-modern-border rounded-lg p-6 shadow-md h-[450px] flex flex-col">
            <h2 className="text-lg font-semibold mb-2 text-modern-text">
              {titleText}
            </h2>
            <div className="flex-1">
              <ChartPannel
                type={chartType}
                options={{
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
                }}
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
              })),
            ]}
            data={datasets[0]?.data.map((_, index) => ({
              name: `${index + 1}`,
              ...datasets.reduce((acc, dataset) => {
                acc[dataset.label] = dataset.data[index];
                return acc;
              }, {} as Record<string, any>),
            }))}
            title={titleText}
          />
        )}
      </div>
    </div>
  );
};

export default PannelSection;
