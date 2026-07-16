/**
 * src/components/ui/Select.tsx
 *
 * A highly scalable Autocomplete/Select primitive designed for enterprise forms.
 * Handles complex interactions like multiple selections via chips, internal text filtering,
 * and dynamic truncation, while remaining strictly controlled by the parent component.
 */
import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, X, Search as SearchIcon } from "lucide-react";

export type SelectValue = string | number | (string | number)[];

/**
 * Represents a single selectable item within the dropdown list.
 */
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

/**
 * Configuration contract for the Select primitive.
 */
export interface SelectProps {
  options: SelectOption[];
  value: SelectValue;
  onChange: (value: SelectValue) => void;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxDisplayCount?: number;
}

export const Select: React.FC<SelectProps> = ({ options, value, onChange, multiple = false, searchable = false, clearable = true, placeholder = "Select...", className = "", disabled = false, maxDisplayCount = 2, }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  /**
   * Global event listener to safely collapse the dropdown
   * when the user clicks anywhere outside its bounding box.
   */
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  /**
   * Manages the lifecycle of the search input, ensuring it immediately grabs
   * keyboard focus upon mounting, and flushes its state upon unmounting.
   */
  useEffect(() => {
    if (isOpen && searchable) searchInputRef.current?.focus();
    else if (!isOpen) setSearchTerm("");
  }, [isOpen, searchable]);

  /**
   * Memoized dataset filter. Prevents heavy array recalculations
   * on standard re-renders unless the search query or raw options change.
   */
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;
    const lowerSearch = searchTerm.toLowerCase();
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(lowerSearch),
    );
  }, [options, searchable, searchTerm]);

  const hasValue = multiple
    ? Array.isArray(value) && value.length > 0
    : value != null && value !== "";

  /**
   * Resolves the user's click interaction.
   * Mutates an array if `multiple` is active, otherwise swaps the singular string/number.
   */
  const toggleOption = (option: SelectOption) => {
    if (option.disabled) return;

    if (!multiple) {
      onChange(option.value);
      return setIsOpen(false);
    }

    const current = (Array.isArray(value) ? value : []) as (string | number)[];
    onChange(
      current.includes(option.value)
        ? current.filter((v) => v !== option.value)
        : [...current, option.value],
    );
  };

  /**
   * Constructs the active display state.
   * Dynamically renders standard text or calculates chip overflow math.
   */
  const renderValue = () => {
    if (!hasValue)
      return (
        <span className="text-muted-foreground truncate">{placeholder}</span>
      );

    if (!multiple) {
      return (
        <span className="truncate text-foreground">
          {options.find((o) => o.value === value)?.label || placeholder}
        </span>
      );
    }

    const selectedArr = (Array.isArray(value) ? value : []) as (
      | string
      | number
    )[];
    const selectedOpts = options.filter((o) => selectedArr.includes(o.value));

    const displayOpts = selectedOpts.slice(0, maxDisplayCount);
    const overflow = selectedOpts.length - maxDisplayCount;

    return (
      <div className="flex flex-wrap items-center gap-1 overflow-hidden">
        {displayOpts.map((opt) => (
          <span
            key={opt.value}
            className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary"
          >
            <span className="truncate max-w-20 sm:max-w-30">
              {opt.label}
            </span>
            {!disabled && (
              <X
                className="h-3 w-3 cursor-pointer hover:text-primary/70"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(selectedArr.filter((v) => v !== opt.value));
                }}
              />
            )}
          </span>
        ))}
        {overflow > 0 && (
          <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
            +{overflow} more
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Trigger Box */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex min-h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm focus-within:ring-1 focus-within:ring-primary ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-primary/50"}`}
      >
        <div className="flex-1 flex items-center overflow-hidden pr-2">
          {renderValue()}
        </div>

        <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
          {clearable && hasValue && !disabled && (
            <>
              <X
                className="h-3.5 w-3.5 cursor-pointer hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(multiple ? [] : "");
                }}
              />
              <div className="h-4 w-px bg-border" />
            </>
          )}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-background py-1 text-sm shadow-md animate-in fade-in-80 slide-in-from-top-1">
          {searchable && (
            <div className="sticky top-0 z-10 bg-background px-2 pb-2 pt-1 border-b border-border/50 mb-1">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="h-8 w-full rounded-sm bg-muted/50 pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {filteredOptions.length === 0 ? (
            <div className="py-3 text-center text-xs text-muted-foreground">
              No results match "{searchTerm}"
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = multiple
                ? Array.isArray(value) && value.includes(opt.value)
                : value === opt.value;

              return (
                <div
                  key={opt.value}
                  onClick={() => toggleOption(opt)}
                  className={`relative flex items-center mx-1 py-2 pl-8 pr-2 text-sm rounded-sm select-none ${opt.disabled ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-muted"} ${isSelected ? "bg-primary/5 text-primary font-medium" : "text-foreground"}`}
                >
                  <div className="absolute left-2 flex h-4 w-4 items-center justify-center">
                    {multiple ? (
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded border ${isSelected ? "bg-primary border-primary text-primary-foreground" : "border-input"}`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    ) : (
                      isSelected && <Check className="h-4 w-4" />
                    )}
                  </div>
                  <span className="truncate">{opt.label}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
