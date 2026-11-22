import { describe, expect, it } from 'vitest';
import { STORY_NODES } from '../../data/scenarios';
import { heartbeatSeconds, resolveAmbienceMode, revealStagger } from '../ambience';
import { isIntimateNode } from '../narrativeText';
import type { StoryNode } from '../../types/game';

const base = { level: 1 as const, intimate: true, enabled: true, xCardOpen: false, reducedMotion: false };

describe('animaciones', () => {
  it('se apagan con la Tarjeta X, el interruptor o «reducir movimiento»', () => {
    expect(resolveAmbienceMode({ ...base, xCardOpen: true })).toBe('off');
    expect(resolveAmbienceMode({ ...base, enabled: false })).toBe('off');
    expect(resolveAmbienceMode({ ...base, reducedMotion: true })).toBe('off');
  });

  it('el modo depende de si la escena es íntima y del nivel', () => {
    expect(resolveAmbienceMode({ ...base, intimate: false })).toBe('calm');
    expect(resolveAmbienceMode({ ...base, level: 0 })).toBe('veiled');
    expect(resolveAmbienceMode({ ...base, level: 1 })).toBe('intimate');
    expect(resolveAmbienceMode({ ...base, level: 2 })).toBe('intimate');
  });

  it('el nivel 0 nunca recibe el latido de las escenas íntimas', () => {
    for (const intimate of [true, false]) {
      expect(resolveAmbienceMode({ ...base, level: 0, intimate })).not.toBe('intimate');
    }
  });

  it('el pulso se acelera con el desgaste y se mantiene en rango', () => {
    expect(heartbeatSeconds(0)).toBeGreaterThan(heartbeatSeconds(1));
    expect(heartbeatSeconds(-5)).toBe(heartbeatSeconds(0));
    expect(heartbeatSeconds(9)).toBe(heartbeatSeconds(1));
    expect(heartbeatSeconds(Number.NaN)).toBe(heartbeatSeconds(0));
    expect(heartbeatSeconds(1)).toBeGreaterThan(0.5);
  });

  it('los párrafos aparecen más despacio en escenas íntimas', () => {
    expect(revealStagger('off')).toBe(0);
    expect(revealStagger('calm')).toBeLessThan(revealStagger('veiled'));
    expect(revealStagger('veiled')).toBeLessThan(revealStagger('intimate'));
  });

  it('las escenas íntimas del juego se detectan y las demás no', () => {
    const nodes = Object.values(STORY_NODES) as StoryNode[];
    const intimate = nodes.filter(isIntimateNode).map((n) => n.id);
    for (const id of ['u_cthulhu', 'u_nyar', 'u_shub', 'u_dagon', 'u_yog', 'u_hastur', 'doble_acto2_prueba2', 'zarza_acto3_vigilia']) {
      expect(intimate).toContain(id);
    }
    expect(isIntimateNode(STORY_NODES.zarza_intro)).toBe(false);
    expect(isIntimateNode(STORY_NODES.umbrales_hub)).toBe(false);
  });
});
