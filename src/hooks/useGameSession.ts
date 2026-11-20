import { useEffect, useState } from 'react';
import {
  BestiaryEntity,
  ChronicleLog,
  CombatSessionSnapshot,
  ConsentDocument,
  DiarioEntry,
  DiceRollResult,
  DifficultyLevel,
  GameState,
  Investigator,
  NarrativeLevel,
  SceneChoice,
  SceneOutcome,
  StoryArc,
} from '../types/game';
import { INVESTIGATORS } from '../data/investigators';
import { BESTIARY_ENTITIES } from '../data/bestiary';
import { STORY_ARCS, STORY_NODES } from '../data/scenarios';
import { GRIMORIO_SPELLS, TABLA_B } from '../data/tables';
import {
  applyInhibitionLoss,
  applyRecoveryMethod,
  filterByHardLimits,
  getArrebatoModifiers,
  pickFromD100Table,
  RecoveryMethod,
  resolveInhibitionCheck,
  rollD100,
  rollDiceNotation,
  rollDie,
} from '../utils/brpEngine';
import {
  ensureUniversalMinorVeto,
  parseSavedSession,
  serializeSavedSession,
  UNIVERSAL_MINOR_VETO,
} from '../utils/saveSchema';
import { soundEngine } from '../utils/soundEngine';

export const STORAGE_KEY = 'pecados_de_la_carne_save_v1';

export const DEFAULT_CONSENT: ConsentDocument = {
  baseLevel: 0,
  acceptEncantos: true,
  acceptArrebato: true,
  acceptDrenaje: true,
  acceptMarcado: true,
  acceptTentacion: true,
  useEndurecimiento: false,
  hardLimits: [
    'Coacción sexual no consentida',
    'Daño gráfico extremo o gore sexual',
    UNIVERSAL_MINOR_VETO,
  ],
  amberWord: 'Ámbar',
  xCardWord: 'Tarjeta X',
  aftercarePreference: 'Resumen breve en calma al concluir la escena.',
};

export type TablaERatificationChoice =
  | 'VELO'
  | 'SERVIDUMBRE'
  | 'RESISTENCIA'
  | 'RETIRADA';

export type XCardAction = 'REWIND' | 'VEIL' | 'SKIP' | 'EXIT';

export interface ThresholdModalState {
  title: string;
  lines: string[];
  reachedZero?: boolean;
}

export interface PendingOutcomeState {
  text: string;
  nextNodeId: string;
  triggerCombatEntityId?: string;
  succeeded?: boolean;
}

export function useGameSession() {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [consent, setConsent] = useState<ConsentDocument>(DEFAULT_CONSENT);
  const [narrativeLevel, setNarrativeLevel] = useState<NarrativeLevel>(0);
  const [investigator, setInvestigator] = useState<Investigator>(() =>
    JSON.parse(JSON.stringify(INVESTIGATORS[0]))
  );
  const [currentArcId, setCurrentArcId] = useState<string>(STORY_ARCS[0].id);
  const [currentNodeId, setCurrentNodeId] = useState<string>(
    STORY_ARCS[0].startNodeId
  );
  const [sceneHistory, setSceneHistory] = useState<string[]>([]);
  const [flags, setFlags] = useState<string[]>([]);
  const [chronicle, setChronicle] = useState<ChronicleLog[]>([]);
  const [lastRoll, setLastRoll] = useState<DiceRollResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [sheetDifficulty, setSheetDifficulty] = useState<DifficultyLevel>('NORMAL');
  const [sheetBonusPenalty, setSheetBonusPenalty] = useState<number>(0);
  const [quickPolyNote, setQuickPolyNote] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [pendingOutcome, setPendingOutcome] = useState<PendingOutcomeState | null>(
    null
  );
  const [combatEntity, setCombatEntity] = useState<BestiaryEntity | null>(null);
  const [combatReturnNodeId, setCombatReturnNodeId] = useState<string | null>(null);
  const [activeCombatSnapshot, setActiveCombatSnapshot] =
    useState<CombatSessionSnapshot | null>(null);

  const [xCardOpen, setXCardOpen] = useState(false);
  const [amberNotice, setAmberNotice] = useState<string | null>(null);
  const [thresholdModal, setThresholdModal] = useState<ThresholdModalState | null>(
    null
  );
  const [hasSavedGame, setHasSavedGame] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw && parseSavedSession(raw)) {
        setHasSavedGame(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (gameState === 'PLAYING' || gameState === 'COMBAT_INTIMO') {
      try {
        const serialized = serializeSavedSession({
          version: 2,
          investigator,
          consent,
          narrativeLevel,
          currentArcId,
          currentNodeId,
          sceneHistory: sceneHistory.slice(-20),
          flags,
          chronicle,
          activeCombat:
            gameState === 'COMBAT_INTIMO' ? activeCombatSnapshot : null,
        });
        localStorage.setItem(STORAGE_KEY, serialized);
        setHasSavedGame(true);
      } catch {
        // ignore quota errors
      }
    }
  }, [
    gameState,
    investigator,
    consent,
    narrativeLevel,
    currentArcId,
    currentNodeId,
    sceneHistory,
    flags,
    chronicle,
    activeCombatSnapshot,
  ]);

  const currentNode = STORY_NODES[currentNodeId] || STORY_NODES.zarza_intro;
  const currentArc =
    STORY_ARCS.find((a) => a.id === currentArcId) || STORY_ARCS[0];

  const appendChronicle = (
    type: ChronicleLog['type'],
    title: string,
    detail: string
  ) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setChronicle((prev) => [
      {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type,
        title,
        detail,
        timestamp,
      },
      ...prev.slice(0, 49),
    ]);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    soundEngine.enabled = next;
    setSoundEnabled(next);
  };

  const applyValidatedSession = (saved: NonNullable<ReturnType<typeof parseSavedSession>>) => {
    setInvestigator(saved.investigator);
    setConsent({
      ...saved.consent,
      hardLimits: ensureUniversalMinorVeto(saved.consent.hardLimits),
    });
    setNarrativeLevel(saved.narrativeLevel);
    setCurrentArcId(saved.currentArcId);
    setCurrentNodeId(saved.currentNodeId);
    setSceneHistory(saved.sceneHistory || []);
    setFlags(saved.flags || []);
    setChronicle(saved.chronicle || []);
    setPendingOutcome(null);
    setLastRoll(null);
    setQuickPolyNote(null);

    if (saved.activeCombat && saved.activeCombat.entity) {
      setCombatEntity(saved.activeCombat.entity);
      setCombatReturnNodeId(saved.activeCombat.returnNodeId);
      setActiveCombatSnapshot(saved.activeCombat);
      setGameState('COMBAT_INTIMO');
    } else {
      setCombatEntity(null);
      setCombatReturnNodeId(null);
      setActiveCombatSnapshot(null);
      setGameState('PLAYING');
    }
  };

  const handleResumeSaved = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = parseSavedSession(raw);
      if (!saved) {
        setGameState('SESSION_ZERO');
        return;
      }
      applyValidatedSession(saved);
    } catch {
      setGameState('SESSION_ZERO');
    }
  };

  const handleConfirmSessionZero = (
    newConsent: ConsentDocument,
    chosenInv: Investigator,
    chosenArc: StoryArc
  ) => {
    const safeConsent: ConsentDocument = {
      ...newConsent,
      hardLimits: ensureUniversalMinorVeto(newConsent.hardLimits),
    };
    setConsent(safeConsent);
    setNarrativeLevel(safeConsent.baseLevel);
    setInvestigator(chosenInv);
    setCurrentArcId(chosenArc.id);
    setCurrentNodeId(chosenArc.startNodeId);
    setSceneHistory([]);
    setFlags([]);
    setPendingOutcome(null);
    setCombatEntity(null);
    setCombatReturnNodeId(null);
    setActiveCombatSnapshot(null);
    setLastRoll(null);
    setQuickPolyNote(null);
    setThresholdModal(null);
    setChronicle([
      {
        id: `init-${Date.now()}`,
        type: 'SAFETY',
        title: 'Sesión Cero sellada',
        detail: `Investigador: ${chosenInv.name}. Arco: ${chosenArc.title}. Escala máxima: Nivel ${safeConsent.baseLevel} (${
          safeConsent.baseLevel === 0 ? 'Velo estricto' : 'Sensual'
        }).`,
        timestamp: new Date().toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
    soundEngine.playSafetyChime();
    setGameState('PLAYING');
  };

  const handleChangeLevel = (lvl: NarrativeLevel) => {
    if (lvl <= consent.baseLevel || lvl === 0) {
      setNarrativeLevel(lvl);
      appendChronicle(
        'SAFETY',
        'Escala narrativa ajustada',
        `Nivel cambiado a ${
          lvl === 0 ? 'Nivel 0 (Velo estricto)' : 'Nivel 1 (Sensual literario)'
        }.`
      );
    }
  };

  const handleTriggerAmber = () => {
    soundEngine.playSafetyChime();
    setNarrativeLevel(0);
    setAmberNotice(
      `Señal «${consent.amberWord}» activada: la narración ha pasado inmediatamente a Nivel 0 (Velo estricto) sin alterar la partida.`
    );
    appendChronicle(
      'SAFETY',
      `Señal Ámbar (${consent.amberWord})`,
      'Tono suavizado a Nivel 0 (Velo estricto).'
    );
    setTimeout(() => setAmberNotice(null), 5000);
  };

  const handleTriggerXCard = () => {
    soundEngine.playSafetyChime();
    setXCardOpen(true);
  };

  const handleXCardAction = (action: XCardAction) => {
    setNarrativeLevel(0);
    setXCardOpen(false);

    if (action === 'EXIT') {
      setGameState('TITLE_MENU');
      appendChronicle(
        'SAFETY',
        `Tarjeta X (${consent.xCardWord})`,
        'Pausa segura aplicada y salida al menú principal.'
      );
      return;
    }

    if (action === 'VEIL') {
      appendChronicle(
        'SAFETY',
        `Tarjeta X (${consent.xCardWord})`,
        'Escena mantenida bajo Nivel 0 (Velo estricto) sin coste mecánico.'
      );
      return;
    }

    if (action === 'REWIND') {
      if (gameState === 'COMBAT_INTIMO') {
        const safeNode =
          sceneHistory[sceneHistory.length - 1] ||
          combatReturnNodeId ||
          currentNodeId;
        setCombatEntity(null);
        setCombatReturnNodeId(null);
        setActiveCombatSnapshot(null);
        setPendingOutcome(null);
        setCurrentNodeId(safeNode);
        setGameState('PLAYING');
      } else if (sceneHistory.length > 0) {
        const previousNode = sceneHistory[sceneHistory.length - 1];
        setSceneHistory((prev) => prev.slice(0, -1));
        setPendingOutcome(null);
        setCurrentNodeId(previousNode);
      }
      appendChronicle(
        'SAFETY',
        `Tarjeta X · Rebobinar (${consent.xCardWord})`,
        'Retorno seguro a la escena anterior en Nivel 0 sin pérdida ni penalización.'
      );
      return;
    }

    // action === 'SKIP'
    if (gameState === 'COMBAT_INTIMO') {
      const returnId = combatReturnNodeId || currentNodeId;
      setCombatEntity(null);
      setCombatReturnNodeId(null);
      setActiveCombatSnapshot(null);
      setCurrentNodeId(returnId);
      setGameState('PLAYING');
    } else if (currentNode.choices.length > 0) {
      const firstChoice = currentNode.choices[0];
      const nextId =
        firstChoice.directOutcome?.nextSceneId ||
        firstChoice.skillCheck?.onSuccess.nextSceneId ||
        currentNodeId;
      setSceneHistory((prev) => [...prev.slice(-19), currentNodeId]);
      setPendingOutcome(null);
      setCurrentNodeId(nextId);
    }
    appendChronicle(
      'SAFETY',
      `Tarjeta X · Omitir (${consent.xCardWord})`,
      'Escena velada y omitida limpiamente (Nivel 0, sin coste mecánico).'
    );
  };

  const triggerRollAnim = (roll: DiceRollResult) => {
    setIsRolling(true);
    setLastRoll(roll);
    setTimeout(() => setIsRolling(false), 180);
  };

  const handleManualSkillRoll = (
    label: string,
    target: number,
    isInhCheck = false
  ) => {
    soundEngine.playDiceRoll();
    setQuickPolyNote(null);

    const arrebato = getArrebatoModifiers(investigator);
    let effectiveBonus = sheetBonusPenalty;
    const lowLabel = label.toLowerCase();
    if (arrebato.active) {
      if (lowLabel.includes('técnica') || lowLabel.includes('seducción')) {
        effectiveBonus += arrebato.offensiveBonusDice;
      } else if (
        lowLabel.includes('resistencia') ||
        lowLabel.includes('pod') ||
        lowLabel.includes('int')
      ) {
        effectiveBonus += arrebato.defensiveBonusDice;
      }
    }

    let nextInv = investigator;
    let effectiveTarget = target;
    let effectiveLabel = label;

    if (nextInv.diarioPendingSkillBonus) {
      effectiveTarget = Math.min(99, target + 10);
      effectiveLabel = `${label} (+10% Diario)`;
      nextInv = { ...nextInv, diarioPendingSkillBonus: false };
    }

    let result: DiceRollResult;
    if (isInhCheck) {
      const inhCheck = resolveInhibitionCheck(
        nextInv,
        effectiveLabel,
        sheetDifficulty,
        effectiveBonus
      );
      result = inhCheck.roll;
      nextInv = inhCheck.updatedInvestigator;
    } else {
      result = rollD100(
        effectiveLabel,
        effectiveTarget,
        sheetDifficulty,
        effectiveBonus
      );
    }

    if (nextInv !== investigator) {
      setInvestigator(nextInv);
    }

    triggerRollAnim(result);
    if (result.isSuccess) {
      soundEngine.playSuccess(
        result.degree === 'EXTREMO' || result.degree === 'CRITICO'
      );
    }
    appendChronicle(
      'ROLL',
      `${result.label}: ${result.rawRoll} (${result.degree})`,
      `Objetivo ≤ ${result.effectiveTarget}% (${sheetDifficulty}${
        effectiveBonus !== 0
          ? `, ${effectiveBonus > 0 ? `+${effectiveBonus}D Bon.` : `${effectiveBonus}D Pen.`}`
          : ''
      }).`
    );
  };

  const handleQuickPolyRoll = (sides: number | 'D100') => {
    soundEngine.playDiceRoll();
    if (sides === 'D100') {
      setQuickPolyNote(null);
      const result = rollD100(
        'Tirada D100 abierta',
        50,
        sheetDifficulty,
        sheetBonusPenalty
      );
      triggerRollAnim(result);
      if (result.isSuccess) {
        soundEngine.playSuccess(
          result.degree === 'EXTREMO' || result.degree === 'CRITICO'
        );
      }
      appendChronicle(
        'ROLL',
        `D100 abierta: ${result.rawRoll} (${result.degree})`,
        `Referencia 50% · Objetivo ≤ ${result.effectiveTarget}%.`
      );
      return;
    }
    const val = rollDie(sides);
    setQuickPolyNote(`1D${sides} libre = ${val}`);
    appendChronicle(
      'ROLL',
      `Tirada 1D${sides}: ${val}`,
      'Dado poliédrico directo desde la bandeja de mesa.'
    );
  };

  const applyOutcomeEffects = (
    baseInv: Investigator,
    outcome: SceneOutcome,
    sourceLabel: string,
    succeeded?: boolean
  ) => {
    let nextInv: Investigator = { ...baseInv };

    if (outcome.corLoss) {
      const cRoll = rollDiceNotation(outcome.corLoss);
      if (cRoll.total > 0) {
        nextInv.cor = Math.max(0, nextInv.cor - cRoll.total);
        appendChronicle(
          'CORRUPTION',
          `Cordura -${cRoll.total}`,
          `${sourceLabel}: ${cRoll.detail}. COR restante: ${nextInv.cor}.`
        );
      }
    }

    if (outcome.inhLoss) {
      const iRoll = rollDiceNotation(outcome.inhLoss);
      if (iRoll.total > 0) {
        const res = applyInhibitionLoss(
          nextInv,
          iRoll.total,
          sourceLabel,
          consent.acceptArrebato
        );
        nextInv = res.updatedInvestigator;
        appendChronicle(
          'CORRUPTION',
          `Inhibición -${res.lossAmount}`,
          `INH restante: ${nextInv.inh}. ${res.notes.join(' ')}`
        );
        if (
          res.triggeredArrebato ||
          res.newThresholdFilias.length > 0 ||
          res.crossedTenWarning ||
          res.reachedZero
        ) {
          soundEngine.playCorruption();
          setThresholdModal({
            title: res.reachedZero
              ? 'Umbral 0 · La Caída Consumada (Tabla E)'
              : res.triggeredArrebato
                ? 'Arrebato de Lujuria (Tabla A)'
                : 'Umbral de Inhibición Cruzado',
            lines: res.notes,
            reachedZero: res.reachedZero,
          });
        }
      }
    }

    if (typeof outcome.acDelta === 'number') {
      nextInv.ac = Math.max(
        0,
        Math.min(nextInv.maxAc, nextInv.ac + outcome.acDelta)
      );
    }
    if (typeof outcome.pvDelta === 'number') {
      nextInv.pv = Math.max(
        0,
        Math.min(nextInv.maxPv, nextInv.pv + outcome.pvDelta)
      );
    }
    if (typeof outcome.pmDelta === 'number') {
      nextInv.pm = Math.max(
        0,
        Math.min(nextInv.maxPm, nextInv.pm + outcome.pmDelta)
      );
    }
    if (
      outcome.addMarca &&
      consent.acceptMarcado &&
      !nextInv.marcas.includes(outcome.addMarca)
    ) {
      nextInv.marcas = [...nextInv.marcas, outcome.addMarca];
    }
    if (outcome.addDeuda && !nextInv.deudas.includes(outcome.addDeuda)) {
      nextInv.deudas = [...nextInv.deudas, outcome.addDeuda];
    }
    if (outcome.addRelic && !nextInv.reliquias.includes(outcome.addRelic)) {
      nextInv.reliquias = [...nextInv.reliquias, outcome.addRelic];
    }
    if (outcome.addSpell && !nextInv.hechizos.includes(outcome.addSpell)) {
      nextInv.hechizos = [...nextInv.hechizos, outcome.addSpell];
    }
    if (outcome.addFlag && !flags.includes(outcome.addFlag)) {
      setFlags((prev) => [...prev, outcome.addFlag as string]);
    }

    setInvestigator(nextInv);

    const rawProse =
      narrativeLevel === 0 ? outcome.narrativeVelo : outcome.narrativeSensual;
    const filteredProse = filterByHardLimits(rawProse, consent.hardLimits).text;

    setPendingOutcome({
      text: filteredProse,
      nextNodeId: outcome.nextSceneId,
      triggerCombatEntityId: outcome.triggerCombatEntityId,
      succeeded,
    });
  };

  const getSkillValue = (
    key: NonNullable<SceneChoice['skillCheck']>['skill']
  ): number => {
    if (key === 'CON') return investigator.attributes.CON;
    if (key === 'POD') return investigator.attributes.POD;
    if (key === 'INT') return investigator.attributes.INT;
    if (key === 'COR') return investigator.cor;
    if (key === 'INH') {
      return !investigator.firstInhRollDone
        ? investigator.attributes.POD
        : investigator.inh;
    }
    return investigator.skills[key];
  };

  const handleSelectChoice = (choice: SceneChoice) => {
    if (choice.costsPm && investigator.pm < choice.costsPm) return;

    let workingInv: Investigator = { ...investigator };
    if (choice.costsPm) {
      workingInv.pm = Math.max(0, workingInv.pm - choice.costsPm);
    }

    if (choice.skillCheck) {
      soundEngine.playDiceRoll();
      const arrebato = getArrebatoModifiers(workingInv);
      let bonusDice = 0;
      if (arrebato.active) {
        if (
          choice.skillCheck.skill === 'tecnica' ||
          choice.skillCheck.skill === 'seduccion'
        ) {
          bonusDice += arrebato.offensiveBonusDice;
        } else if (
          choice.skillCheck.skill === 'resistenciaCarnal' ||
          choice.skillCheck.skill === 'POD' ||
          choice.skillCheck.skill === 'INT'
        ) {
          bonusDice += arrebato.defensiveBonusDice;
        }
      }

      let label = choice.skillCheck.label;
      let target = getSkillValue(choice.skillCheck.skill);
      if (workingInv.diarioPendingSkillBonus) {
        target = Math.min(99, target + 10);
        label = `${label} (+10% Diario)`;
        workingInv.diarioPendingSkillBonus = false;
      }

      let result: DiceRollResult;
      if (choice.skillCheck.skill === 'INH') {
        const inhCheck = resolveInhibitionCheck(
          workingInv,
          label,
          choice.skillCheck.difficulty,
          bonusDice
        );
        result = inhCheck.roll;
        workingInv = inhCheck.updatedInvestigator;
      } else {
        result = rollD100(
          label,
          target,
          choice.skillCheck.difficulty,
          bonusDice
        );
      }

      triggerRollAnim(result);

      if (result.isSuccess) {
        soundEngine.playSuccess(
          result.degree === 'EXTREMO' || result.degree === 'CRITICO'
        );
        appendChronicle(
          'ROLL',
          `Éxito (${result.rawRoll} · ${result.degree})`,
          result.label
        );
        applyOutcomeEffects(
          workingInv,
          choice.skillCheck.onSuccess,
          result.label,
          true
        );
      } else {
        soundEngine.playCorruption();
        appendChronicle(
          'ROLL',
          `Fallo (${result.rawRoll} · ${result.degree})`,
          result.label
        );
        applyOutcomeEffects(
          workingInv,
          choice.skillCheck.onFail,
          result.label,
          false
        );
      }
      return;
    }

    setInvestigator(workingInv);
    if (choice.directOutcome) {
      applyOutcomeEffects(workingInv, choice.directOutcome, choice.label);
    }
  };

  const handleProceedPendingOutcome = () => {
    if (!pendingOutcome) return;
    setSceneHistory((prev) => [...prev.slice(-19), currentNodeId]);
    if (pendingOutcome.triggerCombatEntityId) {
      const ent = BESTIARY_ENTITIES.find(
        (e) => e.id === pendingOutcome.triggerCombatEntityId
      );
      if (ent) {
        const clonedEntity: BestiaryEntity = JSON.parse(JSON.stringify(ent));
        setCombatEntity(clonedEntity);
        setCombatReturnNodeId(pendingOutcome.nextNodeId);
        setActiveCombatSnapshot({
          entity: clonedEntity,
          round: 1,
          entityPenalty: 0,
          ironUsed: false,
          pendingBurnedPm: 0,
          returnNodeId: pendingOutcome.nextNodeId,
        });
        setPendingOutcome(null);
        setGameState('COMBAT_INTIMO');
        return;
      }
    }
    setCurrentNodeId(pendingOutcome.nextNodeId);
    setPendingOutcome(null);
  };

  const handleCombatComplete = (outcome: 'VICTORY' | 'DEFEAT' | 'ESCAPED') => {
    const targetNode = combatReturnNodeId || currentNodeId;
    appendChronicle(
      'COMBAT',
      'Combate Íntimo concluido',
      outcome === 'VICTORY'
        ? 'Saliste victorioso del intercambio.'
        : outcome === 'ESCAPED'
          ? 'Rompiste el encuentro con Resistencia de Hierro.'
          : 'Sobreviviste al clímax de la entidad.'
    );
    setInvestigator((inv) => ({
      ...inv,
      accumulatedCombatPenalty: 0,
      arrebatoRounds: 0,
      activeArrebato: null,
      ac: Math.max(2, inv.ac),
    }));
    setCombatEntity(null);
    setCombatReturnNodeId(null);
    setActiveCombatSnapshot(null);
    setSceneHistory((prev) => [...prev.slice(-19), currentNodeId]);
    setCurrentNodeId(targetNode);
    setGameState('PLAYING');
  };

  const handleUseLazo = (lazoId: string, mode: 'REFUGIO' | 'INHIBICION') => {
    setInvestigator((prev) => {
      const targetLazo = prev.lazos.find((l) => l.id === lazoId);
      if (!targetLazo || targetLazo.spent) return prev;

      if (mode === 'REFUGIO' && !targetLazo.refugeUsedThisSession) {
        const outcome = applyRecoveryMethod(prev, 'REFUGIO_ESCENA', lazoId);
        soundEngine.playSafetyChime();
        appendChronicle(
          'NARRATIVE',
          `Refugio del Cuerpo (${targetLazo.name})`,
          outcome.note
        );
        return outcome.updatedInvestigator;
      }

      if (mode === 'INHIBICION') {
        soundEngine.playSafetyChime();
        appendChronicle(
          'CORRUPTION',
          `Lazo Íntimo gastado (${targetLazo.name})`,
          'Consolidas +6 puntos de Inhibición al aferrarte a tu vínculo.'
        );
        return {
          ...prev,
          inh: Math.min(prev.initialInh, prev.inh + 6),
          lazos: prev.lazos.map((l) =>
            l.id === lazoId ? { ...l, spent: true } : l
          ),
        };
      }

      return prev;
    });
  };

  const handleRecover = (method: RecoveryMethod) => {
    setInvestigator((prev) => {
      const outcome = applyRecoveryMethod(prev, method);
      soundEngine.playSafetyChime();
      appendChronicle('NARRATIVE', 'Recuperación (Sección 7)', outcome.note);
      return outcome.updatedInvestigator;
    });
  };

  const handleSaveDiario = (entry: DiarioEntry) => {
    setInvestigator((prev) => {
      const next = {
        ...prev,
        diarioEntries: [entry, ...prev.diarioEntries],
        diarioBonusUsed: true,
      };
      if (!prev.diarioBonusUsed) {
        if (entry.bonusClaimed === 'AC') {
          next.ac = Math.min(prev.maxAc, prev.ac + 1);
        } else if (entry.bonusClaimed === 'SKILL') {
          // Section 3.7: +10% on the first related roll (never restores COR or INH)
          next.diarioPendingSkillBonus = true;
        }
      }
      return next;
    });
    soundEngine.playSafetyChime();
    appendChronicle(
      'NARRATIVE',
      'Diario de la Caída actualizado',
      `${entry.scene} — ${entry.sharedPhrase}${
        entry.bonusClaimed === 'SKILL'
          ? ' (+10% listo para la próxima tirada).'
          : entry.bonusClaimed === 'AC'
            ? ' (+1 AC).'
            : ''
      }`
    );
  };

  const handleCastSpell = (spellId: string) => {
    const spell = GRIMORIO_SPELLS.find((s) => s.id === spellId);
    if (!spell || investigator.pm < spell.pmCost) return;
    soundEngine.playCorruption();
    let nextInv: Investigator = {
      ...investigator,
      pm: Math.max(0, investigator.pm - spell.pmCost),
    };
    if (spell.inhCost > 0) {
      const res = applyInhibitionLoss(
        nextInv,
        spell.inhCost,
        `Hechizo: ${spell.name}`,
        consent.acceptArrebato
      );
      nextInv = res.updatedInvestigator;
      if (
        res.triggeredArrebato ||
        res.newThresholdFilias.length > 0 ||
        res.crossedTenWarning ||
        res.reachedZero
      ) {
        setThresholdModal({
          title: res.reachedZero
            ? 'Umbral 0 · La Caída Consumada (Tabla E)'
            : 'Umbral de Inhibición Cruzado',
          lines: res.notes,
          reachedZero: res.reachedZero,
        });
      }
    }
    setInvestigator(nextInv);
    appendChronicle(
      'ROLL',
      `Sortilegio lanzado: ${spell.name}`,
      `${spell.effect} (Coste: ${spell.cost}).`
    );
  };

  const handleUseRelic = (relicName: string) => {
    const low = relicName.toLowerCase();
    let msg = `Activas ${relicName} en escena.`;
    setInvestigator((prev) => {
      const next = { ...prev };
      if (low.includes('lágrima') || low.includes('lagrima')) {
        const pvHeal = rollDiceNotation('1d6').total;
        const corHeal = rollDiceNotation('1d6').total;
        next.pv = Math.min(next.maxPv, next.pv + pvHeal);
        next.cor = Math.min(next.maxCor, next.cor + corHeal);
        msg = `Lágrima de la Ninfa: recuperas +${pvHeal} PV y +${corHeal} COR.`;
      } else if (low.includes('aceite')) {
        next.ac = Math.min(next.maxAc, next.ac + 2);
        const res = applyInhibitionLoss(
          next,
          1,
          'Aceite de la Zarza',
          consent.acceptArrebato
        );
        Object.assign(next, res.updatedInvestigator);
        msg = 'Aceite de la Zarza: +2 AC y protección contra zarcillos (-1 INH).';
      } else if (low.includes('sal marina')) {
        next.cor = Math.min(next.maxCor, next.cor + 1);
        msg = 'Sal marina dispersada: el olor costero disipa la ilusión (+1 COR).';
      } else {
        const { entry } = pickFromD100Table(TABLA_B);
        msg = `${relicName} responde al umbral (eco de Tabla B: ${entry.name}).`;
      }
      return next;
    });
    soundEngine.playSuccess(false);
    appendChronicle('NARRATIVE', `Reliquia: ${relicName}`, msg);
  };

  const handleTablaERatification = (choice: TablaERatificationChoice) => {
    setThresholdModal(null);
    if (choice === 'VELO') {
      setNarrativeLevel(0);
      setInvestigator((inv) => ({
        ...inv,
        inhAnomalyFixed: true,
        marcas: consent.acceptMarcado && !inv.marcas.includes('Voto del Velo (Tabla E)')
          ? [...inv.marcas, 'Voto del Velo (Tabla E)']
          : inv.marcas,
      }));
      appendChronicle(
        'THRESHOLD',
        'Co-escritura Tabla E · Pacto bajo Velo',
        'La transformación se sella en Nivel 0 (Velo estricto) manteniendo la agencia del personaje.'
      );
      return;
    }
    if (choice === 'SERVIDUMBRE') {
      setInvestigator((inv) => ({
        ...inv,
        inhAnomalyFixed: true,
        deudas: [
          ...inv.deudas,
          'Servidumbre ritual no sexual pactada en el Umbral (Tabla E)',
        ],
      }));
      appendChronicle(
        'THRESHOLD',
        'Co-escritura Tabla E · Servidumbre Ritual',
        'Se pacta una deuda ritual no sexual en lugar de perder el control del personaje.'
      );
      return;
    }
    if (choice === 'RESISTENCIA') {
      setInvestigator((inv) => ({
        ...inv,
        inh: 1,
        endurecimiento: consent.useEndurecimiento
          ? {
              ...inv.endurecimiento,
              profanacion: Math.min(5, inv.endurecimiento.profanacion + 1),
            }
          : inv.endurecimiento,
      }));
      appendChronicle(
        'THRESHOLD',
        'Co-escritura Tabla E · Arco de Resistencia',
        'El investigador se aferra a 1 INH para cerrar su arco de resistencia consciente.'
      );
      return;
    }

    // RETIRADA
    setCombatEntity(null);
    setCombatReturnNodeId(null);
    setActiveCombatSnapshot(null);
    setPendingOutcome(null);
    setNarrativeLevel(0);
    appendChronicle(
      'THRESHOLD',
      'Co-escritura Tabla E · Retirada Digna',
      'Acuerdo de mesa: el investigador se retira con dignidad tras el cierre de aftercare.'
    );
    setGameState('TITLE_MENU');
  };

  const handleStartFreeCombat = (entity: BestiaryEntity) => {
    const clonedInv: Investigator = JSON.parse(
      JSON.stringify(investigator || INVESTIGATORS[0])
    );
    const clonedEntity: BestiaryEntity = JSON.parse(JSON.stringify(entity));
    setInvestigator(clonedInv);
    setCombatEntity(clonedEntity);
    setCombatReturnNodeId(currentNodeId);
    setActiveCombatSnapshot({
      entity: clonedEntity,
      round: 1,
      entityPenalty: 0,
      ironUsed: false,
      pendingBurnedPm: 0,
      returnNodeId: currentNodeId,
    });
    setGameState('COMBAT_INTIMO');
  };

  const handleExportSession = () => {
    const payload = serializeSavedSession({
      version: 2,
      investigator,
      consent,
      narrativeLevel,
      currentArcId,
      currentNodeId,
      sceneHistory,
      flags,
      chronicle,
      activeCombat: gameState === 'COMBAT_INTIMO' ? activeCombatSnapshot : null,
    });
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pecados-cronica-${investigator.id}-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    appendChronicle(
      'SAFETY',
      'Crónica exportada (.json)',
      'Copia de seguridad descargada localmente con esquema v2.'
    );
  };

  const handleImportSession = (rawJson: string): boolean => {
    const parsed = parseSavedSession(rawJson);
    if (!parsed) {
      setAmberNotice(
        'El archivo JSON no corresponde a una crónica válida de Pecados de la Carne.'
      );
      setTimeout(() => setAmberNotice(null), 5000);
      return false;
    }
    applyValidatedSession(parsed);
    soundEngine.playSafetyChime();
    appendChronicle(
      'SAFETY',
      'Crónica importada (.json)',
      `Sesión restaurada para ${parsed.investigator.name}.`
    );
    return true;
  };

  return {
    gameState,
    setGameState,
    consent,
    narrativeLevel,
    investigator,
    setInvestigator,
    currentArcId,
    currentArc,
    currentNodeId,
    currentNode,
    sceneHistory,
    flags,
    chronicle,
    lastRoll,
    isRolling,
    sheetDifficulty,
    setSheetDifficulty,
    sheetBonusPenalty,
    setSheetBonusPenalty,
    quickPolyNote,
    soundEnabled,
    pendingOutcome,
    combatEntity,
    activeCombatSnapshot,
    setActiveCombatSnapshot,
    xCardOpen,
    setXCardOpen,
    amberNotice,
    setAmberNotice,
    thresholdModal,
    setThresholdModal,
    hasSavedGame,
    appendChronicle,
    handleToggleSound,
    handleResumeSaved,
    handleConfirmSessionZero,
    handleChangeLevel,
    handleTriggerAmber,
    handleTriggerXCard,
    handleXCardAction,
    triggerRollAnim,
    handleManualSkillRoll,
    handleQuickPolyRoll,
    getSkillValue,
    handleSelectChoice,
    handleProceedPendingOutcome,
    handleCombatComplete,
    handleUseLazo,
    handleRecover,
    handleSaveDiario,
    handleCastSpell,
    handleUseRelic,
    handleTablaERatification,
    handleStartFreeCombat,
    handleExportSession,
    handleImportSession,
  };
}
