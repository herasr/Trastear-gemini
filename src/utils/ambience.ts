import type { NarrativeLevel, StoryNode } from '../types/game';

export type AmbientTag = NonNullable<StoryNode['ambientTag']>;

/**
 * off      — sin animación (Tarjeta X, interruptor apagado o «reducir movimiento»).
 * calm     — ambiente suave en escenas no íntimas.
 * veiled   — escena íntima en Nivel 0: un velo de gasa que oculta, sin latido.
 * intimate — escena íntima en Nivel 1 o 2: latido, respiración y reflejos.
 */
export type AmbienceMode = 'off' | 'calm' | 'veiled' | 'intimate';

export interface AmbienceInput {
  level: NarrativeLevel;
  intimate: boolean;
  enabled: boolean;
  xCardOpen: boolean;
  reducedMotion: boolean;
}

export function resolveAmbienceMode(i: AmbienceInput): AmbienceMode {
  if (!i.enabled || i.xCardOpen || i.reducedMotion) return 'off';
  if (!i.intimate) return 'calm';
  return i.level === 0 ? 'veiled' : 'intimate';
}

/**
 * Duración de un latido en segundos. El desgaste del personaje (0 = entero,
 * 1 = al límite) acelera el pulso: la mecánica se ve, no se nombra.
 */
export function heartbeatSeconds(corruptionRatio: number): number {
  const r = Math.min(1, Math.max(0, Number.isFinite(corruptionRatio) ? corruptionRatio : 0));
  return Number((1.5 - 0.7 * r).toFixed(2));
}

/** Retraso en segundos entre la aparición de un párrafo y el siguiente. */
export function revealStagger(mode: AmbienceMode): number {
  switch (mode) {
    case 'intimate':
      return 0.9;
    case 'veiled':
      return 0.6;
    case 'calm':
      return 0.35;
    default:
      return 0;
  }
}
