import { useThemeStore } from "@/store/useThemeStore";

interface ToggleButtonGroupProps<T extends string> {
  options: T[];
  selected: T;
  onChange: (value: T) => void;
  label: string;
}

const SquareToggleBtnGroup = <T extends string>({
  options,
  selected,
  onChange,
  label,
}: ToggleButtonGroupProps<T>) => {
  const { theme } = useThemeStore();

  // 선택된 버튼 배경 색상 (theme별)
  const selectedBgClass = {
    modern: "bg-modern-point_80",
    blue: "bg-blue-point_80",
    pink: "bg-pink-point_80",
    orange: "bg-orange-point_80",
    ivory: "bg-ivory-point_80",
  }[theme];

  // 선택된 버튼 텍스트 색상 (theme별)
  const selectedTextClass = {
    modern: "text-modern-subtext3",
    blue: "text-blue-subtext3",
    pink: "text-pink-subtext3",
    orange: "text-orange-subtext3",
    ivory: "text-ivory-subtext3",
  }[theme];

  return (
    <div className="text-sm1">
      <div className="flex">
        <div className="flex gap-1 border-y-[1px] border-modern-text_disable p-1">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`px-3.5 py-1.5 rounded-sm transition duration-300 ${
                selected === option
                  ? `${selectedBgClass} ${selectedTextClass}`
                  : `text-modern-subtext bg-modern-text_disable`
              }`}
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
