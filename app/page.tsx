import { SwimmingHallCard } from '@/components/swimming-hall-card';
import { swimmingHallData } from '@/lib/swimming-halls-data';

export default function Home() {
  return (
    <div className="min-h-screen p-6 bg-gray-300">
      <h1 className="text-3xl text-center m-2 p-4 bg-blue-500 text-white rounded-lg shadow-md">
        Swimming Hall Schedules
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {swimmingHallData.map((hall) => (
          <SwimmingHallCard
            key={hall.swimmingHallName}
            hallName={hall.swimmingHallName}
            links={hall.relatedLinks}
          />
        ))}
      </div>
    </div>
  );
}
