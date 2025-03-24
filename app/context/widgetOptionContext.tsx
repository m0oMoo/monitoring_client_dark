"use client";

import { WidgetOptionData, WidgetType } from "@/types/dashboard";
import { createContext, useContext, useState, ReactNode } from "react";

export interface WidgetOptions extends WidgetOptionData {
  setWidgetOptions: (options: Partial<WidgetOptionData>) => void;
  setWidgetType: (type: WidgetType) => void;
  setWidgetData: (data: { label: string; data: any } | null) => void;
}

const WidgetOptionsContext = createContext<WidgetOptions | undefined>(
  undefined
);

export const WidgetOptionsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [widgetOptions, setWidgetOptionsState] = useState<WidgetOptions>({
    widgetType: "stat",
    label: "",
    maxValue: 100,
    thresholds: [50, 75],
    colors: ["#4CAF50", "#f5f251", "#fc5353"],
    subText: "",
    changePercent: 0,
    chartData: [],
    widgetBackgroundColor: "#69ab65e6",
    textColor: "#fff",
    unit: "",
    arrowVisible: false,
    widgetData: null, // 위젯 데이터 초기값 null
    setWidgetOptions: () => {},
    setWidgetType: () => {},
    setWidgetData: () => {},
  });

  const setWidgetOptions = (newOptions: Partial<WidgetOptions>) => {
    setWidgetOptionsState((prev) => ({ ...prev, ...newOptions }));
  };

  const setWidgetType = (type: WidgetType) => {
    setWidgetOptionsState((prev) => ({ ...prev, widgetType: type }));
  };

  const setWidgetData = (data: { label: string; data: any } | null) => {
    setWidgetOptionsState((prev) => ({ ...prev, widgetData: data }));
  };

  return (
    <WidgetOptionsContext.Provider
      value={{
        ...widgetOptions,
        setWidgetOptions,
        setWidgetType,
        setWidgetData,
      }}
    >
      {children}
    </WidgetOptionsContext.Provider>
  );
};

export const useWidgetOptions = () => {
  const context = useContext(WidgetOptionsContext);
  if (!context) {
    throw new Error(
      "useWidgetOptions must be used within a WidgetOptionsProvider"
    );
  }
  return context;
};
