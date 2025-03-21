import React, { useState } from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  const handleToggle = () => {
    onChange(!checked);
  };

  return (
    <div
      onClick={handleToggle}
      className={`relative inline-flex items-center cursor-pointer ${
        checked ? "bg-modern-point_80" : "bg-modern-btn_hover"
      } rounded-full w-11 h-6 transition-colors duration-200 ease-in-out`}
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
