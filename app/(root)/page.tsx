import { redirect } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n/config';

export default function RootPage(): never {
  // Redirect root to the default locale
  redirect(`/${defaultLocale}`);
}
