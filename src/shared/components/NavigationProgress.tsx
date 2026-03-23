"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.width = "0%";
    bar.style.opacity = "1";
    const t1 = setTimeout(() => { bar.style.width = "70%"; }, 40);
    const t2 = setTimeout(() => { bar.style.width = "100%"; }, 300);
    const t3 = setTimeout(() => { bar.style.opacity = "0"; bar.style.width = "0%"; }, 700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
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
        transition: "width 0.6s ease-out, opacity 0.3s ease",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
