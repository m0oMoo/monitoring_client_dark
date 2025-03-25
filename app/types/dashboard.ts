export type Dataset = {
  label: string;
  data: number[];
};

export interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type PannelType = "chart" | "table" | "widget";

export type DisplayMode = "chart" | "table";

export type TableData = {
  headers: string[];
  rows: { label: string; values: number[] }[];
};

export type WidgetType = "stat" | "card" | "cardWithChart" | "numberOnly";

export interface WidgetOptionData {
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
}

export interface ChartOptionData {
  chartType: "bar" | "line" | "pie" | "doughnut";
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
  tableData: TableData;
  datasets: Dataset[];
}

export type DashboardPannel =
  | {
      pannelId: string;
      pannelType: "chart" | "table";
      pannelOptions: ChartOptionData;
      datasets: Dataset[];
      gridPos: GridPosition;
    }
  | {
      pannelId: string;
      pannelType: "widget";
      pannelOptions: WidgetOptionData;
      datasets: Dataset[];
      gridPos: GridPosition;
    };

export interface Dashboard {
  id: string;
  label: string;
  description?: string;
  pannels: DashboardPannel[];
}
