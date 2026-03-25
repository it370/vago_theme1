import { theme } from "@/shared/constants/theme";

interface SaleBadgeProps {
  label?: string;
}

export function SaleBadge({ label = "SALE" }: SaleBadgeProps) {
  return (
    <span
      style={{
        background: theme.accent,
        color: theme.onAccent,
        fontSize: "0.6rem",
        fontWeight: 700,
        padding: "0.2rem 0.5rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}
