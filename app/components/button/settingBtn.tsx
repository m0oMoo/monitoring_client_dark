import { useState, useRef, useEffect } from "react";
import { Paintbrush } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";

export default function SettingsButton() {
  const { theme, setTheme } = useThemeStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleThemeChange = (
    theme: "modern" | "blue" | "pink" | "orange" | "ivory"
  ) => {
    setTheme(theme);
    setOpen(false);
  };

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const bgClass = {
    modern: "bg-modern-bg",
    blue: "bg-blue-bg",
    pink: "bg-pink-bg",
    orange: "bg-orange-bg",
    ivory: "bg-ivory-bg",
  }[theme];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button onClick={() => setOpen((prev) => !prev)} className="p-2">
        <Paintbrush className="w-5 h-5 text-ivory-text cursor-pointer" />
      </button>
      {open && (
        <div
          className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg z-50 
          border ${bgClass} border-gray-600`}
        >
          <div className="py-1">
            <button
              onClick={() => handleThemeChange("modern")}
              className={`block w-full text-left px-4 py-2 text-sm text-modern-point hover:bg-modern-hover ${
                theme === "modern" ? "bg-modern-point_20" : ""
              }`}
            >
              Modern
            </button>
            <button
              onClick={() => handleThemeChange("blue")}
              className={`block w-full text-left px-4 py-2 text-sm text-blue-point hover:bg-modern-hover ${
                theme === "blue" ? "bg-blue-point_20" : ""
              }`}
            >
              Blue
            </button>
            <button
              onClick={() => handleThemeChange("pink")}
              className={`block w-full text-left px-4 py-2 text-sm text-pink-point hover:bg-modern-hover ${
                theme === "pink" ? "bg-pink-point_20" : ""
              }`}
            >
              Pink
            </button>
            <button
              onClick={() => handleThemeChange("orange")}
              className={`block w-full text-left px-4 py-2 text-sm text-orange-point hover:bg-modern-hover ${
                theme === "orange" ? "bg-orange-point_20" : ""
              }`}
            >
              Orange
            </button>
            <button
              onClick={() => handleThemeChange("ivory")}
              className={`block w-full text-left px-4 py-2 text-sm text-yellow-point hover:bg-modern-hover ${
                theme === "ivory" ? "bg-yellow-point_20" : ""
              }`}
            >
              Ivory
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
