import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Dices,
  EyeOff,
  Flame,
  HeartHandshake,
  Lock,
  RotateCcw,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Swords,
} from 'lucide-react';
import { Investigator, StoryArc } from './types/game';
import { INVESTIGATORS } from './data/investigators';
import { STORY_ARCS } from './data/scenarios';
import { filterByHardLimits } from './utils/brpEngine';
import { DEFAULT_CONSENT, useGameSession } from './hooks/useGameSession';
import { OccultCanvas } from './components/OccultCanvas';
import { SafetyBar } from './components/SafetyBar';
import { DiceRoller } from './components/DiceRoller';
import { CharacterSheet } from './components/CharacterSheet';
import { IntimateCombatView } from './components/IntimateCombatView';
import { GuardianDrawer } from './components/GuardianDrawer';
import { SessionZeroModal } from './components/SessionZeroModal';
import { CompendiumView } from './components/CompendiumView';
import { EntityArtwork, InvestigatorCrest } from './components/EntityArtwork';
import { ARTWORK_PATHS, getAmbientBackdrop } from './data/artworkAssets';
import { NARRATIVE_LEVEL_LABELS, isIntimateNode, pickNodeText } from './utils/narrativeText';
import { heartbeatSeconds, resolveAmbienceMode } from './utils/ambience';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { HeartbeatVignette, RevealParagraphs, SceneAmbience } from './components/SceneAmbience';

const AGE_GATE_KEY = 'pecados_age_gate_v1';

interface ArcHandout {
  code: string;
  title: string;
  material: string;
  excerpt: string;
  keeperNote: string;
}

const ARC_HANDOUTS: Record<string, ArcHandout> = {
  'vigilia-zarza': {
    code: 'HANDOUT #11-A · ARCHIVO MUNICIPAL',
    title: 'Sobre sellado y registro de Finca Herrera',
    material: 'Papel verjurado húmedo · Cera verde oscura · Tinta ferrogálica',
    excerpt:
      '«Este año la casa quiere que vengas. Doña Aurelia decía que los jardines solo perdonan a quien se les entrega. La vigilia es el sábado, a la caída. No traigas flores: la casa las pone. — A.» En el libro parroquial anexo figuran trece «traslados al extranjero» sin billete de embarque en los últimos trece años.',
    keeperNote:
      'Pista física: el invernadero lleva trece años cerrado por «restauración», pero los cristales conservan condensación tibia incluso en invierno.',
  },
  'umbrales-deseo': {
    code: 'HANDOUT #24-B · INVENTARIO DE LLAVES',
    title: 'Registro de las Seis Puertas del Umbral',
    material: 'Etiquetas de latón numeradas · Sal seca adherida al metal',
    excerpt:
      'I. Llave de hierro salino (Olor a pleamar nocturna) · II. Llave de plata bruñida (Salón de reflejos múltiples) · III. Llave de fresno negro (Mesa comunal del bosque) · IV. Llave de pizarra húmeda (Cala sin cartografía) · V. Llave de bronce numerada (Habitación 409) · VI. Llave envuelta en terciopelo pálido (Palco vacío).',
    keeperNote:
      'Pista física: ninguna llave corresponde a una cerradura ordinaria; cada una abre un umbral distinto del Mythos.',
  },
  'doble-vigilia': {
    code: 'HANDOUT #13-C · PLANO DE CATASTRO',
    title: 'Cédula del sótano de Calle San Telmo, 14',
    material: 'Plano arquitectónico rasgado · Anotaciones marginales a lápiz rojo',
    excerpt:
      '«Bajo la capilla ordinaria de barrio existe una cámara abovedada sin escalera en los planos de 1924. Regla inscrita en el dintel interior: La Congregación Doblada devuelve un rostro conocido por cada vigilia completa resistida sin romper el voto de silencio.»',
    keeperNote:
      'Pista física: los vecinos escuchan coros tenues a medianoche, pero las ventanas del bajo permanecen tapiadas desde el interior.',
  },
};

function getArcProgressSteps(
  arcId: string,
  actLabel: string,
  isEnding?: boolean
): { steps: string[]; activeIndex: number } {
  if (arcId === 'vigilia-zarza') {
    const steps = ['Prólogo', 'Acto I', 'Acto II', 'Acto III', 'Epílogo'];
    let activeIndex = 0;
    if (isEnding || actLabel.includes('Epílogo')) activeIndex = 4;
    else if (actLabel.includes('Acto III')) activeIndex = 3;
    else if (actLabel.includes('Acto II')) activeIndex = 2;
    else if (actLabel.includes('Acto I')) activeIndex = 1;
    return { steps, activeIndex };
  }
  if (arcId === 'doble-vigilia') {
    const steps = ['Acto I', 'Acto II', 'Acto III', 'Epílogo'];
    let activeIndex = 0;
    if (isEnding || actLabel.includes('Epílogo')) activeIndex = 3;
    else if (actLabel.includes('Acto III')) activeIndex = 2;
    else if (actLabel.includes('Acto II')) activeIndex = 1;
    return { steps, activeIndex };
  }
  const steps = ['Vestíbulo', 'Umbral I–VI', 'Resolución'];
  let activeIndex = 0;
  if (isEnding) activeIndex = 2;
  else if (!actLabel.includes('Antología')) activeIndex = 1;
  return { steps, activeIndex };
}

export default function App() {
  const session = useGameSession();
  const reducedMotion = usePrefersReducedMotion();
  const {
    gameState,
    setGameState,
    consent,
    narrativeLevel,
    investigator,
    setInvestigator,
    currentArcId,
    currentArc,
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
    animationsEnabled,
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
    handleToggleAnimations,
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
  } = session;

  const [handoutOpen, setHandoutOpen] = useState(false);
  const [sessionZeroSeeds, setSessionZeroSeeds] = useState<{
    investigatorId: string;
    arcId: string;
  } | null>(null);
  const [quickStartPending, setQuickStartPending] = useState<{
    inv: Investigator;
    arc: StoryArc;
  } | null>(null);

  const [ageConfirmed, setAgeConfirmed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AGE_GATE_KEY) === 'confirmed';
    } catch {
      return false;
    }
  });

  const handleConfirmAgeGate = () => {
    try {
      localStorage.setItem(AGE_GATE_KEY, 'confirmed');
    } catch {
      // ignore storage failure
    }
    setAgeConfirmed(true);
  };

  // Global keyboard shortcuts: X triggers Tarjeta X during play; Escape closes open modals
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isEditable =
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        Boolean(target?.isContentEditable);

      if (e.key === 'Escape') {
        if (xCardOpen) {
          setXCardOpen(false);
          return;
        }
        if (quickStartPending) {
          setQuickStartPending(null);
          return;
        }
        if (thresholdModal && !thresholdModal.reachedZero) {
          setThresholdModal(null);
          return;
        }
      }

      if (
        !isEditable &&
        ageConfirmed &&
        (e.key === 'x' || e.key === 'X') &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        (gameState === 'PLAYING' || gameState === 'COMBAT_INTIMO')
      ) {
        e.preventDefault();
        handleTriggerXCard();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    ageConfirmed,
    gameState,
    xCardOpen,
    quickStartPending,
    thresholdModal,
    setXCardOpen,
    setThresholdModal,
    handleTriggerXCard,
  ]);

  const openSessionZero = (invId = investigator.id, arcId = currentArcId) => {
    setSessionZeroSeeds({ investigatorId: invId, arcId });
    setGameState('SESSION_ZERO');
  };

  const handleRequestQuickStart = (inv: Investigator, arc: StoryArc) => {
    const cloned: Investigator = JSON.parse(JSON.stringify(inv));
    setQuickStartPending({ inv: cloned, arc });
  };

  const corruptionRatio =
    gameState === 'PLAYING' || gameState === 'COMBAT_INTIMO'
      ? Math.max(
          0,
          Math.min(
            1,
            (investigator.initialInh - investigator.inh) /
              Math.max(1, investigator.initialInh)
          )
        )
      : 0.18;

  const ambienceMode = resolveAmbienceMode({
    level: narrativeLevel,
    intimate: isIntimateNode(currentNode),
    enabled: animationsEnabled,
    xCardOpen,
    reducedMotion,
  });
  const heartbeat = heartbeatSeconds(corruptionRatio);

  return (
    <div className="min-h-screen relative bg-[#09080c] text-[#ece3d5] flex flex-col selection:bg-[#9e1b32] selection:text-[#ece3d5]">
      <OccultCanvas
        corruptionRatio={corruptionRatio}
        ambientTag={currentNode.ambientTag}
      />

      <HeartbeatVignette mode={ambienceMode} heartbeat={heartbeat} />

      <div className="relative z-10 flex-1 flex flex-col">
        <SafetyBar
          gameState={gameState}
          narrativeLevel={narrativeLevel}
          maxAllowedLevel={consent.baseLevel}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          animationsEnabled={animationsEnabled}
          onToggleAnimations={handleToggleAnimations}
          onChangeLevel={handleChangeLevel}
          onTriggerXCard={handleTriggerXCard}
          onTriggerAmber={handleTriggerAmber}
          onNavigate={setGameState}
          onStartSessionZero={() => openSessionZero()}
          onResetToMenu={() => setGameState('TITLE_MENU')}
          amberWord={consent.amberWord}
          xCardWord={consent.xCardWord}
        />

        {/* Subtle Amber Notice Banner */}
        {amberNotice && (
          <div className="max-w-5xl mx-auto px-4 pt-3 w-full">
            <div className="rounded-lg border border-[#c59b4e]/60 bg-[#c59b4e]/15 px-4 py-2.5 text-xs text-[#e5be6e] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{amberNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setAmberNotice(null)}
                className="text-[#ece3d5] hover:underline shrink-0"
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        {/* ==================== 1. TITLE MENU / LANDING ==================== */}
        {gameState === 'TITLE_MENU' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-14 flex-1">
            {/* Illustrated Hero Stage */}
            <section className="relative rounded-2xl overflow-hidden border border-[#c59b4e]/35 bg-[#0e0b13] shadow-2xl">
              <img
                src={ARTWORK_PATHS.heroConservatory}
                alt="Invernadero gótico iluminado por faroles de latón y rosas oscuras"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-55"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-[#09080c] via-[#09080c]/85 to-[#09080c]/45"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#09080c] via-transparent to-[#09080c]/40"
              />

              <div className="relative z-10 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="text-xs uppercase tracking-[0.2em] text-[#e5be6e] font-semibold">
                    Módulo Interactivo · Call of Cthulhu 7.ª / BRP D100
                  </div>
                  <h1 className="font-serif-display text-4xl sm:text-6xl font-semibold text-[#ece3d5] leading-[1.06] tracking-tight text-balance">
                    Lo que el cuerpo acepta antes de que la mente despierte.
                  </h1>
                  <p className="text-base sm:text-lg text-[#d6cbb9] leading-relaxed max-w-2xl">
                    Un juego de horror erótico-cósmico fiel al manual completo{' '}
                    <em className="text-[#ece3d5]">Pecados de la Carne</em>: doble barra de{' '}
                    <strong className="text-[#6ad1cc]">Cordura</strong> e{' '}
                    <strong className="text-[#e07a8a]">Inhibición</strong>,{' '}
                    <strong className="text-[#e5be6e]">Combate Íntimo D100</strong>, 8
                    entidades ilustradas, 8 investigadores con su Grieta Personal y{' '}
                    <strong className="text-[#6ad1cc]">Mesa Segura</strong> integrada en
                    todo momento.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => openSessionZero()}
                      className="px-6 py-3 rounded-lg bg-[#9e1b32] hover:bg-[#b5223d] text-[#ece3d5] font-semibold text-sm sm:text-base flex items-center gap-2 border border-[#d43750]/50 shadow-xl transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-[#e5be6e]" />
                      <span>Comenzar Sesión Cero</span>
                    </button>

                    {hasSavedGame && (
                      <button
                        type="button"
                        onClick={handleResumeSaved}
                        className="px-5 py-3 rounded-lg bg-[#2e7d7b]/30 hover:bg-[#2e7d7b]/45 border border-[#6ad1cc]/50 text-[#ece3d5] font-medium text-sm sm:text-base flex items-center gap-2 transition-colors backdrop-blur-sm"
                      >
                        <Compass className="w-4 h-4 text-[#6ad1cc]" />
                        <span>Continuar crónica</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setGameState('COMPENDIUM')}
                      className="px-5 py-3 rounded-lg bg-[#09080c]/75 hover:bg-[#1a1523] border border-[rgba(216,198,174,0.28)] text-[#ece3d5] font-medium text-sm sm:text-base flex items-center gap-2 transition-colors backdrop-blur-sm"
                    >
                      <BookOpen className="w-4 h-4 text-[#c59b4e]" />
                      <span>Bestiario y Tablas</span>
                    </button>
                  </div>

                  {/* System Pillars */}
                  <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#b5a998]">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#6ad1cc]" />
                      Velo estricto / Sensual · Tarjeta X (tecla X)
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1.5">
                      <Dices className="w-3.5 h-3.5 text-[#c59b4e]" />
                      Motor D100 enfrentado · Tablas A–E
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1.5">
                      <Swords className="w-3.5 h-3.5 text-[#e07a8a]" />
                      3 arcos jugables + Guardián y Oráculo IA
                    </span>
                  </div>
                </div>

                {/* Showcase Tarot Trio */}
                <div className="lg:col-span-5 grid grid-cols-3 gap-3">
                  {(['ninfa', 'confidente', 'doblada'] as const).map((key, idx) => (
                    <div
                      key={key}
                      className={`rounded-xl overflow-hidden border border-[#c59b4e]/55 bg-[#120f17] shadow-2xl transition-transform duration-300 hover:-translate-y-1.5 ${
                        idx === 1 ? 'translate-y-4' : idx === 0 ? '-rotate-1' : 'rotate-1'
                      }`}
                    >
                      <div className="aspect-[3/4]">
                        <EntityArtwork artworkKey={key} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 3 Playable Campaigns */}
            <section className="space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-2 border-b border-[rgba(216,198,174,0.14)] pb-3">
                <div>
                  <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#ece3d5]">
                    Arcos Narrativos Jugables
                  </h2>
                  <p className="text-sm text-[#b5a998]">
                    Inicia un escenario revisando el pacto de Velo en un clic o
                    configura tu mesa en Sesión Cero.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {STORY_ARCS.map((arc) => (
                  <div
                    key={arc.id}
                    className="group rounded-xl border border-[rgba(216,198,174,0.18)] bg-[#120f17]/95 overflow-hidden flex flex-col hover:border-[#c59b4e]/65 transition-all shadow-lg"
                  >
                    <div className="h-60 overflow-hidden border-b border-[rgba(216,198,174,0.12)] bg-[#09080c]">
                      <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                        <EntityArtwork artworkKey={arc.artworkKey} />
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-[#c59b4e]">
                          {arc.sourceSection}
                        </div>
                        <h3 className="font-serif-display text-2xl font-semibold text-[#ece3d5] mt-1">
                          {arc.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#b5a998] mt-2 leading-relaxed">
                          {arc.synopsis}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[rgba(216,198,174,0.1)]">
                        <span className="text-xs text-[#6ad1cc]">
                          {arc.recommendedLevel}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleRequestQuickStart(INVESTIGATORS[0], arc)
                          }
                          className="px-3.5 py-2 rounded-lg bg-[#9e1b32] hover:bg-[#b5223d] text-[#ece3d5] text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                        >
                          <span>Jugar ahora</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 8 Investigators Strip */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-[rgba(216,198,174,0.14)] pb-3">
                <h2 className="font-serif-display text-2xl font-semibold text-[#ece3d5]">
                  Los Ocho Investigadores Canónicos
                </h2>
                <button
                  type="button"
                  onClick={() => openSessionZero()}
                  className="text-xs text-[#e5be6e] hover:underline"
                >
                  Personalizar en Sesión Cero →
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {INVESTIGATORS.map((inv) => (
                  <button
                    key={inv.id}
                    type="button"
                    onClick={() =>
                      handleRequestQuickStart(inv, STORY_ARCS[0])
                    }
                    className="p-3 rounded-xl border border-[rgba(216,198,174,0.12)] bg-[#120f17]/85 hover:border-[#c59b4e]/60 text-center transition-all group"
                  >
                    <div className="w-full aspect-square mb-2.5 overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-[1.03]">
                      <InvestigatorCrest
                        portraitKey={inv.portraitKey}
                        name={inv.name}
                      />
                    </div>
                    <div className="font-serif-display text-base font-semibold text-[#ece3d5] group-hover:text-[#e5be6e]">
                      {inv.name}
                    </div>
                    <div className="text-[11px] text-[#9b8f82] font-mono-tabular">
                      INH {inv.initialInh} · AC {inv.ac}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </main>
        )}

        {/* ==================== 2. SESSION ZERO ==================== */}
        {gameState === 'SESSION_ZERO' && (
          <SessionZeroModal
            initialConsent={consent}
            initialInvestigatorId={
              sessionZeroSeeds?.investigatorId || investigator.id
            }
            initialArcId={sessionZeroSeeds?.arcId || currentArcId}
            onConfirm={handleConfirmSessionZero}
            onCancel={() => setGameState('TITLE_MENU')}
          />
        )}

        {/* ==================== 3. COMPENDIUM / BESTIARY ==================== */}
        {gameState === 'COMPENDIUM' && (
          <CompendiumView
            onStartFreeCombat={handleStartFreeCombat}
            onStartSessionZero={() => openSessionZero()}
          />
        )}

        {/* ==================== 4. ACTIVE GAMEPLAY & COMBAT WORKBENCH ==================== */}
        {(gameState === 'PLAYING' || gameState === 'COMBAT_INTIMO') && (
          <main className="max-w-[1440px] mx-auto w-full px-3 sm:px-5 py-5 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Character Sheet */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <CharacterSheet
                investigator={investigator}
                useEndurecimiento={consent.useEndurecimiento}
                onRollSkill={handleManualSkillRoll}
                onUseLazo={handleUseLazo}
                onRecover={handleRecover}
              />
            </div>

            {/* Center Column: Dice Tray + Narrative Stage OR Intimate Combat Arena */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
              <DiceRoller
                lastRoll={lastRoll}
                rolling={isRolling}
                difficulty={sheetDifficulty}
                bonusPenalty={sheetBonusPenalty}
                onChangeDifficulty={setSheetDifficulty}
                onChangeBonusPenalty={setSheetBonusPenalty}
                onQuickRoll={handleQuickPolyRoll}
                quickPolyNote={quickPolyNote}
              />

              {gameState === 'COMBAT_INTIMO' && combatEntity ? (
                <IntimateCombatView
                  investigator={investigator}
                  entity={combatEntity}
                  narrativeLevel={narrativeLevel}
                  acceptDrenaje={consent.acceptDrenaje}
                  acceptArrebato={consent.acceptArrebato}
                  initialSnapshot={activeCombatSnapshot}
                  onSnapshotChange={setActiveCombatSnapshot}
                  onUpdateInvestigator={setInvestigator}
                  onRollRecorded={triggerRollAnim}
                  onLog={(type, title, detail) =>
                    appendChronicle(type, title, detail)
                  }
                  onTriggerThresholdModal={(title, lines, reachedZero) =>
                    setThresholdModal({ title, lines, reachedZero })
                  }
                  onCombatComplete={handleCombatComplete}
                  onTriggerXCard={handleTriggerXCard}
                />
              ) : (
                <article className="bg-[#120f17]/95 border border-[rgba(216,198,174,0.18)] rounded-xl overflow-hidden shadow-2xl">
                  {/* Tabletop Campaign Act Strip & Physical Handout Toggle */}
                  {(() => {
                    const { steps, activeIndex } = getArcProgressSteps(
                      currentArc.id,
                      currentNode.actLabel,
                      currentNode.isEnding
                    );
                    const handout = ARC_HANDOUTS[currentArc.id];
                    return (
                      <div className="bg-[#09080c] border-b border-[rgba(216,198,174,0.12)] px-4 py-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono-tabular">
                            {steps.map((step, idx) => (
                              <React.Fragment key={step}>
                                {idx > 0 && (
                                  <span
                                    aria-hidden="true"
                                    className="text-[#5a5047]"
                                  >
                                    —
                                  </span>
                                )}
                                <span
                                  className={
                                    idx === activeIndex
                                      ? 'text-[#e5be6e] font-semibold underline decoration-[#c59b4e]/60 underline-offset-4'
                                      : idx < activeIndex
                                        ? 'text-[#6ad1cc]'
                                        : 'text-[#9b8f82]'
                                  }
                                >
                                  {step}
                                </span>
                              </React.Fragment>
                            ))}
                          </div>

                          {handout && (
                            <button
                              type="button"
                              onClick={() => setHandoutOpen((o) => !o)}
                              className={`px-2.5 py-1 rounded border text-[11px] font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                                handoutOpen
                                  ? 'border-[#c59b4e] bg-[#c59b4e]/15 text-[#e5be6e]'
                                  : 'border-[rgba(216,198,174,0.18)] bg-[#14111a] text-[#d6cbb9] hover:border-[#c59b4e]/60'
                              }`}
                            >
                              <ScrollText className="w-3.5 h-3.5 text-[#c59b4e]" />
                              <span>
                                {handoutOpen
                                  ? 'Ocultar evidencia'
                                  : 'Evidencia de escena'}
                              </span>
                            </button>
                          )}
                        </div>

                        {handoutOpen && handout && (
                          <div className="mt-3 p-4 rounded-lg border border-[#c59b4e]/45 bg-gradient-to-br from-[#1d1713] to-[#120f17] space-y-2 shadow-inner">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c59b4e]/25 pb-1.5">
                              <span className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#e5be6e]">
                                {handout.code}
                              </span>
                              <span className="text-[11px] text-[#b5a998] italic">
                                {handout.material}
                              </span>
                            </div>
                            <div className="font-serif-display text-lg font-semibold text-[#ece3d5]">
                              {handout.title}
                            </div>
                            <p className="text-xs sm:text-sm text-[#e0d6c6] leading-relaxed italic">
                              {handout.excerpt}
                            </p>
                            <div className="text-[11px] text-[#6ad1cc] pt-1">
                              {handout.keeperNote}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Illustrated Atmospheric Scene Header */}
                  {(() => {
                    const backdrop = getAmbientBackdrop(currentNode.ambientTag);
                    return (
                      <div className="relative min-h-[168px] p-5 sm:p-6 border-b border-[rgba(216,198,174,0.14)] overflow-hidden flex flex-col sm:flex-row gap-5 items-start sm:items-end">
                        <img
                          src={backdrop.imageSrc}
                          alt={backdrop.label}
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
                        />
                        <div
                          aria-hidden="true"
                          className={`absolute inset-0 bg-gradient-to-t ${backdrop.scrimClass}`}
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-r from-[#09080c]/90 via-[#09080c]/60 to-transparent"
                        />
                        <SceneAmbience
                          tag={currentNode.ambientTag}
                          mode={ambienceMode}
                          heartbeat={heartbeat}
                        />

                        {currentNode.entityArtwork && (
                          <div className="relative z-10 w-24 sm:w-28 aspect-[3/4] shrink-0 rounded-lg overflow-hidden border border-[#c59b4e]/60 shadow-2xl">
                            <EntityArtwork artworkKey={currentNode.entityArtwork} compact />
                          </div>
                        )}
                        <div className="relative z-10 space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-widest text-[#e5be6e] font-semibold">
                            <span>{currentArc.title}</span>
                            <span aria-hidden="true">·</span>
                            <span>{currentNode.actLabel}</span>
                          </div>
                          <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#ece3d5] leading-tight">
                            {currentNode.title}
                          </h1>
                          <div className="text-xs text-[#d6cbb9] flex flex-wrap items-center gap-2">
                            <span>{currentNode.location}</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#6ad1cc]">
                              {NARRATIVE_LEVEL_LABELS[narrativeLevel]}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Narrative Prose */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <RevealParagraphs
                      scope={`${currentNode.id}-${narrativeLevel}`}
                      mode={ambienceMode}
                      className="text-base sm:text-[17px] leading-[1.72] text-[#ece3d5]/95"
                      paragraphs={pickNodeText(currentNode, narrativeLevel).map(
                        (paragraph) => filterByHardLimits(paragraph, consent.hardLimits).text,
                      )}
                    />

                    {currentNode.guardianWhisper && (
                      <div className="p-3.5 rounded-lg bg-[#09080c]/85 border border-[#c59b4e]/35 text-xs text-[#c59b4e] leading-relaxed">
                        {currentNode.guardianWhisper}
                      </div>
                    )}

                    {/* Pending Outcome Transition Panel */}
                    {pendingOutcome ? (
                      <div className="mt-4 p-4 sm:p-5 rounded-xl border border-[#c59b4e]/55 bg-[#1b1523] space-y-4">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#e5be6e]">
                          {pendingOutcome.succeeded === true ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-[#8ec49e]" />
                              <span>Resultado de la acción</span>
                            </>
                          ) : pendingOutcome.succeeded === false ? (
                            <>
                              <Flame className="w-4 h-4 text-[#e07a8a]" />
                              <span>Consecuencia de la escena</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-[#e5be6e]" />
                              <span>Resolución</span>
                            </>
                          )}
                        </div>
                        <div className="space-y-3">
                          <RevealParagraphs
                            scope={`out-${pendingOutcome.nextNodeId}-${pendingOutcome.text.length}`}
                            mode={ambienceMode}
                            className="text-sm sm:text-base text-[#ece3d5] leading-relaxed"
                            paragraphs={pendingOutcome.text.split('\n\n')}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleProceedPendingOutcome}
                          className="px-5 py-2.5 rounded-lg bg-[#9e1b32] hover:bg-[#b5223d] text-[#ece3d5] text-sm font-semibold inline-flex items-center gap-2 transition-colors"
                        >
                          <span>
                            {pendingOutcome.triggerCombatEntityId
                              ? 'Entrar en Combate Íntimo'
                              : 'Continuar'}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : currentNode.isEnding ? (
                      /* Ending & Section 1.5 Aftercare Screen */
                      <div className="mt-4 p-5 rounded-xl border border-[#2e7d7b]/60 bg-[#2e7d7b]/12 space-y-4">
                        <div className="flex items-center gap-2 text-[#6ad1cc] font-semibold text-sm">
                          <HeartHandshake className="w-5 h-5" />
                          <span>Cierre de Arco y Aftercare (Sección 1.5)</span>
                        </div>
                        {currentNode.endingSummary && (
                          <p className="text-sm sm:text-base text-[#ece3d5] leading-relaxed">
                            {currentNode.endingSummary}
                          </p>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono-tabular text-xs pt-1">
                          <div className="p-2.5 rounded bg-[#09080c] border border-[rgba(216,198,174,0.14)]">
                            <div className="text-[10px] text-[#9b8f82]">
                              Cordura final
                            </div>
                            <div className="text-[#6ad1cc] font-semibold">
                              {investigator.cor}/{investigator.maxCor}
                            </div>
                          </div>
                          <div className="p-2.5 rounded bg-[#09080c] border border-[rgba(216,198,174,0.14)]">
                            <div className="text-[10px] text-[#9b8f82]">
                              Inhibición final
                            </div>
                            <div className="text-[#e07a8a] font-semibold">
                              {investigator.inh}/{investigator.initialInh}
                            </div>
                          </div>
                          <div className="p-2.5 rounded bg-[#09080c] border border-[rgba(216,198,174,0.14)]">
                            <div className="text-[10px] text-[#9b8f82]">
                              Filias activas
                            </div>
                            <div className="text-[#e5be6e] font-semibold">
                              {investigator.filias.length}
                            </div>
                          </div>
                          <div className="p-2.5 rounded bg-[#09080c] border border-[rgba(216,198,174,0.14)]">
                            <div className="text-[10px] text-[#9b8f82]">
                              Marcas
                            </div>
                            <div className="text-[#ece3d5] font-semibold">
                              {investigator.marcas.length}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-[#b5a998] italic">
                          Preferencia de cierre pactada: {consent.aftercarePreference}
                        </p>
                        <div className="flex flex-wrap gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => openSessionZero()}
                            className="px-5 py-2.5 rounded-lg bg-[#9e1b32] hover:bg-[#b5223d] text-[#ece3d5] text-sm font-semibold inline-flex items-center gap-2"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Jugar otro arco</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setGameState('TITLE_MENU')}
                            className="px-4 py-2.5 rounded-lg border border-[rgba(216,198,174,0.2)] text-sm text-[#ece3d5] hover:border-[#c59b4e]"
                          >
                            Volver al inicio
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Interactive Choices */
                      <div className="pt-3 border-t border-[rgba(216,198,174,0.12)] space-y-2.5">
                        <div className="text-[11px] uppercase tracking-wider text-[#9b8f82]">
                          ¿Qué decides hacer?
                        </div>
                        {currentNode.choices.map((choice) => {
                          const disabled =
                            choice.costsPm !== undefined &&
                            investigator.pm < choice.costsPm;
                          const skillTarget = choice.skillCheck
                            ? getSkillValue(choice.skillCheck.skill)
                            : null;
                          return (
                            <button
                              key={choice.id}
                              type="button"
                              disabled={disabled}
                              onClick={() => handleSelectChoice(choice)}
                              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center justify-between gap-3 group ${
                                disabled
                                  ? 'opacity-40 cursor-not-allowed border-[rgba(216,198,174,0.1)] bg-[#09080c]'
                                  : 'border-[rgba(216,198,174,0.16)] bg-[#09080c]/85 hover:bg-[#1a1422] hover:border-[#c59b4e]/70'
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="text-sm sm:text-base font-medium text-[#ece3d5] group-hover:text-[#e5be6e] transition-colors">
                                  {choice.label}
                                </div>
                                {choice.sublabel && (
                                  <div className="text-xs text-[#b5a998] mt-0.5">
                                    {choice.sublabel}
                                  </div>
                                )}
                              </div>

                              <div className="shrink-0 flex items-center gap-2">
                                {choice.skillCheck && skillTarget !== null && (
                                  <span className="font-mono-tabular text-xs text-[#c59b4e] bg-[#14111a] border border-[#c59b4e]/35 px-2 py-1 rounded whitespace-nowrap">
                                    {skillTarget}% · {choice.skillCheck.difficulty}
                                  </span>
                                )}
                                <ArrowRight className="w-4 h-4 text-[#9b8f82] group-hover:text-[#e5be6e] transition-colors" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </article>
              )}
            </div>

            {/* Right Column: Chronicle, Diario & Oracle */}
            <div className="lg:col-span-3 order-3">
              <GuardianDrawer
                investigator={investigator}
                chronicle={chronicle}
                flags={flags}
                narrativeLevel={narrativeLevel}
                hardLimits={consent.hardLimits}
                onSaveDiario={handleSaveDiario}
                onCastSpell={handleCastSpell}
                onUseRelic={handleUseRelic}
                onLog={appendChronicle}
                onExportSession={handleExportSession}
                onImportSession={handleImportSession}
              />
            </div>
          </main>
        )}
      </div>

      {/* ==================== 18+ CONTENT GATE MODAL ==================== */}
      {!ageConfirmed && (
        <div
          className="fixed inset-0 z-50 bg-[#09080c]/95 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-gate-title"
        >
          <div className="max-w-lg w-full rounded-2xl border border-[#c59b4e]/60 bg-[#120f17] p-6 sm:p-7 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-[#9e1b32]/25 border border-[#d43750]/50 flex items-center justify-center text-[#ff8fa0]">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2
                  id="age-gate-title"
                  className="font-serif-display text-2xl font-semibold text-[#ece3d5]"
                >
                  Aviso de Contenido Adulto (+18)
                </h2>
                <p className="text-xs text-[#e5be6e]">
                  Pecados de la Carne · Suplemento de Horror Cósmico
                </p>
              </div>
            </div>
            <p className="text-sm text-[#d6cbb9] leading-relaxed">
              Esta aplicación interactiva adapta mecánicas de horror psicológico,
              tensión erótico-cósmica y corrupción mental sobre el sistema BRP D100.
              Por defecto opera bajo <strong className="text-[#ece3d5]">Nivel 0 (Velo estricto)</strong>{' '}
              con <strong className="text-[#6ad1cc]">Tarjeta X (tecla X)</strong>,{' '}
              <strong className="text-[#e5be6e]">Palabra Ámbar</strong> y un{' '}
              <strong className="text-[#ece3d5]">veto universal permanente contra cualquier implicación de menores (Sección 1.3.1)</strong>.
            </p>
            <div className="p-3 rounded-lg bg-[#09080c] border border-[rgba(216,198,174,0.14)] text-xs text-[#b5a998] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#6ad1cc] shrink-0" />
              <span>
                Contenido de ficción destinado exclusivamente a personas mayores de 18 años.
              </span>
            </div>
            <button
              type="button"
              onClick={handleConfirmAgeGate}
              className="w-full py-3 rounded-lg bg-[#9e1b32] hover:bg-[#b5223d] text-[#ece3d5] font-semibold text-sm transition-colors"
            >
              Confirmo que soy mayor de 18 años y entrar a la mesa
            </button>
          </div>
        </div>
      )}

      {/* ==================== QUICK-START CONSENT SUMMARY MODAL ==================== */}
      {quickStartPending && (
        <div
          className="fixed inset-0 z-50 bg-[#09080c]/85 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quickstart-consent-title"
        >
          <div className="max-w-lg w-full rounded-2xl border border-[#2e7d7b]/65 bg-[#120f17] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2e7d7b]/25 border border-[#6ad1cc]/50 flex items-center justify-center text-[#6ad1cc]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2
                  id="quickstart-consent-title"
                  className="font-serif-display text-2xl font-semibold text-[#ece3d5]"
                >
                  Resumen de Consentimiento (Inicio Rápido)
                </h2>
                <p className="text-xs text-[#6ad1cc]">
                  {quickStartPending.arc.title} · {quickStartPending.inv.name}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-[#d6cbb9] bg-[#09080c] border border-[rgba(216,198,174,0.14)] rounded-xl p-4">
              <div>
                <strong className="text-[#ece3d5]">Escala inicial:</strong>{' '}
                Nivel {DEFAULT_CONSENT.baseLevel} (Velo estricto — elipsis elegante)
              </div>
              <div>
                <strong className="text-[#ece3d5]">Seguridad en vivo:</strong>{' '}
                Palabra «{DEFAULT_CONSENT.amberWord}» y Tarjeta X (tecla X) activas en todo momento
              </div>
              <div>
                <strong className="text-[#ece3d5]">Límites duros sellados:</strong>{' '}
                {DEFAULT_CONSENT.hardLimits.join(' · ')}
              </div>
              <div>
                <strong className="text-[#ece3d5]">Cierre / Aftercare:</strong>{' '}
                {DEFAULT_CONSENT.aftercarePreference}
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  const { inv, arc } = quickStartPending;
                  setQuickStartPending(null);
                  handleConfirmSessionZero(DEFAULT_CONSENT, inv, arc);
                }}
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#9e1b32] hover:bg-[#b5223d] text-[#ece3d5] font-semibold text-sm transition-colors whitespace-nowrap"
              >
                Aceptar pacto y empezar
              </button>
              <button
                type="button"
                onClick={() => {
                  const { inv, arc } = quickStartPending;
                  setQuickStartPending(null);
                  openSessionZero(inv.id, arc.id);
                }}
                className="py-2.5 px-4 rounded-lg border border-[rgba(216,198,174,0.25)] hover:border-[#c59b4e] text-xs text-[#ece3d5] whitespace-nowrap"
              >
                Personalizar en Sesión Cero
              </button>
              <button
                type="button"
                onClick={() => setQuickStartPending(null)}
                className="py-2.5 px-3 rounded-lg text-xs text-[#9b8f82] hover:text-[#ece3d5]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TARJETA X SAFE PAUSE MODAL ==================== */}
      {xCardOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#09080c]/85 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="xcard-title"
        >
          <div className="max-w-md w-full rounded-2xl border border-[#2e7d7b]/70 bg-[#120f17] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2e7d7b]/25 border border-[#6ad1cc]/50 flex items-center justify-center text-[#6ad1cc]">
                <EyeOff className="w-5 h-5" />
              </div>
              <div>
                <h2
                  id="xcard-title"
                  className="font-serif-display text-2xl font-semibold text-[#ece3d5]"
                >
                  Tarjeta X · Pausa Segura
                </h2>
                <p className="text-xs text-[#6ad1cc]">
                  Regla 1.3 · Sin preguntas ni penalizaciones
                </p>
              </div>
            </div>
            <p className="text-sm text-[#b5a998] leading-relaxed">
              Has detenido la escena con total legitimidad. Elige cómo quieres
              continuar en un entorno seguro:
            </p>
            <div className="space-y-2 pt-2">
              {(sceneHistory.length > 0 || gameState === 'COMBAT_INTIMO') && (
                <button
                  type="button"
                  onClick={() => handleXCardAction('REWIND')}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#2e7d7b] hover:bg-[#389592] text-[#09080c] font-semibold text-sm transition-colors"
                >
                  Rebobinar a escena anterior segura (Nivel 0 Velo)
                </button>
              )}
              <button
                type="button"
                onClick={() => handleXCardAction('VEIL')}
                className="w-full py-2.5 px-4 rounded-lg border border-[#6ad1cc]/50 bg-[#2e7d7b]/15 hover:bg-[#2e7d7b]/25 text-sm text-[#ece3d5] transition-colors"
              >
                Velar esta escena en Nivel 0 (Velo estricto)
              </button>
              <button
                type="button"
                onClick={() => handleXCardAction('SKIP')}
                className="w-full py-2.5 px-4 rounded-lg border border-[rgba(216,198,174,0.2)] text-sm text-[#ece3d5] hover:border-[#6ad1cc] transition-colors"
              >
                Omitir escena actual y avanzar bajo Velo
              </button>
              <button
                type="button"
                onClick={() => handleXCardAction('EXIT')}
                className="w-full py-2 px-4 rounded-lg text-xs text-[#9b8f82] hover:text-[#ece3d5]"
              >
                Salir de la sesión al menú
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== THRESHOLD / ARREBATO / TABLA E MODAL ==================== */}
      {thresholdModal && (
        <div
          className="fixed inset-0 z-50 bg-[#09080c]/85 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-lg w-full rounded-2xl border border-[#d43750]/60 bg-[#140f17] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-[#ff8fa0]">
              <Flame className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-semibold">
                Sección 3 · Desplazamiento de Inhibición
              </span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#ece3d5]">
              {thresholdModal.title}
            </h2>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {thresholdModal.lines.map((line, i) => (
                <p
                  key={i}
                  className="text-sm text-[#ece3d5]/90 leading-relaxed bg-[#09080c] border border-[rgba(216,198,174,0.12)] rounded-lg p-3"
                >
                  {line}
                </p>
              ))}
            </div>

            {thresholdModal.reachedZero ? (
              <div className="space-y-2.5 pt-2 border-t border-[rgba(216,198,174,0.14)]">
                <div className="text-xs text-[#e5be6e] font-semibold">
                  Ratificación y Co-escritura obligatoria (Secciones 3.5.2 y 17.7):
                </div>
                <p className="text-xs text-[#b5a998] leading-relaxed">
                  Al alcanzar INH 0, ninguna entidad controla tu agencia sin tu
                  acuerdo expreso. Elige cómo sellar el desenlace de este umbral:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTablaERatification('VELO')}
                    className="p-3 rounded-lg border border-[#6ad1cc]/45 bg-[#2e7d7b]/15 hover:bg-[#2e7d7b]/25 text-left transition-colors"
                  >
                    <div className="text-xs font-semibold text-[#6ad1cc]">
                      1. Velo estricto y pacto simbólico
                    </div>
                    <div className="text-[11px] text-[#d6cbb9] mt-0.5">
                      Cambia a Nivel 0 y preserva tu agencia mediante elipsis.
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTablaERatification('SERVIDUMBRE')}
                    className="p-3 rounded-lg border border-[#c59b4e]/45 bg-[#c59b4e]/10 hover:bg-[#c59b4e]/20 text-left transition-colors"
                  >
                    <div className="text-xs font-semibold text-[#e5be6e]">
                      2. Servidumbre ritual no sexual
                    </div>
                    <div className="text-[11px] text-[#d6cbb9] mt-0.5">
                      Sustituye la caída por una deuda ritual de vigilia.
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTablaERatification('RESISTENCIA')}
                    className="p-3 rounded-lg border border-[#d43750]/45 bg-[#9e1b32]/20 hover:bg-[#9e1b32]/30 text-left transition-colors"
                  >
                    <div className="text-xs font-semibold text-[#ff8fa0]">
                      3. Arco de resistencia (1 INH)
                    </div>
                    <div className="text-[11px] text-[#d6cbb9] mt-0.5">
                      Mantente en 1 INH para intentar cerrar el arco luchando.
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTablaERatification('RETIRADA')}
                    className="p-3 rounded-lg border border-[rgba(216,198,174,0.2)] bg-[#09080c] hover:border-[#ece3d5]/50 text-left transition-colors"
                  >
                    <div className="text-xs font-semibold text-[#ece3d5]">
                      4. Retirada digna del personaje
                    </div>
                    <div className="text-[11px] text-[#b5a998] mt-0.5">
                      Cierra la participación de este investigador con aftercare.
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setThresholdModal(null)}
                className="w-full py-2.5 rounded-lg bg-[#9e1b32] hover:bg-[#b5223d] text-[#ece3d5] font-semibold text-sm transition-colors"
              >
                Aceptar transformación y continuar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
