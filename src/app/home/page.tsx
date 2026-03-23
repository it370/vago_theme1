"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useFeed, useNewArrivals } from "@/features/home/queries";
import { useProducts } from "@/features/products/queries";
import { ProductGrid } from "@/shared/components/ProductGrid";
import { Pagination } from "@/shared/components/Pagination";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import { AppImage } from "@/shared/components/AppImage";
import { APP_NAME } from "@/shared/constants/app";
import { categoryListingHref } from "@/shared/lib/categoryRoutes";

export default function HomePage() {
  const { data: feed, isLoading: feedLoading } = useFeed();
  const { data: newArrivals, isLoading: naLoading } = useNewArrivals();

  const categories = feed?.categories?.slice(0, 6) ?? [];
  const activeCategories = feed?.categories?.filter((c) => c.isActive) ?? [];
  const featuredProducts = feed?.products?.slice(0, 8) ?? [];
  const newArrivalProducts = newArrivals?.products?.slice(0, 4) ?? [];

  // Paginated all-products feed
  const PER_PAGE = 15;
  const [feedPage, setFeedPage] = useState(1);
  const allProductsSectionRef = useRef<HTMLElement>(null);
  const [sortBy, setSortBy] = useState("newest");
  const { data: allProducts, isLoading: allProductsLoading } = useProducts({ sortBy });
  const totalItems = allProducts?.length ?? 0;
  const totalPages = Math.ceil(totalItems / PER_PAGE);
  const pagedProducts = allProducts?.slice((feedPage - 1) * PER_PAGE, feedPage * PER_PAGE);

  function scrollToFeed() {
    allProductsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSort(value: string) {
    setSortBy(value);
    setFeedPage(1);
    scrollToFeed();
  }

  return (
    <main style={{ background: "#1C1C1E", minHeight: "100vh" }} className="animate-page-in">

      {/* Hero */}
      <section
        style={{
          position: "relative",
          minHeight: "88vh",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #0F0F10, #1C1C1E 55%, #2C2018)",
          }}
        />
        {feed?.offers?.[0]?.imageUrl && (
          <div style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
            <AppImage
              src={feed.offers[0].imageUrl}
              alt="Hero"
              fill
              sizes="100vw"
              objectFit="cover"
              priority
            />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, #1C1C1E, transparent 50%)",
          }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: "72rem",
            margin: "0 auto",
            padding: "0 1.5rem 5rem",
            width: "100%",
          }}
        >
          <div style={{ maxWidth: "36rem" }}>
            <p
              style={{
                color: "#C9A770",
                fontSize: "0.7rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              New Collection
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 700,
                lineHeight: 1.05,
                marginBottom: "1.5rem",
                color: "#F0F0F0",
              }}
            >
              The Art of<br />
              <em style={{ color: "#C9A770" }}>Quiet Luxury</em>
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                marginBottom: "2rem",
                maxWidth: "28rem",
              }}
            >
              Understated refinement for those who know. Pieces that endure,
              crafted with intention.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <Link
                href="/categories"
                style={{
                  background: "#C9A770",
                  color: "#1C1C1E",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  padding: "0.9rem 2rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Explore Collection
              </Link>
              <Link
                href="/new-arrivals"
                style={{
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.75rem",
                  padding: "0.9rem 2rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      {categories.length > 0 && (
        <section
          style={{
            padding: "4rem 1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: "2rem",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#C9A770",
                    fontSize: "0.65rem",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                  }}
                >
                  Shop by category
                </p>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                    fontWeight: 600,
                    color: "#F0F0F0",
                  }}
                >
                  Explore the collection
                </h2>
              </div>
              <Link
                href="/categories"
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                View All →
              </Link>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
              }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={categoryListingHref(cat)}
                  style={{
                    position: "relative",
                    height: "22rem",
                    overflow: "hidden",
                    display: "block",
                    textDecoration: "none",
                    zIndex: 1,
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                    {cat.imageUrl ? (
                      <AppImage
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        objectFit="cover"
                        className="product-img"
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "#242426" }} />
                    )}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.42)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent 60%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      padding: "2rem",
                    }}
                  >
                    <p
                      style={{
                        color: "#C9A770",
                        fontSize: "0.65rem",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Category
                    </p>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.5rem",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    >
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section
        style={{
          padding: "4rem 1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "3rem",
            }}
          >
            <div>
              <p
                style={{
                  color: "#C9A770",
                  fontSize: "0.65rem",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                {newArrivals?.label ?? "Curated for you"}
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  fontWeight: 600,
                  color: "#F0F0F0",
                }}
              >
                New Arrivals
              </h2>
            </div>
            <Link
              href="/new-arrivals"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              View All →
            </Link>
          </div>
          <ProductGrid
            products={newArrivalProducts.length > 0 ? newArrivalProducts : featuredProducts.slice(0, 4)}
            isLoading={naLoading && feedLoading}
            skeletonCount={4}
          />
        </div>
      </section>

      {/* Offers banner */}
      {feed?.offers && feed.offers.length > 1 && (
        <section style={{ padding: "0 1.5rem 4rem" }}>
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            <Link
              href={`/sale/${feed.offers[1].id}`}
              style={{
                position: "relative",
                height: "clamp(320px, 45vh, 520px)",
                overflow: "hidden",
                display: "block",
                textDecoration: "none",
              }}
            >
              <AppImage
                src={feed.offers[1].imageUrl}
                alt={feed.offers[1].title}
                fill
                sizes="(max-width: 1152px) 100vw, 72rem"
                objectFit="cover"
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to right, rgba(28,28,30,0.88), rgba(28,28,30,0.4) 55%, transparent)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: "0 3.5rem",
                  maxWidth: "30rem",
                }}
              >
                <p
                  style={{
                    color: "#C9A770",
                    fontSize: "0.65rem",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    marginBottom: "0.75rem",
                  }}
                >
                  The Edit
                </p>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    marginBottom: "1rem",
                    color: "#F0F0F0",
                  }}
                >
                  {feed.offers[1].title}
                </h2>
                {feed.offers[1].subtitle && (
                  <p
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: "0.85rem",
                      marginBottom: "1.5rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {feed.offers[1].subtitle}
                  </p>
                )}
                <span
                  style={{
                    color: "#C9A770",
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  Browse the Edit →
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Featured products */}
      <section
        style={{
          padding: "4rem 1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div style={{ marginBottom: "3rem" }}>
            <p
              style={{
                color: "#C9A770",
                fontSize: "0.65rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Hand-picked
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 600,
                color: "#F0F0F0",
              }}
            >
              Featured Pieces
            </h2>
          </div>
          <ProductGrid
            products={featuredProducts}
            isLoading={feedLoading}
            skeletonCount={8}
          />
        </div>
      </section>

      {/* Browse by Category — responsive: scroll on mobile, grid on desktop */}
      {activeCategories.length > 0 && (
        <section
          style={{
            padding: "4rem 1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: "1.75rem",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#C9A770",
                    fontSize: "0.65rem",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    marginBottom: "0.4rem",
                  }}
                >
                  Browse
                </p>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                    fontWeight: 600,
                    color: "#F0F0F0",
                  }}
                >
                  Shop by Category
                </h2>
              </div>
              <Link
                href="/categories"
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                View All →
              </Link>
            </div>

            {/* Mobile: horizontal scroll row */}
            <div className="r-cat-scroll">
              {activeCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={categoryListingHref(cat)}
                  style={{ flexShrink: 0, width: "7rem", textDecoration: "none" }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "1 / 1",
                      overflow: "hidden",
                      background: "#242426",
                      borderRadius: "0.15rem",
                    }}
                    className="cat-scroll-card"
                  >
                    {cat.imageUrl ? (
                      <AppImage
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        sizes="112px"
                        objectFit="cover"
                        className="product-img"
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#242426",
                        }}
                      >
                        <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "rgba(255,255,255,0.15)", textTransform: "uppercase" }}>
                          {cat.name[0]}
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.72), transparent 55%)",
                      }}
                    />
                    <p
                      style={{
                        position: "absolute",
                        bottom: "0.4rem",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        color: "#fff",
                        padding: "0 0.25rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {cat.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop: square grid — 3 cols → 6 cols */}
            <div className="r-cat-grid">
              {activeCategories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={categoryListingHref(cat)}
                  style={{ textDecoration: "none" }}
                  className="cat-grid-item"
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "1 / 1",
                      overflow: "hidden",
                      background: "#242426",
                      borderRadius: "0.15rem",
                      border: "1px solid rgba(255,255,255,0.06)",
                      transition: "border-color 0.2s",
                    }}
                  >
                    {cat.imageUrl ? (
                      <AppImage
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 1024px) 180px, 210px"
                        objectFit="cover"
                        className="product-img"
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: "2rem", fontWeight: 700, color: "rgba(255,255,255,0.15)", textTransform: "uppercase" }}>
                          {cat.name[0]}
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.72), transparent 55%)",
                      }}
                    />
                    <p
                      style={{
                        position: "absolute",
                        bottom: "0.6rem",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "#fff",
                        padding: "0 0.5rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {cat.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products — paginated */}
      <section
        ref={allProductsSectionRef}
        style={{
          padding: "4rem 1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <p
                style={{
                  color: "#C9A770",
                  fontSize: "0.65rem",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                Explore
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  fontWeight: 600,
                  color: "#F0F0F0",
                }}
              >
                All Products
              </h2>
              {totalItems > 0 && !allProductsLoading && (
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem", marginTop: "0.4rem" }}>
                  {totalItems} piece{totalItems !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Sort + link */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                style={{
                  background: "#2C2C2E",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "0.5rem 0.9rem",
                  fontSize: "0.78rem",
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                  outline: "none",
                  borderRadius: "0.25rem",
                }}
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <Link
                href="/categories"
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Full Collection →
              </Link>
            </div>
          </div>

          {/* Grid */}
          <ProductGrid
            products={pagedProducts}
            isLoading={allProductsLoading}
            skeletonCount={PER_PAGE}
            emptyMessage="No products found."
          />

          {/* Pagination */}
          {!allProductsLoading && totalPages > 1 && (
            <div style={{ marginTop: "3rem" }}>
              <Pagination
                currentPage={feedPage}
                totalPages={totalPages}
                totalItems={totalItems}
                perPage={PER_PAGE}
                onPageChange={(p) => {
                  setFeedPage(p);
                  scrollToFeed();
                }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      {/* <section
        style={{
          padding: "4rem 1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: "38rem", margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              color: "#C9A770",
              fontSize: "0.65rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Inner Circle
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 600,
              marginBottom: "1rem",
              color: "#F0F0F0",
            }}
          >
            Be the First to Know
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.9rem",
              marginBottom: "2rem",
              lineHeight: 1.7,
            }}
          >
            Early access to new collections, exclusive offers, and style notes.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", maxWidth: "28rem", margin: "0 auto" }}>
            <input
              type="email"
              placeholder="Your email address"
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                padding: "0.75rem 1rem",
                fontSize: "0.85rem",
                outline: "none",
                minWidth: 0,
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <button
              style={{
                background: "#C9A770",
                color: "#1C1C1E",
                fontWeight: 600,
                fontSize: "0.75rem",
                padding: "0.75rem 1.25rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section> */}

      <Footer />
      <div className="r-bottom-spacer" />
      <BottomNav />
    </main>
  );
}
