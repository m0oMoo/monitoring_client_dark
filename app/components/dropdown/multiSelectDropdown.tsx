import React, { useEffect, useState } from "react";

interface MultiSelectDropdownProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select options",
  className = "",
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(value);

  // ✅ 체크박스 클릭 시 선택 값 업데이트
  const handleCheckboxChange = (selectedValue: string) => {
    let updatedValues;

    if (selectedValues.includes(selectedValue)) {
      updatedValues = selectedValues.filter((val) => val !== selectedValue); // ✅ 선택 해제
    } else {
      updatedValues = [...selectedValues, selectedValue]; // ✅ 새 값 추가
    }

    // ✅ 새로운 배열을 만들어 React가 상태 변경을 감지하도록 강제 업데이트
    setSelectedValues(Array.from(updatedValues));
    onChange(Array.from(updatedValues));
  };

  // ✅ 외부 상태(value) 변경 시 내부 상태 동기화
  useEffect(() => {
    setSelectedValues(value);
  }, [value]);

  return (
    <div className={`border border-modern-border rounded-md p-2 ${className}`}>
      {/* <p className="text-sm text-gray-500 mb-1">{placeholder}</p> */}
      <div className="max-h-40 overflow-y-auto">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 py-1 cursor-pointer text-modern-text"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className="accent-modern-point_20"
            />
            <span className="text-md1">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
