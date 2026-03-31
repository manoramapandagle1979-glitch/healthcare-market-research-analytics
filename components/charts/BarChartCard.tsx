'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Maximize2, Share2, Download, Bookmark, Printer, Code, Copy } from 'lucide-react'
import { useState } from 'react'

interface DataPoint {
  year: number
  value: number
}

interface BarChartCardProps {
  title: string
  data: DataPoint[]
  unit?: string
  height?: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-primary text-white px-3 py-2 rounded-lg text-sm font-dm shadow-xl">
        <div className="font-semibold mb-0.5">{label}</div>
        <div className="text-brand-accent font-bold">US$ {payload[0].value.toFixed(1)}B</div>
      </div>
    )
  }
  return null
}

export default function BarChartCard({ title, data, unit = 'US$B', height = 300 }: BarChartCardProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-sora font-semibold text-base text-brand-primary leading-tight">
            {title}
          </h3>
          <p className="text-xs font-dm text-gray-400 mt-0.5">{unit} · Click bars to explore</p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1">
          {[
            { icon: Maximize2, label: 'Expand' },
            { icon: Share2, label: 'Share' },
            { icon: Code, label: 'Embed' },
            { icon: Copy, label: 'Copy' },
            { icon: Bookmark, label: 'Save' },
            { icon: Printer, label: 'Print' },
            { icon: Download, label: 'Download' },
          ].map(({ icon: Icon, label }) => (
            <button key={label} title={label}
              className="p-1.5 rounded-lg text-gray-400 hover:text-brand-primary hover:bg-gray-100 transition-colors">
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
          onMouseLeave={() => setActiveIndex(null)}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fontFamily: 'Outfit', fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: 'Outfit', fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}B`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}
            onMouseEnter={(_: any, index: number) => setActiveIndex(index)}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={activeIndex === index ? '#0d9488' : index >= data.findIndex(d => d.year === 2024) ? '#c8a96e' : '#0a0f1e'}
                opacity={activeIndex !== null && activeIndex !== index ? 0.6 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: '#0a0f1e' }} />
          <span className="text-xs font-dm text-gray-500">Historical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: '#c8a96e' }} />
          <span className="text-xs font-dm text-gray-500">Forecast</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="w-3 h-3 rounded-sm" style={{ background: '#0d9488' }} />
          <span className="text-xs font-dm text-gray-500">Active selection</span>
        </div>
      </div>
    </div>
  )
}
