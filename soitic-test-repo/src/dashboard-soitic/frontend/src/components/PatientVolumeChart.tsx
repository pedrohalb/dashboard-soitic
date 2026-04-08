import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { VolumeData } from '../types';
import { formatDayLabel } from '../utils/appointmentUtils';

interface Props {
  weeklyData: VolumeData[];
  monthlyData: VolumeData[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="editorial-shadow rounded-xl px-4 py-3 bg-surface border border-border-subtle font-body"
    >
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-base font-bold text-primary-500">
        {payload[0].value} pacientes
      </p>
    </div>
  );
}

export function PatientVolumeChart({ weeklyData, monthlyData }: Props) {
  const [view, setView] = useState<'week' | 'month'>('week');

  const weekDayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const chartData = (view === 'week' ? weeklyData : monthlyData).map((d, i) => ({
    name: view === 'week'
      ? weekDayLabels[i] ?? formatDayLabel(d.date)
      : `${d.date.split('-')[2]}/${d.date.split('-')[1]}`,
    value: d.count,
  }));


  return (
    <div
      className="editorial-shadow rounded-xl p-8 h-full bg-surface border border-border-subtle transition-colors duration-300"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3
            className="text-xl font-extrabold tracking-tight font-headline text-text-primary"
          >
            Volume de Pacientes
          </h3>
          <p className="text-sm mt-0.5 font-body text-text-secondary">
            Análise de tráfego {view === 'week' ? 'semanal' : 'mensal'}
          </p>
        </div>

        {/* Toggle */}
        <div
          className="flex rounded-lg p-1 gap-1 bg-surface-hover border border-border-subtle transition-colors"
        >
          {(['week', 'month'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold font-body transition-all ${
                view === v
                  ? 'bg-surface text-primary-500 shadow-sm'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              {v === 'week' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary-500, #5E00FF)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--color-primary-500, #5E00FF)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border-strong, #B4B8CB)"
            strokeOpacity={0.3}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fontFamily: 'var(--font-body)', fill: 'var(--color-text-secondary, #2A2F45)', fontWeight: 600, letterSpacing: 0.5 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fontFamily: 'var(--font-body)', fill: 'var(--color-text-secondary, #2A2F45)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-primary-500, #5E00FF)', strokeOpacity: 0.1 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-primary-500, #5E00FF)"
            strokeWidth={2.5}
            fill="url(#primaryGrad)"
            dot={{ r: 4, fill: 'var(--color-primary-500, #5E00FF)', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: 'var(--color-primary-500, #5E00FF)', strokeWidth: 2, stroke: 'var(--color-surface, #FFF)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
