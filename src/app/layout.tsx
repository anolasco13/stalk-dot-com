import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import { site } from "@/config";
import PaperFilters from "@/components/PaperFilters";
import "./globals.css";

// To try a different font later, import it here the same way
// and point --font-heading or --font-body at it in globals.css.
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: site.name,
  description: site.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceMono.variable}>
      <body>
        <PaperFilters />
        {children}
      </body>
    </html>
  );
}
