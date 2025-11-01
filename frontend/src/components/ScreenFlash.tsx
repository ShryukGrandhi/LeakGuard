import React, { useEffect, useState } from 'react';

interface ScreenFlashProps {
  color: 'red' | 'green' | 'blue';
  trigger: boolean;
}

export function ScreenFlash({ color, trigger }: ScreenFlashProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!show) return null;

  const colors = {
    red: 'bg-red-500/20',
    green: 'bg-green-500/20',
    blue: 'bg-blue-500/20'
  };

  return (
    <div className={`fixed inset-0 ${colors[color]} pointer-events-none z-[70] animate-flash`} />
  );
}

