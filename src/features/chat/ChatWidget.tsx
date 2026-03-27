"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ChatWidget as SinlungChatWidget } from "@sinlungtech/chat-widget";

const CHAT_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_SERVER_URL ?? "";
const CHAT_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CHAT_PUBLISHABLE_KEY ?? "";

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

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), (user) => {
      setIsLoggedIn(!!user);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  if (!authReady) return null;

  if (isLoggedIn) {
    return (
      <SinlungChatWidget
        chatServerUrl={CHAT_SERVER_URL}
        authMode="authenticated"
        getToken={getChatToken}
        theme={THEME}
        header={HEADER}
      />
    );
  }

  return (
    <SinlungChatWidget
      chatServerUrl={CHAT_SERVER_URL}
      authMode="guest"
      publishableKey={CHAT_PUBLISHABLE_KEY}
      guestForm={{ fields: ["name", "phone"] }}
      theme={THEME}
      header={HEADER}
    />
  );
}
