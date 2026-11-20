import React from 'react';
import {
  DiceRollResult,
  DifficultyLevel,
  SuccessDegree,
} from '../types/game';
import {
  AlertTriangle,
  CheckCircle2,
  Dices,
  Flame,
  ShieldAlert,
  Skull,
  Sparkles,
} from 'lucide-react';

interface DiceRollerProps {
  lastRoll: DiceRollResult | null;
  rolling?: boolean;
  difficulty: DifficultyLevel;
  bonusPenalty: number; // -1, 0, +1
  onChangeDifficulty: (diff: DifficultyLevel) => void;
  onChangeBonusPenalty: (bp: number) => void;
  onQuickRoll: (sides: number | 'D100') => void;
  quickPolyNote?: string | null;
}

const DEGREE_META: Record<
  SuccessDegree,
  { label: string; colorClass: string; borderClass: string; barHex: string }
> = {
  CRITICO: {
    label: 'Éxito Crítico',
    colorClass: 'text-[#e5be6e]',
    borderClass:
      'border-[#c59b4e]/75 bg-gradient-to-r from-[#241b11] via-[#17121b] to-[#120f17]',
    barHex: '#e5be6e',
  },
  EXTREMO: {
    label: 'Éxito Extremo (1/5)',
    colorClass: 'text-[#6ad1cc]',
    borderClass:
      'border-[#2e7d7b]/70 bg-gradient-to-r from-[#102223] via-[#14121b] to-[#120f17]',
    barHex: '#6ad1cc',
  },
  ARDUO: {
    label: 'Éxito Arduo (1/2)',
    colorClass: 'text-[#8ec49e]',
    borderClass:
      'border-[#5a966e]/60 bg-gradient-to-r from-[#132018] via-[#14121b] to-[#120f17]',
    barHex: '#8ec49e',
  },
  NORMAL: {
    label: 'Éxito Normal',
    colorClass: 'text-[#ece3d5]',
    borderClass: 'border-[#ece3d5]/35 bg-gradient-to-r from-[#1c1824] to-[#120f17]',
    barHex: '#ece3d5',
  },
  FALLO: {
    label: 'Fallo',
    colorClass: 'text-[#e07a8a]',
    borderClass:
      'border-[#9e1b32]/60 bg-gradient-to-r from-[#261118] via-[#161119] to-[#120f17]',
    barHex: '#e07a8a',
  },
  PIFIA: {
    label: 'Pifia (Desastre)',
    colorClass: 'text-[#ff6b81]',
    borderClass:
      'border-[#d43750]/85 bg-gradient-to-r from-[#320d17] via-[#190e15] to-[#120f17]',
    barHex: '#ff6b81',
  },
};

const DegreeIcon: React.FC<{ degree: SuccessDegree }> = ({ degree }) => {
  switch (degree) {
    case 'CRITICO':
      return <Sparkles className="w-4 h-4 text-[#e5be6e]" />;
    case 'EXTREMO':
    case 'ARDUO':
    case 'NORMAL':
      return <CheckCircle2 className="w-4 h-4 text-[#8ec49e]" />;
    case 'FALLO':
      return <AlertTriangle className="w-4 h-4 text-[#e07a8a]" />;
    case 'PIFIA':
      return <Skull className="w-4 h-4 text-[#ff6b81]" />;
  }
};

const PolyhedralD10: React.FC<{
  value: string;
  variant: 'tens' | 'units';
  rolling?: boolean;
}> = ({ value, variant, rolling }) => {
  const isTens = variant === 'tens';
  const stroke = isTens ? '#e5be6e' : '#d43750';
  const textColor = isTens ? '#f7dfa4' : '#ece3d5';
  const bgStop1 = isTens ? '#2a2013' : '#261119';
  const bgStop2 = '#09080c';

  return (
    <div
      className={`relative w-12 h-12 flex items-center justify-center transition-transform duration-200 ${
        rolling ? 'scale-110 rotate-12 opacity-75' : 'scale-100 rotate-0 opacity-100'
      }`}
    >
      <svg
        viewBox="0 0 60 60"
        className="absolute inset-0 w-full h-full drop-shadow-md"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`d10-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={bgStop1} />
            <stop offset="100%" stopColor={bgStop2} />
          </linearGradient>
        </defs>
        <polygon
          points="30,3 53,19 49,42 30,57 11,42 7,19"
          fill={`url(#d10-${variant})`}
          stroke={stroke}
          strokeOpacity="0.85"
          strokeWidth="1.6"
        />
        <polygon
          points="30,6 45,27 30,45 15,27"
          fill="none"
          stroke={stroke}
          strokeOpacity="0.32"
          strokeWidth="1"
        />
        <line x1="7" y1="19" x2="15" y2="27" stroke={stroke} strokeOpacity="0.3" />
        <line x1="53" y1="19" x2="45" y2="27" stroke={stroke} strokeOpacity="0.3" />
        <line x1="30" y1="45" x2="30" y2="57" stroke={stroke} strokeOpacity="0.3" />
      </svg>
      <span
        className="relative z-10 font-mono-tabular text-sm font-bold tracking-tight"
        style={{ color: textColor }}
      >
        {value}
      </span>
    </div>
  );
};

export const DiceRoller: React.FC<DiceRollerProps> = ({
  lastRoll,
  rolling,
  difficulty,
  bonusPenalty,
  onChangeDifficulty,
  onChangeBonusPenalty,
  onQuickRoll,
  quickPolyNote,
}) => {
  const meta = lastRoll ? DEGREE_META[lastRoll.degree] : null;
  const tensStr = lastRoll
    ? lastRoll.tensDie === 0
      ? '00'
      : String(lastRoll.tensDie)
    : '00';
  const unitsStr = lastRoll ? String(lastRoll.unitsDie) : '0';
  const extremoTarget = lastRoll ? Math.max(1, Math.floor(lastRoll.target / 5)) : 20;
  const arduoTarget = lastRoll ? Math.max(1, Math.floor(lastRoll.target / 2)) : 50;

  return (
    <div
      className={`border rounded-xl px-4 py-3 transition-all duration-200 shadow-lg space-y-3 ${
        meta
          ? meta.borderClass
          : 'border-[rgba(216,198,174,0.18)] bg-gradient-to-r from-[#15111c] to-[#110e16]'
      }`}
      aria-live="polite"
    >
      {/* Tabletop Dice Toolbar: Difficulty, Bonus/Penalty & Quick Polyhedral Rollers */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[rgba(216,198,174,0.12)]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-[#7c7166] mr-1">Modificadores:</span>
          {(['NORMAL', 'ARDUO', 'EXTREMO'] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onChangeDifficulty(d)}
              className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors whitespace-nowrap ${
                difficulty === d
                  ? 'border-[#c59b4e] bg-[#c59b4e]/20 text-[#e5be6e]'
                  : 'border-[rgba(216,198,174,0.14)] bg-[#09080c]/70 text-[#b5a998] hover:text-[#ece3d5]'
              }`}
            >
              {d === 'NORMAL' ? 'Normal' : d === 'ARDUO' ? 'Arduo 1/2' : 'Extremo 1/5'}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onChangeBonusPenalty(bonusPenalty === 1 ? 0 : 1)}
            className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors whitespace-nowrap ${
              bonusPenalty === 1
                ? 'border-[#6ad1cc] bg-[#2e7d7b]/25 text-[#6ad1cc]'
                : 'border-[rgba(216,198,174,0.14)] bg-[#09080c]/70 text-[#b5a998] hover:text-[#ece3d5]'
            }`}
            title="Añadir dado de bonificación (elige la decena menor)"
          >
            +1D Bon.
          </button>
          <button
            type="button"
            onClick={() => onChangeBonusPenalty(bonusPenalty === -1 ? 0 : -1)}
            className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors whitespace-nowrap ${
              bonusPenalty === -1
                ? 'border-[#d43750] bg-[#9e1b32]/25 text-[#ff8fa0]'
                : 'border-[rgba(216,198,174,0.14)] bg-[#09080c]/70 text-[#b5a998] hover:text-[#ece3d5]'
            }`}
            title="Añadir dado de penalización (elige la decena mayor)"
          >
            -1D Pen.
          </button>
        </div>

        {/* Direct Polyhedral Dice Rack */}
        <div className="flex items-center gap-1">
          <Dices className="w-3.5 h-3.5 text-[#c59b4e] mr-1 hidden sm:inline" />
          {(['D100', 10, 6, 4, 3] as const).map((die) => (
            <button
              key={String(die)}
              type="button"
              onClick={() => onQuickRoll(die)}
              className="px-2 py-1 rounded border border-[rgba(216,198,174,0.18)] bg-[#09080c] hover:border-[#e5be6e]/70 text-[11px] font-mono-tabular text-[#ece3d5] transition-colors whitespace-nowrap"
              title={`Tirar ${die === 'D100' ? 'D100 libre' : `1D${die}`}`}
            >
              {die === 'D100' ? 'D100' : `1D${die}`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Roll Readout */}
      {!lastRoll ? (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-1.5">
              <PolyhedralD10 value="00" variant="tens" rolling={rolling} />
              <PolyhedralD10 value="0" variant="units" rolling={rolling} />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#ece3d5]">
                {quickPolyNote || 'Bandeja de Dados BRP D100 lista'}
              </div>
              <div className="text-xs text-[#7c7166]">
                Pulsa cualquier atributo o habilidad en tu ficha, o elige una acción en escena.
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#7c7166] font-mono-tabular">
            <ShieldAlert className="w-3.5 h-3.5 text-[#c59b4e]/80" />
            <span>Mesa D100 · CoC 7.ª</span>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="flex items-center gap-1.5">
                <PolyhedralD10 value={tensStr} variant="tens" rolling={rolling} />
                <PolyhedralD10 value={unitsStr} variant="units" rolling={rolling} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <DegreeIcon degree={lastRoll.degree} />
                  <span className={`text-sm font-semibold ${meta!.colorClass}`}>
                    {meta!.label}
                  </span>
                  <span className="text-xs text-[#7c7166]">·</span>
                  <span className="font-mono-tabular text-base font-bold text-[#ece3d5]">
                    {lastRoll.rawRoll}
                  </span>
                  <span className="text-xs text-[#b5a998] font-mono-tabular">
                    (meta ≤ {lastRoll.effectiveTarget})
                  </span>
                </div>
                <div className="text-xs text-[#b5a998] mt-0.5 flex flex-wrap items-center gap-1.5">
                  <span>{lastRoll.label}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular text-[#7c7166]">
                    Base {lastRoll.target}% · {lastRoll.difficulty}
                  </span>
                  {lastRoll.bonusPenaltyNote && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#c59b4e]">{lastRoll.bonusPenaltyNote}</span>
                    </>
                  )}
                  {quickPolyNote && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#6ad1cc]">{quickPolyNote}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs font-mono-tabular text-[#b5a998]">
              <Flame className="w-3.5 h-3.5 text-[#c59b4e]/80" />
              <span>
                Arduo ≤{arduoTarget} · Extremo ≤{extremoTarget}
              </span>
            </div>
          </div>

          {/* Visual D100 Scale Meter */}
          <div className="relative h-2 rounded-full bg-[#09080c] border border-[rgba(216,198,174,0.14)] overflow-visible">
            <div
              className="absolute top-0 bottom-0 left-0 rounded-l-full bg-[#8ec49e]/25"
              style={{ width: `${Math.min(100, lastRoll.effectiveTarget)}%` }}
            />
            <div
              className="absolute top-0 bottom-0 left-0 rounded-l-full bg-[#6ad1cc]/45"
              style={{ width: `${Math.min(100, extremoTarget)}%` }}
            />
            <div
              className="absolute -top-0.5 -bottom-0.5 w-0.5 bg-[#ece3d5]/60"
              style={{ left: `${Math.min(99, lastRoll.effectiveTarget)}%` }}
              title={`Objetivo ≤ ${lastRoll.effectiveTarget}`}
            />
            <div
              className="absolute -top-1 w-2.5 h-4 -ml-1 rounded-sm border border-[#09080c] shadow-md transition-all duration-300"
              style={{
                left: `${Math.min(99, Math.max(1, lastRoll.rawRoll))}%`,
                backgroundColor: meta!.barHex,
              }}
              title={`Resultado: ${lastRoll.rawRoll}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
