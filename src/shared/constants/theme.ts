/**
 * Theme tokens — same keys for light & dark so you can swap the active export.
 * Footer charcoal stays on both (brand rule); dark UI uses it as page bg too.
 */

export const lightTheme = {
  bg: "#F7F6F3",
  surface: "#FFFFFF",
  elevated: "#F0EEE9",
  variant: "#E4E1DA",
  imageBg: "#EAE7E1",

  fg: "#141413",
  fgMuted: "rgba(20,20,19,0.54)",
  fgSubtle: "rgba(20,20,19,0.38)",
  fgFaint: "rgba(20,20,19,0.22)",

  border: "rgba(20,20,19,0.08)",
  borderSoft: "rgba(20,20,19,0.05)",
  borderStrong: "rgba(20,20,19,0.14)",

  accent: "#C9A770",
  onAccent: "#1C1C1E",

  icon: "rgba(20,20,19,0.48)",
  iconMuted: "rgba(20,20,19,0.4)",
  navLink: "rgba(20,20,19,0.55)",

  headerBg: "rgba(247,246,243,0.94)",
  bottomNavBg: "rgba(255,255,255,0.97)",

  inputBg: "#FFFFFF",
  inputBorder: "rgba(20,20,19,0.12)",

  skeleton: "#E8E5DF",
  skeletonInner: "#D4D0C7",

  footerBg: "#1C1C1E",

  heroBase:
    "linear-gradient(135deg, #FAFAF8 0%, #F0EDE6 45%, #E5DFD4 100%)",
  heroBottomFade:
    "linear-gradient(to top, #F7F6F3, rgba(247,246,243,0.2) 55%, transparent)",

  offerOverlay:
    "linear-gradient(to right, rgba(255,255,255,0.94), rgba(247,246,243,0.5) 52%, transparent)",

  shimmer: "rgba(20,20,19,0.06)",

  cardHoverScrim: "rgba(20,20,19,0.14)",
  cardHoverBarBg: "rgba(255,255,255,0.88)",
  cardHoverBarBorder: "rgba(20,20,19,0.1)",
} as const;

/** Original dark luxury theme (pre–light refresh). */
export const darkTheme = {
  bg: "#1C1C1E",
  surface: "#242426",
  elevated: "#2C2C2E",
  variant: "#3A3A3C",
  imageBg: "#242426",

  fg: "#F0F0F0",
  fgMuted: "rgba(255,255,255,0.55)",
  fgSubtle: "rgba(255,255,255,0.35)",
  fgFaint: "rgba(255,255,255,0.2)",

  border: "rgba(255,255,255,0.06)",
  borderSoft: "rgba(255,255,255,0.04)",
  borderStrong: "rgba(255,255,255,0.12)",

  accent: "#C9A770",
  onAccent: "#1C1C1E",

  icon: "rgba(255,255,255,0.55)",
  iconMuted: "rgba(255,255,255,0.4)",
  navLink: "rgba(255,255,255,0.6)",

  headerBg: "rgba(28,28,30,0.95)",
  bottomNavBg: "rgba(28,28,30,0.97)",

  inputBg: "rgba(255,255,255,0.06)",
  inputBorder: "rgba(255,255,255,0.1)",

  skeleton: "#242426",
  skeletonInner: "#3A3A3C",

  footerBg: "#1C1C1E",

  heroBase: "linear-gradient(135deg, #0F0F10, #1C1C1E 55%, #2C2018)",
  heroBottomFade: "linear-gradient(to top, #1C1C1E, transparent 50%)",

  offerOverlay:
    "linear-gradient(to right, rgba(28,28,30,0.88), rgba(28,28,30,0.4) 55%, transparent)",

  shimmer: "rgba(255,255,255,0.06)",

  cardHoverScrim: "rgba(0,0,0,0.35)",
  cardHoverBarBg: "rgba(255,255,255,0.1)",
  cardHoverBarBorder: "rgba(255,255,255,0.2)",
} as const;

/**
 * Pure white theme — zero creaminess, clinical-fresh.
 * Every surface is true white or a neutral cool-gray.
 * Text uses near-black with no warm tint.
 * Accent & footer charcoal unchanged.
 */
export const pureTheme = {
  bg: "#FFFFFF",
  surface: "#FAFAFA",
  elevated: "#F4F4F4",
  variant: "#EBEBEB",
  imageBg: "#F4F4F4",

  fg: "#0A0A0A",
  fgMuted: "rgba(10,10,10,0.52)",
  fgSubtle: "rgba(10,10,10,0.36)",
  fgFaint: "rgba(10,10,10,0.2)",

  border: "rgba(10,10,10,0.07)",
  borderSoft: "rgba(10,10,10,0.04)",
  borderStrong: "rgba(10,10,10,0.12)",

  accent: "#C9A770",
  onAccent: "#0A0A0A",

  icon: "rgba(10,10,10,0.46)",
  iconMuted: "rgba(10,10,10,0.38)",
  navLink: "rgba(10,10,10,0.52)",

  headerBg: "rgba(255,255,255,0.96)",
  bottomNavBg: "rgba(255,255,255,0.98)",

  inputBg: "#FFFFFF",
  inputBorder: "rgba(10,10,10,0.1)",

  skeleton: "#EDEDED",
  skeletonInner: "#DCDCDC",

  footerBg: "#1C1C1E",

  heroBase:
    "linear-gradient(135deg, #FFFFFF 0%, #F8F8F8 50%, #F0F0F0 100%)",
  heroBottomFade:
    "linear-gradient(to top, #FFFFFF, rgba(255,255,255,0.15) 55%, transparent)",

  offerOverlay:
    "linear-gradient(to right, rgba(255,255,255,0.96), rgba(250,250,250,0.55) 52%, transparent)",

  shimmer: "rgba(10,10,10,0.05)",

  cardHoverScrim: "rgba(10,10,10,0.1)",
  cardHoverBarBg: "rgba(255,255,255,0.94)",
  cardHoverBarBorder: "rgba(10,10,10,0.08)",
} as const;

/** Any of the three palettes. */
export type ThemeTokens = typeof lightTheme | typeof darkTheme | typeof pureTheme;

/**
 * Active palette for the app (`import { theme } from "…"`).
 * Swap to `darkTheme` or `pureTheme` to change the whole UI.
 *
 * lightTheme — warm off-white editorial
 * pureTheme  — pure white, clinical-fresh
 * darkTheme  — original charcoal luxury
 */
export const theme: ThemeTokens = pureTheme;
