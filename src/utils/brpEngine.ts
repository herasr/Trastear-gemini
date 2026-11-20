import {
  DifficultyLevel,
  DiceRollResult,
  FiliaEntry,
  Investigator,
  SuccessDegree,
} from '../types/game';
import { TABLA_A, TABLA_B, TABLA_C, TABLA_D, TABLA_E } from '../data/tables';

export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Evaluates a dice notation string like "1d6", "1d4+1", "2d6+3", or "2".
 */
export function rollDiceNotation(notation: string | number): {
  total: number;
  detail: string;
} {
  if (typeof notation === 'number') {
    return { total: notation, detail: `${notation}` };
  }
  const clean = notation.trim().toLowerCase();
  const match = clean.match(/^(\d+)d(\d+)([+-]\d+)?$/);
  if (!match) {
    const parsed = parseInt(clean, 10);
    return { total: isNaN(parsed) ? 0 : parsed, detail: clean };
  }
  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const mod = match[3] ? parseInt(match[3], 10) : 0;

  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(rollDie(sides));
  }
  const sum = rolls.reduce((a, b) => a + b, 0) + mod;
  const modText = mod > 0 ? `+${mod}` : mod < 0 ? `${mod}` : '';
  return {
    total: Math.max(0, sum),
    detail: `[${rolls.join('+')}]${modText} = ${Math.max(0, sum)}`,
  };
}

export function getEffectiveTarget(
  target: number,
  difficulty: DifficultyLevel
): number {
  if (difficulty === 'ARDUO') return Math.max(1, Math.floor(target / 2));
  if (difficulty === 'EXTREMO') return Math.max(1, Math.floor(target / 5));
  return Math.max(1, target);
}

export function evaluateDegree(
  roll: number,
  baseSkill: number,
  difficulty: DifficultyLevel
): { degree: SuccessDegree; isSuccess: boolean } {
  const isFumble = baseSkill >= 50 ? roll === 100 : roll >= 96;
  if (isFumble) {
    return { degree: 'PIFIA', isSuccess: false };
  }
  if (roll === 1 || (roll <= 5 && roll <= Math.floor(baseSkill / 5))) {
    return { degree: 'CRITICO', isSuccess: true };
  }
  const extremoThreshold = Math.max(1, Math.floor(baseSkill / 5));
  const arduoThreshold = Math.max(1, Math.floor(baseSkill / 2));

  let achieved: SuccessDegree = 'FALLO';
  if (roll <= extremoThreshold) achieved = 'EXTREMO';
  else if (roll <= arduoThreshold) achieved = 'ARDUO';
  else if (roll <= baseSkill) achieved = 'NORMAL';

  if (difficulty === 'EXTREMO') {
    const ok = achieved === 'EXTREMO';
    return { degree: ok ? achieved : 'FALLO', isSuccess: ok };
  }
  if (difficulty === 'ARDUO') {
    const ok = achieved === 'EXTREMO' || achieved === 'ARDUO';
    return { degree: ok ? achieved : 'FALLO', isSuccess: ok };
  }

  return {
    degree: achieved,
    isSuccess: achieved !== 'FALLO',
  };
}

/**
 * BRP D100 roll with optional bonus (+1, +2) or penalty (-1, -2) tens dice.
 */
export function rollD100(
  label: string,
  target: number,
  difficulty: DifficultyLevel = 'NORMAL',
  bonusPenaltyCount = 0
): DiceRollResult {
  const units = rollDie(10) - 1; // 0..9
  const extraCount = Math.abs(bonusPenaltyCount);
  const tensCandidates: number[] = [];
  for (let i = 0; i < 1 + extraCount; i++) {
    tensCandidates.push((rollDie(10) - 1) * 10);
  }

  const candidateValues = tensCandidates.map((t) =>
    t === 0 && units === 0 ? 100 : t + units
  );

  let chosen = candidateValues[0];
  let chosenTens = tensCandidates[0];
  if (bonusPenaltyCount > 0) {
    // Bonus die: pick lowest value
    let bestIdx = 0;
    for (let i = 1; i < candidateValues.length; i++) {
      if (candidateValues[i] < candidateValues[bestIdx]) bestIdx = i;
    }
    chosen = candidateValues[bestIdx];
    chosenTens = tensCandidates[bestIdx];
  } else if (bonusPenaltyCount < 0) {
    // Penalty die: pick highest value
    let worstIdx = 0;
    for (let i = 1; i < candidateValues.length; i++) {
      if (candidateValues[i] > candidateValues[worstIdx]) worstIdx = i;
    }
    chosen = candidateValues[worstIdx];
    chosenTens = tensCandidates[worstIdx];
  }

  const clampedTarget = Math.max(1, Math.min(99, target));
  const { degree, isSuccess } = evaluateDegree(chosen, clampedTarget, difficulty);
  const effectiveTarget = getEffectiveTarget(clampedTarget, difficulty);

  let bonusPenaltyNote: string | undefined;
  if (bonusPenaltyCount > 0) {
    bonusPenaltyNote = `Dado de bonificación (${candidateValues.join(' / ')})`;
  } else if (bonusPenaltyCount < 0) {
    bonusPenaltyNote = `Dado de penalización (${candidateValues.join(' / ')})`;
  }

  return {
    id: `roll-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label,
    rawRoll: chosen,
    tensDie: chosenTens,
    unitsDie: units,
    target: clampedTarget,
    effectiveTarget,
    difficulty,
    degree,
    isSuccess,
    bonusPenaltyNote,
    allRolls: candidateValues.length > 1 ? candidateValues : undefined,
    timestamp: Date.now(),
  };
}

export function degreeRank(degree: SuccessDegree): number {
  switch (degree) {
    case 'CRITICO':
      return 5;
    case 'EXTREMO':
      return 4;
    case 'ARDUO':
      return 3;
    case 'NORMAL':
      return 2;
    case 'FALLO':
      return 1;
    case 'PIFIA':
      return 0;
  }
}

export interface OpposedResult {
  attackerRoll: DiceRollResult;
  defenderRoll: DiceRollResult;
  winner: 'ATTACKER' | 'DEFENDER' | 'TIE';
  acDamage: number;
  extraPmLoss: number;
  extraInhRollNeeded: boolean;
  defenderPenaltyDelta: number;
  triggeredCriticalArrebato: boolean;
}

export function resolveOpposedIntimate(
  attLabel: string,
  attSkill: number,
  attBonusDice: number,
  defLabel: string,
  defSkill: number,
  defBonusDice: number,
  acMultiplier = 1
): OpposedResult {
  const attackerRoll = rollD100(attLabel, attSkill, 'NORMAL', attBonusDice);
  const defenderRoll = rollD100(defLabel, defSkill, 'NORMAL', defBonusDice);

  const attRank = degreeRank(attackerRoll.degree);
  const defRank = degreeRank(defenderRoll.degree);

  let winner: 'ATTACKER' | 'DEFENDER' | 'TIE' = 'TIE';
  if (attackerRoll.isSuccess && !defenderRoll.isSuccess) {
    winner = 'ATTACKER';
  } else if (!attackerRoll.isSuccess && defenderRoll.isSuccess) {
    winner = 'DEFENDER';
  } else if (attackerRoll.isSuccess && defenderRoll.isSuccess) {
    if (attRank > defRank) winner = 'ATTACKER';
    else if (defRank > attRank) winner = 'DEFENDER';
    else if (attSkill > defSkill) winner = 'ATTACKER';
    else if (defSkill > attSkill) winner = 'DEFENDER';
    else winner = 'TIE';
  } else {
    // Both failed: defender fumble still loses as per 5.2
    if (defenderRoll.degree === 'PIFIA' && attackerRoll.degree !== 'PIFIA') {
      winner = 'ATTACKER';
    } else {
      winner = 'TIE';
    }
  }

  let acDamage = 0;
  let extraPmLoss = 0;
  let extraInhRollNeeded = false;
  let defenderPenaltyDelta = 0;
  let triggeredCriticalArrebato = false;

  if (winner === 'ATTACKER') {
    const effectiveDegree =
      defenderRoll.degree === 'PIFIA' ? 'EXTREMO' : attackerRoll.degree;
    if (effectiveDegree === 'CRITICO') {
      acDamage = rollDiceNotation('2d6+3').total;
      extraPmLoss = 1;
      extraInhRollNeeded = true;
      triggeredCriticalArrebato = true;
    } else if (effectiveDegree === 'EXTREMO') {
      acDamage = rollDiceNotation('2d6').total;
      extraPmLoss = 1;
      extraInhRollNeeded = true;
    } else if (effectiveDegree === 'ARDUO') {
      acDamage = rollDiceNotation('1d6').total;
      defenderPenaltyDelta = 10;
    } else {
      acDamage = rollDiceNotation('1d4').total;
    }
    acDamage = Math.max(1, Math.round(acDamage * acMultiplier));
  } else if (winner === 'DEFENDER') {
    // Defender wins: no AC loss; if defender counterattacks, damage handled separately
  }

  return {
    attackerRoll,
    defenderRoll,
    winner,
    acDamage,
    extraPmLoss,
    extraInhRollNeeded,
    defenderPenaltyDelta,
    triggeredCriticalArrebato,
  };
}

export function pickFromD100Table<T extends { min: number; max: number }>(
  table: T[],
  rollValue?: number
): { roll: number; entry: T } {
  const r = rollValue ?? rollDie(100);
  const found = table.find((item) => r >= item.min && r <= item.max) ?? table[0];
  return { roll: r, entry: found };
}

export interface InhLossResolution {
  updatedInvestigator: Investigator;
  lossAmount: number;
  triggeredArrebato: boolean;
  arrebatoFilia?: FiliaEntry;
  newThresholdFilias: FiliaEntry[];
  crossedTenWarning: boolean;
  reachedZero: boolean;
  notes: string[];
}

/**
 * Applies Inhibition loss according to Sections 3.2, 3.3, 3.4, and 3.5:
 * - Regla de la primera vez (3.2)
 * - Arrebato de Lujuria on 5+ loss (3.3) -> Tabla A
 * - Golpe brutal (10+ in one roll escalates threshold level) (3.5.1)
 * - Thresholds 75% (Tabla B), 50% (Tabla C), 25% (Tabla D), 10 (Aviso), 0 (Tabla E)
 * - Never triggers the same threshold twice (3.5.1)
 */
export function applyInhibitionLoss(
  inv: Investigator,
  amount: number,
  sourceNote: string
): InhLossResolution {
  const notes: string[] = [];
  if (inv.inhAnomalyFixed || amount <= 0) {
    return {
      updatedInvestigator: inv,
      lossAmount: 0,
      triggeredArrebato: false,
      newThresholdFilias: [],
      crossedTenWarning: false,
      reachedZero: false,
      notes: inv.inhAnomalyFixed
        ? ['Inhibición anómala: no desciende por medios ordinarios.']
        : [],
    };
  }

  const nextInh = Math.max(0, inv.inh - amount);
  const nextThresholds = { ...inv.thresholdsCrossed };
  const nextFilias = [...inv.filias];
  const newThresholdFilias: FiliaEntry[] = [];

  // Check Arrebato de Lujuria (3.3): 5+ INH in a single hit (or 3+ if Umbral bajo)
  const hasLowThreshold = nextFilias.some((f) =>
    f.name.toLowerCase().includes('umbral bajo')
  );
  const arrebatoThreshold = hasLowThreshold ? 3 : 5;
  let triggeredArrebato = false;
  let arrebatoFilia: FiliaEntry | undefined;
  let nextArrebatoRounds = inv.arrebatoRounds;
  let nextActiveArrebato = inv.activeArrebato;

  if (amount >= arrebatoThreshold && nextInh > 0) {
    triggeredArrebato = true;
    const { roll, entry } = pickFromD100Table(TABLA_A);
    arrebatoFilia = {
      id: `arrebato-${Date.now()}-${roll}`,
      table: 'A',
      name: entry.name,
      trigger: `Arrebato (${roll}) · ${sourceNote}`,
      mechanicalEffect: entry.effect,
      curable: true,
      temporary: true,
    };
    nextArrebatoRounds = rollDie(6);
    nextActiveArrebato = arrebatoFilia;
    notes.push(
      `Arrebato de Lujuria (${nextArrebatoRounds} asaltos): ${entry.name}`
    );
  }

  // Brutal hit escalation (3.5.1): 10+ INH in one hit escalates the threshold table by 1
  const brutalEscalate = amount >= 10;
  if (brutalEscalate) {
    notes.push('Golpe brutal (10+ INH): el umbral de filia escala un nivel.');
  }

  const p75 = Math.floor(inv.initialInh * 0.75);
  const p50 = Math.floor(inv.initialInh * 0.5);
  const p25 = Math.floor(inv.initialInh * 0.25);

  const triggerTable = (tableKey: 'B' | 'C' | 'D' | 'E') => {
    const sourceTable =
      tableKey === 'B'
        ? TABLA_B
        : tableKey === 'C'
          ? TABLA_C
          : tableKey === 'D'
            ? TABLA_D
            : TABLA_E;
    const { roll, entry } = pickFromD100Table(sourceTable);
    const filia: FiliaEntry = {
      id: `filia-${tableKey}-${Date.now()}-${roll}`,
      table: tableKey,
      name: entry.name,
      trigger: `Umbral Tabla ${tableKey} (d100: ${roll})`,
      mechanicalEffect: entry.effect,
      curable: tableKey === 'B' || tableKey === 'C',
    };
    nextFilias.push(filia);
    newThresholdFilias.push(filia);
    notes.push(`Nueva Filia (Tabla ${tableKey}): ${entry.name}`);
  };

  if (!nextThresholds.t75 && nextInh <= p75) {
    nextThresholds.t75 = true;
    triggerTable(brutalEscalate ? 'C' : 'B');
  }
  if (!nextThresholds.t50 && nextInh <= p50) {
    nextThresholds.t50 = true;
    triggerTable(brutalEscalate ? 'D' : 'C');
  }
  if (!nextThresholds.t25 && nextInh <= p25) {
    nextThresholds.t25 = true;
    triggerTable(brutalEscalate ? 'E' : 'D');
  }

  let crossedTenWarning = false;
  if (!nextThresholds.t10Warned && nextInh <= 10 && nextInh > 0) {
    nextThresholds.t10Warned = true;
    crossedTenWarning = true;
    notes.push(
      'Umbral de aviso (INH ≤ 10): el Guardián debe pactar contigo hacia dónde camina la caída (Sección 3.4).'
    );
  }

  let reachedZero = false;
  if (!nextThresholds.t0 && nextInh === 0) {
    nextThresholds.t0 = true;
    reachedZero = true;
    triggerTable('E');
  }

  return {
    updatedInvestigator: {
      ...inv,
      inh: nextInh,
      firstInhRollDone: true,
      thresholdsCrossed: nextThresholds,
      filias: nextFilias,
      arrebatoRounds: nextArrebatoRounds,
      activeArrebato: nextActiveArrebato,
    },
    lossAmount: amount,
    triggeredArrebato,
    arrebatoFilia,
    newThresholdFilias,
    crossedTenWarning,
    reachedZero,
    notes,
  };
}
