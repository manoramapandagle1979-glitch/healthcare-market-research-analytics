'use client'

import { useEffect, useRef, useState } from 'react'

interface StatCounterProps {
  value: number
  prefix?: string
  suffix?: string
  label: string
  duration?: number
}

export default function StatCounter({ value, prefix = '', suffix = '', label, duration = 2000 }: StatCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return
    let startTime: number
    const startValue = 0

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out-cubic
      setCount(Math.floor(eased * (value - startValue) + startValue))
      if (progress < 1) requestAnimationFrame(animate)
      else setCount(value)
    }

    requestAnimationFrame(animate)
  }, [isVisible, value, duration])

  const formatCount = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
    return n.toLocaleString()
  }

  return (
    <div ref={ref} className="text-center">
      <div className="font-headline font-extrabold text-4xl mb-2 text-secondary-fixed">
        {prefix}{formatCount(count)}{suffix}
      </div>
      <div className="text-sm font-body text-white/60 uppercase tracking-widest">{label}</div>
    </div>
  )
}
