import * as THREE from 'three'

let heartGeometry

// Bentuk hati 3D (extrude + bevel) supaya tepinya halus dan memantulkan cahaya
function getHeartGeometry() {
  if (heartGeometry) return heartGeometry

  const s = new THREE.Shape()
  s.moveTo(0.25, 0.25)
  s.bezierCurveTo(0.25, 0.25, 0.2, 0, 0, 0)
  s.bezierCurveTo(-0.3, 0, -0.3, 0.35, -0.3, 0.35)
  s.bezierCurveTo(-0.3, 0.55, -0.1, 0.77, 0.25, 0.95)
  s.bezierCurveTo(0.6, 0.77, 0.8, 0.55, 0.8, 0.35)
  s.bezierCurveTo(0.8, 0.35, 0.8, 0, 0.5, 0)
  s.bezierCurveTo(0.35, 0, 0.25, 0.25, 0.25, 0.25)

  heartGeometry = new THREE.ExtrudeGeometry(s, {
    depth: 0.25,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.08,
    bevelThickness: 0.1,
    curveSegments: 28,
  })
  heartGeometry.center()
  heartGeometry.rotateZ(Math.PI) // bentuk asli terbalik di sumbu Y three.js
  return heartGeometry
}

export function createHeart(color) {
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.3,
    metalness: 0.05,
    emissive: color,
    emissiveIntensity: 0.18,
  })
  return new THREE.Mesh(getHeartGeometry(), material)
}
