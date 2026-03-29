'use client';

import { useEffect, useRef } from 'react';

interface BestHoursChartProps {
  data: Record<string, number>; // hour -> reservation rate (0-1)
  bestHours: number[];
  worstHours: number[];
  height?: number;
}

export const BestHoursChart = ({
  data,
  bestHours,
  worstHours,
  height = 200,
}: BestHoursChartProps) => {
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
    ctx.clearRect(0, 0, w, h);

    const hours = Object.keys(data)
      .map(Number)
      .sort((a, b) => a - b);
    if (hours.length === 0) return;

    const paddingTop = 16;
    const paddingBottom = 32;
    const paddingLeft = 40;
    const paddingRight = 16;

    const chartW = w - paddingLeft - paddingRight;
    const chartH = h - paddingTop - paddingBottom;
    const barW = chartW / hours.length;

    // Y-axis labels
    ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('color') || '#999';
    ctx.font = '10px Inter, system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= 4; i++) {
      const val = i * 25;
      const y = paddingTop + chartH - (chartH * val) / 100;
      ctx.fillText(`${val}%`, paddingLeft - 6, y);

      // Grid line
      ctx.strokeStyle =
        getComputedStyle(canvas)
          .getPropertyValue('color')
          ?.replace(')', ', 0.1)')
          .replace('rgb', 'rgba') || 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(w - paddingRight, y);
      ctx.stroke();
    }

    // Draw bars
    for (let i = 0; i < hours.length; i++) {
      const hour = hours[i]!;
      const rate = data[hour] ?? 0;
      const freeRate = 1 - rate; // Invert: we want to show availability, not reservation

      const x = paddingLeft + i * barW;
      const barH = freeRate * chartH;
      const y = paddingTop + chartH - barH;

      // Color based on whether it's a best or worst hour
      const isBest = bestHours.includes(hour as number);
      const isWorst = worstHours.includes(hour as number);

      if (isBest) {
        // Gradient for best hours
        const gradient = ctx.createLinearGradient(x, y, x, paddingTop + chartH);
        gradient.addColorStop(0, '#22c55e');
        gradient.addColorStop(1, '#16a34a');
        ctx.fillStyle = gradient;
      } else if (isWorst) {
        const gradient = ctx.createLinearGradient(x, y, x, paddingTop + chartH);
        gradient.addColorStop(0, '#ef4444');
        gradient.addColorStop(1, '#dc2626');
        ctx.fillStyle = gradient;
      } else {
        const gradient = ctx.createLinearGradient(x, y, x, paddingTop + chartH);
        gradient.addColorStop(0, '#60a5fa');
        gradient.addColorStop(1, '#3b82f6');
        ctx.fillStyle = gradient;
      }

      ctx.beginPath();
      ctx.roundRect(x + 2, y, barW - 4, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Value on top of bar
      if (barH > 20) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`${Math.round(freeRate * 100)}%`, x + barW / 2, y - 3);
      }

      // Hour label
      ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('color') || '#999';
      ctx.font =
        isBest || isWorst
          ? 'bold 11px Inter, system-ui, sans-serif'
          : '11px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`${hour}`, x + barW / 2, h - paddingBottom + 6);

      // Star/dot indicator for best/worst
      if (isBest) {
        ctx.fillStyle = '#22c55e';
        ctx.font = '12px Inter, system-ui, sans-serif';
        ctx.fillText('★', x + barW / 2, h - paddingBottom + 18);
      } else if (isWorst) {
        ctx.fillStyle = '#ef4444';
        ctx.font = '10px Inter, system-ui, sans-serif';
        ctx.fillText('●', x + barW / 2, h - paddingBottom + 18);
      }
    }
  }, [data, bestHours, worstHours, height]);

  return (
    <canvas ref={canvasRef} className="w-full text-foreground" style={{ height: `${height}px` }} />
  );
};
