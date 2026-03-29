'use client';

import { useState, useEffect, type ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { BarChart3, Calendar, Clock, Star, X, TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AvailabilityHeatmap } from '@/components/charts/AvailabilityHeatmap';
import { BestHoursChart } from '@/components/charts/BestHoursChart';
import { TrendChart } from '@/components/charts/TrendChart';

interface HallSummary {
  name: string;
  hourlyAverage: Record<string, number>;
  weekdayAverage: Record<string, number>;
  weekendAverage: Record<string, number>;
  bestHours: number[];
  worstHours: number[];
  totalSnapshots: number;
}

interface SummaryData {
  lastUpdated: string;
  period: string;
  daysOfData: number;
  halls: Record<string, HallSummary>;
}

interface HistoryIndex {
  lastUpdated: string;
  totalDays: number;
  files: string[];
}

interface DailySnapshot {
  date: string;
  snapshots: Array<{
    timestamp: string;
    hour: number;
    halls: Record<
      string,
      {
        resources: Record<
          string,
          {
            hours: Record<string, boolean>;
          }
        >;
      }
    >;
  }>;
}

type Period = 'weekly' | 'monthly' | 'yearly';

const basePath = process.env.NODE_ENV === 'production' ? '/swim' : '';

export default function TrendsPage(): ReactElement {
  const t = useTranslations('trends');
  const locale = useLocale();

  const [period, setPeriod] = useState<Period>('weekly');
  const [selectedHall, setSelectedHall] = useState<string>('all');
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [trendData, setTrendData] = useState<Array<{ date: string; averageRate: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch summary data for the selected period
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [summaryRes, indexRes] = await Promise.all([
          fetch(`${basePath}/data/summary/${period}.json`),
          fetch(`${basePath}/data/history_index.json`),
        ]);

        if (!summaryRes.ok) {
          throw new Error(`No ${period} data available yet`);
        }

        const summary: SummaryData = await summaryRes.json();
        setSummaryData(summary);

        if (indexRes.ok) {
          const index: HistoryIndex = await indexRes.json();

          // Build trend data from daily files
          const days = index.files.slice(-30); // Last 30 days max
          const trends: Array<{ date: string; averageRate: number }> = [];

          for (const day of days) {
            try {
              const dayRes = await fetch(`${basePath}/data/history/${day}.json`);
              if (dayRes.ok) {
                const dayData: DailySnapshot = await dayRes.json();

                // Calculate average reservation rate for the day
                let totalReserved = 0;
                let totalSlots = 0;

                for (const snapshot of dayData.snapshots || []) {
                  for (const [hallId, hallData] of Object.entries(snapshot.halls || {})) {
                    if (selectedHall !== 'all' && hallId !== selectedHall) continue;

                    for (const [, resData] of Object.entries(hallData.resources || {})) {
                      for (const [, isReserved] of Object.entries(resData.hours || {})) {
                        totalSlots++;
                        if (isReserved) totalReserved++;
                      }
                    }
                  }
                }

                if (totalSlots > 0) {
                  trends.push({
                    date: day,
                    averageRate: totalReserved / totalSlots,
                  });
                }
              }
            } catch {
              // Skip days that fail
            }
          }

          setTrendData(trends);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period, selectedHall]);

  const hallIds = summaryData ? Object.keys(summaryData.halls) : [];
  const currentHall =
    selectedHall !== 'all' && summaryData?.halls[selectedHall]
      ? summaryData.halls[selectedHall]
      : null;

  // Aggregate data across all halls when "all" is selected
  const aggregatedData = summaryData
    ? (() => {
        if (selectedHall !== 'all' && currentHall) return currentHall;

        const hourlyAverage: Record<string, number> = {};
        const weekdayAverage: Record<string, number> = {};
        const weekendAverage: Record<string, number> = {};
        const hallCount = Object.keys(summaryData.halls).length;

        for (let h = 6; h <= 22; h++) {
          let sumAll = 0;
          let sumWd = 0;
          let sumWe = 0;

          for (const hall of Object.values(summaryData.halls)) {
            sumAll += hall.hourlyAverage[h] ?? 0;
            sumWd += hall.weekdayAverage[h] ?? 0;
            sumWe += hall.weekendAverage[h] ?? 0;
          }

          hourlyAverage[h] = Math.round((sumAll / hallCount) * 100) / 100;
          weekdayAverage[h] = Math.round((sumWd / hallCount) * 100) / 100;
          weekendAverage[h] = Math.round((sumWe / hallCount) * 100) / 100;
        }

        const sorted = Object.entries(hourlyAverage)
          .map(([h, rate]) => ({ hour: parseInt(h), rate }))
          .sort((a, b) => a.rate - b.rate);

        return {
          name: 'All Halls',
          hourlyAverage,
          weekdayAverage,
          weekendAverage,
          bestHours: sorted.slice(0, 3).map((h) => h.hour),
          worstHours: sorted
            .slice(-3)
            .reverse()
            .map((h) => h.hour),
          totalSnapshots: Object.values(summaryData.halls).reduce(
            (sum, h) => sum + h.totalSnapshots,
            0,
          ),
        };
      })()
    : null;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            {t('title')}
          </h1>
          <Link
            href={`/${locale}`}
            className="p-2 hover:bg-muted rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </Link>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Period Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            {(['weekly', 'monthly', 'yearly'] as const).map((p) => (
              <Button
                key={p}
                variant={period === p ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setPeriod(p)}
                className={
                  period === p
                    ? 'bg-background border-2 border-black dark:border-white rounded-md'
                    : 'rounded-md'
                }
              >
                {t(p)}
              </Button>
            ))}
          </div>

          {/* Hall Selector */}
          <select
            value={selectedHall}
            onChange={(e) => setSelectedHall(e.target.value)}
            className="px-4 py-2 bg-muted rounded-lg border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">{t('allHalls')}</option>
            {hallIds.map((id) => (
              <option key={id} value={id}>
                {summaryData?.halls[id]?.name ?? id}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-xl font-medium text-muted-foreground">{t('loading')}</p>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground mb-2">{t('noData')}</p>
            <p className="text-sm text-muted-foreground/70">{t('noDataDescription')}</p>
          </motion.div>
        ) : aggregatedData ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${period}-${selectedHall}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Best Time Recommendation */}
              <Card
                interactive
                className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-green-300 dark:border-green-700"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <h2 className="text-lg font-bold text-green-800 dark:text-green-200">
                      {t('recommendation')}
                    </h2>
                  </div>
                  <p className="text-2xl font-black text-green-900 dark:text-green-100">
                    {aggregatedData.bestHours.map((h) => `${h}:00`).join(', ')}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    {t('recommendationDescription')}
                  </p>
                </CardContent>
              </Card>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card interactive>
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold">{summaryData?.daysOfData ?? 0}</p>
                    <p className="text-xs text-muted-foreground">{t('daysOfData')}</p>
                  </CardContent>
                </Card>
                <Card interactive>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold">{aggregatedData.totalSnapshots}</p>
                    <p className="text-xs text-muted-foreground">{t('snapshots')}</p>
                  </CardContent>
                </Card>
                <Card interactive>
                  <CardContent className="p-4 text-center">
                    <Star className="h-5 w-5 text-green-500 mx-auto mb-1" />
                    <p className="text-2xl font-bold">{aggregatedData.bestHours[0]}:00</p>
                    <p className="text-xs text-muted-foreground">{t('bestHour')}</p>
                  </CardContent>
                </Card>
                <Card interactive>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-5 w-5 text-red-500 mx-auto mb-1" />
                    <p className="text-2xl font-bold">{aggregatedData.worstHours[0]}:00</p>
                    <p className="text-xs text-muted-foreground">{t('busiestHour')}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Availability Heatmap */}
              <Card interactive>
                <CardHeader>
                  <CardTitle className="text-lg">{t('heatmapTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <AvailabilityHeatmap
                    data={aggregatedData.hourlyAverage}
                    weekdayData={aggregatedData.weekdayAverage}
                    weekendData={aggregatedData.weekendAverage}
                    height={140}
                  />
                </CardContent>
              </Card>

              {/* Best Hours Bar Chart */}
              <Card interactive>
                <CardHeader>
                  <CardTitle className="text-lg">{t('bestHoursTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <BestHoursChart
                    data={aggregatedData.hourlyAverage}
                    bestHours={aggregatedData.bestHours}
                    worstHours={aggregatedData.worstHours}
                    height={220}
                  />
                  <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded bg-green-500" />
                      {t('bestHoursLegend')}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded bg-red-500" />
                      {t('worstHoursLegend')}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded bg-blue-500" />
                      {t('normalHoursLegend')}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Trend Line */}
              {trendData.length > 1 && (
                <Card interactive>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('trendTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TrendChart data={trendData} height={200} color="#8b5cf6" />
                  </CardContent>
                </Card>
              )}

              {/* Per-Hall Breakdown (when "all" selected) */}
              {selectedHall === 'all' && summaryData && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">{t('perHallBreakdown')}</h2>
                  {Object.entries(summaryData.halls).map(([hallId, hall]) => (
                    <Card key={hallId} interactive>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{hall.name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-green-600 dark:text-green-400 font-bold">
                              ★ {hall.bestHours[0]}:00
                            </span>
                            <span className="text-muted-foreground">→</span>
                            <span className="text-red-500 font-bold">
                              ● {hall.worstHours[0]}:00
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <AvailabilityHeatmap
                          data={hall.hourlyAverage}
                          height={60}
                          showLegend={false}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Last Updated */}
              {summaryData?.lastUpdated && (
                <p className="text-xs text-center text-muted-foreground/60 mt-6">
                  {t('lastUpdated')}: {new Date(summaryData.lastUpdated).toLocaleString()}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        ) : null}
      </div>
    </div>
  );
}
