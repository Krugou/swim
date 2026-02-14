'use client';

import { HallDetails } from '@/components/HallDetails';
import { useRouter } from 'next/navigation';
import { type SwimmingHall } from '@/lib/swimming-halls-data';

export default function HallClient({ hall }: { hall: SwimmingHall }) {
  const router = useRouter();
  return <HallDetails hall={hall} onClose={() => router.back()} />;
}
