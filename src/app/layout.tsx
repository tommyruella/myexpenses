import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tommy's Tracker",
  description: "my personal tracker",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tommy's Tracker"
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f0f0f',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f0f0f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Tommy's Tracker" />

        {/* Favicon e icone */}
        <link rel="icon" href="/icons/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/logo.svg" />
        <meta name="msapplication-TileImage" content="/icons/logo.svg" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-950`}>
        {children}
      </body>
    </html>
  );
}
