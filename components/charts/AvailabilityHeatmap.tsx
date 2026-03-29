'use client';

import { useEffect, useRef } from 'react';

interface AvailabilityHeatmapProps {
  data: Record<string, number>; // hour -> reservation rate (0-1)
  weekdayData?: Record<string, number>;
  weekendData?: Record<string, number>;
  label?: string;
  showLegend?: boolean;
  height?: number;
}

export const AvailabilityHeatmap = ({
  data,
  weekdayData,
  weekendData,
  label = '',
  showLegend = true,
  height = 120,
}: AvailabilityHeatmapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Clear
    ctx.clearRect(0, 0, w, h);

    const hours = Object.keys(data)
      .map(Number)
      .sort((a, b) => a - b);
    if (hours.length === 0) return;

    const datasets = [
      { data, label: 'All', yOffset: 0 },
      ...(weekdayData ? [{ data: weekdayData, label: 'Weekday', yOffset: 1 }] : []),
      ...(weekendData ? [{ data: weekendData, label: 'Weekend', yOffset: 2 }] : []),
    ];

    const rowCount = datasets.length;
    const paddingTop = label ? 28 : 8;
    const paddingBottom = 28;
    const paddingLeft = weekdayData ? 70 : 8;
    const paddingRight = 8;

    const cellW = (w - paddingLeft - paddingRight) / hours.length;
    const cellH = (h - paddingTop - paddingBottom) / rowCount;

    // Title
    if (label) {
      ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('color') || '#fff';
      ctx.font = 'bold 13px Inter, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label, paddingLeft, 18);
    }

    // Draw cells
    for (const dataset of datasets) {
      for (let i = 0; i < hours.length; i++) {
        const hour = hours[i]!;
        const rate = dataset.data[hour] ?? 0;
        const x = paddingLeft + i * cellW;
        const y = paddingTop + dataset.yOffset * cellH;

        // Color: green (free) → yellow → red (busy)
        const color = getHeatColor(rate);
        ctx.fillStyle = color;

        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, cellW - 2, cellH - 2, 4);
        ctx.fill();

        // Rate text inside cell
        if (cellW > 30) {
          ctx.fillStyle = rate > 0.5 ? '#fff' : '#000';
          ctx.font = 'bold 11px Inter, system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${Math.round(rate * 100)}%`, x + cellW / 2, y + cellH / 2);
        }
      }

      // Row label
      if (datasets.length > 1) {
        ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('color') || '#fff';
        ctx.font = '11px Inter, system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          dataset.label,
          paddingLeft - 6,
          paddingTop + dataset.yOffset * cellH + cellH / 2,
        );
      }
    }

    // Hour labels at bottom
    ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('color') || '#999';
    ctx.font = '11px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let i = 0; i < hours.length; i++) {
      const x = paddingLeft + i * cellW + cellW / 2;
      const y = h - paddingBottom + 6;
      ctx.fillText(`${hours[i]}`, x, y);
    }

    // Legend
    if (showLegend) {
      const legendY = h - 12;
      const legendW = 80;
      const legendH = 8;
      const legendX = w - paddingRight - legendW;

      const gradient = ctx.createLinearGradient(legendX, 0, legendX + legendW, 0);
      gradient.addColorStop(0, '#22c55e');
      gradient.addColorStop(0.5, '#eab308');
      gradient.addColorStop(1, '#ef4444');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(legendX, legendY - legendH, legendW, legendH, 2);
      ctx.fill();

      ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('color') || '#999';
      ctx.font = '9px Inter, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Free', legendX, legendY + 4);
      ctx.textAlign = 'right';
      ctx.fillText('Busy', legendX + legendW, legendY + 4);
    }
  }, [data, weekdayData, weekendData, label, showLegend, height]);

  return (
    <canvas ref={canvasRef} className="w-full text-foreground" style={{ height: `${height}px` }} />
  );
};

function getHeatColor(rate: number): string {
  // Green → Yellow → Red gradient
  if (rate <= 0.5) {
    const r = Math.round(34 + (234 - 34) * (rate * 2));
    const g = Math.round(197 + (179 - 197) * (rate * 2));
    const b = Math.round(94 + (8 - 94) * (rate * 2));
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const t = (rate - 0.5) * 2;
    const r = Math.round(234 + (239 - 234) * t);
    const g = Math.round(179 + (68 - 179) * t);
    const b = Math.round(8 + (68 - 8) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }
}
