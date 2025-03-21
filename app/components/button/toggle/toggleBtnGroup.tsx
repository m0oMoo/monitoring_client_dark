import React from "react";

interface ToggleButtonGroupProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  label: string;
}

/**
 *
 * @param options 버튼 옵션 배열
 * @param selected 선택된 값
 * @param onChange
 * @param label 그룹의 레이블
 * @returns
 */
const ToggleBtnGroup: React.FC<ToggleButtonGroupProps> = ({
  options,
  selected,
  onChange,
  label,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex space-x-2 mt-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selected === option
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } transition duration-300`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToggleBtnGroup;
