interface ToggleButtonGroupProps<T extends string> {
  options: T[];
  selected: T;
  onChange: (value: T) => void;
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
const SquareToggleBtnGroup = <T extends string>({
  options,
  selected,
  onChange,
  label,
}: ToggleButtonGroupProps<T>) => {
  return (
    <div className="text-sm1">
      <div className="flex">
        <div className="flex gap-1 border-y-[1px] border-modern-text_disable p-1">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`px-3.5 py-1.5 rounded-sm ${
                selected === option
                  ? "bg-modern-point_80 text-modern-subtext3"
                  : "bg-modern-text_disable text-modern-subtext"
              } transition duration-300`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SquareToggleBtnGroup;
