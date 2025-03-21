import React from "react";

interface SliderToggleProps {
  value: number;
  onChange: (value: number) => void;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

/**
 * 슬라이더 + 토글 스위치 조합 컴포넌트
 * @param value 슬라이더의 현재 값
 * @param onChange 값이 변경될 때 호출되는 콜백 함수
 * @param enabled 슬라이더 활성화 여부
 * @param onToggle 토글 스위치가 변경될 때 호출되는 콜백 함수
 * @param min 슬라이더의 최소값 (기본값: 0)
 * @param max 슬라이더의 최대값 (기본값: 10)
 * @param step 슬라이더의 증가 단위 (기본값: 0.1)
 * @param steclassName 추가적인 클래스명
 * @returns
 */
const SliderToggle: React.FC<SliderToggleProps> = ({
  value,
  onChange,
  enabled,
  onToggle,
  min = 0,
  max = 10,
  step = 0.1,
  className,
}) => {
  return (
    <div className={`flex flex-row items-center gap-4 mt-1 ${className}`}>
      {/* 슬라이더 */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={!enabled}
        className="w-full h-2 bg-modern-border rounded-lg appearance-none disabled:opacity-50 
                cursor-pointer accent-modern-point_20"
      />
      {/* 현재 값 표시 */}
      <span className="text-sm1 w-4 text-modern-text">{value.toFixed(1)}</span>
    </div>
  );
};

export default SliderToggle;
