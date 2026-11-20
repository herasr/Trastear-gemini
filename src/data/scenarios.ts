import { StoryArc, StoryNode } from '../types/game';

export const STORY_ARCS: StoryArc[] = [
  {
    id: 'vigilia-zarza',
    title: 'La Vigilia de la Zarza',
    subtitle: 'Escenario Completo · Sección 11',
    sourceSection: 'Sección 11 · Actos I–III',
    recommendedLevel: 'Nivel 0–1 (Velo / Sensual)',
    synopsis:
      'El invernadero de la finca Herrera lleva trece años en restauración. Una invitación sin remitente te convoca el sábado a la caída para presenciar cómo el jardín elige a su próximo jardinero.',
    startNodeId: 'zarza_intro',
    artworkKey: 'ninfa',
  },
  {
    id: 'umbrales-deseo',
    title: 'Los Umbrales del Deseo',
    subtitle: 'Antología del Mito · Sección 24',
    sourceSection: 'Secciones 17, 18 y 24',
    recommendedLevel: 'Nivel 0–1 (Velo / Sensual)',
    synopsis:
      'Seis puertas abiertas en la misma noche: una habitación que huele a mar, un salón de espejos, una mesa comunal, una cala sin mapa, un umbral hotelero y un teatro vacío. Primero decides; después ruedan los dados.',
    startNodeId: 'umbrales_hub',
    artworkKey: 'confidente',
  },
  {
    id: 'doble-vigilia',
    title: 'La Doble Vigilia',
    subtitle: 'Escenario de Clímax · Sección 13',
    sourceSection: 'Sección 13 · La Congregación Doblada',
    recommendedLevel: 'Nivel 1–2 Pactado',
    synopsis:
      'Bajo una casa corriente de barrio duerme la Congregación Doblada. Entre sus docenas de rostros conscientes hay alguien a quien conoces. La regla de la casa es simple: devuelve un rostro por cada vigilia completa resistida.',
    startNodeId: 'doble_acto1',
    artworkKey: 'doblada',
  },
];

export const STORY_NODES: Record<string, StoryNode> = {
  // ============================================================================
  // ARCO 1: LA VIGILIA DE LA ZARZA (SECCIÓN 11)
  // ============================================================================
  zarza_intro: {
    id: 'zarza_intro',
    arcId: 'vigilia-zarza',
    actLabel: 'Prólogo · Handout de Invitación',
    title: 'La carta con perfume de invernadero',
    location: 'Villa costera · Finca Herrera',
    entityArtwork: 'ninfa',
    ambientTag: 'zarza',
    textVelo: [
      'Sobre tu mesa descansa un sobre grueso, sellado con cera verde oscura. Al abrirlo, un olor dulce a tierra mojada y savia tibia llena la habitación.',
      '«Querido amigo: este año la casa quiere que vengas. Doña Aurelia decía que los jardines solo perdonan a quien se les entrega. La vigilia es el sábado, a la caída. No traigas flores: la casa las pone. Trae, eso sí, a quien quieras que te vea florecer. — A.»',
      'Llevas tres días investigando las desapariciones discretas de la villa —los llamados "traslados al extranjero"— y todos los hilos convergen en el invernadero de la finca Herrera, trece años "en restauración".',
    ],
    textSensual: [
      'Sobre tu mesa descansa un sobre grueso, sellado con cera verde oscura. Al romper el sello, un perfume tibio a savia y piel húmeda se pega a tus muñecas como una caricia que no pediste.',
      '«Querido amigo: este año la casa quiere que vengas. Doña Aurelia decía que los jardines solo perdonan a quien se les entrega. La vigilia es el sábado, a la caída. No traigas flores: la casa las pone. Trae, eso sí, a quien quieras que te vea florecer. — A.»',
      'El pulso te late un poco más abajo de la garganta. Llevas tres días siguiendo los "traslados al extranjero" de la villa y todos los pasos terminan ante las verjas empañadas de la finca Herrera.',
    ],
    guardianWhisper:
      'Nota del Guardián: Antes de entrar en Acto I, recuerda que puedes activar la Tarjeta X o la Palabra Ámbar en cualquier instante desde la barra superior.',
    choices: [
      {
        id: 'zarza_go_pueblo',
        label: 'Llegar a la plaza del pueblo al atardecer',
        sublabel: 'Acto I · Hablar con los vecinos y buscar a la viuda Amalia',
        directOutcome: {
          narrativeVelo: 'Desciendes por la calle empedrada. Nadie en la villa habla mal de los Herrera; sus sonrisas parecen sinceras y ligeramente febriles.',
          narrativeSensual: 'Desciendes por la calle empedrada. Los vecinos te miran con una calidez casi devota, como si ya hubieran decidido qué parte de ti pertenece al jardín.',
          nextSceneId: 'zarza_acto1_pueblo',
        },
      },
      {
        id: 'zarza_go_verja',
        label: 'Acudir directamente a la verja de la finca Herrera',
        sublabel: 'Prueba de CON Ardua ante el Perfume de la Zarza',
        skillCheck: {
          skill: 'CON',
          difficulty: 'ARDUO',
          label: 'Resistir el Perfume de la Zarza (CON Ardua)',
          onSuccess: {
            narrativeVelo: 'Contienes el aliento al cruzar la reja oxidada. El aire huele a la casa de tu infancia, pero logras mantener la mente despejada.',
            narrativeSensual: 'El aroma te roza el cuello como una boca tibia, pero aprietas los puños y obligas a tu respiración a seguir siendo tuya.',
            nextSceneId: 'zarza_acto1_anselmo',
          },
          onFail: {
            narrativeVelo: 'Al cruzar la verja inhalas demasiado hondo. El jardín huele a un recuerdo que no sabías que echabas de menos y cierras los ojos un segundo más de la cuenta.',
            narrativeSensual: 'El perfume se te mete bajo la piel y te afloja las rodillas; durante un instante deseas quedarte quieta entre los cristales empañados solo para seguir oliéndolo.',
            inhLoss: '1d3',
            nextSceneId: 'zarza_acto1_anselmo',
          },
        },
      },
    ],
  },

  zarza_acto1_pueblo: {
    id: 'zarza_acto1_pueblo',
    arcId: 'vigilia-zarza',
    actLabel: 'Acto I · El pueblo y el perfume',
    title: 'La viuda Amalia',
    location: 'Casa de postigo azul · Villa costera',
    entityArtwork: 'ninfa',
    ambientTag: 'zarza',
    textVelo: [
      'En una casa apartada encuentras a Amalia, la elegida de la vigilia del año pasado. Lleva una flor oscura en el ojal que no se marchita nunca y tiene ojeras hondas bajo unos ojos demasiado tranquilos.',
      'Sus palabras suenan a delirio para cualquiera del pueblo, pero cada detalle coincide con los archivos: trece años, trece elegidos que regresan sonriendo y callando.',
      'Si le tiendes la mano con calma, quizá recuerde qué ocurrió bajo el cristal.',
    ],
    textSensual: [
      'En la penumbra de su sala, Amalia se acaricia sin darse cuenta la flor negra del ojal. Su respiración es lenta, acompasada como si aún recordara el abrazo de los zarcillos del año pasado.',
      '«No duele —murmura cuando te acercas—. Lo terrible es que no duele nada y después todo lo demás parece frío.»',
      'Te mira las manos con una mezcla de envidia y súplica. Una palabra honesta o un contacto de consuelo podrían devolverle un instante de lucidez.',
    ],
    choices: [
      {
        id: 'amalia_escuchar',
        label: 'Escuchar su relato completo y tomarle la mano',
        sublabel: 'Tirada de Psicología · Posible Refugio / Advertencia',
        skillCheck: {
          skill: 'psicologia',
          difficulty: 'NORMAL',
          label: 'Leer la lucidez de Amalia (Psicología)',
          onSuccess: {
            narrativeVelo: 'Al estrechar su mano, Amalia recupera un recuerdo nítido: «No miren la flor cuando se abra; miren las manos de quien la sostiene». Ganas +1 AC por la cercanía humana.',
            narrativeSensual: 'Sus dedos fríos se aferran a los tuyos con gratitud desesperada. Antes de volver a ausentarse, te susurra al oído: «No miren la flor cuando se abra; miren las manos de quien la sostiene».',
            corLoss: '1',
            acDelta: 1,
            addFlag: 'advertencia_amalia',
            nextSceneId: 'zarza_acto1_anselmo',
          },
          onFail: {
            narrativeVelo: 'Su relato se disuelve en frases circulares sobre raíces tibias y un jardín que recuerda nombres. La impotencia te deja una punzada de inquietud.',
            narrativeSensual: 'Amalia sonríe con ternura ausente y te besa los nudillos antes de cerrar la puerta. El aroma de su ojal se queda en tus dedos.',
            corLoss: '1',
            nextSceneId: 'zarza_acto1_anselmo',
          },
        },
      },
      {
        id: 'amalia_saltar',
        label: 'Anotar su testimonio e ir hacia el invernadero',
        sublabel: 'Avanzar a la finca Herrera sin demora',
        directOutcome: {
          narrativeVelo: 'Guardas la libreta y caminas hacia la verja de los Herrera mientras la luz cae sobre los cristales empañados.',
          narrativeSensual: 'Dejas atrás la casa tibia de Amalia y sigues el rastro dulce que sube desde la verja de hierro.',
          nextSceneId: 'zarza_acto1_anselmo',
        },
      },
    ],
  },

  zarza_acto1_anselmo: {
    id: 'zarza_acto1_anselmo',
    arcId: 'vigilia-zarza',
    actLabel: 'Acto I · El jardín bajo andamios',
    title: 'Anselmo, el jardinero',
    location: 'Invernadero de la Finca Herrera',
    entityArtwork: 'sacerdote',
    ambientTag: 'zarza',
    textVelo: [
      'Anselmo te recibe junto a la puerta del invernadero. Es cordial, ojeroso, y lleva un guante sucio en una mano; al quitárselo para estrecharte la tuya ves una cicatriz de espina en el centro de la palma.',
      '«Aquí todos son bienvenidos, si traen buena voluntad —dice sin alzar la voz—. La restauración avanza cada año.»',
      'En una mesa lateral distinguen un cuaderno abierto: la lista de invitados en orden alfabético… salvo una letra añadida con tinta fresca: la tuya.',
    ],
    textSensual: [
      'Anselmo se acerca más de lo estrictamente cortés. Cuando te estrecha la mano, la cicatriz de su palma roza tu muñeca con un calor extraño, casi húmedo.',
      '«No molesta —sonríe al notar tu mirada—. Al contrario. Cuando el jardín te elige, aprendes a agradecer cada marca.»',
      'Sobre la mesa de podar descansa la lista alfabética de los trece elegidos, y al final, escrita con caligrafía cuidada, aparece tu inicial.',
    ],
    choices: [
      {
        id: 'anselmo_psicologia',
        label: 'Desafiar a Anselmo sobre el calendario de trece años',
        sublabel: 'Enfrentamiento social · Psicología o Persuasión',
        skillCheck: {
          skill: 'persuasion',
          difficulty: 'ARDUO',
          label: 'Presionar a Anselmo (Persuasión Ardua)',
          onSuccess: {
            narrativeVelo: 'Anselmo baja la vista un segundo. Comprendes que el incendio mataría a la Ninfa… pero también arrancaría algo vivo en los trece aldeanos vinculados.',
            narrativeSensual: 'Su máscara amable tiembla un instante. Admitirá sin palabras que los trece elegidos comparten savia con el invernadero: quemarlo les romperá la mente.',
            addFlag: 'sabe_dilema_fuego',
            nextSceneId: 'zarza_acto2_vispera',
          },
          onFail: {
            narrativeVelo: 'Anselmo sonríe con serenidad imperturbable: «Quien se marcha nunca quiere volver atrás. Ya lo entenderás esta noche.»',
            narrativeSensual: 'Su voz baja te envuelve con paciencia paternal. No te contradice; simplemente da por hecho que te quedarás.',
            inhLoss: '1',
            nextSceneId: 'zarza_acto2_vispera',
          },
        },
      },
      {
        id: 'anselmo_robar_aceite',
        label: 'Examinar el banco de podar en busca de frascos útiles',
        sublabel: 'Tirada de Buscar para obtener Aceite de la Zarza',
        skillCheck: {
          skill: 'buscar',
          difficulty: 'NORMAL',
          label: 'Registrar el invernadero (Buscar)',
          onSuccess: {
            narrativeVelo: 'Encuentras un frasco sellado de Aceite de la Zarza entre las herramientas de injerto y lo guardas sin que Anselmo lo advierta.',
            narrativeSensual: 'Tus dedos rozan un vial tibio de Aceite de la Zarza. Su textura sedosa promete resistencia contra los zarcillos si sabes pagar su precio.',
            addRelic: 'Aceite de la Zarza',
            nextSceneId: 'zarza_acto2_vispera',
          },
          onFail: {
            narrativeVelo: 'Solo hallas tijeras oxidadas y pétalos negros prensados entre páginas sin nombre.',
            narrativeSensual: 'Al rozar una espina olvidada sobre la mesa, una gota oscura se mezcla con tu piel.',
            inhLoss: '1',
            nextSceneId: 'zarza_acto2_vispera',
          },
        },
      },
    ],
  },

  zarza_acto2_vispera: {
    id: 'zarza_acto2_vispera',
    arcId: 'vigilia-zarza',
    actLabel: 'Acto II · La víspera',
    title: 'La visita nocturna antes de la vigilia',
    location: 'Posada de la villa · Madrugada',
    entityArtwork: 'confidente',
    ambientTag: 'zarza',
    textVelo: [
      'A medianoche, cuando repasas tus notas en la habitación, alguien llama suavemente a la puerta. Al abrir, la figura en el umbral tiene la voz y los modales de la persona que más echas de menos.',
      'No exige entrar. Te ofrece exactamente aquello que tu Grieta Personal añora: una absolución, una tregua o una respuesta sin preguntas, a cambio de bajar la guardia mañana durante la vigilia.',
      'Es la primera oferta de tentación consciente (Sección 3.2): puedes aceptar la tregua o cerrar la puerta.',
    ],
    textSensual: [
      'La medianoche huele a tierra mojada bajo la puerta. Quien llama habla con la cadencia exacta de alguien a quien deseaste o perdiste, y su mano se detiene a dos dedos de tu mejilla.',
      '«Solo quiero que descanses esta noche —susurra contra el marco—. Deja que mañana el jardín decida sin que pelees contra él.»',
      'La tentación no fuerza la cerradura: espera a que tú abras el pestillo desde dentro.',
    ],
    choices: [
      {
        id: 'vispera_refugio',
        label: 'Rechazar la visita y apoyarte en un Lazo Íntimo (Refugio del Cuerpo)',
        sublabel: 'Restaura AC completo y otorga ancla antes del Acto III',
        directOutcome: {
          narrativeVelo: 'Cierras la puerta con firmeza y buscas el recuerdo o la presencia de tu Lazo. El descanso genuino restaura por completo tu Aguante Carnal.',
          narrativeSensual: 'Apartas la tentación y te refugias en una presencia honesta, sin presencia anómala. La calma real devuelve todo tu Aguante Carnal y asienta tu voluntad.',
          acDelta: 20,
          nextSceneId: 'zarza_acto3_vigilia',
        },
      },
      {
        id: 'vispera_aceptar_tentacion',
        label: 'Aceptar el consuelo de la visita (Tentación aceptada 3.2)',
        sublabel: 'Ganas +3 PM y +15% en una prueba, a cambio de 1d6 INH',
        directOutcome: {
          narrativeVelo: 'Dejas que la voz entre un instante en la penumbra. Despiertas con energía sobrenatural en las venas, aunque algo dentro de ti cedió terreno.',
          narrativeSensual: 'Cedes al abrazo de la sombra conocida hasta que la respiración vuelve a ser tuya. Al alba guardas más poder mágico… y menos resistencia al perfume.',
          inhLoss: '1d6',
          pmDelta: 3,
          addMarca: 'Visitado en la víspera de la Zarza',
          nextSceneId: 'zarza_acto3_vigilia',
        },
      },
      {
        id: 'vispera_resistir_pod',
        label: 'Desenmascarar la ilusión con fuerza de voluntad',
        sublabel: 'Tirada de POD Normal para conservar entereza',
        skillCheck: {
          skill: 'POD',
          difficulty: 'NORMAL',
          label: 'Sostener la mirada contra la máscara (POD)',
          onSuccess: {
            narrativeVelo: 'Nombras la mentira en voz alta y la silueta se deshace en neblina vegetal. Conservas tu voluntad intacta para el sábado.',
            narrativeSensual: 'Sostienes la mirada hasta que la boca falsa se resquebraja como corteza seca. Tu cuerpo recuerda quién manda antes de dormir.',
            nextSceneId: 'zarza_acto3_vigilia',
          },
          onFail: {
            narrativeVelo: 'La figura se marcha sin violencia, pero su último susurro queda resonando en tus oídos hasta el amanecer.',
            narrativeSensual: 'Te niegas a tocar, pero la voz sigue hablándote detrás de la puerta hasta que el alba limpia las ventanas.',
            inhLoss: '1d3',
            nextSceneId: 'zarza_acto3_vigilia',
          },
        },
      },
    ],
  },

  zarza_acto3_vigilia: {
    id: 'zarza_acto3_vigilia',
    arcId: 'vigilia-zarza',
    actLabel: 'Acto III · La noche del sábado',
    title: 'Bajo el cristal roto del invernadero',
    location: 'Claros del invernadero · Medianoche',
    entityArtwork: 'ninfa',
    ambientTag: 'zarza',
    textVelo: [
      'Las antorchas rodean el estanque seco del invernadero. Anselmo oficia el rito menor con cinco miembros del Círculo y alza el cáliz de savia tibia.',
      'Entonces la tierra se abre entre las losas y la Ninfa de la Zarza Negra se yergue bajo la luna: pálida, coronada de hojas negras y envuelta en zarcillos vivos que respiran al ritmo de los presentes.',
      'Sus ojos —sin blanco ni pupila humana— se fijan directamente en ti. El jardín ha hecho su elección.',
    ],
    textSensual: [
      'Entre el humo dulce de las antorchas, los presentes respiran al unísono mientras Anselmo inclina el cáliz. El aire quema en la garganta como vino caliente.',
      'De entre la maleza emerge la Ninfa de la Zarza Negra. De lejos su belleza duele; de cerca, la tela que la cubre son zarcillos húmedos que se desenroscan con paciencia hacia tus tobillos.',
      'Su perfume pronuncia tu nombre sin palabras, prometiendo descanso si dejas caer las armas. Todos los ojos del círculo esperan tu respuesta.',
    ],
    choices: [
      {
        id: 'zarza_apartar_vista',
        label: 'Apartar la vista y resistir la manifestación (POD Normal)',
        sublabel: 'Evita la pérdida completa si superas POD; después decide tu acción',
        skillCheck: {
          skill: 'POD',
          difficulty: 'NORMAL',
          label: 'Apartar la mirada de la Ninfa (POD)',
          onSuccess: {
            narrativeVelo: 'Recuerdas la advertencia de Amalia y miras las manos de Anselmo en lugar de la flor. Solo sufres una leve punzada de vértigo.',
            narrativeSensual: 'Apartas los ojos justo cuando los zarcillos se abren. El deseo tira de tus muñecas, pero tu pulso se mantiene firme.',
            corLoss: '1',
            inhLoss: '1',
            nextSceneId: 'zarza_acto3_eleccion',
          },
          onFail: {
            narrativeVelo: 'La belleza y la deformidad te golpean a la vez: la mente retrocede ante la anatomía vegetal mientras tu cuerpo duda en huir.',
            narrativeSensual: 'No logras apartar la vista. Ves las espinas y la savia tibia sobre la piel cerosa, y lo peor no es el horror: es que deseas dar un paso hacia ella.',
            corLoss: '1d4+1',
            inhLoss: '1d6',
            nextSceneId: 'zarza_acto3_eleccion',
          },
        },
      },
      {
        id: 'zarza_combate_intimo',
        label: 'Sostenerle la mirada y entrar en Combate Íntimo (Sección 5)',
        sublabel: 'Duelo directo contra la Ninfa: busca la Inversión del Rito o resiste con Hierro',
        directOutcome: {
          narrativeVelo: 'Das un paso al frente bajo el cristal roto. Si consigues agotar su Aguante Carnal o resistir hasta el alba, podrás imponer tus condiciones al jardín.',
          narrativeSensual: 'Aceptas el pulso del invernadero cuerpo a cuerpo. Los zarcillos se cierran alrededor de tu cintura y comienza la coreografía de tres asaltos contra la Zarza.',
          triggerCombatEntityId: 'ninfa-zarza',
          nextSceneId: 'zarza_acto3_eleccion',
        },
      },
    ],
  },

  zarza_acto3_eleccion: {
    id: 'zarza_acto3_eleccion',
    arcId: 'vigilia-zarza',
    actLabel: 'Acto III · El dilema final',
    title: 'Las tres salidas del jardín',
    location: 'Corazón del Invernadero',
    entityArtwork: 'ninfa',
    ambientTag: 'zarza',
    textVelo: [
      'La vigilia alcanza su punto de quiebre. Anselmo aguarda con las manos abiertas, las antorchas arden cerca de la madera seca y la Ninfa inclina su rostro vegetal hacia ti.',
      'Tres desenlaces son posibles esta noche, y ninguno es gratuito:',
      'Prender fuego al invernadero liberará a la villa (a costa de un trauma terrible para los trece elegidos); cerrar el trato liberará a los trece a cambio de tu propio compromiso; o ejecutar la Inversión del Rito para extraer la savia sin doblegarte.',
    ],
    textSensual: [
      'El invernadero entero palpita como un solo pulmón. Los zarcillos esperan tu último gesto mientras el fuego de las antorchas tiembla a un paso de las enredaderas secas.',
      'Puedes reducir el jardín a cenizas, sellar un pacto nuevo en tu propia piel para liberar a Amalia y a los otros doce, o someter a la Ninfa con Ataduras para arrancarle su esencia.',
    ],
    choices: [
      {
        id: 'zarza_final_fuego',
        label: 'Arrojar las antorchas y quemar la Zarza',
        sublabel: 'Final I: Fuego · Salva a la villa, pero sacude a los vinculados',
        directOutcome: {
          narrativeVelo: 'Las llamas trepan por los cristales rotos y la savia crepita con un lamento casi humano. La villa queda libre, aunque la herida en los trece elegidos tardará años en cerrar.',
          narrativeSensual: 'El incendio consume la dulzura asfixiante del jardín. Entre el humo negro oyes a la Ninfa retirarse bajo tierra mientras el aroma a flores quemadas te persigue hasta la calle.',
          corLoss: '1d3',
          nextSceneId: 'zarza_final_fuego_end',
        },
      },
      {
        id: 'zarza_final_trato',
        label: 'Cerrar el trato: ofrecerte como nuevo prometido de la Vigilia',
        sublabel: 'Final II: Trato · Los trece regresan a casa; el jardín te reclama',
        directOutcome: {
          narrativeVelo: 'La Ninfa honra su palabra —nunca miente—. Trece personas despiertan libres en la villa mientras tú recibes la marca floral en la muñeca.',
          narrativeSensual: 'Inclinando la cabeza, aceptas el cáliz completo. La savia tibia sella tu nombre en la corteza del invernadero y los trece antiguos elegidos vuelven a respirar aire limpio.',
          inhLoss: '1d6',
          addMarca: 'Cicatriz floral de la Vigilia',
          addDeuda: 'Jardinero prometido de la Finca Herrera',
          nextSceneId: 'zarza_final_trato_end',
        },
      },
      {
        id: 'zarza_final_inversion',
        label: 'Intentar la Inversión del Rito (Ataduras Ardua)',
        sublabel: 'Final III: Inversión · Extraer la Lágrima de la Ninfa sin rendirte',
        skillCheck: {
          skill: 'ataduras',
          difficulty: 'ARDUO',
          label: 'Sujetar los zarcillos e invertir el rito (Ataduras Ardua)',
          onSuccess: {
            narrativeVelo: 'Anudas sus propios zarcillos contra la piedra del estanque. La Ninfa te mira con algo parecido al orgullo y entrega un frasco de su savia dorada.',
            narrativeSensual: 'Con precisión implacable dominas la tensión de las enredaderas hasta obligar al tallo a ceder. Por primera vez en trece años, alguien ha jugado su juego mejor que ella.',
            addRelic: 'Lágrima de la Ninfa',
            nextSceneId: 'zarza_final_inversion_end',
          },
          onFail: {
            narrativeVelo: 'Los zarcillos se escurren entre tus dedos y te azotan antes de retirarse a las raíces profundas.',
            narrativeSensual: 'Las espinas te abren la palma al zafarse y el jardín se cierra por este año dejándote sin savia y con la piel ardiendo.',
            pvDelta: -2,
            inhLoss: '1d4',
            nextSceneId: 'zarza_final_trato_end',
          },
        },
      },
    ],
  },

  zarza_final_fuego_end: {
    id: 'zarza_final_fuego_end',
    arcId: 'vigilia-zarza',
    actLabel: 'Epílogo · Final del Fuego',
    title: 'Cenizas que recuerdan la primavera',
    location: 'Finca Herrera al amanecer',
    entityArtwork: 'ninfa',
    ambientTag: 'zarza',
    isEnding: true,
    endingSummary: 'La villa es libre y Amalia recupera su voz. En el claro calcinado del invernadero, sin embargo, cada primavera brotan rosas negras sin que nadie las riegue.',
    textVelo: [
      'El sol encuentra vigas negras y vidrio fundido. Los vecinos te miran con mezcla de alivio y extrañeza, como quien despierta de una siesta demasiado larga.',
      'La cicatriz de la palma de Anselmo no desaparece: simplemente deja de dolerle "en el buen sentido", y él mismo pide marcharse del pueblo esa tarde.',
    ],
    textSensual: [
      'Al amanecer, el aire huele por fin a salitre y ceniza limpia. Amalia llora en el umbral de su casa, libre del perfume que la ataba.',
      'Pero al doblar la esquina hacia la estación, descubres un pétalo húmedo pegado al cuello de tu abrigo, todavía tibio.',
    ],
    choices: [],
  },

  zarza_final_trato_end: {
    id: 'zarza_final_trato_end',
    arcId: 'vigilia-zarza',
    actLabel: 'Epílogo · Final del Trato',
    title: 'El nuevo nombre en el jardín',
    location: 'Invernadero · Primer rayo de luz',
    entityArtwork: 'ninfa',
    ambientTag: 'zarza',
    isEnding: true,
    endingSummary: 'Trece personas regresan sanas con sus familias. Tú conservas tu vida y tu nombre, pero llevas una flor que no se marchita y un jardín que sabe esperar.',
    textVelo: [
      'La Ninfa cumple el pacto al pie de la letra. Al salir de la finca ves a los desaparecidos regresando a pie por el sendero de la costa.',
      'En tu muñeca queda la marca de una pequeña flor oscura. No duele. Solo late un poco más deprisa cuando llueve.',
    ],
    textSensual: [
      'Trece almas vuelven a sus casas al alba mientras tú caminas solo hacia el pueblo con el gusto dulce de la savia todavía en la lengua.',
      'Sabes que la campaña no ha terminado: el jardín nunca olvida a quien firmó el rescate de otros.',
    ],
    choices: [],
  },

  zarza_final_inversion_end: {
    id: 'zarza_final_inversion_end',
    arcId: 'vigilia-zarza',
    actLabel: 'Epílogo · Final de la Inversión',
    title: 'La savia en tus manos',
    location: 'Claros de la Finca Herrera',
    entityArtwork: 'ninfa',
    ambientTag: 'zarza',
    isEnding: true,
    endingSummary: 'Has vencido a la Ninfa en su propio lenguaje y arrebatado la Lágrima de la Ninfa. No muere: simplemente deja de florecer este año.',
    textVelo: [
      'Anselmo observa en silencio cómo guardas el frasco de cristal ámbar en el bolsillo. La Ninfa se hunde bajo la tierra húmeda sin hostilidad, casi con respeto.',
      'Tienes en tu poder una reliquia capaz de sanar heridas y cordura… si alguna vez te atreves a beberla.',
    ],
    textSensual: [
      'Atada entre sus propias enredaderas, la Ninfa inclina el rostro antes de desaparecer en el mantillo negro. Guardas su esencia tibia junto al pecho.',
      'Por primera vez en trece años, el invernadero queda en silencio sin haber cobrado su tributo.',
    ],
    choices: [],
  },

  // ============================================================================
  // ARCO 2: LOS UMBRALES DEL DESEO (SECCIÓN 24)
  // ============================================================================
  umbrales_hub: {
    id: 'umbrales_hub',
    arcId: 'umbrales-deseo',
    actLabel: 'Sección 24 · Antología de Tentaciones',
    title: 'Seis puertas abiertas esta noche',
    location: 'Encrucijada de la Vigilia',
    entityArtwork: 'confidente',
    ambientTag: 'mascara',
    textVelo: [
      'Cada entidad mayor del Mito no ataca con garras: ofrece aquello que el personaje todavía no se atreve a pedir despierto. La regla es invariable: primero decides qué permites o rechazas; solo después responden los dados.',
      'Elige qué puerta deseas cruzar esta noche. Puedes recorrer varias antes de cerrar el arco.',
    ],
    textSensual: [
      'Seis estancias respiran al otro lado del pasillo: la lluvia que sube por el cristal, el salón de espejos, la mesa que no juzga, la marea cálida, la puerta de un hotel y un escenario iluminado.',
      'En cada una puedes mirar desde el umbral, dialogar, ceder o enfrentarte en Combate Íntimo.',
    ],
    choices: [
      {
        id: 'hub_cthulhu',
        label: '24.1 La habitación que soñaba con el mar (Cthulhu)',
        sublabel: 'Seducción onírica · Consuelo y servidumbre',
        directOutcome: { narrativeVelo: 'La lluvia golpea los cristales a medianoche.', narrativeSensual: 'Las tuberías respiran con olor a algas y sal tibia.', nextSceneId: 'u_cthulhu' },
      },
      {
        id: 'hub_nyar',
        label: '24.2 El salón de la persona que pudiste ser (Nyarlathotep)',
        sublabel: 'Máscara · Deseo y elección manipulada',
        directOutcome: { narrativeVelo: 'Encuentras la puerta al final de una calle conocida.', narrativeSensual: 'Una máscara lisa adopta el tono exacto de tu piel.', nextSceneId: 'u_nyar' },
      },
      {
        id: 'hub_shub',
        label: '24.3 La mesa donde nadie apartaba la mirada (Shub-Niggurath)',
        sublabel: 'Pertenencia · Cuerpo y hambre compartida',
        directOutcome: { narrativeVelo: 'La casa comunal huele a pan caliente y tierra húmeda.', narrativeSensual: 'Alguien aparta un plato para hacerte sitio sin preguntar.', nextSceneId: 'u_shub' },
      },
      {
        id: 'hub_dagon',
        label: '24.4 Los votos que pronunciaba la marea (Dagon e Hydra)',
        sublabel: 'Linaje · Promesa abisal y transformación',
        directOutcome: { narrativeVelo: 'Doce antorchas arden sin moverse en la cala negra.', narrativeSensual: 'El agua cubre los tobillos más cálida que la sangre.', nextSceneId: 'u_dagon' },
      },
      {
        id: 'hub_yog',
        label: '24.5 La puerta que recordaba por los dos (Yog-Sothoth)',
        sublabel: 'Ausencia · Memoria y lazo no euclidiano',
        directOutcome: { narrativeVelo: 'A las tres y diecisiete aparece un pomo conocido en la pared.', narrativeSensual: 'Al otro lado espera alguien que aún recuerda tus manos.', nextSceneId: 'u_yog' },
      },
      {
        id: 'hub_hastur',
        label: '24.6 El último ensayo (Hastur)',
        sublabel: 'Representación · Libreto y pérdida de identidad',
        directOutcome: { narrativeVelo: 'Un acomodador inmóvil vestido de amarillo abre la sala.', narrativeSensual: 'Sobre la silla del escenario hay un libreto con tu nombre.', nextSceneId: 'u_hastur' },
      },
    ],
  },

  u_cthulhu: {
    id: 'u_cthulhu',
    arcId: 'umbrales-deseo',
    actLabel: '24.1 Cthulhu · Seducción onírica',
    title: 'La habitación que soñaba con el mar',
    location: 'Dormitorio a medianoche',
    entityArtwork: 'vastago',
    ambientTag: 'mar',
    textVelo: [
      'Despiertas convencido de que no estás solo. El colchón cede a tu espalda bajo un peso invisible y cada respiración en la pared trae olor a sal y algas mojadas.',
      '«No enciendas la luz —dice la voz de tu Lazo más cercano desde el lado vacío de la cama—. Si la enciendes, volverás a fingir que estás solo.»',
      'En el cristal, las gotas de lluvia suben despacio dibujando torres sumergidas. Una mano invisible roza la sábana y se detiene esperando tu decisión.',
    ],
    textSensual: [
      'El colchón se hunde a tu lado con el peso exacto del cuerpo que más añoras. El aliento junto a tu oído huele a mar profundo y pronuncia tu nombre con la aspereza exacta de tus recuerdos.',
      '«No quiero obligarte —susurra contra tu cuello—. Quiero que dejes de defenderte de algo que ya te ha encontrado.»',
      'Los dedos cálidos se detienen sobre la sábana, a centímetros de tu pecho. No avanzarán hasta que tú lo decidas.',
    ],
    choices: [
      {
        id: 'cth_apartar',
        label: 'Apartarse y encender la luz (POD Normal)',
        skillCheck: {
          skill: 'POD',
          difficulty: 'NORMAL',
          label: 'Apartar el sueño de R’lyeh (POD)',
          onSuccess: {
            narrativeVelo: 'La lámpara devuelve la habitación a su silencio ordinario. Pierdes 1 AC por la soledad súbita, pero conservas el cuarto.',
            narrativeSensual: 'Te incorporas y enciendes la luz. La almohada queda intacta y fría; pierdes 1 AC por el vacío que deja.',
            acDelta: -1,
            nextSceneId: 'umbrales_hub',
          },
          onFail: {
            narrativeVelo: 'No tocas nada, pero la voz continúa hablándote en la oscuridad hasta el amanecer.',
            narrativeSensual: 'Resistes el contacto físico, pero el rumor de marea dentro del pecho te acompaña toda la noche.',
            inhLoss: '1',
            nextSceneId: 'umbrales_hub',
          },
        },
      },
      {
        id: 'cth_interrogar',
        label: 'Interrogar a la voz (Ocultismo o Psicología)',
        skillCheck: {
          skill: 'ocultismo',
          difficulty: 'NORMAL',
          label: 'Descifrar la ciudad sumergida (Ocultismo)',
          onSuccess: {
            narrativeVelo: 'Identificas que la voz utiliza un recuerdo real de tu Lazo para abrir paso a R’lyeh. Obtienes una pista valiosa del culto.',
            narrativeSensual: 'Mientras escuchas su respiración descubres la fisura del engaño: no es tu Lazo, es el eco sumergido repitiendo tus palabras.',
            addFlag: 'pista_rlyeh',
            nextSceneId: 'umbrales_hub',
          },
          onFail: {
            narrativeVelo: 'Preguntar en la oscuridad solo invita a la voz a acercarse un palmo más.',
            narrativeSensual: 'Tus preguntas quedan respondidas con un silencio salobre que te eriza la nuca.',
            inhLoss: '1',
            nextSceneId: 'umbrales_hub',
          },
        },
      },
      {
        id: 'cth_aceptar',
        label: 'Aceptar el contacto (Velo / Elipsis narrativa)',
        sublabel: 'Recupera 1d4 AC, gana Marca de Inmersión y tira INH 1d4',
        directOutcome: {
          narrativeVelo: 'No apartas la mano. La escena se cierra en una elipsis de sal y alivio compartido. Al amanecer la sábana está seca, pero queda una hendidura en la almohada de al lado.',
          narrativeSensual: 'Dices que sí en voz alta. En el cristal, las torres sumergidas encienden sus ventanas al compás de la respiración compartida. Despiertas descansado… con sabor a mar en los labios.',
          acDelta: 3,
          inhLoss: '1d4',
          addMarca: 'Marca de Inmersión (R’lyeh)',
          nextSceneId: 'umbrales_hub',
        },
      },
    ],
  },

  u_nyar: {
    id: 'u_nyar',
    arcId: 'umbrales-deseo',
    actLabel: '24.2 Nyarlathotep · La máscara',
    title: 'El salón de la persona que pudiste ser',
    location: 'Salón de madera encerada y espejos',
    entityArtwork: 'confidente',
    ambientTag: 'mascara',
    textVelo: [
      'La invitación decía: «Ven vestido como la persona que habrías sido si nadie te hubiera enseñado a avergonzarte». Un portero sin rostro te abre paso al salón.',
      'Junto al espejo alto aguarda un anfitrión de mirada exacta. Sobre la mesa descansa una máscara lisa que adquiere el tono exacto de tu piel.',
      '«Póntela y nadie verá lo que temes que vean. Verán lo que deseabas que descubrieran. Puedes marcharte o cruzar esa puerta conmigo.»',
    ],
    textSensual: [
      'El perfume del salón es caro y antiguo. El anfitrión te mira sin prisa, como alguien que ya conoce todas tus objeciones antes de que las pronuncies.',
      'La máscara se calienta con solo acercar los dedos. Al otro lado de la puerta del fondo suena una risa idéntica a la tuya, pero mucho más libre.',
      '«No digas que te he obligado a desear la respuesta», sonríe el anfitrión sin tocar la máscara.',
    ],
    choices: [
      {
        id: 'nyar_marcharse',
        label: 'Marcharse conservando la invitación',
        directOutcome: {
          narrativeVelo: 'Sales a la noche fría con la tarjeta intacta. Puedes usarla como pista o quemarla para recuperar la calma (+1 AC).',
          narrativeSensual: 'Das la espalda a los espejos antes de escuchar de nuevo tu propia risa libre al otro lado. Recuperas 1 AC.',
          acDelta: 1,
          addRelic: 'Invitación en tinta violeta',
          nextSceneId: 'umbrales_hub',
        },
      },
      {
        id: 'nyar_hablar',
        label: 'Quedarse a hablar y sondear al anfitrión (Psicología Ardua)',
        skillCheck: {
          skill: 'psicologia',
          difficulty: 'ARDUO',
          label: 'Leer la cláusula del anfitrión (Psicología Ardua)',
          onSuccess: {
            narrativeVelo: 'Comprendes la trampa antes de rozar la porcelana: cada vez que uses la máscara, esta conservará un recuerdo tuyo.',
            narrativeSensual: 'Bajo su cortesía impecable ves el hambre del coleccionista: la máscara no oculta tu rostro, lo va sustituyendo.',
            addFlag: 'sabe_clausula_mascara',
            nextSceneId: 'umbrales_hub',
          },
          onFail: {
            narrativeVelo: 'Su respuesta es tan certera que terminas confesando un temor que no pensabas decir en voz alta.',
            narrativeSensual: 'Mientras hablas, el espejo te devuelve una postura tuya más recta y segura, como si ya te estuvieras probando la máscara.',
            inhLoss: '1d3',
            nextSceneId: 'umbrales_hub',
          },
        },
      },
      {
        id: 'nyar_usar',
        label: 'Ponerse la máscara y cruzar la puerta del espejo',
        sublabel: 'Ganas +10% a Seducción y Persuasión, 1 Deuda con la Máscara e INH 1d3',
        directOutcome: {
          narrativeVelo: 'La máscara se adhiere con un calor suave. La escena tras la puerta queda tras un velo de espejos ámbar; al salir, tardas un segundo de más en recordar tu expresión habitual.',
          narrativeSensual: 'Al cruzar hacia el cuarto forrado de espejos, tu reflejo ya no se avergüenza de nada. La entrega frente al cristal te deja una Deuda con la Máscara y un recuerdo que ya no es solo tuyo.',
          inhLoss: '1d3',
          addMarca: 'Deuda con la Máscara (Nyarlathotep)',
          addDeuda: '1 Deuda con el Salón de las Mil Promesas',
          nextSceneId: 'umbrales_hub',
        },
      },
    ],
  },

  u_shub: {
    id: 'u_shub',
    arcId: 'umbrales-deseo',
    actLabel: '24.3 Shub-Niggurath · Pertenencia',
    title: 'La mesa donde nadie apartaba la mirada',
    location: 'Casa comunal entre árboles negros',
    entityArtwork: 'cabra',
    ambientTag: 'rebano',
    textVelo: [
      'La casa huele a pan recién abierto, cera y tierra húmeda. Nadie te hace preguntas; mueven platos y copas para hacerte sitio como si llevaran horas esperándote.',
      'Una mujer de cabello recogido sirve una bebida oscura en una taza de barro. «Aquí no tienes que explicar las cicatrices. La Madre promete algo más difícil que la belleza: que nadie volverá a expulsarte.»',
      'Fuera, las ramas golpean los cristales al compás de una percusión lenta bajo el suelo.',
    ],
    textSensual: [
      'Un vapor cálido a miel quemada sube de la taza de barro. Por un instante sientes el cansancio compartido de toda la casa y una aceptación tan honda que desarma cualquier defensa.',
      '«¿Cuál es el precio?», preguntas. Ella apoya sus dedos cerca de los tuyos sin presionar: «Que cuando otra persona llegue a esta mesa, hagas sitio».',
    ],
    choices: [
      {
        id: 'shub_hospitalidad',
        label: 'Aceptar solo la hospitalidad y el pan',
        directOutcome: {
          narrativeVelo: 'Comes sin beber de la taza ritual y descansas junto al fuego. Recuperas 2 PV y 2 AC sin crear vínculo.',
          narrativeSensual: 'Compartes el pan tibio y el silencio amable sin cruzar al patio. El calor humano te restaura 2 PV y 2 AC.',
          pvDelta: 2,
          acDelta: 2,
          nextSceneId: 'umbrales_hub',
        },
      },
      {
        id: 'shub_comunion',
        label: 'Beber de la taza y unirte a la comunión del patio',
        sublabel: 'Cura 1d6 PV, crea Vínculo de Rebaño, cuesta INH 1d4',
        directOutcome: {
          narrativeVelo: 'Bebes el caldo tibio y sales al círculo de antorchas bajo velo estricto. Al despertar descubres que curaste tus heridas, pero percibes el pulso de toda la casa.',
          narrativeSensual: 'El calor de la bebida desciende hasta el vientre. Entre manos que no juzgan ni exigen explicaciones, tus heridas sanan mientras adquieres un Vínculo de Rebaño.',
          pvDelta: 4,
          inhLoss: '1d4',
          addMarca: 'Vínculo de Rebaño (Shub-Niggurath)',
          nextSceneId: 'umbrales_hub',
        },
      },
      {
        id: 'shub_combate',
        label: 'Enfrentar la presencia en el campo consagrado (Combate Íntimo)',
        directOutcome: {
          narrativeVelo: 'Sales al trigal negro más allá del patio y te enfrentas cara a cara a la Cabra de las Dos Sangres.',
          narrativeSensual: 'Rechazas la mesa para encarar directamente al numen que bendice la cosecha entre el trigo alto.',
          triggerCombatEntityId: 'cabra-dos-sangres',
          nextSceneId: 'umbrales_hub',
        },
      },
    ],
  },

  u_dagon: {
    id: 'u_dagon',
    arcId: 'umbrales-deseo',
    actLabel: '24.4 Dagon e Hydra · Linaje',
    title: 'Los votos que pronunciaba la marea',
    location: 'Cala sin mapa · Doce antorchas',
    entityArtwork: 'vastago',
    ambientTag: 'mar',
    textVelo: [
      'El sendero desciende entre rocas negras hasta una playa estrecha donde doce antorchas arden inmóviles contra el viento. El emisario espera en la orilla sin ocultar las líneas finas que se abren bajo sus orejas.',
      '«No te ofrezco un hogar. Te recuerdo que ya tienes uno», dice mientras el agua tibia cubre los tobillos y trae murmullos familiares desde el fondo.',
      'Puedes permanecer en la orilla, aceptar un favor de linaje o adentrarte en la corriente.',
    ],
    textSensual: [
      'El mar está casi corporal, más cálido que el aire nocturno. Los dedos finos del emisario rozan un instante tu muñeca y el olor a sal limpia resulta extrañamente reconfortante.',
      'En el murmullo de la marea oyes nombres pronunciados con afecto antiguo. «Si quieres verlo, la corriente puede enseñártelo.»',
    ],
    choices: [
      {
        id: 'dagon_orilla',
        label: 'Escuchar desde la orilla sin entrar al agua',
        directOutcome: {
          narrativeVelo: 'Permaneces en la arena negra escuchando el coro lejano. Ganas conocimiento del mito (+10% Ocultismo) a cambio de 1 INH.',
          narrativeSensual: 'Dejas que las olas mojen solo tus botas mientras aprendes los nombres antiguos de la costa (-1 INH).',
          inhLoss: '1',
          addFlag: 'conoce_votos_marea',
          nextSceneId: 'umbrales_hub',
        },
      },
      {
        id: 'dagon_entrar',
        label: 'Aceptar la inmersión ritual en la corriente',
        sublabel: 'Respiración temporal, visión abisal y Deuda Salada (INH 1d4)',
        directOutcome: {
          narrativeVelo: 'Sigues al emisario mar adentro bajo velo narrativo. Al regresar a la superficie descubres una línea brillante bajo las costillas y una Deuda Salada.',
          narrativeSensual: 'El agua te sostiene sin ahogarte mientras desciendes hasta la arena del fondo. Al volver a la playa toses agua limpia y comprendes que la marea ya conoce tu pulso.',
          inhLoss: '1d4',
          addDeuda: 'Deuda Salada con la Familia de la Marea',
          nextSceneId: 'umbrales_hub',
        },
      },
      {
        id: 'dagon_senora',
        label: 'Convocar a la Señora de las Aguas Dulces (Combate / Pacto)',
        directOutcome: {
          narrativeVelo: 'La matriarca de la corriente emerge frente a ti con la elegancia de una estatua antigua para negociar cara a cara.',
          narrativeSensual: 'El agua se aquieta y la Señora se acerca para presentar su contrato cuerpo a cuerpo.',
          triggerCombatEntityId: 'senora-aguas',
          nextSceneId: 'umbrales_hub',
        },
      },
    ],
  },

  u_yog: {
    id: 'u_yog',
    arcId: 'umbrales-deseo',
    actLabel: '24.5 Yog-Sothoth · Umbral',
    title: 'La puerta que recordaba por los dos',
    location: 'Habitación de hotel · 03:17 AM',
    entityArtwork: 'coro',
    ambientTag: 'cripta',
    textVelo: [
      'La puerta aparece a las tres y diecisiete en la pared donde antes colgaba un cuadro. Reconoces el pomo de latón de una casa que ya no existe.',
      'Al otro lado hay una habitación bañada en luz de tarde antigua. Entre las motas de polvo flotando esperan recuerdos exactos que nadie más podría conocer.',
      'El marco empieza a cerrarse despacio, como una exhalación.',
    ],
    textSensual: [
      'Al otro lado del umbral, la figura que más deseaste recuperar te mira con una tristeza auténtica. «Porque todavía piensas que tú y yo somos preguntas distintas», susurra.',
      'Flotan partículas de luz con escenas compartidas: manos bajo una mesa, trenes perdidos, palabras que nunca se dijeron a tiempo.',
    ],
    choices: [
      {
        id: 'yog_cerrar',
        label: 'Cerrar la puerta antes de que desaparezca',
        directOutcome: {
          narrativeVelo: 'Empujas la hoja hasta oír el clic de la cerradura. Pierdes 1 AC por el desgarro, pero ganas +10% a tu próxima resistencia.',
          narrativeSensual: 'Cierras el marco con ambas manos mientras el calor de la tarde antigua se disuelve tras el papel pintado.',
          acDelta: -1,
          addFlag: 'resistencia_yog',
          nextSceneId: 'umbrales_hub',
        },
      },
      {
        id: 'yog_compartir',
        label: 'Compartir un recuerdo desde el umbral sin cruzar',
        directOutcome: {
          narrativeVelo: 'Intercambias una memoria desde la distancia segura. Obtienes una verdad oculta y pierdes 1d3 INH.',
          narrativeSensual: 'Rozas los dedos al otro lado de la línea del umbral. Sientes una emoción que no es tuya y despiertas con una respuesta grabada.',
          inhLoss: '1d3',
          addMarca: 'Eco táctil en la palma',
          nextSceneId: 'umbrales_hub',
        },
      },
      {
        id: 'yog_cruzar',
        label: 'Cruzar la puerta hacia la habitación luminosa',
        sublabel: 'Crea Lazo No Euclidiano e INH 1d4',
        directOutcome: {
          narrativeVelo: 'Cruzas el marco. La escena ocurre tras un velo de tiempos superpuestos; al regresar, conservas un recuerdo que pertenecía a la otra persona.',
          narrativeSensual: 'Al cruzar, la frontera entre tu piel y la suya se vuelve difusa: cada caricia se siente en dos cuerpos a la vez. Regresas al hotel con un Lazo No Euclidiano activo.',
          inhLoss: '1d4',
          addMarca: 'Lazo No Euclidiano (Yog-Sothoth)',
          nextSceneId: 'umbrales_hub',
        },
      },
    ],
  },

  u_hastur: {
    id: 'u_hastur',
    arcId: 'umbrales-deseo',
    actLabel: '24.6 Hastur · Representación',
    title: 'El último ensayo',
    location: 'Teatro cerrado desde hace veinte años',
    entityArtwork: 'sacerdote',
    ambientTag: 'teatro',
    textVelo: [
      'Las luces del vestíbulo brillan sin polvo. Un acomodador inmóvil vestido de amarillo pálido abre la sala donde esperan dos sillas, un espejo alto y un libreto con tu nombre en la portada.',
      'Desde la primera fila, el director observa en silencio: «No interpretes el deseo. Deja que el deseo te interprete».',
      'En el espejo del fondo ves una versión tuya más segura, más hermosa… y que se mueve un segundo antes que tú.',
    ],
    textSensual: [
      'La luz ámbar sobre las tablas vuelve cálida cada sombra. Una figura ligada a tu pasado espera al otro lado del escenario mientras la página tres del libreto aparece subrayada en amarillo con una frase que aún no has pronunciado.',
      '«Conserva tu nombre si quieres —dice el director desde la penumbra—. Por ahora.»',
    ],
    choices: [
      {
        id: 'hastur_abandonar',
        label: 'Abandonar el escenario antes de leer la réplica',
        directOutcome: {
          narrativeVelo: 'Dejas caer el libreto y sales por la puerta de emergencia. Ver a tu reflejo adelantarse un segundo te cuesta 1 COR, pero sales libre.',
          narrativeSensual: 'Apartas la vista del espejo justo cuando tu reflejo empieza a sonreír por su cuenta. Sales a la calle fría (-1 COR).',
          corLoss: '1',
          nextSceneId: 'umbrales_hub',
        },
      },
      {
        id: 'hastur_confesar',
        label: 'Improvisar una confesión fuera del libreto (Persuasión)',
        skillCheck: {
          skill: 'persuasion',
          difficulty: 'NORMAL',
          label: 'Romper el guion con verdad (Persuasión)',
          onSuccess: {
            narrativeVelo: 'Dices algo que no estaba escrito en la página tres. El director cierra el cuaderno, recuperas 1d3 AC y rompes el hechizo teatral.',
            narrativeSensual: 'Tu voz verdadera desbarata la acústica perfecta de la sala. Recuperas 2 AC y el espejo vuelve a obedecerte.',
            acDelta: 2,
            nextSceneId: 'umbrales_hub',
          },
          onFail: {
            narrativeVelo: 'Incluso tu improvisación suena exactamente como la línea siguiente del libreto. Alguien aplaude desde la última fila.',
            narrativeSensual: 'Intentas cambiar el texto, pero las palabras salen con la cadencia ensayada por otro.',
            inhLoss: '1d3',
            nextSceneId: 'umbrales_hub',
          },
        },
      },
      {
        id: 'hastur_papel',
        label: 'Aceptar el papel y leer la página subrayada en amarillo',
        sublabel: 'Ganas +1 Punto de Papel y +15% Actuar/Seducción, pierdes INH 1d3',
        directOutcome: {
          narrativeVelo: 'Pronuncias la línea y la obra se representa bajo velo estricto hasta el aplauso final. Tu reflejo tarda un segundo de más en soltar la escena.',
          narrativeSensual: 'En cuanto lees la frase en amarillo, el teatro baja las luces. Diriges la escena frente al espejo mientras desde la butaca el director susurra que hables más alto para el público.',
          inhLoss: '1d3',
          addMarca: '1 Punto de Papel (Vestuario Amarillo)',
          nextSceneId: 'umbrales_hub',
        },
      },
    ],
  },

  // ============================================================================
  // ARCO 3: LA DOBLE VIGILIA (SECCIÓN 13 - CLÍMAX)
  // ============================================================================
  doble_acto1: {
    id: 'doble_acto1',
    arcId: 'doble-vigilia',
    actLabel: 'Acto I · El barrio que reza debajo',
    title: 'La casa de la cripta madre',
    location: 'Casa corriente · Portal de madera antigua',
    entityArtwork: 'doblada',
    ambientTag: 'cripta',
    textVelo: [
      'A simple vista es una casa de barrio más, salvo por el olor a floresta vieja que sube por el portal y por las visitas que entran cansadas de noche y salen serenas al alba.',
      'Anoche soñaste con la puerta de la cripta. Un cultista desertor —antiguo confesor del Círculo— te revela la regla absoluta de la casa:',
      '«La Congregación Doblada devuelve un rostro conocido por cada persona viva que resista una vigilia completa abajo, hasta el amanecer. Nunca ha perdido una apuesta.»',
    ],
    textSensual: [
      'La puerta de la cripta ya conoce tu nombre desde el sueño de anoche. El desertor tiembla al entregarte la llave: entre los rostros conscientes de esa masa palpitante hay alguien que amaste.',
      '«Abajo no te golpean —susurra—. Abajo te ofrecen todo lo que te faltó hasta que tú mismo pides quedarte.»',
    ],
    choices: [
      {
        id: 'doble_sonar_resistir',
        label: 'Prepararte y bajar a la cripta para la Vigilia Voluntaria',
        sublabel: 'Acto II · Secuencia de las tres pruebas nocturnas (Sección 13)',
        directOutcome: {
          narrativeVelo: 'Desciendes los escalones de piedra húmeda hasta el sótano abovedado. Decenas de respiraciones acompasadas llenan la oscuridad.',
          narrativeSensual: 'Bajas hacia la penumbra tibia. La masa respira como un coro de voces conocidas que extienden docenas de brazos para recibirte sin violencia.',
          corLoss: '1d3',
          nextSceneId: 'doble_acto2_prueba1',
        },
      },
      {
        id: 'doble_combate_directo',
        label: 'Encarar a la Congregación Doblada en Combate Íntimo directo',
        sublabel: 'Duelo completo Sección 5 contra la entidad de Nivel 3',
        directOutcome: {
          narrativeVelo: 'Entras en el círculo de velas dispuesto a sostener tu Aguante Carnal contra el abrazo unánime de la Doblada.',
          narrativeSensual: 'La Doblada reconoce tu rostro en cuanto pisas la cripta y avanza con todos sus brazos abiertos.',
          triggerCombatEntityId: 'congregacion-doblada',
          nextSceneId: 'doble_acto3_resolucion',
        },
      },
    ],
  },

  doble_acto2_prueba1: {
    id: 'doble_acto2_prueba1',
    arcId: 'doble-vigilia',
    actLabel: 'Acto II · Primer Nocturno',
    title: 'La Oferta de la Doblada',
    location: 'Cripta del Templo Madre',
    entityArtwork: 'doblada',
    ambientTag: 'cripta',
    textVelo: [
      'La primera hora de vigilia cae sobre tus hombros. Un rostro conocido asoma entre los pliegues de la Congregación y pronuncia exactamente la verdad sobre tu soledad.',
      'Debes resistir su Provocación (POD Normal) sin entregar tu Inhibición.',
    ],
    textSensual: [
      'El rostro que más echabas de menos sonríe con ternura desde la masa viva y te invita a dejar de pelear por una sola noche.',
      'Su voz no miente: ha sido mucha gente y sabe exactamente dónde te duele estar solo.',
    ],
    choices: [
      {
        id: 'prueba1_pod',
        label: 'Resistir la Oferta (POD Normal)',
        skillCheck: {
          skill: 'POD',
          difficulty: 'NORMAL',
          label: 'Sostener el primer nocturno (POD)',
          onSuccess: {
            narrativeVelo: 'Aprietas los dientes y mantienes la mirada fija en las velas del umbral. Sobrevives al primer nocturno sin ceder.',
            narrativeSensual: 'Escuchas la promesa sin dar un paso hacia los brazos abiertos. El primer nocturno pasa.',
            nextSceneId: 'doble_acto2_prueba2',
          },
          onFail: {
            narrativeVelo: 'La verdad de su oferta te golpea hondo (-1d4 INH), y desde ahora sabes siempre dónde está la puerta de la cripta.',
            narrativeSensual: 'Una parte de ti desea responderle que sí; pierdes 1d4 INH antes de recobrar el aliento para la segunda prueba.',
            inhLoss: '1d4',
            nextSceneId: 'doble_acto2_prueba2',
          },
        },
      },
    ],
  },

  doble_acto2_prueba2: {
    id: 'doble_acto2_prueba2',
    arcId: 'doble-vigilia',
    actLabel: 'Acto II · Segundo y Tercer Nocturno',
    title: 'El Abrazo y la Caricia de Muchos',
    location: 'Centro de la Cripta',
    entityArtwork: 'doblada',
    ambientTag: 'cripta',
    textVelo: [
      'A las tres de la madrugada, los brazos de la Doblada ciñen tu cuerpo para probar si tu Aguante Carnal resiste hasta el alba.',
      'Si logras superar Resistencia Carnal, completarás la vigilia con AC > 0 y la Doblada deberá cumplir su palabra.',
    ],
    textSensual: [
      'Docenas de manos tibias rodean tus hombros, tu cintura y tu rostro con una unanimidad imposible de igualar. No buscan herirte: buscan convencer a tu piel de que diga sí.',
      'Todo tu cuerpo recuerda cada falta de afecto mientras intentas aguantar hasta que asome la primera luz por el respiradero.',
    ],
    choices: [
      {
        id: 'prueba2_resistencia',
        label: 'Sostener la Resistencia Carnal hasta el amanecer',
        skillCheck: {
          skill: 'resistenciaCarnal',
          difficulty: 'NORMAL',
          label: 'Resistir el abrazo unánime (Resistencia Carnal)',
          onSuccess: {
            narrativeVelo: 'Con el primer rayo pálido del alba, los brazos retroceden en silencio. Has completado la vigilia con vida y voluntad propia: la Doblada cumple y libera el rostro pactado.',
            narrativeSensual: 'Tiemblas de agotamiento, pero no cediste el último límite. Al amanecer la masa se abre con respeto y deja salir a la persona que viniste a buscar.',
            acDelta: -4,
            addFlag: 'vigilia_completada',
            nextSceneId: 'doble_acto3_resolucion',
          },
          onFail: {
            narrativeVelo: 'El abrazo te arrastra al borde del clímax (-1d6 AC y -1d3 INH). Aún puedes luchar por el desenlace en el Acto III.',
            narrativeSensual: 'El calor unánime quiebra tus rodillas y te arrastra al interior del círculo (-1d6 AC, -1d3 INH). Despiertas al borde de la entrega cuando llega el alba.',
            acDelta: -6,
            inhLoss: '1d3',
            nextSceneId: 'doble_acto3_resolucion',
          },
        },
      },
      {
        id: 'prueba2_piedad',
        label: 'Invocar la Piedad: nombrar a un rostro concreto (Persuasión)',
        skillCheck: {
          skill: 'persuasion',
          difficulty: 'ARDUO',
          label: 'Nombrar un rostro para hacer dudar a la masa (Persuasión Ardua)',
          onSuccess: {
            narrativeVelo: 'Pronuncias su nombre completo. Ese rostro deja de sonreír y duda; la masa entera retrocede debilitada y te permite pasar al alba.',
            narrativeSensual: 'Tu voz atraviesa el coro con un nombre real que la masa había olvidado. La Doblada tiembla y te devuelve el espacio para respirar.',
            addFlag: 'vigilia_completada',
            nextSceneId: 'doble_acto3_resolucion',
          },
          onFail: {
            narrativeVelo: 'Todos los rostros repiten el nombre a la vez, absorbiendo tu intento en un susurro colectivo.',
            narrativeSensual: 'Tu llamada se pierde entre docenas de bocas que responden con cariño idéntico.',
            inhLoss: '1d3',
            nextSceneId: 'doble_acto3_resolucion',
          },
        },
      },
    ],
  },

  doble_acto3_resolucion: {
    id: 'doble_acto3_resolucion',
    arcId: 'doble-vigilia',
    actLabel: 'Acto III · El desgarro, el fuego o la negociación',
    title: 'Amanecer sobre el templo madre',
    location: 'Escalera de la Cripta',
    entityArtwork: 'doblada',
    ambientTag: 'cripta',
    textVelo: [
      'La noche termina. Tres caminos quedan sobre la mesa, y la campaña recordará cuál elegiste:',
      'Ejecutar la Liturgia de Desgarro para extraer el rostro pactado; prender fuego a la cripta sabiendo que los rostros gritarán pidiendo que no pares; o aceptar la última negociación de la Doblada.',
    ],
    textSensual: [
      'La luz gris de la mañana entra por la rendija superior. Puedes llevar a cabo la cirugía ritual del desgarro, consumirlo todo en fuego o escuchar la última oferta de paz de la Congregación.',
    ],
    choices: [
      {
        id: 'doble_desgarro',
        label: 'El Desgarro (La Piedad): extraer al ser querido con rito',
        directOutcome: {
          narrativeVelo: 'Cuatro horas de liturgia ardua separan la carne prestada de la propia. El liberado despierta respirando aire frío por primera vez en meses.',
          narrativeSensual: 'Con paciencia quirúrgica y palabras limpias arrancas un nombre de la masa sin destruir a los demás. La cicatriz queda, pero vuelve vivo.',
          corLoss: '1',
          nextSceneId: 'doble_final_desgarro',
        },
      },
      {
        id: 'doble_fuego',
        label: 'El Fuego (La Crueldad Lúcida): quemar la cripta entera',
        directOutcome: {
          narrativeVelo: 'El aceite arde rápido entre los cimientos. Escuchar a la masa arder cuesta 1d6 de Cordura, pero el templo madre desaparece de la ciudad.',
          narrativeSensual: 'Las llamas devoran los rostros que suplican que no detengas el calor. El edificio cae en cenizas y el horror queda sellado para siempre.',
          corLoss: '1d6',
          nextSceneId: 'doble_final_fuego',
        },
      },
      {
        id: 'doble_pacto',
        label: 'La Última Negociación: disolver el templo a cambio de un testigo',
        directOutcome: {
          narrativeVelo: 'La Doblada libera a todos los cautivos y se disuelve de la ciudad a cambio de una promesa pactada con calma.',
          narrativeSensual: 'Aceptas convertirte en el límite vivo del acuerdo: los demás salen libres hacia el amanecer mientras tú sellas la puerta desde dentro.',
          inhLoss: '1d6',
          nextSceneId: 'doble_final_negociacion',
        },
      },
    ],
  },

  doble_final_desgarro: {
    id: 'doble_final_desgarro',
    arcId: 'doble-vigilia',
    actLabel: 'Epílogo · La Misa de los Liberados',
    title: 'Lo perdido regresa con cicatrices',
    location: 'Salida de la casa del barrio',
    entityArtwork: 'doblada',
    ambientTag: 'cripta',
    isEnding: true,
    endingSummary: 'Has rescatado a quien amabas mediante la vigilia y la liturgia de desgarro. El templo sigue bajo tierra, pero sabes exactamente cuánto cuesta cada vida.',
    textVelo: [
      'Camináis juntos bajo la lluvia fina de la mañana. Quien volvió apenas habla, pero su mano aprieta la tuya con fuerza real.',
      'El barrio entero finge no haber oído nada durante la noche.',
    ],
    textSensual: [
      'El rescate no borra el recuerdo de la cripta, pero devuelve un cuerpo entero a la luz del día. El aftercare de la mesa cierra la sesión en calma.',
    ],
    choices: [],
  },

  doble_final_fuego: {
    id: 'doble_final_fuego',
    arcId: 'doble-vigilia',
    actLabel: 'Epílogo · Solar en Cenizas',
    title: 'El barrio que niega lo ocurrido',
    location: 'Solar calcinado',
    entityArtwork: 'doblada',
    ambientTag: 'cripta',
    isEnding: true,
    endingSummary: 'La Congregación Doblada ha ardido hasta los cimientos. En el solar vacío, sin embargo, ya brotan flores que nadie plantó.',
    textVelo: [
      'Los bomberos no encuentran explicación para la profundidad del sótano ni para la ausencia de restos identificables.',
      'Has salvado a la ciudad entera de un templo mayor, pagándolo con tus propios sueños.',
    ],
    textSensual: [
      'Sales cubierto de hollín y silencio. Nadie volverá a desaparecer por esa puerta, aunque en tus oídos persista el eco de los rostros.',
    ],
    choices: [],
  },

  doble_final_negociacion: {
    id: 'doble_final_negociacion',
    arcId: 'doble-vigilia',
    actLabel: 'Epílogo · El Resto que Habla',
    title: 'La puerta cerrada desde dentro',
    location: 'Cripta disuelta',
    entityArtwork: 'doblada',
    ambientTag: 'cripta',
    isEnding: true,
    endingSummary: 'Todos los rostros han sido liberados y el templo abandona la ciudad. Tu nombre queda grabado como leyenda y advertencia del arco.',
    textVelo: [
      'Decenas de personas despiertan en las calles cercanas sin recordar cómo volvieron a casa. El pacto se ha cumplido en sus términos exactos.',
    ],
    textSensual: [
      'Co-escrito con la mesa conforme a la Regla de Ratificación (3.5.2): el sacrificio consciente ha roto el círculo para siempre.',
    ],
    choices: [],
  },
};
