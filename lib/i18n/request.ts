import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
export const locales = ['en', 'fi', 'sv'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  // Static imports for all locales to work with static export
  const messages = {
    en: (await import('../../messages/en.json')).default,
    fi: (await import('../../messages/fi.json')).default,
    sv: (await import('../../messages/sv.json')).default,
  };

  return {
    locale: locale as Locale,
    messages: messages[locale as Locale],
  };
});
