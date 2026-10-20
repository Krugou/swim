import type { ReactNode } from 'react';
import { defaultLocale } from '@/lib/i18n/config';

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={defaultLocale}>
      <body>{children}</body>
    </html>
  );
}
