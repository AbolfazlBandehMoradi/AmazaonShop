import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (newTheme: Theme) => void;
}

const THEME_STORAGE_KEY = "theme-storage";

export const applyBodyTheme = (theme: Theme) => {
  if (typeof document === "undefined") return;

  document.body.classList.remove("light", "dark");
  document.body.classList.add(theme);
};

const isTheme = (value: unknown): value is Theme => value === "light" || value === "dark";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";

  try {
    const storedValue = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (!storedValue) return "light";

    const parsedValue = JSON.parse(storedValue) as unknown;

    if (isTheme(parsedValue)) {
      return parsedValue;
    }

    if (
      parsedValue &&
      typeof parsedValue === "object" &&
      "state" in parsedValue &&
      parsedValue.state &&
      typeof parsedValue.state === "object" &&
      "theme" in parsedValue.state &&
      isTheme(parsedValue.state.theme)
    ) {
      return parsedValue.state.theme;
    }
  } catch {
    return "light";
  }

  return "light";
};

const initialTheme = getInitialTheme();

applyBodyTheme(initialTheme);

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: initialTheme,
      setTheme: (newTheme) => {
        applyBodyTheme(newTheme);
        set({ theme: newTheme });
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        applyBodyTheme(state?.theme ?? initialTheme);
      },
    }
  )
);
