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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: hall.swimmingHallName,
    description: hall.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: hall.address?.split(',')[0],
      addressLocality: 'Espoo',
      postalCode: hall.address?.match(/\d{5}/)?.[0],
      addressCountry: 'FI',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: hall.latitude,
      longitude: hall.longitude,
    },
    openingHours: hall.opening,
    telephone: hall.phone,
    image: [], // Add images if available in the future
    isAccessibleForFree: false, // Usually paid
    publicAccess: true,
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HallClient hall={hall} />
    </div>
  );
}
