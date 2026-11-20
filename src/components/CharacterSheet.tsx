import React, { useState } from 'react';
import {
  Brain,
  Dices,
  Droplets,
  Flame,
  Heart,
  Shield,
  Skull,
  Sparkles,
} from 'lucide-react';
import { Investigator } from '../types/game';
import { RecoveryMethod } from '../utils/brpEngine';
import { InvestigatorCrest } from './EntityArtwork';

interface CharacterSheetProps {
  investigator: Investigator;
  useEndurecimiento: boolean;
  onRollSkill: (label: string, target: number, isInhCheck?: boolean) => void;
  onUseLazo: (lazoId: string, mode: 'REFUGIO' | 'INHIBICION') => void;
  onRecover?: (method: RecoveryMethod) => void;
  onUseGrietaHint?: () => void;
}

const SKILL_LABELS: { key: keyof Investigator['skills']; label: string }[] = [
  { key: 'seduccion', label: 'Seducción / Provocar' },
  { key: 'tecnica', label: 'Técnica / Rendimiento' },
  { key: 'resistenciaCarnal', label: 'Resistencia Carnal' },
  { key: 'ataduras', label: 'Ataduras / Shibari' },
  { key: 'psicologia', label: 'Psicología' },
  { key: 'ocultismo', label: 'Ocultismo' },
  { key: 'persuasion', label: 'Persuasión' },
  { key: 'buscar', label: 'Buscar' },
  { key: 'pelea', label: 'Pelea' },
  { key: 'esquivar', label: 'Esquivar' },
];

export const CharacterSheet: React.FC<CharacterSheetProps> = ({
  investigator,
  useEndurecimiento,
  onRollSkill,
  onUseLazo,
  onRecover,
}) => {
  const [tab, setTab] = useState<'STATS' | 'GRIETA' | 'FILIAS' | 'LAZOS'>('STATS');

  const corPct = Math.max(
    0,
    Math.min(100, (investigator.cor / Math.max(1, investigator.maxCor)) * 100)
  );
  const inhPct = Math.max(
    0,
    Math.min(100, (investigator.inh / Math.max(1, investigator.initialInh)) * 100)
  );
  const acPct = Math.max(
    0,
    Math.min(100, (investigator.ac / Math.max(1, investigator.maxAc)) * 100)
  );
  const corruptionTotal = Math.max(0, investigator.initialInh - investigator.inh);

  const t75Val = Math.floor(investigator.initialInh * 0.75);
  const t50Val = Math.floor(investigator.initialInh * 0.5);
  const t25Val = Math.floor(investigator.initialInh * 0.25);

  return (
    <aside className="bg-[#120f17]/95 border border-[rgba(216,198,174,0.18)] rounded-xl overflow-hidden flex flex-col shadow-xl">
      {/* Classic Tabletop Dossier Stamp & Identity Header */}
      <div className="px-4 py-2 border-b border-[rgba(216,198,174,0.1)] bg-[#0c0a0f] flex items-center justify-between text-[10px] uppercase tracking-widest text-[#c59b4e]">
        <span>Hoja de Investigador · BRP D100</span>
        <span className="font-mono-tabular text-[#7c7166]">
          Edad {investigator.age}
        </span>
      </div>

      <div className="p-4 border-b border-[rgba(216,198,174,0.12)] bg-gradient-to-br from-[#1f1522] via-[#15101b] to-[#110e16] flex items-center gap-3.5">
        <div className="w-16 h-16 shrink-0 drop-shadow-md">
          <InvestigatorCrest
            portraitKey={investigator.portraitKey}
            name={investigator.name}
          />
        </div>
        <div className="min-w-0">
          <h2 className="font-serif-display text-xl font-semibold text-[#ece3d5] leading-tight">
            {investigator.name}
          </h2>
          <p className="text-xs text-[#c59b4e] mt-0.5 truncate">
            {investigator.archetype}
          </p>
          <p className="text-xs text-[#b5a998] italic mt-1 line-clamp-2">
            «{investigator.tagline}»
          </p>
        </div>
      </div>

      {/* Vital & Dual Mental Gauges (Section 3 & 5) */}
      <div className="p-4 space-y-3 border-b border-[rgba(216,198,174,0.12)]">
        {/* CORDURA (COR) */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#ece3d5] font-medium">
              <Brain className="w-3.5 h-3.5 text-[#6ad1cc]" />
              <span>Cordura (COR)</span>
            </span>
            <span className="font-mono-tabular text-[#6ad1cc] font-semibold">
              {investigator.cor} / {investigator.maxCor}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-[#09080c] border border-[rgba(216,198,174,0.14)] overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1f5957] to-[#6ad1cc] transition-all duration-300"
              style={{ width: `${corPct}%` }}
            />
          </div>
        </div>

        {/* INHIBICIÓN (INH) */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#ece3d5] font-medium">
              <Flame className="w-3.5 h-3.5 text-[#e07a8a]" />
              <span>Inhibición (INH)</span>
            </span>
            <span className="font-mono-tabular text-[#ece3d5]">
              {investigator.inh} / {investigator.initialInh}{' '}
              <span className="text-[#e07a8a]">(Corr. {corruptionTotal})</span>
            </span>
          </div>
          <div className="relative h-3 rounded-full bg-[#09080c] border border-[rgba(216,198,174,0.16)] overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#721122] via-[#a81c34] to-[#e07a8a] transition-all duration-300"
              style={{ width: `${inhPct}%` }}
            />
            <div
              className="absolute top-0 bottom-0 w-px bg-[#ece3d5]/45"
              style={{ left: '75%' }}
              title={`Umbral 75% (${t75Val}): Tabla B`}
            />
            <div
              className="absolute top-0 bottom-0 w-px bg-[#e5be6e]/70"
              style={{ left: '50%' }}
              title={`Umbral 50% (${t50Val}): Tabla C`}
            />
            <div
              className="absolute top-0 bottom-0 w-px bg-[#ff6b81]/85"
              style={{ left: '25%' }}
              title={`Umbral 25% (${t25Val}): Tabla D`}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono-tabular text-[#7c7166] mt-1">
            <span>0 (E)</span>
            <span>25%: {t25Val}</span>
            <span>50%: {t50Val}</span>
            <span>75%: {t75Val}</span>
          </div>
        </div>

        {/* AGUANTE CARNAL (AC) */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 text-[#ece3d5] font-medium">
              <Droplets className="w-3.5 h-3.5 text-[#e5be6e]" />
              <span>Aguante Carnal (AC)</span>
            </span>
            <span className="font-mono-tabular text-[#e5be6e] font-semibold">
              {investigator.ac} / {investigator.maxAc}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-[#09080c] border border-[rgba(216,198,174,0.14)] overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#87672e] to-[#e5be6e] transition-all duration-300"
              style={{ width: `${acPct}%` }}
            />
          </div>
        </div>

        {/* PV & PM Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="rounded-lg bg-[#09080c]/85 border border-[rgba(216,198,174,0.12)] px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-[#b5a998] flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-[#d43750]" /> PV
            </span>
            <span className="font-mono-tabular text-sm font-semibold text-[#ece3d5]">
              {investigator.pv}/{investigator.maxPv}
            </span>
          </div>
          <div className="rounded-lg bg-[#09080c]/85 border border-[rgba(216,198,174,0.12)] px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-[#b5a998] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#6ad1cc]" /> PM
            </span>
            <span className="font-mono-tabular text-sm font-semibold text-[#ece3d5]">
              {investigator.pm}/{investigator.maxPm}
            </span>
          </div>
        </div>

        {investigator.diarioPendingSkillBonus && (
          <div className="rounded-lg border border-[#c59b4e]/55 bg-[#c59b4e]/12 px-2.5 py-2 text-[11px] text-[#e5be6e]">
            Diario de la Caída (3.7): +10% listo para tu próxima tirada.
          </div>
        )}

        {(investigator.isCascaron || investigator.isDead) && (
          <div className="rounded-lg border border-[#d43750]/65 bg-[#9e1b32]/20 px-2.5 py-2 text-[11px] text-[#ff8fa0] font-medium">
            {investigator.isDead
              ? 'Estado crítico: CON permanente en 0 (colapso físico).'
              : 'Estado Cascarón (POD ≤ 20): portavoz involuntario de la entidad.'}
          </div>
        )}

        {investigator.arrebatoRounds > 0 && investigator.activeArrebato && (
          <div className="rounded-lg border border-[#d43750]/65 bg-[#9e1b32]/22 p-2.5 text-xs">
            <div className="font-semibold text-[#ff8fa0]">
              Arrebato de Lujuria ({investigator.arrebatoRounds} asaltos):{' '}
              {investigator.activeArrebato.name}
            </div>
            <div className="text-[#ece3d5]/85 mt-0.5">
              {investigator.activeArrebato.mechanicalEffect}
            </div>
          </div>
        )}
      </div>

      {/* Sub-navigation Tabs */}
      <div className="grid grid-cols-4 border-b border-[rgba(216,198,174,0.12)] bg-[#0d0b11]">
        {(
          [
            { id: 'STATS', label: 'Ficha' },
            { id: 'GRIETA', label: 'Grieta' },
            {
              id: 'FILIAS',
              label: `Filias (${investigator.filias.length + investigator.mutaciones.length})`,
            },
            { id: 'LAZOS', label: `Lazos (${investigator.lazos.length})` },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`py-2.5 px-1 text-[11px] font-medium transition-colors border-b-2 whitespace-nowrap ${
              tab === item.id
                ? 'border-[#c59b4e] text-[#e5be6e] bg-[#16121d]'
                : 'border-transparent text-[#7c7166] hover:text-[#ece3d5]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <div className="p-3.5 flex-1 overflow-y-auto max-h-[460px] space-y-3.5">
        {tab === 'STATS' && (
          <>
            {/* Classic CoC 7e Attribute Cells: Base | 1/2 | 1/5 */}
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#7c7166] mb-1.5 flex items-center justify-between">
                <span>Atributos (Normal · 1/2 · 1/5)</span>
                <span className="text-[10px] text-[#c59b4e]">Clic para tirar</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(
                  Object.entries(investigator.attributes) as [
                    keyof Investigator['attributes'],
                    number,
                  ][]
                ).map(([attr, val]) => {
                  const half = Math.floor(val / 2);
                  const fifth = Math.floor(val / 5);
                  return (
                    <button
                      key={attr}
                      type="button"
                      onClick={() => onRollSkill(`Atributo ${attr}`, val)}
                      className="rounded-lg bg-[#09080c] hover:bg-[#1a1524] border border-[rgba(216,198,174,0.14)] hover:border-[#c59b4e]/65 py-1.5 px-1 text-center transition-colors"
                      title={`Tirar ${attr}: Normal ≤${val}, Arduo ≤${half}, Extremo ≤${fifth}`}
                    >
                      <div className="text-[10px] text-[#c59b4e] font-semibold">
                        {attr}
                      </div>
                      <div className="font-mono-tabular text-sm font-bold text-[#ece3d5] leading-tight">
                        {val}
                      </div>
                      <div className="font-mono-tabular text-[9px] text-[#7c7166] border-t border-[rgba(216,198,174,0.1)] mt-1 pt-0.5">
                        {half}/{fifth}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#7c7166] mb-1.5 flex items-center justify-between">
                <span>Habilidades (Base · 1/2 / 1/5)</span>
              </div>
              <div className="space-y-1.5">
                {SKILL_LABELS.map(({ key, label }) => {
                  const val = investigator.skills[key];
                  const half = Math.floor(val / 2);
                  const fifth = Math.floor(val / 5);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onRollSkill(label, val)}
                      className="relative w-full overflow-hidden flex items-center justify-between px-2.5 py-2 rounded-lg bg-[#09080c]/85 hover:bg-[#1b1626] border border-[rgba(216,198,174,0.1)] hover:border-[#c59b4e]/55 text-xs transition-colors group"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-0 bottom-0 bg-[#c59b4e]/10 group-hover:bg-[#c59b4e]/20 transition-all"
                        style={{ width: `${Math.min(100, val)}%` }}
                      />
                      <span className="relative z-10 text-[#b5a998] group-hover:text-[#ece3d5] flex items-center gap-1.5 truncate">
                        <Dices className="w-3 h-3 text-[#c59b4e]/75 group-hover:text-[#e5be6e] shrink-0" />
                        <span className="truncate">{label}</span>
                      </span>
                      <span className="relative z-10 font-mono-tabular shrink-0 flex items-center gap-1.5">
                        <span className="font-semibold text-[#ece3d5]">{val}%</span>
                        <span className="text-[10px] text-[#7c7166]">
                          ({half}/{fifth})
                        </span>
                      </span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() =>
                    onRollSkill('Tirada de Cordura (COR)', investigator.cor)
                  }
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-[#2e7d7b]/12 hover:bg-[#2e7d7b]/25 border border-[#2e7d7b]/35 text-xs transition-colors"
                >
                  <span className="text-[#6ad1cc] font-medium">
                    Tirada de Cordura
                  </span>
                  <span className="font-mono-tabular font-semibold text-[#6ad1cc]">
                    {investigator.cor}%
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onRollSkill(
                      'Tirada de Inhibición (INH)',
                      investigator.inh,
                      true
                    )
                  }
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-[#9e1b32]/15 hover:bg-[#9e1b32]/28 border border-[#9e1b32]/45 text-xs transition-colors"
                  title={
                    !investigator.firstInhRollDone
                      ? 'Regla de la Primera Vez (3.2): se tira contra tu POD completo.'
                      : undefined
                  }
                >
                  <span className="text-[#e07a8a] font-medium">
                    Tirada de Inhibición
                    {!investigator.firstInhRollDone ? ' (1.ª vez · POD)' : ''}
                  </span>
                  <span className="font-mono-tabular font-semibold text-[#e07a8a]">
                    {!investigator.firstInhRollDone
                      ? investigator.attributes.POD
                      : investigator.inh}
                    %
                  </span>
                </button>
              </div>
            </div>
          </>
        )}

        {tab === 'GRIETA' && (
          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded bg-[#09080c] border border-[rgba(216,198,174,0.12)]">
              <div className="text-[10px] uppercase tracking-wider text-[#e07a8a] mb-0.5">
                Herida (Sección 2.2)
              </div>
              <p className="text-[#ece3d5] leading-relaxed">
                {investigator.grieta.herida}
              </p>
            </div>
            <div className="p-2.5 rounded bg-[#09080c] border border-[rgba(216,198,174,0.12)]">
              <div className="text-[10px] uppercase tracking-wider text-[#c59b4e] mb-0.5">
                Mentira Protectora
              </div>
              <p className="text-[#b5a998] italic leading-relaxed">
                {investigator.grieta.mentira}
              </p>
            </div>
            <div className="p-2.5 rounded bg-[#09080c] border border-[rgba(216,198,174,0.12)]">
              <div className="text-[10px] uppercase tracking-wider text-[#e5be6e] mb-0.5">
                Tentación Secreta
              </div>
              <p className="text-[#ece3d5] leading-relaxed">
                {investigator.grieta.tentacion}
              </p>
            </div>
            <div className="p-2.5 rounded bg-[#09080c] border border-[rgba(216,198,174,0.12)]">
              <div className="text-[10px] uppercase tracking-wider text-[#6ad1cc] mb-0.5">
                Señal de Grieta
              </div>
              <p className="text-[#b5a998] leading-relaxed">
                {investigator.grieta.senal}
              </p>
            </div>
            {investigator.quotes[0] && (
              <p className="text-[#7c7166] italic px-1">{investigator.quotes[0]}</p>
            )}
          </div>
        )}

        {tab === 'FILIAS' && (
          <div className="space-y-2.5 text-xs">
            {investigator.filias.length === 0 &&
              investigator.mutaciones.length === 0 &&
              investigator.marcas.length === 0 && (
                <p className="text-[#7c7166] italic py-2">
                  Sin filias, mutaciones ni marcas adquiridas aún. Tus umbrales se
                  abrirán si cae tu Inhibición.
                </p>
              )}

            {investigator.filias.map((f) => (
              <div
                key={f.id}
                className="p-2.5 rounded bg-[#9e1b32]/12 border border-[#9e1b32]/35"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[#ece3d5]">
                    [Tabla {f.table}] {f.name}
                  </span>
                  <span className="text-[10px] text-[#e07a8a]">
                    {f.curable ? 'Curable' : 'Permanente'}
                  </span>
                </div>
                <p className="text-[#b5a998] mt-1">{f.mechanicalEffect}</p>
              </div>
            ))}

            {investigator.mutaciones.map((m) => (
              <div
                key={m.id}
                className="p-2.5 rounded bg-[#2e7d7b]/15 border border-[#2e7d7b]/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#6ad1cc]">
                    Mutación: {m.name}
                  </span>
                </div>
                <p className="text-[#ece3d5] mt-1">{m.benefit}</p>
                <p className="text-[#7c7166] mt-0.5">{m.signalAndCost}</p>
              </div>
            ))}

            {(investigator.marcas.length > 0 || investigator.deudas.length > 0) && (
              <div className="p-2.5 rounded bg-[#09080c] border border-[rgba(216,198,174,0.12)] space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-[#c59b4e]">
                  Marcas y Deudas
                </div>
                {investigator.marcas.map((marca, i) => (
                  <div key={i} className="text-[#ece3d5] flex items-start gap-1.5">
                    <Skull className="w-3 h-3 text-[#d43750] mt-0.5 shrink-0" />
                    <span>{marca}</span>
                  </div>
                ))}
                {investigator.deudas.map((deuda, i) => (
                  <div key={i} className="text-[#e5be6e] flex items-start gap-1.5">
                    <Shield className="w-3 h-3 text-[#c59b4e] mt-0.5 shrink-0" />
                    <span>Deuda: {deuda}</span>
                  </div>
                ))}
              </div>
            )}

            {useEndurecimiento && (
              <div className="p-2.5 rounded bg-[#09080c] border border-[rgba(216,198,174,0.12)]">
                <div className="text-[10px] uppercase tracking-wider text-[#c59b4e] mb-1.5">
                  Apéndice I · Muescas de Endurecimiento
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center font-mono-tabular">
                  <div className="bg-[#14111a] p-1.5 rounded">
                    <div className="text-[10px] text-[#7c7166]">Sumisión</div>
                    <div className="text-[#ece3d5] font-semibold">
                      {investigator.endurecimiento.sumision}/5
                    </div>
                  </div>
                  <div className="bg-[#14111a] p-1.5 rounded">
                    <div className="text-[10px] text-[#7c7166]">Alteración</div>
                    <div className="text-[#ece3d5] font-semibold">
                      {investigator.endurecimiento.alteracion}/5
                    </div>
                  </div>
                  <div className="bg-[#14111a] p-1.5 rounded">
                    <div className="text-[10px] text-[#7c7166]">Profanación</div>
                    <div className="text-[#ece3d5] font-semibold">
                      {investigator.endurecimiento.profanacion}/5
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'LAZOS' && (
          <div className="space-y-3 text-xs">
            <p className="text-[#9b8f82] leading-relaxed">
              Los Lazos Íntimos (Sección 7.2) ofrecen Refugio del Cuerpo (+1d3
              COR, +1d3 AC, +1 INH, 1/sesión) o amortiguan 6 puntos de INH al
              aferrarse al vínculo.
            </p>

            {onRecover && (
              <div className="p-2.5 rounded-lg bg-[#09080c] border border-[#2e7d7b]/40 space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-[#6ad1cc] font-semibold">
                  Válvulas de Recuperación (Sección 7)
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onRecover('VELO_DISTANCIA')}
                    className="w-full text-left px-2.5 py-1.5 rounded border border-[#2e7d7b]/50 bg-[#2e7d7b]/15 hover:bg-[#2e7d7b]/25 text-[#ece3d5] transition-colors flex items-center justify-between"
                  >
                    <span>Velo y distancia</span>
                    <span className="font-mono-tabular text-[11px] text-[#6ad1cc]">
                      +1 INH / +1 COR
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRecover('TRAUMA_PURGATIVO')}
                    className="w-full text-left px-2.5 py-1.5 rounded border border-[#c59b4e]/45 bg-[#c59b4e]/10 hover:bg-[#c59b4e]/20 text-[#ece3d5] transition-colors flex items-center justify-between"
                  >
                    <span>Trauma purgativo</span>
                    <span className="font-mono-tabular text-[11px] text-[#e5be6e]">
                      +1d3 INH / -1 COR
                    </span>
                  </button>
                </div>
              </div>
            )}

            {investigator.lazos.map((lazo) => (
              <div
                key={lazo.id}
                className="p-2.5 rounded bg-[#09080c] border border-[rgba(216,198,174,0.14)] space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[#ece3d5]">{lazo.name}</span>
                  <span
                    className={`text-[10px] ${
                      lazo.spent ? 'text-[#9b8f82]' : 'text-[#e5be6e]'
                    }`}
                  >
                    {lazo.spent ? 'Lazo gastado' : 'Activo ♥'}
                  </span>
                </div>
                <div className="text-[#b5a998]">{lazo.relation}</div>
                {!lazo.spent && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      disabled={lazo.refugeUsedThisSession}
                      onClick={() => onUseLazo(lazo.id, 'REFUGIO')}
                      className={`px-2 py-1 rounded text-[11px] border transition-colors whitespace-nowrap ${
                        lazo.refugeUsedThisSession
                          ? 'opacity-40 cursor-not-allowed border-[#9b8f82]/20 text-[#9b8f82]'
                          : 'border-[#2e7d7b]/60 bg-[#2e7d7b]/15 hover:bg-[#2e7d7b]/30 text-[#6ad1cc]'
                      }`}
                    >
                      Refugio (+1d3 COR/AC, +1 INH)
                    </button>
                    <button
                      type="button"
                      onClick={() => onUseLazo(lazo.id, 'INHIBICION')}
                      className="px-2 py-1 rounded text-[11px] border border-[#c59b4e]/50 bg-[#c59b4e]/10 hover:bg-[#c59b4e]/25 text-[#e5be6e] transition-colors whitespace-nowrap"
                    >
                      Gastar lazo (+6 INH)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
