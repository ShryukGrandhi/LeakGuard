import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface ParticleEffectProps {
  type: 'explosion' | 'money' | 'success';
  x: number;
  y: number;
  onComplete: () => void;
}

export function ParticleEffect({ type, x, y, onComplete }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const particleCount = type === 'explosion' ? 30 : 20;
    const colors = {
      explosion: ['#ef4444', '#f97316', '#fbbf24'],
      money: ['#22c55e', '#10b981', '#34d399'],
      success: ['#3b82f6', '#60a5fa', '#93c5fd']
    };

    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10 - 5,
      life: 1,
      color: colors[type][Math.floor(Math.random() * colors[type].length)]
    }));

    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => {
        const updated = prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.5, // gravity
          life: p.life - 0.02
        })).filter(p => p.life > 0);

        if (updated.length === 0) {
          clearInterval(interval);
          setTimeout(onComplete, 100);
        }

        return updated;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [type, x, y, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: p.x,
            top: p.y,
            backgroundColor: p.color,
            opacity: p.life,
            boxShadow: `0 0 10px ${p.color}`
          }}
        />
      ))}
    </div>
  );
}

