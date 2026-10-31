import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales, type Locale } from './lib/i18n/config';
export { locales, defaultLocale } from './lib/i18n/config';
export const localePrefix = 'as-needed';

const isLocale = (locale: string | undefined): locale is Locale =>
  locale !== undefined && (locales as readonly string[]).includes(locale);

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const effectiveLocale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const messages = (await import(`./messages/${effectiveLocale}.json`)).default;

  return {
    locale: effectiveLocale,
    messages,
  };
});
