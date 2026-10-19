import * as THREE from 'three'

// Geometri kelopak dipakai bersama oleh semua bunga (hemat memori)
const petalGeometry = new THREE.SphereGeometry(0.5, 14, 10)

// Membuat satu bunga prosedural: kelopak berlapis + putik di tengah.
// Bunga "membuka" ke arah +Y. color: hex, layers: jumlah lapisan kelopak.
export function createFlower(color, layers = 3) {
  const group = new THREE.Group()
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.55,
    side: THREE.DoubleSide,
  })

  for (let l = 0; l < layers; l++) {
    const count = 6 + l * 2
    // lapisan dalam menguncup (tilt besar), lapisan luar membuka (tilt kecil)
    const tilt = 1.25 - l * (0.95 / layers)

    for (let i = 0; i < count; i++) {
      const pivotY = new THREE.Group()
      pivotY.rotation.y = (i / count) * Math.PI * 2 + l * 0.5

      const pivotX = new THREE.Group()
      pivotX.rotation.x = -tilt
      pivotX.position.y = l * 0.03

      const petal = new THREE.Mesh(petalGeometry, material)
      petal.scale.set(0.5 + l * 0.04, 0.1, 0.9 + l * 0.12)
      petal.position.z = 0.35 + l * 0.12

      pivotX.add(petal)
      pivotY.add(pivotX)
      group.add(pivotY)
    }
  }

  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0xf5c842 }),
  )
  center.position.y = 0.08
  group.add(center)

  return group
}
