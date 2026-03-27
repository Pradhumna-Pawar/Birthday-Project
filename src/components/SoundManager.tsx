"use client";
import { useEffect, useRef, useCallback } from "react";

interface SoundManagerProps {
  muted: boolean;
  phase: string;
}

export default function SoundManager({ muted, phase }: SoundManagerProps) {
  const audioCtx = useRef<AudioContext | null>(null);
  const engineNodes = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);
  const rumbleRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);

  const getCtx = useCallback(() => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtx.current;
  }, []);

  const stopEngine = useCallback(() => {
    if (engineNodes.current) {
      try {
        engineNodes.current.gain.gain.setTargetAtTime(0, getCtx().currentTime, 0.3);
        setTimeout(() => {
          engineNodes.current?.osc.stop();
          engineNodes.current = null;
        }, 600);
      } catch {}
    }
    if (rumbleRef.current) {
      try {
        rumbleRef.current.gain.gain.setTargetAtTime(0, getCtx().currentTime, 0.3);
        setTimeout(() => {
          rumbleRef.current?.osc.stop();
          rumbleRef.current = null;
        }, 600);
      } catch {}
    }
  }, [getCtx]);

  const startEngine = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();

    // High oscillator (engine whine)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const dist = ctx.createWaveShaper();

    // Distortion curve for engine texture
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = (Math.PI + 300) * x / (Math.PI + 300 * Math.abs(x));
    }
    dist.curve = curve;

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 1.5);
    osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 3);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.4);

    osc.connect(dist);
    dist.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    engineNodes.current = { osc, gain };

    // Low rumble layer
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "square";
    osc2.frequency.setValueAtTime(40, ctx.currentTime);
    osc2.frequency.linearRampToValueAtTime(100, ctx.currentTime + 1.5);
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.3);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start();
    rumbleRef.current = { osc: osc2, gain: gain2 };
  }, [muted, getCtx]);

  const playCelebration = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();

    // Play a little fanfare
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
    const times = [0, 0.15, 0.3, 0.5, 0.7, 0.85];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + times[i]);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + times[i] + 0.05);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + times[i] + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + times[i]);
      osc.stop(ctx.currentTime + times[i] + 0.3);
    });
  }, [muted, getCtx]);

  useEffect(() => {
    if (phase === "car-enters") {
      startEngine();
    } else if (phase === "car-stops" || phase === "cockpit-opens") {
      stopEngine();
    } else if (phase === "driver-reveal") {
      playCelebration();
    }
  }, [phase, startEngine, stopEngine, playCelebration]);

  // Handle mute toggle
  useEffect(() => {
    if (muted) {
      stopEngine();
    } else {
      const ctx = getCtx();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
    }
  }, [muted, stopEngine, getCtx]);

  return null;
}
