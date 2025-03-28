import { Home, User, Settings, Menu } from "lucide-react";

const Header = ({ toggleMenu }: { toggleMenu: () => void }) => {
  return (
    <header
      className="w-full bg-modern-bg p-1 shadow-md flex justify-between items-center
    fixed top-0 left-0 right-0 z-50 border-b border-modern-border"
    >
      <div className="flex items-center space-x-2">
        <button onClick={toggleMenu} className="p-2">
          <Menu className="w-5 h-5 text-ivory-text" />
        </button>
        <Home className="w-5 h-5 text-ivory-text" />
        <span className="text-lg font-semibold text-ivory-text">Dashboard</span>
      </div>

      <div className="flex items-center text-ivory-text space-x-4">
        <User className="w-5 h-5 cursor-pointer" />
        <Settings className="w-5 h-5 cursor-pointer" />
      </div>
    </header>
  );
};

export default Header;
