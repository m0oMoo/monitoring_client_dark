import React from "react";

interface ToggleButtonGroupProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  label: string;
  clssName?: string;
}

/**
 *
 * @param options 버튼 옵션 배열
 * @param selected 선택된 값
 * @param onChange
 * @param label 그룹의 레이블
 * @returns
 */
const RoundToggleBtnGroup: React.FC<ToggleButtonGroupProps> = ({
  options,
  selected,
  onChange,
  label,
  clssName,
}) => {
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
                  ? "bg-modern-point_80 text-modern-subtext3"
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
