import { swimmingHallData } from '@/lib/swimming-halls-data';
import { slugify } from '@/lib/slugify';
import { locales } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import HallClient from './HallClient';

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  locales.forEach((locale) => {
    swimmingHallData.forEach((hall) => {
      params.push({ locale, slug: slugify(hall.swimmingHallName) });
    });
  });
  return params;
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function HallPage({ params }: PageProps) {
  const { slug } = await params;

  const hall = swimmingHallData.find((h) => slugify(h.swimmingHallName) === slug);

  if (!hall) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <HallClient hall={hall} />
    </div>
  );
}
