"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ComboboxOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  emptyLabel = "Sin seleccion",
  disabled = false,
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filtered = search.trim()
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(search.toLowerCase()) ||
          (o.sublabel?.toLowerCase().includes(search.toLowerCase()) ?? false)
      )
    : options;

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val);
      setOpen(false);
      setSearch("");
    },
    [onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange("");
      setSearch("");
    },
    [onChange]
  );

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  // Focus search input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => {
          if (!disabled) setOpen(!open);
        }}
        disabled={disabled}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition-colors text-left",
          "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900",
          "text-zinc-900 dark:text-zinc-100",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          open && "ring-2 ring-blue-500/20 border-blue-500"
        )}
      >
        <span
          className={cn(
            "truncate",
            !selectedOption && "text-zinc-400 dark:text-zinc-500"
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {value && (
            <span
              onClick={handleClear}
              className="rounded p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="h-3 w-3" />
            </span>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-zinc-400 transition-transform",
              open && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg">
          {/* Search input */}
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 px-3 py-2">
            <Search className="h-4 w-4 text-zinc-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
            />
          </div>

          {/* Options */}
          <div className="max-h-52 overflow-y-auto p-1">
            {/* Empty option */}
            <button
              type="button"
              onClick={() => handleSelect("")}
              className={cn(
                "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                !value
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              )}
            >
              {emptyLabel}
            </button>

            {filtered.length === 0 && search.trim() && (
              <div className="px-3 py-4 text-center text-sm text-zinc-400 dark:text-zinc-500">
                Sin resultados para &ldquo;{search}&rdquo;
              </div>
            )}

            {filtered.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                  value === option.value
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                )}
              >
                <span className="block truncate">{option.label}</span>
                {option.sublabel && (
                  <span className="block truncate text-xs text-zinc-400 dark:text-zinc-500">
                    {option.sublabel}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
