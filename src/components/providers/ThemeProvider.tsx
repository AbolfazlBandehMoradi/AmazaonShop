import { useLayoutEffect, type ReactNode } from "react";
import { applyBodyTheme, useThemeStore } from "@/stores/themeStore";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  useLayoutEffect(() => {
    applyBodyTheme(theme);
  }, [theme]);

  return <>{children}</>;
}
