import type { Metadata } from 'next';
import './globals.css';

/**
 * Metadata for the application
 * Used for SEO and browser tab title
 */
export const metadata: Metadata = {
  title: 'AI Shop - AI-Powered E-Commerce',
  description: 'Modern e-commerce platform with AI-generated product descriptions powered by OpenAI',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AI Shop',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

/**
 * Root Layout Component
 * Provides the HTML structure for all pages
 * Enables PWA support and global styles
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AI Shop" />
      </head>
      <body className="bg-gray-50">
        <main>{children}</main>
      </body>
    </html>
  );
}
