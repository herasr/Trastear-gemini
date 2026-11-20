import React, { useState } from 'react';
import {
  BookOpen,
  Dices,
  Flame,
  Shield,
  Skull,
  Sparkles,
  Swords,
} from 'lucide-react';
import { BESTIARY_ENTITIES } from '../data/bestiary';
import {
  GRIMORIO_SPELLS,
  RELIQUIAS_CIRCULO,
  TABLA_A,
  TABLA_B,
  TABLA_C,
  TABLA_D,
  TABLA_E,
  TABLA_MUTACIONES,
} from '../data/tables';
import { BestiaryEntity } from '../types/game';
import { EntityArtwork } from './EntityArtwork';

interface CompendiumViewProps {
  onStartFreeCombat: (entity: BestiaryEntity) => void;
  onStartSessionZero: () => void;
}

export const CompendiumView: React.FC<CompendiumViewProps> = ({
  onStartFreeCombat,
  onStartSessionZero,
}) => {
  const [section, setSection] = useState<'BESTIARIO' | 'TABLAS' | 'GRIMORIO'>(
    'BESTIARIO'
  );
  const [selectedEntityId, setSelectedEntityId] = useState(
    BESTIARY_ENTITIES[0].id
  );
  const [activeTable, setActiveTable] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'MUT'>(
    'B'
  );

  const selectedEntity =
    BESTIARY_ENTITIES.find((e) => e.id === selectedEntityId) ||
    BESTIARY_ENTITIES[0];

  const currentTableRows =
    activeTable === 'A'
      ? TABLA_A
      : activeTable === 'B'
        ? TABLA_B
        : activeTable === 'C'
          ? TABLA_C
          : activeTable === 'D'
            ? TABLA_D
            : activeTable === 'E'
              ? TABLA_E
              : TABLA_MUTACIONES;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(216,198,174,0.14)] pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#c59b4e] font-semibold">
            Archivo del Guardián · Secciones 3, 6, 8, 10 y 15
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#ece3d5] mt-1">
            Bestiario, Tablas de Filias y Grimorio
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'BESTIARIO', label: 'Bestiario (8)', icon: Skull },
              { id: 'TABLAS', label: 'Tablas A–E y Mutaciones', icon: Dices },
              { id: 'GRIMORIO', label: 'Grimorio y Reliquias', icon: BookOpen },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={`px-3.5 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  section === item.id
                    ? 'border-[#c59b4e] bg-[#c59b4e]/15 text-[#e5be6e]'
                    : 'border-[rgba(216,198,174,0.16)] bg-[#120f17] text-[#b5a998] hover:text-[#ece3d5]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bestiary Section */}
      {section === 'BESTIARIO' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {BESTIARY_ENTITIES.map((ent) => {
              const active = ent.id === selectedEntityId;
              return (
                <button
                  key={ent.id}
                  type="button"
                  onClick={() => setSelectedEntityId(ent.id)}
                  className={`text-left p-3 rounded-xl border transition-all flex items-center gap-3.5 ${
                    active
                      ? 'border-[#c59b4e] bg-[#1a1423]'
                      : 'border-[rgba(216,198,174,0.12)] bg-[#120f17]/80 hover:border-[rgba(216,198,174,0.28)]'
                  }`}
                >
                  <div className="w-14 h-18 shrink-0 rounded overflow-hidden border border-[#c59b4e]/30">
                    <EntityArtwork artworkKey={ent.artworkKey} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-serif-display text-lg font-semibold text-[#ece3d5] truncate">
                      {ent.name}
                    </div>
                    <div className="text-xs text-[#c59b4e] truncate">
                      {ent.subtitle}
                    </div>
                    <div className="font-mono-tabular text-[11px] text-[#b5a998] mt-1">
                      AC {ent.ac} · PV {ent.pv} · Téc {ent.skills.tecnica}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7 bg-[#120f17]/95 border border-[rgba(216,198,174,0.18)] rounded-2xl overflow-hidden flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[rgba(216,198,174,0.12)]">
              <div className="md:col-span-5 bg-[#09080c] p-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-[rgba(216,198,174,0.12)]">
                <div className="w-full max-w-[220px] aspect-[3/4]">
                  <EntityArtwork artworkKey={selectedEntity.artworkKey} />
                </div>
              </div>
              <div className="md:col-span-7 p-5 space-y-3">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#e07a8a]">
                    {selectedEntity.subtitle}
                  </span>
                  <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#ece3d5] mt-0.5">
                    {selectedEntity.name}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#b5a998] leading-relaxed">
                  {selectedEntity.description}
                </p>
                <div className="grid grid-cols-4 gap-2 text-center font-mono-tabular text-xs pt-2">
                  <div className="p-2 rounded bg-[#09080c] border border-[rgba(216,198,174,0.12)]">
                    <div className="text-[10px] text-[#7c7166]">AC</div>
                    <div className="font-semibold text-[#e5be6e]">
                      {selectedEntity.ac}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-[#09080c] border border-[rgba(216,198,174,0.12)]">
                    <div className="text-[10px] text-[#7c7166]">PV</div>
                    <div className="font-semibold text-[#ece3d5]">
                      {selectedEntity.pv}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-[#09080c] border border-[rgba(216,198,174,0.12)]">
                    <div className="text-[10px] text-[#7c7166]">PM</div>
                    <div className="font-semibold text-[#6ad1cc]">
                      {selectedEntity.pm}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-[#09080c] border border-[rgba(216,198,174,0.12)]">
                    <div className="text-[10px] text-[#7c7166]">Técnica</div>
                    <div className="font-semibold text-[#e07a8a]">
                      {selectedEntity.skills.tecnica}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3 text-xs sm:text-sm">
              <div className="p-3 rounded-lg bg-[#09080c] border border-[rgba(216,198,174,0.12)]">
                <div className="text-[11px] uppercase tracking-wider text-[#c59b4e] mb-1">
                  Anatomía Íntima y Pérdida Dual
                </div>
                <p className="text-[#ece3d5]">{selectedEntity.intimateAnatomy}</p>
                <p className="text-[#e07a8a] mt-1">{selectedEntity.dualLossText}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#9e1b32]/12 border border-[#9e1b32]/35">
                  <div className="text-[11px] uppercase tracking-wider text-[#ff8fa0] flex items-center gap-1 mb-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Clímax: {selectedEntity.climaxEffectName}</span>
                  </div>
                  <p className="text-[#ece3d5] text-xs leading-relaxed">
                    {selectedEntity.climaxEffectDesc}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#2e7d7b]/12 border border-[#2e7d7b]/40">
                  <div className="text-[11px] uppercase tracking-wider text-[#6ad1cc] flex items-center gap-1 mb-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Debilidad: {selectedEntity.weaknessName}</span>
                  </div>
                  <p className="text-[#ece3d5] text-xs leading-relaxed">
                    {selectedEntity.weaknessDesc}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onStartFreeCombat(selectedEntity)}
                  className="px-5 py-2.5 rounded-lg bg-[#9e1b32] hover:bg-[#b5223d] text-[#ece3d5] text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors"
                >
                  <Swords className="w-4 h-4 text-[#e5be6e]" />
                  <span>Probar Combate Íntimo contra esta entidad</span>
                </button>
                <button
                  type="button"
                  onClick={onStartSessionZero}
                  className="px-4 py-2 rounded-lg border border-[rgba(216,198,174,0.2)] text-xs text-[#b5a998] hover:text-[#ece3d5]"
                >
                  Iniciar crónica completa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tables A-E & Mutations */}
      {section === 'TABLAS' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { k: 'A', label: 'Tabla A · Arrebato (5+ INH)' },
                { k: 'B', label: 'Tabla B · Filia Leve (75%)' },
                { k: 'C', label: 'Tabla C · Filia Moderada (50%)' },
                { k: 'D', label: 'Tabla D · Filia Profunda (25%)' },
                { k: 'E', label: 'Tabla E · Umbral 0 (Caída)' },
                { k: 'MUT', label: 'Tabla 15.3 · Mutaciones' },
              ] as const
            ).map((t) => (
              <button
                key={t.k}
                type="button"
                onClick={() => setActiveTable(t.k)}
                className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                  activeTable === t.k
                    ? 'border-[#c59b4e] bg-[#c59b4e]/15 text-[#e5be6e] font-semibold'
                    : 'border-[rgba(216,198,174,0.14)] bg-[#120f17] text-[#b5a998]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentTableRows.map((row, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#120f17]/95 border border-[rgba(216,198,174,0.14)] flex items-start gap-3"
              >
                <span className="font-mono-tabular text-xs font-semibold text-[#e5be6e] bg-[#09080c] border border-[#c59b4e]/35 px-2 py-1 rounded shrink-0">
                  {String(row.min).padStart(2, '0')}–
                  {row.max === 100 ? '00' : String(row.max).padStart(2, '0')}
                </span>
                <div>
                  <div className="text-sm font-semibold text-[#ece3d5]">
                    {row.name}
                  </div>
                  <p className="text-xs text-[#b5a998] mt-0.5 leading-relaxed">
                    {row.effect}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grimorio & Relics */}
      {section === 'GRIMORIO' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h2 className="font-serif-display text-2xl font-semibold text-[#ece3d5] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#6ad1cc]" />
              <span>Grimorio del Deseo (Sección 8)</span>
            </h2>
            {GRIMORIO_SPELLS.map((sp) => (
              <div
                key={sp.id}
                className="p-4 rounded-xl bg-[#120f17]/95 border border-[rgba(216,198,174,0.14)] space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-[#ece3d5]">
                    {sp.name}
                  </span>
                  <span className="font-mono-tabular text-xs text-[#6ad1cc]">
                    {sp.cost} · {sp.duration}
                  </span>
                </div>
                <p className="text-xs text-[#b5a998] leading-relaxed">{sp.effect}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h2 className="font-serif-display text-2xl font-semibold text-[#ece3d5] flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#e5be6e]" />
              <span>Reliquias del Círculo (Sección 10)</span>
            </h2>
            {RELIQUIAS_CIRCULO.map((rel) => (
              <div
                key={rel.id}
                className="p-4 rounded-xl bg-[#120f17]/95 border border-[rgba(216,198,174,0.14)] space-y-1.5"
              >
                <div className="font-semibold text-sm text-[#e5be6e]">
                  {rel.name}
                </div>
                <p className="text-xs text-[#ece3d5] leading-relaxed">{rel.effect}</p>
                <p className="text-xs text-[#e07a8a] leading-relaxed">
                  Precio: {rel.cursedPrice}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
