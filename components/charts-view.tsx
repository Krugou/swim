'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTranslations } from 'next-intl';
import { TrendingUp, X } from 'lucide-react';
import { swimmingHallData } from '@/lib/swimming-halls-data';

interface ReservationStats {
  hallName: string;
  totalReservations: number;
  freeReservations: number;
  availableSlots: number;
  occupancyRate: number;
}

interface ChartsViewProps {
  onClose: () => void;
}

export const ChartsView = React.memo(({ onClose }: ChartsViewProps) => {
  const t = useTranslations('status');
  const [stats, setStats] = useState<ReservationStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    const hallStats: ReservationStats[] = [];

    try {
      const fetchPromises = swimmingHallData.map(async (hall) => {
        let totalReservations = 0;
        let freeReservations = 0;
        const totalSlots = hall.relatedLinks.length;

        const linkPromises = hall.relatedLinks.map(async (link) => {
          const timeWindow = getTimeWindow();
          const proxyUrl = buildProxyUrl(link.url, timeWindow);

          try {
            const response = await fetch(proxyUrl);
            const data = await response.json();

            totalReservations += data.length;

            data.forEach((reservation: any) => {
              if (reservation.title?.includes('Vapaaharjoitte')) {
                freeReservations++;
              }
            });
          } catch (error) {
            console.error('Error fetching stats:', error);
          }
        });

        await Promise.all(linkPromises);

        const availableSlots = totalSlots - Math.min(totalReservations, totalSlots);
        const occupancyRate = totalSlots > 0 ? (totalReservations / totalSlots) * 100 : 0;

        hallStats.push({
          hallName: hall.swimmingHallName,
          totalReservations,
          freeReservations,
          availableSlots,
          occupancyRate: Math.min(occupancyRate, 100),
        });
      });

      await Promise.all(fetchPromises);
      setStats(hallStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const pieData = useMemo(() => {
    const totalFree = stats.reduce((sum, s) => sum + s.freeReservations, 0);
    const totalOccupied = stats.reduce(
      (sum, s) => sum + (s.totalReservations - s.freeReservations),
      0
    );

    return [
      { name: 'Free Practice', value: totalFree },
      { name: 'Reserved', value: totalOccupied },
    ];
  }, [stats]);

  const barData = useMemo(() => {
    return stats.map((stat) => ({
      name: stat.hallName.replace(' uimahalli', ''),
      total: stat.totalReservations,
      free: stat.freeReservations,
    }));
  }, [stats]);

  const occupancyData = useMemo(() => {
    return stats.map((stat) => ({
      name: stat.hallName.replace(' uimahalli', ''),
      occupancy: Math.round(stat.occupancyRate),
    }));
  }, [stats]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card border rounded-lg shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Reservation Statistics
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close statistics"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">{t('loading')}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Halls</h3>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.length}
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Free Practice</h3>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {stats.reduce((sum, s) => sum + s.freeReservations, 0)}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Total Reservations
                  </h3>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {stats.reduce((sum, s) => sum + s.totalReservations, 0)}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Avg Occupancy</h3>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.round(
                      stats.reduce((sum, s) => sum + s.occupancyRate, 0) / (stats.length || 1)
                    )}
                    %
                  </p>
                </div>
              </div>

              {/* Pie Chart - Reservation Distribution */}
              <div className="bg-muted/20 p-4 sm:p-6 rounded-lg border">
                <h3 className="text-lg font-bold mb-4">Reservation Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#3b82f6'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart - Reservations by Hall */}
              <div className="bg-muted/20 p-4 sm:p-6 rounded-lg border">
                <h3 className="text-lg font-bold mb-4">Reservations by Swimming Hall</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3b82f6" name="Total Reservations" />
                    <Bar dataKey="free" fill="#10b981" name="Free Practice" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart - Occupancy Rate */}
              <div className="bg-muted/20 p-4 sm:p-6 rounded-lg border">
                <h3 className="text-lg font-bold mb-4">Occupancy Rate by Hall</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis unit="%" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="occupancy"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Occupancy Rate"
                      dot={{ fill: '#8b5cf6', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});

// Helper functions
const getTimeWindow = (): { start: number; end: number } => {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const FOUR_HOURS_IN_SECONDS = 4 * 60 * 60;
  return {
    start: nowInSeconds - FOUR_HOURS_IN_SECONDS,
    end: nowInSeconds + FOUR_HOURS_IN_SECONDS,
  };
};

const buildProxyUrl = (resourceId: string, timeWindow: { start: number; end: number }): string => {
  const cityUrl = `https://resurssivaraus.espoo.fi/Tailored/prime_product_intranet/espoo/web/Calendar/ReservationData.aspx?resourceid%5B%5D=${resourceId}&start=${timeWindow.start}&end=${timeWindow.end}&_=${timeWindow.start}`;
  return `https://proxy.aleksi-nokelainen.workers.dev/?url=${encodeURIComponent(cityUrl)}`;
};
