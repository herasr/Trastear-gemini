import { describe, expect, it } from 'vitest';
import { STORY_ARCS, STORY_NODES } from '../../data/scenarios';
import { BESTIARY_ENTITIES } from '../../data/bestiary';
import type { SceneOutcome, StoryNode } from '../../types/game';

const nodes = Object.values(STORY_NODES) as StoryNode[];
const entityIds = new Set(BESTIARY_ENTITIES.map((e) => e.id));
const SKILLS = new Set([
  'seduccion', 'tecnica', 'resistenciaCarnal', 'ataduras', 'psicologia',
  'ocultismo', 'persuasion', 'pelea', 'esquivar', 'buscar',
  'CON', 'POD', 'INT', 'COR', 'INH',
]);
const DICE = /^(\d+)(d\d+([+-]\d+)?)?$/i;

function outcomesOf(node: StoryNode): SceneOutcome[] {
  const out: SceneOutcome[] = [];
  for (const c of node.choices) {
    if (c.directOutcome) out.push(c.directOutcome);
    if (c.skillCheck) out.push(c.skillCheck.onSuccess, c.skillCheck.onFail);
  }
  return out;
}

describe('grafo narrativo', () => {
  it('cada nodo apunta a un arco que existe y su clave coincide con su id', () => {
    const arcIds = new Set(STORY_ARCS.map((a) => a.id));
    for (const [key, node] of Object.entries(STORY_NODES)) {
      expect(node.id).toBe(key);
      expect(arcIds.has(node.arcId)).toBe(true);
    }
  });

  it('todas las transiciones llevan a un nodo existente', () => {
    const broken: string[] = [];
    for (const node of nodes) {
      for (const o of outcomesOf(node)) {
        if (!STORY_NODES[o.nextSceneId]) broken.push(`${node.id} → ${o.nextSceneId}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it('los nodos finales no tienen opciones y los demás sí', () => {
    for (const node of nodes) {
      if (node.isEnding) {
        expect(node.choices, node.id).toHaveLength(0);
        expect(node.endingSummary, node.id).toBeTruthy();
      } else {
        expect(node.choices.length, node.id).toBeGreaterThan(0);
      }
    }
  });

  it('todo nodo es alcanzable desde el inicio de su arco', () => {
    const unreachable: string[] = [];
    for (const arc of STORY_ARCS) {
      const start = arc.startNodeId;
      const seen = new Set<string>();
      const queue = [start];
      while (queue.length) {
        const id = queue.pop()!;
        if (seen.has(id) || !STORY_NODES[id]) continue;
        seen.add(id);
        for (const o of outcomesOf(STORY_NODES[id])) queue.push(o.nextSceneId);
      }
      for (const n of nodes.filter((x) => x.arcId === arc.id)) {
        if (!seen.has(n.id)) unreachable.push(n.id);
      }
    }
    expect(unreachable).toEqual([]);
  });

  it('los combates y las tiradas referencian entidades y habilidades reales', () => {
    for (const node of nodes) {
      for (const c of node.choices) {
        if (c.skillCheck) {
          expect(SKILLS.has(c.skillCheck.skill), `${node.id}: ${c.skillCheck.skill}`).toBe(true);
        }
      }
      for (const o of outcomesOf(node)) {
        if (o.triggerCombatEntityId) {
          expect(entityIds.has(o.triggerCombatEntityId), `${node.id}: ${o.triggerCombatEntityId}`).toBe(true);
        }
      }
    }
  });

  it('toda notación de dados es válida (el motor convierte las erróneas en 0)', () => {
    const bad: string[] = [];
    for (const node of nodes) {
      for (const o of outcomesOf(node)) {
        for (const v of [o.inhLoss, o.corLoss]) {
          if (v !== undefined && !DICE.test(String(v))) bad.push(`${node.id}: ${v}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });
});
