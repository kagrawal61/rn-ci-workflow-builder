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

export const metadata: Metadata = {
  title: 'React Native CI/CD Workflow Builder',
  description:
    'Generate GitHub Actions workflows for your React Native projects',
  icons: {
    icon: [
      { url: '/logo.svg', sizes: '192x192', type: 'image/svg' },
      { url: '/logo.svg', sizes: '512x512', type: 'image/svg' },
    ],
    apple: [
      { url: '/logo.svg' },
    ],
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
