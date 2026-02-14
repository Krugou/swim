'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={(theme as 'light' | 'dark' | 'system') || 'system'}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-2 group-[.toaster]:border-black dark:group-[.toaster]:border-white group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rounded-md font-sans text-sm font-medium p-4 flex gap-2 items-start w-full',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
