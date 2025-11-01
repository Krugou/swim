import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/theme-provider';
import { notFound } from 'next/navigation';
import { locales } from '@/lib/i18n/config';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Swimming Hall Schedules - Espoo',
  description: 'Swimming halls reservation viewer for Espoo swimming halls',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png',
  },
  // themeColor and viewport moved to the top-level `viewport` export
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Swimming Halls',
  },
};

// Export viewport separately per Next.js recommendation
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export function generateStaticParams(): { locale: string }[] {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>): Promise<ReactElement> {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!(locales as readonly string[]).includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body className="antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
