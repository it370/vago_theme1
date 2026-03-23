"use client";

import { LayoutGrid, List } from "lucide-react";

export type SortOption = { label: string; value: string };
export type ViewMode = "grid" | "row";

const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { label: "Newest", value: "newest" },
  { label: "Price ↑", value: "price_asc" },
  { label: "Price ↓", value: "price_desc" },
  { label: "A – Z", value: "name_asc" },
];

interface ListingToolbarProps {
  totalItems?: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  sortOptions?: SortOption[];
  isLoading?: boolean;
}

export function ListingToolbar({
  totalItems,
  sortBy,
  onSortChange,
  view,
  onViewChange,
  sortOptions = DEFAULT_SORT_OPTIONS,
  isLoading,
}: ListingToolbarProps) {
  return (
    <div className="listing-toolbar">
      {/* Sort pills — scroll horizontally on mobile */}
      <div className="listing-toolbar__pills-wrap">
        <div className="listing-toolbar__pills">
          {sortOptions.map((opt) => {
            const active = sortBy === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSortChange(opt.value)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.38rem 0.9rem",
                  fontSize: "0.72rem",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: active ? 600 : 400,
                  letterSpacing: "0.06em",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  border: `1px solid ${active ? "#C9A770" : "rgba(255,255,255,0.12)"}`,
                  background: active ? "rgba(201,167,112,0.12)" : "transparent",
                  color: active ? "#C9A770" : "rgba(255,255,255,0.5)",
                  borderRadius: "2px",
                  transition: "all 0.15s",
                  flexShrink: 0,
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side — count + view toggles */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
        {!isLoading && totalItems !== undefined && (
          <span
            style={{
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.28)",
              fontFamily: "'Inter', sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            {totalItems} piece{totalItems !== 1 ? "s" : ""}
          </span>
        )}

        {/* Divider */}
        <div style={{ width: "1px", height: "1.2rem", background: "rgba(255,255,255,0.1)" }} />

        {/* Grid toggle */}
        <button
          type="button"
          onClick={() => onViewChange("grid")}
          aria-label="Grid view"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "2rem",
            height: "2rem",
            border: `1px solid ${view === "grid" ? "#C9A770" : "rgba(255,255,255,0.1)"}`,
            background: view === "grid" ? "rgba(201,167,112,0.1)" : "transparent",
            color: view === "grid" ? "#C9A770" : "rgba(255,255,255,0.4)",
            cursor: "pointer",
            borderRadius: "2px",
            transition: "all 0.15s",
          }}
        >
          <LayoutGrid size={14} />
        </button>

        {/* Row toggle */}
        <button
          type="button"
          onClick={() => onViewChange("row")}
          aria-label="List view"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "2rem",
            height: "2rem",
            border: `1px solid ${view === "row" ? "#C9A770" : "rgba(255,255,255,0.1)"}`,
            background: view === "row" ? "rgba(201,167,112,0.1)" : "transparent",
            color: view === "row" ? "#C9A770" : "rgba(255,255,255,0.4)",
            cursor: "pointer",
            borderRadius: "2px",
            transition: "all 0.15s",
          }}
        >
          <List size={14} />
        </button>
      </div>
    </div>
  );
}
