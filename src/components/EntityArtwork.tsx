import React, { useEffect, useState } from 'react';
import { BestiaryEntity, Investigator } from '../types/game';
import {
  getEntityPlateMeta,
  INVESTIGATOR_PORTRAITS,
} from '../data/artworkAssets';

export const EntityArtwork: React.FC<{
  artworkKey: BestiaryEntity['artworkKey'];
  className?: string;
  compact?: boolean;
}> = ({ artworkKey, className = 'w-full h-full', compact = false }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const meta = getEntityPlateMeta(artworkKey);

  useEffect(() => {
    setImgFailed(false);
  }, [artworkKey]);

  return (
    <div
      className={`relative overflow-hidden bg-[#09080c] select-none ${className}`}
      style={{ backgroundImage: meta.fallbackGradient }}
    >
      {/* Rich painterly base image */}
      {!imgFailed && (
        <img
          src={meta.imageSrc}
          alt={`Lámina tarot de ${artworkKey}`}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500"
        />
      )}

      {/* Measured dark contrast & color-grade scrim */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${meta.tintOverlay}`}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-radial from-transparent via-transparent to-[#09080c]/75"
        aria-hidden="true"
      />

      {/* Bespoke Occult Filigree & Sigil Medallion Overlay */}
      <svg
        viewBox="0 0 240 300"
        className="relative z-10 w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Ilustración tarot de ${artworkKey}`}
      >
        <defs>
          <filter id={`glow-${artworkKey}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Double antique brass frame */}
        <rect
          x="7"
          y="7"
          width="226"
          height="286"
          rx="9"
          stroke="#E5BE6E"
          strokeOpacity="0.55"
          strokeWidth="1.2"
        />
        <rect
          x="13"
          y="13"
          width="214"
          height="274"
          rx="6"
          stroke="#C59B4E"
          strokeOpacity="0.28"
          strokeWidth="0.9"
        />

        {/* Corner filigree */}
        <path
          d="M14 28 L14 14 L28 14 M212 14 L226 14 L226 28 M14 272 L14 286 L28 286 M212 286 L226 286 L226 272"
          stroke="#E5BE6E"
          strokeWidth="1.5"
          strokeOpacity="0.8"
        />

        {/* Top Roman Numeral Cartouche */}
        {!compact && (
          <g>
            <path
              d="M94 13 L146 13 L138 30 L102 30 Z"
              fill="#09080C"
              fillOpacity="0.82"
              stroke="#C59B4E"
              strokeOpacity="0.65"
            />
            <text
              x="120"
              y="25"
              textAnchor="middle"
              fill="#E5BE6E"
              fontSize="11"
              fontFamily="Cormorant Garamond, Georgia, serif"
              fontWeight="600"
              letterSpacing="2"
            >
              {meta.roman}
            </text>
          </g>
        )}

        {/* Luminous Tarot Sigil Halo */}
        <circle
          cx="120"
          cy="152"
          r="66"
          stroke="#E5BE6E"
          strokeOpacity="0.26"
          strokeDasharray="3 5"
        />
        <circle
          cx="120"
          cy="152"
          r="48"
          stroke={meta.accentHex}
          strokeOpacity="0.48"
          strokeWidth="1.1"
        />

        {/* Entity-distinctive luminous sigil overlay */}
        <g filter={`url(#glow-${artworkKey})`}>
          {artworkKey === 'ninfa' && (
            <>
              <path
                d="M120 98 C104 120, 105 152, 120 178 C135 152, 136 120, 120 98 Z"
                stroke="#ECE3D5"
                strokeOpacity="0.85"
                strokeWidth="1.4"
              />
              <path
                d="M92 184 Q120 156 148 184 M88 128 L76 122 M152 128 L164 122"
                stroke="#D43750"
                strokeWidth="1.5"
              />
              <circle cx="120" cy="134" r="7" stroke="#E5BE6E" strokeWidth="1.4" />
              <circle cx="120" cy="134" r="2.5" fill="#D43750" />
            </>
          )}

          {artworkKey === 'confidente' && (
            <>
              <ellipse
                cx="120"
                cy="150"
                rx="32"
                ry="48"
                stroke="#E5BE6E"
                strokeOpacity="0.85"
                strokeWidth="1.5"
              />
              <path
                d="M120 100 L120 200 M95 138 Q120 150 145 138 M95 162 Q120 174 145 162"
                stroke="#ECE3D5"
                strokeOpacity="0.7"
                strokeWidth="1.2"
              />
            </>
          )}

          {artworkKey === 'vastago' && (
            <>
              <ellipse
                cx="120"
                cy="150"
                rx="30"
                ry="42"
                stroke="#6AD1CC"
                strokeWidth="1.6"
              />
              <ellipse
                cx="120"
                cy="150"
                rx="14"
                ry="24"
                fill="#09080C"
                fillOpacity="0.7"
                stroke="#ECE3D5"
                strokeWidth="1.2"
              />
              <path
                d="M72 198 Q96 184 120 198 T168 198"
                stroke="#6AD1CC"
                strokeWidth="1.4"
              />
            </>
          )}

          {artworkKey === 'coro' && (
            <>
              <path
                d="M90 112 C104 145, 96 182, 92 206 L148 206 C144 182, 136 145, 150 112 Z"
                stroke="#ECE3D5"
                strokeOpacity="0.82"
                strokeWidth="1.4"
              />
              <ellipse
                cx="120"
                cy="142"
                rx="16"
                ry="22"
                stroke="#D43750"
                strokeDasharray="2 3"
              />
            </>
          )}

          {artworkKey === 'senora' && (
            <>
              <path
                d="M98 118 L108 98 L120 112 L132 98 L142 118 Z"
                stroke="#E5BE6E"
                strokeWidth="1.5"
              />
              <circle cx="120" cy="144" r="18" stroke="#6AD1CC" strokeWidth="1.4" />
              <path
                d="M102 152 C88 176, 90 198, 102 212 M138 152 C152 176, 150 198, 138 212"
                stroke="#6AD1CC"
                strokeWidth="1.5"
              />
            </>
          )}

          {artworkKey === 'sacerdote' && (
            <>
              <path
                d="M96 116 C96 96, 144 96, 144 116 L144 158 C144 182, 120 194, 120 194 C120 194, 96 182, 96 158 Z"
                stroke="#E5BE6E"
                strokeWidth="1.5"
              />
              <path
                d="M106 138 L134 138 M104 150 L136 150"
                stroke="#D43750"
                strokeWidth="1.5"
              />
            </>
          )}

          {artworkKey === 'doblada' && (
            <>
              <circle cx="120" cy="150" r="34" stroke="#D43750" strokeWidth="1.5" />
              <circle cx="106" cy="142" r="11" stroke="#ECE3D5" strokeOpacity="0.85" />
              <circle cx="134" cy="142" r="11" stroke="#ECE3D5" strokeOpacity="0.85" />
              <circle cx="120" cy="164" r="12" stroke="#E5BE6E" />
            </>
          )}

          {artworkKey === 'cabra' && (
            <>
              <path
                d="M104 126 C88 100, 74 106, 78 122 C82 132, 96 132, 104 136 M136 126 C152 100, 166 106, 162 122 C158 132, 144 132, 136 136"
                stroke="#E5BE6E"
                strokeWidth="1.7"
              />
              <circle cx="120" cy="150" r="18" stroke="#ECE3D5" strokeWidth="1.4" />
              <path d="M120 132 L120 202 M102 184 L138 184" stroke="#E5BE6E" strokeWidth="1.3" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

export const InvestigatorCrest: React.FC<{
  portraitKey: Investigator['portraitKey'];
  name?: string;
  className?: string;
}> = ({ portraitKey, name, className = 'w-full h-full' }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const portrait = INVESTIGATOR_PORTRAITS[portraitKey];

  useEffect(() => {
    setImgFailed(false);
  }, [portraitKey]);

  const palette = (() => {
    switch (portraitKey) {
      case 'elena':
        return { bg: '#26131c', ring: '#d43750', glow: '#e5be6e' };
      case 'lara':
        return { bg: '#1b1626', ring: '#c59b4e', glow: '#ece3d5' };
      case 'eduard':
        return { bg: '#171b24', ring: '#6ad1cc', glow: '#e5be6e' };
      case 'leonor':
        return { bg: '#24151e', ring: '#e5be6e', glow: '#d43750' };
      case 'marisa':
        return { bg: '#261a12', ring: '#d4892a', glow: '#ece3d5' };
      case 'sofia':
        return { bg: '#221421', ring: '#d43750', glow: '#c59b4e' };
      case 'flor':
        return { bg: '#192219', ring: '#8ec49e', glow: '#e5be6e' };
      case 'marina':
        return { bg: '#112224', ring: '#6ad1cc', glow: '#c59b4e' };
    }
  })();

  if (!imgFailed && portrait?.imageSrc) {
    return (
      <div
        className={`relative overflow-hidden rounded-xl border bg-[#09080c] shadow-inner select-none ${className}`}
        style={{
          borderColor: `${portrait.ringHex}88`,
          backgroundColor: portrait.fallbackBg,
        }}
      >
        <img
          src={portrait.imageSrc}
          alt={name ? `Retrato de ${name}` : `Retrato de investigador`}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover object-top"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-[#e5be6e]/25 bg-gradient-to-t from-[#09080c]/35 via-transparent to-transparent"
        />
      </div>
    );
  }

  const symbol = (() => {
    switch (portraitKey) {
      case 'elena':
        return (
          <>
            <circle cx="28" cy="28" r="14" stroke="#E5BE6E" strokeWidth="1.3" />
            <path d="M28 12 L28 44 M16 28 L40 28" stroke="#D43750" strokeWidth="1.4" />
            <circle cx="28" cy="28" r="4.5" fill="#09080C" stroke="#ECE3D5" strokeWidth="1.3" />
          </>
        );
      case 'lara':
        return (
          <>
            <path d="M28 10 L42 28 L28 46 L14 28 Z" stroke="#E5BE6E" strokeWidth="1.3" />
            <path d="M28 16 L28 40 M20 26 L36 26" stroke="#ECE3D5" strokeWidth="1.5" />
          </>
        );
      case 'eduard':
        return (
          <>
            <rect x="14" y="15" width="28" height="26" rx="3" stroke="#E5BE6E" strokeWidth="1.3" />
            <circle cx="28" cy="28" r="7" stroke="#ECE3D5" strokeWidth="1.4" />
            <circle cx="28" cy="28" r="2.5" fill="#D43750" />
          </>
        );
      case 'leonor':
        return (
          <>
            <path d="M14 16 L28 21 L42 16 L42 38 L28 43 L14 38 Z" stroke="#E5BE6E" strokeWidth="1.3" />
            <path d="M28 21 L28 43" stroke="#D43750" strokeWidth="1.3" />
          </>
        );
      case 'marisa':
        return (
          <>
            <circle cx="28" cy="28" r="16" stroke="#D4892A" strokeWidth="1.4" />
            <path d="M28 11 L28 45" stroke="#ECE3D5" strokeWidth="1.5" />
            <circle cx="28" cy="28" r="6" stroke="#D43750" strokeWidth="1.4" />
          </>
        );
      case 'sofia':
        return (
          <>
            <circle cx="28" cy="28" r="14" stroke="#E5BE6E" strokeWidth="1.4" />
            <circle cx="28" cy="28" r="8" stroke="#D43750" strokeWidth="1.3" />
            <path d="M16 16 L40 40" stroke="#ECE3D5" strokeOpacity="0.65" />
          </>
        );
      case 'flor':
        return (
          <>
            <circle cx="28" cy="28" r="15" stroke="#8EC49E" strokeWidth="1.3" />
            <path d="M18 35 Q28 13 38 35" stroke="#E5BE6E" strokeWidth="1.6" />
            <circle cx="28" cy="28" r="2.8" fill="#ECE3D5" />
          </>
        );
      case 'marina':
        return (
          <>
            <polygon points="28,11 43,39 13,39" stroke="#E5BE6E" strokeWidth="1.3" />
            <circle cx="28" cy="30" r="6" stroke="#6AD1CC" strokeWidth="1.5" />
          </>
        );
    }
  })();

  return (
    <svg
      viewBox="0 0 56 56"
      className={className}
      fill="none"
      role={name ? 'img' : undefined}
      aria-label={name ? `Retrato de ${name}` : undefined}
      aria-hidden={name ? undefined : true}
    >
      <defs>
        <radialGradient id={`crest-grad-${portraitKey}`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor={palette.bg} />
          <stop offset="100%" stopColor="#09080c" />
        </radialGradient>
      </defs>
      <circle
        cx="28"
        cy="28"
        r="26"
        fill={`url(#crest-grad-${portraitKey})`}
        stroke={palette.ring}
        strokeOpacity="0.65"
        strokeWidth="1.3"
      />
      <circle
        cx="28"
        cy="28"
        r="22"
        stroke={palette.glow}
        strokeOpacity="0.25"
        strokeDasharray="2 3"
      />
      {symbol}
    </svg>
  );
};
