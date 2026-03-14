import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, Box, Torus, Octahedron, Environment } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function TechOrb({ position, color, speed = 1, distort = 0.4, size = 0.6 }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2
    }
  })

  return (
    <Float speed={speed * 1.5} rotationIntensity={0.5} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={speed * 2}
          roughness={0.1}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  )
}

function FloatingTechCard({ position, rotation, color, label }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3 + position[1]) * 0.05
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} rotation={rotation}>
        <boxGeometry args={[1.2, 0.8, 0.05]} />
        <meshStandardMaterial
          color="#111111"
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.15}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Glowing edge */}
      <mesh position={position} rotation={rotation}>
        <boxGeometry args={[1.22, 0.82, 0.01]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </Float>
  )
}

function CentralShape() {
  const meshRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1
    }
    if (glowRef.current) {
      glowRef.current.rotation.x = -state.clock.elapsedTime * 0.1
      glowRef.current.rotation.y = -state.clock.elapsedTime * 0.15
    }
  })

  return (
    <group>
      {/* Main icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.3, 1]} />
        <MeshDistortMaterial
          color="#ffffff"
          distort={0.25}
          speed={1.5}
          roughness={0}
          metalness={1}
          emissive="#ffffff"
          emissiveIntensity={0.1}
          wireframe
        />
      </mesh>
      {/* Inner glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <MeshDistortMaterial
          color="#6366f1"
          distort={0.5}
          speed={3}
          roughness={0.1}
          metalness={0.9}
          emissive="#6366f1"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}

function ParticleField() {
  const pointsRef = useRef()
  const count = 200

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15
    }
    return pos
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

function OrbitingRing({ radius = 2.5, color = '#00FFFF', speed = 0.3 }) {
  const ringRef = useRef()

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * speed) * 0.3
      ringRef.current.rotation.z = state.clock.elapsedTime * speed
    }
  })

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, 0.015, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  )
}

export default function GrindTechVisual() {
  return (
    <div className="relative w-full h-full">
      {/* Ambient glow behind canvas */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]" />
        <div className="absolute w-60 h-60 bg-cyan-500/15 rounded-full blur-[80px] translate-x-10 -translate-y-10" />
      </div>

      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -5, 5]} intensity={0.5} color="#6366f1" />
        <pointLight position={[5, -10, -5]} intensity={0.3} color="#00FFFF" />

        {/* Central 3D shape */}
        <CentralShape />

        {/* Orbiting rings */}
        <OrbitingRing radius={2.2} color="#6366f1" speed={0.25} />
        <OrbitingRing radius={2.8} color="#00FFFF" speed={0.15} />
        <OrbitingRing radius={3.4} color="#ffffff" speed={0.1} />

        {/* Tech orbs representing different technologies */}
        <TechOrb position={[2.5, 1.2, 0.5]} color="#6cc24a" speed={0.8} size={0.35} distort={0.3} />
        <TechOrb position={[-2.2, -1, 1]} color="#00FFFF" speed={1.2} size={0.3} distort={0.4} />
        <TechOrb position={[1.5, -2, -0.5]} color="#ED8B00" speed={0.6} size={0.28} distort={0.35} />
        <TechOrb position={[-1.8, 1.8, -1]} color="#F7DF1E" speed={1} size={0.32} distort={0.3} />
        <TechOrb position={[0.5, 2.5, 0.8]} color="#3178C6" speed={0.9} size={0.25} distort={0.4} />
        <TechOrb position={[-2.8, 0.3, -0.5]} color="#3776AB" speed={0.7} size={0.3} distort={0.35} />

        {/* Floating tech cards */}
        <FloatingTechCard position={[3, 0.5, -1]} rotation={[0, -0.3, 0.05]} color="#6cc24a" label="Node.js" />
        <FloatingTechCard position={[-3, -0.8, -0.5]} rotation={[0, 0.3, -0.05]} color="#00FFFF" label="React" />
        <FloatingTechCard position={[2, -2, -1.5]} rotation={[0.1, -0.2, 0]} color="#ED8B00" label="Java" />

        {/* Particle field */}
        <ParticleField />
      </Canvas>
    </div>
  )
}
