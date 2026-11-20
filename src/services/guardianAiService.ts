import { NarrativeLevel } from '../types/game';
import { filterByHardLimits } from '../utils/brpEngine';
import { BESTIARY_ENTITIES } from '../data/bestiary';

export interface Seccion29Scene {
  umbral: string;
  reconocimiento: string;
  aproximacion: string;
  objecion: string;
  pausaDecision: string;
  reglaSugerida: string;
  imagenFinal: string;
  source: 'gemini' | 'offline';
  notice?: string;
}

export interface OracleAnswer {
  answer: string;
  sectionsCited: string[];
  source: 'gemini' | 'offline';
  notice?: string;
}

interface NarrateInput {
  lugar: string;
  oficiante: string;
  promesa: string;
  precio: string;
  detalle: { lugar: string; cuerpo: string };
  dialogo: { apertura: string; objecion: string; replica: string };
  narrativeLevel: NarrativeLevel;
  hardLimits: string[];
  grietaOptIn?: { tentacion: string; senal: string } | null;
}

function sanitizeScene(
  raw: Omit<Seccion29Scene, 'source' | 'notice'>,
  hardLimits: string[]
): Omit<Seccion29Scene, 'source' | 'notice'> {
  return {
    umbral: filterByHardLimits(raw.umbral, hardLimits).text,
    reconocimiento: filterByHardLimits(raw.reconocimiento, hardLimits).text,
    aproximacion: filterByHardLimits(raw.aproximacion, hardLimits).text,
    objecion: filterByHardLimits(raw.objecion, hardLimits).text,
    pausaDecision: filterByHardLimits(raw.pausaDecision, hardLimits).text,
    reglaSugerida: filterByHardLimits(raw.reglaSugerida, hardLimits).text,
    imagenFinal: filterByHardLimits(raw.imagenFinal, hardLimits).text,
  };
}

export function buildOfflineSeccion29Scene(
  input: NarrateInput,
  notice?: string
): Seccion29Scene {
  const base = sanitizeScene(
    {
      umbral: `${input.lugar}. ${input.detalle.lugar}`,
      reconocimiento: `Aparece ${input.oficiante.toLowerCase()}. ${input.detalle.cuerpo}${
        input.grietaOptIn
          ? ` Tu señal (${input.grietaOptIn.senal}) responde antes que tu juicio.`
          : ''
      }`,
      aproximacion: `${input.dialogo.apertura} Promete: ${input.promesa.toLowerCase()}.`,
      objecion: `${input.dialogo.objecion} — ${input.dialogo.replica}`,
      pausaDecision:
        'Antes de que rueden los dados: ¿qué hace o dice tu investigador para responder, apartarse o aceptar el umbral?',
      reglaSugerida: `Tirada de Inhibición (o POD Arduo) · Precio oculto si cedes: ${input.precio}.`,
      imagenFinal:
        input.narrativeLevel === 0
          ? 'La luz del umbral se estrecha hasta dejar solo el silencio y tu decisión.'
          : 'El pulso golpea en la garganta mientras el aire parece recordar un nombre que aún no pronuncias.',
    },
    input.hardLimits
  );
  return { ...base, source: 'offline', notice };
}

export async function generateSeccion29Scene(
  input: NarrateInput
): Promise<Seccion29Scene> {
  try {
    const res = await fetch('/api/guardian/narrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const msg =
        errBody?.message ||
        `Guardián IA no disponible (HTTP ${res.status}); usando modo offline.`;
      return buildOfflineSeccion29Scene(input, msg);
    }

    const data = await res.json();
    if (!data?.scene) {
      return buildOfflineSeccion29Scene(
        input,
        'Respuesta vacía del servidor; usando modo offline.'
      );
    }
    const clean = sanitizeScene(data.scene, input.hardLimits);
    return { ...clean, source: 'gemini' };
  } catch {
    return buildOfflineSeccion29Scene(
      input,
      'Sin conexión con el servidor; escena ensamblada con el generador determinista local.'
    );
  }
}

const OFFLINE_ORACLE_ENTRIES: Array<{
  keywords: string[];
  section: string;
  answer: string;
}> = [
  {
    keywords: ['pm', 'quemar', 'quemo', 'magia', 'bono'],
    section: 'Sección 5.1 y Ejemplo 5.6',
    answer:
      'Puedes quemar hasta 3 PM por intercambio para sumar +10% por cada PM. Ese coste en Inhibición (+1 INH por PM quemado) se acumula durante el combate y solo se paga al final si el encuentro termina en derrota/clímax. Si ganas o rompes el contacto con Resistencia de Hierro, no pagas INH por esos PM.',
  },
  {
    keywords: ['climax', 'clímax', 'derrota', 'ac 0', 'despertar'],
    section: 'Sección 5.4',
    answer:
      'Cuando tu Aguante Carnal (AC) llega a 0 pierdes 1d6 INH (2d6 si fue victoria Extrema o unión ritual), más los PM quemados acumulados. Además sufres el drenaje específico de la entidad (CON permanente en el Vástago de la Fosa, POD permanente con umbral de Cascarón ≤20 en el Falso Confidente) y haces una tirada de COR del Despertar (si fallas pierdes 1d2 COR).',
  },
  {
    keywords: ['arrebato', 'tabla a', 'colgajo', '5 inh', '5+'],
    section: 'Sección 3.3',
    answer:
      'Perder 5 o más INH de golpe (3+ con la filia Umbral bajo) dispara un Arrebato de Lujuria durante 1d6 asaltos (Tabla A). Mientras dura otorga +1 dado de bonificación a Técnica/Seducción, impone -1 dado de penalización a Resistencia Carnal/POD/INT y prohíbe quemar PM en defensa. Al terminar exige una tirada de COR (Colgajo de Lucidez).',
  },
  {
    keywords: ['primera vez', 'primera tirada', 'pod completo'],
    section: 'Sección 3.2',
    answer:
      'Regla de la Primera Vez: la primera Tirada de Inhibición de toda la campaña se lanza contra el POD completo del investigador antes de sufrir desplazamiento. A partir de esa tirada se utiliza siempre el valor actual de INH.',
  },
  {
    keywords: ['recuperar', 'recuperacion', 'recuperación', 'refugio', 'lazo', 'velo'],
    section: 'Sección 7 y 7.2',
    answer:
      'Existen tres válvulas de recuperación: Velo y distancia (+1 INH y +1 COR tras separación limpia), Trauma purgativo (+1d3 INH a costa de -1 COR) y la escena de Refugio del Cuerpo (7.2) junto a un Lazo Íntimo (+1d3 COR, +1d3 AC y +1 INH, una vez por sesión).',
  },
  {
    keywords: ['diario', 'caída', 'caida', '3.7'],
    section: 'Sección 3.7',
    answer:
      'El Diario de la Caída se redacta en primera persona (5 preguntas). Concede una única bonificación de entrada por registro: +1 AC o +10% a la primera tirada relacionada. Nunca restaura COR ni INH.',
  },
  {
    keywords: ['tabla e', 'inh 0', 'cero', 'ratificacion', 'ratificación'],
    section: 'Sección 3.5.2 y 17.7',
    answer:
      'Al llegar a INH 0 (Tabla E) no hay pérdida automática sin pacto: jugador y Guardián co-escriben el desenlace eligiendo entre Velo estricto, servidumbre ritual no sexual, retirada digna del personaje o un arco de resistencia.',
  },
];

export function queryOfflineRulesOracle(
  question: string,
  notice?: string
): OracleAnswer {
  const q = question.toLowerCase();
  const matched = OFFLINE_ORACLE_ENTRIES.find((entry) =>
    entry.keywords.some((kw) => q.includes(kw))
  );
  if (matched) {
    return {
      answer: matched.answer,
      sectionsCited: [matched.section],
      source: 'offline',
      notice,
    };
  }
  const ent = BESTIARY_ENTITIES.find((e) =>
    q.includes(e.name.toLowerCase().split(' ').slice(-1)[0])
  );
  if (ent) {
    return {
      answer: `${ent.name} (${ent.subtitle}): ${ent.climaxEffectName} — ${ent.climaxEffectDesc} Debilidad: ${ent.weaknessDesc}`,
      sectionsCited: [ent.subtitle],
      source: 'offline',
      notice,
    };
  }
  return {
    answer:
      'Puedes consultar sobre PM quemados (5.1), Clímax y Despertar (5.4), Arrebato y Colgajo de Lucidez (3.3), Regla de la Primera Vez (3.2), Recuperación y Refugio (7.2), Diario de la Caída (3.7), Tabla E (3.5.2) o cualquiera de las 8 entidades del Bestiario.',
    sectionsCited: ['Sección 1–7'],
    source: 'offline',
    notice,
  };
}

export async function askRulesOracle(
  question: string,
  narrativeLevel: NarrativeLevel
): Promise<OracleAnswer> {
  try {
    const res = await fetch('/api/guardian/oracle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, narrativeLevel }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return queryOfflineRulesOracle(
        question,
        errBody?.message || `Oráculo en modo local (HTTP ${res.status}).`
      );
    }
    const data = await res.json();
    if (!data?.answer) {
      return queryOfflineRulesOracle(question);
    }
    return {
      answer: String(data.answer),
      sectionsCited: Array.isArray(data.sectionsCited)
        ? data.sectionsCited.map(String)
        : [],
      source: 'gemini',
    };
  } catch {
    return queryOfflineRulesOracle(
      question,
      'Sin conexión con el servidor; respuesta obtenida del índice local de reglas.'
    );
  }
}
