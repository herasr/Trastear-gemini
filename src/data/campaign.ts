// Campaña «La silla vacía» — primera campaña de Pecados de la Carne.
// Solo datos. Las escenas jugables viven en scenarios.ts; esta capa describe
// la estructura de sesiones, el reparto, las células y las salidas de
// seguridad para los flags extremos (Sección 1.3.2).

export type CampaignLevel = 0 | 1 | 2 | 3;

export interface CampaignSession {
  number: number;
  title: string;
  /** Id de un StoryArc existente en scenarios.ts, si la sesión juega una escena concreta. */
  linkedArcId?: string;
  /** Flags extremos que pueden aparecer; siempre telegrafiados la sesión anterior. */
  extremeFlags?: ExtremeFlag[];
}

export type ExtremeFlag =
  | 'fusion'
  | 'mortalidad-intima'
  | 'cria'
  | 'mutacion'
  | 'snuff-ritual';

export interface CampaignArc {
  id: string;
  title: string;
  sessions: [number, number];
  maxLevel: CampaignLevel;
  theme: string;
  /** Arco de STORY_ARCS que sirve de escenario principal, si lo hay. */
  primaryArcId?: string;
  /** Ritmo orientativo de Inhibición por personaje (Apéndice K). */
  inhLoss: [number, number];
}

export interface CampaignCast {
  name: string;
  role: string;
  /** Referencia a la sección del módulo donde está la ficha de juego. */
  ref: string;
}

export interface CampaignCell {
  name: string;
  seat: string;
  entity: string;
  leader: string;
  offers: string;
  fallsAt: number; // número de sesión
}

export interface ExtremeFlagRule {
  flag: ExtremeFlag;
  label: string;
  where: string;
  /** Qué se hace si un participante lo veta. */
  ifVetoed: string;
}

export interface CampaignDefinition {
  id: string;
  title: string;
  subtitle: string;
  adultsOnly: true;
  system: string;
  sessionCount: number;
  arcs: CampaignArc[];
  sessions: CampaignSession[];
  cast: CampaignCast[];
  cells: CampaignCell[];
  extremeRules: ExtremeFlagRule[];
  /** Mínimo de jugadores con vínculo real hacia Candela Ortuño. */
  minPlayersWithCandelaBond: number;
}

export const CAMPAIGN_LA_SILLA_VACIA: CampaignDefinition = {
  id: 'la-silla-vacia',
  title: 'La silla vacía',
  subtitle: 'Primera campaña · Pecados de la Carne',
  adultsOnly: true,
  system: 'BRP D100 / Call of Cthulhu 7.ª',
  sessionCount: 12,

  arcs: [
    {
      id: 'arco-consuelo',
      title: 'I · El consuelo',
      sessions: [1, 4],
      maxLevel: 1,
      theme: 'Paranoia, secretos urbanos y consuelo venenoso.',
      primaryArcId: 'umbrales-deseo',
      inhLoss: [6, 12],
    },
    {
      id: 'arco-carne-florece',
      title: 'II · La carne florece',
      sessions: [5, 8],
      maxLevel: 2,
      theme: 'Aislamiento, mutaciones y ritos rurales.',
      primaryArcId: 'vigilia-zarza',
      inhLoss: [12, 20],
    },
    {
      id: 'arco-entrega',
      title: 'III · La entrega',
      sessions: [9, 12],
      maxLevel: 3,
      theme: 'Tragedia de campaña y desenlaces irreversibles.',
      primaryArcId: 'doble-vigilia',
      inhLoss: [15, 25],
    },
  ],

  sessions: [
    { number: 1, title: 'Sesión Cero y primera invitación', linkedArcId: 'umbrales-deseo' },
    { number: 2, title: 'La mesa de la Escucha', linkedArcId: 'umbrales-deseo' },
    { number: 3, title: 'Lo que Candela no cuenta' },
    { number: 4, title: 'La cena de los Silleros' },
    { number: 5, title: 'La verja de la finca Herrera', linkedArcId: 'vigilia-zarza' },
    { number: 6, title: 'La víspera', linkedArcId: 'vigilia-zarza' },
    { number: 7, title: 'La Vigilia de la Zarza', linkedArcId: 'vigilia-zarza' },
    { number: 8, title: 'El Cárcavo y el Salto' },
    { number: 9, title: 'La cripta de la calle de los Silleros', linkedArcId: 'doble-vigilia' },
    { number: 10, title: 'Valdetrigo y la cosecha', extremeFlags: ['cria'] },
    { number: 11, title: 'La Doble Vigilia', linkedArcId: 'doble-vigilia', extremeFlags: ['fusion', 'mortalidad-intima'] },
    { number: 12, title: 'Desgarro, fuego o silla', linkedArcId: 'doble-vigilia', extremeFlags: ['fusion', 'mortalidad-intima'] },
  ],

  cast: [
    {
      name: 'El Amigo',
      role: 'Falso Confidente que opera el Círculo; cambia de rostro, conserva las manos.',
      ref: 'Sección 6.2',
    },
    {
      name: 'Candela Ortuño',
      role: 'Enfermera, cebo de la campaña. Empieza con POD 55 y pierde entre 10 y 15 por escena de consuelo.',
      ref: 'Sección 1.6.1 y 6.2',
    },
    {
      name: 'Remedios Lledó',
      role: 'Madre del Círculo. Inhibición 0 desde hace décadas; nunca miente.',
      ref: 'Sección 9.2',
    },
    {
      name: 'Ramiro Ibáñez',
      role: 'Confesor laico que preside la Mesa de la Escucha. Se puede salvar a tiempo.',
      ref: 'Sección 9.2',
    },
    {
      name: 'Anselmo Sierra',
      role: 'Jardinero de la finca Herrera; oficia la vigilia de la Zarza.',
      ref: 'Sección 11',
    },
    {
      name: 'Amalia Vidal',
      role: 'Viuda elegida el año pasado, con Filia de la Zarza activa.',
      ref: 'Sección 11',
    },
    {
      name: 'Telmo Quiroga',
      role: 'Antiguo párroco convertido en Sacerdote del Velo; preside la célula de los Silleros.',
      ref: 'Sección 6.6',
    },
    {
      name: 'Gaspar Mena',
      role: 'Presidente de la Comunidad de Regantes; embajador humano de la Señora.',
      ref: 'Sección 6.5',
    },
  ],

  cells: [
    {
      name: 'Los Silleros',
      seat: 'Calle de los Silleros, 13',
      entity: 'Congregación Doblada',
      leader: 'Telmo Quiroga',
      offers: 'Pertenencia total',
      fallsAt: 9,
    },
    {
      name: 'La Zarza',
      seat: 'Finca Herrera',
      entity: 'Ninfa de la Zarza Negra',
      leader: 'Anselmo Sierra',
      offers: 'Ser elegido',
      fallsAt: 7,
    },
    {
      name: 'La Fosa',
      seat: 'El Cárcavo',
      entity: 'Vástago de la Fosa',
      leader: 'Matías el Pocero',
      offers: 'Una vida distinta, de verdad distinta',
      fallsAt: 8,
    },
    {
      name: 'Las Aguas',
      seat: 'El Salto',
      entity: 'Señora de las Aguas Dulces',
      leader: 'Gaspar Mena',
      offers: 'Un matrimonio con la corriente',
      fallsAt: 8,
    },
    {
      name: 'Los Mayores',
      seat: 'Valdetrigo',
      entity: 'Cabra de las Dos Sangres',
      leader: 'Los ancianos del pueblo',
      offers: 'Cosecha, salud y fertilidad',
      fallsAt: 10,
    },
  ],

  extremeRules: [
    {
      flag: 'fusion',
      label: 'Fusión / absorción',
      where: 'Sesiones 11-12, Congregación Doblada (5.5.3)',
      ifVetoed: 'Sumisión Total (3.4B) con retirada del personaje; sin escena explícita.',
    },
    {
      flag: 'mortalidad-intima',
      label: 'Mortalidad íntima',
      where: 'Sesión 12, opcional',
      ifVetoed: 'El clímax se resuelve en AC 0 sin riesgo de muerte y con velo.',
    },
    {
      flag: 'cria',
      label: 'Cría / incubación',
      where: 'Sesión 10, solo la Cabra de las Dos Sangres',
      ifVetoed: 'La bendición de la cosecha se concede sin siembra, o la escena se elimina.',
    },
    {
      flag: 'mutacion',
      label: 'Mutación permanente',
      where: 'Solo si la mesa firma el flag: conversión a Profundo en el Arco III (6.3). Las siembras de nivel 2 no son flag.',
      ifVetoed: 'Marca visible y filia menor de la Fosa, sin cambios de APA ni conversión.',
    },
    {
      flag: 'snuff-ritual',
      label: 'Snuff ritual narrado',
      where: 'No prevista',
      ifVetoed: 'No se juega.',
    },
  ],

  minPlayersWithCandelaBond: 2,
};
