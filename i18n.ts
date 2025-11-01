import { getRequestConfig } from 'next-intl/server';
export { locales, defaultLocale } from './lib/i18n/config';
import { defaultLocale } from './lib/i18n/config';
export const localePrefix = 'as-needed';

export default getRequestConfig(async ({ locale }) => ({
  locale: locale ?? defaultLocale,
}));
