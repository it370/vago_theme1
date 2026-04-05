"use client";

import { useState, useEffect, useCallback } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { onAuthStateChanged, auth } from "@/lib/firebase";
import { useAuthStore } from "@/features/auth/store";
import { PushProvider, PushStatusIndicator } from "@sinlungtech/push-client";
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        document.cookie = "session=1; path=/; max-age=86400; SameSite=Lax";
      } else {
        document.cookie = "session=; path=/; max-age=0; SameSite=Lax";
      }
    });
    return unsub;
  }, [setUser]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());
  const [isAuthed, setIsAuthed] = useState(false);
  const chatServerUrl = process.env.NEXT_PUBLIC_CHAT_SERVER_URL ?? "";
  const vapidKey = process.env.NEXT_PUBLIC_PUSH_VAPID_PUBLIC_KEY ?? "";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAuthed(!!user);
    });
    return unsub;
  }, []);

  const getChatToken = useCallback(async () => {
    const current = auth.currentUser;
    if (!current) throw new Error("Not authenticated");
    const firebaseToken = await current.getIdToken();
    const res = await fetch("/api/chat/token", {
      headers: { Authorization: `Bearer ${firebaseToken}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to get chat token");
    const data = (await res.json()) as { token?: string };
    if (!data.token) throw new Error("Missing chat token");
    return data.token;
  }, []);

  const content = <AuthInitializer>{children}</AuthInitializer>;

  if (!isAuthed || !chatServerUrl || !vapidKey) {
    return <QueryClientProvider client={queryClient}>{content}</QueryClientProvider>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PushProvider
        vapidKey={vapidKey}
        serviceWorkerPath="/sw.js"
        chatServerUrl={chatServerUrl}
        getToken={getChatToken}
        autoSubscribe
        live={{ enabled: true, showSystemNotification: true }}
      >
        <PushStatusIndicator title="Notifications" position="bottom-left" showWhenEnabled={false} />
        {content}
      </PushProvider>
    </QueryClientProvider>
  );
}
