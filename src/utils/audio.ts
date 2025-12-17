/**
 * Shared AudioContext utility
 * Prevents memory leaks by reusing a single AudioContext instance
 * Automatically handles browser autoplay restrictions
 */

type AudioContextType = typeof AudioContext;

// Get the correct AudioContext constructor (cross-browser)
const getAudioContextClass = (): AudioContextType | null => {
  if (typeof window === 'undefined') return null;
  return window.AudioContext || (window as unknown as { webkitAudioContext: AudioContextType }).webkitAudioContext || null;
};

// Singleton AudioContext instance
let sharedContext: AudioContext | null = null;
let contextResumePromise: Promise<void> | null = null;

/**
 * Get the shared AudioContext instance
 * Creates one if it doesn't exist, resumes if suspended
 */
export const getAudioContext = async (): Promise<AudioContext | null> => {
  const AudioContextClass = getAudioContextClass();
  if (!AudioContextClass) return null;

  if (!sharedContext) {
    try {
      sharedContext = new AudioContextClass();
    } catch {
      return null;
    }
  }

  // Resume context if suspended (browser autoplay policy)
  if (sharedContext.state === 'suspended') {
    if (!contextResumePromise) {
      contextResumePromise = sharedContext.resume().finally(() => {
        contextResumePromise = null;
      });
    }
    await contextResumePromise;
  }

  return sharedContext;
};

/**
 * Play a simple tone/beep
 */
export const playTone = async (
  frequency: number,
  duration: number,
  options?: {
    type?: OscillatorType;
    volume?: number;
    rampTo?: number;
  }
): Promise<void> => {
  const ctx = await getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = options?.type || 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    if (options?.rampTo) {
      osc.frequency.exponentialRampToValueAtTime(options.rampTo, ctx.currentTime + duration);
    }

    gain.gain.setValueAtTime(options?.volume ?? 0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio unavailable
  }
};

/**
 * Play selection feedback sound
 */
export const playSelectSound = async (selected: boolean): Promise<void> => {
  await playTone(
    selected ? 880 : 440,
    0.12,
    {
      type: 'sine',
      volume: 0.06,
      rampTo: selected ? 1200 : 300,
    }
  );
};

/**
 * Play radar ping sound
 */
export const playRadarPing = async (): Promise<void> => {
  const ctx = await getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // Audio unavailable
  }
};

/**
 * Play launch/rocket sound
 */
export const playLaunchSound = async (): Promise<void> => {
  const ctx = await getAudioContext();
  if (!ctx) return;

  try {
    // Bass rumble
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(60, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);
    gain1.gain.setValueAtTime(0.12, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.4);

    // High whistle
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1200, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
    gain2.gain.setValueAtTime(0.08, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start();
    osc2.stop(ctx.currentTime + 0.2);
  } catch {
    // Audio unavailable
  }
};

/**
 * Play explosion sound
 */
export const playExplosionSound = async (): Promise<void> => {
  const ctx = await getAudioContext();
  if (!ctx) return;

  try {
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + 0.4);
  } catch {
    // Audio unavailable
  }
};

/**
 * Cleanup - close the shared AudioContext
 * Call this when the app unmounts if needed
 */
export const closeAudioContext = (): void => {
  if (sharedContext) {
    sharedContext.close();
    sharedContext = null;
  }
};
