"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Replicates the Atelier Noir template page-reveal exactly:
 *
 * Initial load
 *   t=0ms   body is at opacity:0 / translateY(10px) / blur(1px) (set in CSS)
 *   t=40ms  gold bar sweeps to 70%
 *   t=180ms body.vago-revealed → CSS transition fades/slides/unblurs body in
 *   t=300ms bar completes to 100%
 *   t=700ms bar fades out
 *
 * Client-side navigation
 *   bar runs a quick sweep (no body manipulation — already revealed)
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const isFirst = useRef(true);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    // Hard-reset bar
    bar.style.transition = "none";
    bar.style.width = "0%";
    bar.style.opacity = "1";

    const timers: ReturnType<typeof setTimeout>[] = [];

    if (isFirst.current) {
      isFirst.current = false;

      // t=40ms: bar to 70%
      timers.push(
        setTimeout(() => {
          bar.style.transition = "width 0.9s ease-out, opacity 0.4s ease";
          bar.style.width = "70%";
        }, 40)
      );

      // t=180ms: reveal body (matches template)
      timers.push(
        setTimeout(() => {
          document.body.classList.add("vago-revealed");
        }, 180)
      );

      // t=300ms: bar to 100%
      timers.push(
        setTimeout(() => {
          bar.style.width = "100%";
        }, 300)
      );

      // t=700ms: bar fades out
      timers.push(
        setTimeout(() => {
          bar.style.opacity = "0";
        }, 700)
      );

      // t=1100ms: bar width reset (hidden, ready for next nav)
      timers.push(
        setTimeout(() => {
          bar.style.transition = "none";
          bar.style.width = "0%";
        }, 1100)
      );
    } else {
      // Client-side navigation: quick bar sweep only
      timers.push(
        setTimeout(() => {
          bar.style.transition = "width 0.6s ease-out, opacity 0.3s ease";
          bar.style.width = "75%";
        }, 20)
      );

      timers.push(
        setTimeout(() => {
          bar.style.width = "100%";
        }, 280)
      );

      timers.push(
        setTimeout(() => {
          bar.style.opacity = "0";
        }, 580)
      );

      timers.push(
        setTimeout(() => {
          bar.style.transition = "none";
          bar.style.width = "0%";
        }, 900)
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [pathname]);

  return (
    <div
      ref={barRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "2px",
        width: "0%",
        background: "linear-gradient(to right, transparent, #C9A770, transparent)",
        transition: "width 0.9s ease-out, opacity 0.4s ease",
        zIndex: 9999,
        pointerEvents: "none",
        opacity: 0,
      }}
    />
  );
}
