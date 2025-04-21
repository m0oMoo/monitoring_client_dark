"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useSnapshotStore } from "@/store/useSnapshotStore";
import ChartPannel from "@/components/pannel/chart/chartPannel";
import WidgetPannel from "@/components/pannel/widget/widgetPannel";
import CustomTable from "@/components/table/customTable";
import { convertToTable } from "@/utils/convertToTable";
import { Dataset } from "@/types/dashboard";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import SnapshotTimeRangeBar from "@/components/bar/snapshotTimeRangeBar";

const ResponsiveGridLayout = WidthProvider(Responsive);

const SnapshotDetailSection = () => {
  const searchParams = useSearchParams();
  const snapshotId = searchParams.get("id");
  const { getSnapshotById } = useSnapshotStore();

  const snapshot = snapshotId ? getSnapshotById(snapshotId) : null;
  const dashboard = snapshot?.data.dashboards?.[0];

  if (!snapshot || !dashboard) {
    return (
      <div className="p-6 text-center text-modern-subtext">
        존재하지 않는 스냅샷입니다.
      </div>
    );
  }

  const layout: Layout[] = dashboard.pannels.map((panel: any) => ({
    i: panel.pannelId,
    x: panel.gridPos.x,
    y: panel.gridPos.y,
    w: panel.gridPos.w,
    h: panel.gridPos.h,
  }));

  return (
    <div className=" min-h-[calc(100vh-80px)]">
      <div className="bg-transparent h-[42.8px]" />
      <SnapshotTimeRangeBar
        title={snapshot.name}
        description={snapshot.description}
        from={snapshot.data.from || null}
        to={snapshot.data.to || null}
        lastUpdated={snapshot.createdAt}
      />
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        rowHeight={70}
        isDraggable={false}
        isResizable={false}
        compactType={null}
        preventCollision={true}
        maxRows={20}
      >
        {dashboard.pannels.map((panel: any) => (
          <div
            key={panel.pannelId}
            data-grid={layout.find((l: Layout) => l.i === panel.pannelId)}
          >
            <div className=" p-4 h-full flex flex-col border border-modern-border rounded">
              <h2 className="text-base font-semibold mb-2 text-modern-text">
                {panel.pannelType === "widget"
                  ? panel.pannelOptions.label
                  : panel.pannelOptions.titleText}
              </h2>

              <div className="flex-1 overflow-hidden">
                {panel.pannelType === "widget" ? (
                  <WidgetPannel
                    {...panel.pannelOptions}
                    backgroundColor={panel.pannelOptions.widgetBackgroundColor}
                    className="scale-[1] w-full h-full"
                  />
                ) : panel.pannelOptions.displayMode === "chart" ? (
                  <ChartPannel
                    type={panel.pannelOptions.chartType}
                    datasets={panel.datasets || []}
                    options={panel.pannelOptions}
                  />
                ) : (
                  <CustomTable
                    columns={[
                      { key: "name", label: "ID" },
                      ...(panel.datasets
                        ? panel.datasets.map((dataset: Dataset) => ({
                            key: dataset.label,
                            label: dataset.label,
                          }))
                        : []),
                    ]}
                    data={convertToTable(panel.datasets || []).rows}
                    title={panel.pannelOptions.titleText}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default SnapshotDetailSection;
