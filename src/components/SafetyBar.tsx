import React from 'react';
import {
  BookOpen,
  Compass,
  Eye,
  EyeOff,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  AlertOctagon,
} from 'lucide-react';
import { GameState, NarrativeLevel } from '../types/game';

interface SafetyBarProps {
  gameState: GameState;
  narrativeLevel: NarrativeLevel;
  maxAllowedLevel: NarrativeLevel;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onChangeLevel: (level: NarrativeLevel) => void;
  onTriggerXCard: () => void;
  onTriggerAmber: () => void;
  onNavigate: (target: GameState) => void;
  onStartSessionZero: () => void;
  onResetToMenu: () => void;
  amberWord: string;
  xCardWord: string;
}

export const SafetyBar: React.FC<SafetyBarProps> = ({
  gameState,
  narrativeLevel,
  maxAllowedLevel,
  soundEnabled,
  onToggleSound,
  onChangeLevel,
  onTriggerXCard,
  onTriggerAmber,
  onNavigate,
  onStartSessionZero,
  onResetToMenu,
  amberWord,
  xCardWord,
}) => {
  // Strict 3-zone header on landing / menu / compendium views
  if (gameState === 'TITLE_MENU' || gameState === 'COMPENDIUM') {
    return (
      <header className="sticky top-0 z-40 border-b border-[rgba(216,198,174,0.14)] bg-[#09080c]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand wordmark */}
          <button
            type="button"
            onClick={() => onNavigate('TITLE_MENU')}
            className="flex items-center gap-3 text-left group shrink-0"
          >
            <div className="w-8 h-8 rounded border border-[#c59b4e]/50 bg-[#14101a] flex items-center justify-center text-[#e5be6e] group-hover:border-[#e5be6e] transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif-display text-lg sm:text-xl font-semibold tracking-wide text-[#ece3d5] block leading-none">
                Pecados de la Carne
              </span>
              <span className="text-[11px] text-[#7c7166] tracking-wider uppercase hidden sm:block mt-0.5">
                Horror Erótico-Cósmico · BRP D100
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#b5a998]">
            <button
              type="button"
              onClick={() => onNavigate('TITLE_MENU')}
              className={`whitespace-nowrap transition-colors hover:text-[#ece3d5] ${
                gameState === 'TITLE_MENU' ? 'text-[#e5be6e] font-medium' : ''
              }`}
            >
              Inicio y Campañas
            </button>
            <button
              type="button"
              onClick={() => onNavigate('COMPENDIUM')}
              className={`whitespace-nowrap transition-colors hover:text-[#ece3d5] ${
                gameState === 'COMPENDIUM' ? 'text-[#e5be6e] font-medium' : ''
              }`}
            >
              Bestiario y Compendio
            </button>
            <button
              type="button"
              onClick={onToggleSound}
              className="whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-[#ece3d5]"
              aria-label={soundEnabled ? 'Silenciar audio' : 'Activar audio'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#c59b4e]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#7c7166]" />
              )}
              <span>{soundEnabled ? 'Sonido' : 'Silencio'}</span>
            </button>
          </nav>

          {/* Zone 3: Primary CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                onNavigate(gameState === 'COMPENDIUM' ? 'TITLE_MENU' : 'COMPENDIUM')
              }
              className="md:hidden px-3 py-2 rounded border border-[rgba(216,198,174,0.2)] text-xs text-[#ece3d5] whitespace-nowrap shrink-0"
            >
              {gameState === 'COMPENDIUM' ? 'Inicio' : 'Bestiario'}
            </button>
            <button
              type="button"
              onClick={onStartSessionZero}
              className="px-4 py-2 rounded bg-[#9e1b32] hover:bg-[#b5223d] text-[#ece3d5] text-sm font-medium border border-[#d43750]/40 transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              Sesión Cero
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Active gameplay & combat header with full safety controls (Tarjeta X, Ámbar, Nivel Velo/Sensual)
  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(216,198,174,0.16)] bg-[#09080c]/95 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onResetToMenu}
            className="flex items-center gap-2 text-left text-[#ece3d5] hover:text-[#e5be6e] transition-colors shrink-0"
            title="Volver al menú principal"
          >
            <Compass className="w-4 h-4 text-[#c59b4e]" />
            <span className="font-serif-display text-base sm:text-lg font-semibold whitespace-nowrap">
              Pecados de la Carne
            </span>
          </button>
          <span className="hidden lg:inline text-xs text-[#7c7166]">·</span>
          <span className="hidden lg:inline text-xs text-[#b5a998] truncate">
            {gameState === 'COMBAT_INTIMO'
              ? 'Escena de Combate Íntimo (Sección 5)'
              : gameState === 'SESSION_ZERO'
                ? 'Sesión Cero y Consentimiento (Sección 1)'
                : 'Crónica en Curso'}
          </span>
        </div>

        {/* Interactive Safety & Narrative Dial Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Narrative Scale Toggle (0 Velo / 1 Sensual) */}
          <div
            className="flex items-center rounded border border-[rgba(216,198,174,0.2)] bg-[#14111a] p-0.5"
            role="group"
            aria-label="Escala narrativa"
          >
            <button
              type="button"
              onClick={() => onChangeLevel(0)}
              className={`px-2.5 py-1.5 rounded-sm text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                narrativeLevel === 0
                  ? 'bg-[#2e7d7b]/30 text-[#6ad1cc] font-medium'
                  : 'text-[#b5a998] hover:text-[#ece3d5]'
              }`}
              title="Nivel 0: Velo estricto (elipsis elegante)"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Velo (0)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (maxAllowedLevel >= 1) onChangeLevel(1);
              }}
              disabled={maxAllowedLevel < 1}
              className={`px-2.5 py-1.5 rounded-sm text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                maxAllowedLevel < 1
                  ? 'opacity-40 cursor-not-allowed text-[#7c7166]'
                  : narrativeLevel === 1
                    ? 'bg-[#9e1b32]/35 text-[#ece3d5] font-medium'
                    : 'text-[#b5a998] hover:text-[#ece3d5]'
              }`}
              title={
                maxAllowedLevel < 1
                  ? 'Bloqueado en Nivel 0 según tu Documento de Consentimiento'
                  : 'Nivel 1: Sensual literario y sugestivo'
              }
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Sensual (1)</span>
            </button>
          </div>

          {/* Señal Ámbar */}
          <button
            type="button"
            onClick={onTriggerAmber}
            className="px-3 py-1.5 rounded border border-[#c59b4e]/45 bg-[#c59b4e]/10 hover:bg-[#c59b4e]/20 text-[#e5be6e] text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            title={`Señal Ámbar (${amberWord}): suaviza la escena a Nivel 0 inmediatamente`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ámbar</span>
          </button>

          {/* Tarjeta X */}
          <button
            type="button"
            onClick={onTriggerXCard}
            className="px-3 py-1.5 rounded border border-[#2e7d7b]/60 bg-[#2e7d7b]/20 hover:bg-[#2e7d7b]/35 text-[#6ad1cc] text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            title={`Tarjeta X (${xCardWord}): pausa y salto limpio sin consecuencias`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Tarjeta X</span>
          </button>

          {/* Compendium quick link during play if not in combat */}
          {gameState !== 'SESSION_ZERO' && (
            <button
              type="button"
              onClick={() => onNavigate('COMPENDIUM')}
              className="hidden sm:flex px-2.5 py-1.5 rounded border border-[rgba(216,198,174,0.18)] text-[#b5a998] hover:text-[#ece3d5] text-xs items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              title="Consultar Bestiario y Tablas"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Compendio</span>
            </button>
          )}

          {/* Audio Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="p-2 rounded border border-[rgba(216,198,174,0.18)] text-[#b5a998] hover:text-[#ece3d5] transition-colors shrink-0"
            aria-label={soundEnabled ? 'Silenciar efectos' : 'Activar efectos'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#c59b4e]" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Return / Restart */}
          <button
            type="button"
            onClick={onResetToMenu}
            className="p-2 rounded border border-[rgba(216,198,174,0.18)] text-[#b5a998] hover:text-[#ece3d5] transition-colors shrink-0"
            title="Volver al menú principal"
            aria-label="Volver al menú principal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
