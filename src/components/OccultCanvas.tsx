import React, { useEffect, useRef } from 'react';

interface OccultCanvasProps {
  corruptionRatio: number; // 0 (pure) to 1 (corrupted)
  ambientTag?: 'zarza' | 'mar' | 'mascara' | 'rebano' | 'cripta' | 'teatro';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  phase: number;
}

export const OccultCanvas: React.FC<OccultCanvasProps> = ({
  corruptionRatio,
  ambientTag = 'zarza',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motionMedia =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    let prefersReduced = Boolean(motionMedia?.matches);

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = prefersReduced ? 14 : 56;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: -0.18 - Math.random() * 0.42,
      radius: 0.9 + Math.random() * 2.4,
      alpha: 0.16 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }));

    const getPalette = () => {
      switch (ambientTag) {
        case 'mar':
          return { primary: '46, 125, 123', secondary: '197, 155, 78' };
        case 'mascara':
          return { primary: '197, 155, 78', secondary: '168, 28, 52' };
        case 'rebano':
          return { primary: '122, 139, 75', secondary: '168, 28, 52' };
        case 'cripta':
          return { primary: '168, 28, 52', secondary: '197, 155, 78' };
        case 'teatro':
          return { primary: '212, 168, 70', secondary: '168, 28, 52' };
        default: // zarza
          return { primary: '168, 28, 52', secondary: '197, 155, 78' };
      }
    };

    let t = 0;
    const render = () => {
      if (!prefersReduced) {
        t += 0.007;
      }
      ctx.clearRect(0, 0, width, height);

      const { primary, secondary } = getPalette();

      // Atmospheric radial aura
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.32,
        30,
        width * 0.5,
        height * 0.38,
        Math.max(width, height) * 0.68
      );
      const auraAlpha = 0.11 + corruptionRatio * 0.14;
      grad.addColorStop(0, `rgba(${primary}, ${auraAlpha})`);
      grad.addColorStop(0.45, `rgba(${secondary}, ${auraAlpha * 0.4})`);
      grad.addColorStop(1, 'rgba(9, 8, 12, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Rotating astrolabe ritual arcs in background
      ctx.save();
      ctx.translate(width * 0.5, height * 0.44);
      const baseR = Math.min(width, height) * 0.34;
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.rotate(t * (i % 2 === 0 ? 0.12 : -0.09) + i * 0.7);
        ctx.strokeStyle = `rgba(${secondary}, ${0.055 + corruptionRatio * 0.045})`;
        ctx.lineWidth = 1;
        if (i === 1) ctx.setLineDash([8, 14]);
        ctx.beginPath();
        const r = baseR + i * 54 + Math.sin(t + i) * 4;
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();

      // Drifting golden embers / pollen motes with subtle glow
      particles.forEach((p) => {
        if (!prefersReduced) {
          p.x += p.vx + Math.sin(t * 1.4 + p.phase) * 0.22;
          p.y += p.vy * (1 + corruptionRatio * 0.55);
          if (p.y < -12) {
            p.y = height + 12;
            p.x = Math.random() * width;
          }
          if (p.x < -12) p.x = width + 12;
          if (p.x > width + 12) p.x = -12;
        }
        const flicker = prefersReduced ? 0.85 : 0.75 + 0.25 * Math.sin(t * 3 + p.phase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.phase > 3.14 ? primary : secondary}, ${
          p.alpha * flicker
        })`;
        ctx.fill();
      });

      if (!prefersReduced) {
        animId = requestAnimationFrame(render);
      }
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReduced = e.matches;
      cancelAnimationFrame(animId);
      render();
    };
    motionMedia?.addEventListener('change', handleMotionChange);

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      motionMedia?.removeEventListener('change', handleMotionChange);
    };
  }, [corruptionRatio, ambientTag]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-90"
    />
  );
};
