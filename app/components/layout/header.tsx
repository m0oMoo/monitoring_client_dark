import { Home, User, Menu } from "lucide-react";
import SettingsButton from "../button/settingBtn";
import { useThemeStore } from "@/store/useThemeStore";

const Header = ({ toggleMenu }: { toggleMenu: () => void }) => {
  const { theme } = useThemeStore();

  const bgClass = {
    modern: "bg-modern-bg",
    blue: "bg-blue-bg",
    pink: "bg-pink-bg",
    orange: "bg-orange-bg",
    ivory: "bg-ivory-bg",
  }[theme];

  return (
    <>
      <header
        className={`w-full  p-1 shadow-md flex justify-between items-center
        fixed top-0 left-0 right-0 border-b border-modern-border ${bgClass}`}
        style={{ zIndex: 1000 }}
      >
        <div className="flex items-center space-x-2">
          <button onClick={toggleMenu} className="p-2">
            <Menu className="w-5 h-5 text-ivory-text" />
          </button>
          <Home className="w-5 h-5 text-ivory-text" />
          <span className="text-lg font-semibold text-ivory-text">
            Dashboard
          </span>
        </div>

        <div className="flex items-center text-ivory-text space-x-4">
          <User className="w-5 h-5 cursor-pointer" />
          <SettingsButton />
        </div>
      </header>
    </>
  );
};

export default Header;
