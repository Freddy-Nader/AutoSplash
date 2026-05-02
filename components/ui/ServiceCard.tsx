'use client';

import { motion } from 'framer-motion';
import type { Service } from '@/types/service';

interface ServiceCardProps {
  service: Service;
  index: number;
  onClick: () => void;
}

const iconForService = (nombre: string): string => {
  const lower = nombre.toLowerCase();
  if (lower.includes('encerado')) return '🏅';
  if (lower.includes('completo')) return '✨';
  return '🚿';
};

export default function ServiceCard({ service, index, onClick }: ServiceCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="w-full bg-white rounded-2xl p-4 flex items-center justify-between text-left active:scale-[0.97] transition-transform"
      style={{ boxShadow: '0 4px 16px rgba(30, 58, 95, 0.12)' }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-3xl flex-shrink-0" aria-hidden>
          {iconForService(service.nombre)}
        </span>
        <span className="text-lg font-semibold text-primary truncate">
          {service.nombre}
        </span>
      </div>
      <span className="bg-accent text-white text-sm font-bold px-3 py-1 rounded-full flex-shrink-0 ml-2">
        {service.precio}
      </span>
    </motion.button>
  );
}
