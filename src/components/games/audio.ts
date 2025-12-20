import type React from 'react';

export type NoiseHandle = {
  src: AudioBufferSourceNode;
  gain: GainNode;
};

export type AudioRef = React.MutableRefObject<AudioContext | null>;
export type NoiseRef = React.MutableRefObject<NoiseHandle | null>;

// Extend Window interface for webkit prefix support
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export const ensureAudio = (ref: AudioRef): AudioContext => {
  if (ref.current && ref.current.state === 'closed') {
    ref.current = null;
  }
  if (!ref.current) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) throw new Error('Web Audio API not supported');
    ref.current = new AudioCtx();
  }
  return ref.current;
};

export const safeCloseAudio = async (ref: AudioRef) => {
  try {
    await ref.current?.close();
  } catch {
    // ignore
  }
  ref.current = null;
};

const makeNoiseBuffer = (audio: AudioContext, seconds = 1.6, amp = 0.22) => {
  const length = Math.max(1, Math.floor(audio.sampleRate * seconds));
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * amp;
  }
  return buffer;
};

const calcLowPassAlpha = (freq: number, sampleRate: number) => {
  const rc = 1 / (2 * Math.PI * freq);
  const dt = 1 / sampleRate;
  return dt / (rc + dt);
};

const calcHighPassAlpha = (freq: number, sampleRate: number) => {
  const rc = 1 / (2 * Math.PI * freq);
  const dt = 1 / sampleRate;
  return rc / (rc + dt);
};

const applyFade = (data: Float32Array, sampleRate: number, seconds: number) => {
  const fadeSamples = Math.min(Math.floor(sampleRate * seconds), Math.floor(data.length / 2));
  for (let i = 0; i < fadeSamples; i++) {
    const fade = i / fadeSamples;
    data[i] *= fade;
    data[data.length - 1 - i] *= fade;
  }
};

const makeBabbleBuffer = (audio: AudioContext, seconds = 2.4, amp = 0.6, talkers = 6) => {
  const length = Math.max(1, Math.floor(audio.sampleRate * seconds));
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  const sampleRate = audio.sampleRate;

  const minSegment = Math.floor(sampleRate * 0.05);
  const maxSegment = Math.floor(sampleRate * 0.12);
  const talkerAmp = amp / Math.max(1, talkers);

  for (let t = 0; t < talkers; t++) {
    const lowCut = 200 + Math.random() * 200;
    const highCut = 2500 + Math.random() * 2000;
    const hpAlpha = calcHighPassAlpha(lowCut, sampleRate);
    const lpAlpha = calcLowPassAlpha(highCut, sampleRate);

    let hp = 0;
    let lp = 0;
    let prevX = 0;
    let env = 0.3 + Math.random() * 0.4;
    let envTarget = env;
    let envSamplesLeft = 0;
    let envStep = 0;

    for (let i = 0; i < length; i++) {
      if (envSamplesLeft <= 0) {
        envTarget = 0.2 + Math.random() * 0.8;
        envSamplesLeft = minSegment + Math.floor(Math.random() * (maxSegment - minSegment + 1));
        envStep = (envTarget - env) / envSamplesLeft;
      }

      env += envStep;
      envSamplesLeft -= 1;

      const x = Math.random() * 2 - 1;
      hp = hpAlpha * (hp + x - prevX);
      prevX = x;
      lp += lpAlpha * (hp - lp);
      data[i] += lp * env * talkerAmp;
    }
  }

  let peak = 0;
  for (let i = 0; i < length; i++) {
    peak = Math.max(peak, Math.abs(data[i]));
  }
  if (peak > 1) {
    const scale = 0.98 / peak;
    for (let i = 0; i < length; i++) {
      data[i] *= scale;
    }
  }

  applyFade(data, sampleRate, 0.02);
  return buffer;
};

export const stopNoise = (noiseRef: NoiseRef) => {
  try {
    noiseRef.current?.src.stop();
  } catch {
    // ignore
  }
  noiseRef.current = null;
};

/**
 * Starts (or updates) a looping white-noise bed. The level is clamped for comfort.
 */
export const setNoiseLevel = (audio: AudioContext, noiseRef: NoiseRef, level: number) => {
  const gainValue = Math.max(0, Math.min(0.22, level));

  if (!noiseRef.current) {
    const src = audio.createBufferSource();
    src.buffer = makeNoiseBuffer(audio, 1.8, 0.22);
    src.loop = true;

    const gain = audio.createGain();
    gain.gain.value = gainValue;

    src.connect(gain);
    gain.connect(audio.destination);
    src.start();

    noiseRef.current = { src, gain };
    return;
  }

  noiseRef.current.gain.gain.setTargetAtTime(gainValue, audio.currentTime, 0.12);
};

/**
 * Starts (or updates) a looping multitalker babble bed. The level is clamped for comfort.
 */
export const setBabbleNoiseLevel = (audio: AudioContext, noiseRef: NoiseRef, level: number) => {
  const gainValue = Math.max(0, Math.min(0.22, level));

  if (!noiseRef.current) {
    const src = audio.createBufferSource();
    src.buffer = makeBabbleBuffer(audio, 2.4, 0.6, 6);
    src.loop = true;

    const gain = audio.createGain();
    gain.gain.value = gainValue;

    src.connect(gain);
    gain.connect(audio.destination);
    src.start();

    noiseRef.current = { src, gain };
    return;
  }

  noiseRef.current.gain.gain.setTargetAtTime(gainValue, audio.currentTime, 0.12);
};

export type ToneOpts = {
  freq: number;
  duration?: number;
  volume?: number;
  type?: OscillatorType;
  pan?: number; // -1 left, +1 right
  when?: number; // seconds, AudioContext time
};

/**
 * Plays a short tone using WebAudio. Returns the tone end time (AudioContext time).
 */
export const playTone = (audio: AudioContext, opts: ToneOpts): number => {
  const {
    freq,
    duration = 0.28,
    volume = 0.22,
    type = 'sine',
    pan = 0,
    when = audio.currentTime,
  } = opts;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;

  // envelope to avoid clicks
  gain.gain.value = 0.0001;
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), when + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

  // stereo pan when supported
  let node: AudioNode = gain;
  if (typeof audio.createStereoPanner === 'function') {
    try {
      const panner = audio.createStereoPanner();
      panner.pan.value = Math.max(-1, Math.min(1, pan));
      gain.connect(panner);
      node = panner;
    } catch {
      // ignore pan errors on older browsers
    }
  }

  osc.connect(gain);
  node.connect(audio.destination);

  osc.start(when);
  osc.stop(when + duration + 0.03);

  return when + duration;
};
