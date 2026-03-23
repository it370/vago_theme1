"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare, Tag, Package } from "lucide-react";
import type { CheckoutNotes } from "@/features/checkout/queries";

interface SellerNotesPanelProps {
  notes: CheckoutNotes;
}

function NoteRow({
  icon,
  label,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  note: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.625rem",
        padding: "0.625rem 0",
        borderBottom: "1px solid rgba(201,167,112,0.15)",
      }}
    >
      <span style={{ color: "#C9A770", marginTop: "0.1rem", flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: "0.2rem" }}>
          {label}
        </p>
        <p style={{ fontSize: "0.78rem", color: "#F0F0F0", lineHeight: 1.6 }}>{note}</p>
      </div>
    </div>
  );
}

export function SellerNotesPanel({ notes }: SellerNotesPanelProps) {
  const [open, setOpen] = useState(true);

  const hasGlobal = !!notes.global?.trim();
  const hasProducts = (notes.products?.length ?? 0) > 0;
  const hasCategories = (notes.categories?.length ?? 0) > 0;

  if (!hasGlobal && !hasProducts && !hasCategories) return null;

  const totalNotes =
    (hasGlobal ? 1 : 0) +
    (notes.products?.length ?? 0) +
    (notes.categories?.length ?? 0);

  return (
    <div
      style={{
        border: "1px solid rgba(234,179,8,0.3)",
        background: "rgba(234,179,8,0.04)",
        borderRadius: "0.25rem",
        overflow: "hidden",
      }}
    >
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <MessageSquare size={14} style={{ color: "#EAB308", flexShrink: 0 }} />
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#EAB308" }}>
            Seller Notes
          </span>
          <span
            style={{
              background: "rgba(234,179,8,0.2)",
              color: "#EAB308",
              fontSize: "0.6rem",
              fontWeight: 700,
              borderRadius: "999px",
              padding: "0.1rem 0.4rem",
              lineHeight: 1,
            }}
          >
            {totalNotes}
          </span>
        </div>
        {open
          ? <ChevronUp size={14} style={{ color: "#EAB308", flexShrink: 0 }} />
          : <ChevronDown size={14} style={{ color: "#EAB308", flexShrink: 0 }} />
        }
      </button>

      {!open && (
        <p style={{ padding: "0 1rem 0.75rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: "-0.25rem" }}>
          Tap to read important notes before placing your order
        </p>
      )}

      {open && (
        <div
          style={{
            padding: "0 1rem 0.75rem",
            borderTop: "1px solid rgba(234,179,8,0.2)",
          }}
        >
          {hasGlobal && (
            <NoteRow icon={<MessageSquare size={13} />} label="From the seller" note={notes.global} />
          )}
          {notes.categories?.map((c) => (
            <NoteRow key={c.categoryId} icon={<Tag size={13} />} label={c.categoryName} note={c.note} />
          ))}
          {notes.products?.map((p) => (
            <NoteRow key={p.productId} icon={<Package size={13} />} label={p.productName} note={p.note} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SellerNotesPanelSkeleton() {
  return (
    <div
      style={{
        height: "3rem",
        borderRadius: "0.25rem",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#242426",
        animation: "pulse 1.5s ease infinite",
      }}
    />
  );
}
