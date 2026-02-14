'use client';

import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/Sheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export const MobileMenu = () => {
  const tNav = useTranslations('navigation');
  const tApp = useTranslations('app');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="text-left">
          <SheetTitle>{tNav('swimmingHalls')}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 mt-6">
          <div className="flex flex-col space-y-3">
            <Link
              href="/"
              className="text-lg font-medium hover:underline underline-offset-4"
              onClick={() => setOpen(false)}
            >
              {tNav('home')}
            </Link>
            <Link
              href="/about"
              className="text-lg font-medium hover:underline underline-offset-4"
              onClick={() => setOpen(false)}
            >
              {tNav('about')}
            </Link>
          </div>

          <div className="h-[2px] w-full bg-border" />

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{tApp('themeLabel')}</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">{tApp('languageLabel')}</span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
