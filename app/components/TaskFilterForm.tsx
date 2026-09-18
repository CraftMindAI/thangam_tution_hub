"use client";

import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "./icons";

const inputClass =
  "w-full rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs font-semibold text-stone-900 outline-none transition-colors focus:border-yellow-400 focus:bg-white dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:focus:border-yellow-400 dark:focus:bg-stone-900";

const DEBOUNCE_MS = 400;

export default function TaskFilterForm({
  showEmail = false,
}: {
  showEmail?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateParam(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    // Any filter change starts back at page 1 of the new result set.
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
    // Force the server component to re-run with the new search params —
    // a query-string-only navigation can otherwise serve a cached RSC
    // payload for the route and silently keep showing the old results.
    router.refresh();
  }

  function handleTextChange(name: string, value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam(name, value), DEBOUNCE_MS);
  }

  const hasFilters = Boolean(
    searchParams.get("q") || searchParams.get("email") || searchParams.get("due")
  );

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-[180px]">
        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Search Title
          <div className="relative mt-1.5">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              autoComplete="off"
              defaultValue={searchParams.get("q") ?? ""}
              onChange={(e) => handleTextChange("q", e.target.value)}
              placeholder="Search by task title…"
              className={`${inputClass} pl-8`}
            />
          </div>
        </label>
      </div>

      {showEmail && (
        <div className="flex-1 min-w-[180px]">
          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Search Email
            <div className="relative mt-1.5">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                autoComplete="off"
                defaultValue={searchParams.get("email") ?? ""}
                onChange={(e) => handleTextChange("email", e.target.value)}
                placeholder="Search by student email…"
                className={`${inputClass} pl-8`}
              />
            </div>
          </label>
        </div>
      )}

      <div className="min-w-[160px]">
        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Due Date
          <input
            type="date"
            defaultValue={searchParams.get("due") ?? ""}
            onChange={(e) => updateParam("due", e.target.value)}
            className={`mt-1.5 block ${inputClass} [color-scheme:light] dark:[color-scheme:dark]`}
          />
        </label>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("q");
            params.delete("email");
            params.delete("due");
            params.delete("page");
            const qs = params.toString();
            router.push(qs ? `${pathname}?${qs}` : pathname);
            router.refresh();
          }}
          className="rounded-full border border-stone-300 px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
