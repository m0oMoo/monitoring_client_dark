import { useThemeStore } from "@/store/useThemeStore";
import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  const { theme } = useThemeStore();

  const handleToggle = () => {
    onChange(!checked);
  };

  // 체크되었을 때 배경 색상
  const checkedBgClass = {
    modern: "bg-modern-point_80",
    blue: "bg-blue-point_80",
    pink: "bg-pink-point_80",
    orange: "bg-orange-point_80",
    ivory: "bg-ivory-point_80",
  }[theme];

  // 체크 안됐을 때 배경 색상
  const uncheckedBgClass = {
    modern: "bg-modern-btn_hover",
    blue: "bg-modern-btn_hover",
    pink: "bg-modern-btn_hover",
    orange: "bg-modern-btn_hover",
    ivory: "bg-modern-btn_hover",
  }[theme];

  return (
    <div
      onClick={handleToggle}
      className={`relative inline-flex items-center cursor-pointer rounded-full w-11 h-6 transition-colors duration-200 ease-in-out ${
        checked ? checkedBgClass : uncheckedBgClass
      }`}
    >
      <span
        className={`${
          checked ? "translate-x-6" : "translate-x-1"
        } inline-block w-4 h-4 bg-modern-subtext5 rounded-full shadow-md transition-transform duration-200 ease-in-out`}
      />
      <span
        className={`absolute text-modern-subtext5 text-xs font-medium left-1 top-1 ${
          checked ? "opacity-100" : "opacity-0"
        } transition-opacity duration-200 ease-in-out`}
      />
    </div>
  );
};

export default ToggleSwitch;
