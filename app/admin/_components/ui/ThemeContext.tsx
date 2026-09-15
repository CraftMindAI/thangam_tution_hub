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
 * Modern tactile segmented toggle switch for switching between
 * Yellow & Black and Yellow & White.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useAdminTheme();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full p-1 bg-stone-100 border border-stone-200/80 dark:bg-stone-900/90 dark:border-stone-800 ${className}`}
      role="radiogroup"
      aria-label="Theme selector"
    >
      <button
        type="button"
        role="radio"
        aria-checked={theme === "yellow-black"}
        onClick={() => setTheme("yellow-black")}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
          theme === "yellow-black"
            ? "bg-yellow-400 text-stone-950 shadow-sm shadow-yellow-500/25 scale-[1.02]"
            : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
        }`}
        title="Yellow & Black Theme (Dark)"
      >
        <Moon className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Yellow & Black</span>
        <span className="sm:hidden">Black</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={theme === "yellow-white"}
        onClick={() => setTheme("yellow-white")}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
          theme === "yellow-white"
            ? "bg-white text-stone-950 shadow-sm border border-stone-200/80 scale-[1.02]"
            : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
        }`}
        title="Yellow & White Theme (Light)"
      >
        <Sun className="h-3.5 w-3.5 text-yellow-500" />
        <span className="hidden sm:inline">Yellow & White</span>
        <span className="sm:hidden">White</span>
      </button>
    </div>
  );
}
