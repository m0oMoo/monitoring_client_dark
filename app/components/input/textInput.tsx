import React from "react";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder = "",
  className = "",
  disabled = false,
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
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

export default TextInput;
