import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createFlower } from '../lib/createFlower'

// Ubah warna, jumlah lapisan, posisi, dan ukuran bunga di sini
const SPECS = [
  { color: 0xf43f6e, layers: 4, x: -1.9, y: 0.4, scale: 1.3 },
  { color: 0xfff1f2, layers: 3, x: 1.9, y: 1.0, scale: 1.1 },
  { color: 0xfb923c, layers: 3, x: 0.2, y: -1.3, scale: 1.0 },
  { color: 0xc084fc, layers: 3, x: 2.6, y: -1.8, scale: 0.7 },
]

export default function FlowerScene() {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    camera.position.set(0, 0, 9)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.8))
    const sun = new THREE.DirectionalLight(0xffffff, 0.9)
    sun.position.set(3, 5, 6)
    scene.add(sun)

    const stemMat = new THREE.MeshStandardMaterial({ color: 0x3f8f55 })
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x4ea866 })

    const items = SPECS.map((s, i) => {
      const wrap = new THREE.Group()
      wrap.position.set(s.x, s.y, 0)
      wrap.scale.setScalar(s.scale)

      const tilt = new THREE.Group()
      tilt.rotation.x = 1.0
      tilt.rotation.z = (i - 1.5) * 0.12

      const flower = createFlower(s.color, s.layers)
      tilt.add(flower)

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 2.6, 8), stemMat)
      stem.position.y = -1.4
      tilt.add(stem)

      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 8), leafMat)
      leaf.scale.set(0.9, 0.12, 0.4)
      leaf.position.set(0.35, -1.2, 0)
      leaf.rotation.z = 0.5
      tilt.add(leaf)

      wrap.add(tilt)
      scene.add(wrap)
      return { wrap, flower, baseY: s.y, index: i }
    })

    const mouse = { x: 0, y: 0 }
    const onMove = (e) => {
      const b = el.getBoundingClientRect()
      mouse.x = ((e.clientX - b.left) / b.width - 0.5) * 2
      mouse.y = ((e.clientY - b.top) / b.height - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove)

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    let frame
    let t = 0
    const loop = () => {
      frame = requestAnimationFrame(loop)
      t += 0.016
      items.forEach(({ wrap, flower, baseY, index }) => {
        flower.rotation.y += 0.006 + index * 0.001
        wrap.position.y = baseY + Math.sin(t * 1.1 + index * 1.7) * 0.15
      })
      scene.rotation.y += (mouse.x * 0.35 - scene.rotation.y) * 0.05
      scene.rotation.x += (mouse.y * 0.2 - scene.rotation.x) * 0.05
      renderer.render(scene, camera)
    }
    loop()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) o.material.dispose()
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="w-full h-[380px] sm:h-[480px] lg:h-[560px]" />
}
