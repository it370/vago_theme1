"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useProducts } from "@/features/products/queries";
import { ProductGrid } from "@/shared/components/ProductGrid";
import { ListingToolbar } from "@/shared/components/ListingToolbar";
import type { ViewMode } from "@/shared/components/ListingToolbar";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import { Search } from "lucide-react";
import { theme } from "@/shared/constants/theme";
import { listingMainStyle, sectionEyebrowStyle, pageHeadingStyle } from "@/shared/lib/listingChrome";

function SearchContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const initialQ = sp.get("q") ?? "";
  const [inputVal, setInputVal] = useState(initialQ);
  const [query, setQuery] = useState(initialQ);
  const [sortBy, setSortBy] = useState("newest");
  const [view, setView] = useState<ViewMode>("grid");

  const { data: rawProducts, isLoading } = useProducts({ search: query || undefined, sortBy });

  const products = rawProducts
    ? [...rawProducts].sort((a, b) => {
        if (sortBy === "price_asc") return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
        if (sortBy === "price_desc") return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
        if (sortBy === "name_asc") return a.name.localeCompare(b.name);
        return 0;
      })
    : undefined;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuery(inputVal.trim());
    if (inputVal.trim()) {
      router.replace(`/search?q=${encodeURIComponent(inputVal.trim())}`);
    }
  }

  useEffect(() => {
    setInputVal(initialQ);
    setQuery(initialQ);
  }, [initialQ]);

  return (
    <main style={listingMainStyle} className="animate-page-in">
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "2.5rem 1.5rem 8rem" }}>
        {/* Search bar */}
        <form onSubmit={handleSubmit} style={{ marginBottom: "3rem" }}>
          <p style={{ ...sectionEyebrowStyle, marginBottom: "0.75rem" }}>
            Search
          </p>
          <h1
            style={{ ...pageHeadingStyle, marginBottom: "2rem" }}
          >
            Find Your Piece
          </h1>
          <div style={{ display: "flex", gap: "0.75rem", maxWidth: "40rem" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "0.9rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: theme.fgMuted,
                }}
              />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Search products…"
                style={{
                  width: "100%",
                  background: theme.inputBg,
                  border: `1px solid ${theme.inputBorder}`,
                  color: theme.fg,
                  padding: "0.75rem 1rem 0.75rem 2.5rem",
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: "'Inter', sans-serif",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: theme.accent,
                color: theme.onAccent,
                fontWeight: 600,
                fontSize: "0.75rem",
                padding: "0 1.5rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Search
            </button>
          </div>
        </form>

        {/* Toolbar — only shown when there's a query */}
        {query && (
          <ListingToolbar
            totalItems={isLoading ? undefined : (products?.length ?? 0)}
            sortBy={sortBy}
            onSortChange={setSortBy}
            view={view}
            onViewChange={setView}
            isLoading={isLoading}
          />
        )}

        <ProductGrid
          products={products}
          isLoading={isLoading && !!query}
          skeletonCount={8}
          view={view}
          emptyMessage={query ? `No products found for "${query}".` : "Enter a search term above."}
        />
      </div>

      <Footer />
      <div className="r-bottom-spacer" />
      <BottomNav />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
