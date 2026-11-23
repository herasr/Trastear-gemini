import React from 'react';
import { motion } from 'motion/react';
import { revealStagger } from '../utils/ambience';
import type { AmbienceMode, AmbientTag } from '../utils/ambience';

interface SceneAmbienceProps {
  tag?: AmbientTag;
  mode: AmbienceMode;
  /** Duración de un latido en segundos (ver heartbeatSeconds). */
  heartbeat: number;
}

const MOTES = Array.from({ length: 9 }, (_, i) => ({
  left: 6 + i * 10.5,
  delay: (i * 1.7) % 7,
  duration: 7 + ((i * 1.3) % 5),
  size: 2 + (i % 3),
}));

const Motes: React.FC<{ color: string; k: number }> = ({ color, k }) => (
  <>
    {MOTES.map((m, i) => (
      <span
        key={i}
        className="absolute bottom-0 rounded-full"
        style={{
          left: `${m.left}%`,
          width: m.size,
          height: m.size,
          background: color,
          animation: `ambMote ${m.duration * k}s ease-in ${m.delay}s infinite`,
        }}
      />
    ))}
  </>
);

/**
 * Ambiente animado propio de cada entidad. Es decorativo (aria-hidden) y no
 * recibe eventos. En las escenas íntimas añade el latido o, en Nivel 0, un velo.
 */
export const SceneAmbience: React.FC<SceneAmbienceProps> = ({
  tag = 'zarza',
  mode,
  heartbeat,
}) => {
  if (mode === 'off') return null;
  const k = mode === 'intimate' ? 0.8 : 1;

  return (
    <div aria-hidden="true" className="amb-layer z-[1]">
      {tag === 'zarza' && (
        <>
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 180"
            preserveAspectRatio="none"
          >
            <g style={{ transformOrigin: '0% 100%', animation: `ambSway ${9 * k}s ease-in-out infinite` }}>
              {[
                'M-10 190 C 40 120, 20 70, 90 40 S 180 -10, 230 20',
                'M410 190 C 360 130, 380 80, 320 50 S 250 10, 210 40',
                'M120 190 C 150 140, 110 110, 160 80',
              ].map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="#3f8a5f"
                  strokeWidth="1.6"
                  strokeDasharray="620"
                  opacity="0.45"
                  style={{ animation: `ambVineGrow ${(11 + i * 2) * k}s ease-in-out ${i}s infinite alternate` }}
                />
              ))}
            </g>
          </svg>
          <Motes color="#9bd3a8" k={k} />
        </>
      )}

      {tag === 'mar' &&
        [0, 3.3, 6.6].map((delay) => (
          <div
            key={delay}
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{
              background: 'linear-gradient(to top, transparent, rgba(72,150,160,0.28), transparent)',
              animation: `ambTide ${10 * k}s ease-in-out ${delay}s infinite`,
            }}
          />
        ))}

      {tag === 'mascara' && (
        <>
          <div
            className="absolute inset-y-0 left-0 w-1/4"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(236,227,213,0.14), transparent)',
              animation: `ambSheen ${8 * k}s ease-in-out infinite`,
            }}
          />
          {[0, 1].map((delay) => (
            <div
              key={delay}
              className="absolute right-[12%] top-[8%] w-40 h-40 rounded-full blur-2xl"
              style={{
                background: 'rgba(229,190,110,0.28)',
                animation: `ambGhost ${6 * k}s ease-in-out ${delay}s infinite`,
              }}
            />
          ))}
        </>
      )}

      {tag === 'teatro' && (
        <>
          <div
            className="absolute -top-4 left-1/2 w-[70%] h-[150%]"
            style={{
              transformOrigin: '50% 0%',
              background: 'linear-gradient(to bottom, rgba(255,226,150,0.22), transparent 75%)',
              clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)',
              animation: `ambSpot ${12 * k}s ease-in-out infinite`,
            }}
          />
          <Motes color="#f3d98a" k={k} />
        </>
      )}

      {tag === 'rebano' && (
        <>
          <div
            className="absolute inset-x-0 bottom-[-30%] h-full"
            style={{
              background: 'radial-gradient(ellipse at 50% 100%, rgba(214,150,70,0.38), transparent 65%)',
              animation: `ambGlow ${7 * k}s ease-in-out infinite`,
            }}
          />
          <Motes color="#e5be6e" k={k} />
        </>
      )}

      {tag === 'cripta' && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 55%, rgba(158,27,50,0.30), transparent 70%)',
              animation: `ambBreathe ${6 * k}s ease-in-out infinite`,
            }}
          />
          {[0, 2, 4].map((delay) => (
            <div
              key={delay}
              className="absolute left-1/2 top-1/2 w-40 h-40 -ml-20 -mt-20 rounded-full border"
              style={{
                borderColor: 'rgba(197,155,78,0.35)',
                animation: `ambRing ${6 * k}s ease-out ${delay}s infinite`,
              }}
            />
          ))}
        </>
      )}

      {mode === 'veiled' &&
        ['alternate', 'alternate-reverse'].map((direction, i) => (
          <div
            key={direction}
            className="absolute inset-y-0 -inset-x-1/3 backdrop-blur-[2px]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(236,227,213,0.12), transparent)',
              animation: `ambVeil ${14 + i * 5}s ease-in-out infinite`,
              animationDirection: direction,
            }}
          />
        ))}

      {mode === 'intimate' && (
        <div
          className="absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 90px 10px rgba(158,27,50,0.55)',
            animation: `ambHeartbeat ${heartbeat}s ease-in-out infinite`,
          }}
        />
      )}
    </div>
  );
};

/** Latido a pantalla completa: solo un velo de borde, no tapa el texto. */
export const HeartbeatVignette: React.FC<{ mode: AmbienceMode; heartbeat: number }> = ({
  mode,
  heartbeat,
}) => {
  if (mode !== 'intimate') return null;
  return (
    <div
      aria-hidden="true"
      className="amb-vignette fixed inset-0 z-[15] pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at center, transparent 58%, rgba(158,27,50,0.30) 100%)',
        animation: `ambHeartbeat ${heartbeat}s ease-in-out infinite`,
      }}
    />
  );
};

interface RevealParagraphsProps {
  paragraphs: string[];
  mode: AmbienceMode;
  className?: string;
  /** Cambia cuando la escena o el nivel cambian, para repetir la aparición. */
  scope: string;
}

/** Los párrafos aparecen uno a uno, más despacio en las escenas íntimas. */
export const RevealParagraphs: React.FC<RevealParagraphsProps> = ({
  paragraphs,
  mode,
  className,
  scope,
}) => {
  const stagger = revealStagger(mode);
  return (
    <>
      {paragraphs.map((text, i) =>
        mode === 'off' ? (
          <p key={`${scope}-${i}`} className={className}>
            {text}
          </p>
        ) : (
          <motion.p
            key={`${scope}-${i}`}
            className={className}
            initial={{ opacity: 0, y: 8, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: mode === 'intimate' ? 1.1 : 0.6,
              delay: i * stagger,
              ease: 'easeOut',
            }}
          >
            {text}
          </motion.p>
        ),
      )}
    </>
  );
};
