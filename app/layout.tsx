import type { Metadata } from "next";
import { Montserrat, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Realty AI - Buy & Sell Calculator",
  description: "Professional real estate calculator for buying and selling properties with Team Logue services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${ibmPlexSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
