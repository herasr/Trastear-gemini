import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  applyClimaxDefeat,
  applyInhibitionLoss,
  applyRecoveryMethod,
  evaluateDegree,
  filterByHardLimits,
  getArrebatoModifiers,
  getEffectiveTarget,
  resolveInhibitionCheck,
  resolveOpposedIntimate,
  rollD100,
  rollDiceNotation,
  tickArrebatoRound,
} from '../brpEngine';
import { INVESTIGATORS } from '../../data/investigators';
import { BESTIARY_ENTITIES } from '../../data/bestiary';
import { Investigator } from '../../types/game';

function cloneElena(): Investigator {
  return JSON.parse(JSON.stringify(INVESTIGATORS[0]));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('brpEngine · dados y grados de éxito', () => {
  it('evalúa notación de dados simple y con modificador', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // 1d6 -> 4
    const res = rollDiceNotation('2d6+3');
    expect(res.total).toBe(11);
    expect(res.detail).toContain('11');
    expect(rollDiceNotation('4').total).toBe(4);
    expect(rollDiceNotation(5).total).toBe(5);
  });

  it('calcula umbrales Normal, Arduo (1/2) y Extremo (1/5)', () => {
    expect(getEffectiveTarget(65, 'NORMAL')).toBe(65);
    expect(getEffectiveTarget(65, 'ARDUO')).toBe(32);
    expect(getEffectiveTarget(65, 'EXTREMO')).toBe(13);
    expect(getEffectiveTarget(3, 'EXTREMO')).toBe(1);
  });

  it('evalúa Crítico, Extremo, Arduo, Normal, Fallo y Pifia según habilidad <50 y >=50', () => {
    expect(evaluateDegree(1, 60, 'NORMAL')).toEqual({ degree: 'CRITICO', isSuccess: true });
    expect(evaluateDegree(12, 60, 'NORMAL')).toEqual({ degree: 'EXTREMO', isSuccess: true });
    expect(evaluateDegree(30, 60, 'NORMAL')).toEqual({ degree: 'ARDUO', isSuccess: true });
    expect(evaluateDegree(60, 60, 'NORMAL')).toEqual({ degree: 'NORMAL', isSuccess: true });
    expect(evaluateDegree(61, 60, 'NORMAL')).toEqual({ degree: 'FALLO', isSuccess: false });
    expect(evaluateDegree(100, 60, 'NORMAL')).toEqual({ degree: 'PIFIA', isSuccess: false });
    // Habilidad < 50: pifia en 96-100
    expect(evaluateDegree(96, 40, 'NORMAL')).toEqual({ degree: 'PIFIA', isSuccess: false });
    expect(evaluateDegree(97, 60, 'NORMAL')).toEqual({ degree: 'FALLO', isSuccess: false });
    // Dificultad Ardua / Extrema filtra éxitos inferiores
    expect(evaluateDegree(45, 60, 'ARDUO')).toEqual({ degree: 'FALLO', isSuccess: false });
    expect(evaluateDegree(25, 60, 'EXTREMO')).toEqual({ degree: 'FALLO', isSuccess: false });
    expect(evaluateDegree(10, 60, 'EXTREMO')).toEqual({ degree: 'EXTREMO', isSuccess: true });
  });

  it('aplica dados de bonificación (decena menor) y penalización (decena mayor)', () => {
    // units = 4 (0.45 -> 5-1=4), tens1 = 70 (0.75), tens2 = 10 (0.15)
    const seq = [0.45, 0.75, 0.15];
    let idx = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => seq[idx++] ?? 0.5);
    const bonus = rollD100('Seducción', 60, 'NORMAL', 1);
    expect(bonus.rawRoll).toBe(14);
    expect(bonus.allRolls).toEqual([74, 14]);

    idx = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => seq[idx++] ?? 0.5);
    const penalty = rollD100('Resistencia', 60, 'NORMAL', -1);
    expect(penalty.rawRoll).toBe(74);
    expect(penalty.allRolls).toEqual([74, 14]);
  });

  it('resuelve tirada enfrentada en Combate Íntimo', () => {
    // Attacker rolls 11 (Extremo vs 70), Defender rolls 45 (Normal vs 60)
    const seq = [0.15, 0.15, 0.55, 0.45, 0.5, 0.5]; // units=1, tens=10 -> 11; units=5, tens=40 -> 45; dmg 2d6 -> 4+4=8
    let idx = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => seq[idx++] ?? 0.5);
    const res = resolveOpposedIntimate('Atacante', 70, 0, 'Defensor', 60, 0, 1);
    expect(res.winner).toBe('ATTACKER');
    expect(res.extraPmLoss).toBe(1);
    expect(res.extraInhRollNeeded).toBe(true);
    expect(res.acDamage).toBeGreaterThanOrEqual(2);
  });
});

describe('brpEngine · Sección 3 (Primera Vez, Arrebato, Umbrales y Golpe Brutal)', () => {
  it('aplica la Regla de la Primera Vez (3.2) usando POD completo la primera vez', () => {
    const elena = cloneElena();
    elena.inh = 20;
    elena.attributes.POD = 65;
    elena.firstInhRollDone = false;

    vi.spyOn(Math, 'random').mockReturnValue(0.4); // roll = 44
    const first = resolveInhibitionCheck(elena, 'Tirada de Inhibición');
    expect(first.usedFirstTimeRule).toBe(true);
    expect(first.roll.target).toBe(65);
    expect(first.roll.isSuccess).toBe(true);
    expect(first.updatedInvestigator.firstInhRollDone).toBe(true);

    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const second = resolveInhibitionCheck(first.updatedInvestigator, 'Tirada de Inhibición');
    expect(second.usedFirstTimeRule).toBe(false);
    expect(second.roll.target).toBe(20);
    expect(second.roll.isSuccess).toBe(false);
  });

  it('dispara Arrebato con 5+ INH, aplica modificadores y Colgajo de Lucidez al terminar', () => {
    const elena = cloneElena();
    vi.spyOn(Math, 'random').mockReturnValue(0.2); // roll in Tabla A & 1d6=2 rounds
    const res = applyInhibitionLoss(elena, 5, 'Escena de prueba');
    expect(res.triggeredArrebato).toBe(true);
    expect(res.updatedInvestigator.arrebatoRounds).toBe(2);

    const mods = getArrebatoModifiers(res.updatedInvestigator);
    expect(mods.active).toBe(true);
    expect(mods.offensiveBonusDice).toBe(1);
    expect(mods.defensiveBonusDice).toBe(-1);
    expect(mods.forbidPmBurnInResistance).toBe(true);

    const tick1 = tickArrebatoRound(res.updatedInvestigator);
    expect(tick1.ended).toBe(false);
    expect(tick1.updatedInvestigator.arrebatoRounds).toBe(1);

    // Tick 2 ends Arrebato and triggers Colgajo de Lucidez (COR roll fails: 99 > COR)
    vi.spyOn(Math, 'random').mockReturnValue(0.95);
    const tick2 = tickArrebatoRound(tick1.updatedInvestigator);
    expect(tick2.ended).toBe(true);
    expect(tick2.corLost).toBe(1);
    expect(tick2.updatedInvestigator.cor).toBe(elena.cor - 1);
    expect(tick2.updatedInvestigator.activeArrebato).toBeNull();
  });

  it('respeta la escalada de Golpe Brutal (10+ INH) y no repite umbrales ya cruzados', () => {
    const elena = cloneElena();
    elena.initialInh = 60;
    elena.inh = 60;
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    // Pierde 16 INH (queda en 44 <= 45 = 75%): golpe brutal escala Tabla B -> Tabla C
    const hit1 = applyInhibitionLoss(elena, 16, 'Impacto brutal');
    expect(hit1.newThresholdFilias[0]?.table).toBe('C');
    expect(hit1.updatedInvestigator.thresholdsCrossed.t75).toBe(true);

    // Recupera 2 INH y vuelve a cruzar 45: t75 no se repite
    const recovered = { ...hit1.updatedInvestigator, inh: 46 };
    const hit2 = applyInhibitionLoss(recovered, 2, 'Segundo roce');
    expect(hit2.newThresholdFilias.length).toBe(0);
  });
});

describe('brpEngine · Sección 5 (Clímax, CON permanente, Cascarón POD<=20 y PM acumulados)', () => {
  it('cobra 1d6/2d6 INH, PM quemados acumulados solo en derrota y tirada de Despertar', () => {
    const elena = cloneElena();
    const ninfa = BESTIARY_ENTITIES.find((e) => e.id === 'ninfa-zarza')!;
    // All rolls deterministic at ~0.5 (1d6=4, 2d6=8, awakening fail -> 1d2=2)
    vi.spyOn(Math, 'random').mockReturnValue(0.8); // 1d6=5, 2d6=10, roll ~88 > COR
    const res = applyClimaxDefeat(elena, ninfa, {
      wasExtremeOrRitual: true,
      pendingBurnedPm: 3,
      acceptDrenaje: true,
      acceptArrebato: true,
    });
    expect(res.baseInhLoss).toBe(10); // 2d6 with 0.8 => 5+5
    expect(res.burnedPmPaid).toBe(3);
    expect(res.totalInhLoss).toBe(13);
    expect(res.updatedInvestigator.inh).toBe(elena.inh - 13);
    expect(res.corLost).toBeGreaterThan(0);
    expect(res.updatedInvestigator.attributes.CON).toBe(elena.attributes.CON - 1);
  });

  it('drena CON permanente en climaxType CON y marca muerte si CON llega a 0', () => {
    const elena = cloneElena();
    elena.attributes.CON = 2;
    const vastago = BESTIARY_ENTITIES.find((e) => e.id === 'vastago-fosa')!;
    vi.spyOn(Math, 'random').mockReturnValue(0.8); // 1d3 -> 3 -> CON = 0
    const res = applyClimaxDefeat(elena, vastago, { pendingBurnedPm: 0 });
    expect(res.isDead).toBe(true);
    expect(res.updatedInvestigator.attributes.CON).toBe(0);
    expect(res.updatedInvestigator.pv).toBe(0);
  });

  it('drena POD permanente y activa estado Cascarón cuando POD <= 20', () => {
    const elena = cloneElena();
    elena.attributes.POD = 22;
    const confidente = BESTIARY_ENTITIES.find((e) => e.id === 'falso-confidente')!;
    vi.spyOn(Math, 'random').mockReturnValue(0.75); // 1d4 -> 4 -> POD = 18 <= 20
    const res = applyClimaxDefeat(elena, confidente, { pendingBurnedPm: 0 });
    expect(res.isCascaron).toBe(true);
    expect(res.updatedInvestigator.attributes.POD).toBe(18);
    expect(res.updatedInvestigator.isCascaron).toBe(true);
  });
});

describe('brpEngine · Sección 7 (Recuperación) y Seguridad (Límites Duros)', () => {
  it('aplica Velo y distancia, Trauma purgativo y Refugio del Cuerpo', () => {
    const elena = cloneElena();
    elena.inh = 40;
    elena.cor = Math.max(10, elena.maxCor - 5);
    elena.ac = 8;

    const velo = applyRecoveryMethod(elena, 'VELO_DISTANCIA');
    expect(velo.inhGain).toBe(1);
    expect(velo.corDelta).toBe(1);

    vi.spyOn(Math, 'random').mockReturnValue(0.5); // 1d3 = 2
    const trauma = applyRecoveryMethod(elena, 'TRAUMA_PURGATIVO');
    expect(trauma.inhGain).toBe(2);
    expect(trauma.corDelta).toBe(-1);

    const refugio = applyRecoveryMethod(elena, 'REFUGIO_ESCENA', elena.lazos[0].id);
    expect(refugio.corDelta).toBe(2);
    expect(refugio.acGain).toBe(2);
    expect(refugio.inhGain).toBe(1);
    expect(refugio.updatedInvestigator.lazos[0].refugeUsedThisSession).toBe(true);
  });

  it('filtra contenido que viole el veto universal o límites duros pactados', () => {
    const minorCheck = filterByHardLimits('Un menor entra en la sala.', []);
    expect(minorCheck.safe).toBe(false);

    const coercionCheck = filterByHardLimits(
      'Actúa forzado sin consentimiento.',
      ['Coacción sexual no consentida']
    );
    expect(coercionCheck.safe).toBe(false);

    const safeCheck = filterByHardLimits('El farol ilumina el cristal húmedo.', [
      'Coacción sexual no consentida',
    ]);
    expect(safeCheck.safe).toBe(true);
  });
});
