import type { Metadata } from "next";
import { Geist, Geist_Mono, Krona_One } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { ThemeProvider } from "@/components/generalComponents/theme-provider";

// Import Geist Sans
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Import Geist Mono
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Import Krona One
const kronaOne = Krona_One({
  variable: "--font-krona-one",
  weight: "400",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Next.js App with Dark Mode",
  description: "A custom Next.js application with dark mode support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kronaOne.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}