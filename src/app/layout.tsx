import type { Metadata, Viewport } from "next";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://whattoship.io'),
  title: {
    default: 'WhatToShip — Live Digital Product Idea & Execution Intelligence Platform',
    template: '%s | WhatToShip',
  },
  description: 'Explore 13,445 software and tool ideas with verified search volume, SEO difficulty, technical architectures, monetization blueprints, and 1-click AI starter prompts.',
  icons: {
    icon: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'WhatToShip',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#f8fafc] text-slate-900 antialiased min-h-screen overflow-x-hidden w-full max-w-full selection:bg-blue-100 selection:text-blue-900 pb-20 sm:pb-0">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
