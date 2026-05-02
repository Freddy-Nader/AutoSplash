'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

interface MenuProps {
  onServicios: () => void;
  onContacto: () => void;
}

export default function Menu({ onServicios, onContacto }: MenuProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playFallbackBeep = () => {
    if (typeof window === 'undefined') return;
    type WindowWithWebkit = Window & {
      webkitAudioContext?: typeof AudioContext;
    };
    const w = window as WindowWithWebkit;
    const Ctx = window.AudioContext || w.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 440;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  };

  const playPromo = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => playFallbackBeep());
    } else {
      playFallbackBeep();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-soft">
      <header className="bg-primary text-white px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            💧
          </span>
          <h1 className="text-xl font-bold">AutoSplash</h1>
        </div>
        <span className="text-2xl text-white/60" aria-hidden>
          ···
        </span>
      </header>

      <div className="flex-1 px-6 py-8 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-primary leading-tight">
            Tu lavadero de
            <br />
            confianza <span aria-hidden>🚿</span>
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Servicios profesionales para tu auto
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {[
            {
              key: 'audio',
              label: '🔊  Escucha promo',
              onClick: playPromo,
              variant: 'primary' as const,
            },
            {
              key: 'servicios',
              label: '🚗  Ver servicios',
              onClick: onServicios,
              variant: 'secondary' as const,
            },
            {
              key: 'contacto',
              label: '📞  Contáctanos',
              onClick: onContacto,
              variant: 'secondary' as const,
            },
          ].map((btn, i) => (
            <motion.div
              key={btn.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            >
              <Button onClick={btn.onClick} variant={btn.variant}>
                {btn.label}
              </Button>
            </motion.div>
          ))}
        </div>

        <audio ref={audioRef} src="/audio.mp3" preload="auto" />
      </div>
    </div>
  );
}
