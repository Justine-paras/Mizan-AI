import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MIZAN — UAE Tax Compliance Copilot",
  description:
    "AI-powered UAE VAT & tax compliance for SMEs. Upload documents, analyze risk, chat with your copilot, and export audit-ready reports.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-bg-base text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
