'use client'

import * as React from 'react'

interface SliderProps {
  defaultValue?: number[]
  value?: number[]
  onValueChange?: (value: number[]) => void
  max?: number
  min?: number
  step?: number
}

export function Slider({ defaultValue = [0], value, onValueChange, max = 100, min = 0, step = 1 }: SliderProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const currentValue = value ?? internalValue

  const handleChange = (index: number, newValue: number) => {
    const clamped = Math.max(min, Math.min(max, newValue))
    const stepped = Math.round(clamped / step) * step
    const newValues = [...currentValue]
    newValues[index] = stepped
    setInternalValue(newValues)
    onValueChange?.(newValues)
  }

  return (
    <div className="relative w-full h-6 flex items-center">
      <div className="absolute w-full h-2 bg-white/[0.08] rounded-full" />
      <div
        className="absolute h-2 bg-brand-500 rounded-full"
        style={{
          left: `${((currentValue[0] - min) / (max - min)) * 100}%`,
          width: `${((currentValue[1] - min) / (max - min)) * 100 - ((currentValue[0] - min) / (max - min)) * 100}%`
        }}
      />
      {currentValue.map((val, i) => (
        <input
          key={i}
          type="range"
          min={min}
          max={max}
          step={step}
          value={val}
          onChange={(e) => handleChange(i, Number(e.target.value))}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
          style={{ zIndex: i + 1 }}
        />
      ))}
      {currentValue.map((val, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 bg-brand-500 rounded-full shadow-md shadow-brand-500/30 pointer-events-none"
          style={{
            left: `calc(${((val - min) / (max - min)) * 100}% - 8px)`
          }}
        />
      ))}
    </div>
  )
}