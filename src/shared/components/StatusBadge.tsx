import type { OrderStatus } from "@/shared/types";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  pending:   { label: "Pending",   color: "#FACC15", bg: "rgba(250,204,21,0.1)",  border: "rgba(250,204,21,0.3)" },
  confirmed: { label: "Confirmed", color: "#60A5FA", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.3)" },
  shipped:   { label: "Shipped",   color: "#C9A770", bg: "rgba(201,167,112,0.1)", border: "rgba(201,167,112,0.3)" },
  delivered: { label: "Delivered", color: "#4ADE80", bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.3)" },
  cancelled: { label: "Cancelled", color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)" },
};

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        fontSize: "0.7rem",
        fontWeight: 600,
        padding: "0.2rem 0.65rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        borderRadius: "2px",
      }}
    >
      {cfg.label}
    </span>
  );
}
