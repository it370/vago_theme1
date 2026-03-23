export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "VAGO";
export const APP_TAGLINE =
  process.env.NEXT_PUBLIC_APP_TAGLINE ||
  "Curated fashion for the discerning individual.";
export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://vago-admin.vercel.app";

export const LEGAL_LINKS = {
  privacy: `${BASE_URL}/privacy-policy`,
  terms: `${BASE_URL}/terms`,
  contact: `${BASE_URL}/contact`,
} as const;
