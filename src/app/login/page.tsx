"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithGoogle } from "@/lib/firebase";
import { ApiService } from "@/shared/services/api";
import { useAuthStore } from "@/features/auth/store";
import { APP_NAME, APP_TAGLINE } from "@/shared/constants/app";
import { theme } from "@/shared/constants/theme";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, setLoading } = useAuthStore();
  const from = searchParams.get("from") ?? "/home";

  useEffect(() => {
    if (!loading && user) {
      router.replace(from);
    }
  }, [user, loading, router, from]);

  async function handleGoogleSignIn() {
    try {
      setLoading(true);
      const fbUser = await signInWithGoogle();
      await ApiService.post("/api/auth/sync", {
        auth: true,
        body: {
          displayName: fbUser.displayName,
          avatarUrl: fbUser.photoURL,
          email: fbUser.email,
        },
      });
      router.replace(from);
    } catch (err) {
      console.error("Login failed:", err);
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        background: theme.bg,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "26rem", textAlign: "center" }}>
        {/* Brand */}
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2rem",
            letterSpacing: "0.35em",
            color: theme.accent,
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          {APP_NAME}
        </p>
        <p
          style={{
            color: theme.fgMuted,
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            marginBottom: "3rem",
          }}
        >
          {APP_TAGLINE}
        </p>

        {/* Card */}
        <div
          style={{
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: "0 1px 3px rgba(20,20,19,0.06)",
            padding: "2.5rem 2rem",
          }}
        >
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.4rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              color: theme.fg,
            }}
          >
            Welcome Back
          </h1>
          <p
            style={{
              color: theme.fgMuted,
              fontSize: "0.85rem",
              marginBottom: "2rem",
              lineHeight: 1.6,
            }}
          >
            Sign in to access your cart, wishlist, and order history.
          </p>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: "100%",
              background: theme.surface,
              color: theme.fg,
              fontWeight: 600,
              fontSize: "0.85rem",
              padding: "0.9rem 1.5rem",
              border: `1px solid ${theme.borderStrong}`,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.02em",
              transition: "opacity 0.2s",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {/* Google icon */}
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/>
            </svg>
            {loading ? "Signing in…" : "Continue with Google"}
          </button>

          <p
            style={{
              marginTop: "1.5rem",
              color: theme.fgFaint,
              fontSize: "0.75rem",
              lineHeight: 1.6,
            }}
          >
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
