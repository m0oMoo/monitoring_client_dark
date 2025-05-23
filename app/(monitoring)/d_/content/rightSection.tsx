import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ChartOption from "./chartOption";
import DataBinding from "./dataBinding";
import WidgetOption from "./widgetOption";
import { useSelectedSection } from "@/context/selectedSectionContext";
import { useChartStore } from "@/store/useChartStore";
import { useWidgetStore } from "@/store/useWidgetStore";

const RightSection = () => {
  const searchParams = useSearchParams();
  const chartId = searchParams.get("chartId") || undefined;

  const { selectedSection, setSelectedSection } = useSelectedSection();
  const { charts } = useChartStore();
  const { widgets } = useWidgetStore();

  // ✅ `selectedSectionValue`를 따로 관리 (사용자가 변경 가능)
  const [selectedSectionValue, setSelectedSectionValue] =
    useState<string>(selectedSection);
  const isInitialLoad = useRef(true); // 최초 로딩 여부 체크

  useEffect(() => {
    if (!chartId || !isInitialLoad.current) return; // 초기 실행 이후에는 실행되지 않도록 방지

    // 차트에 포함된 경우
    const isChart = Object.values(charts).some((chartList) =>
      chartList.some((chart) => chart.chartId === chartId)
    );

    // 위젯에 포함된 경우
    const isWidget = Object.values(widgets).some((widgetList) =>
      widgetList.some((widget) => widget.widgetId === chartId)
    );

    if (isChart && !isWidget) {
      setSelectedSection("chartOption");
      setSelectedSectionValue("chartOption");
    } else if (!isChart && isWidget) {
      setSelectedSection("widgetOption");
      setSelectedSectionValue("widgetOption");
    } else {
      setSelectedSection("chartOption");
      setSelectedSectionValue("chartOption");
    }

    isInitialLoad.current = false;
  }, [chartId, charts, widgets, setSelectedSection]);

  const [activeTab, setActiveTab] = useState<
    "chartOption" | "dataBinding" | "widgetOption"
  >("chartOption");

  const handleSectionClick = (
    type: "chartOption" | "dataBinding" | "widgetOption"
  ) => {
    setActiveTab(type);
    if (type !== "dataBinding") {
      setSelectedSection(type);
      setSelectedSectionValue(type);
    }
  };

  return (
    <div className="fixed top-0 right-0">
      <div className="flex flex-col text-md2 border-l border-0.5 border-modern-border pt-[44px]">
        {/* Data Binding 버튼 - selectedSection을 변경하지 않고, activeTab만 변경 */}
        <button
          onClick={() => handleSectionClick("dataBinding")}
          className={`px-[7.5px] py-[8.5px] border-b border-modern-border ${
            activeTab === "dataBinding"
              ? "bg-modern-point_10 text-modern-text"
              : " text-modern-text_disable"
          }`}
        >
          Data Binding
        </button>

        {/* Chart Option & Widget Option을 flex-row + w-full */}
        <div className="flex flex-row w-full border-b border-modern-border">
          <button
            onClick={() => handleSectionClick("chartOption")}
            className={`w-full py-2 border-r border-modern-border ${
              selectedSectionValue === "chartOption"
                ? "bg-modern-point_10 text-modern-text"
                : " text-modern-text_disable"
            }`}
          >
            Chart Option
          </button>
          <button
            onClick={() => handleSectionClick("widgetOption")}
            className={`w-full py-2 ${
              selectedSectionValue === "widgetOption"
                ? "bg-modern-point_10 text-modern-text"
                : " text-modern-text_disable"
            }`}
          >
            Widget Option
          </button>
        </div>
      </div>

      {/* 선택한 탭에 따라 컨텐츠 렌더링 */}
      {activeTab === "dataBinding" && <DataBinding />}
      {selectedSectionValue === "chartOption" && <ChartOption />}
      {selectedSectionValue === "widgetOption" && <WidgetOption />}
    </div>
  );
};

export default RightSection;
