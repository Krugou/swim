'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { type Locale, localeNames } from '@/lib/i18n/config';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLocaleChange = (newLocale: Locale) => {
    // Remove the current locale from the path and add the new one
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Languages className="mr-2 h-4 w-4" aria-hidden="true" />
        {localeNames[locale]}
      </button>
      {isOpen ? (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
            }}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-input bg-background shadow-lg"
            role="menu"
          >
            {Object.entries(localeNames).map(([key, name]) => (
              <button
                key={key}
                onClick={() => {
                  handleLocaleChange(key as Locale);
                }}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                  locale === key ? 'bg-accent font-medium' : ''
                }`}
                role="menuitem"
              >
                {name}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
