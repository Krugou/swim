'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n/config';

export default function RootPage() {
  const router = useRouter();

  // Keep query string and hash (e.g. ?view=carousel) when redirecting to the default locale
  useEffect(() => {
    router.replace(`/${defaultLocale}/${window.location.search}${window.location.hash}`);
  }, [router]);

  return (
    <noscript>
      <meta httpEquiv="refresh" content={`0;url=${defaultLocale}/`} />
    </noscript>
  );
}
