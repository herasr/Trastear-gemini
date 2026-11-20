import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { BESTIARY_ENTITIES } from './src/data/bestiary.ts';
import { GRIMORIO_SPELLS, RELIQUIAS_CIRCULO } from './src/data/tables.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const RULES_GROUNDING = {
  seguridad:
    'Sección 1: Velo estricto (Nivel 0) por defecto; Nivel 1 sensual literario no explícito. Veto universal absoluto: jamás implicación de menores. Tarjeta X y Palabra Ámbar detienen o suavizan sin penalización. Un éxito de Seducción nunca convierte un rechazo en consentimiento.',
  reglaPrimeraVez:
    'Sección 3.2: La primera Tirada de Inhibición de toda la campaña usa el POD completo del investigador; a partir de entonces usa INH actual.',
  arrebato:
    'Sección 3.3: Perder 5+ INH de una vez (o 3+ con filia Umbral bajo) dispara Arrebato de Lujuria (1d6 asaltos, Tabla A): otorga +1 dado de bonificación a Técnica/Seducción, -1 dado de penalización a Resistencia Carnal/POD/INT, prohíbe quemar PM para resistir y al terminar exige tirada de COR (Colgajo de Lucidez).',
  umbralesYBrutal:
    'Sección 3.5: Umbrales al cruzar 75% (Tabla B), 50% (Tabla C), 25% (Tabla D), aviso pactado a <=10 INH y 0 INH (Tabla E con co-escritura obligatoria: velo, servidumbre ritual no sexual, retirada o resistencia). Un Golpe Brutal (10+ INH de golpe) escala un nivel la tabla. Ningún umbral se dispara dos veces.',
  diario:
    'Sección 3.7: El Diario de la Caída documenta la escena en 1.ª persona y concede una vez +1 AC o +10% a la primera tirada relacionada (nunca cura COR ni INH).',
  combateIntimo:
    'Sección 5.1–5.6: Tiradas enfrentadas usando Aguante Carnal (AC = (CON+POD)/10). Quemar hasta 3 PM da +10%/PM; el coste en INH (+1 INH por PM quemado) se acumula y se paga al final SOLO si el encuentro termina en derrota/clímax. Éxito Arduo suma -10% acumulativo; Extremo/Crítico hace 2d6/2d6+3 AC + 1 PM + 1d3 INH. Resistencia de Hierro (1/encuentro) exige Resistencia Carnal Extrema (1/5) para romper limpio. Clímax en derrota: 1d6 INH (2d6 si victoria Extrema/ritual) + drenaje según entidad (CON permanente en Vástago, POD permanente en Falso Confidente con Cascarón a <=20 POD) + tirada de COR del Despertar (fallo: 1d2 COR).',
  recuperacion:
    'Sección 7: Velo y distancia (+1 INH / +1 COR por descanso limpio), Trauma purgativo (+1d3 INH a cambio de -1 COR) y Refugio del Cuerpo (7.2 con Lazo Íntimo: +1d3 COR, +1d3 AC, +1 INH, 1/sesión).',
  bestiarioResumen: BESTIARY_ENTITIES.map((e) => ({
    nombre: e.name,
    subtitulo: e.subtitle,
    climax: `${e.climaxEffectName}: ${e.climaxEffectDesc}`,
    debilidad: `${e.weaknessName}: ${e.weaknessDesc}`,
  })),
  grimorioResumen: GRIMORIO_SPELLS.map((s) => `${s.name} (${s.cost}): ${s.effect}`),
  reliquiasResumen: RELIQUIAS_CIRCULO.map((r) => `${r.name}: ${r.effect} | Precio: ${r.cursedPrice}`),
};

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  app.get('/api/health', (_req, res) => {
    const aiConfigured = Boolean(
      process.env.GEMINI_API_KEY &&
        process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
    );
    res.json({ ok: true, aiConfigured });
  });

  // Guardián Narrador (Sección 29: 7 pasos estructurados)
  app.post('/api/guardian/narrate', async (req, res) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_NOT_CONFIGURED',
        message:
          'Clave GEMINI_API_KEY no configurada en el servidor; usando el generador determinista local.',
      });
      return;
    }

    try {
      const {
        lugar,
        oficiante,
        promesa,
        precio,
        detalle,
        dialogo,
        narrativeLevel = 0,
        hardLimits = [],
        grietaOptIn,
      } = req.body ?? {};

      const safeLimits: string[] = Array.isArray(hardLimits)
        ? [...new Set([...hardLimits.map(String), 'Implicación de menores'])]
        : ['Implicación de menores'];

      const systemInstruction = [
        'Eres el Guardián de un juego de rol Lovecraftiano D100 ("Pecados de la Carne").',
        'Escribe siempre en español literario sobrio, preciso y atmosférico de horror cósmico.',
        narrativeLevel === 0
          ? 'NIVEL NARRATIVO 0 (VELO ESTRICTO): usa elipsis elegante y sugestión psicológica; cero descripciones corporales explícitas.'
          : 'NIVEL NARRATIVO 1 (SENSUAL LITERARIO): describe tensión, pulso, temperatura, respiración y geometría imposible sin explicitud gráfica ni vulgaridad.',
        'REGLA INQUEBRANTABLE (Sección 1.3.1): jamás incluyas menores ni situaciones con menores bajo ninguna circunstancia.',
        `LÍMITES DUROS DEL DOCUMENTO DE CONSENTIMIENTO (prohibido cruzarlos): ${safeLimits.join('; ')}.`,
        'Principio de mesa: Un éxito de Seducción o Persuasión nunca convierte un rechazo del personaje en consentimiento.',
        'Estructura estrictamente la escena siguiendo el método de la Sección 29: Umbral -> Reconocimiento -> Aproximación -> Objeción -> Pausa de decisión (ANTES de tirar dados) -> Regla BRP sugerida -> Imagen final.',
      ].join('\n');

      const promptParts = [
        `Semillas tiradas en la mesa (Secciones 22 y 28):`,
        `- Lugar: ${String(lugar || 'Umbral entre habitaciones')}`,
        `- Oficiante / Tentador: ${String(oficiante || 'Un desconocido familiar')}`,
        `- Promesa: ${String(promesa || 'Ser visto sin reservas')}`,
        `- Precio oculto: ${String(precio || 'Una deuda ritual')}`,
        `- Detalle ambiental: ${String(detalle?.lugar || '')} / ${String(detalle?.cuerpo || '')}`,
        `- Diálogo base: ${String(dialogo?.apertura || '')} | ${String(dialogo?.objecion || '')}`,
      ];
      if (grietaOptIn && (grietaOptIn.tentacion || grietaOptIn.senal)) {
        promptParts.push(
          `- Eco opcional de Grieta (solo Tentación y Señal): Tentación="${String(
            grietaOptIn.tentacion || ''
          )}", Señal="${String(grietaOptIn.senal || '')}".`
        );
      }

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: promptParts.join('\n'),
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              umbral: {
                type: Type.STRING,
                description: 'Descripción sensorial concreta del lugar y la geometría anómala.',
              },
              reconocimiento: {
                type: Type.STRING,
                description: 'Cómo aparece el oficiante y qué eco familiar reconoce el investigador.',
              },
              aproximacion: {
                type: Type.STRING,
                description: 'La oferta o promesa formulada con frialdad o magnetismo contenido.',
              },
              objecion: {
                type: Type.STRING,
                description: 'La grieta de duda u objeción moral que detiene la escena.',
              },
              pausaDecision: {
                type: Type.STRING,
                description: 'Pregunta directa al jugador para que decida antes de que rueden los dados.',
              },
              reglaSugerida: {
                type: Type.STRING,
                description: 'Tirada BRP D100 recomendada (p. ej. POD Arduo, INH o Psicología) con coste.',
              },
              imagenFinal: {
                type: Type.STRING,
                description: 'Una última imagen física breve que cierre el cuadro.',
              },
            },
            required: [
              'umbral',
              'reconocimiento',
              'aproximacion',
              'objecion',
              'pausaDecision',
              'reglaSugerida',
              'imagenFinal',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json({ scene: parsed });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error llamando a Gemini';
      res.status(502).json({ error: 'GEMINI_API_ERROR', message: msg });
    }
  });

  // Oráculo de Reglas (RAG sobre el módulo y tablas)
  app.post('/api/guardian/oracle', async (req, res) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_NOT_CONFIGURED',
        message: 'GEMINI_API_KEY no configurada en el servidor.',
      });
      return;
    }

    try {
      const { question, narrativeLevel = 0 } = req.body ?? {};
      const cleanQ = String(question || '').trim().slice(0, 600);
      if (!cleanQ) {
        res.status(400).json({ error: 'EMPTY_QUESTION', message: 'Escribe una duda de reglas.' });
        return;
      }

      const systemInstruction = [
        'Eres el Oráculo Oficial de Reglas del suplemento BRP D100 "Pecados de la Carne".',
        'Responde únicamente basándote en el compendio de reglas JSON adjunto. Cita siempre la sección exacta (ej. Sección 3.3, Sección 5.4, etc.).',
        'Sé conciso, práctico para mesa de rol y respetuoso con el tono sobrio (Nivel ' +
          narrativeLevel +
          ').',
        'Si una pregunta toca menores o contenido explícito prohibido, recuerda el Veto Universal de la Sección 1.3.1.',
      ].join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `BASE DE REGLAS DEL MÓDULO:\n${JSON.stringify(
          RULES_GROUNDING
        )}\n\nPREGUNTA DEL GUARDIÁN/JUGADOR:\n${cleanQ}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: {
                type: Type.STRING,
                description: 'Respuesta clara y precisa en español citando números y reglas.',
              },
              sectionsCited: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Lista breve de secciones citadas (p. ej. "Sección 5.1", "Sección 5.4").',
              },
            },
            required: ['answer', 'sectionsCited'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error llamando a Gemini';
      res.status(502).json({ error: 'GEMINI_API_ERROR', message: msg });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Pecados de la Carne] Servidor listo en http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Error al iniciar el servidor:', err);
  process.exit(1);
});
