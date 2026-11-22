import type { NarrativeLevel, SceneOutcome, StoryNode } from '../types/game';

export const NARRATIVE_LEVEL_LABELS: Record<NarrativeLevel, string> = {
  0: 'Nivel 0 (Velo estricto)',
  1: 'Nivel 1 (Sensual literario)',
  2: 'Nivel 2 (Directo)',
};

export const NARRATIVE_LEVEL_SHORT: Record<NarrativeLevel, string> = {
  0: 'Velo estricto',
  1: 'Sensual',
  2: 'Directo',
};

/**
 * Elige el texto de un nodo según el nivel activo.
 * Cadena de respaldo: 2 → 1 → 0. Una versión directa nunca se muestra
 * por debajo del Nivel 2, aunque falte la versión del nivel inferior.
 */
export function pickNodeText(
  node: Pick<StoryNode, 'textVelo' | 'textSensual' | 'textDirecto'>,
  level: NarrativeLevel,
): string[] {
  if (level === 0) return node.textVelo;
  if (level === 1) return node.textSensual;
  return node.textDirecto ?? node.textSensual;
}

export function pickOutcomeText(
  outcome: Pick<SceneOutcome, 'narrativeVelo' | 'narrativeSensual' | 'narrativeDirecto'>,
  level: NarrativeLevel,
): string {
  if (level === 0) return outcome.narrativeVelo;
  if (level === 1) return outcome.narrativeSensual;
  return outcome.narrativeDirecto ?? outcome.narrativeSensual;
}

/** Una escena es íntima si tiene alguna versión directa, en el texto o en un resultado. */
export function isIntimateNode(node: StoryNode): boolean {
  if (node.textDirecto && node.textDirecto.length > 0) return true;
  return node.choices.some((c) => {
    const outcomes = [c.directOutcome, c.skillCheck?.onSuccess, c.skillCheck?.onFail];
    return outcomes.some((o) => Boolean(o?.narrativeDirecto));
  });
}
