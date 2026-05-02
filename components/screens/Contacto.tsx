'use client';

import { motion } from 'framer-motion';
import BackButton from '@/components/ui/BackButton';

interface ContactoProps {
  onBack: () => void;
}

interface InfoCardProps {
  icon: string;
  title: string;
  children: React.ReactNode;
  index: number;
}

function InfoCard({ icon, title, children, index }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-2 text-primary">
        <span className="text-xl" aria-hidden>
          {icon}
        </span>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <div
        className="bg-white rounded-2xl p-4"
        style={{ boxShadow: '0 4px 16px rgba(30, 58, 95, 0.12)' }}
      >
        {children}
      </div>
    </motion.div>
  );
}

export default function Contacto({ onBack }: ContactoProps) {
  return (
    <div className="flex-1 flex flex-col bg-gray-soft">
      <header className="bg-primary text-white px-5 py-4">
        <BackButton onClick={onBack} label="Contacto" />
      </header>

      <div className="flex-1 px-5 py-6 overflow-y-auto flex flex-col gap-5">
        <InfoCard icon="📍" title="Dónde estamos" index={0}>
          <p className="text-sm text-primary leading-relaxed">
            Av. Siempre Limpia 101,
            <br />
            CDMX
          </p>
        </InfoCard>

        <InfoCard icon="📞" title="Teléfono" index={1}>
          <a
            href="tel:5512345678"
            className="text-base font-semibold text-accent-dark"
          >
            55-1234-5678
          </a>
        </InfoCard>

        <InfoCard icon="🕐" title="Horario" index={2}>
          <p className="text-sm text-primary leading-relaxed">
            Lun–Dom
            <br />
            8:00 – 20:00
          </p>
        </InfoCard>

        <motion.a
          href="https://wa.me/525512345678"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="w-full min-h-[56px] rounded-full font-semibold text-base flex items-center justify-center gap-2 bg-success text-white active:scale-[0.97] transition-transform mt-2"
          style={{
            backgroundColor: '#4ADE80',
            boxShadow: '0 8px 24px rgba(74, 222, 128, 0.35)',
          }}
        >
          <span aria-hidden>💬</span>
          <span>WhatsApp</span>
        </motion.a>
      </div>
    </div>
  );
}
