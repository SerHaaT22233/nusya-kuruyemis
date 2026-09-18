'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Flame } from 'lucide-react'

interface CountdownTimerProps {
  targetDate: Date
  label?: string
}

export default function CountdownTimer({ targetDate, label = 'Kampanya Sonu' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const timeUnits = [
    { value: timeLeft.days, label: 'Gün' },
    { value: timeLeft.hours, label: 'Saat' },
    { value: timeLeft.minutes, label: 'Dakika' },
    { value: timeLeft.seconds, label: 'Saniye' },
  ]

  return (
    <div className="bg-gradient-to-r from-brand-500 to-sun-500 rounded-2xl p-6 text-ink-900">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Flame className="w-5 h-5" />
        <h3 className="font-bold uppercase tracking-wider text-sm">{label}</h3>
      </div>
      <div className="flex items-center justify-center gap-3">
        {timeUnits.map((unit, i) => (
          <div key={unit.label} className="flex items-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 min-w-[60px] text-center">
              <span className="text-2xl font-bold block">{String(unit.value).padStart(2, '0')}</span>
              <span className="text-[10px] uppercase tracking-wider opacity-70">{unit.label}</span>
            </div>
            {i < timeUnits.length - 1 && (
              <span className="text-2xl font-bold mx-1">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}