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
import { useDraftDashboardStore } from "@/store/useDraftDashboardStore";

Chart.register(zoomPlugin);

const ChartSection = () => {
  const router = useRouter();
  const params = useSearchParams();
  const dashboardId = params.get("id") || "1";
  const chartId = params.get("chartId") || undefined;

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

  const { addPannelToDashboard, updatePannelInDashboard, getDashboardById } =
    useDashboardStore2();
  const { draftDashboard, startDraftDashboard, addPannelToDraft } =
    useDraftDashboardStore();

  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [refreshTime, setRefreshTime] = useState<number | "autoType">(10);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const dashboard = getDashboardById(dashboardId);
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
    const panelId = isEditing ? chartId! : draftDashboard?.id;
    const gridPos = existingPannel?.gridPos || { x: 0, y: 0, w: 4, h: 4 };

    let newPannel: DashboardPannel;

    // 차트 패널 생성
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
        pannelId: panelId || "1",
        pannelType: "chart",
        pannelOptions: chartOptions,
        datasets: chartOptions.datasets,
        gridPos,
      };
    } else {
      // 위젯 패널 생성
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
        pannelId: panelId || "1",
        pannelType: "widget",
        pannelOptions: widgetOptions,
        datasets: [],
        gridPos,
      };
    }

    // draft 대시보드에 패널 추가
    if (draftDashboard) {
      addPannelToDraft(newPannel);
      // draft 대시보드로 이동
      router.push(`/detail2?id=${draftDashboard.id}`);
    }
    // 기존 대시보드가 있을 경우
    else if (dashboardId) {
      if (isEditing) {
        // 기존 대시보드 패널 수정
        updatePannelInDashboard(dashboardId, newPannel);
      } else {
        // 기존 대시보드에 새 패널 추가
        addPannelToDashboard(dashboardId, newPannel);
      }
      // 기존 대시보드로 이동
      router.push(`/detail2?id=${dashboardId}`);
    }
  };

  return (
    <div className="mr-[300px] overflow-hidden">
      <AddChartBar isEdit={true} onCreateClick={handleCreateClick} />

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

export default ChartSection;
