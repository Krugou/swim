'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

export const ThemeToggle = () => {
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
    <Button
      onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}
      variant="ghost"
      size="icon"
      className="border border-input"
      aria-label={t('toggle')}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
      <span className="sr-only">{t('toggle')}</span>
    </Button>
  );
};
