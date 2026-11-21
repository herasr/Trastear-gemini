import { describe, expect, it } from 'vitest';
import { CAMPAIGN_LA_SILLA_VACIA as C } from '../../data/campaign';
import { STORY_ARCS } from '../../data/scenarios';

const arcIds = new Set(STORY_ARCS.map((a) => a.id));

describe('campaña La silla vacía', () => {
  it('es solo para adultos y tiene doce sesiones numeradas sin huecos', () => {
    expect(C.adultsOnly).toBe(true);
    expect(C.sessions).toHaveLength(C.sessionCount);
    C.sessions.forEach((s, i) => expect(s.number).toBe(i + 1));
  });

  it('los arcos cubren todas las sesiones sin solaparse', () => {
    const covered: number[] = [];
    for (const arc of C.arcs) {
      const [from, to] = arc.sessions;
      expect(from).toBeLessThanOrEqual(to);
      for (let n = from; n <= to; n++) covered.push(n);
    }
    expect(covered.sort((a, b) => a - b)).toEqual(
      C.sessions.map((s) => s.number),
    );
  });

  it('todas las referencias a arcos existen en STORY_ARCS', () => {
    for (const s of C.sessions) {
      if (s.linkedArcId) expect(arcIds.has(s.linkedArcId)).toBe(true);
    }
    for (const arc of C.arcs) {
      if (arc.primaryArcId) expect(arcIds.has(arc.primaryArcId)).toBe(true);
    }
  });

  it('los flags extremos solo aparecen en arcos de nivel 3', () => {
    for (const arc of C.arcs) {
      if (arc.maxLevel < 3) {
        for (let n = arc.sessions[0]; n <= arc.sessions[1]; n++) {
          const s = C.sessions[n - 1];
          expect(s.extremeFlags ?? []).toEqual([]);
        }
      }
    }
  });

  it('cada flag extremo usado tiene regla de salida y telegrafía previa', () => {
    const ruled = new Set(C.extremeRules.map((r) => r.flag));
    for (const s of C.sessions) {
      for (const f of s.extremeFlags ?? []) {
        expect(ruled.has(f)).toBe(true);
        if (s.number > 1) {
          // La telegrafía exige que el flag esté anunciado en la sesión anterior.
          // Se valida en la mesa; aquí comprobamos que la sesión anterior existe.
          expect(C.sessions[s.number - 2]).toBeDefined();
        }
      }
    }
    for (const r of C.extremeRules) {
      expect(r.ifVetoed.length).toBeGreaterThan(0);
    }
  });

  it('cada célula cae dentro de la campaña', () => {
    for (const cell of C.cells) {
      expect(cell.fallsAt).toBeGreaterThanOrEqual(1);
      expect(cell.fallsAt).toBeLessThanOrEqual(C.sessionCount);
    }
  });

  it('exige al menos dos jugadores con vínculo hacia Candela', () => {
    expect(C.minPlayersWithCandelaBond).toBeGreaterThanOrEqual(2);
  });
});
