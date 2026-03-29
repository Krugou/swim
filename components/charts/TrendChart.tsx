'use client';

import { useEffect, useRef } from 'react';

interface TrendDataPoint {
  date: string;
  averageRate: number;
}

interface TrendChartProps {
  data: TrendDataPoint[];
  height?: number;
  color?: string;
}

export const TrendChart = ({ data, height = 180, color = '#3b82f6' }: TrendChartProps) => {
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

    if (data.length === 0) return;

    const paddingTop = 16;
    const paddingBottom = 40;
    const paddingLeft = 44;
    const paddingRight = 16;

    const chartW = w - paddingLeft - paddingRight;
    const chartH = h - paddingTop - paddingBottom;

    // Y-axis (0-100%)
    const textColor = getComputedStyle(canvas).getPropertyValue('color') || '#999';
    ctx.fillStyle = textColor;
    ctx.font = '10px Inter, system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= 4; i++) {
      const val = i * 25;
      const y = paddingTop + chartH - (chartH * val) / 100;

      ctx.fillStyle = textColor;
      ctx.fillText(`${val}%`, paddingLeft - 6, y);

      ctx.strokeStyle = `${textColor}18`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(w - paddingRight, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Compute points
    const points = data.map((d, i) => ({
      x: paddingLeft + (chartW * i) / Math.max(data.length - 1, 1),
      y: paddingTop + chartH - chartH * d.averageRate,
    }));

    // Fill area under curve
    const gradient = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartH);
    gradient.addColorStop(0, `${color}40`);
    gradient.addColorStop(1, `${color}05`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(points[0]!.x, paddingTop + chartH);
    for (const pt of points) {
      ctx.lineTo(pt.x, pt.y);
    }
    ctx.lineTo(points[points.length - 1]!.x, paddingTop + chartH);
    ctx.closePath();
    ctx.fill();

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      if (i === 0) {
        ctx.moveTo(points[i]!.x, points[i]!.y);
      } else {
        // Smooth curve via bezier
        const prev = points[i - 1]!;
        const curr = points[i]!;
        const cpx = (prev.x + curr.x) / 2;
        ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
      }
    }
    ctx.stroke();

    // Draw dots
    for (const pt of points) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // X-axis labels (show every Nth label to avoid overlap)
    ctx.fillStyle = textColor;
    ctx.font = '9px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const labelInterval = Math.max(1, Math.floor(data.length / 8));
    for (let i = 0; i < data.length; i++) {
      if (i % labelInterval === 0 || i === data.length - 1) {
        const dateStr = data[i]!.date;
        // Format: MM/DD
        const parts = dateStr.split('-');
        const shortDate = `${parts[1]}/${parts[2]}`;

        // Rotate labels
        ctx.save();
        ctx.translate(points[i]!.x, h - paddingBottom + 6);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText(shortDate, 0, 0);
        ctx.restore();
      }
    }
  }, [data, height, color]);

  return (
    <canvas ref={canvasRef} className="w-full text-foreground" style={{ height: `${height}px` }} />
  );
};
