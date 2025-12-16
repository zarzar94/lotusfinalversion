import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useGamification } from '../../context/GamificationContext';
import { brandCyan, brandPurple, brandPink, brandPurpleDark } from '../styles';
import { ensureAudio, safeCloseAudio } from '../games/audio';

// Treatment area bubbles based on the brain map image
const BRAIN_BUBBLES = [
  { id: 'auditory', label: 'السمع', labelEn: 'Auditory', color: '#FF6B35', position: [0.3, 1.4, 0.8] as [number, number, number], size: 0.38 },
  { id: 'language', label: 'اللغة', labelEn: 'Language', color: '#00A8CC', position: [1.4, 1.1, 0.5] as [number, number, number], size: 0.38 },
  { id: 'music', label: 'الموسيقى', labelEn: 'Music', color: '#C41E3A', position: [-1.3, 0.5, 0.6] as [number, number, number], size: 0.32 },
  { id: 'attention', label: 'التركيز', labelEn: 'Attention', color: '#1E40AF', position: [0, 0.3, 1.0] as [number, number, number], size: 0.4 },
  { id: 'sensory', label: 'الحسي', labelEn: 'Sensory', color: '#166534', position: [0.9, 0.2, 0.9] as [number, number, number], size: 0.38 },
  { id: 'balance', label: 'التوازن', labelEn: 'Balance', color: '#15803D', position: [1.8, 0.3, 0.3] as [number, number, number], size: 0.4 },
  { id: 'memory', label: 'الذاكرة', labelEn: 'Memory', color: '#EA580C', position: [-1.5, -0.2, 0.5] as [number, number, number], size: 0.4 },
  { id: 'learning', label: 'التعلم', labelEn: 'Learning', color: '#1E3A5F', position: [0.5, -0.6, 0.8] as [number, number, number], size: 0.35 },
  { id: 'behavior', label: 'السلوك', labelEn: 'Behavior', color: '#9333EA', position: [-0.5, -0.8, 0.7] as [number, number, number], size: 0.4 },
  { id: 'wellbeing', label: 'الرفاهية', labelEn: 'Well-Being', color: '#2563EB', position: [1.5, -0.5, 0.4] as [number, number, number], size: 0.38 },
];

const BUBBLE_TO_REGION: Record<string, string> = {
  auditory: 'auditory_cortex',
  language: 'temporal_lobe',
  music: 'temporal_lobe',
  memory: 'temporal_lobe',
  attention: 'thalamus',
  sensory: 'brainstem',
  balance: 'cerebellum',
  learning: 'prefrontal',
  behavior: 'prefrontal',
  wellbeing: 'cerebellum',
};

// Neural connections between bubbles
const NEURAL_CONNECTIONS = [
  { from: 0, to: 3 }, { from: 1, to: 3 }, { from: 2, to: 6 },
  { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 6, to: 8 },
  { from: 7, to: 3 }, { from: 8, to: 7 }, { from: 9, to: 5 },
  { from: 0, to: 2 }, { from: 1, to: 4 }, { from: 3, to: 7 },
  { from: 5, to: 9 }, { from: 6, to: 7 }, { from: 4, to: 9 },
];

// Organic brain mesh wireframe
function BrainMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      wireRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group>
      {/* Inner glow core */}
      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.1}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.8, 3]} />
          <MeshDistortMaterial
            color="#4a90a4"
            emissive="#8FD3CC"
            emissiveIntensity={0.15}
            distort={0.25}
            speed={1.2}
            roughness={0.4}
            transparent
            opacity={0.25}
          />
        </mesh>
      </Float>

      {/* Neural network wireframe */}
      <lineSegments ref={wireRef}>
        <icosahedronGeometry args={[1.9, 2]} />
        <lineBasicMaterial color={brandCyan} transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}

// Connection line component using primitive
function ConnectionLine({ from, to, color }: { from: [number, number, number]; to: [number, number, number]; color: string }) {
  const lineRef = useRef<THREE.Line>(null);

  const geometry = useMemo(() => {
    const points = [];
    const segments = 20;
    const mid = [
      (from[0] + to[0]) / 2,
      (from[1] + to[1]) / 2 + 0.2,
      (from[2] + to[2]) / 2,
    ];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      // Bezier curve
      const x = (1-t)*(1-t)*from[0] + 2*(1-t)*t*mid[0] + t*t*to[0];
      const y = (1-t)*(1-t)*from[1] + 2*(1-t)*t*mid[1] + t*t*to[1];
      const z = (1-t)*(1-t)*from[2] + 2*(1-t)*t*mid[2] + t*t*to[2];
      points.push(new THREE.Vector3(x, y, z));
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [from, to]);

  const material = useMemo(() => new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.25,
  }), [color]);

  const line = useMemo(() => new THREE.Line(geometry, material), [geometry, material]);

  return <primitive ref={lineRef} object={line} />;
}

// Animated connection lines between bubbles
function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
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

// Flowing particles along connections
function FlowingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 400;

  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const conn = NEURAL_CONNECTIONS[i % NEURAL_CONNECTIONS.length];
      const from = BRAIN_BUBBLES[conn.from].position;
      const to = BRAIN_BUBBLES[conn.to].position;
      const t = Math.random();

      pos[i * 3] = from[0] + (to[0] - from[0]) * t;
      pos[i * 3 + 1] = from[1] + (to[1] - from[1]) * t;
      pos[i * 3 + 2] = from[2] + (to[2] - from[2]) * t;

      vel[i * 3] = (to[0] - from[0]) * 0.01;
      vel[i * 3 + 1] = (to[1] - from[1]) * 0.01;
      vel[i * 3 + 2] = (to[2] - from[2]) * 0.01;

      const bubbleColor = new THREE.Color(BRAIN_BUBBLES[conn.from].color);
      col[i * 3] = bubbleColor.r;
      col[i * 3 + 1] = bubbleColor.g;
      col[i * 3 + 2] = bubbleColor.b;
    }

    return { positions: pos, velocities: vel, colors: col };
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

      const t = ((time * 0.2 + i * 0.01) % 1);
      pos[i * 3] = from[0] + (to[0] - from[0]) * t + Math.sin(time * 2 + i) * 0.02;
      pos[i * 3 + 1] = from[1] + (to[1] - from[1]) * t + Math.cos(time * 2 + i) * 0.02;
      pos[i * 3 + 2] = from[2] + (to[2] - from[2]) * t;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.rotation.y = time * 0.08;
    particlesRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.8} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

// Interactive treatment area bubble
interface BubbleProps {
  bubble: typeof BRAIN_BUBBLES[number];
  isHovered: boolean;
  isSelected: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

function TreatmentBubble({ bubble, isHovered, isSelected, onClick, onHover }: BubbleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
    if (meshRef.current) {
      const targetScale = isHovered ? 1.25 : isSelected ? 1.15 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2 + bubble.position[0]) * 0.08;
    }
    if (ringRef.current && (isHovered || isSelected)) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 2;
    }
  });

  return (
    <group ref={groupRef}>
      <group position={bubble.position}>
        {/* Outer glow */}
        <Sphere ref={glowRef} args={[bubble.size * 1.5, 16, 16]}>
          <meshBasicMaterial color={bubble.color} transparent opacity={0.12} />
        </Sphere>

        {/* Hover ring */}
        {(isHovered || isSelected) && (
          <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[bubble.size * 1.3, 0.02, 8, 32]} />
            <meshBasicMaterial color="#fff" transparent opacity={0.6} />
          </mesh>
        )}

        {/* Main bubble */}
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.15}>
          <Sphere
            ref={meshRef}
            args={[bubble.size, 32, 32]}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            onPointerEnter={() => onHover(true)}
            onPointerLeave={() => onHover(false)}
          >
            <MeshDistortMaterial
              color={bubble.color}
              emissive={bubble.color}
              emissiveIntensity={isHovered ? 0.6 : isSelected ? 0.4 : 0.2}
              distort={0.15}
              speed={2}
              roughness={0.3}
              metalness={0.1}
              transparent
              opacity={0.92}
            />
          </Sphere>
        </Float>

        {/* Label - always visible */}
        <sprite position={[0, 0, bubble.size + 0.1]} scale={[1.2, 0.4, 1]}>
          <spriteMaterial transparent opacity={isHovered ? 1 : 0.85}>
            <canvasTexture attach="map" image={createLabelTexture(bubble.label, bubble.color, isHovered)} />
          </spriteMaterial>
        </sprite>
      </group>
    </group>
  );
}

// Create canvas texture for labels
function createLabelTexture(text: string, color: string, isHovered: boolean): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 80;
  const ctx = canvas.getContext('2d')!;

  // Background pill
  ctx.fillStyle = isHovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  const maybeRoundRect = (ctx as CanvasRenderingContext2D & { roundRect?: (...args: unknown[]) => void }).roundRect;
  if (typeof maybeRoundRect === 'function') {
    maybeRoundRect.call(ctx, 8, 8, 240, 64, 32);
  } else {
    const x = 8;
    const y = 8;
    const w = 240;
    const h = 64;
    const r = 32;
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  ctx.fill();

  // Text
  ctx.fillStyle = isHovered ? color : '#1a1a2e';
  ctx.font = 'bold 32px Cairo, Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 44);

  return canvas;
}

// Main brain scene
function BrainScene({ onBubbleSelect }: { onBubbleSelect: (bubble: typeof BRAIN_BUBBLES[number] | null) => void }) {
  const { exploreBrainRegion } = useGamification();
  const audioRef = useRef<AudioContext | null>(null);
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      void safeCloseAudio(audioRef);
    };
  }, []);

  const playBubbleSound = useCallback((frequency: number) => {
    try {
      const audio = ensureAudio(audioRef);
      if (audio.state === 'suspended') void audio.resume().catch(() => {});

      const osc = audio.createOscillator();
      const gain = audio.createGain();
      const now = audio.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.3, now + 0.2);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc.connect(gain);
      gain.connect(audio.destination);

      osc.start(now);
      osc.stop(now + 0.33);
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

  const handleBubbleClick = useCallback((bubble: typeof BRAIN_BUBBLES[number]) => {
    const isAlreadySelected = selectedBubble === bubble.id;
    setSelectedBubble(isAlreadySelected ? null : bubble.id);
    onBubbleSelect(isAlreadySelected ? null : bubble);

    if (!isAlreadySelected) {
      const regionId = BUBBLE_TO_REGION[bubble.id];
      if (regionId) exploreBrainRegion(regionId);
    }

    // Play sound based on bubble position (higher = higher pitch)
    const baseFreq = 300 + (bubble.position[1] + 1.5) * 150;
    playBubbleSound(baseFreq);
  }, [exploreBrainRegion, onBubbleSelect, playBubbleSound, selectedBubble]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#8FD3CC" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#AF84BA" />
      <pointLight position={[0, 5, 5]} intensity={0.3} color="#fff" />

      {/* Brain mesh wireframe */}
      <BrainMesh />

      {/* Neural connections */}
      <NeuralNetwork />

      {/* Flowing particles */}
      <FlowingParticles />

      {/* Treatment area bubbles */}
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

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.25}
      />
    </>
  );
}

// Info panel for selected bubble
interface InfoPanelProps {
  bubble: typeof BRAIN_BUBBLES[number] | null;
  onClose: () => void;
}

function BubbleInfoPanel({ bubble, onClose }: InfoPanelProps) {
  if (!bubble) return null;

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
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(11,15,28,0.95)',
      backdropFilter: 'blur(20px)',
      border: `2px solid ${bubble.color}66`,
      borderRadius: 20,
      padding: '20px 24px',
      maxWidth: 380,
      width: '90%',
      animation: 'slideUp 0.4s ease-out',
      boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${bubble.color}22`,
    }}>
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
          from { opacity: 0; transform: translateX(-50%) translateY(30px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Main exported component
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
        camera={{ position: [0, 0, isMobile ? 7 : 6], fov: isMobile ? 60 : 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <BrainScene onBubbleSelect={setSelectedBubble} />
      </Canvas>

      {/* Info panel */}
      {showUI && <BubbleInfoPanel bubble={selectedBubble} onClose={() => setSelectedBubble(null)} />}

      {/* Instructions */}
      {showUI && !selectedBubble && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(11,15,28,0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          padding: isMobile ? '8px 16px' : '10px 20px',
          fontSize: isMobile ? 12 : 14,
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center',
        }}>
          {isMobile ? 'المس الفقاعات لاستكشاف مجالات العلاج' : 'انقر على الفقاعات لاستكشاف كيف يؤثر Berard AIT على كل منطقة'}
        </div>
      )}
    </div>
  );
}
