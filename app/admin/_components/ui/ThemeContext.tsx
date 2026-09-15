"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Moon, Sun } from "@/app/components/icons";

export type AdminTheme = "yellow-black" | "yellow-white";

interface ThemeContextType {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "thangam_admin_theme";

function getInitialTheme(): AdminTheme {
  if (typeof window === "undefined") return "yellow-black";
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as AdminTheme | null;
    if (stored === "yellow-white" || stored === "yellow-black") {
      return stored;
    }
  } catch {
    // Ignore error
  }
  return "yellow-black";
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>(getInitialTheme);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore
    }

    const root = document.documentElement;
    if (theme === "yellow-black") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const setTheme = (t: AdminTheme) => {
    setThemeState(t);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "yellow-black" ? "yellow-white" : "yellow-black"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div className={theme === "yellow-black" ? "dark" : ""}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within an AdminThemeProvider");
  }
  return context;
}

/**
 * Icon-only theme toggle button for switching between dark and light themes.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useAdminTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={theme === "yellow-black" ? "Switch to light theme" : "Switch to dark theme"}
      className={`flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 shadow-sm hover:bg-stone-50 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900/90 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white transition-colors ${className}`}
    >
      {theme === "yellow-black" ? (
        <Sun className="h-4 w-4 text-yellow-400" />
      ) : (
        <Moon className="h-4 w-4 text-stone-700" />
      )}
    </button>
  );
}
