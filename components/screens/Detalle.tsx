'use client';

import { motion } from 'framer-motion';
import BackButton from '@/components/ui/BackButton';
import Button from '@/components/ui/Button';
import type { Service } from '@/types/service';

interface DetalleProps {
  service: Service | null;
  onBack: () => void;
  onReservar: () => void;
}

interface DetailRowProps {
  label: string;
  value: string;
  index: number;
}

function DetailRow({ label, value, index }: DetailRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.3 }}
      className="bg-white rounded-2xl p-4 flex justify-between items-start"
      style={{ boxShadow: '0 4px 16px rgba(30, 58, 95, 0.12)' }}
    >
      <span className="text-xs uppercase tracking-widest text-slate-400 font-medium">
        {label}
      </span>
      <span className="text-sm font-semibold text-primary text-right max-w-[60%]">
        {value}
      </span>
    </motion.div>
  );
}

export default function Detalle({ service, onBack, onReservar }: DetalleProps) {
  if (!service) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-soft">
        <p className="text-slate-500">Sin servicio seleccionado</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-soft">
      <header className="bg-primary text-white px-5 py-4">
        <BackButton onClick={onBack} label="Detalle" />
      </header>

      <div
        className="px-6 py-10 text-white text-center"
        style={{
          background: 'linear-gradient(90deg, #1E3A5F 0%, #38BDF8 100%)',
        }}
      >
        <p className="text-xs uppercase tracking-widest text-white/70 mb-2">
          Servicio
        </p>
        <h2 className="text-2xl font-bold">{service.nombre}</h2>
      </div>

      <div className="flex-1 px-5 py-5 overflow-y-auto flex flex-col gap-3">
        <DetailRow label="Servicio" value={service.nombre} index={0} />
        <DetailRow label="Precio" value={service.precio} index={1} />
        <DetailRow label="Descripción" value={service.descripcion} index={2} />
        <DetailRow label="Duración" value={service.duracion} index={3} />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mt-4"
        >
          <Button onClick={onReservar} variant="primary">
            Reservar ahora
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
