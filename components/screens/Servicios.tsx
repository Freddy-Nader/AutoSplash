'use client';

import BackButton from '@/components/ui/BackButton';
import ServiceCard from '@/components/ui/ServiceCard';
import services from '@/data/services.json';
import type { Service } from '@/types/service';

interface ServiciosProps {
  onBack: () => void;
  onSelect: (service: Service) => void;
}

export default function Servicios({ onBack, onSelect }: ServiciosProps) {
  const list = services as Service[];

  return (
    <div className="flex-1 flex flex-col bg-gray-soft">
      <header className="bg-primary text-white px-5 py-4">
        <BackButton onClick={onBack} />
      </header>

      <div className="flex-1 px-5 py-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-primary mb-5">
          Nuestros servicios
        </h2>

        <div className="flex flex-col gap-3">
          {list.map((service, i) => (
            <ServiceCard
              key={service.nombre}
              service={service}
              index={i}
              onClick={() => onSelect(service)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
