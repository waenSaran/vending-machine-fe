import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@fontsource/inter';
import Providers from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blue Vending",
  description: "For Vending Machine Simulator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Providers>
          <nav className="p-4 border-b-slate-300 border-b">
            <h1 className="text-2xl font-bold">Blue Vending Machine Simulator</h1>
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  );
}
