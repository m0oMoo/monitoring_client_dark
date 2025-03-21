import React from "react";

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  placeholder = "",
  className = "",
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // 숫자만 허용 (빈 문자열도 허용)
    if (/^\d*$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={`py-1.5 px-2 text-md1 rounded-md
        placeholder:text-modern-text_disable text-modern-text
        ${
          disabled
            ? "text-modern-text_disable bg-modern-bg1"
            : "focus:outline focus:outline-modern-border bg-modern-border2"
        } ${className}`}
      disabled={disabled}
    />
  );
};

export default NumberInput;
