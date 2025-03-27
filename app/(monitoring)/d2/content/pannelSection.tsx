"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Chart } from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { v4 as uuidv4 } from "uuid";

import { useChartOptions } from "@/context/chartOptionContext";
import { useWidgetOptions } from "@/context/widgetOptionContext";
import { useSelectedSection } from "@/context/selectedSectionContext";
import { useDashboardStore2 } from "@/store/useDashboard2Store";

import {
  ChartOptionData,
  WidgetOptionData,
  DashboardPannel,
} from "@/types/dashboard";

import ChartPannel from "@/components/pannel/chart/chartPannel";
import WidgetPannel from "@/components/pannel/widget/widgetPannel";
import CustomTable from "@/components/table/customTable";

import { extractWidgetOptionData } from "@/types/extractWidgetOptionData";
import { extractChartOptionData } from "@/types/extractChartOptionData";
import { useDraftDashboardStore } from "@/store/useDraftDashboardStore";
import DashboardLayout from "@/components/layout/dashboard/layout";

Chart.register(zoomPlugin);

const PannelSection = () => {
  const router = useRouter();
  const params = useSearchParams();
  const dashboardId = params.get("id") || "1";
  const pannelId = params.get("pannelId") || undefined;

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
  const { draftDashboard, addPannelToDraft } = useDraftDashboardStore();
  const dashboard = getDashboardById(dashboardId);

  const existingPannel = pannelId
    ? dashboardId === draftDashboard?.id
      ? draftDashboard?.pannels.find((p) => p.pannelId === pannelId)
      : dashboard?.pannels.find((p) => p.pannelId === pannelId)
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

  const handleCreateClick = () => {
    const isEditing = !!existingPannel;
    const panelId = isEditing ? pannelId! : draftDashboard?.id;
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
        pannelId: panelId || uuidv4(),
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
        pannelId: panelId || uuidv4(),
        pannelType: "widget",
        pannelOptions: widgetOptions,
        datasets: [],
        gridPos,
      };
    }

    // draft 대시보드에 패널 추가
    if (draftDashboard) {
      addPannelToDraft(newPannel, isEditing);
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

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="mr-[300px] overflow-hidden">
      <DashboardLayout
        onCreateClick={handleCreateClick}
        onCancelClick={handleCancel}
      >
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
      </DashboardLayout>
    </div>
  );
};

export default PannelSection;
