import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Bunga + tangkai 2D yang digambar dengan Three.js (kamera orthographic, tanpa 3D).
// Ruang gambarnya sama dengan frame SVG di CustomBouquet: 300x320, sumbu y ke bawah.
const W = 300
const H = 320
const CENTER = [150, 120] // pusat susunan bunga
const JOIN = [150, 215] // titik temu tangkai, tersembunyi di balik frame depan
const STEM = '#3f8f5f' // warna tangkai: ganti sesuai warna "leaf" di tema

// Posisi tangkai (px dari pusat): 1 di tengah, lalu cincin berisi 6 dan 12
const ring = (n, r, offset = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = offset + (i / n) * 2 * Math.PI - Math.PI / 2
    return [Math.cos(a) * r, Math.sin(a) * r]
  })
const SLOTS = [[0, 0], ...ring(6, 54), ...ring(12, 104, Math.PI / 12)]
export const MAX_STEMS = SLOTS.length

// ---------- bahan dasar ----------
const disc = new THREE.CircleGeometry(1, 32) // semua kelopak = lingkaran yang di-scale jadi elips
const bar = new THREE.PlaneGeometry(1, 1)
const mats = new Map()
const mat = (color) => {
  if (!mats.has(color))
    mats.set(color, new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, depthTest: false, depthWrite: false }))
  return mats.get(color)
}

// Urutan gambar ditentukan renderOrder (tanpa depth), jadi yang dibuat belakangan ada di atas
let order = 0
function shape(group, geo, color, x, y, sx, sy, rot = 0) {
  const m = new THREE.Mesh(geo, mat(color))
  m.position.set(x, y, 0)
  m.scale.set(sx, sy, 1)
  m.rotation.z = rot
  m.renderOrder = order++
  group.add(m)
}
const dot = (g, x, y, r, color) => shape(g, disc, color, x, y, r, r)

// n kelopak elips melingkar, masing-masing dengan garis tepi
function petals(g, n, dist, rx, ry, fill, stroke) {
  for (let i = 0; i < n; i++) {
    const a = (i * 2 * Math.PI) / n
    const x = -Math.sin(a) * dist
    const y = Math.cos(a) * dist
    shape(g, disc, stroke, x, y, rx + 0.8, ry + 0.8, a)
    shape(g, disc, fill, x, y, rx, ry, a)
  }
}

// ---------- gambar tiap jenis bunga (titik (0,0) = pusat bunga, y ke atas) ----------
const lily = (fill, stroke, stamen, core) => (g) => {
  petals(g, 6, 12, 6, 13, fill, stroke)
  for (const a of [0, 2.1, -2.1]) shape(g, bar, stamen, -Math.sin(a) * 5, Math.cos(a) * 5, 1.5, 10, a)
  dot(g, 0, 0, 3.5, core)
}

const BLOOMS = {
  mawar: (g) => {
    dot(g, 0, 0, 19, '#c8102e')
    dot(g, 0, 0, 13, '#a50d27')
    dot(g, 0, 0, 8, '#c8102e')
    dot(g, 0, 0, 4, '#7a0a1d')
  },
  sunflower: (g) => {
    petals(g, 14, 15, 4, 9, '#fbbf24', '#d97706')
    dot(g, 0, 0, 10, '#5b3a1a')
    dot(g, 0, 0, 5, '#3b2410')
  },
  lilyPink: lily('#f9a8d4', '#db2777', '#9d174d', '#be185d'),
  lilyPutih: lily('#ffffff', '#d6c4d0', '#d4a017', '#fde68a'),
  peony: (g) => {
    petals(g, 9, 13, 9, 9, '#f9a8d4', '#ec4899')
    petals(g, 6, 7, 7, 7, '#f472b6', '#db2777')
    dot(g, 0, 0, 5, '#be185d')
  },
  lavender: (g) => {
    for (const y of [20, 13, 6, -1, -8, -15]) {
      shape(g, disc, '#8b5cf6', -4, y, 4, 3.4)
      shape(g, disc, '#a78bfa', 4, y - 3, 4, 3.4)
    }
  },
  baby: (g) => {
    for (const [x, y] of [[-12, 8], [0, 14], [12, 8], [-6, -2], [7, -3], [-15, -8], [0, -12], [14, -10]]) {
      dot(g, x, y, 5.3, '#d1d5db')
      dot(g, x, y, 4.5, '#ffffff')
    }
  },
  gerbera: (g) => {
    petals(g, 16, 14, 3.2, 9, '#fb7185', '#e11d48')
    dot(g, 0, 0, 7, '#7c2d12')
    dot(g, 0, 0, 3, '#fbbf24')
  },
  umum: (g) => {
    petals(g, 5, 10, 7, 10, '#f9a8d4', '#db2777')
    dot(g, 0, 0, 5, '#fde68a')
  },
}

// Pilih gambar dari nama produk, jadi data produk tidak perlu diubah
function bloomOf(name) {
  const n = name.toLowerCase()
  if (n.includes('mawar') || n.includes('rose')) return BLOOMS.mawar
  if (n.includes('sun')) return BLOOMS.sunflower
  if (n.includes('lily')) return n.includes('putih') || n.includes('white') ? BLOOMS.lilyPutih : BLOOMS.lilyPink
  if (n.includes('peony')) return BLOOMS.peony
  if (n.includes('lavender')) return BLOOMS.lavender
  if (n.includes('baby')) return BLOOMS.baby
  if (n.includes('gerbera')) return BLOOMS.gerbera
  return BLOOMS.umum
}

// Tangkai melengkung dari titik temu ke bunga
function stemGeometry(x, y) {
  const p = (px, py) => new THREE.Vector3(px, H - py, 0)
  const curve = new THREE.QuadraticBezierCurve3(
    p(JOIN[0], JOIN[1]),
    p(150 + (x - 150) * 0.2, (JOIN[1] + y) / 2),
    p(x, y),
  )
  return new THREE.TubeGeometry(curve, 12, 1.5, 6)
}

// names = nama bunga yang ditampilkan, berurutan (maksimal MAX_STEMS)
export default function FlowerCanvas({ names }) {
  const canvas = useRef(null)
  const gl = useRef(null)
  const sig = names.join('|')

  // Siapkan renderer sekali
  useEffect(() => {
    try {
      const renderer = new THREE.WebGLRenderer({ canvas: canvas.current, alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(W, H, false)
      const scene = new THREE.Scene()
      const root = new THREE.Group()
      scene.add(root)
      gl.current = { renderer, scene, root, camera: new THREE.OrthographicCamera(0, W, H, 0, -10, 10), seen: new Set(), geos: [], raf: 0 }
    } catch {
      gl.current = null // WebGL tidak tersedia: pratinjau kosong, halaman tetap jalan
    }
    return () => {
      const s = gl.current
      if (!s) return
      cancelAnimationFrame(s.raf)
      s.geos.forEach((g) => g.dispose())
      s.renderer.dispose()
      gl.current = null
    }
  }, [])

  // Susun ulang bunga setiap daftar berubah; hanya bunga baru yang dianimasikan
  useEffect(() => {
    const s = gl.current
    if (!s) return
    cancelAnimationFrame(s.raf)
    s.geos.forEach((g) => g.dispose())
    s.geos = []
    s.root.clear()
    order = 0

    const flowers = sig ? sig.split('|') : []
    const pos = flowers.map((_, i) => [CENTER[0] + SLOTS[i][0] * 0.8, CENTER[1] + SLOTS[i][1] * 0.8])

    pos.forEach(([x, y]) => {
      const geo = stemGeometry(x, y)
      const m = new THREE.Mesh(geo, mat(STEM))
      m.renderOrder = order++
      s.geos.push(geo)
      s.root.add(m)
    })

    // dari luar ke tengah supaya bunga tengah paling atas
    const seen = new Set()
    const pops = []
    for (let i = flowers.length - 1; i >= 0; i--) {
      const g = new THREE.Group()
      g.position.set(pos[i][0], H - pos[i][1], 0)
      bloomOf(flowers[i])(g)
      s.root.add(g)
      const key = `${i}-${flowers[i]}`
      seen.add(key)
      if (!s.seen.has(key)) pops.push(g)
    }
    s.seen = seen

    const draw = () => s.renderer.render(s.scene, s.camera)
    if (!pops.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return draw()

    const t0 = performance.now()
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / 350)
      const e = 1 + 2.70158 * (k - 1) ** 3 + 1.70158 * (k - 1) ** 2 // easeOutBack
      pops.forEach((g) => g.scale.setScalar(0.3 + 0.7 * e))
      draw()
      if (k < 1) s.raf = requestAnimationFrame(tick)
    }
    s.raf = requestAnimationFrame(tick)
  }, [sig])

  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-contain" />
}
