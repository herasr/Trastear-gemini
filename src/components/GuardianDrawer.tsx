import React, { useState } from 'react';
import {
  BookMarked,
  Dices,
  Feather,
  Package,
  ScrollText,
  Sparkles,
} from 'lucide-react';
import { ChronicleLog, DiarioEntry, Investigator } from '../types/game';
import {
  GEN_DETALLES_28_2,
  GEN_DIALOGOS_28_3,
  GEN_LUGARES,
  GEN_OFICIANTES,
  GEN_PRECIOS,
  GEN_PROMESAS,
  GRIMORIO_SPELLS,
  RELIQUIAS_CIRCULO,
  TABLA_A,
  TABLA_B,
  TABLA_C,
  TABLA_D,
  TABLA_E,
  TABLA_MUTACIONES,
} from '../data/tables';
import { pickFromD100Table } from '../utils/brpEngine';
import { soundEngine } from '../utils/soundEngine';

interface GuardianDrawerProps {
  investigator: Investigator;
  chronicle: ChronicleLog[];
  flags?: string[];
  onSaveDiario: (entry: DiarioEntry) => void;
  onCastSpell: (spellId: string) => void;
  onUseRelic: (relicName: string) => void;
  onLog: (type: ChronicleLog['type'], title: string, detail: string) => void;
}

export const GuardianDrawer: React.FC<GuardianDrawerProps> = ({
  investigator,
  chronicle,
  flags = [],
  onSaveDiario,
  onCastSpell,
  onUseRelic,
  onLog,
}) => {
  const [tab, setTab] = useState<'CRONICA' | 'DIARIO' | 'GENERADOR'>('CRONICA');

  // Diario de la Caída state (Section 3.7)
  const [scene, setScene] = useState('');
  const [trigger, setTrigger] = useState('');
  const [image, setImage] = useState('');
  const [text, setText] = useState('');
  const [sharedPhrase, setSharedPhrase] = useState('');
  const [bonusChoice, setBonusChoice] = useState<'AC' | 'SKILL'>('AC');

  // Generator state (Sections 22 & 28)
  const [generatedScene, setGeneratedScene] = useState(() => ({
    lugar: GEN_LUGARES[0],
    oficiante: GEN_OFICIANTES[0],
    promesa: GEN_PROMESAS[0],
    precio: GEN_PRECIOS[0],
    detalle: GEN_DETALLES_28_2[0],
    dialogo: GEN_DIALOGOS_28_3[0],
  }));

  const [randomTableOutput, setRandomTableOutput] = useState<string | null>(null);

  const handleGenerateScene = () => {
    soundEngine.playDiceRoll();
    setGeneratedScene({
      lugar: GEN_LUGARES[Math.floor(Math.random() * GEN_LUGARES.length)],
      oficiante:
        GEN_OFICIANTES[Math.floor(Math.random() * GEN_OFICIANTES.length)],
      promesa: GEN_PROMESAS[Math.floor(Math.random() * GEN_PROMESAS.length)],
      precio: GEN_PRECIOS[Math.floor(Math.random() * GEN_PRECIOS.length)],
      detalle:
        GEN_DETALLES_28_2[Math.floor(Math.random() * GEN_DETALLES_28_2.length)],
      dialogo:
        GEN_DIALOGOS_28_3[Math.floor(Math.random() * GEN_DIALOGOS_28_3.length)],
    });
  };

  const handleQuickTableRoll = (tableKey: 'A' | 'B' | 'C' | 'D' | 'E' | 'MUT') => {
    soundEngine.playDiceRoll();
    if (tableKey === 'MUT') {
      const { roll, entry } = pickFromD100Table(TABLA_MUTACIONES);
      const res = `[Mutación · d100: ${roll}] ${entry.name}: ${entry.effect}`;
      setRandomTableOutput(res);
      onLog('ROLL', 'Oráculo de Mutación (15.3)', res);
      return;
    }
    const tableMap = {
      A: TABLA_A,
      B: TABLA_B,
      C: TABLA_C,
      D: TABLA_D,
      E: TABLA_E,
    };
    const { roll, entry } = pickFromD100Table(tableMap[tableKey]);
    const res = `[Tabla ${tableKey} · d100: ${roll}] ${entry.name}: ${entry.effect}`;
    setRandomTableOutput(res);
    onLog('ROLL', `Oráculo Tabla ${tableKey}`, res);
  };

  const handleSubmitDiario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !sharedPhrase.trim()) return;
    onSaveDiario({
      id: `diario-${Date.now()}`,
      scene: scene.trim() || 'Escena sin título',
      trigger: trigger.trim() || 'Deseo no nombrado',
      image: image.trim() || 'Reflejo en el cristal',
      text: text.trim() || 'Registro silencioso.',
      sharedPhrase: sharedPhrase.trim() || '«No sé si quiero volver atrás.»',
      bonusClaimed: investigator.diarioBonusUsed ? 'NONE' : bonusChoice,
    });
    setScene('');
    setTrigger('');
    setImage('');
    setText('');
    setSharedPhrase('');
  };

  return (
    <aside className="bg-[#120f17]/95 border border-[rgba(216,198,174,0.14)] rounded-xl overflow-hidden flex flex-col">
      <div className="grid grid-cols-3 border-b border-[rgba(216,198,174,0.12)] bg-[#0d0b11]">
        <button
          type="button"
          onClick={() => setTab('CRONICA')}
          className={`py-3 px-2 text-xs font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
            tab === 'CRONICA'
              ? 'border-[#c59b4e] text-[#e5be6e] bg-[#16121d]'
              : 'border-transparent text-[#7c7166] hover:text-[#ece3d5]'
          }`}
        >
          <ScrollText className="w-3.5 h-3.5" />
          <span>Crónica</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('DIARIO')}
          className={`py-3 px-2 text-xs font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
            tab === 'DIARIO'
              ? 'border-[#c59b4e] text-[#e5be6e] bg-[#16121d]'
              : 'border-transparent text-[#7c7166] hover:text-[#ece3d5]'
          }`}
        >
          <Feather className="w-3.5 h-3.5" />
          <span>Diario y Grimorio</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('GENERADOR')}
          className={`py-3 px-2 text-xs font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
            tab === 'GENERADOR'
              ? 'border-[#c59b4e] text-[#e5be6e] bg-[#16121d]'
              : 'border-transparent text-[#7c7166] hover:text-[#ece3d5]'
          }`}
        >
          <Dices className="w-3.5 h-3.5" />
          <span>Pantalla</span>
        </button>
      </div>

      <div className="p-3.5 flex-1 overflow-y-auto max-h-[560px] space-y-3">
        {tab === 'CRONICA' && (
          <div className="space-y-3">
            {flags.length > 0 && (
              <div className="p-2.5 rounded-lg bg-[#09080c] border border-[#c59b4e]/35 space-y-1.5">
                <div className="text-[10px] uppercase tracking-wider text-[#e5be6e] font-semibold">
                  Pistas y Hitos Descubiertos
                </div>
                <div className="space-y-1 text-xs text-[#ece3d5]">
                  {flags.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-[#c59b4e]">◆</span>
                      <span className="capitalize">{f.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {chronicle.length === 0 ? (
              <p className="text-xs text-[#7c7166] italic py-4 text-center">
                La crónica aguarda tu primera decisión.
              </p>
            ) : (
              chronicle.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-[#09080c]/85 border border-[rgba(216,198,174,0.1)] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-semibold ${
                        item.type === 'SAFETY'
                          ? 'text-[#6ad1cc]'
                          : item.type === 'THRESHOLD' || item.type === 'CORRUPTION'
                            ? 'text-[#e07a8a]'
                            : item.type === 'COMBAT'
                              ? 'text-[#e5be6e]'
                              : 'text-[#ece3d5]'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="font-mono-tabular text-[10px] text-[#7c7166]">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-[#b5a998] leading-relaxed">{item.detail}</p>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'DIARIO' && (
          <div className="space-y-4 text-xs">
            {/* Mochila / Reliquias */}
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#c59b4e] mb-2 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>Reliquias y Pertenencias</span>
              </div>
              {investigator.reliquias.length === 0 ? (
                <p className="text-[#7c7166] italic">Sin reliquias activas.</p>
              ) : (
                <div className="space-y-1.5">
                  {investigator.reliquias.map((rel, i) => {
                    const info = RELIQUIAS_CIRCULO.find((r) =>
                      rel.toLowerCase().includes(r.name.split(' (')[0].toLowerCase())
                    );
                    return (
                      <div
                        key={i}
                        className="p-2.5 rounded bg-[#09080c] border border-[rgba(216,198,174,0.14)] space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[#ece3d5]">{rel}</span>
                          <button
                            type="button"
                            onClick={() => onUseRelic(rel)}
                            className="px-2 py-1 rounded border border-[#c59b4e]/50 bg-[#c59b4e]/10 hover:bg-[#c59b4e]/25 text-[#e5be6e] text-[11px] whitespace-nowrap"
                          >
                            Usar
                          </button>
                        </div>
                        {info && (
                          <p className="text-[#7c7166] text-[11px]">{info.effect}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Grimorio (Sección 8) */}
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#6ad1cc] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Grimorio Conocido (Sección 8)</span>
              </div>
              {investigator.hechizos.length === 0 ? (
                <p className="text-[#7c7166] italic">
                  Aún no has memorizado sortilegios del Círculo.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {investigator.hechizos.map((spName, idx) => {
                    const spell = GRIMORIO_SPELLS.find((s) =>
                      spName.toLowerCase().includes(s.name.slice(4).toLowerCase()) ||
                      s.name.toLowerCase().includes(spName.toLowerCase())
                    );
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded bg-[#09080c] border border-[#2e7d7b]/35 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[#ece3d5]">
                            {spell ? spell.name : spName}
                          </span>
                          {spell && (
                            <button
                              type="button"
                              disabled={investigator.pm < spell.pmCost}
                              onClick={() => onCastSpell(spell.id)}
                              className={`px-2 py-1 rounded border text-[11px] whitespace-nowrap ${
                                investigator.pm < spell.pmCost
                                  ? 'opacity-40 cursor-not-allowed border-[#7c7166]/20 text-[#7c7166]'
                                  : 'border-[#2e7d7b]/60 bg-[#2e7d7b]/20 hover:bg-[#2e7d7b]/35 text-[#6ad1cc]'
                              }`}
                            >
                              Lanzar ({spell.cost})
                            </button>
                          )}
                        </div>
                        {spell && (
                          <p className="text-[#b5a998] text-[11px]">{spell.effect}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Diario de la Caída (Sección 3.7) */}
            <form
              onSubmit={handleSubmitDiario}
              className="p-3 rounded-lg bg-[#09080c] border border-[rgba(216,198,174,0.14)] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#e5be6e] flex items-center gap-1.5">
                  <BookMarked className="w-3.5 h-3.5" />
                  <span>Diario de la Caída (3.7)</span>
                </span>
                <span className="text-[10px] text-[#7c7166]">
                  {investigator.diarioBonusUsed ? 'Bono usado' : 'Bono disponible'}
                </span>
              </div>
              <input
                type="text"
                value={scene}
                onChange={(e) => setScene(e.target.value)}
                placeholder="1. Escena o momento..."
                className="w-full px-2.5 py-1.5 rounded bg-[#14111a] border border-[rgba(216,198,174,0.14)] text-[#ece3d5] placeholder-[#7c7166] focus:outline-none focus:border-[#c59b4e]"
              />
              <input
                type="text"
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                placeholder="2. ¿Qué la disparó?"
                className="w-full px-2.5 py-1.5 rounded bg-[#14111a] border border-[rgba(216,198,174,0.14)] text-[#ece3d5] placeholder-[#7c7166] focus:outline-none focus:border-[#c59b4e]"
              />
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="3. Detalle o imagen sensorial..."
                className="w-full px-2.5 py-1.5 rounded bg-[#14111a] border border-[rgba(216,198,174,0.14)] text-[#ece3d5] placeholder-[#7c7166] focus:outline-none focus:border-[#c59b4e]"
              />
              <textarea
                rows={2}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="4. ¿Cómo respondió tu personaje en primera persona?"
                className="w-full px-2.5 py-1.5 rounded bg-[#14111a] border border-[rgba(216,198,174,0.14)] text-[#ece3d5] placeholder-[#7c7166] focus:outline-none focus:border-[#c59b4e]"
              />
              <input
                type="text"
                value={sharedPhrase}
                onChange={(e) => setSharedPhrase(e.target.value)}
                placeholder="5. Frase de confesión..."
                className="w-full px-2.5 py-1.5 rounded bg-[#14111a] border border-[rgba(216,198,174,0.14)] text-[#ece3d5] placeholder-[#7c7166] focus:outline-none focus:border-[#c59b4e]"
              />

              {!investigator.diarioBonusUsed && (
                <div className="flex items-center gap-2 text-[11px] pt-1">
                  <span className="text-[#b5a998]">Bono de entrada:</span>
                  <button
                    type="button"
                    onClick={() => setBonusChoice('AC')}
                    className={`px-2 py-0.5 rounded border ${
                      bonusChoice === 'AC'
                        ? 'border-[#c59b4e] text-[#e5be6e] bg-[#c59b4e]/15'
                        : 'border-[rgba(216,198,174,0.15)] text-[#7c7166]'
                    }`}
                  >
                    +1 AC
                  </button>
                  <button
                    type="button"
                    onClick={() => setBonusChoice('SKILL')}
                    className={`px-2 py-0.5 rounded border ${
                      bonusChoice === 'SKILL'
                        ? 'border-[#c59b4e] text-[#e5be6e] bg-[#c59b4e]/15'
                        : 'border-[rgba(216,198,174,0.15)] text-[#7c7166]'
                    }`}
                  >
                    +1 COR
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 rounded bg-[#9e1b32] hover:bg-[#b5223d] text-[#ece3d5] font-medium transition-colors"
              >
                Registrar en el Diario
              </button>
            </form>

            {investigator.diarioEntries.map((d) => (
              <div
                key={d.id}
                className="p-2.5 rounded bg-[#09080c]/70 border border-[rgba(216,198,174,0.1)] space-y-1"
              >
                <div className="font-semibold text-[#e5be6e]">{d.scene}</div>
                <p className="text-[#ece3d5]">{d.text}</p>
                <p className="text-[#b5a998] italic">{d.sharedPhrase}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'GENERADOR' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-[#09080c] border border-[rgba(216,198,174,0.14)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#e5be6e]">
                  Generador de Escena (Sec. 22 & 28)
                </span>
                <button
                  type="button"
                  onClick={handleGenerateScene}
                  className="px-2.5 py-1 rounded bg-[#9e1b32] hover:bg-[#b5223d] text-[#ece3d5] text-[11px] font-medium whitespace-nowrap"
                >
                  Tirar 4 columnas
                </button>
              </div>
              <div className="space-y-1 text-[#b5a998]">
                <div>
                  <span className="text-[#7c7166]">Lugar:</span>{' '}
                  <span className="text-[#ece3d5]">{generatedScene.lugar}</span>
                </div>
                <div>
                  <span className="text-[#7c7166]">Oficiante:</span>{' '}
                  <span className="text-[#ece3d5]">{generatedScene.oficiante}</span>
                </div>
                <div>
                  <span className="text-[#7c7166]">Promesa:</span>{' '}
                  <span className="text-[#ece3d5]">{generatedScene.promesa}</span>
                </div>
                <div>
                  <span className="text-[#7c7166]">Precio:</span>{' '}
                  <span className="text-[#e07a8a]">{generatedScene.precio}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[rgba(216,198,174,0.1)] space-y-1 text-[11px]">
                <p className="text-[#c59b4e]">{generatedScene.detalle.lugar}</p>
                <p className="text-[#b5a998] italic">{generatedScene.detalle.cuerpo}</p>
              </div>
              <div className="pt-2 border-t border-[rgba(216,198,174,0.1)] space-y-1 text-[11px] italic text-[#ece3d5]">
                <p>{generatedScene.dialogo.apertura}</p>
                <p className="text-[#7c7166]">{generatedScene.dialogo.objecion}</p>
                <p className="text-[#e5be6e]">{generatedScene.dialogo.replica}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#09080c] border border-[rgba(216,198,174,0.14)] space-y-2">
              <div className="font-semibold text-[#ece3d5]">
                Oráculo rápido de Tablas (D100)
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { k: 'A', l: 'Tabla A (Arreb.)' },
                    { k: 'B', l: 'Tabla B (75%)' },
                    { k: 'C', l: 'Tabla C (50%)' },
                    { k: 'D', l: 'Tabla D (25%)' },
                    { k: 'E', l: 'Tabla E (0%)' },
                    { k: 'MUT', l: 'Mutación' },
                  ] as const
                ).map((btn) => (
                  <button
                    key={btn.k}
                    type="button"
                    onClick={() => handleQuickTableRoll(btn.k)}
                    className="py-1.5 px-2 rounded border border-[rgba(216,198,174,0.16)] bg-[#14111a] hover:border-[#c59b4e]/60 text-[11px] text-[#ece3d5] transition-colors"
                  >
                    {btn.l}
                  </button>
                ))}
              </div>
              {randomTableOutput && (
                <div className="p-2.5 rounded bg-[#14111a] border border-[#c59b4e]/40 text-[#ece3d5] leading-relaxed">
                  {randomTableOutput}
                </div>
              )}
            </div>

            {/* Pantalla del Guardián · Quick Reference BRP */}
            <div className="p-3 rounded-lg bg-[#09080c] border border-[rgba(216,198,174,0.14)] space-y-2">
              <div className="font-semibold text-[#e5be6e]">
                Pantalla del Guardián · Reglas BRP
              </div>
              <div className="space-y-1 text-[11px] text-[#b5a998] font-mono-tabular">
                <div className="flex justify-between">
                  <span>Normal / Arduo / Extremo</span>
                  <span className="text-[#ece3d5]">1/1 · 1/2 · 1/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Tabla 5.3 · Éxito Normal</span>
                  <span className="text-[#ece3d5]">1d4 AC</span>
                </div>
                <div className="flex justify-between">
                  <span>Tabla 5.3 · Éxito Arduo</span>
                  <span className="text-[#ece3d5]">1d6 AC + -10%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tabla 5.3 · Extremo</span>
                  <span className="text-[#ece3d5]">2d6 AC + 1 PM + 1d3 INH</span>
                </div>
                <div className="flex justify-between">
                  <span>Arrebato (Sección 3.3)</span>
                  <span className="text-[#e07a8a]">5+ INH → Tabla A</span>
                </div>
                <div className="flex justify-between">
                  <span>Golpe Brutal (3.5.1)</span>
                  <span className="text-[#e07a8a]">10+ INH → Escala +1</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
