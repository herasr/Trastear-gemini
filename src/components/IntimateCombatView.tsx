import React, { useEffect, useState } from 'react';
import {
  Flame,
  Heart,
  Shield,
  ShieldAlert,
  Sparkles,
  Swords,
  AlertOctagon,
  CheckCircle2,
  ArrowRight,
  Zap,
} from 'lucide-react';
import {
  BestiaryEntity,
  CombatSessionSnapshot,
  DiceRollResult,
  Investigator,
  NarrativeLevel,
  RepertorioMove,
} from '../types/game';
import { REPERTORIO_MOVES } from '../data/tables';
import {
  applyClimaxDefeat,
  applyInhibitionLoss,
  getArrebatoModifiers,
  resolveOpposedIntimate,
  rollD100,
  rollDiceNotation,
  tickArrebatoRound,
} from '../utils/brpEngine';
import { soundEngine } from '../utils/soundEngine';
import { getEntityPlateMeta } from '../data/artworkAssets';
import { EntityArtwork, InvestigatorCrest } from './EntityArtwork';

interface IntimateCombatViewProps {
  investigator: Investigator;
  entity: BestiaryEntity;
  narrativeLevel: NarrativeLevel;
  acceptDrenaje?: boolean;
  acceptArrebato?: boolean;
  initialSnapshot?: CombatSessionSnapshot | null;
  onSnapshotChange?: (snapshot: CombatSessionSnapshot) => void;
  onUpdateInvestigator: (updated: Investigator) => void;
  onRollRecorded: (roll: DiceRollResult) => void;
  onLog: (
    type: 'COMBAT' | 'CORRUPTION' | 'ROLL' | 'THRESHOLD',
    title: string,
    detail: string
  ) => void;
  onTriggerThresholdModal: (
    title: string,
    lines: string[],
    reachedZero?: boolean
  ) => void;
  onCombatComplete: (outcome: 'VICTORY' | 'DEFEAT' | 'ESCAPED') => void;
  onTriggerXCard: () => void;
}

interface CombatLogEntry {
  id: string;
  round: number;
  title: string;
  text: string;
  tone: 'neutral' | 'player' | 'entity' | 'warning';
}

export const IntimateCombatView: React.FC<IntimateCombatViewProps> = ({
  investigator,
  entity: initialEntity,
  narrativeLevel,
  acceptDrenaje = true,
  acceptArrebato = true,
  initialSnapshot,
  onSnapshotChange,
  onUpdateInvestigator,
  onRollRecorded,
  onLog,
  onTriggerThresholdModal,
  onCombatComplete,
  onTriggerXCard,
}) => {
  const [entity, setEntity] = useState<BestiaryEntity>(() =>
    initialSnapshot?.entity
      ? { ...initialSnapshot.entity }
      : { ...initialEntity }
  );
  const [round, setRound] = useState(initialSnapshot?.round ?? 1);
  const [pmToBurn, setPmToBurn] = useState(0);
  const [pendingBurnedPm, setPendingBurnedPm] = useState(
    initialSnapshot?.pendingBurnedPm ?? 0
  );
  const [selectedMoveId, setSelectedMoveId] = useState<RepertorioMove['id']>('beso');
  const [ironUsed, setIronUsed] = useState(initialSnapshot?.ironUsed ?? false);
  const [entityPenalty, setEntityPenalty] = useState(
    initialSnapshot?.entityPenalty ?? 0
  );
  const [combatStatus, setCombatStatus] = useState<
    'ACTIVE' | 'VICTORY' | 'DEFEAT' | 'ESCAPED'
  >('ACTIVE');
  const [combatSummary, setCombatSummary] = useState<string | null>(null);
  const [logs, setLogs] = useState<CombatLogEntry[]>([
    {
      id: 'init',
      round: 0,
      title: `Encuentro íntimo con ${initialEntity.name}`,
      text: `${initialEntity.intimateAnatomy} Pérdida dual de entrada: ${initialEntity.dualLossText}`,
      tone: 'warning',
    },
  ]);

  useEffect(() => {
    if (combatStatus === 'ACTIVE' && onSnapshotChange) {
      onSnapshotChange({
        entity,
        round,
        entityPenalty,
        ironUsed,
        pendingBurnedPm,
        returnNodeId: initialSnapshot?.returnNodeId ?? null,
      });
    }
  }, [
    entity,
    round,
    entityPenalty,
    ironUsed,
    pendingBurnedPm,
    combatStatus,
    onSnapshotChange,
    initialSnapshot?.returnNodeId,
  ]);

  const availableMoves = REPERTORIO_MOVES.filter(
    (m) => m.minLevel <= narrativeLevel
  );
  const activeMove =
    availableMoves.find((m) => m.id === selectedMoveId) || availableMoves[0];
  const arrebatoMods = getArrebatoModifiers(investigator);

  const appendLog = (
    title: string,
    text: string,
    tone: CombatLogEntry['tone'] = 'neutral'
  ) => {
    setLogs((prev) => [
      { id: `${Date.now()}-${Math.random()}`, round, title, text, tone },
      ...prev,
    ]);
  };

  const handleApplyInhHit = (
    currentInv: Investigator,
    amount: number,
    reason: string
  ): Investigator => {
    if (amount <= 0) return currentInv;
    const res = applyInhibitionLoss(
      currentInv,
      amount,
      reason,
      acceptArrebato
    );
    if (res.notes.length > 0) {
      onLog('THRESHOLD', 'Desplazamiento de Inhibición', res.notes.join(' '));
      if (
        res.triggeredArrebato ||
        res.newThresholdFilias.length > 0 ||
        res.crossedTenWarning ||
        res.reachedZero
      ) {
        soundEngine.playCorruption();
        onTriggerThresholdModal(
          res.reachedZero
            ? 'Umbral 0 · La Caída Consumada (Tabla E)'
            : res.triggeredArrebato
              ? 'Arrebato de Lujuria (Tabla A)'
              : 'Umbral de Inhibición Cruzado',
          res.notes,
          res.reachedZero
        );
      }
    }
    return res.updatedInvestigator;
  };

  const pickEntityMove = (): RepertorioMove => {
    const validIds = entity.signatureMoves.filter((id) =>
      availableMoves.some((m) => m.id === id)
    );
    const chosenId =
      validIds.length > 0
        ? validIds[(round - 1) % validIds.length]
        : availableMoves[0].id;
    return (
      REPERTORIO_MOVES.find((m) => m.id === chosenId) || availableMoves[0]
    );
  };

  const finishWithClimaxDefeat = (
    invState: Investigator,
    totalBurnedPm: number,
    wasExtremeOrRitual = false
  ) => {
    soundEngine.playCorruption();
    const climax = applyClimaxDefeat(invState, entity, {
      wasExtremeOrRitual,
      pendingBurnedPm: totalBurnedPm,
      acceptDrenaje,
      acceptArrebato,
    });

    onRollRecorded(climax.awakeningRoll);
    if (climax.inhResolution.notes.length > 0) {
      onLog(
        'THRESHOLD',
        'Desplazamiento de Inhibición en Clímax',
        climax.inhResolution.notes.join(' ')
      );
      if (
        climax.inhResolution.triggeredArrebato ||
        climax.inhResolution.newThresholdFilias.length > 0 ||
        climax.inhResolution.crossedTenWarning ||
        climax.inhResolution.reachedZero
      ) {
        onTriggerThresholdModal(
          climax.inhResolution.reachedZero
            ? 'Umbral 0 · La Caída Consumada (Tabla E)'
            : climax.inhResolution.triggeredArrebato
              ? 'Arrebato de Lujuria (Tabla A)'
              : 'Umbral de Inhibición Cruzado',
          climax.inhResolution.notes,
          climax.inhResolution.reachedZero
        );
      }
    }

    onUpdateInvestigator(climax.updatedInvestigator);
    onLog('COMBAT', `Clímax de ${entity.name}`, climax.summary);
    appendLog(`Clímax · ${entity.climaxEffectName}`, climax.summary, 'entity');
    setPendingBurnedPm(0);
    setCombatStatus('DEFEAT');
    setCombatSummary(climax.summary);
  };

  const advanceArrebatoEndOfRound = (inv: Investigator): Investigator => {
    const tick = tickArrebatoRound(inv);
    if (tick.ended && tick.note) {
      if (tick.lucidezRoll) onRollRecorded(tick.lucidezRoll);
      onLog('CORRUPTION', 'Colgajo de Lucidez (3.3)', tick.note);
      appendLog('Fin de Arrebato · Colgajo de Lucidez', tick.note, 'warning');
    }
    return tick.updatedInvestigator;
  };

  // Action 1: Resist / Counter in Intimate Exchange (Section 5.1, 5.2 & 5.3)
  const handleIntimateExchange = (posture: 'RESISTIR' | 'DOMINAR') => {
    if (combatStatus !== 'ACTIVE') return;
    soundEngine.playDiceRoll();

    let nextInv: Investigator = { ...investigator };
    // Section 3.3: Arrebato forbids burning PM in Resistance
    const allowedPm =
      posture === 'RESISTIR' && arrebatoMods.forbidPmBurnInResistance
        ? 0
        : pmToBurn;
    const actualPm = Math.min(3, allowedPm, nextInv.pm);
    if (actualPm > 0) {
      nextInv.pm -= actualPm;
    }
    const nextPendingBurnedPm = pendingBurnedPm + actualPm;
    setPendingBurnedPm(nextPendingBurnedPm);

    const entityMove = pickEntityMove();
    const pmBonus = actualPm * 10;

    if (posture === 'RESISTIR') {
      const entitySkill = Math.max(
        10,
        entity.skills.tecnica + entityMove.attackerMod - entityPenalty
      );
      const playerSkill = Math.max(
        5,
        nextInv.skills.resistenciaCarnal +
          pmBonus +
          entityMove.defenderMod -
          nextInv.accumulatedCombatPenalty
      );

      const res = resolveOpposedIntimate(
        `${entity.name} (${entityMove.name})`,
        entitySkill,
        0,
        `${nextInv.name} (Resistencia Carnal)`,
        playerSkill,
        arrebatoMods.defensiveBonusDice,
        entityMove.acMultiplier
      );

      onRollRecorded(res.defenderRoll);

      const flavor =
        narrativeLevel === 0 ? entityMove.veloText : entityMove.sensualText;

      if (res.winner === 'ATTACKER') {
        const nextAc = Math.max(0, nextInv.ac - res.acDamage);
        nextInv.ac = nextAc;
        nextInv.accumulatedCombatPenalty += res.defenderPenaltyDelta;

        let inhHit = 0;
        if (res.extraPmLoss > 0) {
          nextInv.pm = Math.max(0, nextInv.pm - res.extraPmLoss);
        }
        if (res.extraInhRollNeeded) {
          inhHit += rollDiceNotation('1d3').total;
        }
        if (entityMove.stealsPmOnWin && nextInv.pm > 0) {
          nextInv.pm = Math.max(0, nextInv.pm - 1);
          setEntity((e) => ({ ...e, pm: Math.min(e.maxPm, e.pm + 1) }));
        }
        if (entityMove.extraInhIfFilia && nextInv.filias.length > 0) {
          inhHit += 1;
        }

        const detail = `${flavor} Tirada: ${entity.name} sacó ${res.attackerRoll.rawRoll} (${res.attackerRoll.degree}) frente a tu ${res.defenderRoll.rawRoll} (${res.defenderRoll.degree}). Sufres -${res.acDamage} AC${
          res.defenderPenaltyDelta ? ` y -${res.defenderPenaltyDelta}% acumulativo` : ''
        }${inhHit > 0 ? ` y -${inhHit} INH` : ''}.${
          actualPm > 0
            ? ` (+${actualPm} PM acumulados para pagar si hay derrota)`
            : ''
        }`;

        appendLog(`${entity.name} se impone`, detail, 'entity');
        onLog('COMBAT', `Asalto ${round} · Superada`, detail);

        nextInv = handleApplyInhHit(nextInv, inhHit, `Asalto vs ${entity.name}`);
        if (nextInv.ac <= 0) {
          const extremeOrRitual =
            res.attackerRoll.degree === 'EXTREMO' ||
            res.attackerRoll.degree === 'CRITICO' ||
            entityMove.id === 'union';
          finishWithClimaxDefeat(nextInv, nextPendingBurnedPm, extremeOrRitual);
          return;
        }
        nextInv = advanceArrebatoEndOfRound(nextInv);
        onUpdateInvestigator(nextInv);
      } else if (res.winner === 'DEFENDER') {
        soundEngine.playSuccess(res.defenderRoll.degree === 'EXTREMO');
        const counterAc = rollDiceNotation('1d3').total;
        const nextEntityAc = Math.max(0, entity.ac - counterAc);
        setEntity((e) => ({ ...e, ac: nextEntityAc }));
        nextInv = advanceArrebatoEndOfRound(nextInv);
        onUpdateInvestigator(nextInv);

        const detail = `${flavor} Contienes el empuje (${res.defenderRoll.rawRoll} ${res.defenderRoll.degree} vs ${res.attackerRoll.rawRoll} ${res.attackerRoll.degree}) y quiebras el compás de la entidad (-${counterAc} AC al oponente).`;
        appendLog('Contención firme', detail, 'player');
        onLog('COMBAT', `Asalto ${round} · Resistido`, detail);

        if (nextEntityAc <= 0) {
          setPendingBurnedPm(0);
          setCombatStatus('VICTORY');
          setCombatSummary(
            `Has doblegado el ritmo de ${entity.name} hasta agotar su Aguante Carnal. Los PM quemados en tus victorias no cobran coste adicional en INH (Sección 5.6).`
          );
          return;
        }
      } else {
        nextInv = advanceArrebatoEndOfRound(nextInv);
        onUpdateInvestigator(nextInv);
        appendLog(
          'Empate tenso',
          `Ambos medís vuestras fuerzas (${res.defenderRoll.rawRoll} vs ${res.attackerRoll.rawRoll}). El aire no cede ni avanza.`,
          'neutral'
        );
      }
    } else {
      // DOMINAR: Investigator takes the initiative with Repertorio
      const move = activeMove;
      const playerSkill = Math.max(
        5,
        Math.max(nextInv.skills.tecnica, nextInv.skills.seduccion) +
          move.attackerMod +
          pmBonus -
          nextInv.accumulatedCombatPenalty
      );
      const entitySkill = Math.max(
        10,
        entity.skills.resistenciaCarnal + move.defenderMod - entityPenalty
      );

      const res = resolveOpposedIntimate(
        `${nextInv.name} (${move.name})`,
        playerSkill,
        arrebatoMods.offensiveBonusDice,
        `${entity.name} (Resistencia)`,
        entitySkill,
        0,
        move.acMultiplier
      );
      onRollRecorded(res.attackerRoll);

      const flavor = narrativeLevel === 0 ? move.veloText : move.sensualText;

      if (res.winner === 'ATTACKER') {
        soundEngine.playSuccess(res.attackerRoll.degree === 'EXTREMO');
        const nextEntityAc = Math.max(0, entity.ac - res.acDamage);
        if (move.resetsPenalty) {
          nextInv.accumulatedCombatPenalty = 0;
        }
        if (move.stealsPmOnWin && entity.pm > 0) {
          nextInv.pm = Math.min(nextInv.maxPm, nextInv.pm + 1);
          setEntity((e) => ({
            ...e,
            ac: nextEntityAc,
            pm: Math.max(0, e.pm - 1),
          }));
        } else {
          setEntity((e) => ({ ...e, ac: nextEntityAc }));
        }
        if (res.defenderPenaltyDelta > 0) {
          setEntityPenalty((p) => p + res.defenderPenaltyDelta);
        }

        nextInv = handleApplyInhHit(
          nextInv,
          1,
          `Tomar la iniciativa con ${entity.name}`
        );
        nextInv = advanceArrebatoEndOfRound(nextInv);
        onUpdateInvestigator(nextInv);

        const detail = `${flavor} Tu maniobra (${res.attackerRoll.rawRoll} ${res.attackerRoll.degree}) supera su defensa (${res.defenderRoll.rawRoll} ${res.defenderRoll.degree}): -${res.acDamage} AC a ${entity.name}.`;
        appendLog('Iniciativa victoriosa', detail, 'player');
        onLog('COMBAT', `Asalto ${round} · Iniciativa`, detail);

        if (nextEntityAc <= 0) {
          setPendingBurnedPm(0);
          setCombatStatus('VICTORY');
          setCombatSummary(
            `${entity.name} cae a 0 AC bajo tu cadencia. ${entity.weaknessDesc}`
          );
          return;
        }
      } else {
        const selfAcLoss =
          move.id === 'entrega' ? rollDiceNotation('1d4').total : 1;
        nextInv.ac = Math.max(0, nextInv.ac - selfAcLoss);

        appendLog(
          'Maniobra interceptada',
          `${entity.name} lee tu gesto (${res.defenderRoll.rawRoll} vs tu ${res.attackerRoll.rawRoll}). Pierdes ${selfAcLoss} AC.`,
          'entity'
        );
        if (nextInv.ac <= 0) {
          finishWithClimaxDefeat(
            nextInv,
            nextPendingBurnedPm,
            res.defenderRoll.degree === 'EXTREMO' || move.id === 'union'
          );
          return;
        }
        nextInv = advanceArrebatoEndOfRound(nextInv);
        onUpdateInvestigator(nextInv);
      }
    }

    setPmToBurn(0);
    setRound((r) => r + 1);
  };

  // Action 2: Resistencia de Hierro (Sección 4.3) — 1/encuentro Extremo (1/5)
  const handleIronResistance = () => {
    if (ironUsed || combatStatus !== 'ACTIVE') return;
    setIronUsed(true);
    soundEngine.playDiceRoll();

    const roll = rollD100(
      'Resistencia de Hierro (Extrema)',
      investigator.skills.resistenciaCarnal,
      'EXTREMO',
      arrebatoMods.defensiveBonusDice
    );
    onRollRecorded(roll);

    if (roll.isSuccess) {
      soundEngine.playSuccess(true);
      const msg = `Resistencia de Hierro exitosa (${roll.rawRoll} ≤ ${roll.effectiveTarget}). Detienes tu propia respuesta corporal en seco y rompes el hechizo sin pagar clímax ni PM acumulados.`;
      appendLog('Resistencia de Hierro', msg, 'player');
      onLog('COMBAT', 'Resistencia de Hierro', msg);
      setPendingBurnedPm(0);
      setCombatStatus('ESCAPED');
      setCombatSummary(msg);
    } else {
      const msg = `Resistencia de Hierro fallida (${roll.rawRoll} > ${roll.effectiveTarget}). El pulso sigue obedeciendo al umbral (-1 AC).`;
      let updated: Investigator = {
        ...investigator,
        ac: Math.max(0, investigator.ac - 1),
      };
      appendLog('Resistencia de Hierro fallida', msg, 'entity');
      if (updated.ac <= 0) {
        finishWithClimaxDefeat(updated, pendingBurnedPm, false);
        return;
      }
      updated = advanceArrebatoEndOfRound(updated);
      onUpdateInvestigator(updated);
      setRound((r) => r + 1);
    }
  };

  // Action 3: Exploit Weakness
  const handleExploitWeakness = () => {
    if (combatStatus !== 'ACTIVE') return;
    soundEngine.playDiceRoll();
    const skillVal = investigator.skills[entity.weaknessSkill];
    const roll = rollD100(
      `Debilidad: ${entity.weaknessName}`,
      skillVal,
      'ARDUO'
    );
    onRollRecorded(roll);

    if (roll.isSuccess) {
      soundEngine.playSuccess(true);
      const damage = rollDiceNotation('2d4+2').total;
      const nextEntityAc = Math.max(0, entity.ac - damage);
      setEntity((e) => ({ ...e, ac: nextEntityAc }));
      setEntityPenalty((p) => p + 15);
      const msg = `¡Aciertas en su vulnerabilidad (${roll.rawRoll} ≤ ${roll.effectiveTarget})! ${entity.weaknessDesc} (-${damage} AC y -15% a su ritmo).`;
      appendLog(`Debilidad explotada: ${entity.weaknessName}`, msg, 'player');
      onLog('COMBAT', `Debilidad explotada`, msg);

      if (nextEntityAc <= 0) {
        setPendingBurnedPm(0);
        setCombatStatus('VICTORY');
        setCombatSummary(
          `Al quebrar su punto flaco (${entity.weaknessName}), ${entity.name} pierde toda compostura y retrocede.`
        );
        return;
      }
    } else {
      const acHit = rollDiceNotation('1d3').total;
      let updated: Investigator = {
        ...investigator,
        ac: Math.max(0, investigator.ac - acHit),
      };
      appendLog(
        'Intento frustrado',
        `No logras aplicar ${entity.weaknessName} a tiempo (${roll.rawRoll}). Sufres -${acHit} AC.`,
        'entity'
      );
      if (updated.ac <= 0) {
        finishWithClimaxDefeat(updated, pendingBurnedPm, false);
        return;
      }
      updated = advanceArrebatoEndOfRound(updated);
      onUpdateInvestigator(updated);
    }
    setRound((r) => r + 1);
  };

  // Action 4: Physical breakaway / Pelea
  const handlePhysicalStrike = () => {
    if (combatStatus !== 'ACTIVE') return;
    soundEngine.playDiceRoll();
    const roll = rollD100(
      'Pelea / Romper contacto',
      investigator.skills.pelea,
      'NORMAL'
    );
    onRollRecorded(roll);

    if (roll.isSuccess) {
      soundEngine.playSuccess(false);
      const rawDmg = rollDiceNotation('1d4+1').total;
      const netDmg = Math.max(1, rawDmg - entity.armor);
      const nextPv = Math.max(0, entity.pv - netDmg);
      setEntity((e) => ({ ...e, pv: nextPv }));
      appendLog(
        'Golpe físico',
        `Rompes la distancia con un impacto seco (${roll.rawRoll}): -${netDmg} PV a ${entity.name}.`,
        'player'
      );
      if (nextPv <= 0) {
        setPendingBurnedPm(0);
        setCombatStatus('VICTORY');
        setCombatSummary(
          `${entity.name} se desploma o se disuelve tras el impacto físico. El peligro inmediato ha terminado.`
        );
        return;
      }
    } else {
      const retAc = rollDiceNotation('1d4').total;
      let updated: Investigator = {
        ...investigator,
        ac: Math.max(0, investigator.ac - retAc),
      };
      appendLog(
        'Fallo físico',
        `Tu golpe pasa de largo (${roll.rawRoll}) y ${entity.name} aprovecha la cercanía (-${retAc} AC).`,
        'entity'
      );
      if (updated.ac <= 0) {
        finishWithClimaxDefeat(updated, pendingBurnedPm, false);
        return;
      }
      updated = advanceArrebatoEndOfRound(updated);
      onUpdateInvestigator(updated);
    }
    setRound((r) => r + 1);
  };

  const plateMeta = getEntityPlateMeta(entity.artworkKey);
  const playerAcPct = Math.max(
    0,
    (investigator.ac / Math.max(1, investigator.maxAc)) * 100
  );
  const entityAcPct = Math.max(
    0,
    (entity.ac / Math.max(1, entity.maxAc)) * 100
  );

  return (
    <section className="bg-[#120f17]/95 border border-[#9e1b32]/45 rounded-xl overflow-hidden shadow-2xl">
      {/* Arena Header: Illustrated Confrontation Backdrop */}
      <div
        className="relative p-4 sm:p-6 border-b border-[rgba(216,198,174,0.14)] overflow-hidden"
        style={{ backgroundImage: plateMeta.fallbackGradient }}
      >
        <img
          src={plateMeta.imageSrc}
          alt=""
          referrerPolicy="no-referrer"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-28 scale-105"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#09080c]/75 via-[#120f17]/82 to-[#120f17]"
        />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#e07a8a] font-semibold">
                Combate Íntimo · Sección 5 · Asalto {round}
              </span>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#ece3d5]">
                {entity.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onTriggerXCard}
              className="px-3 py-1.5 rounded-lg border border-[#2e7d7b]/60 bg-[#09080c]/80 hover:bg-[#2e7d7b]/30 text-[#6ad1cc] text-xs font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 backdrop-blur-sm"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Pausa / Salto limpio (Tarjeta X)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Investigator Combat Card */}
            <div className="p-3.5 rounded-xl bg-[#09080c]/88 backdrop-blur-sm border border-[rgba(216,198,174,0.16)] flex items-center gap-3.5 shadow-lg">
              <div className="w-16 h-16 shrink-0">
                <InvestigatorCrest
                  portraitKey={investigator.portraitKey}
                  name={investigator.name}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-serif-display text-lg text-[#ece3d5] font-semibold">
                    {investigator.name}
                  </span>
                  <span className="font-mono-tabular text-xs font-semibold text-[#e5be6e]">
                    AC {investigator.ac}/{investigator.maxAc}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-[#1a1524] border border-[rgba(216,198,174,0.1)] overflow-hidden mt-1.5 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#87672e] to-[#e5be6e] transition-all duration-300"
                    style={{ width: `${playerAcPct}%` }}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#b5a998] font-mono-tabular mt-2">
                  <span>Resistencia {investigator.skills.resistenciaCarnal}%</span>
                  <span>·</span>
                  <span>Técnica {investigator.skills.tecnica}%</span>
                  {investigator.accumulatedCombatPenalty > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-[#ff8fa0]">
                        Penal. -{investigator.accumulatedCombatPenalty}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Entity Combat Card */}
            <div className="p-3.5 rounded-xl bg-[#09080c]/88 backdrop-blur-sm border border-[#9e1b32]/45 flex items-center gap-3.5 shadow-lg">
              <div className="w-16 h-22 shrink-0 rounded-lg overflow-hidden border border-[#c59b4e]/45 shadow-md">
                <EntityArtwork artworkKey={entity.artworkKey} compact />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-serif-display text-lg text-[#ece3d5] font-semibold truncate">
                    {entity.name}
                  </span>
                  <span className="font-mono-tabular text-xs font-semibold text-[#e07a8a] shrink-0">
                    AC {entity.ac}/{entity.maxAc}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-[#1a1524] border border-[rgba(216,198,174,0.1)] overflow-hidden mt-1.5 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#721122] to-[#e07a8a] transition-all duration-300"
                    style={{ width: `${entityAcPct}%` }}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#b5a998] font-mono-tabular mt-2">
                  <span>PV {entity.pv}/{entity.maxPv}</span>
                  <span>·</span>
                  <span>Técnica {entity.skills.tecnica}%</span>
                  <span>·</span>
                  <span>Armadura {entity.armor}</span>
                </div>
                <p className="text-[11px] text-[#c59b4e] mt-1 truncate">
                  Debilidad: {entity.weaknessName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tactical Body */}
      <div className="p-4 sm:p-5 space-y-5">
        {combatStatus === 'ACTIVE' ? (
          <>
            {arrebatoMods.active && (
              <div className="p-3 rounded-lg border border-[#d43750]/60 bg-[#9e1b32]/18 text-xs flex flex-wrap items-center justify-between gap-2">
                <span className="text-[#ff8fa0] font-semibold">
                  Arrebato de Lujuria activo ({investigator.arrebatoRounds}{' '}
                  asaltos): +1D a Dominar · -1D a Resistir · Sin quema de PM en
                  Resistencia
                </span>
                <span className="font-mono-tabular text-[11px] text-[#e5be6e]">
                  Colgajo de Lucidez al terminar
                </span>
              </div>
            )}

            {/* PM Burn + Repertorio Selector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#b5a998] block">
                  Repertorio para tomar la iniciativa (Sección 5.2.1)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableMoves.map((move) => {
                    const selected = activeMove.id === move.id;
                    return (
                      <button
                        key={move.id}
                        type="button"
                        onClick={() => setSelectedMoveId(move.id)}
                        className={`text-left p-2.5 rounded-lg border transition-colors ${
                          selected
                            ? 'border-[#c59b4e] bg-[#c59b4e]/12'
                            : 'border-[rgba(216,198,174,0.12)] bg-[#09080c]/70 hover:border-[rgba(216,198,174,0.3)]'
                        }`}
                      >
                        <div className="text-xs font-semibold text-[#ece3d5]">
                          {move.name}
                        </div>
                        <div className="text-[11px] text-[#b5a998] mt-0.5">
                          {move.summary}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PM Burn + Main Tactical Buttons */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-3 bg-[#09080c]/80 border border-[rgba(216,198,174,0.12)] rounded-lg p-3.5">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[#ece3d5] font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#6ad1cc]" />
                      Quemar PM (+10% por PM, máx. 3)
                    </span>
                    <span className="font-mono-tabular text-[#6ad1cc]">
                      Disp: {investigator.pm} PM
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0, 1, 2, 3].map((val) => {
                      const disabled = val > investigator.pm;
                      return (
                        <button
                          key={val}
                          type="button"
                          disabled={disabled}
                          onClick={() => setPmToBurn(val)}
                          className={`py-1.5 rounded text-xs font-mono-tabular border transition-colors ${
                            disabled
                              ? 'opacity-30 cursor-not-allowed border-[#9b8f82]/20 text-[#9b8f82]'
                              : pmToBurn === val
                                ? 'border-[#6ad1cc] bg-[#2e7d7b]/30 text-[#ece3d5] font-semibold'
                                : 'border-[rgba(216,198,174,0.16)] text-[#b5a998] hover:text-[#ece3d5]'
                          }`}
                        >
                          {val === 0 ? '0 PM' : `+${val * 10}%`}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-[#9b8f82] mt-1.5">
                    Los PM quemados se acumulan y solo cuestan +1 INH/PM si el
                    encuentro acaba en derrota (5.1/5.6).
                    {pendingBurnedPm > 0 && (
                      <span className="block text-[#e5be6e] font-mono-tabular mt-0.5">
                        Acumulados en riesgo: {pendingBurnedPm} PM
                      </span>
                    )}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[rgba(216,198,174,0.1)]">
                  <button
                    type="button"
                    onClick={() => handleIntimateExchange('RESISTIR')}
                    className="w-full py-2.5 px-3 rounded-lg bg-[#2e7d7b]/25 hover:bg-[#2e7d7b]/40 border border-[#6ad1cc]/40 text-[#ece3d5] text-xs font-semibold flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#6ad1cc]" />
                      <span>
                        Resistir con Resistencia Carnal
                        {arrebatoMods.forbidPmBurnInResistance ? ' (-1D, sin PM)' : ''}
                      </span>
                    </span>
                    <span className="font-mono-tabular text-[#6ad1cc]">
                      {Math.max(
                        5,
                        investigator.skills.resistenciaCarnal +
                          (arrebatoMods.forbidPmBurnInResistance ? 0 : pmToBurn * 10) -
                          investigator.accumulatedCombatPenalty
                      )}
                      %
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleIntimateExchange('DOMINAR')}
                    className="w-full py-2.5 px-3 rounded-lg bg-[#9e1b32] hover:bg-[#b5223d] border border-[#d43750]/50 text-[#ece3d5] text-xs font-semibold flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#e5be6e]" />
                      <span>
                        Imponer ritmo ({activeMove.name})
                        {arrebatoMods.active ? ' (+1D)' : ''}
                      </span>
                    </span>
                    <span className="font-mono-tabular text-[#e5be6e]">
                      {Math.max(
                        5,
                        Math.max(
                          investigator.skills.tecnica,
                          investigator.skills.seduccion
                        ) +
                          activeMove.attackerMod +
                          pmToBurn * 10 -
                          investigator.accumulatedCombatPenalty
                      )}
                      %
                    </span>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      disabled={ironUsed}
                      onClick={handleIronResistance}
                      className={`py-2 px-2 rounded border text-[11px] font-medium flex items-center justify-center gap-1 transition-colors ${
                        ironUsed
                          ? 'opacity-40 cursor-not-allowed border-[#7c7166]/20 text-[#7c7166]'
                          : 'border-[#c59b4e]/50 bg-[#c59b4e]/12 hover:bg-[#c59b4e]/25 text-[#e5be6e]'
                      }`}
                      title="1/encuentro: tirada Extrema (1/5) de Resistencia Carnal para romper la escena limpio"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">R. Hierro (1/5)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExploitWeakness}
                      className="py-2 px-2 rounded border border-[rgba(216,198,174,0.22)] bg-[#14111a] hover:border-[#e5be6e]/60 text-[11px] text-[#ece3d5] font-medium flex items-center justify-center gap-1 transition-colors"
                      title={entity.weaknessDesc}
                    >
                      <Zap className="w-3.5 h-3.5 text-[#e5be6e] shrink-0" />
                      <span className="truncate">Debilidad (1/2)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePhysicalStrike}
                      className="py-2 px-2 rounded border border-[rgba(216,198,174,0.22)] bg-[#14111a] hover:border-[#d43750]/60 text-[11px] text-[#ece3d5] font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      <Swords className="w-3.5 h-3.5 text-[#e07a8a] shrink-0" />
                      <span className="truncate">
                        Golpe ({investigator.skills.pelea}%)
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-5 rounded-xl border border-[#c59b4e]/50 bg-[#1a1423] space-y-4">
            <div className="flex items-start gap-3">
              {combatStatus === 'DEFEAT' ? (
                <Heart className="w-6 h-6 text-[#d43750] shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-[#6ad1cc] shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className="font-serif-display text-xl font-semibold text-[#ece3d5]">
                  {combatStatus === 'VICTORY'
                    ? 'Umbral dominado'
                    : combatStatus === 'ESCAPED'
                      ? 'Contención limpia (Resistencia de Hierro)'
                      : 'Clímax alcanzado'}
                </h3>
                <p className="text-sm text-[#b5a998] mt-1 leading-relaxed">
                  {combatSummary}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onCombatComplete(combatStatus)}
              className="px-5 py-2.5 rounded-lg bg-[#9e1b32] hover:bg-[#b5223d] text-[#ece3d5] text-sm font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <span>Continuar crónica</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Round-by-round Combat Feed */}
        <div className="border-t border-[rgba(216,198,174,0.12)] pt-4 space-y-2 max-h-60 overflow-y-auto">
          <div className="text-[11px] uppercase tracking-wider text-[#7c7166]">
            Registro del Encuentro
          </div>
          {logs.map((entry) => (
            <div
              key={entry.id}
              className={`p-3 rounded-lg border text-xs leading-relaxed ${
                entry.tone === 'player'
                  ? 'border-[#2e7d7b]/40 bg-[#2e7d7b]/10 text-[#ece3d5]'
                  : entry.tone === 'entity'
                    ? 'border-[#9e1b32]/45 bg-[#9e1b32]/12 text-[#ece3d5]'
                    : entry.tone === 'warning'
                      ? 'border-[#c59b4e]/40 bg-[#c59b4e]/10 text-[#ece3d5]'
                      : 'border-[rgba(216,198,174,0.12)] bg-[#09080c] text-[#b5a998]'
              }`}
            >
              <div className="font-semibold text-[#e5be6e] mb-0.5">
                {entry.round > 0 ? `Asalto ${entry.round} · ` : ''}
                {entry.title}
              </div>
              <p>{entry.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
