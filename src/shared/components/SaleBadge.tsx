interface SaleBadgeProps {
  label?: string;
}

export function SaleBadge({ label = "SALE" }: SaleBadgeProps) {
  return (
    <span
      style={{
        background: "#C9A770",
        color: "#1C1C1E",
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
