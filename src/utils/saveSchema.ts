import { z } from 'zod';
import {
  ChronicleLog,
  CombatSessionSnapshot,
  ConsentDocument,
  Investigator,
  NarrativeLevel,
} from '../types/game';

export const UNIVERSAL_MINOR_VETO = 'Implicación de menores';

export function ensureUniversalMinorVeto(limits: string[]): string[] {
  return limits.includes(UNIVERSAL_MINOR_VETO)
    ? limits
    : [...limits, UNIVERSAL_MINOR_VETO];
}

const ConsentSchema = z.object({
  baseLevel: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  acceptEncantos: z.boolean().default(true),
  acceptArrebato: z.boolean().default(true),
  acceptDrenaje: z.boolean().default(true),
  acceptMarcado: z.boolean().default(true),
  acceptTentacion: z.boolean().default(true),
  useEndurecimiento: z.boolean().default(false),
  hardLimits: z.array(z.string()).default([UNIVERSAL_MINOR_VETO]),
  amberWord: z.string().min(1).default('Ámbar'),
  xCardWord: z.string().min(1).default('Tarjeta X'),
  aftercarePreference: z
    .string()
    .default('Resumen breve en calma al concluir la escena.'),
});

const ChronicleLogSchema = z.object({
  id: z.string(),
  type: z.enum(['NARRATIVE', 'ROLL', 'CORRUPTION', 'SAFETY', 'COMBAT', 'THRESHOLD']),
  title: z.string(),
  detail: z.string(),
  timestamp: z.string(),
});

const InvestigatorSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    archetype: z.string(),
    age: z.number(),
    tagline: z.string(),
    portraitKey: z.string(),
    bio: z.string(),
    attributes: z.object({
      FUE: z.number(),
      CON: z.number(),
      TAM: z.number(),
      DES: z.number(),
      APA: z.number(),
      INT: z.number(),
      POD: z.number(),
      EDU: z.number(),
    }),
    pv: z.number(),
    maxPv: z.number(),
    pm: z.number(),
    maxPm: z.number(),
    cor: z.number(),
    maxCor: z.number(),
    inh: z.number(),
    initialInh: z.number(),
    ac: z.number(),
    maxAc: z.number(),
    skills: z.record(z.string(), z.number()),
    grieta: z.object({
      herida: z.string(),
      mentira: z.string(),
      tentacion: z.string(),
      senal: z.string(),
      discoveredBy: z.string().optional(),
      usedThisScene: z.boolean().optional(),
    }),
    filias: z.array(z.any()),
    mutaciones: z.array(z.any()),
    lazos: z.array(z.any()),
    marcas: z.array(z.string()),
    deudas: z.array(z.string()),
    reliquias: z.array(z.string()),
    hechizos: z.array(z.string()),
    hooks: z.array(z.string()),
    quotes: z.array(z.string()),
    thresholdsCrossed: z.object({
      t75: z.boolean(),
      t50: z.boolean(),
      t25: z.boolean(),
      t10Warned: z.boolean(),
      t0: z.boolean(),
    }),
    firstInhRollDone: z.boolean(),
    accumulatedCombatPenalty: z.number(),
    arrebatoRounds: z.number(),
    activeArrebato: z.any().nullable().optional(),
    diarioBonusUsed: z.boolean(),
    diarioPendingSkillBonus: z.boolean().optional(),
    diarioEntries: z.array(z.any()),
    endurecimiento: z.object({
      sumision: z.number(),
      alteracion: z.number(),
      profanacion: z.number(),
      fracasos: z.number(),
    }),
    inhAnomalyFixed: z.boolean().optional(),
    isDead: z.boolean().optional(),
    isCascaron: z.boolean().optional(),
    armor: z.number().optional(),
  })
  .passthrough();

const CombatSnapshotSchema = z.object({
  entity: z.any(),
  round: z.number().int().min(1),
  entityPenalty: z.number().min(0),
  ironUsed: z.boolean(),
  pendingBurnedPm: z.number().int().min(0),
  returnNodeId: z.string().nullable(),
});

export const SavedSessionSchema = z.object({
  version: z.number().int().default(2),
  savedAt: z.string().optional(),
  investigator: InvestigatorSchema,
  consent: ConsentSchema,
  narrativeLevel: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  currentArcId: z.string(),
  currentNodeId: z.string(),
  sceneHistory: z.array(z.string()).default([]),
  flags: z.array(z.string()).default([]),
  chronicle: z.array(ChronicleLogSchema).default([]),
  activeCombat: CombatSnapshotSchema.nullable().optional(),
});

export interface ValidatedSavedSession {
  version: number;
  savedAt?: string;
  investigator: Investigator;
  consent: ConsentDocument;
  narrativeLevel: NarrativeLevel;
  currentArcId: string;
  currentNodeId: string;
  sceneHistory: string[];
  flags: string[];
  chronicle: ChronicleLog[];
  activeCombat?: CombatSessionSnapshot | null;
}

export function parseSavedSession(raw: string): ValidatedSavedSession | null {
  try {
    const parsedJson = JSON.parse(raw);
    const result = SavedSessionSchema.safeParse(parsedJson);
    if (!result.success) {
      return null;
    }
    const data = result.data;
    return {
      version: data.version,
      savedAt: data.savedAt,
      investigator: data.investigator as unknown as Investigator,
      consent: {
        ...data.consent,
        hardLimits: ensureUniversalMinorVeto(data.consent.hardLimits),
      },
      narrativeLevel: data.narrativeLevel,
      currentArcId: data.currentArcId,
      currentNodeId: data.currentNodeId,
      sceneHistory: data.sceneHistory,
      flags: data.flags,
      chronicle: data.chronicle,
      activeCombat: (data.activeCombat as CombatSessionSnapshot | null | undefined) ?? null,
    };
  } catch {
    return null;
  }
}

export function serializeSavedSession(session: ValidatedSavedSession): string {
  const payload: ValidatedSavedSession = {
    ...session,
    version: 2,
    savedAt: new Date().toISOString(),
    consent: {
      ...session.consent,
      hardLimits: ensureUniversalMinorVeto(session.consent.hardLimits),
    },
    chronicle: session.chronicle.slice(0, 40),
  };
  return JSON.stringify(payload, null, 2);
}
