import type { Metadata } from "next";
import { Barlow, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import FloatingWhatsApp from '@/components/common/FloatingWhatsApp'
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Kiki African Taste",
  description: "Authentic African food products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${barlow.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-barlow">
      <Providers> 
        {children}
          <FloatingWhatsApp />
        </Providers>  
      </body>
    </html>
  );
}