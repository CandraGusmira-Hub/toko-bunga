import { useState } from 'react'
import { isoFromToday } from '../utils/date'
import { chip, field } from '../utils/ui'

// Pilihan tanggal pengiriman: Hari ini / Besok / tanggal lain. `value` berformat YYYY-MM-DD.
export default function DeliveryDate({ value, onChange }) {
  const today = isoFromToday(0)
  const tomorrow = isoFromToday(1)
  const [other, setOther] = useState(false)

  const mode = value === today ? 'today' : value === tomorrow ? 'tomorrow' : (value || other) ? 'other' : ''

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Tanggal pengiriman">
        <button
          type="button"
          aria-pressed={mode === 'today'}
          onClick={() => {
            setOther(false)
            onChange(today)
          }}
          className={chip(mode === 'today')}
        >
          Hari ini
        </button>
        <button
          type="button"
          aria-pressed={mode === 'tomorrow'}
          onClick={() => {
            setOther(false)
            onChange(tomorrow)
          }}
          className={chip(mode === 'tomorrow')}
        >
          Besok
        </button>
        <button
          type="button"
          aria-pressed={mode === 'other'}
          onClick={() => {
            setOther(true)
            if (value === today || value === tomorrow) onChange('')
          }}
          className={chip(mode === 'other')}
        >
          Tanggal lain
        </button>
      </div>
      {mode === 'other' && (
        <input
          type="date"
          aria-label="Pilih tanggal pengiriman"
          min={today}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${field} mt-3`}
        />
      )}
    </div>
  )
}
