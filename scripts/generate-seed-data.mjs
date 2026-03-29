#!/usr/bin/env node

/**
 * 🌱 Seed Data Generator
 *
 * Creates realistic sample data for testing the trends/charts page
 * before the GitHub Action has had time to collect real data.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(PROJECT_ROOT, 'public', 'data');
const HISTORY_DIR = path.join(DATA_DIR, 'history');
const SUMMARY_DIR = path.join(DATA_DIR, 'summary');
const INDEX_FILE = path.join(DATA_DIR, 'history_index.json');

const halls = [
  { id: 'matinkylan-uimahalli', name: 'Matinkylän uimahalli' },
  { id: 'leppavaaran-uimahalli', name: 'Leppävaaran uimahalli' },
  { id: 'espoonlahden-uimahalli', name: 'Espoonlahden uimahalli' },
  { id: 'keski-espoon-uimahalli', name: 'Keski-Espoon uimahalli' },
  { id: 'olari-uimahalli', name: 'Olari uimahalli' },
];

// Realistic busy patterns: higher during peak hours (9-11, 16-18), lower early/late
function getBusyRate(hour, isWeekend) {
  const baseRates = {
    6: 0.1, 7: 0.2, 8: 0.35, 9: 0.6, 10: 0.75, 11: 0.65,
    12: 0.5, 13: 0.45, 14: 0.5, 15: 0.55, 16: 0.7, 17: 0.8,
    18: 0.65, 19: 0.5, 20: 0.35, 21: 0.2, 22: 0.1,
  };

  let rate = baseRates[hour] || 0.3;

  if (isWeekend) {
    // Weekends: less busy early, more busy midday
    if (hour < 9) rate *= 0.5;
    else if (hour >= 10 && hour <= 14) rate *= 1.2;
    else rate *= 0.9;
  }

  // Add some randomness
  rate += (Math.random() - 0.5) * 0.2;
  return Math.max(0, Math.min(1, rate));
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function generateSeedData() {
  console.log('🌱 Generating seed data...');

  ensureDir(HISTORY_DIR);
  ensureDir(SUMMARY_DIR);

  const now = new Date();
  const daysToGenerate = 30;

  for (let d = daysToGenerate; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const snapshots = [];

    // Generate a snapshot for each hour (6-22)
    for (let h = 6; h <= 22; h++) {
      const snapshotTime = new Date(date);
      snapshotTime.setHours(h, 0, 0, 0);

      const snapshot = {
        timestamp: snapshotTime.toISOString(),
        hour: h,
        dayOfWeek,
        halls: {},
      };

      for (const hall of halls) {
        const resources = {};
        const resourceCount = hall.id === 'olari-uimahalli' ? 2 : 3;

        for (let r = 0; r < resourceCount; r++) {
          const resId = `seed-${hall.id}-${r}`;
          const hours = {};

          for (let rh = 6; rh <= 22; rh++) {
            // Add per-hall variation
            const hallFactor = halls.indexOf(hall) * 0.05;
            const rate = getBusyRate(rh, isWeekend) + hallFactor;
            hours[rh] = Math.random() < rate;
          }

          resources[resId] = {
            name: `Resource ${r + 1}`,
            hours,
            hasFreeReservation: Math.random() < 0.15,
          };
        }

        snapshot.halls[hall.id] = { resources };
      }

      snapshots.push(snapshot);
    }

    const dailyData = { date: dateStr, snapshots };
    fs.writeFileSync(
      path.join(HISTORY_DIR, `${dateStr}.json`),
      JSON.stringify(dailyData, null, 2)
    );
  }

  console.log(`📅 Generated ${daysToGenerate + 1} days of history data`);

  // Generate summaries
  generateSummaries();

  // Update index
  updateIndex();

  console.log('✅ Seed data generation complete!');
}

function generateSummaries() {
  const files = fs.readdirSync(HISTORY_DIR).filter((f) => f.endsWith('.json')).sort().reverse();

  const periods = [
    { name: 'weekly', days: 7 },
    { name: 'monthly', days: 30 },
    { name: 'yearly', days: 365 },
  ];

  for (const period of periods) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - period.days);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    const relevantFiles = files.filter((f) => f.replace('.json', '') >= cutoffStr);
    if (relevantFiles.length === 0) continue;

    const hallStats = {};

    for (const hall of halls) {
      hallStats[hall.id] = {
        name: hall.name,
        hourCounts: {},
        weekdayHourCounts: {},
        weekendHourCounts: {},
        totalSnapshots: 0,
      };
      for (let h = 6; h <= 22; h++) {
        hallStats[hall.id].hourCounts[h] = { reserved: 0, total: 0 };
        hallStats[hall.id].weekdayHourCounts[h] = { reserved: 0, total: 0 };
        hallStats[hall.id].weekendHourCounts[h] = { reserved: 0, total: 0 };
      }
    }

    for (const file of relevantFiles) {
      try {
        const dailyData = JSON.parse(
          fs.readFileSync(path.join(HISTORY_DIR, file), 'utf-8')
        );

        for (const snapshot of dailyData.snapshots || []) {
          const isWeekend = snapshot.dayOfWeek === 0 || snapshot.dayOfWeek === 6;

          for (const [hallId, hallData] of Object.entries(snapshot.halls || {})) {
            if (!hallStats[hallId]) continue;
            hallStats[hallId].totalSnapshots++;

            for (const [, resData] of Object.entries(hallData.resources || {})) {
              for (const [hour, isReserved] of Object.entries(resData.hours || {})) {
                const h = parseInt(hour);
                if (h < 6 || h > 22) continue;

                hallStats[hallId].hourCounts[h].total++;
                if (isReserved) hallStats[hallId].hourCounts[h].reserved++;

                if (isWeekend) {
                  hallStats[hallId].weekendHourCounts[h].total++;
                  if (isReserved) hallStats[hallId].weekendHourCounts[h].reserved++;
                } else {
                  hallStats[hallId].weekdayHourCounts[h].total++;
                  if (isReserved) hallStats[hallId].weekdayHourCounts[h].reserved++;
                }
              }
            }
          }
        }
      } catch { /* skip bad files */ }
    }

    const summaryHalls = {};
    for (const [hallId, stats] of Object.entries(hallStats)) {
      const hourlyAverage = {};
      const weekdayAverage = {};
      const weekendAverage = {};

      for (let h = 6; h <= 22; h++) {
        const c = stats.hourCounts[h];
        hourlyAverage[h] = c.total > 0 ? Math.round((c.reserved / c.total) * 100) / 100 : 0;

        const wc = stats.weekdayHourCounts[h];
        weekdayAverage[h] = wc.total > 0 ? Math.round((wc.reserved / wc.total) * 100) / 100 : 0;

        const we = stats.weekendHourCounts[h];
        weekendAverage[h] = we.total > 0 ? Math.round((we.reserved / we.total) * 100) / 100 : 0;
      }

      const sorted = Object.entries(hourlyAverage)
        .map(([h, rate]) => ({ hour: parseInt(h), rate }))
        .sort((a, b) => a.rate - b.rate);

      summaryHalls[hallId] = {
        name: stats.name,
        hourlyAverage,
        weekdayAverage,
        weekendAverage,
        bestHours: sorted.slice(0, 3).map((h) => h.hour),
        worstHours: sorted.slice(-3).reverse().map((h) => h.hour),
        totalSnapshots: stats.totalSnapshots,
      };
    }

    const summary = {
      lastUpdated: new Date().toISOString(),
      period: period.name,
      daysOfData: relevantFiles.length,
      halls: summaryHalls,
    };

    fs.writeFileSync(
      path.join(SUMMARY_DIR, `${period.name}.json`),
      JSON.stringify(summary, null, 2)
    );
    console.log(`📊 Generated ${period.name} summary (${relevantFiles.length} days)`);
  }
}

function updateIndex() {
  const files = fs.readdirSync(HISTORY_DIR).filter((f) => f.endsWith('.json')).sort();
  const index = {
    lastUpdated: new Date().toISOString(),
    totalDays: files.length,
    files: files.map((f) => f.replace('.json', '')),
    oldestDate: files[0]?.replace('.json', '') || null,
    newestDate: files[files.length - 1]?.replace('.json', '') || null,
  };
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
  console.log(`📋 Updated index: ${files.length} files`);
}

generateSeedData();
