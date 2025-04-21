import { useThemeStore } from "@/store/useThemeStore";
import React from "react";

interface ButtonProps {
  title: string;
  onClick?: () => void;
}

const BorderBtn: React.FC<ButtonProps> = ({ title, onClick }) => {
  const { theme } = useThemeStore();

  const bgClass = {
    modern: "bg-modern-point_10",
    blue: "bg-blue-point_10",
    pink: "bg-pink-point_10",
    orange: "bg-orange-point_10",
    ivory: "bg-ivory-point_10",
  }[theme];

  const hoverBgClass = {
    modern: "hover:bg-modern-point_20",
    blue: "hover:bg-blue-point_20",
    pink: "hover:bg-pink-point_20",
    orange: "hover:bg-orange-point_20",
    ivory: "hover:bg-ivory-point_20",
  }[theme];

  const textClass = {
    modern: "text-modern-point",
    blue: "text-blue-point",
    pink: "text-pink-point",
    orange: "text-orange-point",
    ivory: "text-ivory-point",
  }[theme];

  return (
    <button
      className={`${hoverBgClass} ${bgClass} ${textClass} px-2 py-0.5`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default BorderBtn;
