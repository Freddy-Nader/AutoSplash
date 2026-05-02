'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Portada from '@/components/screens/Portada';
import Menu from '@/components/screens/Menu';
import Servicios from '@/components/screens/Servicios';
import Detalle from '@/components/screens/Detalle';
import Contacto from '@/components/screens/Contacto';
import type { Service } from '@/types/service';

type Screen = 'portada' | 'menu' | 'servicios' | 'detalle' | 'contacto';
type Direction = 'forward' | 'back';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('portada');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [navDirection, setNavDirection] = useState<Direction>('forward');

  const navigate = (screen: Screen, direction: Direction = 'forward') => {
    setNavDirection(direction);
    setCurrentScreen(screen);
  };

  const selectService = (service: Service) => {
    setSelectedService(service);
    navigate('detalle');
  };

  const forwardX = navDirection === 'forward' ? '100%' : '-100%';
  const exitX = navDirection === 'forward' ? '-100%' : '100%';

  const renderScreen = () => {
    switch (currentScreen) {
      case 'portada':
        return <Portada onAdvance={() => navigate('menu')} />;
      case 'menu':
        return (
          <Menu
            onServicios={() => navigate('servicios')}
            onContacto={() => navigate('contacto')}
          />
        );
      case 'servicios':
        return (
          <Servicios
            onBack={() => navigate('menu', 'back')}
            onSelect={selectService}
          />
        );
      case 'detalle':
        return (
          <Detalle
            service={selectedService}
            onBack={() => navigate('servicios', 'back')}
            onReservar={() => navigate('contacto')}
          />
        );
      case 'contacto':
        return <Contacto onBack={() => navigate('menu', 'back')} />;
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={currentScreen}
        initial={{ x: forwardX, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: exitX, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute inset-0 flex flex-col"
      >
        {renderScreen()}
      </motion.div>
    </AnimatePresence>
  );
}
