"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type WidgetType = "stat" | "card" | "cardWithChart" | "numberOnly";

interface WidgetOptions {
  widgetType: WidgetType;
  label: string;
  maxValue: number;
  thresholds: number[];
  colors: string[];
  subText: string;
  changePercent: number;
  chartData: number[];
  widgetBackgroundColor: string;
  textColor: string;
  unit: string;
  arrowVisible: boolean;
  widgetData: { label: string; data: any } | null;
  setWidgetOptions: (options: Partial<WidgetOptions>) => void;
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
