'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const t = useTranslations('theme');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10 rounded-md border border-input bg-background" />;
  }

  return (
    <button
      onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
      aria-label={t('toggle')}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
      <span className="sr-only">{t('toggle')}</span>
    </button>
  );
}
