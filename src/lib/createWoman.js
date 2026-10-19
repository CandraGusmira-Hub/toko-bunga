import * as THREE from 'three'
import { createFlower } from './createFlower'

const SKIN = 0xeab08a
const HAIR = 0x2b1a14
const DRESS = 0xfb7185
const UP = new THREE.Vector3(0, 1, 0)
const FORWARD = new THREE.Vector3(0, 0, 1)

const mat = (color, roughness = 0.6) => new THREE.MeshStandardMaterial({ color, roughness })

function ball(radius, material, x, y, z) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 18), material)
  m.position.set(x, y, z)
  return m
}

// Kapsul yang menghubungkan titik a ke titik b (dipakai untuk lengan)
function limb(a, b, radius, material) {
  const dir = new THREE.Vector3().subVectors(b, a)
  const len = dir.length()
  const mesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(radius, Math.max(len - radius * 2, 0.01), 6, 12),
    material,
  )
  mesh.position.copy(a).addScaledVector(dir, 0.5)
  mesh.quaternion.setFromUnitVectors(UP, dir.normalize())
  return mesh
}

function createBouquet() {
  const bouquet = new THREE.Group()

  // kertas pembungkus (kerucut terbuka, ujung di bawah) + pita
  const paperGeo = new THREE.ConeGeometry(0.3, 0.7, 28, 1, true)
  paperGeo.rotateX(Math.PI)
  const paper = new THREE.Mesh(
    paperGeo,
    new THREE.MeshStandardMaterial({ color: 0xfff4e6, roughness: 0.85, side: THREE.DoubleSide }),
  )
  paper.position.y = -0.22
  bouquet.add(paper)

  const ribbon = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.022, 10, 24), mat(0xe11d48, 0.4))
  ribbon.rotation.x = Math.PI / 2
  ribbon.position.y = -0.38
  bouquet.add(ribbon)

  // bunga disusun membentuk kubah
  const colors = [0xf43f6e, 0xfff1f2, 0xfb923c, 0xc084fc, 0xfda4af, 0xfde047, 0xf43f6e]
  const center = new THREE.Vector3(0, 0.1, 0)
  const dirs = [new THREE.Vector3(0, 1, 0)]
  for (let k = 0; k < 6; k++) {
    const a = (k * Math.PI) / 3 + 0.2
    const p = 0.95
    dirs.push(new THREE.Vector3(Math.sin(p) * Math.cos(a), Math.cos(p), Math.sin(p) * Math.sin(a)))
  }
  dirs.forEach((d, i) => {
    const f = createFlower(colors[i], 3)
    f.scale.setScalar(0.3)
    f.position.copy(center).addScaledVector(d, 0.2)
    f.quaternion.setFromUnitVectors(UP, d)
    bouquet.add(f)
  })

  // daun
  const leafMat = mat(0x3f8f55, 0.6)
  for (let k = 0; k < 7; k++) {
    const a = (k * Math.PI * 2) / 7
    const p = 1.35
    const d = new THREE.Vector3(Math.sin(p) * Math.cos(a), Math.cos(p), Math.sin(p) * Math.sin(a))
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), leafMat)
    leaf.scale.set(0.06, 0.02, 0.2)
    leaf.position.copy(center).addScaledVector(d, 0.3)
    leaf.quaternion.setFromUnitVectors(FORWARD, d)
    bouquet.add(leaf)
  }

  // baby breath (bola putih kecil)
  const white = mat(0xffffff, 0.5)
  for (let k = 0; k < 14; k++) {
    const a = k * 2.4
    const p = 0.4 + (k % 5) * 0.2
    const d = new THREE.Vector3(Math.sin(p) * Math.cos(a), Math.cos(p), Math.sin(p) * Math.sin(a))
    const dot = ball(0.024, white, 0, 0, 0)
    dot.position.copy(center).addScaledVector(d, 0.36)
    bouquet.add(dot)
  }

  bouquet.position.set(0, 0.28, 0.42)
  bouquet.rotation.x = 0.45 // miring sedikit ke arah penonton
  return bouquet
}

// Karakter wanita bergaya ilustrasi: gaun, rambut panjang, memegang buket.
export function createWoman() {
  const woman = new THREE.Group()
  const skin = mat(SKIN, 0.7)
  const hairMat = mat(HAIR, 0.5)
  const dressMat = new THREE.MeshStandardMaterial({ color: DRESS, roughness: 0.55, side: THREE.DoubleSide })

  // gaun: kurva halus yang diputar (lathe)
  const profile = new THREE.SplineCurve(
    [
      [0.95, -1.6], [0.9, -1.3], [0.72, -0.8], [0.45, -0.35], [0.28, -0.05],
      [0.26, 0.15], [0.32, 0.38], [0.3, 0.6], [0.16, 0.72], [0.03, 0.75],
    ].map(([r, y]) => new THREE.Vector2(r, y)),
  ).getPoints(60)
  woman.add(new THREE.Mesh(new THREE.LatheGeometry(profile, 48), dressMat))

  // leher
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.22, 16), skin)
  neck.position.y = 0.82
  woman.add(neck)

  // rambut panjang di belakang badan
  const backHair = ball(0.3, hairMat, 0, 0.55, -0.14)
  backHair.scale.set(1, 1.9, 0.8)
  woman.add(backHair)

  // lengan memegang buket
  for (const side of [-1, 1]) {
    const S = new THREE.Vector3(0.3 * side, 0.55, 0)
    const E = new THREE.Vector3(0.38 * side, 0.2, 0.12)
    const H = new THREE.Vector3(0.12 * side, 0.06, 0.36)
    woman.add(limb(S, E, 0.062, skin), limb(E, H, 0.052, skin))
    woman.add(ball(0.085, dressMat, S.x, S.y, S.z))
    woman.add(ball(0.056, skin, E.x, E.y, E.z))
    woman.add(ball(0.068, skin, H.x, H.y, H.z))
  }

  // kepala (grup sendiri supaya bisa menoleh)
  const head = new THREE.Group()
  head.position.y = 1.0
  head.add(ball(0.27, skin, 0, 0, 0))

  const cap = ball(0.29, hairMat, 0, 0.04, -0.06)
  head.add(cap)
  const fringe = ball(0.13, hairMat, 0.08, 0.17, 0.17)
  fringe.scale.set(1.5, 0.6, 0.8)
  fringe.rotation.z = -0.3
  head.add(fringe)
  for (const side of [-1, 1]) {
    const lock = ball(0.16, hairMat, 0.25 * side, -0.12, 0.02)
    lock.scale.set(0.6, 1.3, 0.8)
    head.add(lock)
  }

  const eyeMat = mat(0x2b1a14, 0.3)
  const blush = new THREE.MeshStandardMaterial({ color: 0xff9bb5, roughness: 0.9, transparent: true, opacity: 0.55 })
  for (const side of [-1, 1]) {
    const eye = ball(0.03, eyeMat, 0.095 * side, 0.03, 0.25)
    eye.scale.z = 0.5
    head.add(eye)
    const cheek = ball(0.045, blush, 0.15 * side, -0.05, 0.215)
    cheek.scale.z = 0.3
    head.add(cheek)
  }
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 8, 20, Math.PI), mat(0xc2410c, 0.5))
  smile.rotation.z = Math.PI
  smile.position.set(0, -0.09, 0.255)
  head.add(smile)

  // bunga kecil di rambut
  const hairFlower = createFlower(0xffffff, 2)
  hairFlower.scale.setScalar(0.13)
  const fd = new THREE.Vector3(0.7, 0.45, 0.55).normalize()
  hairFlower.position.copy(fd).multiplyScalar(0.28)
  hairFlower.quaternion.setFromUnitVectors(UP, fd)
  head.add(hairFlower)

  woman.add(head)

  const bouquet = createBouquet()
  woman.add(bouquet)

  return { woman, head, bouquet }
}
