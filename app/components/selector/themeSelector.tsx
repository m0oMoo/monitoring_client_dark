"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export default function ThemeBodySelector() {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme) {
      document.body.dataset.theme = theme;
    }
  }, [theme]);

  return null;
}
