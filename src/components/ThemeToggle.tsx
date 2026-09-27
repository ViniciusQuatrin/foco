"use client";

import { a11y } from "@/content/copy";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? a11y.themeLight : a11y.themeDark;
  return (
    <button
      type="button"
      className="btn btn-ghost touch"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
