// src/components/ThemeProvider.tsx

"use client";

import * as React from "react";
// A linha abaixo foi ajustada para importar o tipo diretamente do pacote principal
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
