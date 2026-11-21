# Pecados de la Carne · Mesa Interactiva BRP D100

Mesa virtual interactiva (VTT + librojuego) para el módulo de horror erótico-cósmico **Pecados de la Carne**, diseñado para *Call of Cthulhu 7.ª / Basic Roleplaying (BRP)*.

## Características principales

- **Motor BRP D100 puro (`src/utils/brpEngine.ts`)**:
  - Dados de bonificación/penalización reales sobre decenas, grados de éxito (`Crítico`, `Extremo`, `Arduo`, `Normal`, `Fallo`, `Pifia`).
  - **Regla de la Primera Vez (Sec. 3.2)**: la primera tirada de Inhibición de la campaña usa el `POD` completo.
  - **Arrebato de Lujuria (Sec. 3.3)**: `+1D` a Técnica/Seducción, `-1D` a Resistencia Carnal/`POD`/`INT`, prohibición de quemar PM en defensa y tirada de *Colgajo de Lucidez* (`COR`) al finalizar.
  - **Combate Íntimo y Clímax (Sec. 5.1–5.6)**: Aguante Carnal (`AC`), acumulación de PM quemados cobrados en `INH` **solo en caso de derrota**, pérdida de `1d6`/`2d6 INH`, drenaje permanente de `CON` (`CON 0` = muerte) y `POD` (`POD ≤ 20` = *Cascarón*), más tirada de Despertar (`COR`).
  - **Válvulas de Recuperación (Sec. 7)**: *Velo y distancia*, *Trauma purgativo* y *Refugio del Cuerpo (7.2)*, además del *Diario de la Caída (Sec. 3.7)* con bonificador de `+1 AC` o `+10%` a la primera tirada relacionada.
- **Seguridad de Mesa**:
  - Puerta de acceso **+18** y confirmación explícita de consentimiento en inicios rápidos.
  - **Veto Universal de Menores (Sec. 1.3.1)** bloqueado permanentemente y filtro automático sobre prosa generada.
  - **Tarjeta X** (atajo global `X`, con opciones de rebobinar a escena anterior, velar o saltar) y **Palabra Ámbar**.
  - **Co-escritura obligatoria en Tabla E (Sec. 3.5.2 y 17.7)** al alcanzar `0 INH`.
  - **Escala narrativa de tres niveles (Sec. 1.2)**: Nivel 0 *Velo estricto* (elipsis), Nivel 1 *Sensual literario* (no explícito) y Nivel 2 *Directo* (escenas íntimas completas). El Nivel 2 solo se activa si la Sesión Cero lo fija como máximo, lo que equivale al consentimiento unánime de la mesa (Sec. 1.3.1); en la barra de seguridad queda bloqueado por encima de ese máximo.
  - **Texto sin mecánica**: la prosa que lee el jugador nunca nombra reglas (tiradas, puntos, niveles). La mecánica se aplica desde los datos del nodo (`skillCheck`, `inhLoss`, `acDelta`…).
- **Guardián Narrador y Oráculo IA (servidor Express + Gemini)**:
  - Endpoints `/api/guardian/narrate` (Sección 29 estructurada en JSON) y `/api/guardian/oracle` (RAG sobre reglas y bestiario) manteniendo `GEMINI_API_KEY` estrictamente en servidor, con respaldo determinista local si no hay clave configurada.
  - Privacidad por diseño: nunca se envían notas de consentimiento, la `Herida` ni las entradas del Diario a la API.

## Contenido narrativo

Cada nodo de `src/data/scenarios.ts` tiene hasta tres versiones del texto: `textVelo` (Nivel 0), `textSensual` (Nivel 1) y `textDirecto` (Nivel 2, opcional). Lo mismo vale para los resultados: `narrativeVelo`, `narrativeSensual` y `narrativeDirecto`. Si falta la versión directa, el Nivel 2 recurre a la sensual; la directa nunca se muestra por debajo del Nivel 2. La selección está centralizada en `src/utils/narrativeText.ts`.

La campaña «La silla vacía» (12 sesiones en tres arcos) está descrita en `src/data/campaign.ts` y enlazada con los arcos jugables. Las pruebas de `src/utils/__tests__` validan el grafo de escenas, la ausencia de léxico explícito en los niveles 0 y 1 y la ausencia de mecánica en el texto narrado.

## Comandos

```bash
npm install
npm run dev      # Inicia Express + Vite en puerto 3000
npm test         # Ejecuta la batería de pruebas unitarias (Vitest)
npm run build    # Compila la aplicación cliente en dist/
npm start        # Sirve en producción desde node server.ts
```

## Aviso legal

Proyecto fan/no comercial compatible con *Basic Roleplaying* / *Call of Cthulhu*. *Call of Cthulhu* es marca registrada de Chaosium Inc. Todo el contenido adulto es estrictamente ficticio y está destinado únicamente a personas mayores de 18 años.
