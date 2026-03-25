"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { theme } from "@/shared/constants/theme";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

function pageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const delta = 1;
  const left = current - delta;
  const right = current + delta;
  const pages: (number | "...")[] = [];
  let prev = 0;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= left && i <= right)) {
      if (prev && i - prev > 1) pages.push("...");
      pages.push(i);
      prev = i;
    }
  }
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);
  const pages = pageRange(currentPage, totalPages);

  const btnBase: React.CSSProperties = {
    width: "2.25rem",
    height: "2.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${theme.borderStrong}`,
    background: "none",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.82rem",
    transition: "border-color 0.15s, color 0.15s",
    borderRadius: "0.15rem",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      {/* Count label */}
      <p style={{ fontSize: "0.75rem", color: theme.fgFaint }}>
        Showing{" "}
        <span style={{ color: theme.fgMuted }}>{start}–{end}</span>
        {" "}of{" "}
        <span style={{ color: theme.fgMuted }}>{totalItems}</span> pieces
      </p>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            ...btnBase,
            color: currentPage === 1 ? theme.fgFaint : theme.fgMuted,
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            opacity: currentPage === 1 ? 0.4 : 1,
          }}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              style={{ width: "2.25rem", height: "2.25rem", display: "flex", alignItems: "center", justifyContent: "center", color: theme.fgFaint, fontSize: "0.82rem" }}
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              style={{
                ...btnBase,
                background: p === currentPage ? theme.accent : "none",
                color: p === currentPage ? theme.onAccent : theme.fgMuted,
                borderColor: p === currentPage ? theme.accent : theme.borderStrong,
                fontWeight: p === currentPage ? 700 : 400,
              }}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            ...btnBase,
            color: currentPage === totalPages ? theme.fgFaint : theme.fgMuted,
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            opacity: currentPage === totalPages ? 0.4 : 1,
          }}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
