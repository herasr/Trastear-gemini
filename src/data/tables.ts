import { RepertorioMove } from '../types/game';

export interface TableEntry {
  min: number;
  max: number;
  name: string;
  effect: string;
}

export const TABLA_A: TableEntry[] = [
  { min: 1, max: 5, name: 'Vértigo del velo', effect: 'Se despoja de adornos o capas; +10% a Seducción/Provocar mientras dure.' },
  { min: 6, max: 10, name: 'Fijeza', effect: 'Avanza hacia la fuente del Arrebato ignorando el entorno; pierde Esquivar ese asalto.' },
  { min: 11, max: 15, name: 'Lengua de miel', effect: 'Confiesa en voz alta lo que siente; los presentes tiran Inhibición 1d2.' },
  { min: 16, max: 20, name: 'Latido abierto', effect: '+15% a Técnica/Rendimiento, -10% a Resistencia Carnal durante el encuentro.' },
  { min: 21, max: 25, name: 'Susurro devoto', effect: 'Pronuncia frases rituales del culto causante; aporta +1 PM si hay rito activo; oyentes tiran COR 0/1.' },
  { min: 26, max: 30, name: 'Hambre de sal', effect: 'Busca el agua, la lluvia o la profundidad; si las alcanza, el Arrebato se calma un asalto antes.' },
  { min: 31, max: 35, name: 'Colección', effect: 'Intenta quedarse con una prenda u objeto de la entidad; lograrlo consolida 1 punto de INH perdido.' },
  { min: 36, max: 40, name: 'Danza litúrgica', effect: 'Se mueve como en las liturgias prohibidas; cualquier cultista presente gana +10% ese asalto.' },
  { min: 41, max: 45, name: 'Contacto', effect: 'Necesita tocar; si no logra contacto en el asalto, pierde 1 AC.' },
  { min: 46, max: 50, name: 'Inversión', effect: 'Forcejea con exceso de resistencia: +20% a Resistencia Carnal este Arrebato, pero si pierde, pierde 2 INH extra.' },
  { min: 51, max: 55, name: 'Marea en los oídos', effect: 'Sordo a las voces de sus aliados hasta el final del Arrebato.' },
  { min: 56, max: 60, name: 'Confesión indiscreta', effect: 'Revela un secreto de la partida a la entidad o a un desconocido.' },
  { min: 61, max: 65, name: 'Exhibición', effect: 'Expone la escena en público; tirada Ardua de Crédito al día siguiente.' },
  { min: 66, max: 70, name: 'Apetito', effect: 'Bebe o toma algo prohibido (savia, agua negra, cáliz); tirada Normal de CON o pierde 1d2 PV.' },
  { min: 71, max: 75, name: 'Espejo', effect: 'Imita los gestos exactos de la entidad; si le observa, tirada enfrentada de POD o la entidad sabrá siempre dónde hallarle.' },
  { min: 76, max: 80, name: 'Ofrenda', effect: 'Entrega un objeto preciado o 1d3 PM a la fuente del deseo.' },
  { min: 81, max: 85, name: 'Sombra', effect: 'Se oculta para observar; éxito de Buscar/Escuchar da dado de bonificación a su próxima Seducción/Provocar.' },
  { min: 86, max: 90, name: 'Filo', effect: 'Se aproxima a una entidad hostil sin defensa; su AC cuenta como 0 ante el siguiente contacto.' },
  { min: 91, max: 95, name: 'Nombre', effect: 'Susurra el nombre prohibido de la entidad; quien lo oiga tira COR 0/1.' },
  { min: 96, max: 100, name: 'Apagado', effect: 'El cuerpo queda quieto, ojos abiertos; no actúa ni resiste: el Arrebato ocurre por dentro bajo velo estricto.' },
];

export const TABLA_B: TableEntry[] = [
  { min: 1, max: 5, name: 'Tacto famélico', effect: 'Necesita contacto físico frecuente; un día sin él impone -10% a tiradas sociales.' },
  { min: 6, max: 10, name: 'Perfume de la caída', effect: 'Busca el aroma de su corruptor (flor, marea, incienso); con él +10% a Resistencia Carnal, sin él -10%.' },
  { min: 11, max: 15, name: 'Ataduras blandas', effect: 'Las cuerdas, cintas y lazos le roban el foco; tirada Ardua para no distraerse.' },
  { min: 16, max: 20, name: 'Confesión carnal', effect: 'Intimar es contar; tras cada escena íntima revela sin querer un dato personal.' },
  { min: 21, max: 25, name: 'Mirada apetitiva', effect: '+10% a Seducción/Provocar, pero -10% a resistir encantos.' },
  { min: 26, max: 30, name: 'Voz baja', effect: 'Solo le calman los susurros; no recupera AC durmiendo solo.' },
  { min: 31, max: 35, name: 'Mano tatuada', effect: 'Dibuja inconscientemente el signo del culto; -5% a disimular ocultismo, +5% con textos del mito.' },
  { min: 36, max: 40, name: 'Marea en el vaso', effect: 'Bebe más agua de la cuenta y evita la sed; mirar agua quieta mucho tiempo cuesta INH 1.' },
  { min: 41, max: 45, name: 'Savia o sal', effect: 'Adquirió el gusto de su corruptor; ingerirlo recupera 1 AC a cambio de 1 INH por semana.' },
  { min: 46, max: 50, name: 'Sueño ajeno', effect: 'Solo duerme plenamente en lugares que no son los suyos.' },
  { min: 51, max: 55, name: 'Manos frías', effect: 'Busca el frío en piel y objetos; -10% a sociales en ambientes cálidos y cerrados.' },
  { min: 56, max: 60, name: 'Contador de voces', effect: 'Cree oír su nombre en el viento o el agua; un éxito de Escuchar revela que probablemente era real.' },
  { min: 61, max: 65, name: 'Prenda del rito', effect: 'Conserva una prenda de la escena; no tocarla cada mañana cuesta 1d2 AC ese día.' },
  { min: 66, max: 70, name: 'Liturgia somnolienta', effect: 'Reza sin darse cuenta la plegaria que oyó; tirada COR 0/1 para el oyente que la reconozca.' },
  { min: 71, max: 75, name: 'Umbrales entreabiertos', effect: 'Deja siempre puertas, ventanas o rejas entreabiertas de noche, "por aire".' },
  { min: 76, max: 80, name: 'Apertura', effect: 'No sabe mentir sobre su deseo; mentir en temas íntimos exige tirada Ardua de Persuasión.' },
  { min: 81, max: 85, name: 'Memoria exacta', effect: 'Recuerda el clímax con precisión inquietante; los recuerdos espontáneos cuestan COR 0/1.' },
  { min: 86, max: 90, name: 'Cuerpo contado', effect: 'Cuenta obsesivamente respiraciones, latidos o espinas; perder el conteo impone -10% ese asalto.' },
  { min: 91, max: 95, name: 'Piel prestada', effect: 'En contextos sensuales +10% a Rendimiento, pero -5% permanente a Esquivar.' },
  { min: 96, max: 100, name: 'Elegido', effect: 'La entidad dejó una señal en él; su próxima Tirada de Inhibición de la sesión pierde el doble.' },
];

export const TABLA_C: TableEntry[] = [
  { min: 1, max: 5, name: 'Voto de vigilia', effect: 'No duerme sin compañía íntima; dormir solo impide recuperar AC y PM.' },
  { min: 6, max: 10, name: 'Marca de la voz', effect: 'Solo confía en los susurros; -20% a Psicología para detectar mentiras dichas con cariño.' },
  { min: 11, max: 15, name: 'Apetito anómalo', effect: 'Su dieta incluye lo que no debería; tirada Normal de CON semanal o pierde 1 PV.' },
  { min: 16, max: 20, name: 'Deseo del umbral', effect: 'Entra voluntariamente en cualquier puerta entreabierta que le llame; POD Normal para resistirse.' },
  { min: 21, max: 25, name: 'Geometría en la piel', effect: 'Su cuerpo se marca con la geometría del rito; +10% a participar en rituales de esa geometría.' },
  { min: 26, max: 30, name: 'Rendición dirigida', effect: '-10% Resistencia Carnal, +10% Técnica/Rendimiento, permanente.' },
  { min: 31, max: 35, name: 'Nombre en la nuca', effect: 'La entidad le conoce; las entidades del mismo linaje ganan +10% contra él.' },
  { min: 36, max: 40, name: 'Duelo de caricias', effect: 'Provoca encuentros íntimos (POD semanal para evitarlo) donde busca ceder.' },
  { min: 41, max: 45, name: 'Savia o nada', effect: 'Sustancias del mito le serenan: 1 dosis recupera 1d3 COR a cambio de 1d6 INH.' },
  { min: 46, max: 50, name: 'Culto doméstico', effect: 'Monta discretamente un altar; destruirlo cuesta COR 1/1d4, mantenerlo cuesta 1 INH por sesión.' },
  { min: 51, max: 55, name: 'Frío del agua', effect: 'Baños nocturnos obligatorios; sin ellos no recupera AC; con ellos, -1 INH por semana.' },
  { min: 56, max: 60, name: 'Ojos de búho', effect: 'Prefiere la penumbra; la luz plena impone dado de penalización a Buscar y ataques.' },
  { min: 61, max: 65, name: 'Manos de mármol', effect: 'El tacto de la piedra antigua le serena; colecciona recuerdos de ruinas.' },
  { min: 66, max: 70, name: 'Susurros comparativos', effect: 'Psicología siempre activa en contexto íntimo, pero -10% social con aliados.' },
  { min: 71, max: 75, name: 'Salto del pecho', effect: 'Una vez por sesión convierte un fallo de COR en éxito a costa de 1d3 INH.' },
  { min: 76, max: 80, name: 'Boda química', effect: 'Fabrica perfumes extraños: con ellos +10% sociales; sin ellos, -5% a todo un día.' },
  { min: 81, max: 85, name: 'Devoción invertida', effect: 'Reza al corruptor antes de dormir; gana +1 PM por noche, pierde 1 INH por semana.' },
  { min: 86, max: 90, name: 'Sed de clímax', effect: 'Cada victoria íntima otorga +1d6 AC temporal, pero el siguiente encuentro empieza con -1d4 AC.' },
  { min: 91, max: 95, name: 'Celos del círculo', effect: 'No puede cooperar con quienes sirven a su mismo origen sin tirada Normal de POD.' },
  { min: 96, max: 100, name: 'Puente', effect: 'El Guardián ofrece un beneficio real a cambio de escalar un nivel la siguiente filia.' },
];

export const TABLA_D: TableEntry[] = [
  { min: 1, max: 8, name: 'Filia de la Zarza', effect: 'Necesita el contacto de los zarcillos; sin él, -1 COR por día de abstinencia.' },
  { min: 9, max: 16, name: 'Filia de la Fosa', effect: 'El cuerpo anhela el agua oscura; la vida en seco se vuelve progresivamente insoportable.' },
  { min: 17, max: 24, name: 'Filia del Susurro', effect: 'Solo confía y desea lo que le susurran en sueños.' },
  { min: 25, max: 32, name: 'Cuerpo mudable', effect: 'Desarrolla una mutación menor del linaje de su corruptor (Sección 15).' },
  { min: 33, max: 40, name: 'Devoción corporal', effect: 'En cada Combate Íntimo, tirada Ardua de POD o sus manos ceden al impulso pactado.' },
  { min: 41, max: 48, name: 'Celibato imposible', effect: 'Las escenas con mortales restauran 0 AC; solo lo anómalo restaura.' },
  { min: 49, max: 56, name: 'Prestación nocturna', effect: 'Pierde 1 PM por noche dormida en sueños dirigidos al corruptor.' },
  { min: 57, max: 64, name: 'Hambre de POD', effect: 'Al ganar un Combate Íntimo drena 1d3 PM del vencido, pero cada drenaje cuesta 1d2 INH.' },
  { min: 65, max: 72, name: 'Marea interior', effect: 'En momentos intensos, tirada Ardua de CON o 1d4 asaltos sin actuar (vértigo de agua).' },
  { min: 73, max: 80, name: 'Matrimonio sombrío', effect: 'Atacar letalmente a la entidad exige tirada Normal de POD para superar los celos.' },
  { min: 81, max: 88, name: 'Liturgia mayor', effect: 'Gana la habilidad Conducir Rito al 25%; cada rito oficiado cuesta 1d6 INH.' },
  { min: 89, max: 96, name: 'Umbral bajo', effect: 'El Arrebato de Lujuria se dispara ya con pérdidas de 3+ INH.' },
  { min: 97, max: 100, name: 'Marcado', effect: 'La próxima Tirada de Inhibición importante falla automáticamente (con aviso previo).' },
];

export const TABLA_E: TableEntry[] = [
  { min: 1, max: 10, name: 'Sumisión total', effect: 'Acólito involuntario de la entidad; antihéroe con mandatos pactados.' },
  { min: 11, max: 20, name: 'Conversión a Profundo', effect: 'La etapa final de la mutación del Vástago de la Fosa se consuma.' },
  { min: 21, max: 30, name: 'Cónyuge de la Zarza', effect: 'Permanece junto a la Ninfa; vuelve en visiones y señales.' },
  { min: 31, max: 40, name: 'Voz prestada', effect: 'Su voz ya no es del todo suya; cada confidencia puede plantar un susurro.' },
  { min: 41, max: 50, name: 'Sacerdocio carnal', effect: 'Oficiante mayor del culto: jugable como antihéroe con mandatos crecientes.' },
  { min: 51, max: 60, name: 'Santo del deseo', effect: 'El culto le venera, busca y protege; su vida mortal se vuelve imposible.' },
  { min: 61, max: 70, name: 'Envaramiento', effect: 'Episodios de posesión onírica; tirada de POD al despertar para recordar.' },
  { min: 71, max: 80, name: 'Cónyuge del fondo', effect: 'Habita con la entidad en la fosa; sube con la marea en escenas concretas.' },
  { min: 81, max: 90, name: 'Heraldo', effect: 'Reclutador involuntario: quien acepte escucharle pierde 1 INH.' },
  { min: 91, max: 100, name: 'Matrimonio cósmico', effect: 'Desenlace máximo diseñado a dos: boda ritual con la entidad. Fin de arco y leyenda.' },
];

export const REPERTORIO_MOVES: RepertorioMove[] = [
  {
    id: 'beso',
    name: 'Beso profundo / roce',
    minLevel: 0,
    attackerMod: 5,
    defenderMod: 0,
    acMultiplier: 1,
    summary: '+5% al atacante este asalto.',
    veloText: 'La cercanía se estrecha más allá de la distancia segura; la respiración compartida quiebra la calma.',
    sensualText: 'Un beso lento en la comisura y el cuello, sostenido hasta que el pulso del otro delata la falta de aire.',
  },
  {
    id: 'desnudez',
    name: 'Desnudez progresiva',
    minLevel: 0,
    attackerMod: 0,
    defenderMod: -5,
    acMultiplier: 1,
    summary: '-5% a Resistencia Carnal del defensor este asalto.',
    veloText: 'Las capas caen como una capitulación silenciosa; la vulnerabilidad pesa más que el frío de la sala.',
    sensualText: 'Prenda a prenda, sin prisa; la piel queda expuesta a la penumbra y a la mirada que no parpadea.',
  },
  {
    id: 'caricias',
    name: 'Caricias deliberadas',
    minLevel: 0,
    attackerMod: 0,
    defenderMod: 0,
    acMultiplier: 1,
    stealsPmOnWin: true,
    summary: 'Si gana el asalto, roba 1 PM al defensor (el deseo canaliza magia).',
    veloText: 'El contacto metódico busca puntos de calor y drena la reserva interior junto con la calma.',
    sensualText: 'Manos expertas recorren la clavícula, el costado y el vientre con una cadencia calculada que roba el aliento.',
  },
  {
    id: 'cambio_ritmo',
    name: 'Cambio de postura o ritmo',
    minLevel: 0,
    attackerMod: -5,
    defenderMod: 0,
    acMultiplier: 1,
    resetsPenalty: true,
    summary: 'Reinicia penalizaciones acumuladas a cambio de -5% propio.',
    veloText: 'Un giro abrupto rompe el compás establecido y obliga a ambos a buscar un nuevo equilibrio.',
    sensualText: 'Cambia el peso y la cadencia de golpe, desarmando la rutina corporal y abriendo un flanco distinto.',
  },
  {
    id: 'elogio_sucio',
    name: 'Palabras al oído (Elogio)',
    minLevel: 1,
    attackerMod: 0,
    defenderMod: 0,
    acMultiplier: 1,
    extraInhIfFilia: true,
    summary: 'Si el defensor tiene una filia activa, pierde 1 INH extra si gana el atacante.',
    veloText: 'Un susurro exacto junto al oído nombra aquello que el personaje ocultaba incluso de sí mismo.',
    sensualText: 'Frases bajas y húmedas contra la oreja, nombrando sin pudor cada estremecimiento y cada capitulación.',
  },
  {
    id: 'ataduras_vivas',
    name: 'Ataduras / Presa íntima',
    minLevel: 0,
    attackerMod: 0,
    defenderMod: -10,
    acMultiplier: 1,
    summary: 'Inmoviliza con cuerdas, telas o zarcillos (-10% a Resistencia este asalto).',
    veloText: 'Zarcillos, sedas o trenzas de agua ciñen muñecas y cintura, reduciendo el margen de retirada.',
    sensualText: 'Lazos tensos rodean los brazos y el torso, fijando el cuerpo en la postura exacta que exige el rito.',
  },
  {
    id: 'entrega',
    name: 'Entrega íntima',
    minLevel: 1,
    attackerMod: 10,
    defenderMod: 0,
    acMultiplier: 1,
    summary: 'Atacante +10%, pero si pierde el asalto su propio AC sufre 1d4.',
    veloText: 'Una apuesta total de cercanía que deja al atacante tan expuesto como a quien intenta doblegar.',
    sensualText: 'Boca y aliento entregados sin reserva ni prisa, midiendo cada reacción a riesgo de quedar igual de desarmado.',
  },
  {
    id: 'union',
    name: 'Unión ritual',
    minLevel: 1,
    attackerMod: 0,
    defenderMod: 0,
    acMultiplier: 1.5,
    summary: 'El daño a AC se multiplica ×1,5 (el clímax acelera).',
    veloText: 'El umbral cede por completo; el encuentro entra en su fase decisiva bajo la mirada del mito.',
    sensualText: 'Cuerpos unidos al mismo compás mientras las paredes, el agua o la penumbra responden al ritmo compartido.',
  },
];

export interface MutationTableEntry extends TableEntry {
  lineage: 'acuatico' | 'vegetal' | 'onirico' | 'general';
}

export const TABLA_MUTACIONES: MutationTableEntry[] = [
  { min: 1, max: 5, name: 'Branquioneas', effect: 'Respiras bajo el agua indefinidamente. Señal: tres cortes pálidos en el cuello (-5% Encanto en seco).', lineage: 'acuatico' },
  { min: 6, max: 10, name: 'Ojos de fondo', effect: 'Ves en oscuridad total. Señal: iris plateado imposible de ocultar; penalización en luz fuerte.', lineage: 'acuatico' },
  { min: 11, max: 15, name: 'Piel de pergamino', effect: '+10% a Liturgias y textos del mito. Señal: piel translúcida, APA -15.', lineage: 'general' },
  { min: 16, max: 20, name: 'Glandular de savia', effect: 'Produces 1 frasco de savia por semana. Señal: 1d2 PV de coste y olor inconfundible.', lineage: 'vegetal' },
  { min: 21, max: 25, name: 'Zarcillos internos', effect: 'Ataduras 40% usando tu propio cuerpo. Señal: pliegues imposibles.', lineage: 'vegetal' },
  { min: 26, max: 30, name: 'Metabolismo de marea', effect: 'Regeneras 1 PV/asalto empapado. Señal: necesitas bañarte a diario.', lineage: 'acuatico' },
  { min: 31, max: 35, name: 'Oído de presa', effect: 'Psicología +20% en contextos íntimos e interrogatorios. Señal: los gritos hieren (1 PV).', lineage: 'general' },
  { min: 36, max: 40, name: 'Anatomía reescrita', effect: 'Técnica Sexual +20% y +10% en tratos con entidades. Señal: los mortales intuyen algo extraño.', lineage: 'general' },
  { min: 41, max: 45, name: 'Perfume personal', effect: 'Produces Perfume de la Rendición 1 vez/día gratis. Coste: -1 INH por día de uso.', lineage: 'vegetal' },
  { min: 46, max: 50, name: 'Segundo corazón', effect: 'Inmune al primer drenaje de PM de cada encuentro. Señal: CON -1 adicional.', lineage: 'general' },
  { min: 51, max: 55, name: 'Membranas', effect: 'Nadas como anfibio (Mov 8). Señal: APA -10; manos difíciles de ocultar.', lineage: 'acuatico' },
  { min: 56, max: 60, name: 'Voz de la corriente', effect: 'Hablas con Profundos y seres de agua dulce. Señal: eco húmedo en la voz (COR 0/1).', lineage: 'acuatico' },
  { min: 61, max: 65, name: 'Manos frías', effect: 'Restauras 1 AC a quien toques (1/escena). Coste: el contacto ya no te restaura AC.', lineage: 'onirico' },
  { min: 66, max: 70, name: 'Piel escrita', effect: 'Liturgia +20%. Señal: signos rituales en la dermis; -15% a disimular ocultismo.', lineage: 'onirico' },
  { min: 71, max: 75, name: 'Vigilia corta', effect: 'Duermes 1 hora con recuperación completa. Coste: sueñas donde decida tu entidad (-1 INH/sem).', lineage: 'onirico' },
  { min: 76, max: 85, name: 'Seda interna', effect: 'Produces hilo vivo: Ataduras 60% propio. Coste: 1 PV por 10 metros hilados.', lineage: 'general' },
  { min: 86, max: 90, name: 'Rostro prestado', effect: 'Mini-Velo de Belleza: Encanto +20%. Coste: tus lazos deben superar Buscar para reconocerte.', lineage: 'onirico' },
  { min: 91, max: 100, name: 'Contador de cuerpos', effect: 'Sientes mutados y colonias en 100 m. Coste: -1 INH por escena en su presencia.', lineage: 'acuatico' },
];

export interface SpellEntry {
  id: string;
  name: string;
  cost: string;
  pmCost: number;
  inhCost: number;
  duration: string;
  effect: string;
  combatEffect?: string;
}

export const GRIMORIO_SPELLS: SpellEntry[] = [
  {
    id: 'perfume_rendicion',
    name: '8.1 Perfume de la Rendición',
    cost: '3 PM',
    pmCost: 3,
    inhCost: 0,
    duration: '1 escena',
    effect: 'Aura de 10 m: los presentes tiran CON Ardua o pierden 1d3 INH; lanzador +20% a Seducción/Provocar.',
    combatEffect: '+20% a Seducción/Técnica en este encuentro.',
  },
  {
    id: 'susurro_sembrado',
    name: '8.2 Susurro Sembrado',
    cost: '4 PM',
    pmCost: 4,
    inhCost: 0,
    duration: 'Permanente',
    effect: 'Implanta una convicción íntima en un objetivo (POD enfrentada); se siente como idea propia.',
  },
  {
    id: 'drenaje_intimo',
    name: '8.3 Drenaje Íntimo',
    cost: '2 PM',
    pmCost: 2,
    inhCost: 0,
    duration: 'Instantáneo',
    effect: 'Tras vencer en Combate Íntimo: drena 1d6 PM del vencido (hasta +5 PM extra).',
  },
  {
    id: 'velo_belleza',
    name: '8.4 Velo de Belleza',
    cost: '4 PM + 1 INH',
    pmCost: 4,
    inhCost: 1,
    duration: '1 hora',
    effect: 'APA efectivo 90: el rostro que cada observador desea ver. Toda pérdida de INH activa se duplica.',
    combatEffect: 'APA 90 y +15% a Técnicas durante el encuentro (cuidado con el coste doble de INH).',
  },
  {
    id: 'atadura_consagrada',
    name: '8.5 Atadura Consagrada',
    cost: '3 PM',
    pmCost: 3,
    inhCost: 0,
    duration: '1 noche',
    effect: 'Una cuerda actúa con Ataduras 40% autónomas; el propietario sueña lo que la cuerda toca.',
  },
  {
    id: 'voto_carne',
    name: '8.6 Voto de Carne',
    cost: '5 PM + 1d3 INH',
    pmCost: 5,
    inhCost: 2,
    duration: 'Permanente',
    effect: 'Pacta un lazo íntimo involuntario (POD enfrentada): el fiador debe una obediencia por día.',
  },
  {
    id: 'espejo_deseo',
    name: '8.7 Espejo del Deseo',
    cost: '6 PM + 1 INH',
    pmCost: 6,
    inhCost: 1,
    duration: '1 escena',
    effect: 'Muestra el deseo más profundo de alguien tocado; otorga dado de bonificación permanente contra esa persona.',
  },
  {
    id: 'liturgia_despertar',
    name: '8.8 Liturgia del Despertar',
    cost: 'Variable (rito grupal)',
    pmCost: 5,
    inhCost: 3,
    duration: '1 noche',
    effect: 'Pozo común de PM (3–13 participantes). Cada 10 PM logra un milagro mayor; pifia activa complicaciones.',
  },
];

export interface RelicEntry {
  id: string;
  name: string;
  effect: string;
  cursedPrice: string;
}

export const RELIQUIAS_CIRCULO: RelicEntry[] = [
  {
    id: 'cuerda_consagrada',
    name: 'Cuerda Consagrada (3 m, seda negra)',
    effect: 'Actúa sola con Ataduras 40% mientras alguien la sostenga.',
    cursedPrice: 'Quien la use más de 3 noches seguidas tira en Tabla B (Filia Leve).',
  },
  {
    id: 'aceite_zarza',
    name: 'Aceite de la Zarza (frasco)',
    effect: 'Untado en la piel: +20% a Resistencia Carnal esa escena; los zarcillos no inmovilizan ese asalto.',
    cursedPrice: '1 INH por uso: la piel aprende a querer la savia.',
  },
  {
    id: 'agua_fosa',
    name: 'Agua de la Fosa (frasco)',
    effect: 'Un trago: +1 etapa temporal de Profundo por 1 escena (branquioneas funcionales).',
    cursedPrice: 'Tirada Ardua de CON al acabar o la etapa se vuelve permanente.',
  },
  {
    id: 'espejo_confidente',
    name: 'Espejo del Confidente (ópalo)',
    effect: 'Refleja el rostro que el observador más desea ver; +20% a Provocar mientras se muestra.',
    cursedPrice: 'Cada uso cuesta 1 PM y 1 INH al portador: el espejo cobra por mirar.',
  },
  {
    id: 'vendajes_rito',
    name: 'Vendajes del Rito (rollo)',
    effect: 'Vendar los ojos vuelve inmune a COR en la escena íntima.',
    cursedPrice: 'Toda tirada de COR eludida así se paga como pérdida de INH igual.',
  },
  {
    id: 'lagrima_ninfa',
    name: 'Lágrima de la Ninfa (cristal ámbar)',
    effect: 'Bebida diluida: recupera 1d6 PV y 1d6 COR (una vez por arco).',
    cursedPrice: 'Siembra una Filia de la Zarza menor (-1 COR por semana de abstinencia).',
  },
  {
    id: 'sortija_aguas',
    name: 'Sortija de las Aguas (coral negro)',
    effect: 'Anula una propuesta de la Señora de las Aguas Dulces (rechazo limpio, sin tirada).',
    cursedPrice: 'La Señora sabe siempre quién la lleva: la propuesta se pospone, no se cancela.',
  },
];

// Sección 22 y 28: Generador de escenas de corrupción
export const GEN_LUGARES = [
  'Dormitorio que huele a mar',
  'Teatro vacío',
  'Clínica de fertilidad',
  'Baño ritual',
  'Playa bajo luna negra',
  'Invernadero húmedo',
  'Hotel sin espejos',
  'Cripta nupcial',
  'Sala de terapia',
  'Umbral entre habitaciones',
];

export const GEN_OFICIANTES = [
  'Una expareja',
  'Un terapeuta',
  'Un actor enmascarado',
  'Un familiar costero',
  'Un sacerdote desnudo bajo velo',
  'Un amante visto en sueños',
  'Una persona con el mismo recuerdo',
  'Un heredero del culto',
  'Un doble del investigador',
  'Alguien que aún no ha nacido',
];

export const GEN_PROMESAS = [
  'Sentirse deseado sin reserva',
  'Recuperar juventud',
  'Curar una herida',
  'Engendrar un legado',
  'Compartir recuerdos',
  'Habitar otro cuerpo',
  'Borrar la culpa',
  'No volver a estar solo',
  'Dominar sin ser rechazado',
  'Rendirse sin responsabilidad',
];

export const GEN_PRECIOS = [
  'Una marca visible',
  'Un mandato futuro',
  'Una filia nueva',
  'Una deuda con el culto',
  'Un recuerdo perdido',
  'Una mutación',
  'Un vínculo contaminado',
  'Un nombre entregado',
  'Un pacto dinástico',
  'La autonomía durante una escena',
];

export const GEN_DETALLES_28_2 = [
  { lugar: 'La lluvia asciende por el cristal en vez de caer.', cuerpo: 'El personaje nota sal en los labios.' },
  { lugar: 'Una lámpara parpadea al ritmo de una respiración ajena.', cuerpo: 'La habitación parece más cálida cuanto más cerca está el tentador.' },
  { lugar: 'La música llega amortiguada desde detrás de una pared sin puerta.', cuerpo: 'El pulso del personaje intenta seguirla.' },
  { lugar: 'El espejo devuelve el gesto con un segundo de retraso.', cuerpo: 'El reflejo sonríe antes de que lo haga el personaje.' },
  { lugar: 'El aire huele a tierra húmeda y pan recién abierto.', cuerpo: 'El cansancio de otros cuerpos parece sostenerlo.' },
  { lugar: 'El agua de un vaso vibra aunque nadie toque la mesa.', cuerpo: 'Una voz se escucha dentro del pecho.' },
  { lugar: 'La tela de la ropa pesa como si acabara de salir del mar.', cuerpo: 'El contacto con la piel produce un recuerdo que no es propio.' },
  { lugar: 'Las sombras se inclinan hacia la persona que habla.', cuerpo: 'Apartar la mirada exige un esfuerzo físico.' },
  { lugar: 'Una puerta conserva el pomo de una casa desaparecida.', cuerpo: 'Al tocarlo vuelve una emoción olvidada.' },
  { lugar: 'El humo dibuja por un instante dos figuras abrazadas.', cuerpo: 'Una de ellas tiene el rostro del personaje.' },
  { lugar: 'Un nombre aparece escrito en la condensación.', cuerpo: 'Nadie admite haberlo pronunciado.' },
  { lugar: 'El silencio después de una pregunta dura demasiado.', cuerpo: 'En ese hueco, la entidad ofrece exactamente lo deseado.' },
];

export const GEN_DIALOGOS_28_3 = [
  {
    apertura: '«No he venido a pedirte que confíes. He venido porque estás cansado de desconfiar.»',
    objecion: '«Entonces no te acerques más.»',
    replica: '«Aquí. Esta distancia también puede ser una promesa.»',
  },
  {
    apertura: '«No tienes que explicarme por qué lo deseas.»',
    objecion: '«Quizá ni siquiera sea mío.»',
    replica: '«Los deseos prestados también dejan marcas propias.»',
  },
  {
    apertura: '«Puedo devolverte aquello que perdiste.»',
    objecion: '«No sabes qué perdí.»',
    replica: '(Pronuncia un detalle imposible de conocer y deja que el silencio responda.)',
  },
  {
    apertura: '«Nadie volverá a mirar esa parte de ti con repulsión.»',
    objecion: '«¿Y tú qué verás?»',
    replica: '«Una puerta. Pero no entraré si no la abres.»',
  },
  {
    apertura: '«Solo te pido una noche.»',
    objecion: '«Las deudas duran más que las noches.»',
    replica: '«Por eso no ocultaré que esto es una deuda.»',
  },
  {
    apertura: '«Puedes marcharte cuando quieras.»',
    objecion: '«¿También después de aceptar?»',
    replica: '«Podrás marcharte. Lo difícil será decidir qué parte de ti se queda.»',
  },
  {
    apertura: '«Di el nombre con el que deseas que te recuerden.»',
    objecion: '«Ya tengo uno.»',
    replica: '«Ese es el nombre que te dieron. Yo pregunto por el que elegiste.»',
  },
  {
    apertura: '«No quiero obediencia. Quiero honestidad.»',
    objecion: '«La honestidad también puede utilizarse como cadena.»',
    replica: '«Sí. Por eso te ofrezco sostener el otro extremo.»',
  },
  {
    apertura: '«Puedo hacer que deje de doler.»',
    objecion: '«¿Durante cuánto tiempo?»',
    replica: '«El suficiente para que recuerdes quién eres sin el dolor.»',
  },
  {
    apertura: '«No estás solo.»',
    objecion: '«Eso no significa que esté a salvo.»',
    replica: '«No. Significa que, si caes, alguien sentirá la caída.»',
  },
];
