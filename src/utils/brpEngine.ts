import {
  BestiaryEntity,
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
    // Defender wins: no AC loss; counterattack/recovery handled by caller
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

/**
 * Section 3.3: Arrebato de Lujuria mechanical modifiers while arrebatoRounds > 0.
 * - +1 Bonus die to Técnica / Seducción
 * - -1 Penalty die to Resistencia Carnal / POD / INT
 * - Forbids burning PM to reinforce Resistance
 */
export interface ArrebatoModifiers {
  active: boolean;
  offensiveBonusDice: number;
  defensiveBonusDice: number;
  forbidPmBurnInResistance: boolean;
}

export function getArrebatoModifiers(inv: Investigator): ArrebatoModifiers {
  if (inv.arrebatoRounds > 0) {
    return {
      active: true,
      offensiveBonusDice: 1,
      defensiveBonusDice: -1,
      forbidPmBurnInResistance: true,
    };
  }
  return {
    active: false,
    offensiveBonusDice: 0,
    defensiveBonusDice: 0,
    forbidPmBurnInResistance: false,
  };
}

export interface ArrebatoTickResult {
  updatedInvestigator: Investigator;
  ended: boolean;
  lucidezRoll?: DiceRollResult;
  corLost: number;
  note?: string;
}

/**
 * Decrements active Arrebato rounds and triggers the Section 3.3 "Colgajo de Lucidez"
 * Sanity check when the Arrebato ends.
 */
export function tickArrebatoRound(inv: Investigator): ArrebatoTickResult {
  if (inv.arrebatoRounds <= 0) {
    return { updatedInvestigator: inv, ended: false, corLost: 0 };
  }
  const nextRounds = Math.max(0, inv.arrebatoRounds - 1);
  if (nextRounds > 0) {
    return {
      updatedInvestigator: { ...inv, arrebatoRounds: nextRounds },
      ended: false,
      corLost: 0,
    };
  }

  // Arrebato ends: Colgajo de Lucidez (COR check)
  const lucidezRoll = rollD100(
    'Colgajo de Lucidez (fin de Arrebato)',
    inv.cor,
    'NORMAL',
    0
  );
  const corLost = lucidezRoll.isSuccess ? 0 : 1;
  const nextCor = Math.max(0, inv.cor - corLost);
  const note = lucidezRoll.isSuccess
    ? `Colgajo de Lucidez superado (${lucidezRoll.rawRoll} ≤ ${lucidezRoll.effectiveTarget}): asimilas el fin del Arrebato sin perder Cordura.`
    : `Colgajo de Lucidez fallido (${lucidezRoll.rawRoll} > ${lucidezRoll.effectiveTarget}): el regreso a la calma cuesta -1 COR.`;

  return {
    updatedInvestigator: {
      ...inv,
      cor: nextCor,
      arrebatoRounds: 0,
      activeArrebato: null,
    },
    ended: true,
    lucidezRoll,
    corLost,
    note,
  };
}

/**
 * Section 3.2: "Regla de la Primera Vez" — the very first Inhibition check of a
 * campaign is rolled against full POD rather than current INH.
 */
export function resolveInhibitionCheck(
  inv: Investigator,
  label: string,
  difficulty: DifficultyLevel = 'NORMAL',
  bonusPenalty = 0
): {
  roll: DiceRollResult;
  updatedInvestigator: Investigator;
  usedFirstTimeRule: boolean;
} {
  const usedFirstTimeRule = !inv.firstInhRollDone;
  const effectiveBase = usedFirstTimeRule ? inv.attributes.POD : inv.inh;
  const fullLabel = usedFirstTimeRule
    ? `${label} (Primera vez · POD completo)`
    : label;
  const roll = rollD100(fullLabel, effectiveBase, difficulty, bonusPenalty);
  return {
    roll,
    updatedInvestigator: {
      ...inv,
      firstInhRollDone: true,
    },
    usedFirstTimeRule,
  };
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
  sourceNote: string,
  acceptArrebato = true
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

  if (acceptArrebato && amount >= arrebatoThreshold && nextInh > 0) {
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

export interface ClimaxDefeatResult {
  updatedInvestigator: Investigator;
  summary: string;
  baseInhLoss: number;
  burnedPmPaid: number;
  totalInhLoss: number;
  inhResolution: InhLossResolution;
  awakeningRoll: DiceRollResult;
  corLost: number;
  isDead: boolean;
  isCascaron: boolean;
}

/**
 * Sections 5.1, 5.4 & 5.6: Resolves Intimate Combat climax defeat:
 * - 1d6 INH loss (2d6 if Extreme victory or ritual union)
 * - Pays accumulated burned PM (+1 INH per burned PM) ONLY on defeat
 * - Drains PM / permanent CON (CON 0 = death) / permanent POD (POD <= 20 = Cascarón)
 * - Performs "Despertar" COR check (fail: 1d2 COR loss)
 */
export function applyClimaxDefeat(
  invState: Investigator,
  entity: BestiaryEntity,
  options?: {
    wasExtremeOrRitual?: boolean;
    pendingBurnedPm?: number;
    acceptDrenaje?: boolean;
    acceptArrebato?: boolean;
  }
): ClimaxDefeatResult {
  const wasExtremeOrRitual = Boolean(options?.wasExtremeOrRitual);
  const burnedPmPaid = Math.max(0, options?.pendingBurnedPm ?? 0);
  const acceptDrenaje = options?.acceptDrenaje ?? true;
  const acceptArrebato = options?.acceptArrebato ?? true;

  let updated: Investigator = {
    ...invState,
    attributes: { ...invState.attributes },
    marcas: [...invState.marcas],
    accumulatedCombatPenalty: 0,
    arrebatoRounds: 0,
    activeArrebato: null,
  };

  const parts: string[] = [
    `Tu Aguante Carnal ha llegado a 0. ${entity.climaxEffectName}: ${entity.climaxEffectDesc}`,
  ];

  let isDead = Boolean(updated.isDead);
  let isCascaron = Boolean(updated.isCascaron);

  if (acceptDrenaje) {
    if (entity.climaxType === 'PM') {
      const drained = rollDiceNotation('1d6').total;
      updated.pm = Math.max(0, updated.pm - drained);
      parts.push(`Pierdes ${drained} PM.`);
      if (entity.id === 'ninfa-zarza' && wasExtremeOrRitual) {
        const nextCon = Math.max(0, updated.attributes.CON - 1);
        updated.attributes.CON = nextCon;
        updated.maxPv = Math.max(
          1,
          Math.floor((nextCon + updated.attributes.TAM) / 10)
        );
        updated.pv = Math.min(updated.pv, updated.maxPv);
        if (nextCon <= 0) {
          isDead = true;
          updated.isDead = true;
          updated.pv = 0;
          parts.push('CON permanente reducida a 0: colapso físico fatal.');
        } else {
          parts.push(`La savia consume 1 CON permanente (CON actual: ${nextCon}).`);
        }
      }
    } else if (entity.climaxType === 'POD') {
      const podDrain = rollDiceNotation('1d4').total;
      const nextPod = Math.max(0, updated.attributes.POD - podDrain);
      updated.attributes.POD = nextPod;
      updated.maxPm = Math.max(0, Math.floor(nextPod / 5));
      updated.pm = Math.min(updated.pm, updated.maxPm);
      parts.push(`Pierdes ${podDrain} POD permanente (POD actual: ${nextPod}).`);
      if (nextPod <= 20) {
        isCascaron = true;
        updated.isCascaron = true;
        parts.push(
          'Umbral de Cascarón (POD ≤ 20): la voluntad queda vaciada como portavoz involuntario.'
        );
      }
    } else if (entity.climaxType === 'CON') {
      const conDrain = rollDiceNotation('1d3').total;
      const nextCon = Math.max(0, updated.attributes.CON - conDrain);
      updated.attributes.CON = nextCon;
      updated.maxPv = Math.max(
        1,
        Math.floor((nextCon + updated.attributes.TAM) / 10)
      );
      updated.pv = Math.min(updated.pv, updated.maxPv);
      if (nextCon <= 0) {
        isDead = true;
        updated.isDead = true;
        updated.pv = 0;
        parts.push(
          `El frío abisal drena ${conDrain} CON permanente (CON = 0): muerte física en la fosa.`
        );
      } else {
        parts.push(
          `Drenaje de ${conDrain} CON permanente (CON actual: ${nextCon}, PV máx: ${updated.maxPv}).`
        );
      }
    } else {
      if (entity.climaxType === 'SIEMBRA') {
        const pmDrain = rollDiceNotation('1d3').total;
        updated.pm = Math.max(0, updated.pm - pmDrain);
        parts.push(`Pierdes ${pmDrain} PM.`);
      }
      const marcaText = `Marca de ${entity.name} (${entity.climaxEffectName})`;
      if (!updated.marcas.includes(marcaText)) {
        updated.marcas.push(marcaText);
      }
      parts.push(`Recibes la marca: ${marcaText}.`);
    }
  } else {
    parts.push(
      'Drenaje de atributos omitido conforme al Documento de Consentimiento.'
    );
  }

  // Section 5.4: 1d6 INH (2d6 on Extreme victory or ritual climax)
  const baseInhLoss = rollDiceNotation(wasExtremeOrRitual ? '2d6' : '1d6').total;
  const totalInhLoss = baseInhLoss + burnedPmPaid;
  if (burnedPmPaid > 0) {
    parts.push(
      `Desenlace por clímax: -${baseInhLoss} INH (${
        wasExtremeOrRitual ? '2d6 Extremo/Ritual' : '1d6'
      }) + ${burnedPmPaid} INH por PM quemados acumulados.`
    );
  } else {
    parts.push(
      `Desenlace por clímax: -${baseInhLoss} INH (${
        wasExtremeOrRitual ? '2d6 Extremo/Ritual' : '1d6'
      }).`
    );
  }

  const inhResolution = applyInhibitionLoss(
    updated,
    totalInhLoss,
    `Clímax con ${entity.name}`,
    acceptArrebato
  );
  updated = inhResolution.updatedInvestigator;

  // Section 5.4: Awakening SAN roll (Despertar) -> fail loses 1d2 COR
  const awakeningRoll = rollD100(
    `Despertar tras clímax con ${entity.name} (COR)`,
    updated.cor,
    'NORMAL',
    0
  );
  let corLost = 0;
  if (!awakeningRoll.isSuccess) {
    corLost = rollDiceNotation('1d2').total;
    updated.cor = Math.max(0, updated.cor - corLost);
    parts.push(
      `Despertar fallido (${awakeningRoll.rawRoll} > ${awakeningRoll.effectiveTarget}): pierdes ${corLost} COR.`
    );
  } else {
    parts.push(
      `Despertar lúcido (${awakeningRoll.rawRoll} ≤ ${awakeningRoll.effectiveTarget}): conservas tu Cordura.`
    );
  }

  return {
    updatedInvestigator: updated,
    summary: parts.join(' '),
    baseInhLoss,
    burnedPmPaid,
    totalInhLoss,
    inhResolution,
    awakeningRoll,
    corLost,
    isDead,
    isCascaron,
  };
}

export type RecoveryMethod = 'VELO_DISTANCIA' | 'TRAUMA_PURGATIVO' | 'REFUGIO_ESCENA';

export interface RecoveryOutcome {
  updatedInvestigator: Investigator;
  inhGain: number;
  corDelta: number;
  acGain: number;
  note: string;
}

/**
 * Section 7: Canonical Inhibition & Stability recovery valves:
 * - VELO_DISTANCIA: +1 INH & +1 COR after quiet separation
 * - TRAUMA_PURGATIVO: +1d3 INH at the cost of -1 COR (catharsis)
 * - REFUGIO_ESCENA (7.2): +1d3 COR, +1d3 AC, +1 INH via an active Lazo Íntimo
 */
export function applyRecoveryMethod(
  inv: Investigator,
  method: RecoveryMethod,
  lazoId?: string
): RecoveryOutcome {
  if (method === 'VELO_DISTANCIA') {
    const prevInh = inv.inh;
    const prevCor = inv.cor;
    const nextInh = Math.min(inv.initialInh, inv.inh + 1);
    const nextCor = Math.min(inv.maxCor, inv.cor + 1);
    return {
      updatedInvestigator: { ...inv, inh: nextInh, cor: nextCor },
      inhGain: nextInh - prevInh,
      corDelta: nextCor - prevCor,
      acGain: 0,
      note: `Velo y distancia (Sec. 7): recuperas +${nextInh - prevInh} INH y +${nextCor - prevCor} COR en silencio.`,
    };
  }

  if (method === 'TRAUMA_PURGATIVO') {
    const roll = rollDiceNotation('1d3').total;
    const prevInh = inv.inh;
    const nextInh = Math.min(inv.initialInh, inv.inh + roll);
    const nextCor = Math.max(0, inv.cor - 1);
    return {
      updatedInvestigator: { ...inv, inh: nextInh, cor: nextCor },
      inhGain: nextInh - prevInh,
      corDelta: nextCor - inv.cor,
      acGain: 0,
      note: `Trauma purgativo (Sec. 7): consolidas +${nextInh - prevInh} INH (1d3=${roll}) al precio de -1 COR.`,
    };
  }

  // REFUGIO_ESCENA (7.2)
  const corGain = rollDiceNotation('1d3').total;
  const acGainRaw = rollDiceNotation('1d3').total;
  const prevInh = inv.inh;
  const nextInh = Math.min(inv.initialInh, inv.inh + 1);
  const nextCor = Math.min(inv.maxCor, inv.cor + corGain);
  const nextAc = Math.min(inv.maxAc, inv.ac + acGainRaw);

  return {
    updatedInvestigator: {
      ...inv,
      cor: nextCor,
      ac: nextAc,
      inh: nextInh,
      lazos: lazoId
        ? inv.lazos.map((l) =>
            l.id === lazoId ? { ...l, refugeUsedThisSession: true } : l
          )
        : inv.lazos,
    },
    inhGain: nextInh - prevInh,
    corDelta: nextCor - inv.cor,
    acGain: nextAc - inv.ac,
    note: `Escena de Refugio del Cuerpo (7.2): recuperas +${nextCor - inv.cor} COR, +${nextAc - inv.ac} AC y +${nextInh - prevInh} INH.`,
  };
}

/**
 * Checks whether generated text touches any sealed hard limit keywords so
 * client/server safeguards can automatically veil or replace the passage.
 */
export function filterByHardLimits(
  text: string,
  hardLimits: string[]
): { safe: boolean; text: string } {
  const lower = text.toLowerCase();
  const alwaysBlocked = ['menor', 'niño', 'niña', 'infantil', 'adolescente'];
  for (const kw of alwaysBlocked) {
    if (lower.includes(kw)) {
      return {
        safe: false,
        text: '[Escena velada automáticamente por el Veto Universal de Seguridad (Sección 1.3.1).]',
      };
    }
  }
  const limitKeywordMap: Array<{ limitMatch: string; terms: string[] }> = [
    {
      limitMatch: 'coacción',
      terms: ['sin consentimiento', 'forzado', 'forzada', 'obligado', 'obligada'],
    },
    {
      limitMatch: 'gore',
      terms: ['mutilación', 'vísceras', 'desmembramiento', 'sangre extrema'],
    },
    {
      limitMatch: 'agencia',
      terms: ['esclavitud definitiva', 'mente borrada para siempre'],
    },
  ];
  for (const limit of hardLimits) {
    const l = limit.toLowerCase();
    for (const rule of limitKeywordMap) {
      if (l.includes(rule.limitMatch)) {
        if (rule.terms.some((t) => lower.includes(t))) {
          return {
            safe: false,
            text: '[Pasaje suavizado bajo Velo estricto conforme a tus Límites Duros pactados en Sesión Cero.]',
          };
        }
      }
    }
  }
  return { safe: true, text };
}

