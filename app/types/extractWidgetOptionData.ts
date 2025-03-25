import { WidgetOptions } from "@/context/widgetOptionContext";
import { WidgetOptionData } from "./dashboard";

export const extractWidgetOptionData = (
  options: WidgetOptions
): WidgetOptionData => {
  const {
    widgetType,
    label,
    maxValue,
    thresholds,
    colors,
    subText,
    changePercent,
    chartData,
    widgetBackgroundColor,
    textColor,
    unit,
    arrowVisible,
    widgetData,
  } = options;

  return {
    widgetType,
    label,
    maxValue,
    thresholds,
    colors,
    subText,
    changePercent,
    chartData,
    widgetBackgroundColor,
    textColor,
    unit,
    arrowVisible,
    widgetData,
  };
};
