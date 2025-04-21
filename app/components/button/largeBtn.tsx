import { useThemeStore } from "@/store/useThemeStore";

interface LargeBtnProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
}

const LargeBtn = ({ title, onClick, disabled }: LargeBtnProps) => {
  const { theme } = useThemeStore();

  const bgColorClass = {
    modern: "bg-modern-point_10",
    blue: "bg-blue-point_10",
    pink: "bg-pink-point_10",
    orange: "bg-orange-point_10",
    ivory: "bg-ivory-point_10",
  }[theme];

  const textColorClass = {
    modern: "text-modern-point",
    blue: "text-blue-point",
    pink: "text-pink-point",
    orange: "text-orange-point",
    ivory: "text-ivory-point",
  }[theme];

  const hoverBgColorClass = {
    modern: "hover:bg-modern-point_20",
    blue: "hover:bg-blue-point_20",
    pink: "hover:bg-pink-point_20",
    orange: "hover:bg-orange-point_20",
    ivory: "hover:bg-ivory-point_20",
  }[theme];

  return (
    <button
      className={`p-2 rounded w-[250px] transition duration-200 ${bgColorClass} ${textColorClass} ${hoverBgColorClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default LargeBtn;
