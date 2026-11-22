import { describe, expect, it } from 'vitest';
import { STORY_NODES } from '../../data/scenarios';
import { pickNodeText, pickOutcomeText } from '../narrativeText';
import { filterByHardLimits } from '../brpEngine';
import type { SceneOutcome, StoryNode } from '../../types/game';

const nodes = Object.values(STORY_NODES) as StoryNode[];

function outcomesOf(node: StoryNode): SceneOutcome[] {
  const out: SceneOutcome[] = [];
  for (const c of node.choices) {
    if (c.directOutcome) out.push(c.directOutcome);
    if (c.skillCheck) {
      out.push(c.skillCheck.onSuccess, c.skillCheck.onFail);
    }
  }
  return out;
}

// Léxico explícito que solo puede aparecer en el Nivel 2.
const EXPLICIT = /\b(te corres|correrte|orgasm\w*|penetr\w*|entra en ti|pez[oó]n(?:es)?|embestid\w*)\b/i;

describe('niveles narrativos', () => {
  it('el Nivel 2 recurre al Nivel 1 cuando no hay versión directa', () => {
    const n = { textVelo: ['v'], textSensual: ['s'] };
    expect(pickNodeText(n, 2)).toEqual(['s']);
    const o = { narrativeVelo: 'v', narrativeSensual: 's' };
    expect(pickOutcomeText(o, 2)).toBe('s');
  });

  it('la versión directa solo se devuelve en el Nivel 2', () => {
    const n = { textVelo: ['v'], textSensual: ['s'], textDirecto: ['d'] };
    expect(pickNodeText(n, 0)).toEqual(['v']);
    expect(pickNodeText(n, 1)).toEqual(['s']);
    expect(pickNodeText(n, 2)).toEqual(['d']);
    const o = { narrativeVelo: 'v', narrativeSensual: 's', narrativeDirecto: 'd' };
    expect(pickOutcomeText(o, 0)).toBe('v');
    expect(pickOutcomeText(o, 1)).toBe('s');
    expect(pickOutcomeText(o, 2)).toBe('d');
  });

  it('ningún texto de Nivel 0 o 1 contiene léxico explícito', () => {
    const offenders: string[] = [];
    for (const node of nodes) {
      for (const t of [...node.textVelo, ...node.textSensual]) {
        if (EXPLICIT.test(t)) offenders.push(`${node.id}: ${t.slice(0, 60)}`);
      }
      for (const o of outcomesOf(node)) {
        for (const t of [o.narrativeVelo, o.narrativeSensual]) {
          if (EXPLICIT.test(t)) offenders.push(`${node.id}: ${t.slice(0, 60)}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('todo nodo con versión directa conserva sus versiones de Nivel 0 y 1', () => {
    for (const node of nodes) {
      if (node.textDirecto) {
        expect(node.textVelo.length).toBeGreaterThan(0);
        expect(node.textSensual.length).toBeGreaterThan(0);
        expect(node.textDirecto).not.toEqual(node.textSensual);
      }
    }
  });

  it('ningún texto narrado menciona reglas de juego', () => {
    const MECHANIC = /\b(AC|PV|PM|INH|COR|POD|Inhibición|Cordura|Aguante Carnal|Resistencia Carnal|tirada|d100|\d+d\d)\b/;
    const offenders: string[] = [];
    for (const node of nodes) {
      const texts = [
        ...node.textVelo,
        ...node.textSensual,
        ...(node.textDirecto ?? []),
      ];
      for (const o of outcomesOf(node)) {
        texts.push(o.narrativeVelo, o.narrativeSensual);
        if (o.narrativeDirecto) texts.push(o.narrativeDirecto);
      }
      for (const t of texts) {
        if (MECHANIC.test(t)) offenders.push(`${node.id}: ${t.slice(0, 70)}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('ningún texto narrado activa el filtro de seguridad por falso positivo', () => {
    const limits = ['Coacción', 'Gore', 'Agencia'];
    const velados: string[] = [];
    for (const node of nodes) {
      const texts = [...node.textVelo, ...node.textSensual, ...(node.textDirecto ?? [])];
      for (const o of outcomesOf(node)) {
        texts.push(o.narrativeVelo, o.narrativeSensual);
        if (o.narrativeDirecto) texts.push(o.narrativeDirecto);
      }
      for (const t of texts) {
        if (!filterByHardLimits(t, limits).safe) velados.push(`${node.id}: ${t.slice(0, 50)}`);
      }
    }
    expect(velados).toEqual([]);
  });
});
