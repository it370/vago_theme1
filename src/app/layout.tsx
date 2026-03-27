import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/shared/components/Providers";
import { NavigationProgress } from "@/shared/components/NavigationProgress";
import { DesktopHeader } from "@/shared/components/DesktopHeader";
import { ChatWidget } from "@/features/chat/ChatWidget";
import { APP_NAME, APP_TAGLINE } from "@/shared/constants/app";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_TAGLINE,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning>
        <Providers>
          <NavigationProgress />
          <DesktopHeader />
          {children}
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
