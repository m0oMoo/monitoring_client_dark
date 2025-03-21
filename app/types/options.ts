export type WidgetType = "stat" | "card" | "cardWithChart" | "numberOnly";
export type ChartType = "bar" | "line" | "pie" | "doughnut";
export type DisplayMode = "chart" | "table";

export interface WidgetData {
  label: string;
  data: any;
}

export interface WidgetOptions {
  widgetId: string;
  widgetType: WidgetType;
  widgetData: WidgetData | null;
  label: string;
  maxValue: number;
  subText: string;
  changePercent: number;
  widgetBackgroundColor: string;
  textColor: string;
  colors: string[];
  thresholds: number[];
  unit: string;
  arrowVisible: boolean;
}

export interface WidgetData {
  label: string;
  data: any;
}

export interface ChartOptions {
  chartType: ChartType;
  showLegend: boolean;
  fill: boolean;
  legendPosition: "top" | "bottom" | "left" | "right";
  legendColor: string;
  isSingleColorMode: boolean;
  borderColor: string;
  backgroundColor: string;
  borderColors: string[];
  backgroundColors: string[];
  titleText: string;
  tooltipBgColor: string;
  tooltipMode: "index" | "nearest";
  hoverMode: "index" | "nearest";
  zoomMode: "xy" | "x" | "y";
  zoomSensitivity: number;
  crosshairColor: string;
  crosshairWidth: number;
  crosshairOpacity: number;
  xGridDisplay: boolean;
  yGridDisplay: boolean;
  showCrosshair: boolean;
  enableZoom: boolean;
  radius: number;
  tension: number;
  displayMode: DisplayMode;
}
