import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { createWoman } from '../lib/createWoman'
import { createHeart } from '../lib/createHeart'
import { Sprig } from './Icons'

const HEART_COLORS = [0xfb7185, 0xf43f5e, 0xfda4af, 0xe11d48, 0xfecdd3]
// Posisi dan ukuran hati kecil yang melayang naik
const HEARTS = [
  { x: -2.0, z: 0.8, size: 0.22 },
  { x: -1.5, z: -0.6, size: 0.16 },
  { x: 1.6, z: 0.9, size: 0.2 },
  { x: 2.0, z: -0.4, size: 0.26 },
  { x: -0.9, z: 1.2, size: 0.13 },
  { x: 0.9, z: 1.4, size: 0.12 },
  { x: -2.1, z: -0.8, size: 0.24 },
  { x: 2.1, z: 0.6, size: 0.14 },
  { x: 0.2, z: -1.2, size: 0.18 },
]
const Y_MIN = -2.4
const Y_MAX = 2.6
const PETAL_COUNT = 70

function glowTexture(inner, outer) {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 128
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, inner)
  grad.addColorStop(1, outer)
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export default function HeroScene() {
  const containerRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    } catch {
      setFailed(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.display = 'block'
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.lookAt(0, 0, 0)

    // pencahayaan lembut: langit pink + cahaya utama + rim light
    scene.add(new THREE.HemisphereLight(0xfff0f5, 0xffd6e0, 1.6))
    const key = new THREE.DirectionalLight(0xffffff, 2.2)
    key.position.set(3, 4, 5)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xff9bb5, 1.4)
    rim.position.set(-4, 2, -3)
    scene.add(rim)

    // karakter wanita
    const { woman, head, bouquet } = createWoman()
    woman.position.y = 0.15
    scene.add(woman)

    // bayangan lembut di bawah karakter
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 3),
      new THREE.MeshBasicMaterial({
        map: glowTexture('rgba(190,24,93,0.28)', 'rgba(190,24,93,0)'),
        transparent: true,
        depthWrite: false,
      }),
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = -1.44
    scene.add(shadow)

    // hati besar berdetak di belakang
    const big = createHeart(0xfda4af)
    big.position.set(1.35, 0.95, -1.2)
    big.rotation.y = -0.4
    scene.add(big)

    // hati kecil melayang
    const hearts = HEARTS.map((h, i) => {
      const mesh = createHeart(HEART_COLORS[i % HEART_COLORS.length])
      const item = {
        mesh,
        x: h.x,
        z: h.z,
        size: h.size,
        y: Y_MIN + (i / HEARTS.length) * (Y_MAX - Y_MIN),
        speed: 0.28 + (i % 4) * 0.08,
        phase: i * 1.3,
      }
      mesh.position.set(h.x, item.y, h.z)
      scene.add(mesh)
      return item
    })

    // kelopak/kilau kecil yang jatuh pelan
    const pPos = new Float32Array(PETAL_COUNT * 3)
    for (let i = 0; i < PETAL_COUNT; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 6
      pPos[i * 3 + 1] = Y_MIN + Math.random() * (Y_MAX - Y_MIN)
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 3
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const points = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        size: 0.14,
        color: 0xfda4af,
        map: glowTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)'),
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      }),
    )
    scene.add(points)

    // interaksi mouse (dihaluskan)
    const mouse = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }
    const onMove = (e) => {
      const b = el.getBoundingClientRect()
      mouse.x = Math.max(-1, Math.min(1, ((e.clientX - b.left) / b.width - 0.5) * 2))
      mouse.y = Math.max(-1, Math.min(1, ((e.clientY - b.top) / b.height - 0.5) * 2))
    }
    window.addEventListener('pointermove', onMove)

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.position.set(0, 0.2, 7.2 * Math.max(1, 1.05 / camera.aspect))
      camera.updateProjectionMatrix()
      camera.lookAt(0, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    // hemat baterai: berhenti merender saat tidak terlihat
    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(el)

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const speed = calm ? 0.3 : 1

    let frame
    let prev = performance.now()
    let t = 0
    const loop = (now) => {
      frame = requestAnimationFrame(loop)
      const raw = Math.min((now - prev) / 1000, 0.05)
      prev = now
      if (!visible) return
      const dt = raw * speed
      t += dt

      cur.x += (mouse.x - cur.x) * 0.06
      cur.y += (mouse.y - cur.y) * 0.06

      // karakter: napas, bergoyang, menoleh mengikuti kursor
      woman.rotation.y = Math.sin(t * 0.6) * 0.1 + cur.x * 0.3
      woman.position.y = 0.15 + Math.sin(t * 1.4) * 0.02
      head.rotation.y = cur.x * 0.25 + Math.sin(t * 0.9) * 0.05
      head.rotation.x = cur.y * 0.12
      head.rotation.z = Math.sin(t * 0.7) * 0.04
      bouquet.position.y = 0.28 + Math.sin(t * 1.6) * 0.015
      bouquet.rotation.z = Math.sin(t * 0.9) * 0.03

      // hati besar berdetak
      const beat = 1 + 0.07 * Math.pow(Math.max(0, Math.sin(t * 2.4)), 6)
      big.scale.setScalar(0.8 * beat)
      big.rotation.y = -0.4 + Math.sin(t * 0.5) * 0.25

      // hati kecil naik, bergoyang, memudar di ujung
      hearts.forEach((h) => {
        h.y += h.speed * dt
        if (h.y > Y_MAX) h.y = Y_MIN
        const fade = Math.min(1, (h.y - Y_MIN) / 0.8, (Y_MAX - h.y) / 0.8)
        h.mesh.scale.setScalar(h.size * Math.max(fade, 0.001))
        h.mesh.position.set(h.x + Math.sin(t * 0.7 + h.phase) * 0.18, h.y, h.z)
        h.mesh.rotation.y = Math.sin(t * 0.8 + h.phase) * 0.6
        h.mesh.rotation.z = Math.sin(t * 0.6 + h.phase) * 0.15
      })

      // kelopak jatuh
      for (let i = 0; i < PETAL_COUNT; i++) {
        pPos[i * 3] += Math.sin(t + i) * dt * 0.1
        pPos[i * 3 + 1] -= dt * 0.15 * (1 + (i % 3) * 0.4)
        if (pPos[i * 3 + 1] < Y_MIN) pPos[i * 3 + 1] = Y_MAX
      }
      pGeo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      ro.disconnect()
      io.disconnect()
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          if (o.material.map) o.material.map.dispose()
          o.material.dispose()
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      role="img"
      aria-label="Ilustrasi 3D wanita memegang buket bunga dikelilingi hati"
      className="relative mx-auto aspect-[5/6] w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[460px]"
    >
      {/* bingkai lengkung ala jendela rumah kaca */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-t-[999px] rounded-b-[2rem] bg-gradient-to-b from-petal via-[#FDE2E7] to-[#FFF3EC]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-3 rounded-t-[999px] rounded-b-[1.5rem] border border-white/80"
      />
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center text-8xl">💐</div>
      ) : (
        <div ref={containerRef} className="absolute inset-0" />
      )}
      {/* dedaunan di dasar bingkai */}
      <Sprig className="pointer-events-none absolute -bottom-3 -left-5 h-36 w-auto text-leaf sm:-left-8 sm:h-44" />
      <Sprig flip className="pointer-events-none absolute -bottom-3 -right-5 h-32 w-auto text-leaf/90 sm:-right-8 sm:h-40" />
    </div>
  )
}
