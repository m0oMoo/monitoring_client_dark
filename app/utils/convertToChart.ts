import { CartesianScaleTypeRegistry } from "chart.js";

export const convertToChartJS = (data: any) => {
  const chartType = data.options.chartType;

  // ✅ pie, doughnut 차트일 경우 색상 적용 로직 수정
  if (chartType === "pie" || chartType === "doughnut") {
    return {
      labels: data.datasets[0].data.map((d: any) => d.label), // ✅ 개별 항목 유지 (Jan, Feb, Mar, ...)
      datasets: [
        {
          data: data.datasets.flatMap((dataset: any) =>
            dataset.data.map((d: any) => d.value)
          ),
          backgroundColor: data.datasets.flatMap(
            (dataset: any) => dataset.color // ✅ 개별 색상을 매핑
          ),
          borderColor: data.datasets.flatMap((dataset: any) =>
            dataset.color.map((c: string) => c.replace("0.5", "1"))
          ),
          borderWidth: 1,
        },
      ],
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: data.options.showLegend,
            position: data.options.legendPosition,
            labels: { color: data.options.legendColor },
          },
          title: {
            display: data.options.showTitle,
            text: data.options.titleText,
            color: data.options.titleColor,
          },
          tooltip: {
            enabled: data.options.showTooltip,
            backgroundColor: data.options.tooltipBgColor,
            mode: data.options.tooltipMode,
          },
        },
        layout: { padding: data.options.layoutPadding },
        aspectRatio: data.options.aspectRatio,
        animation: {
          duration: data.options.animationDuration,
          easing: data.options.animationEasing,
        },
      },
    };
  }

  // ✅ 기본 차트 (bar, line 등)
  return {
    labels: data.datasets[0].data.map((d: any) => d.label),
    datasets: data.datasets.map((dataset: any) => ({
      label: dataset.name,
      data: dataset.data.map((d: any) => d.value),
      backgroundColor: dataset.color,
      borderColor: dataset.color.map((c: string) => c.replace("0.5", "1")),
      fill: false,
    })),
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: data.options.showLegend,
          position: data.options.legendPosition,
          labels: { color: data.options.legendColor },
        },
        title: {
          display: data.options.showTitle,
          text: data.options.titleText,
          color: data.options.titleColor,
        },
        tooltip: {
          enabled: data.options.showTooltip,
          backgroundColor: data.options.tooltipBgColor,
          mode: data.options.tooltipMode,
        },
      },
      layout: { padding: data.options.layoutPadding },
      aspectRatio: data.options.aspectRatio,
      scales: {
        x: {
          type: "category" as keyof CartesianScaleTypeRegistry,
          ticks: { color: data.options.xAxisColor },
          grid: { display: data.options.xGridDisplay },
        },
        y: {
          ticks: { color: data.options.yAxisColor },
          grid: { color: data.options.yGridColor },
          suggestedMin: data.options.ySuggestedMin,
          suggestedMax: data.options.ySuggestedMax,
        },
      },
      interaction: {
        mode: data.options.interactionMode,
        intersect: data.options.interactionIntersect,
      },
      animation: {
        duration: data.options.animationDuration,
        easing: data.options.animationEasing,
      },
    },
  };
};

export const convertToPlotly = (data: any) => {
  // ✅ legend.xanchor 변환 함수 추가
  const mapXAnchor = (
    position: string
  ): "right" | "center" | "left" | "auto" => {
    if (position === "top" || position === "bottom") return "center";
    if (["left", "right"].includes(position))
      return position as "left" | "right";
    return "auto"; // 기본값
  };

  // ✅ hovermode 값 변환 함수
  const mapHoverMode = (
    mode: string | false
  ): "closest" | "x" | "y" | "x unified" | "y unified" | false => {
    const validModes = [
      "closest",
      "x",
      "y",
      "x unified",
      "y unified",
      false,
    ] as const;
    if (mode === "index") return "x unified";
    if (mode === "nearest") return "closest";
    return validModes.includes(mode as any) ? (mode as any) : "closest";
  };

  return {
    data: data.datasets.map((dataset: any) => {
      const chartType =
        data.options.chartType === "doughnut" ? "pie" : data.options.chartType;

      return {
        type: chartType,
        name: dataset.name,
        marker: { color: dataset.color },

        // ✅ 도넛 차트인 경우 hole 속성 추가
        ...(chartType === "pie"
          ? {
              labels: dataset.data.map((d: any) => d.label),
              values: dataset.data.map((d: any) => d.value),
              hole: data.options.chartType === "doughnut" ? 0.4 : 0, // ✅ 도넛 차트 지원
            }
          : {
              x: dataset.data.map((d: any) => d.label),
              y: dataset.data.map((d: any) => d.value),
            }),
      };
    }),
    layout: {
      title: {
        text: data.options.titleText, // ✅ 제목 텍스트 설정
        font: { color: data.options.titleColor }, // ✅ 제목 색상 적용
      },
      showlegend: data.options.showLegend,
      legend: {
        x: 1,
        xanchor: mapXAnchor(data.options.legendPosition),
        y: 1,
        font: { color: data.options.legendColor },
      },
      hovermode: mapHoverMode(data.options.hoverMode),
      xaxis: {
        title: { text: "", font: { color: data.options.xAxisColor } }, // ✅ 축 이름 적용
        gridcolor: data.options.xGridDisplay
          ? data.options.yGridColor
          : "transparent",
      },
      yaxis: {
        title: { text: "", font: { color: data.options.yAxisColor } }, // ✅ 축 이름 적용
        gridcolor: data.options.yGridColor,
        range: [data.options.ySuggestedMin, data.options.ySuggestedMax],
      },
      plot_bgcolor: "transparent", // ✅ 배경색 설정
      paper_bgcolor: "transparent", // ✅ 배경색 설정
    },
  };
};

export const convertToD3 = (data: any) => data;
