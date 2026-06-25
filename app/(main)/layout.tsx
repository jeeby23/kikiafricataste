import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import Header from "@/components/header";
import { Toaster } from "sonner";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Kiki African Taste",
  description: "Authentic African food products",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${barlow.variable} min-h-screen flex flex-col font-barlow`}>
      <Header />
      {children}
       <Toaster position="top-right" richColors />
    </div>
  );
}