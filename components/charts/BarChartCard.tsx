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
      <div className="bg-primary text-white px-3 py-2 rounded-lg text-sm font-body shadow-xl">
        <div className="font-semibold mb-0.5">{label}</div>
        <div className="text-secondary-fixed font-bold">US$ {payload[0].value.toFixed(1)}B</div>
      </div>
    )
  }
  return null
}

export default function BarChartCard({ title, data, unit = 'US$B', height = 300 }: BarChartCardProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-card p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-headline font-semibold text-base text-primary leading-tight">
            {title}
          </h3>
          <p className="text-xs font-body text-on-surface-variant mt-0.5">{unit} · Click bars to explore</p>
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
              className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors">
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
          onMouseLeave={() => setActiveIndex(null)}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eceef0" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fontFamily: 'Inter', fill: '#75777d' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: 'Inter', fill: '#75777d' }}
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
                fill={activeIndex === index ? '#006a61' : index >= data.findIndex(d => d.year === 2024) ? '#86f2e4' : '#091426'}
                opacity={activeIndex !== null && activeIndex !== index ? 0.6 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-surface-container">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary" />
          <span className="text-xs font-body text-on-surface-variant">Historical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-secondary-container" />
          <span className="text-xs font-body text-on-surface-variant">Forecast</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="w-3 h-3 rounded-sm bg-secondary" />
          <span className="text-xs font-body text-on-surface-variant">Active selection</span>
        </div>
      </div>
    </div>
  )
}
