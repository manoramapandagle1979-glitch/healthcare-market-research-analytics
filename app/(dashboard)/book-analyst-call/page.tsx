'use client'

import { useState, useEffect, useMemo } from 'react'

// ─── DateTimePicker ───────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa']
const SLOT_HOURS = [9,10,11,12,13,14,15,16,17]

function getNYOffset(dateStr: string): number {
  const noon = new Date(`${dateStr}T12:00:00Z`)
  const nyHour = parseInt(
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hour12: false }).format(noon),
    10,
  )
  return 12 - nyHour
}

interface SlotInfo {
  slotIndex: number
  localTimeStr: string
  tzAbbr: string
  utcISO: string
  isDifferentDay: boolean
  isNextDay: boolean
}

function computeSlot(dateStr: string, slotHour: number, i: number, userTZ: string, nyOffset: number): SlotInfo {
  const utcHour = slotHour + nyOffset
  let dayOffset = 0, adjustedHour = utcHour
  if (utcHour >= 24) { dayOffset = 1; adjustedHour -= 24 }
  else if (utcHour < 0) { dayOffset = -1; adjustedHour += 24 }
  const base = new Date(`${dateStr}T00:00:00Z`)
  const utcInstant = new Date(base.getTime() + dayOffset * 86400000)
  utcInstant.setUTCHours(adjustedHour, 0, 0, 0)
  const localTimeStr = new Intl.DateTimeFormat('en-US', { timeZone: userTZ, hour: 'numeric', minute: '2-digit', hour12: true }).format(utcInstant)
  const tzAbbr = new Intl.DateTimeFormat('en-US', { timeZone: userTZ, timeZoneName: 'short' }).formatToParts(utcInstant).find(p => p.type === 'timeZoneName')?.value ?? ''
  const localDateStr = new Intl.DateTimeFormat('en-CA', { timeZone: userTZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(utcInstant)
  const isDifferentDay = localDateStr !== dateStr
  return { slotIndex: i, localTimeStr, tzAbbr, utcISO: utcInstant.toISOString(), isDifferentDay, isNextDay: isDifferentDay && localDateStr > dateStr }
}

interface CalCell { day: number; dateStr: string; isCurrentMonth: boolean; isToday: boolean; isDisabled: boolean }

function buildCells(year: number, month: number): CalCell[] {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()
  const cells: CalCell[] = []
  for (let i = firstWeekday - 1; i >= 0; i--) {
    const d = prevMonthDays - i, m = month === 0 ? 11 : month - 1, y = month === 0 ? year - 1 : year
    cells.push({ day: d, dateStr: `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`, isCurrentMonth: false, isToday: false, isDisabled: true })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    cells.push({ day: d, dateStr, isCurrentMonth: true, isToday: dateStr === todayStr, isDisabled: dateStr <= todayStr })
  }
  const rem = 42 - cells.length
  for (let d = 1; d <= rem; d++) {
    const m = month === 11 ? 0 : month + 1, y = month === 11 ? year + 1 : year
    cells.push({ day: d, dateStr: `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`, isCurrentMonth: false, isToday: false, isDisabled: true })
  }
  return cells
}

function DateTimePicker({ onChange }: { onChange: (sel: { dateTimeUTC: string; userTimezone: string; timeLocalLabel: string } | null) => void }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState(-1)
  const [userTZ, setUserTZ] = useState('America/New_York')
  const [tzAbbr, setTZAbbr] = useState('ET')

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    setUserTZ(tz)
    const abbr = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' }).formatToParts(new Date()).find(p => p.type === 'timeZoneName')?.value ?? tz
    setTZAbbr(abbr)
  }, [])

  const cells = useMemo(() => buildCells(viewYear, viewMonth), [viewYear, viewMonth])
  const nyOffset = useMemo(() => selectedDate ? getNYOffset(selectedDate) : 5, [selectedDate])
  const slots = useMemo((): SlotInfo[] => selectedDate ? SLOT_HOURS.map((h,i) => computeSlot(selectedDate, h, i, userTZ, nyOffset)) : [], [selectedDate, userTZ, nyOffset])

  const canGoPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth())
  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11) } else setViewMonth(m => m-1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0) } else setViewMonth(m => m+1) }

  const handleDate = (dateStr: string) => { setSelectedDate(dateStr); setSelectedSlot(-1); onChange(null) }
  const handleSlot = (s: SlotInfo) => {
    setSelectedSlot(s.slotIndex)
    onChange({ dateTimeUTC: s.utcISO, userTimezone: userTZ, timeLocalLabel: `${s.localTimeStr} ${s.tzAbbr}` })
  }

  const active = slots.find(s => s.slotIndex === selectedSlot)

  return (
    <div className="space-y-3">
      {/* Timezone pill */}
      <div className="flex items-center gap-2 text-xs bg-surface-container rounded-lg px-3 py-2 text-on-surface-variant">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Times shown in your timezone: <strong>{tzAbbr}</strong> <span className="opacity-60">({userTZ})</span></span>
      </div>

      <div className="grid md:grid-cols-[auto_1fr] gap-3">
        {/* Calendar */}
        <div className="border border-outline-variant/30 rounded-xl p-4 bg-surface-container-lowest">
          <div className="flex items-center justify-between mb-3 gap-2">
            <button type="button" onClick={prevMonth} disabled={!canGoPrev}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-container disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="text-sm font-semibold min-w-[130px] text-center text-primary">{MONTH_NAMES[viewMonth]} {viewYear}</span>
            <button type="button" onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {DAY_NAMES.map(d => (
              <div key={d} className="text-center text-[11px] font-medium py-1 text-on-surface-variant">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((cell, i) => {
              const sel = cell.dateStr === selectedDate
              return (
                <button key={i} type="button" onClick={() => !cell.isDisabled && handleDate(cell.dateStr)} disabled={cell.isDisabled}
                  className={[
                    'h-8 w-8 mx-auto flex items-center justify-center text-xs rounded-lg transition-all font-body',
                    !cell.isCurrentMonth ? 'opacity-20 pointer-events-none' : '',
                    cell.isDisabled && cell.isCurrentMonth ? 'opacity-30 cursor-not-allowed text-on-surface-variant' : '',
                    sel ? 'bg-primary text-white font-semibold shadow-sm' :
                    cell.isToday && !cell.isDisabled ? 'ring-1 ring-primary text-primary font-semibold hover:bg-primary/10' :
                    !cell.isDisabled ? 'hover:bg-surface-container text-on-surface cursor-pointer' : 'text-on-surface-variant',
                  ].filter(Boolean).join(' ')}
                >{cell.day}</button>
              )
            })}
          </div>
          <p className="text-[10px] text-on-surface-variant mt-3 text-center opacity-50">Advance booking only</p>
        </div>

        {/* Time slots */}
        <div className="border border-outline-variant/30 rounded-xl p-4 bg-surface-container-lowest">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-primary">Available Times</h4>
            {selectedDate && (
              <span className="text-xs text-on-surface-variant">
                {new Date(`${selectedDate}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center min-h-[220px] text-on-surface-variant text-center">
              <svg className="w-10 h-10 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-body">Select a date to<br />see available times</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map(slot => {
                const isSel = selectedSlot === slot.slotIndex
                return (
                  <button key={slot.slotIndex} type="button" onClick={() => handleSlot(slot)}
                    className={['px-2 py-2.5 rounded-lg text-center transition-all border font-body',
                      isSel ? 'bg-primary border-primary shadow-sm' : 'border-outline-variant/40 hover:border-primary/50 hover:bg-surface-container',
                    ].join(' ')}>
                    <div className={`text-xs font-semibold leading-tight ${isSel ? 'text-white' : 'text-on-surface'}`}>
                      {slot.localTimeStr}
                      {slot.isDifferentDay && (
                        <span className={`ml-1 text-[10px] font-normal ${isSel ? 'text-white/70' : slot.isNextDay ? 'text-amber-500' : 'text-sky-500'}`}>
                          {slot.isNextDay ? '+1d' : '-1d'}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Selection summary */}
      {selectedDate && selectedSlot >= 0 && active && (
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-green-900 leading-relaxed font-body">
            <span className="font-semibold">
              {new Date(`${selectedDate}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="mx-1.5 text-green-600">·</span>
            <span className="font-semibold">{active.localTimeStr} {active.tzAbbr}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Quick Contact ────────────────────────────────────────────────────────────

function QuickContact() {
  return (
    <div className="bg-[#E8F1F8] rounded-xl p-4 space-y-3">
      <h2 className="font-headline font-bold text-lg text-primary">Quick Contact</h2>
      <div className="space-y-2">
        <a href="tel:+17377342707" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow group">
          <div className="shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] text-on-surface-variant font-body">USA Office</p>
            <p className="text-sm font-semibold text-primary font-body group-hover:text-secondary transition-colors">+1 737-734-2707</p>
          </div>
        </a>
        <a href="tel:+912046022736" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow group">
          <div className="shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] text-on-surface-variant font-body">India Office</p>
            <p className="text-sm font-semibold text-primary font-body group-hover:text-secondary transition-colors">+91 20-4602-2736</p>
          </div>
        </a>
        <a href="mailto:support@healthcareforesights.com" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow group">
          <div className="shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-on-surface-variant font-body">Email Us</p>
            <p className="text-sm font-semibold text-primary font-body group-hover:text-secondary transition-colors truncate">support@healthcareforesights.com</p>
          </div>
        </a>
      </div>
      <div className="pt-3 border-t border-outline-variant/20 flex items-center gap-2 text-xs text-secondary">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-body font-medium">24×7 Sales &amp; Support Available</span>
      </div>
    </div>
  )
}

// ─── Trusted Partners ─────────────────────────────────────────────────────────

const PARTNERS = ['BCG', 'PwC', 'Meta', 'Mitsubishi', 'Kawasaki', 'Trivago']

function TrustedPartners() {
  return (
    <div className="bg-white rounded-xl border border-outline-variant/20 p-4 shadow-card">
      <h2 className="font-headline font-bold text-lg text-primary mb-3">Trusted Partner</h2>
      <div className="grid grid-cols-2 gap-2">
        {PARTNERS.map(name => (
          <div key={name} className="flex items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors min-h-[52px]">
            <span className="font-headline font-bold text-sm text-on-surface-variant">{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BookAnalystCallPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', phone: '', jobTitle: '', companySize: '', interests: '', message: '',
  })
  const [dateTimeSelection, setDateTimeSelection] = useState<{ dateTimeUTC: string; userTimezone: string; timeLocalLabel: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/v1/forms/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'schedule-demo',
          fullName: formData.name,
          email: formData.email,
          company: formData.company,
          jobTitle: formData.jobTitle || undefined,
          phone: formData.phone || undefined,
          companySize: formData.companySize || undefined,
          interests: formData.interests || undefined,
          preferredDateTimeUTC: dateTimeSelection?.dateTimeUTC || undefined,
          userTimezone: dateTimeSelection?.userTimezone || undefined,
          preferredTimeLocal: dateTimeSelection?.timeLocalLabel || undefined,
          additionalInfo: formData.message || undefined,
        }),
      })
      if (!res.ok) throw new Error('failed')
      setSubmitted(true)
    } catch {
      setError('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Header */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/20">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-primary/10 text-primary">
              Book Analyst Call
            </span>
            <h1 className="font-headline font-extrabold text-3xl md:text-4xl text-primary">Speak Directly With Our Analysts</h1>
            <p className="font-body text-on-surface-variant max-w-xl mx-auto">
              Schedule a personalized call to get expert insights on your market, segment, or strategic question.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Form (2/3) */}
          <div className="lg:col-span-2">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-card">
              <div className="px-6 pt-6 pb-2 border-b border-surface-container">
                <h2 className="font-headline font-bold text-base text-primary">Book Analyst Call</h2>
                <p className="font-body text-sm text-on-surface-variant mt-0.5">
                  Fill out the form below and our team will contact you to schedule a convenient time.
                </p>
              </div>

              <div className="p-6">
                {submitted ? (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-headline font-semibold text-xl text-primary mb-2">Call Booked!</h3>
                    <p className="font-body text-on-surface-variant mb-2">
                      Thank you for your interest. Our team will reach out within 24 hours to confirm your analyst call.
                    </p>
                    <p className="font-body text-sm text-on-surface-variant">
                      We will contact you at <strong>{formData.email}</strong>
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-on-surface mb-1.5">Full Name *</label>
                        <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
                          className="input-field" placeholder="John Doe" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-1.5">Business Email *</label>
                        <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
                          className="input-field" placeholder="john@company.com" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-on-surface mb-1.5">Company Name *</label>
                        <input type="text" id="company" name="company" required value={formData.company} onChange={handleChange}
                          className="input-field" placeholder="Your Company" />
                      </div>
                      <div>
                        <label htmlFor="jobTitle" className="block text-sm font-medium text-on-surface mb-1.5">Job Title *</label>
                        <input type="text" id="jobTitle" name="jobTitle" required value={formData.jobTitle} onChange={handleChange}
                          className="input-field" placeholder="VP of Strategy" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-on-surface mb-1.5">Phone Number *</label>
                        <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange}
                          className="input-field" placeholder="+1 (555) 000-0000" />
                      </div>
                      <div>
                        <label htmlFor="companySize" className="block text-sm font-medium text-on-surface mb-1.5">Company Size *</label>
                        <select id="companySize" name="companySize" required value={formData.companySize} onChange={handleChange} className="input-field">
                          <option value="">Select size</option>
                          <option value="1-50">1-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="501-1000">501-1,000 employees</option>
                          <option value="1000+">1,000+ employees</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="interests" className="block text-sm font-medium text-on-surface mb-1.5">Areas of Interest *</label>
                      <select id="interests" name="interests" required value={formData.interests} onChange={handleChange} className="input-field">
                        <option value="">Select primary interest</option>
                        <option value="telemedicine">Telemedicine &amp; Digital Health</option>
                        <option value="pharmaceuticals">Pharmaceuticals</option>
                        <option value="medical-devices">Medical Devices</option>
                        <option value="biotechnology">Biotechnology</option>
                        <option value="ai-healthcare">AI in Healthcare</option>
                        <option value="healthcare-it">Healthcare IT</option>
                        <option value="diagnostics">Diagnostics</option>
                        <option value="multiple">Multiple Categories</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Date & Time Picker */}
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-2">
                        Preferred Date &amp; Time
                        <span className="ml-1.5 text-xs font-normal text-on-surface-variant">(optional)</span>
                      </label>
                      <DateTimePicker onChange={setDateTimeSelection} />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-on-surface mb-1.5">Additional Information</label>
                      <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange}
                        className="input-field resize-none"
                        placeholder="Tell us about your specific research needs or questions you'd like addressed during the demo…" />
                    </div>

                    {/* What to Expect */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="font-headline font-semibold text-sm text-blue-900 mb-2">What to Expect:</h4>
                      <ul className="text-sm font-body text-blue-800 space-y-1">
                        <li>• Live walkthrough of our research platform and reports</li>
                        <li>• Discussion of your specific research needs</li>
                        <li>• Overview of subscription options and pricing</li>
                        <li>• Q&amp;A session with our product experts</li>
                      </ul>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-body text-red-700">{error}</div>
                    )}

                    <button type="submit" disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl font-body font-bold text-sm text-white bg-primary hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed">
                      {isSubmitting ? 'Submitting…' : 'Book Analyst Call'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {!submitted && (
              <div className="mt-6 text-center">
                <p className="font-body text-sm text-on-surface-variant">
                  Need immediate assistance?{' '}
                  <a href="/contact" className="text-primary hover:underline font-medium">Contact us directly</a>
                  {' '}or call{' '}
                  <a href="tel:+17377342707" className="text-primary hover:underline font-medium">+1 737-734-2707</a>
                  {' '}(USA) /{' '}
                  <a href="tel:+912046022736" className="text-primary hover:underline font-medium">+91 20-4602-2736</a>
                  {' '}(India) - 24×7 Support
                </p>
              </div>
            )}
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-5">
            <QuickContact />
            <TrustedPartners />
          </div>
        </div>
      </div>
    </div>
  )
}
