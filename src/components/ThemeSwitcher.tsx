// src/components/ThemeSwitcher.tsx - CÓDIGO COMPLETO E ATUALIZADO

"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-7 w-[92px]" />;
  }

  const isDarkMode = theme === "dark";

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-6 w-6 text-gray-200" />
      <Switch
        id="theme-switch"
        checked={isDarkMode}
        onCheckedChange={handleThemeChange}
      />
      <Label htmlFor="theme-switch" className="sr-only">
        Alternar tema
      </Label>
      <Moon className="h-6 w-6 text-gray-200" />
    </div>
  );
}
