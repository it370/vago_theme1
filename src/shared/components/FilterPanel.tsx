"use client";

import { theme } from "@/shared/constants/theme";

interface FilterPanelProps {
  categories: Array<{ id: string; name: string }>;
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export function FilterPanel({ categories, activeId, onSelect }: FilterPanelProps) {
  const allItems = [{ id: null, name: "All" }, ...categories.map((c) => ({ id: c.id, name: c.name }))];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {allItems.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id ?? "all"}
            onClick={() => onSelect(item.id)}
            style={{
              border: `1px solid ${isActive ? theme.accent : theme.borderStrong}`,
              color: isActive ? theme.accent : theme.fgMuted,
              padding: "0.3rem 0.85rem",
              fontSize: "0.75rem",
              cursor: "pointer",
              borderRadius: "2rem",
              background: "transparent",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s",
            }}
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );
}
