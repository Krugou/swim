'use client';

import { useTranslations } from 'next-intl';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type ReactElement } from 'react';

export default function AboutPage(): ReactElement {
  const tAbout = useTranslations('about');
  const tNav = useTranslations('navigation');
  const router = useRouter();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => {
              router.back();
            }}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={tNav('back')}
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            <span className="text-sm sm:text-base font-medium">{tNav('back')}</span>
          </button>
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main-content" className="min-h-screen bg-linear-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
              {tAbout('title')}
            </h1>
            <div className="space-y-4 text-sm sm:text-base text-muted-foreground">
              <p className="leading-relaxed">{tAbout('description')}</p>
              <p className="leading-relaxed">{tAbout('dataSource')}</p>
              <p className="leading-relaxed">{tAbout('projectInfo')}</p>
            </div>
            <div className="mt-8 pt-6 border-t text-center text-xs sm:text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Swimming Hall Schedules. All rights reserved.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
