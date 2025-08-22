// src/components/ThemeSwitcher.tsx

"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-7 w-[76px]" />;
  }

  const isDarkMode = theme === "dark";

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Cor do ícone ajustada para melhor contraste no modo claro */}
      <Sun className="h-6 w-6 text-gray-500 dark:text-gray-200" />
      <Switch
        checked={isDarkMode}
        onChange={handleThemeChange}
        className="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-300 transition-colors dark:bg-gray-700"
      >
        <span className="inline-block h-6 w-6 transform rounded-full bg-white transition-transform dark:translate-x-5" />
      </Switch>
      {/* Cor do ícone ajustada para melhor contraste no modo claro */}
      <Moon className="h-6 w-6 text-gray-500 dark:text-gray-200" />
    </div>
  );
}
