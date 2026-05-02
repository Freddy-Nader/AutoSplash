'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface PortadaProps {
  onAdvance: () => void;
}

export default function Portada({ onAdvance }: PortadaProps) {
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
            className="absolute rounded-full border-2 border-sky-400/40"
            style={{ width: 80, height: 80 }}
            animate={{ scale: [1, 3], opacity: [0.6, 0] }}
            transition={{
              duration: 2,
              delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={`drop-${i}`}
          className="absolute w-2 h-3 bg-sky-300/70 rounded-full"
          style={{ left: `${10 + i * 14}%`, top: '-10%' }}
          animate={{ y: ['0vh', '110vh'], opacity: [0, 1, 0] }}
          transition={{
            duration: 2.5 + (i % 3) * 0.5,
            delay: i * 0.3,
            repeat: Infinity,
            ease: 'easeIn',
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-3">
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
