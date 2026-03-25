import type { CSSProperties } from "react";
import { theme } from "@/shared/constants/theme";

/** Breadcrumb + page chrome shared across listing-style routes (light theme). */
export const listingMainStyle: CSSProperties = {
  background: theme.bg,
  minHeight: "100vh",
};

export const crumbLinkStyle: CSSProperties = {
  color: theme.fgSubtle,
  textDecoration: "none",
};

export const crumbSepStyle: CSSProperties = { color: theme.fgFaint };

export const crumbCurrentStyle: CSSProperties = { color: theme.fg };

export const sectionEyebrowStyle: CSSProperties = {
  color: theme.accent,
  fontSize: "0.65rem",
  letterSpacing: "0.35em",
  textTransform: "uppercase",
  marginBottom: "0.5rem",
};

export const pageHeadingStyle: CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
  fontWeight: 600,
  color: theme.fg,
};
