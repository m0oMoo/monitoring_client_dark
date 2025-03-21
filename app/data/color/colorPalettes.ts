export const COLOR = [
  { borderColor: "#ff6384", backgroundColor: "rgba(255, 99, 132, 0.2)" },
  { borderColor: "#36a2eb", backgroundColor: "rgba(54, 162, 235, 0.2)" },
  { borderColor: "#ffcd56", backgroundColor: "rgba(255, 205, 86, 0.2)" },
  { borderColor: "#4bc0c0", backgroundColor: "rgba(75, 192, 192, 0.2)" },
  { borderColor: "#9966ff", backgroundColor: "rgba(153, 102, 255, 0.2)" },
];

export const DARK_COLOR_PALETTES = [
  {
    name: "Classic",
    borderColors: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff"],
    backgroundColors: [
      "rgba(255, 99, 132, 0.15)", // 밝은 빨간색에 부드러운 투명도
      "rgba(54, 162, 235, 0.15)", // 부드러운 파란색
      "rgba(255, 205, 86, 0.15)", // 밝은 노란색
      "rgba(75, 192, 192, 0.15)", // 부드러운 청록색
      "rgba(153, 102, 255, 0.15)", // 부드러운 보라색
    ],
  },
  {
    name: "Rainbow",
    borderColors: [
      "#ff0000",
      "#ff7f00",
      "#ffff00",
      "#00ff00",
      "#0000ff",
      "#4b0082",
      "#9400d3",
    ],
    backgroundColors: [
      "rgba(255, 0, 0, 0.15)", // 빨간색
      "rgba(255, 127, 0, 0.15)", // 주황색
      "rgba(255, 255, 0, 0.15)", // 노란색
      "rgba(0, 255, 0, 0.15)", // 초록색
      "rgba(0, 0, 255, 0.15)", // 파란색
      "rgba(75, 0, 130, 0.15)", // 남색
      "rgba(148, 0, 211, 0.15)", // 보라색
    ],
  },
  {
    name: "Tropical Vibes",
    borderColors: ["#ff1493", "#ff69b4", "#ffb6c1", "#f0e68c", "#32cd32"],
    backgroundColors: [
      "rgba(255, 20, 147, 0.15)", // 강렬한 분홍색
      "rgba(255, 105, 180, 0.15)", // 부드러운 분홍색
      "rgba(255, 182, 193, 0.15)", // 연한 분홍색
      "rgba(240, 230, 140, 0.15)", // 연한 노란색
      "rgba(50, 205, 50, 0.15)", // 연한 녹색
    ],
  },
  {
    name: "Citrus Twist",
    borderColors: ["#FF8C00", "#FF6347", "#FFD700", "#FF4500", "#FF1493"],
    backgroundColors: [
      "rgba(255, 140, 0, 0.15)", // 밝은 주황색
      "rgba(255, 99, 71, 0.15)", // 밝은 빨간색
      "rgba(255, 215, 0, 0.15)", // 밝은 노란색
      "rgba(255, 69, 0, 0.15)", // 주황색
      "rgba(255, 20, 147, 0.15)", // 강렬한 분홍색
    ],
  },
  {
    name: "Autumn Breeze",
    borderColors: ["#D2691E", "#8B4513", "#A52A2A", "#CD5C5C", "#F4A460"],
    backgroundColors: [
      "rgba(210, 105, 30, 0.15)", // 붉은 오렌지색
      "rgba(139, 69, 19, 0.15)", // 짙은 갈색
      "rgba(165, 42, 42, 0.15)", // 붉은 갈색
      "rgba(205, 92, 92, 0.15)", // 밝은 붉은색
      "rgba(244, 164, 96, 0.15)", // 부드러운 오렌지색
    ],
  },
  {
    name: "Warm Sunset",
    borderColors: ["#ff5733", "#ff6f61", "#ff9966", "#ffcc66", "#ffff66"],
    backgroundColors: [
      "rgba(255, 87, 51, 0.15)", // 따뜻한 주황색
      "rgba(255, 111, 97, 0.15)", // 붉은 주황색
      "rgba(255, 153, 102, 0.15)", // 밝은 주황색
      "rgba(255, 204, 102, 0.15)", // 연한 노란 주황색
      "rgba(255, 255, 102, 0.15)", // 연한 노란색
    ],
  },
  {
    name: "Forest Green",
    borderColors: ["#006400", "#228B22", "#32CD32", "#ADFF2F", "#7FFF00"],
    backgroundColors: [
      "rgba(0, 100, 0, 0.15)", // 어두운 초록색
      "rgba(34, 139, 34, 0.15)", // 중간 초록색
      "rgba(50, 205, 50, 0.15)", // 밝은 초록색
      "rgba(173, 255, 47, 0.15)", // 연한 초록색
      "rgba(127, 255, 0, 0.15)", // 밝은 연두색
    ],
  },
  {
    name: "Midnight Forest",
    borderColors: ["#004d00", "#006400", "#228B22", "#32CD32", "#006400"],
    backgroundColors: [
      "rgba(0, 77, 0, 0.15)", // 짙은 숲의 초록색
      "rgba(0, 100, 0, 0.15)", // 어두운 초록색
      "rgba(34, 139, 34, 0.15)", // 중간 초록색
      "rgba(50, 205, 50, 0.15)", // 밝은 초록색
      "rgba(0, 128, 0, 0.15)", // 기본 초록색
    ],
  },
  {
    name: "Frosty Winter",
    borderColors: ["#4682B4", "#5F9EA0", "#B0C4DE", "#87CEFA", "#F0FFFF"],
    backgroundColors: [
      "rgba(70, 130, 180, 0.15)", // 차가운 파란색
      "rgba(95, 158, 160, 0.15)", // 연한 청록색
      "rgba(176, 196, 222, 0.15)", // 흐린 파란색
      "rgba(135, 206, 250, 0.15)", // 밝은 파란색
      "rgba(240, 255, 255, 0.15)", // 매우 밝은 파란색
    ],
  },
  {
    name: "Ocean Blue",
    borderColors: ["#0033cc", "#0066ff", "#0099ff", "#00ccff", "#33ffff"],
    backgroundColors: [
      "rgba(0, 51, 204, 0.15)", // 짙은 파란색
      "rgba(0, 102, 255, 0.15)", // 중간 파란색
      "rgba(0, 153, 255, 0.15)", // 밝은 파란색
      "rgba(0, 204, 255, 0.15)", // 더 밝은 파란색
      "rgba(51, 255, 255, 0.15)", // 연한 청록색
    ],
  },
  {
    name: "Blue Lagoon",
    borderColors: ["#0077B6", "#00B4D8", "#90E0EF", "#48C9B0", "#003B5C"],
    backgroundColors: [
      "rgba(0, 119, 182, 0.15)", // 짙은 청록색
      "rgba(0, 180, 216, 0.15)", // 청록색
      "rgba(144, 224, 239, 0.15)", // 밝은 파란색
      "rgba(72, 201, 176, 0.15)", // 시원한 청록색
      "rgba(0, 59, 92, 0.15)", // 어두운 청색
    ],
  },
  {
    name: "Galaxy",
    borderColors: ["#0C0032", "#190061", "#3500D3", "#282A36", "#8D86C9"],
    backgroundColors: [
      "rgba(12, 0, 50, 0.15)", // 깊은 보라색
      "rgba(25, 0, 97, 0.15)", // 짙은 자주색
      "rgba(53, 0, 211, 0.15)", // 보라색
      "rgba(40, 42, 54, 0.15)", // 어두운 회색
      "rgba(141, 134, 201, 0.15)", // 연한 보라색
    ],
  },
  {
    name: "Purple Twilight",
    borderColors: ["#800080", "#6A0DAD", "#9B30FF", "#BA55D3", "#8A2BE2"],
    backgroundColors: [
      "rgba(128, 0, 128, 0.15)", // 짙은 보라색
      "rgba(106, 13, 173, 0.15)", // 자주색
      "rgba(155, 48, 255, 0.15)", // 밝은 보라색
      "rgba(186, 85, 211, 0.15)", // 중간 보라색
      "rgba(138, 43, 226, 0.15)", // 연한 보라색
    ],
  },
  {
    name: "Purple Haze",
    borderColors: ["#800080", "#9932CC", "#BA55D3", "#DA70D6", "#EE82EE"],
    backgroundColors: [
      "rgba(128, 0, 128, 0.15)", // 짙은 보라색
      "rgba(153, 50, 204, 0.15)", // 중간 보라색
      "rgba(186, 85, 211, 0.15)", // 밝은 보라색
      "rgba(218, 112, 214, 0.15)", // 연한 보라색
      "rgba(238, 130, 238, 0.15)", // 밝은 연보라색
    ],
  },

  {
    name: "Metallic Shine",
    borderColors: ["#C0C0C0", "#A9A9A9", "#808080", "#696969", "#2F4F4F"],
    backgroundColors: [
      "rgba(192, 192, 192, 0.15)", // 밝은 회색
      "rgba(169, 169, 169, 0.15)", // 회색
      "rgba(128, 128, 128, 0.15)", // 중간 회색
      "rgba(105, 105, 105, 0.15)", // 어두운 회색
      "rgba(47, 79, 79, 0.15)", // 청록색 회색
    ],
  },
];
