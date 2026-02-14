import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { Space_Grotesk } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/Toaster';
import { InstallPrompt } from '@/components/InstallPrompt';
import { notFound } from 'next/navigation';
import { locales } from '@/lib/i18n/config';
import { QueryClientProvider } from '@/components/QueryClientProvider';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Swimming Halls - Espoo',
  description: 'Real-time swimming hall situation in Espoo',
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

export const dynamicParams = false;

export const generateStaticParams = (): { locale: string }[] =>
  locales.map((locale) => ({ locale }));

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const RootLayout = async ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>): Promise<ReactElement> => {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!(locales as readonly string[]).includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const t = await getTranslations('accessibility');

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <a href="#main-content" className="skip-to-content">
          {t('skipToContent')}
        </a>
        <QueryClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <NextIntlClientProvider messages={messages}>
              {children}
              <Toaster />
              <InstallPrompt />
            </NextIntlClientProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
