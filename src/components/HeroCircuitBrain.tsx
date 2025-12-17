import { useState, useEffect, useMemo, useCallback } from 'react';
import { brandCyan, brandPurple, brandPink } from './styles';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type Pulse = {
  id: string;
  path: 'c1' | 'c2' | 'c3' | 'c4' | 'c5';
  color: string;
  dur: number;
  begin: number;
  r: number;
};

type Ripple = {
  id: string;
  x: number;
  y: number;
  color: string;
};

type NodeInfo = {
  id: string;
  x: number;
  y: number;
  r: number;
  labelAr: string;
  labelEn: string;
  content: {
    title: string;
    questions: string[];
    explanation: string;
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// NODE CONTENT DATA
// ═══════════════════════════════════════════════════════════════════════════

const NODE_DATA: NodeInfo[] = [
  {
    id: 'auditory',
    x: 160,
    y: 130,
    r: 14,
    labelAr: 'السمع',
    labelEn: 'Auditory',
    content: {
      title: 'Auditory',
      questions: [
        'Sometimes the auditory system seems to be out-of-balance, something is "off" but it is difficult to pinpoint exactly what it is.',
        'Sounds may be too loud, even painful, words may sound distorted and difficult to understand, or may seem to be coming so fast so they run together, making it difficult to hear words distinctly.',
        'Background noise in restaurants or other busy places distract and confuse the conversation.',
      ],
      explanation: 'These difficulties interfere with auditory processing and make communication and socialization a challenge. Are you looking for a way to make communication and socialization easier and less stressful? The Berard method of AIT is designed to re-balance, retrain the functions, so the auditory system will become an efficient processor of sound input. Berard AIT provides a specific, novel type of stimulation with frequency, intensity, and the correct duration to stimulate change. Neuroplasticity is the brain\'s natural ability to change itself. Berard AIT re-educates the system to create a smooth and effective route for auditory input.',
    },
  },
  {
    id: 'language',
    x: 270,
    y: 150,
    r: 13,
    labelAr: 'اللغة',
    labelEn: 'Language',
    content: {
      title: 'Language',
      questions: [
        'Is it difficult for you to understand conversation in noisy places?',
        'Have you ever had trouble forming your thoughts into words? Or had the impression that once you\'ve spoken, it\'s not what you really had wanted to say?',
        'Do you know a child with language delays or difficulty communicating?',
        'Perhaps you know someone with speech or articulation problems?',
        'Are you struggling to learn a second language? Or do you want to reduce your accent?',
      ],
      explanation: 'Language delay or difficulties cause frustration, anxiety, behavior challenges, and impacts on social and academic growth. The Berard method of AIT is well documented for its ability to retrain auditory processing. It also specifically stimulates the language centers, thereby improving the ability to develop language, or to learn new languages more easily. Our ability to identify and discriminate sounds must become automatic so that these sounds can become words. Berard AIT automates this process so thoughts can be better organized and be sequenced into expressive language that represents what we really want to say.',
    },
  },
  {
    id: 'balance',
    x: 380,
    y: 120,
    r: 12,
    labelAr: 'التوازن',
    labelEn: 'Balance',
    content: {
      title: 'Balance and Coordination',
      questions: [
        'Have you tried to learn to ride a bike, play a sport, or dance, and only experienced frustration?',
        'Have you tried to learn a craft or skill, or write neatly, and feel like a failure?',
        'Are you "all thumbs" or feel like you have two left feet?',
        'Is balance and fear of falling affecting your safety and mobility?',
        'Do you, or someone you know, give up and avoid activities requiring balance and coordination?',
      ],
      explanation: 'Discover Berard AIT, a way to improve balance and coordination so goals can be achieved, or to improve mobility and safety in daily life activities. Balance and coordination require a variety of functions that must be well-integrated and work together. The vestibular system, located within the ear, regulates many balance and motor functions. Berard AIT provides stimulation with specific vibrational input designed to retrain an out-of-balance system. The auditory and visual systems integrate, leading to more efficient function. As body awareness develops, improvement in muscle coordination and sequencing movements makes it easier to achieve the goal. Confidence grows and interest in practicing and participating in activities is no longer a problem. Berard AIT enables dreams of achieving skill in fine and gross motor activities to become a reality.',
    },
  },
  {
    id: 'wellbeing',
    x: 440,
    y: 180,
    r: 13,
    labelAr: 'الرفاهية',
    labelEn: 'Well Being',
    content: {
      title: 'Well Being',
      questions: [
        'Do you feel discouraged or disappointed in yourself?',
        'Are you not achieving the goals and plans for things that you dream about?',
        'Do you feel it is useless to try something new because you have failed with other similar activities?',
        'Are you lacking motivation because things just seem too difficult to do successfully?',
      ],
      explanation: 'Many individuals report that after completing Berard AIT, they feel more motivated, organized, and more content. It is well documented that the Berard program often improves sensory and auditory processing. Behaviors used to compensate for processing problems are no longer needed. Your body and brain work smoothly together, and new skills are easier to learn. Memory improves and stress decreases. You feel more confident, secure, and positive, as a result of these changes in skills and abilities. You see that you are achieving your goals and are motivated to take on new challenges because you are now finding success.',
    },
  },
  {
    id: 'music',
    x: 450,
    y: 260,
    r: 12,
    labelAr: 'الموسيقى',
    labelEn: 'Music',
    content: {
      title: 'Music',
      questions: [
        'Music is said to be the universal Language of Mankind, but it doesn\'t come naturally to everyone.',
        'Do you have difficulty in perceiving the differences in musical pitch? Or do you sing "off-key", commonly know as being tone deaf?',
        'Have you struggled to learn to play a musical instrument without much success?',
        'Or do you already speak the universal Language of Mankind and just want to enrich your listening or playing experience?',
      ],
      explanation: 'Berard AIT can improve your ability to perceive the differences in musical pitch more accurately. One of the well-documented results of Berard is the improvement of auditory processing. The same mechanism of auditory processing that improves perception of speech sounds and words, also improves perception of musical notes, allowing for better clarity of sound. Berard AIT leads to an enriched experience with music, both with playing or listening to it.',
    },
  },
  {
    id: 'memory',
    x: 420,
    y: 330,
    r: 14,
    labelAr: 'الذاكرة',
    labelEn: 'Memory',
    content: {
      title: 'Memory',
      questions: [
        'Everyone forgets sometimes, but do you feel forgetting is beginning to interfere in your life?',
        'Do you forget important events or information?',
        'Do you think of yourself as forgetful? (Or have you been criticized for your forgetfulness)?',
        'Are you becoming frustrated because of your forgetfulness?',
      ],
      explanation: 'The Berard method of AIT can help improve memory. In order to remember something, you must be attentive to the information so it can be processed quickly and be registered clearly in the brain. If you are not attending well, or are distracted easily, you will not be able to register and remember information in a well-organized way. Berard AIT improves attention and concentration, and balances important systems used for processing information, so that they function without conscious effort. As processing improves, it is easier to pay attention and concentrate, which in turn, allows you to store information correctly and easily, and quickly recall it when necessary.',
    },
  },
  {
    id: 'behavior',
    x: 320,
    y: 350,
    r: 13,
    labelAr: 'السلوك',
    labelEn: 'Behavior',
    content: {
      title: 'Behavior',
      questions: [
        'Negative behavior sometimes seems to come from "out of the blue" with no apparent cause.',
        'Sudden aggression, lack of cooperation, emotional meltdowns, withdrawal, and anxiety, all create frustration, confusion, and stress, for both the individual experiencing the outbursts and those involved in the situation.',
      ],
      explanation: 'Are you looking for a way to resolve challenging behavior? Getting to the root cause of challenging behavior can result in better, long-term success. In many cases, negative behavior is a result of compensating for faulty sensory experiences, or weaknesses in processing auditory input. When sensory modulation and auditory processing are functioning well, it is easier to adjust to the changes and demands of life experiences. Berard AIT is a process that restores the ability to modulate sensory input and balances the auditory system. When these brain/body systems are in balance, we can better manage the changes and interactions that occur in our daily lives.',
    },
  },
  {
    id: 'learning',
    x: 220,
    y: 340,
    r: 13,
    labelAr: 'التعلم',
    labelEn: 'Learning',
    content: {
      title: 'Learning',
      questions: [
        'Have you always had some difficulty learning, either in school or on the job?',
        'Do you find oral or written explanations and directions hard to follow?',
        'Have you always felt not "smart enough" to learn?',
        'Perhaps you know a child struggling in school?',
      ],
      explanation: 'Berard AIT retrains the brain\'s processing capabilities and makes learning easier. Learning is not a question of intelligence, but simply the process of acquiring new, or modifying existing, knowledge, behaviors, and skills. When auditory and sensory processing problems impact this process, learning is difficult. Berard AIT rewires the processing system; the brain and body become well-integrated and information can be learned and retained in an organized way.',
    },
  },
  {
    id: 'sensory',
    x: 150,
    y: 280,
    r: 12,
    labelAr: 'الحسي',
    labelEn: 'Sensory',
    content: {
      title: 'Sensory',
      questions: [
        'For some people, the physical or internal environment can be too intense, overwhelming, frightening, or confusing, due to too much stimulation.',
        'The ability to process input and adjust behaviors and emotions appropriately is disrupted.',
        'Acting out with aggression as a defense, or withdrawing and clinging to someone for comfort and protection, may be an adaptive response to this dysfunction.',
      ],
      explanation: 'Attention becomes focused on being constantly "on guard" in preparation for the next stressful experience that may occur. Sometimes, the system becomes so overwhelmed that it may shutdown and become closed off to input. Sensory stimulation may not seem to penetrate and register sufficiently to prompt a response. Berard AIT is an effective way to reorganize the sensory system. This unique program retrains the system, using a specific, novel type of stimulation with frequency, intensity, and the correct duration to stimulate change. Sensory input can then be correctly modulated and integrated in a natural way. It becomes possible to respond to one\'s environment with appropriate behaviors and emotions. The meltdowns, aggression, and withdrawals resolve.',
    },
  },
  {
    id: 'attention',
    x: 180,
    y: 200,
    r: 14,
    labelAr: 'الانتباه',
    labelEn: 'Attention',
    content: {
      title: 'Attention and Concentration',
      questions: [
        'Is it hard for you to pay attention, or to carefully observe and listen to something important?',
        'Can you concentrate on the task without your attention drifting to unrelated topics?',
        'Do other activities, visual objects, or noise, tug at your attention?',
        'Do you get tired and bored, and often fidget?',
      ],
      explanation: 'Berard AIT is a unique way to increase attention and concentration on a task. The Berard method of AIT retrains a body/brain system that is not operating at peak performance. Rebalancing the auditory system, and integrating that system with the visual system, makes it easier to focus and process the information that\'s most important. The appropriate stimulation provided by Berard AIT enables the inefficient system to create better connections. Distractions no longer compete for attention. Effective processing of information reduces overload, fatigue, and restlessness. Attention and concentration become possible.',
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = [brandCyan, brandPurple, brandPink];

const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

// ═══════════════════════════════════════════════════════════════════════════
// INFO MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function InfoModal({
  node,
  onClose,
}: {
  node: NodeInfo | null;
  onClose: () => void;
}) {
  if (!node) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #f5ebe0 0%, #ede0d4 100%)',
          borderRadius: 16,
          maxWidth: 800,
          width: '100%',
          maxHeight: '85vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
          animation: 'modalSlideIn 0.3s ease-out',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'transparent',
            border: 'none',
            fontSize: 28,
            cursor: 'pointer',
            color: '#666',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          ×
        </button>

        {/* Content */}
        <div style={{ padding: '32px 40px' }}>
          {/* Title */}
          <h2
            style={{
              margin: '0 0 24px 0',
              fontSize: 28,
              fontWeight: 700,
              color: '#1a5f7a',
              fontFamily: 'Cairo, system-ui, sans-serif',
            }}
          >
            {node.content.title}
          </h2>

          {/* Questions */}
          <div style={{ marginBottom: 24 }}>
            {node.content.questions.map((q, i) => (
              <p
                key={i}
                style={{
                  margin: '0 0 16px 0',
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: '#333',
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                {q}
              </p>
            ))}
          </div>

          {/* Explanation */}
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.8,
              color: '#444',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {node.content.explanation}
          </p>

          {/* CTA Button */}
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <a
              href="#contact"
              onClick={onClose}
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #a68a6d 0%, #8b7355 100%)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 30,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: 'Cairo, system-ui, sans-serif',
                boxShadow: '0 4px 15px rgba(139,115,85,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(139,115,85,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(139,115,85,0.3)';
              }}
            >
              Berard AIT Protocol
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function HeroCircuitBrain() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeNode, setActiveNode] = useState<NodeInfo | null>(null);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveNode(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Burst explosion when clicking a node
  const burstAtNode = useCallback((x: number, y: number) => {
    if (reducedMotion) return;

    const rippleColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const rippleId = uid();
    setRipples((prev) => [...prev.slice(-3), { id: rippleId, x, y, color: rippleColor }]);

    const waves = 3;
    const baseDur = 2.2;
    const all: Pulse[] = [];
    const paths = ['c1', 'c2', 'c3', 'c4', 'c5'] as const;

    for (let w = 0; w < waves; w++) {
      const waveDelay = w * 0.18;
      paths.forEach((path, i) => {
        const color = COLORS[(w + i) % COLORS.length];
        all.push({
          id: uid(),
          path,
          color,
          dur: baseDur + Math.random() * 1.2,
          begin: waveDelay + i * 0.06,
          r: 3 + Math.random() * 1.5,
        });
      });
    }

    setPulses((prev) => [...prev.slice(-60), ...all]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 700);
  }, [reducedMotion]);

  const handleNodeClick = useCallback((node: NodeInfo) => {
    burstAtNode(node.x, node.y);
    setActiveNode(node);
  }, [burstAtNode]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, node: NodeInfo) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNodeClick(node);
    }
  }, [handleNodeClick]);

  // CSS keyframes
  const css = useMemo(() => `
    @keyframes pathFlow {
      0% { stroke-dashoffset: 100; }
      100% { stroke-dashoffset: 0; }
    }
    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes brainPulse {
      0%, 100% {
        filter: drop-shadow(0 0 30px rgba(143,211,204,0.3)) drop-shadow(0 0 60px rgba(175,132,186,0.2));
      }
      50% {
        filter: drop-shadow(0 0 50px rgba(143,211,204,0.5)) drop-shadow(0 0 80px rgba(175,132,186,0.4));
      }
    }
    @keyframes scrollHint {
      0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.6; }
      50% { transform: translateX(-50%) translateY(10px); opacity: 1; }
    }
    @keyframes nodeFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    .circuit-brain-container {
      animation: fadeInScale 1s ease-out forwards;
    }
    .circuit-brain-svg {
      animation: ${reducedMotion ? 'none' : 'brainPulse 4s ease-in-out infinite'};
    }
    .circuit-node {
      cursor: pointer;
      transition: transform 0.2s ease, filter 0.2s ease;
    }
    .circuit-node:hover {
      transform: scale(1.2);
      filter: brightness(1.2);
    }
    .circuit-node:focus {
      outline: none;
    }
    .circuit-node:focus-visible {
      outline: 2px solid ${brandCyan};
      outline-offset: 4px;
    }
    .circuit-path {
      stroke-dasharray: 8 4;
      animation: ${reducedMotion ? 'none' : 'pathFlow 3s linear infinite'};
    }
  `, [reducedMotion]);

  return (
    <section
      id="about"
      style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at center, rgba(20,26,45,1) 0%, rgba(8,10,18,1) 100%)',
      }}
    >
      <style>{css}</style>

      {/* Grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(143,211,204,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(143,211,204,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
      }} />

      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(143,211,204,0.12) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Main brain circuit container */}
      <div
        className="circuit-brain-container"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isLoaded ? 1 : 0,
        }}
      >
        <svg
          className="circuit-brain-svg"
          width="650"
          height="500"
          viewBox="100 70 400 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Interactive brain circuit - click nodes to learn more"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          <defs>
            <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={brandCyan} stopOpacity="0.8" />
              <stop offset="50%" stopColor={brandPurple} stopOpacity="0.6" />
              <stop offset="100%" stopColor={brandPink} stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="neonGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feGaussianBlur stdDeviation="8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Brain silhouette */}
          <path
            d="M300 90
               C210 90 140 140 130 210
               C120 280 145 350 195 385
               C245 420 280 420 300 420
               C320 420 355 420 405 385
               C455 350 480 280 470 210
               C460 140 390 90 300 90Z"
            fill="none"
            stroke="url(#brainGradient)"
            strokeWidth="2"
            opacity="0.25"
          />

          {/* Brain folds */}
          <g stroke={brandCyan} strokeWidth="1" opacity="0.15" fill="none">
            <path d="M160 180 Q230 155 300 175 Q370 195 430 175" />
            <path d="M150 230 Q220 205 300 225 Q380 245 440 225" />
            <path d="M160 280 Q230 255 300 275 Q370 295 430 275" />
            <path d="M180 330 Q250 305 300 325 Q350 345 400 325" />
          </g>

          {/* ═══════════════════════════════════════════════════════════════
              CIRCUIT PATHS
          ═══════════════════════════════════════════════════════════════ */}

          <path id="c1" className="circuit-path" d="M160 130 L220 130 L220 150 L270 150" fill="none" stroke={brandCyan} strokeWidth="2" strokeLinecap="round" filter="url(#glow)" />
          <path id="c2" className="circuit-path" d="M270 150 L330 150 L330 120 L380 120" fill="none" stroke={brandPurple} strokeWidth="2" strokeLinecap="round" filter="url(#glow)" style={{ animationDelay: '0.5s' }} />
          <path id="c3" className="circuit-path" d="M380 120 L420 120 L420 180 L440 180 L440 260 L450 260" fill="none" stroke={brandPink} strokeWidth="2" strokeLinecap="round" filter="url(#glow)" style={{ animationDelay: '1s' }} />
          <path id="c4" className="circuit-path" d="M450 260 L450 330 L420 330 L320 350 L220 340 L150 280" fill="none" stroke={brandCyan} strokeWidth="2" strokeLinecap="round" filter="url(#glow)" style={{ animationDelay: '1.5s' }} />
          <path id="c5" className="circuit-path" d="M150 280 L150 200 L180 200" fill="none" stroke={brandPurple} strokeWidth="2" strokeLinecap="round" filter="url(#glow)" style={{ animationDelay: '2s' }} />

          {/* Secondary traces */}
          <g stroke={brandCyan} strokeWidth="1" opacity="0.3" strokeDasharray="4 2">
            <path d="M270 150 L270 200 L180 200" />
            <path d="M380 120 L380 180 L440 180" />
            <path d="M420 330 L420 260 L450 260" />
            <path d="M220 340 L220 280 L150 280" />
          </g>

          {/* ═══════════════════════════════════════════════════════════════
              RIPPLES
          ═══════════════════════════════════════════════════════════════ */}
          <g>
            {ripples.map((r) => (
              <circle
                key={r.id}
                cx={r.x}
                cy={r.y}
                r="2"
                fill="transparent"
                stroke={r.color}
                strokeWidth="2"
                opacity="0.9"
                style={{ filter: `drop-shadow(0 0 12px ${r.color})` }}
              >
                <animate attributeName="r" values="2;45" dur="0.7s" fill="freeze" />
                <animate attributeName="opacity" values="0.9;0" dur="0.7s" fill="freeze" />
              </circle>
            ))}
          </g>

          {/* ═══════════════════════════════════════════════════════════════
              PULSES
          ═══════════════════════════════════════════════════════════════ */}
          <g opacity="0.9">
            {pulses.map((p) => (
              <circle
                key={p.id}
                r={p.r}
                fill={p.color}
                style={{ filter: `drop-shadow(0 0 10px ${p.color})` }}
              >
                <animate attributeName="opacity" values="0;1;0.3;0" dur={`${p.dur}s`} begin={`${p.begin}s`} fill="freeze" />
                <animate attributeName="r" values={`${p.r};${p.r + 2};${p.r}`} dur={`${p.dur}s`} begin={`${p.begin}s`} fill="freeze" />
                <animateMotion dur={`${p.dur}s`} begin={`${p.begin}s`} repeatCount="1" fill="freeze">
                  <mpath href={`#${p.path}`} />
                </animateMotion>
              </circle>
            ))}
          </g>

          {/* ═══════════════════════════════════════════════════════════════
              INTERACTIVE NODES
          ═══════════════════════════════════════════════════════════════ */}
          <g filter="url(#neonGlow)">
            {NODE_DATA.map((node, index) => (
              <g
                key={node.id}
                className="circuit-node"
                onClick={() => handleNodeClick(node)}
                onKeyDown={(e) => handleKeyDown(e, node)}
                tabIndex={0}
                role="button"
                aria-label={`${node.labelEn} - Click to learn more`}
                style={{ animation: reducedMotion ? 'none' : `nodeFloat ${2 + index * 0.2}s ease-in-out infinite` }}
              >
                {/* Outer ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r + 8}
                  fill="transparent"
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth="1"
                  opacity="0.3"
                />
                {/* Main circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r}
                  fill={`${COLORS[index % COLORS.length]}30`}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth="2"
                  style={{ filter: `drop-shadow(0 0 12px ${COLORS[index % COLORS.length]})` }}
                />
                {/* Inner dot */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r * 0.35}
                  fill={COLORS[index % COLORS.length]}
                  opacity="0.9"
                >
                  {!reducedMotion && (
                    <animate attributeName="r" values={`${node.r * 0.3};${node.r * 0.45};${node.r * 0.3}`} dur="1.8s" repeatCount="indefinite" />
                  )}
                </circle>
                {/* Label */}
                <text
                  x={node.x}
                  y={node.y + node.r + 20}
                  fill={COLORS[index % COLORS.length]}
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  style={{ fontFamily: 'Cairo, sans-serif', pointerEvents: 'none' }}
                >
                  {node.labelEn}
                </text>
              </g>
            ))}
          </g>

          {/* Floating particles */}
          {!reducedMotion && (
            <g opacity="0.5">
              {[...Array(6)].map((_, i) => (
                <circle key={`p-${i}`} r="2" fill={COLORS[i % COLORS.length]}>
                  <animate attributeName="cx" values={`${140 + i * 50};${180 + i * 40};${140 + i * 50}`} dur={`${4 + i * 0.5}s`} repeatCount="indefinite" />
                  <animate attributeName="cy" values={`${100 + i * 40};${160 + i * 30};${100 + i * 40}`} dur={`${5 + i * 0.4}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0.7;0.2" dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
          )}
        </svg>

        {/* Instruction */}
        <div
          style={{
            position: 'absolute',
            bottom: -50,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 14,
            fontFamily: 'Cairo, sans-serif',
            textAlign: 'center',
          }}
        >
          Click on nodes to learn more about Berard AIT benefits
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        animation: reducedMotion ? 'none' : 'scrollHint 2s ease-in-out infinite',
        zIndex: 10,
      }}>
        <div style={{
          width: 24,
          height: 38,
          border: '2px solid rgba(143,211,204,0.3)',
          borderRadius: 12,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 8,
        }}>
          <div style={{ width: 4, height: 8, background: brandCyan, borderRadius: 2 }} />
        </div>
      </div>

      {/* Info Modal */}
      <InfoModal node={activeNode} onClose={() => setActiveNode(null)} />
    </section>
  );
}
