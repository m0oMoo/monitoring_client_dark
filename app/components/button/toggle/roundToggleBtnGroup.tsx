import { useThemeStore } from "@/store/useThemeStore";
import React from "react";

interface ToggleButtonGroupProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  label: string;
  clssName?: string;
}

const RoundToggleBtnGroup: React.FC<ToggleButtonGroupProps> = ({
  options,
  selected,
  onChange,
  label,
  clssName,
}) => {
  const { theme } = useThemeStore();

  // 테마별로 포인트 색상 매핑
  const selectedBgClass = {
    modern: "bg-modern-point_80",
    blue: "bg-blue-point_80",
    pink: "bg-pink-point_80",
    orange: "bg-orange-point_80",
    ivory: "bg-ivory-point_80",
  }[theme];

  // 테마별로 선택된 텍스트 색상 매핑 (필요하면)
  const selectedTextClass = {
    modern: "text-modern-subtext3",
    blue: "text-blue-subtext3",
    pink: "text-pink-subtext3",
    orange: "text-orange-subtext3",
    ivory: "text-ivory-subtext3",
  }[theme];

  return (
    <div className={`${clssName} text-sm1`}>
      <div className="relative flex">
        <div className="flex w-full h-9 rounded-full bg-modern-subtext4">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`flex-1 py-1.5 font-semibold rounded-full transition duration-300 ${
                selected === option
                  ? `${selectedBgClass} ${selectedTextClass}`
                  : "bg-modern-subtext4 text-modern-subtext"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div
          className="absolute top-0 left-0 w-1/2 h-full rounded-full transition-transform duration-300"
          style={{
            transform: `translateX(${selected === options[1] ? "100%" : "0%"})`,
          }}
        />
      </div>
    </div>
  );
};

export default RoundToggleBtnGroup;
