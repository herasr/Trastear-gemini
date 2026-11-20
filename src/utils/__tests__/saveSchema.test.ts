import { describe, expect, it } from 'vitest';
import { INVESTIGATORS } from '../../data/investigators';
import { BESTIARY_ENTITIES } from '../../data/bestiary';
import {
  parseSavedSession,
  serializeSavedSession,
  UNIVERSAL_MINOR_VETO,
} from '../saveSchema';

describe('saveSchema Zod validation & round-trip', () => {
  it('serializes and parses a valid v2 session with combat snapshot and enforces minor veto', () => {
    const raw = serializeSavedSession({
      version: 2,
      investigator: JSON.parse(JSON.stringify(INVESTIGATORS[0])),
      consent: {
        baseLevel: 0,
        acceptEncantos: true,
        acceptArrebato: true,
        acceptDrenaje: true,
        acceptMarcado: true,
        acceptTentacion: true,
        useEndurecimiento: false,
        hardLimits: ['Gore extremo'],
        amberWord: 'Ámbar',
        xCardWord: 'Tarjeta X',
        aftercarePreference: 'Resumen breve.',
      },
      narrativeLevel: 0,
      currentArcId: 'vigilia-zarza',
      currentNodeId: 'zarza_invernadero',
      sceneHistory: ['zarza_intro'],
      flags: ['flag_1'],
      chronicle: [
        {
          id: 'c1',
          type: 'SAFETY',
          title: 'Sesión Cero',
          detail: 'Sellada',
          timestamp: '20:00',
        },
      ],
      activeCombat: {
        entity: JSON.parse(JSON.stringify(BESTIARY_ENTITIES[0])),
        round: 3,
        entityPenalty: 10,
        ironUsed: false,
        pendingBurnedPm: 2,
        returnNodeId: 'zarza_invernadero',
      },
    });

    const parsed = parseSavedSession(raw);
    expect(parsed).not.toBeNull();
    expect(parsed?.version).toBe(2);
    expect(parsed?.consent.hardLimits).toContain(UNIVERSAL_MINOR_VETO);
    expect(parsed?.activeCombat?.pendingBurnedPm).toBe(2);
    expect(parsed?.sceneHistory).toEqual(['zarza_intro']);
  });

  it('rejects malformed or corrupted JSON safely returning null', () => {
    expect(parseSavedSession('{bad json')).toBeNull();
    expect(parseSavedSession(JSON.stringify({ investigator: {} }))).toBeNull();
  });
});
