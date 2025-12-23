import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { brandCyan, brandPurple, brandPink, modalScale } from '../styles';

// Treatment area bubbles positioned on anatomical brain regions
const BRAIN_BUBBLES = [
  { id: 'auditory', label: 'السمع', labelEn: 'Auditory', color: '#FF6B35', position: [1.8, -0.3, 0.5] as [number, number, number], size: 0.28 },
  { id: 'language', label: 'اللغة', labelEn: 'Language', color: '#00A8CC', position: [1.5, 0.5, 1.3] as [number, number, number], size: 0.28 },
  { id: 'music', label: 'الموسيقى', labelEn: 'Music', color: '#C41E3A', position: [-1.7, 0.0, 0.7] as [number, number, number], size: 0.24 },
  { id: 'attention', label: 'التركيز', labelEn: 'Attention', color: '#1E40AF', position: [0, 1.4, 1.5] as [number, number, number], size: 0.30 },
  { id: 'sensory', label: 'الحسي', labelEn: 'Sensory', color: '#166534', position: [1.0, 1.5, -0.2] as [number, number, number], size: 0.28 },
  { id: 'balance', label: 'التوازن', labelEn: 'Balance', color: '#15803D', position: [0, -1.3, -1.7] as [number, number, number], size: 0.30 },
  { id: 'memory', label: 'الذاكرة', labelEn: 'Memory', color: '#EA580C', position: [-1.2, -0.5, 0.1] as [number, number, number], size: 0.28 },
  { id: 'learning', label: 'التعلم', labelEn: 'Learning', color: '#1E3A5F', position: [-0.7, 1.0, 1.7] as [number, number, number], size: 0.26 },
  { id: 'behavior', label: 'السلوك', labelEn: 'Behavior', color: '#9333EA', position: [0.7, 0.7, 1.9] as [number, number, number], size: 0.28 },
  { id: 'wellbeing', label: 'الرفاهية', labelEn: 'Well-Being', color: '#2563EB', position: [-1.0, 1.2, 0.7] as [number, number, number], size: 0.28 },
];

// Neural connections between bubbles
const NEURAL_CONNECTIONS = [
  { from: 0, to: 3 }, { from: 1, to: 3 }, { from: 2, to: 6 },
  { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 6, to: 8 },
  { from: 7, to: 3 }, { from: 8, to: 7 }, { from: 9, to: 5 },
  { from: 0, to: 2 }, { from: 1, to: 4 }, { from: 3, to: 7 },
  { from: 5, to: 9 }, { from: 6, to: 7 }, { from: 4, to: 9 },
];

// Sound effect for bubble interaction
const playBubbleSound = (frequency: number) => {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.3, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch { /* Audio unavailable */ }
};

// Create realistic brain geometry with hemispheres, sulci, and gyri
function createBrainGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];
  const normals: number[] = [];

  const widthSegments = 64;
  const heightSegments = 48;

  // Create brain-shaped vertices
  for (let y = 0; y <= heightSegments; y++) {
    const v = y / heightSegments;
    const phi = v * Math.PI;

    for (let x = 0; x <= widthSegments; x++) {
      const u = x / widthSegments;
      const theta = u * Math.PI * 2;

      // Base sphere
      let px = Math.sin(phi) * Math.cos(theta);
      let py = Math.cos(phi);
      let pz = Math.sin(phi) * Math.sin(theta);

      // Brain shape modifiers

      // 1. Elongate front-to-back and widen sides (brain shape)
      pz *= 1.35;
      px *= 1.15;

      // 2. Flatten top
      if (py > 0.2) {
        py *= 0.82 + 0.18 * (1 - Math.pow((py - 0.2) / 0.8, 2));
      }

      // 3. Create prominent central fissure (longitudinal fissure)
      const centralFissureDepth = 0.22;
      const centralFissure = Math.abs(px) < 0.12 && py > -0.2 ?
        -centralFissureDepth * (1 - Math.abs(px) / 0.12) * Math.max(0, py + 0.2) * 1.2 : 0;
      py += centralFissure;

      // 4. Create detailed gyri (brain ridges/folds)
      const gyri1 = Math.sin(theta * 10 + phi * 4) * 0.05;
      const gyri2 = Math.sin(theta * 15 + phi * 6) * 0.03;
      const gyri3 = Math.sin(theta * 5 + phi * 10) * 0.04;
      const gyriNoise = gyri1 + gyri2 + gyri3;

      // 5. Create sulci (grooves between gyri)
      const sulci = Math.cos(theta * 8 + phi * 5) * 0.025;

      // 6. Prominent frontal lobe bulge
      const frontalBulge = pz > 0.5 ? 0.18 * Math.pow((pz - 0.5) / 0.85, 1.5) : 0;

      // 7. Temporal lobe bulge (sides, lower)
      const temporalBulge = py < 0.1 && Math.abs(px) > 0.5 ?
        0.12 * Math.pow(Math.abs(px), 1.5) * Math.max(0, 0.1 - py) : 0;

      // 8. Occipital lobe (back, rounded point)
      const occipitalShape = pz < -0.7 ? 0.12 * Math.pow((-pz - 0.7) / 0.65, 1.3) : 0;

      // 9. Cerebellum (back, bottom) - distinct smaller structure
      const cerebellumBulge = py < -0.35 && pz < -0.1 ?
        0.18 * Math.pow(Math.abs(py + 0.35), 0.8) * Math.max(0, -pz - 0.1) : 0;

      // 10. Parietal bulge (top back)
      const parietalBulge = py > 0.3 && pz < 0 ?
        0.06 * py * Math.abs(pz) : 0;

      // Apply all modifications
      const scale = 1.8;
      const finalX = (px + px * gyriNoise * 0.8 + px * temporalBulge) * scale;
      const finalY = (py + gyriNoise * 0.3 + sulci * 0.5 + parietalBulge) * scale;
      const finalZ = (pz + frontalBulge + occipitalShape + cerebellumBulge + gyriNoise * 0.6) * scale;

      vertices.push(finalX, finalY, finalZ);

      // Calculate normals
      const nx = px + gyriNoise;
      const ny = py;
      const nz = pz;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      normals.push(nx / len, ny / len, nz / len);
    }
  }

  // Create faces
  for (let y = 0; y < heightSegments; y++) {
    for (let x = 0; x < widthSegments; x++) {
      const a = y * (widthSegments + 1) + x;
      const b = a + 1;
      const c = a + (widthSegments + 1);
      const d = c + 1;

      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

// Realistic brain mesh with visible hemispheres and texture
function BrainMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef(0);

  const brainGeometry = useMemo(() => createBrainGeometry(), []);
  const wireGeometry = useMemo(() => new THREE.WireframeGeometry(brainGeometry), [brainGeometry]);

  // Brain material with realistic coloring
  const brainMaterial = useMemo(() => new THREE.MeshPhongMaterial({
    color: new THREE.Color('#e8b4bc'), // Pinkish gray brain color
    emissive: new THREE.Color(brandCyan),
    emissiveIntensity: 0.08,
    specular: new THREE.Color('#ffffff'),
    shininess: 15,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide,
  }), []);

  // Inner glow material
  const innerGlowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(brandCyan),
    transparent: true,
    opacity: 0.15,
  }), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.06;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.03;
    }

    // Pulsing effect
    pulseRef.current = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5;
    if (brainMaterial) {
      brainMaterial.emissiveIntensity = 0.06 + pulseRef.current * 0.04;
    }
    if (innerGlowMaterial) {
      innerGlowMaterial.opacity = 0.12 + pulseRef.current * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inner glow core */}
      <Float speed={0.5} rotationIntensity={0.02} floatIntensity={0.05}>
        <mesh geometry={brainGeometry} scale={0.92} material={innerGlowMaterial} />
      </Float>

      {/* Main brain surface */}
      <Float speed={0.6} rotationIntensity={0.03} floatIntensity={0.08}>
        <mesh ref={meshRef} geometry={brainGeometry} material={brainMaterial} />
      </Float>

      {/* Neural network wireframe - subtle */}
      <lineSegments ref={wireRef} geometry={wireGeometry}>
        <lineBasicMaterial color={brandCyan} transparent opacity={0.12} />
      </lineSegments>

      {/* Secondary wireframe for depth */}
      <lineSegments geometry={wireGeometry} scale={1.008}>
        <lineBasicMaterial color={brandPurple} transparent opacity={0.08} />
      </lineSegments>

      {/* Central fissure highlight line */}
      <mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 3.2, 8]} />
        <meshBasicMaterial color={brandPink} transparent opacity={0.4} />
      </mesh>

      {/* Left hemisphere accent */}
      <mesh position={[-0.9, 0.2, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={brandCyan} transparent opacity={0.3} />
      </mesh>

      {/* Right hemisphere accent */}
      <mesh position={[0.9, 0.2, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={brandPurple} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Connection line component
function ConnectionLine({ from, to, color }: { from: [number, number, number]; to: [number, number, number]; color: string }) {
  const geometry = useMemo(() => {
    const points = [];
    const segments = 20;
    const mid = [
      (from[0] + to[0]) / 2,
      (from[1] + to[1]) / 2 + 0.3,
      (from[2] + to[2]) / 2,
    ];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * mid[0] + t * t * to[0];
      const y = (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * mid[1] + t * t * to[1];
      const z = (1 - t) * (1 - t) * from[2] + 2 * (1 - t) * t * mid[2] + t * t * to[2];
      points.push(new THREE.Vector3(x, y, z));
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [from, to]);

  const material = useMemo(() => new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.2,
  }), [color]);

  const line = useMemo(() => new THREE.Line(geometry, material), [geometry, material]);

  return <primitive object={line} />;
}

// Neural connections
function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.06;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {NEURAL_CONNECTIONS.map((conn, idx) => (
        <ConnectionLine
          key={idx}
          from={BRAIN_BUBBLES[conn.from].position}
          to={BRAIN_BUBBLES[conn.to].position}
          color={BRAIN_BUBBLES[conn.from].color}
        />
      ))}
    </group>
  );
}

// Flowing neural particles
function FlowingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 300;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const conn = NEURAL_CONNECTIONS[i % NEURAL_CONNECTIONS.length];
      const from = BRAIN_BUBBLES[conn.from].position;
      const to = BRAIN_BUBBLES[conn.to].position;
      const t = Math.random();

      pos[i * 3] = from[0] + (to[0] - from[0]) * t;
      pos[i * 3 + 1] = from[1] + (to[1] - from[1]) * t;
      pos[i * 3 + 2] = from[2] + (to[2] - from[2]) * t;

      const bubbleColor = new THREE.Color(BRAIN_BUBBLES[conn.from].color);
      col[i * 3] = bubbleColor.r;
      col[i * 3 + 1] = bubbleColor.g;
      col[i * 3 + 2] = bubbleColor.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
    if (!posAttr || !posAttr.array) return;
    const pos = posAttr.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < particleCount; i++) {
      const conn = NEURAL_CONNECTIONS[i % NEURAL_CONNECTIONS.length];
      const from = BRAIN_BUBBLES[conn.from].position;
      const to = BRAIN_BUBBLES[conn.to].position;

      const t = ((time * 0.15 + i * 0.012) % 1);
      pos[i * 3] = from[0] + (to[0] - from[0]) * t + Math.sin(time * 1.5 + i) * 0.015;
      pos[i * 3 + 1] = from[1] + (to[1] - from[1]) * t + Math.cos(time * 1.5 + i) * 0.015;
      pos[i * 3 + 2] = from[2] + (to[2] - from[2]) * t;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.rotation.y = time * 0.06;
    particlesRef.current.rotation.x = Math.sin(time * 0.08) * 0.03;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.7} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

// Interactive treatment bubble
interface BubbleProps {
  bubble: typeof BRAIN_BUBBLES[number];
  isHovered: boolean;
  isSelected: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

function TreatmentBubble({ bubble, isHovered, isSelected, onClick, onHover }: BubbleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const targetScale = isHovered ? 1.3 : isSelected ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.18 + Math.sin(state.clock.elapsedTime * 2.5 + bubble.position[0]) * 0.1;
    }
    if (ringRef.current && (isHovered || isSelected)) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 2.5;
    }
  });

  return (
    <group position={bubble.position}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[bubble.size * 1.6, 16, 16]} />
        <meshBasicMaterial color={bubble.color} transparent opacity={0.15} />
      </mesh>

      {/* Hover ring */}
      {(isHovered || isSelected) && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[bubble.size * 1.4, 0.025, 8, 32]} />
          <meshBasicMaterial color="#fff" transparent opacity={0.7} />
        </mesh>
      )}

      {/* Main bubble */}
      <Float speed={1.8} rotationIntensity={0.08} floatIntensity={0.12}>
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerEnter={() => onHover(true)}
          onPointerLeave={() => onHover(false)}
        >
          <sphereGeometry args={[bubble.size, 32, 32]} />
          <meshPhongMaterial
            color={bubble.color}
            emissive={bubble.color}
            emissiveIntensity={isHovered ? 0.5 : isSelected ? 0.35 : 0.15}
            specular="#ffffff"
            shininess={30}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Float>

      {/* Label */}
      <sprite position={[0, 0, bubble.size + 0.12]} scale={[1.1, 0.38, 1]}>
        <spriteMaterial transparent opacity={isHovered ? 1 : 0.85}>
          <canvasTexture attach="map" image={createLabelTexture(bubble.label, bubble.color, isHovered)} />
        </spriteMaterial>
      </sprite>
    </group>
  );
}

// Create label texture
function createLabelTexture(text: string, color: string, isHovered: boolean): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 80;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = isHovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.88)';
  ctx.beginPath();
  ctx.roundRect(8, 8, 240, 64, 32);
  ctx.fill();

  ctx.fillStyle = isHovered ? color : '#1a1a2e';
  ctx.font = 'bold 32px Cairo, Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 44);

  return canvas;
}

// Rotating bubbles group
function RotatingBubbles({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.06;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.03;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// Main brain scene
function BrainScene({ onBubbleSelect }: { onBubbleSelect: (bubble: typeof BRAIN_BUBBLES[number] | null) => void }) {
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null);

  const handleBubbleClick = useCallback((bubble: typeof BRAIN_BUBBLES[number]) => {
    const isAlreadySelected = selectedBubble === bubble.id;
    setSelectedBubble(isAlreadySelected ? null : bubble.id);
    onBubbleSelect(isAlreadySelected ? null : bubble);
    const baseFreq = 300 + (bubble.position[1] + 1.5) * 150;
    playBubbleSound(baseFreq);
  }, [selectedBubble, onBubbleSelect]);

  return (
    <>
      {/* Lighting for brain visibility */}
      <ambientLight intensity={0.5} />
      <pointLight position={[8, 8, 8]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-8, -5, -8]} intensity={0.5} color={brandCyan} />
      <pointLight position={[0, 10, 0]} intensity={0.4} color="#ffffff" />
      <pointLight position={[0, -8, 5]} intensity={0.3} color={brandPurple} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} color="#ffffff" />

      {/* Brain mesh */}
      <BrainMesh />

      {/* Neural connections */}
      <NeuralNetwork />

      {/* Flowing particles */}
      <FlowingParticles />

      {/* Treatment bubbles */}
      <RotatingBubbles>
        {BRAIN_BUBBLES.map((bubble) => (
          <TreatmentBubble
            key={bubble.id}
            bubble={bubble}
            isHovered={hoveredBubble === bubble.id}
            isSelected={selectedBubble === bubble.id}
            onClick={() => handleBubbleClick(bubble)}
            onHover={(h) => setHoveredBubble(h ? bubble.id : null)}
          />
        ))}
      </RotatingBubbles>

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={4.5}
        maxDistance={12}
        autoRotate
        autoRotateSpeed={0.25}
        maxPolarAngle={Math.PI * 0.72}
        minPolarAngle={Math.PI * 0.28}
      />
    </>
  );
}

// Info panel
function BubbleInfoPanel({ bubble, onClose }: { bubble: typeof BRAIN_BUBBLES[number] | null; onClose: () => void }) {
  if (!bubble) return null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const descriptions: Record<string, string> = {
    auditory: 'معالجة الأصوات والمعلومات السمعية، بما في ذلك التمييز بين الأصوات المختلفة',
    language: 'فهم وإنتاج اللغة المنطوقة والمكتوبة، بما في ذلك القراءة والكتابة',
    music: 'إدراك الموسيقى والإيقاع واللحن، وتطوير المهارات الموسيقية',
    attention: 'القدرة على التركيز والانتباه، وتصفية المشتتات البيئية',
    sensory: 'معالجة المدخلات الحسية من البيئة المحيطة بطريقة متوازنة',
    balance: 'التوازن الجسدي والتنسيق الحركي والتكامل الدهليزي',
    memory: 'تخزين واسترجاع المعلومات، بما في ذلك الذاكرة العاملة والطويلة المدى',
    learning: 'اكتساب مهارات ومعلومات جديدة، وتطوير القدرات الأكاديمية',
    behavior: 'التنظيم السلوكي والعاطفي، والتحكم في الاستجابات',
    wellbeing: 'الصحة النفسية والعاطفية العامة، والشعور بالراحة والهدوء',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={bubble.labelEn}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5,6,13,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 1000,
      }}
    >
      <div style={{ width: '100%', maxWidth: 380, transform: `scale(${modalScale})`, transformOrigin: 'center' }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'rgba(11,15,28,0.95)',
            backdropFilter: 'blur(20px)',
            border: `2px solid ${bubble.color}66`,
            borderRadius: 20,
            padding: '20px 24px',
            width: '100%',
            maxHeight: '86vh',
            overflow: 'auto',
            animation: 'slideUp 0.4s ease-out',
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${bubble.color}22`,
          }}
        >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: bubble.color,
            boxShadow: `0 0 20px ${bubble.color}66`,
          }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: bubble.color }}>{bubble.label}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{bubble.labelEn}</div>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: 10,
          width: 32,
          height: 32,
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.7)',
          fontSize: 18,
        }}>×</button>
      </div>

      <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8 }}>
        {descriptions[bubble.id]}
      </p>

      <div style={{
        marginTop: 16,
        padding: '10px 14px',
        background: `${bubble.color}22`,
        border: `1px solid ${bubble.color}44`,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>🎧</span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>
          Berard AIT يستهدف هذه المنطقة من خلال التحفيز السمعي المتخصص
        </span>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </div>
      </div>
    </div>
  );
}

// Main component
interface Brain3DProps {
  height?: number | string;
  showUI?: boolean;
}

export default function Brain3D({ height = 500, showUI = true }: Brain3DProps) {
  const [selectedBubble, setSelectedBubble] = useState<typeof BRAIN_BUBBLES[number] | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <Canvas
        camera={{ position: [0, 0.5, isMobile ? 8 : 6.5], fov: isMobile ? 55 : 45 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <BrainScene onBubbleSelect={setSelectedBubble} />
      </Canvas>

      {showUI && <BubbleInfoPanel bubble={selectedBubble} onClose={() => setSelectedBubble(null)} />}

      {showUI && !selectedBubble && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(11,15,28,0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(143,211,204,0.2)',
          borderRadius: 14,
          padding: isMobile ? '8px 16px' : '10px 20px',
          fontSize: isMobile ? 12 : 14,
          color: 'rgba(255,255,255,0.75)',
          textAlign: 'center',
        }}>
          {isMobile ? 'المس الفقاعات لاستكشاف مجالات العلاج' : 'انقر على الفقاعات لاستكشاف كيف يؤثر Berard AIT على كل منطقة'}
        </div>
      )}
    </div>
  );
}
