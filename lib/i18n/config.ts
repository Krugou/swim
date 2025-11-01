export const locales = ['en', 'fi', 'sv'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fi';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fi: 'Suomi',
  sv: 'Svenska',
};
