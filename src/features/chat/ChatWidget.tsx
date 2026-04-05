"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ChatWidget as SinlungChatWidget } from "@sinlungtech/chat-widget";
import { useRouter } from "next/navigation";

const CHAT_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_SERVER_URL ?? "";

const THEME = {
  primaryColor: "#C9A770",
  buttonSize: 52,
  position: "bottom-right" as const,
  zIndex: 9999,
};

const HEADER = {
  title: "Vago Support",
  subtitle: "We usually reply within minutes",
};

/**
 * Fetches a chat server JWT for the currently signed-in Firebase user.
 * Called by the widget on mount and automatically on any token expiry.
 */
async function getChatToken(): Promise<string> {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Not authenticated");
  const firebaseToken = await user.getIdToken();
  const res = await fetch("/api/chat/token", {
    headers: { Authorization: `Bearer ${firebaseToken}` },
  });
  if (!res.ok) throw new Error("Failed to get chat token");
  const { token } = await res.json();
  return token;
}

export function ChatWidget() {
  // We only need to know if Firebase has settled and whether a user is present.
  // The actual token fetching is delegated to the widget via `getToken`.
  const [authReady, setAuthReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), (user) => {
      setIsLoggedIn(!!user);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // If the user logs out while chat is open, close it.
  useEffect(() => {
    if (!isLoggedIn && isChatOpen) {
      setIsChatOpen(false);
    }
  }, [isLoggedIn, isChatOpen]);

  if (!authReady) return null;
  const authMode = "authenticated";

  return (
    <SinlungChatWidget
      chatServerUrl={CHAT_SERVER_URL}
      authMode={authMode}
      getToken={getChatToken}
      isOpen={isChatOpen}
      onOpen={() => {
        if (!isLoggedIn) {
          const next =
            typeof window !== "undefined"
              ? `${window.location.pathname}${window.location.search}`
              : "/";
          router.push(`/login?next=${encodeURIComponent(next)}`);
          return;
        }
        setIsChatOpen(true);
      }}
      onClose={() => setIsChatOpen(false)}
      theme={THEME}
      header={HEADER}
    />
  );
}
