import { useState } from "react";
import { Settings } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";

export default function SettingsButton() {
  const { setTheme } = useThemeStore();
  const [open, setOpen] = useState(false);

  const handleThemeChange = (
    theme: "modern" | "blue" | "pink" | "orange" | "ivory"
  ) => {
    setTheme(theme);
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-2">
        <Settings className="w-5 h-5 text-ivory-text cursor-pointer" />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-modern-bg2 p-6 rounded-lg w-80">
            <h2 className="text-lg font-bold mb-4 text-center">테마 변경</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleThemeChange("modern")}
                className="py-2 px-4 rounded bg-modern-point_10 text-modern-text hover:opacity-80"
              >
                Modern
              </button>
              <button
                onClick={() => handleThemeChange("blue")}
                className="py-2 px-4 rounded bg-blue-500 text-white hover:opacity-80"
              >
                Blue
              </button>
              <button
                onClick={() => handleThemeChange("pink")}
                className="py-2 px-4 rounded bg-pink-400 text-white hover:opacity-80"
              >
                Pink
              </button>
              <button
                onClick={() => handleThemeChange("orange")}
                className="py-2 px-4 rounded bg-orange-400 text-white hover:opacity-80"
              >
                Orange
              </button>
              <button
                onClick={() => handleThemeChange("ivory")}
                className="py-2 px-4 rounded bg-yellow-200 text-gray-800 hover:opacity-80"
              >
                Ivory
              </button>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
