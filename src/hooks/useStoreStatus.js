import { useEffect, useState } from 'react'
import { STORE_HOURS } from '../config'

const pad = (h) => `${String(h).padStart(2, '0')}.00`

function minutesNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: STORE_HOURS.timeZone,
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (type) => Number(parts.find((p) => p.type === type)?.value ?? 0)
  return get('hour') * 60 + get('minute')
}

function compute() {
  const now = minutesNow()
  const isOpen = now >= STORE_HOURS.open * 60 && now < STORE_HOURS.close * 60
  return {
    open: isOpen,
    label: isOpen
      ? `Buka sampai ${pad(STORE_HOURS.close)}`
      : `Tutup , buka lagi pukul ${pad(STORE_HOURS.open)}`,
  }
}

// Status buka/tutup toko, diperbarui tiap menit
export default function useStoreStatus() {
  const [status, setStatus] = useState(compute)
  useEffect(() => {
    const id = setInterval(() => setStatus(compute()), 60_000)
    return () => clearInterval(id)
  }, [])
  return status
}
