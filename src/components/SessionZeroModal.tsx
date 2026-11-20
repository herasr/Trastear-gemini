import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Sparkles,
  UserCheck,
  BookOpen,
} from 'lucide-react';
import {
  ConsentDocument,
  Investigator,
  NarrativeLevel,
  StoryArc,
} from '../types/game';
import { INVESTIGATORS } from '../data/investigators';
import { STORY_ARCS } from '../data/scenarios';
import { EntityArtwork, InvestigatorCrest } from './EntityArtwork';

interface SessionZeroModalProps {
  initialConsent: ConsentDocument;
  initialInvestigatorId?: string;
  initialArcId?: string;
  onConfirm: (
    consent: ConsentDocument,
    investigator: Investigator,
    arc: StoryArc
  ) => void;
  onCancel: () => void;
}

const HARD_LIMIT_OPTIONS = [
  'Coacción sexual no consentida',
  'Daño gráfico extremo o gore sexual',
  'Implicación de menores',
  'Pérdida permanente de agencia sin pacto previo',
];

export const SessionZeroModal: React.FC<SessionZeroModalProps> = ({
  initialConsent,
  initialInvestigatorId,
  initialArcId,
  onConfirm,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [consent, setConsent] = useState<ConsentDocument>(initialConsent);
  const [selectedInvId, setSelectedInvId] = useState<string>(
    initialInvestigatorId || INVESTIGATORS[0].id
  );
  const [selectedArcId, setSelectedArcId] = useState<string>(
    initialArcId || STORY_ARCS[0].id
  );

  const selectedInvestigator =
    INVESTIGATORS.find((i) => i.id === selectedInvId) || INVESTIGATORS[0];
  const selectedArc =
    STORY_ARCS.find((a) => a.id === selectedArcId) || STORY_ARCS[0];

  const toggleHardLimit = (limit: string) => {
    setConsent((prev) => ({
      ...prev,
      hardLimits: prev.hardLimits.includes(limit)
        ? prev.hardLimits.filter((l) => l !== limit)
        : [...prev.hardLimits, limit],
    }));
  };

  const handleLaunch = () => {
    // Deep clone investigator so restarts never mutate canonical template
    const cloned: Investigator = JSON.parse(JSON.stringify(selectedInvestigator));
    onConfirm(consent, cloned, selectedArc);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-[#120f17]/95 border border-[rgba(216,198,174,0.18)] rounded-2xl overflow-hidden shadow-2xl">
        {/* Progress Stepper Header */}
        <div className="px-6 py-5 border-b border-[rgba(216,198,174,0.14)] bg-gradient-to-r from-[#1a121d] via-[#14101a] to-[#11151a] flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#6ad1cc] font-semibold">
              Sección 1 · Mesa Segura y Sesión Cero
            </span>
            <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#ece3d5]">
              {step === 1
                ? 'Documento de Consentimiento'
                : step === 2
                  ? 'Elige tu Investigador'
                  : 'Selecciona el Arco de la Crónica'}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {[
              { n: 1 as const, label: '1. Límites' },
              { n: 2 as const, label: '2. Investigador' },
              { n: 3 as const, label: '3. Escenario' },
            ].map((s) => (
              <button
                key={s.n}
                type="button"
                onClick={() => setStep(s.n)}
                className={`px-3 py-1.5 rounded border transition-colors whitespace-nowrap ${
                  step === s.n
                    ? 'border-[#c59b4e] bg-[#c59b4e]/15 text-[#e5be6e] font-semibold'
                    : 'border-[rgba(216,198,174,0.14)] text-[#7c7166] hover:text-[#ece3d5]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 1: Consent Document */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            <div className="p-4 rounded-xl bg-[#2e7d7b]/12 border border-[#2e7d7b]/40 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#6ad1cc] shrink-0 mt-0.5" />
              <div className="text-sm text-[#ece3d5] leading-relaxed">
                <strong className="text-[#6ad1cc]">Principio rector (Sección 1.1):</strong>{' '}
                Toda la mecánica BRP D100 de <em>Pecados de la Carne</em> funciona por
                completo bajo <strong>Velo estricto</strong>. Puedes bajar el nivel
                narrativo o pulsar la <strong>Tarjeta X</strong> en cualquier momento sin
                ninguna penalización en juego.
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Narrative Scale */}
              <div className="space-y-3">
                <h2 className="font-serif-display text-xl text-[#ece3d5] font-semibold">
                  Escala narrativa máxima (Sección 1.2)
                </h2>
                <div className="space-y-2.5">
                  {(
                    [
                      {
                        level: 0 as NarrativeLevel,
                        title: 'Nivel 0 · Velo estricto (Por defecto)',
                        desc: 'Elipsis elegante y sugerencia atmosférica. Se centra en la tensión psicológica, las decisiones y la geometría cósmica.',
                      },
                      {
                        level: 1 as NarrativeLevel,
                        title: 'Nivel 1 · Sensual literario',
                        desc: 'Prosa sugerente centrada en el pulso, la cercanía, el perfume y el vértigo del deseo sin caer en explicitud gráfica.',
                      },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.level}
                      type="button"
                      onClick={() =>
                        setConsent((c) => ({ ...c, baseLevel: opt.level }))
                      }
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        consent.baseLevel === opt.level
                          ? 'border-[#6ad1cc] bg-[#2e7d7b]/15'
                          : 'border-[rgba(216,198,174,0.14)] bg-[#09080c]/70 hover:border-[rgba(216,198,174,0.3)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[#ece3d5]">
                          {opt.title}
                        </span>
                        {consent.baseLevel === opt.level && (
                          <Check className="w-4 h-4 text-[#6ad1cc]" />
                        )}
                      </div>
                      <p className="text-xs text-[#b5a998] mt-1 leading-relaxed">
                        {opt.desc}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Safety Words */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-xs text-[#b5a998] block mb-1">
                      Palabra Ámbar (suavizar)
                    </label>
                    <input
                      type="text"
                      value={consent.amberWord}
                      onChange={(e) =>
                        setConsent((c) => ({ ...c, amberWord: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#09080c] border border-[rgba(216,198,174,0.18)] text-sm text-[#ece3d5] focus:outline-none focus:border-[#c59b4e]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#b5a998] block mb-1">
                      Tarjeta X (corte limpio)
                    </label>
                    <input
                      type="text"
                      value={consent.xCardWord}
                      onChange={(e) =>
                        setConsent((c) => ({ ...c, xCardWord: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#09080c] border border-[rgba(216,198,174,0.18)] text-sm text-[#ece3d5] focus:outline-none focus:border-[#6ad1cc]"
                    />
                  </div>
                </div>
              </div>

              {/* Mechanics Opt-in & Hard Limits */}
              <div className="space-y-4">
                <h2 className="font-serif-display text-xl text-[#ece3d5] font-semibold">
                  Subsistemas y Límites Duros (1.6)
                </h2>

                <div className="space-y-2">
                  {(
                    [
                      {
                        key: 'acceptArrebato',
                        label: 'Arrebato de Lujuria (Tabla A ante pérdidas 5+ INH)',
                      },
                      {
                        key: 'acceptDrenaje',
                        label: 'Drenaje de PM / Atributos en Clímax de entidades',
                      },
                      {
                        key: 'acceptTentacion',
                        label: 'Grieta Personal y Tentaciones de escena',
                      },
                      {
                        key: 'useEndurecimiento',
                        label: 'Apéndice I: Endurecimiento Moral y Carnal',
                      },
                    ] as const
                  ).map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#09080c]/75 border border-[rgba(216,198,174,0.12)] cursor-pointer hover:border-[#c59b4e]/40"
                    >
                      <span className="text-xs sm:text-sm text-[#ece3d5]">
                        {item.label}
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(consent[item.key])}
                        onChange={(e) =>
                          setConsent((c) => ({
                            ...c,
                            [item.key]: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 accent-[#c59b4e]"
                      />
                    </label>
                  ))}
                </div>

                <div className="space-y-2 pt-1">
                  <div className="text-xs uppercase tracking-wider text-[#e07a8a]">
                    Límites duros sellados (excluidos de raíz)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {HARD_LIMIT_OPTIONS.map((limit) => {
                      const active = consent.hardLimits.includes(limit);
                      return (
                        <button
                          key={limit}
                          type="button"
                          onClick={() => toggleHardLimit(limit)}
                          className={`p-2.5 rounded-lg border text-left text-xs flex items-center gap-2 transition-colors ${
                            active
                              ? 'border-[#2e7d7b]/60 bg-[#2e7d7b]/15 text-[#ece3d5]'
                              : 'border-[rgba(216,198,174,0.14)] bg-[#09080c] text-[#7c7166]'
                          }`}
                        >
                          <Check
                            className={`w-3.5 h-3.5 shrink-0 ${
                              active ? 'text-[#6ad1cc]' : 'opacity-20'
                            }`}
                          />
                          <span>{limit}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[rgba(216,198,174,0.12)]">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-[rgba(216,198,174,0.2)] text-sm text-[#b5a998] hover:text-[#ece3d5]"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-lg bg-[#9e1b32] hover:bg-[#b5223d] text-[#ece3d5] text-sm font-semibold flex items-center gap-2"
              >
                <span>Elegir Investigador</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 8 Canonical Investigators */}
        {step === 2 && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
                {INVESTIGATORS.map((inv) => {
                  const active = inv.id === selectedInvId;
                  return (
                    <button
                      key={inv.id}
                      type="button"
                      onClick={() => setSelectedInvId(inv.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                        active
                          ? 'border-[#c59b4e] bg-[#1c1624] shadow-lg'
                          : 'border-[rgba(216,198,174,0.14)] bg-[#09080c]/80 hover:border-[rgba(216,198,174,0.3)]'
                      }`}
                    >
                      <div className="w-12 h-12 shrink-0">
                        <InvestigatorCrest
                          portraitKey={inv.portraitKey}
                          name={inv.name}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-serif-display text-lg font-semibold text-[#ece3d5] leading-tight">
                          {inv.name}
                        </div>
                        <div className="text-[11px] text-[#c59b4e] truncate">
                          {inv.archetype}
                        </div>
                        <div className="font-mono-tabular text-[11px] text-[#b5a998] mt-1.5">
                          INH {inv.initialInh} · COR {inv.cor} · AC {inv.ac}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Investigator Detailed Dossier */}
              <div className="lg:col-span-5 p-5 rounded-xl bg-[#09080c]/90 border border-[#c59b4e]/35 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 shrink-0">
                    <InvestigatorCrest
                      portraitKey={selectedInvestigator.portraitKey}
                      name={selectedInvestigator.name}
                    />
                  </div>
                  <div>
                    <h3 className="font-serif-display text-2xl font-semibold text-[#ece3d5]">
                      {selectedInvestigator.name}{' '}
                      <span className="text-sm text-[#7c7166] font-normal">
                        ({selectedInvestigator.age} años)
                      </span>
                    </h3>
                    <p className="text-xs text-[#c59b4e]">
                      {selectedInvestigator.archetype}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#b5a998] leading-relaxed">
                  {selectedInvestigator.bio}
                </p>

                <div className="grid grid-cols-4 gap-2 text-center font-mono-tabular text-xs">
                  <div className="p-2 rounded bg-[#14111a]">
                    <div className="text-[10px] text-[#7c7166]">POD/INH</div>
                    <div className="font-semibold text-[#e07a8a]">
                      {selectedInvestigator.initialInh}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-[#14111a]">
                    <div className="text-[10px] text-[#7c7166]">COR</div>
                    <div className="font-semibold text-[#6ad1cc]">
                      {selectedInvestigator.cor}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-[#14111a]">
                    <div className="text-[10px] text-[#7c7166]">AC</div>
                    <div className="font-semibold text-[#e5be6e]">
                      {selectedInvestigator.ac}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-[#14111a]">
                    <div className="text-[10px] text-[#7c7166]">Res.Carn.</div>
                    <div className="font-semibold text-[#ece3d5]">
                      {selectedInvestigator.skills.resistenciaCarnal}%
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#14111a] border border-[rgba(216,198,174,0.12)] space-y-1.5 text-xs">
                  <div className="text-[10px] uppercase tracking-wider text-[#e07a8a] font-semibold">
                    Grieta Personal (2.2)
                  </div>
                  <p className="text-[#ece3d5]">
                    <strong>Herida:</strong> {selectedInvestigator.grieta.herida}
                  </p>
                  <p className="text-[#b5a998]">
                    <strong>Tentación:</strong>{' '}
                    {selectedInvestigator.grieta.tentacion}
                  </p>
                </div>

                <div className="text-xs text-[#b5a998] space-y-1">
                  <div>
                    <strong className="text-[#ece3d5]">Lazos:</strong>{' '}
                    {selectedInvestigator.lazos.map((l) => l.name).join(', ')}
                  </div>
                  {selectedInvestigator.reliquias.length > 0 && (
                    <div>
                      <strong className="text-[#ece3d5]">Equipo:</strong>{' '}
                      {selectedInvestigator.reliquias.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[rgba(216,198,174,0.12)]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg border border-[rgba(216,198,174,0.2)] text-sm text-[#b5a998] hover:text-[#ece3d5]"
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-lg bg-[#9e1b32] hover:bg-[#b5223d] text-[#ece3d5] text-sm font-semibold flex items-center gap-2"
              >
                <span>Elegir Escenario</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Arc Selection */}
        {step === 3 && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STORY_ARCS.map((arc) => {
                const active = arc.id === selectedArcId;
                return (
                  <button
                    key={arc.id}
                    type="button"
                    onClick={() => setSelectedArcId(arc.id)}
                    className={`text-left rounded-xl border overflow-hidden flex flex-col transition-all ${
                      active
                        ? 'border-[#c59b4e] bg-[#1b1523] shadow-xl'
                        : 'border-[rgba(216,198,174,0.14)] bg-[#09080c]/85 hover:border-[rgba(216,198,174,0.3)]'
                    }`}
                  >
                    <div className="h-44 w-full overflow-hidden border-b border-[rgba(216,198,174,0.1)] bg-[#09080c]">
                      <EntityArtwork artworkKey={arc.artworkKey} />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-[#c59b4e]">
                          {arc.sourceSection}
                        </div>
                        <h3 className="font-serif-display text-xl font-semibold text-[#ece3d5] mt-0.5">
                          {arc.title}
                        </h3>
                        <p className="text-xs text-[#b5a998] mt-2 leading-relaxed">
                          {arc.synopsis}
                        </p>
                      </div>
                      <div className="text-[11px] text-[#6ad1cc] pt-2 border-t border-[rgba(216,198,174,0.1)] flex items-center justify-between">
                        <span>{arc.recommendedLevel}</span>
                        {active && <Check className="w-4 h-4 text-[#e5be6e]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-[#09080c] border border-[rgba(216,198,174,0.14)] flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#b5a998]">
                <span className="flex items-center gap-1.5 text-[#ece3d5]">
                  <UserCheck className="w-4 h-4 text-[#c59b4e]" />
                  {selectedInvestigator.name}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5 text-[#ece3d5]">
                  <BookOpen className="w-4 h-4 text-[#e07a8a]" />
                  {selectedArc.title}
                </span>
                <span>·</span>
                <span className="text-[#6ad1cc]">
                  Nivel {consent.baseLevel === 0 ? '0 (Velo)' : '1 (Sensual)'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-lg border border-[rgba(216,198,174,0.2)] text-sm text-[#b5a998] hover:text-[#ece3d5]"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleLaunch}
                  className="px-6 py-2.5 rounded-lg bg-[#9e1b32] hover:bg-[#b5223d] text-[#ece3d5] text-sm font-semibold flex items-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-[#e5be6e]" />
                  <span>Comenzar partida</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
