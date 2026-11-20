export type GameState =
  | 'TITLE_MENU'
  | 'SESSION_ZERO'
  | 'PLAYING'
  | 'COMBAT_INTIMO'
  | 'COMPENDIUM'
  | 'GAME_OVER';

export type NarrativeLevel = 0 | 1; // 0 = Velo estricto (elipsis), 1 = Sensual (literario)

export type SuccessDegree =
  | 'CRITICO'
  | 'EXTREMO'
  | 'ARDUO'
  | 'NORMAL'
  | 'FALLO'
  | 'PIFIA';

export type DifficultyLevel = 'NORMAL' | 'ARDUO' | 'EXTREMO';

export interface DiceRollResult {
  id: string;
  label: string;
  rawRoll: number; // 1-100
  tensDie: number; // 00, 10, ..., 90
  unitsDie: number; // 0..9
  target: number;
  effectiveTarget: number;
  difficulty: DifficultyLevel;
  degree: SuccessDegree;
  isSuccess: boolean;
  bonusPenaltyNote?: string;
  allRolls?: number[];
  timestamp: number;
}

export interface ConsentDocument {
  baseLevel: NarrativeLevel;
  acceptEncantos: boolean;
  acceptArrebato: boolean;
  acceptDrenaje: boolean;
  acceptMarcado: boolean;
  acceptTentacion: boolean;
  useEndurecimiento: boolean;
  hardLimits: string[];
  amberWord: string;
  xCardWord: string;
  aftercarePreference: string;
}

export interface GrietaPersonal {
  herida: string;
  mentira: string;
  tentacion: string;
  senal: string;
  discoveredBy?: string;
  usedThisScene?: boolean;
}

export interface FiliaEntry {
  id: string;
  table: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  name: string;
  trigger: string;
  mechanicalEffect: string;
  curable: boolean;
  temporary?: boolean;
}

export interface MutationEntry {
  id: string;
  name: string;
  benefit: string;
  signalAndCost: string;
  lineage: 'acuatico' | 'vegetal' | 'onirico' | 'general';
  twisted?: string;
}

export interface LazoIntimo {
  id: string;
  name: string;
  relation: string;
  spent: boolean;
  refugeUsedThisSession: boolean;
  isEntityBond?: boolean;
}

export interface DiarioEntry {
  id: string;
  scene: string;
  trigger: string;
  image: string;
  text: string;
  sharedPhrase: string;
  bonusClaimed: 'AC' | 'SKILL' | 'NONE';
}

export interface EndurecimientoAxes {
  sumision: number; // 0-5
  alteracion: number; // 0-5
  profanacion: number; // 0-5
  fracasos: number;
}

export interface Investigator {
  id: string;
  name: string;
  archetype: string;
  age: number;
  tagline: string;
  portraitKey:
    | 'elena'
    | 'lara'
    | 'eduard'
    | 'leonor'
    | 'marisa'
    | 'sofia'
    | 'flor'
    | 'marina';
  bio: string;
  attributes: {
    FUE: number;
    CON: number;
    TAM: number;
    DES: number;
    APA: number;
    INT: number;
    POD: number;
    EDU: number;
  };
  pv: number;
  maxPv: number;
  pm: number;
  maxPm: number;
  cor: number;
  maxCor: number;
  inh: number;
  initialInh: number;
  ac: number;
  maxAc: number;
  skills: {
    seduccion: number;
    tecnica: number;
    resistenciaCarnal: number;
    ataduras: number;
    psicologia: number;
    ocultismo: number;
    persuasion: number;
    pelea: number;
    esquivar: number;
    buscar: number;
  };
  grieta: GrietaPersonal;
  filias: FiliaEntry[];
  mutaciones: MutationEntry[];
  lazos: LazoIntimo[];
  marcas: string[];
  deudas: string[];
  reliquias: string[];
  hechizos: string[];
  hooks: string[];
  quotes: string[];
  thresholdsCrossed: {
    t75: boolean;
    t50: boolean;
    t25: boolean;
    t10Warned: boolean;
    t0: boolean;
  };
  firstInhRollDone: boolean;
  accumulatedCombatPenalty: number; // -10% per Arduo hit in Intimate Combat
  arrebatoRounds: number;
  activeArrebato?: FiliaEntry | null;
  diarioBonusUsed: boolean;
  diarioPendingSkillBonus?: boolean;
  diarioEntries: DiarioEntry[];
  endurecimiento: EndurecimientoAxes;
  inhAnomalyFixed?: boolean; // For special cases or custom rules
  isDead?: boolean;
  isCascaron?: boolean;
  armor?: number;
}

export interface CombatSessionSnapshot {
  entity: BestiaryEntity;
  round: number;
  entityPenalty: number;
  ironUsed: boolean;
  pendingBurnedPm: number;
  returnNodeId: string | null;
}

export interface BestiaryEntity {
  id: string;
  name: string;
  subtitle: string;
  artworkKey:
    | 'ninfa'
    | 'confidente'
    | 'vastago'
    | 'coro'
    | 'senora'
    | 'sacerdote'
    | 'doblada'
    | 'cabra';
  description: string;
  intimateAnatomy: string;
  attributes: {
    FUE: number;
    CON: number;
    TAM: number;
    DES: number;
    APA: number;
    POD: number;
    INT: number;
  };
  pv: number;
  maxPv: number;
  pm: number;
  maxPm: number;
  ac: number;
  maxAc: number;
  armor: number;
  skills: {
    tecnica: number;
    ataduras: number;
    provocar: number;
    resistenciaCarnal: number;
    psicologia: number;
    esquivar: number;
  };
  dualLossText: string;
  climaxEffectName: string;
  climaxEffectDesc: string;
  climaxType: 'PM' | 'CON' | 'SIEMBRA' | 'POD' | 'FUSION';
  weaknessName: string;
  weaknessDesc: string;
  weaknessSkill: keyof Investigator['skills'];
  signatureMoves: RepertorioMoveId[];
}

export type RepertorioMoveId =
  | 'beso'
  | 'desnudez'
  | 'caricias'
  | 'entrega'
  | 'union'
  | 'cambio_ritmo'
  | 'elogio_sucio'
  | 'voyeurismo'
  | 'ataduras_vivas';

export interface RepertorioMove {
  id: RepertorioMoveId;
  name: string;
  minLevel: NarrativeLevel;
  attackerMod: number;
  defenderMod: number;
  acMultiplier: number;
  stealsPmOnWin?: boolean;
  extraInhIfFilia?: boolean;
  resetsPenalty?: boolean;
  summary: string;
  veloText: string;
  sensualText: string;
}

export interface ChronicleLog {
  id: string;
  type: 'NARRATIVE' | 'ROLL' | 'CORRUPTION' | 'SAFETY' | 'COMBAT' | 'THRESHOLD';
  title: string;
  detail: string;
  timestamp: string;
}

export interface SceneChoice {
  id: string;
  label: string;
  sublabel?: string;
  skillCheck?: {
    skill: keyof Investigator['skills'] | 'CON' | 'POD' | 'INT' | 'COR' | 'INH';
    difficulty: DifficultyLevel;
    label: string;
    onSuccess: SceneOutcome;
    onFail: SceneOutcome;
  };
  directOutcome?: SceneOutcome;
  requiresFlag?: string;
  costsPm?: number;
}

export interface SceneOutcome {
  narrativeVelo: string;
  narrativeSensual: string;
  corLoss?: string; // dice notation or number e.g. "1d4" or "1"
  inhLoss?: string;
  acDelta?: number;
  pvDelta?: number;
  pmDelta?: number;
  addMarca?: string;
  addDeuda?: string;
  addRelic?: string;
  addSpell?: string;
  addFlag?: string;
  triggerCombatEntityId?: string;
  nextSceneId: string;
}

export interface StoryNode {
  id: string;
  arcId: string;
  actLabel: string;
  title: string;
  location: string;
  entityArtwork?: BestiaryEntity['artworkKey'];
  ambientTag: 'zarza' | 'mar' | 'mascara' | 'rebano' | 'cripta' | 'teatro';
  textVelo: string[];
  textSensual: string[];
  guardianWhisper?: string;
  choices: SceneChoice[];
  isEnding?: boolean;
  endingSummary?: string;
}

export interface StoryArc {
  id: string;
  title: string;
  subtitle: string;
  sourceSection: string;
  recommendedLevel: string;
  synopsis: string;
  startNodeId: string;
  artworkKey: BestiaryEntity['artworkKey'];
}
