import { getRequestConfig } from 'next-intl/server';
export { locales, defaultLocale } from './lib/i18n/config';
import { defaultLocale } from './lib/i18n/config';
export const localePrefix = 'as-needed';

export default getRequestConfig(async ({ locale }) => {
  const effectiveLocale = locale ?? defaultLocale;
  let messages: Record<string, unknown> = {};
  try {
    messages = (await import(`./messages/${effectiveLocale}.json`)).default;
  } catch {
    try {
      messages = (await import(`./messages/${defaultLocale}.json`)).default;
    } catch {
      messages = {};
    }
  }
  return {
    locale: effectiveLocale,
    messages,
  };
});
