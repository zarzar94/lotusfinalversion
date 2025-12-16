import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, Sphere, MeshDistortMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useGamification, BRAIN_REGIONS } from '../../context/GamificationContext';
import { brandCyan, brandPurple, brandPink, brandPurpleDark } from '../styles';
import { ensureAudio, safeCloseAudio } from '../games/audio';

// Region frequencies for audio feedback
const REGION_FREQUENCIES: Record<string, number> = {
  auditory_cortex: 440,
  temporal_lobe: 523.25,
  brainstem: 329.63,
  thalamus: 392,
  prefrontal: 587.33,
  cerebellum: 493.88,
};

// Brain region positions in 3D space (normalized)
const REGION_POSITIONS: Record<string, [number, number, number]> = {
  auditory_cortex: [-1.2, 0.2, 0.5],
  temporal_lobe: [-1.0, -0.3, 0.8],
  brainstem: [0, -1.2, -0.3],
  thalamus: [0, 0.1, 0],
  prefrontal: [0, 0.6, 1.2],
  cerebellum: [0, -0.8, -0.8],
};

// Neural pathway connections
const NEURAL_PATHWAYS = [
  { from: 'auditory_cortex', to: 'thalamus', color: brandCyan },
  { from: 'thalamus', to: 'temporal_lobe', color: brandPurple },
  { from: 'temporal_lobe', to: 'prefrontal', color: brandPink },
  { from: 'brainstem', to: 'thalamus', color: brandCyan },
  { from: 'thalamus', to: 'cerebellum', color: brandPurpleDark },
  { from: 'prefrontal', to: 'thalamus', color: brandPurple },
];

interface NeuralPathwayProps {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  active: boolean;
  pulseOffset: number;
}

function NeuralPathway({ from, to, color, active, pulseOffset }: NeuralPathwayProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 30;

  const { positions, initialPositions } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const initPos: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const x = from[0] + (to[0] - from[0]) * t;
      const y = from[1] + (to[1] - from[1]) * t;
      const z = from[2] + (to[2] - from[2]) * t;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      initPos.push(t);
    }

    return { positions: pos, initialPositions: initPos };
  }, [from, to]);

  useFrame((state) => {
    if (!particlesRef.current || !active) return;
    const posAttr = particlesRef.current.geometry.attributes.position;
    if (!posAttr || !('array' in posAttr)) return;
    const positions = posAttr.array as Float32Array;
    const time = state.clock.elapsedTime + pulseOffset;

    for (let i = 0; i < particleCount; i++) {
      const t = (initialPositions[i] + time * 0.3) % 1;
      const x = from[0] + (to[0] - from[0]) * t;
      const y = from[1] + (to[1] - from[1]) * t;
      const z = from[2] + (to[2] - from[2]) * t;

      // Add subtle wave motion
      positions[i * 3] = x + Math.sin(time * 2 + i * 0.5) * 0.02;
      positions[i * 3 + 1] = y + Math.cos(time * 2 + i * 0.3) * 0.02;
      positions[i * 3 + 2] = z;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={active ? 0.08 : 0.03}
        color={color}
        transparent
        opacity={active ? 0.9 : 0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface BrainRegionNodeProps {
  position: [number, number, number];
  region: typeof BRAIN_REGIONS[number];
  isExplored: boolean;
  isHovered: boolean;
  isPulsing: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

function BrainRegionNode({ position, region, isExplored, isHovered, isPulsing, onClick, onHover }: BrainRegionNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const baseScale = isHovered ? 1.3 : isExplored ? 1.1 : 1;
      const pulseScale = isPulsing ? 1 + Math.sin(state.clock.elapsedTime * 12) * 0.12 : 1;
      const scale = baseScale * pulseScale;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.12);
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      const baseOpacity = isPulsing ? 0.45 : 0.3;
      mat.opacity = baseOpacity + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const color = isExplored ? brandCyan : isHovered ? brandPurple : brandPurpleDark;

  return (
    <group position={position}>
      {/* Glow effect */}
      <Sphere ref={glowRef} args={[0.25, 16, 16]}>
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </Sphere>

      {/* Main node */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <Sphere
          ref={meshRef}
          args={[0.15, 32, 32]}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onPointerEnter={() => onHover(true)}
          onPointerLeave={() => onHover(false)}
        >
          <MeshDistortMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isHovered ? 0.8 : isExplored ? 0.5 : 0.2}
            distort={0.2}
            speed={2}
            roughness={0.2}
          />
        </Sphere>
      </Float>

      {/* Label */}
      {isHovered && (
        <Text
          position={[0, 0.4, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {region.nameAr}
        </Text>
      )}
    </group>
  );
}

function BrainCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh ref={meshRef}>
        {/* Brain hemisphere shape using icosahedron */}
        <icosahedronGeometry args={[1.5, 2]} />
        <MeshDistortMaterial
          color={brandPurpleDark}
          emissive={brandPurple}
          emissiveIntensity={0.15}
          distort={0.4}
          speed={1.5}
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>
    </Float>
  );
}

interface ParticleFieldProps {
  count?: number;
}

function ParticleField({ count = 500 }: ParticleFieldProps) {
  const particlesRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 1.5;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color={brandCyan}
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Connection line component
function ConnectionLine({ from, to, color, active }: { from: [number, number, number]; to: [number, number, number]; color: string; active: boolean }) {
  const points = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...from),
      new THREE.Vector3(
        (from[0] + to[0]) / 2,
        (from[1] + to[1]) / 2 + 0.3,
        (from[2] + to[2]) / 2
      ),
      new THREE.Vector3(...to)
    );
    return curve.getPoints(20);
  }, [from, to]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={active ? 3 : 1}
      transparent
      opacity={active ? 0.8 : 0.2}
      dashed={!active}
      dashSize={0.1}
      gapSize={0.05}
    />
  );
}

function BrainScene() {
  const { brainRegions, exploreBrainRegion } = useGamification();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [activePathways, setActivePathways] = useState<Set<string>>(new Set());
  const [pulseRegion, setPulseRegion] = useState<string | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    return () => {
      for (const timeoutId of timeoutsRef.current) clearTimeout(timeoutId);
      timeoutsRef.current = [];
      void safeCloseAudio(audioRef);
    };
  }, []);

  const playRegionSound = useCallback((frequency: number) => {
    try {
      const audio = ensureAudio(audioRef);
      if (audio.state === 'suspended') void audio.resume().catch(() => {});

      const osc = audio.createOscillator();
      const gain = audio.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, audio.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, audio.currentTime + 0.15);

      // Envelope to avoid clicks
      gain.gain.setValueAtTime(0.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, audio.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audio.destination);

      const stopAt = audio.currentTime + 0.4;
      osc.start(audio.currentTime);
      osc.stop(stopAt);
      osc.onended = () => {
        try {
          osc.disconnect();
        } catch {
          // ignore
        }
        try {
          gain.disconnect();
        } catch {
          // ignore
        }
      };
    } catch {
      // Audio unavailable
    }
  }, []);

  const handleRegionClick = useCallback((regionId: string) => {
    exploreBrainRegion(regionId);

    // Play audio feedback
    playRegionSound(REGION_FREQUENCIES[regionId] || 440);

    // Visual pulse effect
    setPulseRegion(regionId);
    timeoutsRef.current.push(setTimeout(() => setPulseRegion(null), 500));

    // Activate connected pathways
    const connectedPathways = NEURAL_PATHWAYS.filter(
      p => p.from === regionId || p.to === regionId
    ).map(p => `${p.from}-${p.to}`);

    setActivePathways(new Set(connectedPathways));

    // Deactivate after animation
    timeoutsRef.current.push(setTimeout(() => setActivePathways(new Set()), 3000));
  }, [exploreBrainRegion, playRegionSound]);

  const handleRegionHover = useCallback((regionId: string, hovered: boolean) => {
    setHoveredRegion(hovered ? regionId : null);
  }, []);

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color={brandCyan} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color={brandPink} />

      {/* Brain core visualization */}
      <BrainCore />

      {/* Particle field */}
      <ParticleField />

      {/* Brain regions */}
      {BRAIN_REGIONS.map((region) => {
        const position = REGION_POSITIONS[region.id];
        const regionData = brainRegions.find(r => r.id === region.id);
        const isExplored = regionData?.explored ?? false;

        return (
          <BrainRegionNode
            key={region.id}
            position={position}
            region={region}
            isExplored={isExplored}
            isHovered={hoveredRegion === region.id}
            isPulsing={pulseRegion === region.id}
            onClick={() => handleRegionClick(region.id)}
            onHover={(h) => handleRegionHover(region.id, h)}
          />
        );
      })}

      {/* Connection lines */}
      {NEURAL_PATHWAYS.map((pathway) => (
        <ConnectionLine
          key={`line-${pathway.from}-${pathway.to}`}
          from={REGION_POSITIONS[pathway.from]}
          to={REGION_POSITIONS[pathway.to]}
          color={pathway.color}
          active={activePathways.has(`${pathway.from}-${pathway.to}`)}
        />
      ))}

      {/* Neural pathways (particles) */}
      {NEURAL_PATHWAYS.map((pathway, idx) => (
        <NeuralPathway
          key={`${pathway.from}-${pathway.to}`}
          from={REGION_POSITIONS[pathway.from]}
          to={REGION_POSITIONS[pathway.to]}
          color={pathway.color}
          active={activePathways.has(`${pathway.from}-${pathway.to}`)}
          pulseOffset={idx * 0.5}
        />
      ))}

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

interface Brain3DProps {
  height?: number | string;
}

export default function Brain3D({ height = 500 }: Brain3DProps) {
  const { brainRegions, state } = useGamification();
  const exploredCount = brainRegions.filter(r => r.explored).length;

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <BrainScene />
      </Canvas>

      {/* Overlay UI */}
      <div style={{
        position: 'absolute',
        top: 16,
        right: 16,
        background: 'rgba(11,15,28,0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(143,211,204,0.3)',
        borderRadius: 14,
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 800 }}>
          BRAIN EXPLORER
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>🧠</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: brandCyan }}>
              {exploredCount}/{BRAIN_REGIONS.length}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              المناطق المستكشفة
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 4,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${(exploredCount / BRAIN_REGIONS.length) * 100}%`,
            background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(11,15,28,0.75)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: '8px 16px',
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
      }}>
        اسحب للتدوير • انقر على المناطق المضيئة لاستكشافها
      </div>
    </div>
  );
}
