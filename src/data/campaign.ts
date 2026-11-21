// Campaña «La silla vacía». Solo datos. Las escenas jugables viven en scenarios.ts.
// Los campos de prosa describen la historia; los campos de datos la estructuran.

export type CampaignLevel = 0 | 1 | 2 | 3;

export interface CampaignSession {
  number: number;
  title: string;
  /** Id de un StoryArc existente en scenarios.ts, si la sesión sigue una escena concreta. */
  linkedArcId?: string;
  /** Temas extremos que pueden aparecer; siempre se anuncian la sesión anterior. */
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
  /** Ritmo orientativo de desgaste por personaje (dato de estructura, no de texto). */
  pacing: [number, number];
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
  /** Mínimo de jugadores con un vínculo real hacia Candela Ortuño. */
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
      theme: 'Un pueblo que se cuida con demasiado cariño, y una mujer que acepta cada favor como si fuera el último.',
      primaryArcId: 'umbrales-deseo',
      pacing: [6, 12],
    },
    {
      id: 'arco-carne-florece',
      title: 'II · La carne florece',
      sessions: [5, 8],
      maxLevel: 2,
      theme: 'Un invernadero que lleva trece años cerrado, un jardinero que sonríe demasiado y un río que espera.',
      primaryArcId: 'vigilia-zarza',
      pacing: [12, 20],
    },
    {
      id: 'arco-entrega',
      title: 'III · La entrega',
      sessions: [9, 12],
      maxLevel: 3,
      theme: 'Una casa de barrio con una cripta debajo, una puerta que ya sabe el nombre de todos y una decisión que no admite prórroga.',
      primaryArcId: 'doble-vigilia',
      pacing: [15, 25],
    },
  ],

  sessions: [
    { number: 1, title: 'Una carta sin remitente', linkedArcId: 'umbrales-deseo' },
    { number: 2, title: 'Los martes de la Escucha', linkedArcId: 'umbrales-deseo' },
    { number: 3, title: 'Lo que Candela no cuenta' },
    { number: 4, title: 'La cena de los Silleros' },
    { number: 5, title: 'La verja de la finca Herrera', linkedArcId: 'vigilia-zarza' },
    { number: 6, title: 'La víspera', linkedArcId: 'vigilia-zarza' },
    { number: 7, title: 'La vigilia de la Zarza', linkedArcId: 'vigilia-zarza' },
    { number: 8, title: 'El Cárcavo y el Salto' },
    { number: 9, title: 'La cripta de la calle de los Silleros', linkedArcId: 'doble-vigilia' },
    { number: 10, title: 'Valdetrigo y la cosecha', extremeFlags: ['cria'] },
    { number: 11, title: 'La doble vigilia', linkedArcId: 'doble-vigilia', extremeFlags: ['fusion', 'mortalidad-intima'] },
    { number: 12, title: 'Desgarro, fuego o silla', linkedArcId: 'doble-vigilia', extremeFlags: ['fusion', 'mortalidad-intima'] },
  ],

  cast: [
    {
      name: 'El Amigo',
      role: 'Un hombre amable que cambia de rostro cada vez que se sienta a tu mesa, pero siempre tiene las mismas manos largas y tibias.',
      ref: 'Sección 6.2',
    },
    {
      name: 'Candela Ortuño',
      role: 'Enfermera de treinta y ocho años que llegó a Valderribera tras una ruptura y se quedó en la Mesa de la Escucha. Es la persona a la que todos quieren encontrar.',
      ref: 'Secciones 1.6.1 y 6.2',
    },
    {
      name: 'Remedios Lledó',
      role: 'Viuda de ochenta y un años que invita a cenar a quien está solo. Sonríe, escucha y nunca miente.',
      ref: 'Sección 9.2',
    },
    {
      name: 'Ramiro Ibáñez',
      role: 'Psicólogo jubilado que preside la Mesa de la Escucha. Dice lo que cada uno necesita oír, y todavía se le puede convencer de lo contrario.',
      ref: 'Sección 9.2',
    },
    {
      name: 'Anselmo Sierra',
      role: 'Jardinero de la finca Herrera, con una cicatriz de espina en la palma que, según él, no le molesta.',
      ref: 'Sección 11',
    },
    {
      name: 'Amalia Vidal',
      role: 'Viuda que fue elegida el año pasado y que todavía lleva en el ojal una flor que no se marchita.',
      ref: 'Sección 11',
    },
    {
      name: 'Telmo Quiroga',
      role: 'Antiguo párroco de San Millán. Ya no reza, pero su voz sigue sabiendo qué quieres escuchar.',
      ref: 'Sección 6.6',
    },
    {
      name: 'Gaspar Mena',
      role: 'Presidente de la Comunidad de Regantes. Habla del agua con la paciencia de quien ha decidido no tener prisa.',
      ref: 'Sección 6.5',
    },
  ],

  cells: [
    {
      name: 'Los Silleros',
      seat: 'Calle de los Silleros, 13',
      entity: 'La congregación dormida en la cripta',
      leader: 'Telmo Quiroga',
      offers: 'Un lugar entre los que nunca vuelven a estar solos',
      fallsAt: 9,
    },
    {
      name: 'La Zarza',
      seat: 'Finca Herrera',
      entity: 'La Ninfa de la Zarza Negra',
      leader: 'Anselmo Sierra',
      offers: 'Ser elegido por el jardín',
      fallsAt: 7,
    },
    {
      name: 'La Fosa',
      seat: 'El Cárcavo',
      entity: 'El Vástago de la Fosa',
      leader: 'Matías el Pocero',
      offers: 'Una vida distinta, de verdad distinta',
      fallsAt: 8,
    },
    {
      name: 'Las Aguas',
      seat: 'El Salto',
      entity: 'La Señora de las Aguas Dulces',
      leader: 'Gaspar Mena',
      offers: 'Un matrimonio con la corriente, por etapas',
      fallsAt: 8,
    },
    {
      name: 'Los Mayores',
      seat: 'Valdetrigo',
      entity: 'La Cabra de las Dos Sangres',
      leader: 'Los ancianos del pueblo',
      offers: 'Cosechas, salud y hijos que la tierra reclama',
      fallsAt: 10,
    },
  ],

  extremeRules: [
    {
      flag: 'fusion',
      label: 'Fusión y absorción',
      where: 'Sesiones 11 y 12, en la Congregación de la cripta',
      ifVetoed: 'El personaje se retira y el final se cuenta desde fuera, sin escena explícita.',
    },
    {
      flag: 'mortalidad-intima',
      label: 'Muerte dentro del acto',
      where: 'Sesión 12, opcional',
      ifVetoed: 'La escena se corta antes del desenlace y se resuelve con velo.',
    },
    {
      flag: 'cria',
      label: 'Gestación y cría',
      where: 'Sesión 10, solo la Cabra de las Dos Sangres',
      ifVetoed: 'La cosecha se concede sin gestación, o la escena se elimina.',
    },
    {
      flag: 'mutacion',
      label: 'Transformación permanente',
      where: 'Solo si la mesa firma el flag: la conversión en el Arco III.',
      ifVetoed: 'Una marca visible y una herencia del río, sin cambios de cuerpo.',
    },
    {
      flag: 'snuff-ritual',
      label: 'Muerte ritual mostrada',
      where: 'No prevista',
      ifVetoed: 'No se juega.',
    },
  ],

  minPlayersWithCandelaBond: 2,
};
