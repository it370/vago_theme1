"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppImage } from "@/shared/components/AppImage";
import { theme } from "@/shared/constants/theme";

interface Offer {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
}

interface OffersCarouselProps {
  offers: Offer[];
  /** Label shown above the title on each slide. Defaults to "The Edit" */
  eyebrow?: string;
  /** CTA text shown at the bottom of each slide. Defaults to "Browse the Edit →" */
  cta?: string;
  /** Auto-advance interval in ms. Set to 0 to disable. Defaults to 5000 */
  interval?: number;
}

export function OffersCarousel({
  offers,
  eyebrow = "The Edit",
  cta = "Browse the Edit →",
  interval = 5000,
}: OffersCarouselProps) {
  const [idx, setIdx] = useState(0);
  // Incrementing this resets the auto-advance timer after manual navigation
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    if (offers.length < 2 || interval === 0) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % offers.length), interval);
    return () => clearInterval(t);
  }, [offers.length, interval, timerKey]);

  if (offers.length === 0) return null;

  const resetTimer = () => setTimerKey((k) => k + 1);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i - 1 + offers.length) % offers.length);
    resetTimer();
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i + 1) % offers.length);
    resetTimer();
  };

  return (
    <section style={{ padding: "0 1.5rem 4rem" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div
          style={{
            position: "relative",
            height: "clamp(320px, 45vh, 520px)",
            overflow: "hidden",
          }}
        >
          {/* Slides */}
          {offers.map((offer, i) => (
            <Link
              key={offer.id}
              href={`/sale/${offer.id}`}
              style={{
                position: "absolute",
                inset: 0,
                display: "block",
                textDecoration: "none",
                opacity: i === idx ? 1 : 0,
                transition: "opacity 0.7s ease",
                pointerEvents: i === idx ? "auto" : "none",
              }}
            >
              <AppImage
                src={offer.imageUrl}
                alt={offer.title}
                fill
                sizes="(max-width: 1152px) 100vw, 72rem"
                objectFit="cover"
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: theme.offerOverlay,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  paddingTop: 0,
                  paddingBottom: 0,
                  paddingRight: "3.5rem",
                  paddingLeft: "clamp(4.25rem, 6vw, 5.5rem)",
                  maxWidth: "30rem",
                }}
              >
                <p
                  style={{
                    color: theme.accent,
                    fontSize: "0.65rem",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    marginBottom: "0.75rem",
                  }}
                >
                  {eyebrow}
                </p>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    marginBottom: "1rem",
                    color: theme.fg,
                  }}
                >
                  {offer.title}
                </h2>
                {offer.subtitle && (
                  <p
                    style={{
                      color: theme.fgMuted,
                      fontSize: "0.85rem",
                      marginBottom: "1.5rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {offer.subtitle}
                  </p>
                )}
                <span
                  style={{
                    color: theme.accent,
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  {cta}
                </span>
              </div>
            </Link>
          ))}

          {/* Prev / Next arrows — only when multiple slides */}
          {offers.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous offer"
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  background: theme.cardHoverBarBg,
                  border: `1px solid ${theme.cardHoverBarBorder}`,
                  color: theme.fg,
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  transition: "background 0.2s",
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                aria-label="Next offer"
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  background: theme.cardHoverBarBg,
                  border: `1px solid ${theme.cardHoverBarBorder}`,
                  color: theme.fg,
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  transition: "background 0.2s",
                }}
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {offers.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: "1.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "0.45rem",
                zIndex: 2,
              }}
            >
              {offers.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setIdx(i); resetTimer(); }}
                  aria-label={`Go to slide ${i + 1}`}
                  style={{
                    width: i === idx ? "1.5rem" : "0.35rem",
                    height: "0.35rem",
                    borderRadius: "999px",
                    background: i === idx ? theme.accent : theme.borderStrong,
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "width 0.3s ease, background 0.3s ease",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
