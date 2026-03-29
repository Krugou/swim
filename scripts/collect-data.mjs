#!/usr/bin/env node

/**
 * 🏊 Swim Data Collector
 *
 * Fetches reservation data from all Espoo swimming halls and saves
 * snapshots + aggregated summaries as JSON files.
 *
 * Modeled after aurorawatcher's schedule_bot pattern.
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

// ─── Swimming Hall Data (mirrors lib/swimming-halls-data.ts) ────────────────
const swimmingHalls = [
  {
    id: 'matinkylan-uimahalli',
    name: 'Matinkylän uimahalli',
    resources: [
      { id: '24790', name: 'Terapia-allas' },
      { id: '24847', name: 'Kuntosali' },
      { id: '24767', name: '50m, koko allas' },
    ],
  },
  {
    id: 'leppavaaran-uimahalli',
    name: 'Leppävaaran uimahalli',
    resources: [
      { id: '18509', name: 'Terapia-allas' },
      { id: '16083', name: 'Kuntosali' },
      { id: '19191', name: 'Maauimala, koko allas' },
      { id: '16074', name: 'Iso allas, koko allas' },
    ],
  },
  {
    id: 'espoonlahden-uimahalli',
    name: 'Espoonlahden uimahalli',
    resources: [
      { id: '16765', name: 'Kuntosali 1 (yläsali)' },
      { id: '15958', name: 'Vapaaharjoittelukuntosali' },
      { id: '15939', name: '50 m, koko allas' },
    ],
  },
  {
    id: 'keski-espoon-uimahalli',
    name: 'Keski-Espoon uimahalli',
    resources: [
      { id: '16650', name: 'Terapia-allas' },
      { id: '16654', name: 'Kuntosali' },
      { id: '16645', name: 'Iso allas, koko allas' },
    ],
  },
  {
    id: 'olari-uimahalli',
    name: 'Olari uimahalli',
    resources: [
      { id: '15968', name: 'Koko allas' },
      { id: '15967', name: 'Kuntosali' },
    ],
  },
];

const FOUR_HOURS_SEC = 4 * 60 * 60;
const PROXY_BASE = 'https://proxy.aleksi-nokelainen.workers.dev/?url=';

// ─── Helpers ────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

function getDateString(date = new Date()) {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

async function fetchWithRetry(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.warn(`  ⚠️  Attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt === retries) {
        console.error(`  ❌ All ${retries} attempts failed for ${url}`);
        return null;
      }
      // Wait before retry (exponential backoff)
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
  return null;
}

// ─── Fetch Reservation Data ─────────────────────────────────────────────────

async function fetchResourceData(resourceId) {
  const nowSec = Math.floor(Date.now() / 1000);
  const start = nowSec - FOUR_HOURS_SEC;
  const end = nowSec + FOUR_HOURS_SEC;

  const cityUrl = `https://resurssivaraus.espoo.fi/Tailored/prime_product_intranet/espoo/web/Calendar/ReservationData.aspx?resourceid%5B%5D=${resourceId}&start=${start}&end=${end}&_=${start}`;
  const proxyUrl = `${PROXY_BASE}${encodeURIComponent(cityUrl)}`;

  return fetchWithRetry(proxyUrl);
}

function analyzeHourlyStatus(reservations) {
  if (!reservations || !Array.isArray(reservations)) {
    return { hours: {}, hasFreeReservation: false };
  }

  const now = new Date();
  const hours = {};
  let hasFreeReservation = false;

  // Check hours 6-22 (typical pool operating hours)
  for (let h = 6; h <= 22; h++) {
    const hourStart = new Date(now);
    hourStart.setHours(h, 0, 0, 0);
    const hourEnd = new Date(now);
    hourEnd.setHours(h + 1, 0, 0, 0);

    const isReserved = reservations.some((res) => {
      const resStart = new Date(res.start);
      const resEnd = new Date(res.end);
      // Overlapping check
      return resStart < hourEnd && resEnd > hourStart;
    });

    hours[h] = isReserved;
  }

  // Check for free practice
  hasFreeReservation = reservations.some(
    (res) => res.title && res.title.includes('Vapaaharjoitte')
  );

  return { hours, hasFreeReservation };
}

// ─── Main Collection ────────────────────────────────────────────────────────

async function collectData() {
  console.log('🏊 Starting swim data collection...');
  console.log(`📅 Date: ${new Date().toISOString()}`);

  ensureDir(HISTORY_DIR);
  ensureDir(SUMMARY_DIR);

  const now = new Date();
  const timestamp = now.toISOString();
  const currentHour = now.getHours();
  const dateStr = getDateString(now);
  const dayOfWeek = now.getDay(); // 0=Sun, 6=Sat

  const snapshot = {
    timestamp,
    hour: currentHour,
    dayOfWeek,
    halls: {},
  };

  for (const hall of swimmingHalls) {
    console.log(`\n🏛️  Fetching: ${hall.name}`);
    const hallData = { resources: {} };

    for (const resource of hall.resources) {
      console.log(`  📡 Resource ${resource.name} (${resource.id})...`);
      const reservations = await fetchResourceData(resource.id);

      if (reservations) {
        const analysis = analyzeHourlyStatus(reservations);
        hallData.resources[resource.id] = {
          name: resource.name,
          ...analysis,
        };
        console.log(
          `  ✅ Got ${reservations.length} reservations, free practice: ${analysis.hasFreeReservation}`
        );
      } else {
        hallData.resources[resource.id] = {
          name: resource.name,
          hours: {},
          hasFreeReservation: false,
          error: true,
        };
        console.log(`  ❌ Failed to fetch`);
      }

      // Small delay between requests to be nice to the API
      await new Promise((r) => setTimeout(r, 500));
    }

    snapshot.halls[hall.id] = hallData;
  }

  // ─── Save Daily File ───────────────────────────────────────────────────
  const dailyFile = path.join(HISTORY_DIR, `${dateStr}.json`);
  let dailyData = { date: dateStr, snapshots: [] };

  if (fs.existsSync(dailyFile)) {
    try {
      dailyData = JSON.parse(fs.readFileSync(dailyFile, 'utf-8'));
    } catch {
      console.warn(`⚠️  Could not parse existing daily file, starting fresh`);
    }
  }

  dailyData.snapshots.push(snapshot);
  fs.writeFileSync(dailyFile, JSON.stringify(dailyData, null, 2));
  console.log(`\n💾 Saved daily data to ${dateStr}.json (${dailyData.snapshots.length} snapshots)`);

  // ─── Update History Index ──────────────────────────────────────────────
  updateHistoryIndex();

  // ─── Generate Aggregated Summaries ─────────────────────────────────────
  generateSummaries();

  console.log('\n✅ Data collection complete!');
}

// ─── History Index ──────────────────────────────────────────────────────────

function updateHistoryIndex() {
  const files = fs
    .readdirSync(HISTORY_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort();

  const index = {
    lastUpdated: new Date().toISOString(),
    totalDays: files.length,
    files: files.map((f) => f.replace('.json', '')),
    oldestDate: files.length > 0 ? files[0].replace('.json', '') : null,
    newestDate: files.length > 0 ? files[files.length - 1].replace('.json', '') : null,
  };

  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
  console.log(`📋 Updated history index: ${files.length} days of data`);
}

// ─── Aggregated Summaries ───────────────────────────────────────────────────

function generateSummaries() {
  const files = fs
    .readdirSync(HISTORY_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .reverse();

  const now = new Date();

  // Generate summaries for different periods
  const periods = [
    { name: 'weekly', days: 7 },
    { name: 'monthly', days: 30 },
    { name: 'yearly', days: 365 },
  ];

  for (const period of periods) {
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - period.days);
    const cutoffStr = getDateString(cutoff);

    const relevantFiles = files.filter((f) => f.replace('.json', '') >= cutoffStr);

    if (relevantFiles.length === 0) {
      console.log(`📊 No data for ${period.name} summary yet`);
      continue;
    }

    const summary = buildSummary(relevantFiles, period.name);
    const summaryFile = path.join(SUMMARY_DIR, `${period.name}.json`);
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(
      `📊 Generated ${period.name} summary from ${relevantFiles.length} days`
    );
  }
}

function buildSummary(files, periodName) {
  // Collect hourly reservation counts per hall
  const hallStats = {};

  // Initialize stats for all halls
  for (const hall of swimmingHalls) {
    hallStats[hall.id] = {
      name: hall.name,
      hourCounts: {}, // hour -> { reserved: N, total: N }
      weekdayHourCounts: {}, // hour -> { reserved: N, total: N } (weekdays only)
      weekendHourCounts: {}, // hour -> { reserved: N, total: N } (weekends only)
      totalSnapshots: 0,
    };

    for (let h = 6; h <= 22; h++) {
      hallStats[hall.id].hourCounts[h] = { reserved: 0, total: 0 };
      hallStats[hall.id].weekdayHourCounts[h] = { reserved: 0, total: 0 };
      hallStats[hall.id].weekendHourCounts[h] = { reserved: 0, total: 0 };
    }
  }

  // Process each daily file
  for (const file of files) {
    try {
      const filePath = path.join(HISTORY_DIR, file);
      const dailyData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      for (const snapshot of dailyData.snapshots || []) {
        const isWeekend = snapshot.dayOfWeek === 0 || snapshot.dayOfWeek === 6;

        for (const [hallId, hallData] of Object.entries(snapshot.halls || {})) {
          if (!hallStats[hallId]) continue;

          hallStats[hallId].totalSnapshots++;

          // Aggregate across all resources for the hall
          for (const [, resourceData] of Object.entries(hallData.resources || {})) {
            if (resourceData.error) continue;

            for (const [hour, isReserved] of Object.entries(resourceData.hours || {})) {
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
    } catch (err) {
      console.warn(`⚠️  Error processing ${file}: ${err.message}`);
    }
  }

  // Calculate averages and best/worst hours
  const halls = {};

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

    // Sort hours by reservation rate to find best/worst
    const sortedHours = Object.entries(hourlyAverage)
      .map(([h, rate]) => ({ hour: parseInt(h), rate }))
      .sort((a, b) => a.rate - b.rate);

    halls[hallId] = {
      name: stats.name,
      hourlyAverage,
      weekdayAverage,
      weekendAverage,
      bestHours: sortedHours.slice(0, 3).map((h) => h.hour),
      worstHours: sortedHours
        .slice(-3)
        .reverse()
        .map((h) => h.hour),
      totalSnapshots: stats.totalSnapshots,
    };
  }

  return {
    lastUpdated: new Date().toISOString(),
    period: periodName,
    daysOfData: files.length,
    halls,
  };
}

// ─── Run ────────────────────────────────────────────────────────────────────
collectData().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
