export const BRAND = 'Candra.florist'
export const WA_NUMBER = import.meta.env.VITE_WA_NUMBER || '6283110653062'

// Data kontak untuk footer. Ganti dengan data toko Anda.
export const CONTACT = {
  address: 'Jl. Melati No. 12, Kota Anda',
  email: 'halo@botanique.florist',
  hours: 'Setiap hari, 08.00 – 22.00',
  instagram: 'https://instagram.com/botanique.florist',
  tiktok: 'https://tiktok.com/@botanique.florist',
}

// Jam operasional untuk status "Buka / Tutup" di website (format 24 jam, zona waktu toko).
// Samakan dengan CONTACT.hours di atas.
export const STORE_HOURS = { timeZone: 'Asia/Jakarta', open: 8, close: 22 }
