'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface PortadaProps {
  onAdvance: () => void;
}

export default function Portada({ onAdvance }: PortadaProps) {
  const [animationData, setAnimationData] = useState<unknown | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/animation.json')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(onAdvance, 3000);
    return () => clearTimeout(t);
  }, [onAdvance]);

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #0F2744 0%, #1E3A5F 50%, #2A4F7C 100%)',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[0, 0.4, 0.8].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-sky-400/30"
            style={{ width: 100, height: 100 }}
            animate={{ scale: [1, 3], opacity: [0.5, 0] }}
            transition={{
              duration: 2,
              delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-64 h-64 -mt-8"
      >
        {animationData ? (
          <Lottie animationData={animationData} loop autoplay />
        ) : null}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative z-10 text-center -mt-2"
      >
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-2">
          AutoSplash
        </h1>
        <p className="text-lg text-sky-300 italic">
          Tu auto, siempre reluciente
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-12 flex gap-2 z-10"
      >
        <span className="w-2 h-2 rounded-full bg-accent" />
        <span className="w-2 h-2 rounded-full bg-white/30" />
        <span className="w-2 h-2 rounded-full bg-white/30" />
        <span className="w-2 h-2 rounded-full bg-white/30" />
        <span className="w-2 h-2 rounded-full bg-white/30" />
      </motion.div>
    </div>
  );
}
