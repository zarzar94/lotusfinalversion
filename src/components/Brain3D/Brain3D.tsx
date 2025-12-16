import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { brandCyan, brandPurple, brandPink, brandPurpleDark } from '../styles';

// Treatment area bubbles positioned on anatomical brain regions
const BRAIN_BUBBLES = [
  // Temporal lobe - Auditory cortex (side of brain, near ear)
  { id: 'auditory', label: 'السمع', labelEn: 'Auditory', color: '#FF6B35', position: [1.6, -0.3, 0.4] as [number, number, number], size: 0.32 },
  // Temporal/Frontal - Language (Broca's and Wernicke's area)
  { id: 'language', label: 'اللغة', labelEn: 'Language', color: '#00A8CC', position: [1.3, 0.4, 1.2] as [number, number, number], size: 0.32 },
  // Right temporal - Music processing
  { id: 'music', label: 'الموسيقى', labelEn: 'Music', color: '#C41E3A', position: [-1.5, 0.0, 0.6] as [number, number, number], size: 0.28 },
  // Frontal lobe - Attention/Executive function (front top)
  { id: 'attention', label: 'التركيز', labelEn: 'Attention', color: '#1E40AF', position: [0, 1.2, 1.4] as [number, number, number], size: 0.35 },
  // Parietal lobe - Sensory processing (top back)
  { id: 'sensory', label: 'الحسي', labelEn: 'Sensory', color: '#166534', position: [0.8, 1.4, -0.2] as [number, number, number], size: 0.32 },
  // Cerebellum - Balance (back bottom)
  { id: 'balance', label: 'التوازن', labelEn: 'Balance', color: '#15803D', position: [0, -1.2, -1.6] as [number, number, number], size: 0.35 },
  // Hippocampus area - Memory (deep temporal)
  { id: 'memory', label: 'الذاكرة', labelEn: 'Memory', color: '#EA580C', position: [-1.0, -0.5, 0.0] as [number, number, number], size: 0.32 },
  // Prefrontal - Learning (front)
  { id: 'learning', label: 'التعلم', labelEn: 'Learning', color: '#1E3A5F', position: [-0.6, 0.8, 1.6] as [number, number, number], size: 0.30 },
  // Prefrontal/Limbic - Behavior regulation
  { id: 'behavior', label: 'السلوك', labelEn: 'Behavior', color: '#9333EA', position: [0.6, 0.6, 1.8] as [number, number, number], size: 0.32 },
  // Limbic system - Well-being/Emotional center
  { id: 'wellbeing', label: 'الرفاهية', labelEn: 'Well-Being', color: '#2563EB', position: [-0.8, 1.0, 0.6] as [number, number, number], size: 0.32 },
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

// Create brain geometry with two hemispheres
function createBrainGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];
  const normals: number[] = [];

  const widthSegments = 48;
  const heightSegments = 32;

  // Create brain-shaped vertices
  for (let y = 0; y <= heightSegments; y++) {
    const v = y / heightSegments;
    const phi = v * Math.PI; // 0 to PI

    for (let x = 0; x <= widthSegments; x++) {
      const u = x / widthSegments;
      const theta = u * Math.PI * 2; // 0 to 2PI

      // Base sphere
      let px = Math.sin(phi) * Math.cos(theta);
      let py = Math.cos(phi);
      let pz = Math.sin(phi) * Math.sin(theta);

      // Brain shape modifiers
      // 1. Elongate front-to-back (z-axis)
      pz *= 1.25;

      // 2. Flatten top slightly
      if (py > 0.3) {
        py *= 0.85 + 0.15 * (1 - (py - 0.3) / 0.7);
      }

      // 3. Create central fissure (dividing hemispheres)
      const centralFissure = Math.abs(px) < 0.15 && py > -0.3 ?
        -0.15 * (1 - Math.abs(px) / 0.15) * Math.max(0, py + 0.3) : 0;
      py += centralFissure;

      // 4. Add gyri (brain ridges) using noise-like function
      const gyriNoise =
        Math.sin(theta * 8 + phi * 3) * 0.04 +
        Math.sin(theta * 12 + phi * 5) * 0.025 +
        Math.sin(theta * 4 + phi * 8) * 0.035;

      // 5. Bulge frontal lobe
      const frontalBulge = pz > 0.4 ? 0.12 * Math.pow((pz - 0.4) / 0.85, 2) : 0;

      // 6. Temporal lobe bulge (sides, lower)
      const temporalBulge = py < 0 && Math.abs(px) > 0.4 ?
        0.08 * Math.abs(px) * Math.abs(py) : 0;

      // 7. Occipital lobe (back, slightly pointed)
      const occipitalShape = pz < -0.6 ? 0.1 * Math.pow((-pz - 0.6) / 0.65, 1.5) : 0;

      // 8. Cerebellum bulge (back, bottom)
      const cerebellumBulge = py < -0.4 && pz < -0.2 ?
        0.15 * Math.abs(py + 0.4) * Math.max(0, -pz - 0.2) : 0;

      // Apply modifications
      const scale = 1.7;
      const finalX = (px + px * gyriNoise + px * temporalBulge) * scale;
      const finalY = (py + gyriNoise * 0.5) * scale;
      const finalZ = (pz + frontalBulge + occipitalShape + cerebellumBulge + gyriNoise * 0.8) * scale;

      vertices.push(finalX, finalY, finalZ);

      // Approximate normals
      normals.push(px, py, pz);
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

// Realistic brain mesh with hemispheres
function BrainMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);

  const brainGeometry = useMemo(() => createBrainGeometry(), []);
  const wireGeometry = useMemo(() => {
    const geo = createBrainGeometry();
    return new THREE.WireframeGeometry(geo);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inner glow core - brain shaped */}
      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.1}>
        <mesh ref={meshRef} geometry={brainGeometry}>
          <MeshDistortMaterial
            color="#e8a5b8"
            emissive="#8FD3CC"
            emissiveIntensity={0.12}
            distort={0.08}
            speed={0.8}
            roughness={0.6}
            transparent
            opacity={0.35}
          />
        </mesh>
      </Float>

      {/* Neural network wireframe - brain shaped */}
      <lineSegments ref={wireRef} geometry={wireGeometry}>
        <lineBasicMaterial color={brandCyan} transparent opacity={0.25} />
      </lineSegments>

      {/* Sulci (grooves) effect - additional wireframe layer */}
      <lineSegments geometry={wireGeometry} scale={1.01}>
        <lineBasicMaterial color={brandPurple} transparent opacity={0.15} />
      </lineSegments>

      {/* Central fissure highlight */}
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
        <meshBasicMaterial color={brandPink} transparent opacity={0.3} />
      </mesh>
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
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
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
  ctx.roundRect(8, 8, 240, 64, 32);
  ctx.fill();

  // Text
  ctx.fillStyle = isHovered ? color : '#1a1a2e';
  ctx.font = 'bold 32px Cairo, Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 44);

  return canvas;
}

// Rotating group for bubbles that syncs with brain rotation
interface RotatingBubblesProps {
  children: React.ReactNode;
}

function RotatingBubbles({ children }: RotatingBubblesProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
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

    // Play sound based on bubble position (higher = higher pitch)
    const baseFreq = 300 + (bubble.position[1] + 1.5) * 150;
    playBubbleSound(baseFreq);
  }, [selectedBubble, onBubbleSelect]);

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

      {/* Treatment area bubbles - rotate with the brain */}
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
