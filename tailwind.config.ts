import type { Config } from "tailwindcss";
import { PluginAPI } from "tailwindcss/types/config";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
      },
      colors: {
        modern: {
          bg: "#2E2E2E",
          bg1: "#3E3E3E",
          bg2: "#252525",
          bg3: "#1E1E1E",
          bg4: "#121212",
          primary: "#CFCFCF",
          text: "#DFDFDF",
          subtext: "#A1A1A1",
          subtext2: "#D1D1D1",
          subtext3: "#1E1E1E",
          subtext4: "#5E5E5E",
          subtext5: "#F5F5F5",
          text_disable: "#707070",
          point_text: "#FFCA28",
          border: "#6E6E6E",
          border_focus: "#AFAFAF",
          border2: "#444444",
          link: "#80CBC4",
          btn: "#444444", // 어두운 회색 배경
          point: "#80CBC4",
          black_10: "rgba(0, 0, 0, 0.1)",
          point_10: "rgba(128, 203, 196, 0.1)",
          point_20: "rgba(128, 203, 196, 0.2)",
          point_30: "rgba(128, 203, 196, 0.3)",
          point_50: "rgba(128, 203, 196, 0.5)",
          point_70: "rgba(128, 203, 196, 0.7)",
          point_80: "rgba(128, 203, 196, 0.8)",
          btn_hover: "#616161", // 호버 시 밝아지는 회색
          btn_bg: "#333333", // 눌림 상태에서 더 어두운 회색
          btn_pressed: "#333333", // 눌림 상태에서 더 어두운 회색
          hover: "#444444", // 호버 상태에서 배경이 밝아지는 효과
        },
        ivory: {
          bg: "#fdfdf4",
          bg_sub: "#fffffa",
          bg_primary: "#fdfaf2",
          bg_secondary: "#fdfcf7",
          text: "#fffcf2",
          text_sub: "#fdf7e4",
          hover: "#fdfaf2",
          pressed: "#fff8e7",
        },
      },
      boxShadow: {
        default: "2px 2px 12px 0px rgba(0, 0, 0, 0.12)",
        border: "0px -3px 20px 0px rgba(0, 0, 0, 0.05)",
        modal: "0px -6px 30px 0px rgba(0, 0, 0, 0.08)",
      },
      screens: {
        sm: "360px",
        sm_md: "668px",
        md: "768px",
        lg: "1024px",
        lx: "1288px",
      },
      fontSize: {
        xs: "10px",
        sm: "12px",
        md: "14px",
        lg: "16px",
        xl: "18px",
        xxl: "21px",
        xxxl: "24px",
        // 제목
        title_3xl: ["52px", { fontWeight: 600, lineHeight: "32px" }],
        title_2xl: ["46px", { fontWeight: 600, lineHeight: "32px" }],
        title_xl: ["30px", { fontWeight: 600, lineHeight: "32px" }],
        title_lg: ["24px", { fontWeight: 600, lineHeight: "32px" }],
        title_md: ["21px", { fontWeight: 600, lineHeight: "28px" }],
        title_sm: ["18px", { fontWeight: 600, lineHeight: "27px" }],
        title_xs: ["16px", { fontWeight: 500, lineHeight: "24px" }],
        // 본문
        sm1: ["12px", { fontWeight: 400, lineHeight: "18px" }],
        sm2: ["12px", { fontWeight: 500, lineHeight: "18px" }],
        sm_bold: ["14px", { fontWeight: 600, lineHeight: "18px" }],
        md1: ["14px", { fontWeight: 400, lineHeight: "21px" }],
        md2: ["14px", { fontWeight: 500, lineHeight: "21px" }],
        bold_md: ["14px", { fontWeight: 600, lineHeight: "21px" }],
        lg1: ["16px", { fontWeight: 400, lineHeight: "24px" }],
        lg2: ["16px", { fontWeight: 500, lineHeight: "24px" }],
        bold_lg: ["16px", { fontWeight: 600, lineHeight: "24px" }],
        // 모바일
        mobile1: ["18px", { fontWeight: 600, lineHeight: "27px" }],
        mobile2: ["16px", { fontWeight: 600, lineHeight: "24px" }],
        mobile3: ["14px", { fontWeight: 400, lineHeight: "21px" }],
        mobile4: ["14px", { fontWeight: 600, lineHeight: "21px" }],
      },
    },
  },
  plugins: [
    function (pluginAPI: PluginAPI) {
      pluginAPI.addUtilities({
        ".custom-scrollbar": {
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#BFC4CE",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#ABB0BA",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#fff",
            borderRadius: "4px",
          },
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
      });
    },
  ],
} satisfies Config;
