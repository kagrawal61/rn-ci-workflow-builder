import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import Script from 'next/script';

import { ThemeProvider } from '@/providers/theme-provider';
import { cn } from '@/utils/cn';
import { Toaster } from 'sonner';
import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const siteUrl = 'https://www.mobilecibuilder.com';
const siteTitle = 'React Native CI/CD Workflow Builder';
const siteDescription =
  'Generate production-ready GitHub Actions and Bitrise workflows for React Native and Expo apps in minutes. Free, open-source, no account required.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | Mobile CI Builder`,
  },
  description: siteDescription,
  keywords: [
    'react native ci cd',
    'github actions react native',
    'expo ci cd pipeline',
    'react native workflow generator',
    'mobile ci workflow builder',
    'react native github actions template',
    'android ios build pipeline',
    'react native automated testing',
    'bitrise workflow generator',
    'mobile devops',
  ],
  authors: [{ name: 'Mobile CI Builder' }],
  creator: 'Mobile CI Builder',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: 'Mobile CI Builder',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'React Native CI/CD Workflow Builder — generate GitHub Actions workflows in minutes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    creator: '@KushalAgrawal14',
    images: ['/opengraph-image'],
  },
  icons: {
    icon: [
      { url: '/logo.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/logo.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/logo.svg' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="dc5f47fa-eb10-466c-908e-64a6bd20e5d4"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
