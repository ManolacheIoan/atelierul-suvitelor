import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ViewTransition } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileCallBar } from "@/components/MobileCallBar";
import { themeInitScript } from "@/components/ThemeToggle";
import { BUSINESS_NAME, site } from "@/config/site";
import "./globals.css";

// Fonturi găzduite local: Fraunces (serif expresiv pentru titluri) și Manrope (text).
// Fiecare are fișier „latin” + „latin-ext” (pentru ă, â, î, ș, ț).
const display = localFont({
  src: [
    { path: "./fonts/fraunces-latin-wght-normal.woff2", style: "normal" },
    { path: "./fonts/fraunces-latin-wght-italic.woff2", style: "italic" },
  ],
  weight: "300 800",
  variable: "--font-display-latin",
  display: "swap",
});
const displayExt = localFont({
  src: [
    { path: "./fonts/fraunces-latin-ext-wght-normal.woff2", style: "normal" },
    { path: "./fonts/fraunces-latin-ext-wght-italic.woff2", style: "italic" },
  ],
  weight: "300 800",
  variable: "--font-display-ext",
  display: "swap",
  preload: false,
});
const text = localFont({
  src: "./fonts/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-text-latin",
  display: "swap",
});
const textExt = localFont({
  src: "./fonts/manrope-latin-ext-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-text-ext",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: { default: `${BUSINESS_NAME} — ${site.tagline}`, template: `%s | ${BUSINESS_NAME}` },
  description: `${BUSINESS_NAME}: ${site.shortDescription}`,
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#FBF7F2",
};

const fontVars = [display, displayExt, text, textExt].map((f) => f.variable).join(" ");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={fontVars} suppressHydrationWarning>
      <head>
        {/* Tema salvată + marcaj „js” (animațiile de apariție nu ascund nimic fără JavaScript). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a href="#continut" className="skip-link">
          Sari la conținut
        </a>
        <Header />
        <ViewTransition default="pagina">
          <main id="continut" tabIndex={-1}>
            {children}
          </main>
        </ViewTransition>
        <Footer />
        <MobileCallBar />
      </body>
    </html>
  );
}
