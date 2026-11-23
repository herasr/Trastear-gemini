import { StoryArc, StoryNode } from '../types/game';

export const STORY_ARCS: StoryArc[] = [
  {
    id: 'vigilia-zarza',
    title: 'La Vigilia de la Zarza',
    subtitle: 'Escenario Completo · Sección 11',
    sourceSection: 'Sección 11 · Actos I–III',
    recommendedLevel: 'Nivel 0–2 (Velo / Sensual / Directo)',
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
    recommendedLevel: 'Nivel 0–2 (Velo / Sensual / Directo)',
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
    actLabel: 'Prólogo · Carta de invitación',
    title: 'La carta con perfume de invernadero',
    location: 'Villa costera · Finca Herrera',
    entityArtwork: 'ninfa',
    ambientTag: 'zarza',
    textVelo: [
      'Sobre tu mesa hay un sobre grueso, sellado con cera verde oscura. Al abrirlo sale un olor dulce, de tierra mojada y savia tibia, que se queda en la habitación como si alguien hubiera respirado allí.',
      '«Querido amigo: este año la casa quiere que vengas. Doña Aurelia decía que los jardines solo perdonan a quien se les entrega. La vigilia es el sábado, a la caída. No traigas flores: la casa las pone. Trae, eso sí, a quien quieras que te vea florecer. — A.»',
      'Llevas tres días siguiendo los «traslados al extranjero» de la villa: vecinos que se van sin despedirse y vuelven sin equipaje, cartas que llegan con su letra pero sin su voz. Todos los hilos acaban en el invernadero de la finca Herrera, cerrado desde hace trece años por obras que nunca empiezan.',
    ],
    textSensual: [
      'El sobre llega con la cera ya rota, como si alguien lo hubiera abierto y vuelto a cerrar con la lengua. Al desdoblar el papel, un perfume tibio a savia y piel húmeda se te queda en las muñecas y no se va al lavarte.',
      '«Querido amigo: este año la casa quiere que vengas. Doña Aurelia decía que los jardines solo perdonan a quien se les entrega. La vigilia es el sábado, a la caída. No traigas flores: la casa las pone. Trae, eso sí, a quien quieras que te vea florecer. — A.»',
      'Llevas tres días tras los «traslados al extranjero» de la villa, y cada hilo termina en las verjas empañadas de la finca Herrera. Cada vez que lo piensas se te acelera el pulso, un poco más abajo de la garganta, y no sabrías decir si es miedo.',
    ],
    guardianWhisper:
      'Nota del Guardián: Antes de entrar en el Acto I, recuerda que puedes activar la Tarjeta X o la Palabra Ámbar en cualquier instante desde la barra superior.',
    choices: [
      {
        id: 'zarza_go_pueblo',
        label: 'Llegar a la plaza del pueblo al atardecer',
        sublabel: 'Hablar con los vecinos y buscar a la viuda Amalia',
        directOutcome: {
          narrativeVelo: 'Bajas por la calle empedrada. Nadie habla mal de los Herrera. Sus sonrisas parecen sinceras, y algo en ellas está ligeramente febril.',
          narrativeSensual: 'Bajas por la calle empedrada. Los vecinos te miran con una calidez casi devota, como si ya hubieran decidido qué parte de ti pertenece al jardín.',
          nextSceneId: 'zarza_acto1_pueblo',
        },
      },
      {
        id: 'zarza_go_verja',
        label: 'Acudir directamente a la verja de la finca Herrera',
        sublabel: 'Hay que resistir el olor que sale del jardín',
        skillCheck: {
          skill: 'CON',
          difficulty: 'ARDUO',
          label: 'Resistir el perfume de la verja',
          onSuccess: {
            narrativeVelo: 'Contienes el aliento al cruzar la reja oxidada. El aire huele a la casa de tu infancia, pero consigues mantener la cabeza despejada.',
            narrativeSensual: 'El aroma te roza el cuello como una boca tibia. Aprietas los puños y obligas a tu respiración a seguir siendo tuya.',
            nextSceneId: 'zarza_acto1_anselmo',
          },
          onFail: {
            narrativeVelo: 'Al cruzar la verja inhalas demasiado hondo. El jardín huele a un recuerdo que no sabías que echabas de menos, y cierras los ojos un segundo más de la cuenta.',
            narrativeSensual: 'El perfume se te mete bajo la piel y te afloja las rodillas. Durante un instante quisieras quedarte entre los cristales empañados solo para seguir oliéndolo, y ese deseo te asusta más que el olor.',
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
      'En una casa apartada encuentras a Amalia, la elegida de la vigilia del año pasado. Lleva en el ojal una flor oscura que no se marchita, y tiene ojeras hondas bajo unos ojos demasiado tranquilos.',
      'Lo que cuenta suena a delirio para cualquiera del pueblo, pero cada detalle encaja con los papeles que has reunido: trece años, trece nombres, trece personas que regresan sonriendo y callando.',
      'Si le tiendes la mano con calma, quizá recuerde algo de lo que pasó bajo el cristal.',
    ],
    textSensual: [
      'En la penumbra de su sala, Amalia se acaricia sin darse cuenta la flor negra del ojal. Respira despacio, como si todavía sintiera en el pecho y en la garganta el abrazo de los zarcillos del año pasado.',
      '«No duele —murmura cuando te acercas—. Lo terrible es que no duele nada, y después todo lo demás te parece frío.»',
      'Te mira las manos con una mezcla de envidia y súplica. Una palabra honesta o un contacto de consuelo podrían devolverle un instante de lucidez.',
    ],
    choices: [
      {
        id: 'amalia_escuchar',
        label: 'Escuchar su relato completo y tomarle la mano',
        sublabel: 'Ver si todavía queda algo lúcido en ella',
        skillCheck: {
          skill: 'psicologia',
          difficulty: 'NORMAL',
          label: 'Leer la lucidez de Amalia',
          onSuccess: {
            narrativeVelo: 'Al estrechar su mano, Amalia recupera un recuerdo nítido: «No miren la flor cuando se abra; miren las manos de quien la sostiene». La cercanía humana te devuelve un poco de calma.',
            narrativeSensual: 'Sus dedos fríos se aferran a los tuyos con una gratitud desesperada. Antes de volver a perderse, te susurra al oído: «No miren la flor cuando se abra; miren las manos de quien la sostiene».',
            corLoss: '1',
            acDelta: 1,
            addFlag: 'advertencia_amalia',
            nextSceneId: 'zarza_acto1_anselmo',
          },
          onFail: {
            narrativeVelo: 'Su relato se deshace en frases circulares sobre raíces tibias y un jardín que recuerda nombres. La impotencia te deja una punzada de inquietud.',
            narrativeSensual: 'Amalia sonríe con una ternura ausente y te besa los nudillos antes de cerrar la puerta. El perfume de su ojal se queda en tus dedos durante horas.',
            corLoss: '1',
            nextSceneId: 'zarza_acto1_anselmo',
          },
        },
      },
      {
        id: 'amalia_saltar',
        label: 'Anotar su testimonio e ir hacia el invernadero',
        sublabel: 'Seguir hacia la finca Herrera sin demora',
        directOutcome: {
          narrativeVelo: 'Guardas la libreta y caminas hacia la verja de los Herrera mientras la luz se apaga sobre los cristales empañados.',
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
    location: 'Invernadero de la finca Herrera',
    entityArtwork: 'sacerdote',
    ambientTag: 'zarza',
    textVelo: [
      'Anselmo te recibe junto a la puerta del invernadero. Es cordial y ojeroso, y lleva un guante sucio en una mano. Al quitárselo para estrecharte la tuya, ves una cicatriz de espina en el centro de la palma.',
      '«Aquí todos son bienvenidos, si traen buena voluntad —dice sin alzar la voz—. La restauración avanza cada año.»',
      'En una mesa lateral hay un cuaderno abierto con la lista de invitados, en orden alfabético. Al final, con tinta fresca, han añadido una letra: la tuya.',
    ],
    textSensual: [
      'Anselmo se acerca más de lo estrictamente cortés. Cuando te estrecha la mano, la cicatriz de su palma roza tu muñeca con un calor extraño, casi húmedo, y se queda ahí un segundo de más.',
      '«No molesta —sonríe al ver tu mirada—. Al contrario. Cuando el jardín te elige, aprendes a agradecer cada marca.»',
      'Sobre la mesa de podar descansa la lista de los trece elegidos. Debajo de la última inicial, escrita con una caligrafía cuidada, aparece la tuya.',
    ],
    choices: [
      {
        id: 'anselmo_psicologia',
        label: 'Desafiar a Anselmo sobre el calendario de trece años',
        sublabel: 'Convencerle de que pare, o resistir su calma',
        skillCheck: {
          skill: 'persuasion',
          difficulty: 'ARDUO',
          label: 'Presionar a Anselmo',
          onSuccess: {
            narrativeVelo: 'Anselmo baja la vista un segundo. Entiendes que quemar el invernadero mataría a la Ninfa, pero también arrancaría algo vivo en los trece aldeanos unidos a ella.',
            narrativeSensual: 'Su máscara amable tiembla. No lo dice, pero se le nota: los trece elegidos comparten savia con el invernadero, y quemarlo les romperá la mente.',
            addFlag: 'sabe_dilema_fuego',
            nextSceneId: 'zarza_acto2_vispera',
          },
          onFail: {
            narrativeVelo: 'Anselmo sonríe con una serenidad que no se mueve: «Quien se marcha nunca quiere volver atrás. Lo entenderás esta noche.»',
            narrativeSensual: 'Su voz baja te envuelve con paciencia paternal. No te contradice; da por hecho que te quedarás.',
            inhLoss: '1',
            nextSceneId: 'zarza_acto2_vispera',
          },
        },
      },
      {
        id: 'anselmo_robar_aceite',
        label: 'Examinar el banco de podar en busca de frascos útiles',
        sublabel: 'Registrar el invernadero con cuidado',
        skillCheck: {
          skill: 'buscar',
          difficulty: 'NORMAL',
          label: 'Registrar el invernadero',
          onSuccess: {
            narrativeVelo: 'Encuentras un frasco sellado de aceite de zarza entre las herramientas de injerto y lo guardas sin que Anselmo lo note.',
            narrativeSensual: 'Tus dedos rozan un vial tibio de aceite de zarza. Su textura es sedosa y promete protección contra los zarcillos, a cambio de un precio que todavía no conoces.',
            addRelic: 'Aceite de la Zarza',
            nextSceneId: 'zarza_acto2_vispera',
          },
          onFail: {
            narrativeVelo: 'Solo encuentras tijeras oxidadas y pétalos negros prensados entre páginas sin nombre.',
            narrativeSensual: 'Al rozar una espina olvidada sobre la mesa, una gota oscura se mezcla con tu piel y tarda en secarse.',
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
      'A medianoche, mientras repasas tus notas, alguien llama suavemente a la puerta. Al abrir, la figura del umbral tiene la voz y los gestos de la persona que más echas de menos.',
      'No pide entrar. Te ofrece exactamente lo que más necesitas: una absolución, una tregua o una respuesta sin preguntas, a cambio de que bajes la guardia durante la vigilia de mañana.',
      'Es la primera oferta consciente de esta noche: puedes aceptar la tregua o cerrar la puerta.',
    ],
    textSensual: [
      'La medianoche huele a tierra mojada bajo la puerta. Quien llama habla con la cadencia exacta de alguien a quien deseaste o perdiste, y su mano se detiene a dos dedos de tu mejilla.',
      '«Solo quiero que descanses esta noche —susurra contra el marco—. Deja que mañana el jardín decida sin que tengas que pelear contra él.»',
      'La tentación no fuerza la cerradura. Espera a que seas tú quien abra el pestillo desde dentro.',
    ],
    choices: [
      {
        id: 'vispera_refugio',
        label: 'Rechazar la visita y buscar la compañía de alguien de confianza',
        sublabel: 'Descansar de verdad, con una presencia honesta',
        directOutcome: {
          narrativeVelo: 'Cierras la puerta con firmeza y buscas la presencia de alguien en quien confías. El descanso honesto te devuelve la fuerza por completo.',
          narrativeSensual: 'Apartas la tentación y te refugias en una presencia real, sin nada anómalo cerca. La calma verdadera te devuelve el cuerpo entero y asienta tu voluntad.',
          acDelta: 20,
          nextSceneId: 'zarza_acto3_vigilia',
        },
      },
      {
        id: 'vispera_aceptar_tentacion',
        label: 'Aceptar el consuelo de la visita',
        sublabel: 'Ganas poder, pero algo dentro de ti cede',
        directOutcome: {
          narrativeVelo: 'Dejas que la voz entre un instante en la penumbra. Despiertas con una energía que no es del todo tuya, aunque algo dentro de ti ha cedido terreno.',
          narrativeSensual: 'Cedes al abrazo de la sombra conocida hasta que tu respiración vuelve a ser tuya. Al alba tienes más poder en las manos y menos resistencia frente al perfume.',
          narrativeDirecto: 'Abres. El pestillo cede con el mismo chasquido seco de siempre y la figura entra sin esperar a que te apartes, y el pasillo de la posada se queda a oscuras detrás de ella. Huele a tierra mojada y a savia tibia, un olor de invernadero que se mete en el cuarto antes que el cuerpo. Tiene la cara de la persona que más echas de menos, el pelo mojado de una lluvia que no ha caído y los ojos un poco demasiado quietos. No parpadea. Cierra la puerta con la espalda y te mira como se mira una cosa que se ha buscado mucho tiempo y aparece en el último cajón.\n\n—Qué pocas ganas tienes de dormir —dice, con la voz de ella, con ese tonillo irónico de cuando te pillaba despierto—. Ven aquí.\n\nLa mano que te toma por la muñeca es larga y tibia y tiene un callo de escribano en la yema del dedo medio. Algo de ese detalle te resbala por dentro, algo que sabías y no consigues ordenar, pero la mano ya te lleva hasta la cama, y la cama cruje de la misma manera que crujía la de casa.\n\nTe desabrocha la camisa sin prisa, botón a botón, y cada botón le cuesta lo mismo. La boca te recorre el cuello y baja, y notas un aliento a menta y a clorofila. Gimes por lo bajo porque la pared es fina y al otro lado alguien ronca. «Sh —te dice contra la clavícula—. Que no se enteren de lo bien que lo estás pasando.»\n\nEn el cuarto de al lado el ronquido se interrumpe. Tose un hombre, con tos de fumador, y golpea la pared con el puño dos veces. Os quedáis quietos, tú con la mano de la figura en la cintura, ella con la boca contra tu piel. Entonces la figura tose. Tose con exactitud la misma tos, con el mismo carraspeo final, y al otro lado el hombre vuelve a roncar convencido de haberse oído a sí mismo. Te mira. Sonríe con la boca de ella. «Aprendo rápido», dice.\n\nOs desnudáis como se desnuda quien lleva años sin hacerlo, con prisas y con torpezas: un botón que no cede, un pie que se enreda en el pantalón, un sudor que no sabías que tenías. Te tumba boca arriba. Pesa lo que pesa una persona, ni un gramo más, y su piel está exactamente a tu temperatura, de modo que no notas dónde acaba la tuya. Te recorre el vientre con la lengua, baja, se detiene en el interior del muslo, y cuando por fin te toma con la boca lo hace con una precisión que no tantea, que sabe. Te arqueas contra el colchón. Hundes los dedos en su pelo, que huele a lluvia y a hojas, y le pides que no pare con una voz que se te rompe a mitad de la frase.\n\nCuando la tienes entre las piernas te incorporas, la agarras de los hombros y le das la vuelta. Cede sin resistencia. Te colocas encima, con las rodillas a los lados de sus caderas, y la miras desde arriba con el pelo cayéndote sobre la cara. «Habla con tu voz —le dices—. La tuya, no la suya.» La figura tarda en contestar. Abre la boca y por un instante no sale nada, como una radio mal sintonizada, y después responde con un tono que no es de nadie y que, curiosamente, es mucho más amable: «No tengo». Te ríes a medias, y entonces comprendes que no era una broma.\n\nOs unís despacio. Notas la presión conocida y, debajo de ella, otra más ancha, como si en el mismo cuerpo hubiera dos distintos, y cada vez que te mueves llega una segunda respuesta un poco después, un eco carnal que te alcanza por dentro. Bajo tus palmas, en las costillas de la figura, algo late a otro ritmo que el de su pecho: un latido vegetal, lento, con pausas de cuatro segundos. Te besa. Os decís cosas pequeñas y sucias y tiernas, de las que solo se dicen quienes se han querido mucho: apodos, ofensas cariñosas, una promesa de desayuno. Ella te contesta a cada una con la voz de la otra persona y con las mismas pausas.\n\nTe corres con un temblor que empieza en las pantorrillas, con la frente apoyada en su clavícula y los dientes en su hombro para no gritar. Debajo de ti la figura se arquea y suelta un suspiro largo, y en ese suspiro hay una nota que no es humana, un chasquido de ramita seca. Os quedáis quietos. Un hilo de savia tibia y dulce te resbala por el costado y empapa la sábana.\n\nNo termina ahí. La figura te sujeta las caderas con sus manos largas y te hace moverte otra vez, despacio, y el placer llega más hondo y más lento, como una marea que sube sin hacer ruido. Te corres de nuevo con la cara hundida en la almohada, ahogando el sonido, con un aliento que huele a tierra en la nuca. Cuando por fin te quedas quieto estás empapado de sudor y de algo más espeso, y tienes sueño, un sueño de fiebre buena.\n\nAmaneces solo. El hueco de la almohada conserva la forma de una cabeza y huele a invernadero. En el lavabo, el agua de la jofaina se ha teñido de verde. Hay pétalos negros entre las sábanas, cinco o seis, pegados a la piel húmeda de tu cadera, y al levantarte descubres en los muslos huellas de dedos largos, de tres pliegues cada uno, que no duelen. Más tarde, en tu cuaderno de notas, entre dos páginas que no tocaste, encuentras prensado un pétalo más grande que los demás y debajo, con tu propia letra, una frase que no recuerdas haber escrito: «Gracias por abrir».',
          inhLoss: '1d6',
          pmDelta: 3,
          addMarca: 'Visitado en la víspera de la Zarza',
          nextSceneId: 'zarza_acto3_vigilia',
        },
      },
      {
        id: 'vispera_resistir_pod',
        label: 'Desenmascarar la ilusión con fuerza de voluntad',
        sublabel: 'Sostener la mirada y no ceder a la voz',
        skillCheck: {
          skill: 'POD',
          difficulty: 'NORMAL',
          label: 'Sostener la mirada contra la máscara',
          onSuccess: {
            narrativeVelo: 'Nombras la mentira en voz alta, y la silueta se deshace en niebla vegetal. Conservas la voluntad intacta para la noche del sábado.',
            narrativeSensual: 'Sostienes la mirada hasta que la boca falsa se resquebraja como corteza seca. Tu cuerpo recuerda quién manda antes de dormirte.',
            nextSceneId: 'zarza_acto3_vigilia',
          },
          onFail: {
            narrativeVelo: 'La figura se marcha sin violencia, pero su último susurro te acompaña hasta el amanecer.',
            narrativeSensual: 'Te niegas a abrir, pero la voz sigue hablándote al otro lado de la puerta hasta que la luz limpia las ventanas.',
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
      'Las antorchas rodean el estanque seco del invernadero. Anselmo oficia el rito breve con cinco miembros del Círculo y alza el cáliz de savia tibia, que humea en el aire frío.',
      'La tierra se abre entre las losas y la Ninfa de la Zarza Negra se yergue bajo la luna: pálida, coronada de hojas negras, envuelta en zarcillos que respiran al ritmo de los presentes. Su forma no encaja con ninguna anatomía humana, y los ojos de los demás se niegan a mirarla del todo.',
      'Sus ojos, sin blanco ni pupila humana, se fijan en ti. El jardín ha hecho su elección.',
    ],
    textSensual: [
      'Entre el humo dulce de las antorchas, los presentes respiran al unísono mientras Anselmo inclina el cáliz. El aire quema en la garganta como vino caliente, y cada inspiración te deja la boca más seca.',
      'De entre la maleza emerge la Ninfa. De lejos su belleza duele. De cerca, la tela que la cubre son zarcillos húmedos que se desenroscan con paciencia hacia tus tobillos, y la savia tibia gotea de sus espinas sobre la piedra.',
      'Su perfume pronuncia tu nombre sin palabras, y promete descanso si dejas caer las armas. Todos los ojos del círculo esperan tu respuesta, y tu cuerpo ya ha empezado a contestar por su cuenta.',
    ],
    textDirecto: [
      'Entre el humo dulce de las antorchas, los presentes respiran al unísono mientras Anselmo inclina el cáliz. El aire quema en la garganta como vino caliente, y cada inspiración te deja la boca más seca.',
      'De entre la maleza emerge la Ninfa. De lejos su belleza duele. De cerca, la tela que la cubre son zarcillos húmedos que se desenroscan con paciencia hacia tus tobillos, y la savia tibia gotea de sus espinas sobre la piedra.',
      'Su perfume pronuncia tu nombre sin palabras, y promete descanso si dejas caer las armas. Todos los ojos del círculo esperan tu respuesta, y tu cuerpo ya ha empezado a contestar por su cuenta.',
      'Un zarcillo te roza la muñeca y sube por el antebrazo con la lentitud de un dedo que dibuja. Se detiene en el hueco del codo, donde la piel es más fina, y se queda ahí tibio y húmedo. A tu alrededor, Anselmo y los cinco del círculo empiezan a gemir en voz baja, todos al mismo compás, y el sonido se mete bajo tu ropa como una corriente que busca el pecho.',
      'Cuando la Ninfa se acerca, el aire huele a flores que se pudren en una caja cerrada, dulces y pesadas. Su tela se abre sin ruido, y debajo no hay cuerpo sino una superficie cálida que se ondula al ritmo de tu respiración. Un tallo se enrosca en tu cintura, luego en tu muslo, y cada vuelta aprieta lo justo para que notes el calor de la savia en la piel. Puedes resistir, mirar a otra parte o dejar que la presión suba.',
    ],
    choices: [
      {
        id: 'zarza_apartar_vista',
        label: 'Apartar la vista y resistir la manifestación',
        sublabel: 'Si aguantas, decides tu siguiente paso',
        skillCheck: {
          skill: 'POD',
          difficulty: 'NORMAL',
          label: 'Apartar la mirada de la Ninfa',
          onSuccess: {
            narrativeVelo: 'Recuerdas la advertencia de Amalia y miras las manos de Anselmo en lugar de la flor. Solo sientes una leve punzada de vértigo.',
            narrativeSensual: 'Apartas los ojos justo cuando los zarcillos se abren. El deseo tira de tus muñecas con una fuerza que no esperabas, pero el pulso se mantiene firme.',
            corLoss: '1',
            inhLoss: '1',
            nextSceneId: 'zarza_acto3_eleccion',
          },
          onFail: {
            narrativeVelo: 'La belleza y la deformidad te golpean a la vez. La mente retrocede ante una anatomía que no debería existir, mientras tu cuerpo duda entre huir y acercarse.',
            narrativeSensual: 'No logras apartar la vista. Ves las espinas y la savia sobre la piel cerosa, y lo peor no es el horror, sino que deseas dar un paso hacia ella.',
            corLoss: '1d4+1',
            inhLoss: '1d6',
            nextSceneId: 'zarza_acto3_eleccion',
          },
        },
      },
      {
        id: 'zarza_combate_intimo',
        label: 'Sostenerle la mirada y aceptar el duelo',
        sublabel: 'Enfrentarte a la Ninfa cuerpo a cuerpo, sin apartar la vista',
        directOutcome: {
          narrativeVelo: 'Das un paso al frente bajo el cristal roto. Si logras agotar su fuerza o resistir hasta el alba, podrás imponer tus condiciones al jardín.',
          narrativeSensual: 'Aceptas el pulso del invernadero cuerpo a cuerpo. Los zarcillos se cierran alrededor de tu cintura, tibios y húmedos, y el duelo empieza sin pausas: cada tirón busca el calor bajo tu ropa y cada respuesta tuya devuelve el golpe.',
          narrativeDirecto: 'Sostienes la mirada y das un paso. Los cristales rotos crujen bajo tus suelas y el aire del invernadero te pega la camisa a la espalda, húmedo y dulce, con un fondo de carne tibia. La Ninfa baja la cabeza hacia ti. Mide dos metros veinte de cintura para arriba y su cuerpo es una corteza lisa y cálida, de color miel oscura, con vetas por las que corre un líquido que se ve latir. Del cuello a los tobillos lleva treinta y seis zarcillos del grosor de un dedo, cada uno rematado en una espina del largo de una uña que se retrae en la carne cuando te toca. Detrás, Anselmo los cuenta en voz baja, como quien reza un rosario.\n\nEl primer zarcillo te rodea la muñeca con la lentitud de un dedo que dibuja. El segundo te sube por el costado, por debajo de la ropa, y se detiene a la altura de las costillas, tibio y húmedo. No aprietan. Te sondean, como se toma el pulso a una planta, y notas que cada vez que tu corazón da un golpe la Ninfa lo anota con una presión idéntica. Te arrancas la camisa tú mismo, porque prefieres que el gesto sea tuyo.\n\nLos del círculo empiezan a gemir en voz baja, todos al mismo compás, cinco gargantas afinadas en una. El sonido te entra por la espalda y baja. Anselmo levanta el cáliz y la savia humea, y el olor te llena la cabeza hasta que no queda sitio para otra cosa. Dices una grosería en voz alta, de pura rabia, de puro miedo: «Anda, ven». La Ninfa no contesta con palabras. Contesta con un perfume que pronuncia tu nombre.\n\nEl duelo empieza sin pausas. Un tallo te rodea la cintura, otro el muslo, y de cada vuelta sale un calor de savia que se te mete por la piel. Tiras de uno y el otro se cierra; cedes un paso y la Ninfa avanza el suyo. Te pegas a su cuerpo de corteza y sientes la presión de muchos puntos a la vez, como si la planta entera te tocara por dentro. Algo caliente y resbaladizo se abre camino entre tus muslos y se detiene, a la espera, a la distancia exacta en que tu cuerpo no puede dejar de querer.\n\nSe desprende un cristal del techo y se estrella contra el borde del estanque seco. Os quedáis quietos un segundo. Una esquirla te raja el hombro, poca cosa, una línea roja que la Ninfa lame con un zarcillo antes de que el dolor llegue. Anselmo, desde el fondo, murmura una cifra: «Trece». No sabes si cuenta los años, los elegidos o los latidos que te quedan.\n\nTe oyes decir cosas que no pensabas. Que nunca te han tocado así. Que quieres más fuerte. Que te da igual quién mire. La Ninfa responde con el movimiento: cada frase tuya la sigue un zarcillo que busca el punto exacto, y cuando dices «ahí», ya estaba allí. En el círculo una mujer llora de gusto y un hombre se muerde el puño. Tú gimes contra la corteza caliente, y la corteza se ablanda bajo tu boca como una fruta madura.\n\nTe penetra por fases. Primero una presión ancha, redonda, que tu cuerpo acepta mientras la cabeza protesta; después un calor lento que sube por dentro y se queda donde está, y una vibración que viene de dentro, regular, a tres golpes por segundo, el ritmo exacto de la savia que corre bajo la corteza. Te agarras a sus hombros sin saber si te sostienes o te sostiene. Notas que algo dentro de ti se ha abierto como se abre una flor por la noche, sin ruido y sin pedir permiso.\n\nEntonces te das cuenta de que no te mira. Los ojos de la Ninfa, sin blanco ni pupila, están fijos en un punto por encima de tu hombro, en el techo roto, en la luna: atiende a otra cosa mientras te toma, como quien riega una maceta sin dejar de leer. Esa indiferencia te enfurece y te excita a la vez, y haces lo único que puedes. La sujetas por dos zarcillos, tiras, y la haces bajar la cara hasta la tuya. Por primera vez te mira. Dura un latido.\n\nTe corres con un grito que no reprimes. Todo el invernadero responde: los cinco del círculo se corren con el mismo suspiro, Anselmo cierra los ojos, y los zarcillos que te sujetan se tensan hasta el límite y vibran como cuerdas. Una gota de savia te cae entre los pechos y la sientes bajar. Durante un instante lo único que ves son hojas negras.\n\nCuando vuelves en ti sigues de pie, con los muslos temblando y la espina de un zarcillo clavada, suave, en la palma de la mano. La Ninfa te sostiene todavía por la cintura. El tallo que te sujetaba se afloja un instante, lo justo para que decidas si quieres seguir.',
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
    location: 'Corazón del invernadero',
    entityArtwork: 'ninfa',
    ambientTag: 'zarza',
    textVelo: [
      'La vigilia llega a su punto de quiebre. Anselmo espera con las manos abiertas, las antorchas arden cerca de la madera seca y la Ninfa inclina hacia ti su rostro vegetal.',
      'Hay tres salidas esta noche, y ninguna es gratuita.',
      'Puedes prender fuego al invernadero y liberar a la villa, con el precio de una herida terrible para los trece elegidos. Puedes cerrar el trato y devolver a los trece a sus casas a cambio de tu propio compromiso. O puedes arrancarle a la Ninfa su savia sin doblegarte ante ella.',
    ],
    textSensual: [
      'El invernadero entero late como un solo pulmón. Los zarcillos esperan tu último gesto, y el fuego de las antorchas tiembla a un paso de las enredaderas secas.',
      'Puedes reducir el jardín a cenizas. Puedes sellar un pacto nuevo en tu propia piel para liberar a Amalia y a los otros doce. O puedes someter a la Ninfa con las manos y las cuerdas hasta que te entregue su esencia, y sentir en los dedos cada tirón de su resistencia.',
    ],
    choices: [
      {
        id: 'zarza_final_fuego',
        label: 'Arrojar las antorchas y quemar la Zarza',
        sublabel: 'Final del fuego: salva a la villa y deja heridas en los vinculados',
        directOutcome: {
          narrativeVelo: 'Las llamas trepan por los cristales rotos y la savia crepita con un lamento casi humano. La villa queda libre, aunque la herida de los trece elegidos tardará años en cerrar.',
          narrativeSensual: 'El incendio consume la dulzura asfixiante del jardín. Entre el humo negro oyes a la Ninfa retirarse bajo tierra, y el olor de las flores quemadas te persigue hasta la calle.',
          corLoss: '1d3',
          nextSceneId: 'zarza_final_fuego_end',
        },
      },
      {
        id: 'zarza_final_trato',
        label: 'Cerrar el trato: ofrecerte como nuevo prometido de la vigilia',
        sublabel: 'Final del trato: los trece regresan y el jardín te reclama',
        directOutcome: {
          narrativeVelo: 'La Ninfa cumple su palabra, porque nunca miente. Trece personas despiertan libres en la villa, mientras tú recibes en la muñeca la marca de una flor.',
          narrativeSensual: 'Inclinando la cabeza, aceptas el cáliz entero. La savia tibia sella tu nombre en la corteza del invernadero, y los trece elegidos vuelven a respirar aire limpio.',
          inhLoss: '1d6',
          addMarca: 'Cicatriz floral de la vigilia',
          addDeuda: 'Jardinero prometido de la finca Herrera',
          nextSceneId: 'zarza_final_trato_end',
        },
      },
      {
        id: 'zarza_final_inversion',
        label: 'Intentar arrancarle la savia a la Ninfa',
        sublabel: 'Final de la savia: sujetar sus zarcillos sin rendirte',
        skillCheck: {
          skill: 'ataduras',
          difficulty: 'ARDUO',
          label: 'Sujetar los zarcillos y forzar la entrega',
          onSuccess: {
            narrativeVelo: 'Anudas sus propios zarcillos contra la piedra del estanque. La Ninfa te mira con algo parecido al orgullo y entrega un frasco de su savia dorada.',
            narrativeSensual: 'Con una precisión implacable dominas la tensión de las enredaderas hasta obligar al tallo a ceder. Por primera vez en trece años, alguien ha jugado su juego mejor que ella.',
            narrativeDirecto: 'Con una precisión implacable aprietas el primer nudo. Los zarcillos de la Ninfa resbalan entre tus dedos, tibios y húmedos, y por cada uno que atas contra la piedra del estanque aparece otro que te busca la muñeca. Sigues atando. Es un oficio de manos: tensar, trenzar, remeter el cabo. La Ninfa, que lleva trece años dirigiendo el juego, se queda quieta por primera vez, con la respiración agitada y la corteza brillante de sudor.\n\nLe recorres la superficie con las palmas abiertas. Cada fibra tiembla bajo tu tacto, y cuando te inclinas sobre ella la savia te gotea tibia por la muñeca. «Despacio», le dices, aunque no hable tu idioma, y obedece. Le pides más con un tirón de zarcillo, y obedece también. Descubres que tiene un punto flojo bajo la clavícula, un nudo de corteza más blanda, y apoyas ahí el pulgar. El invernadero entero se estremece.\n\nLa piedra del estanque está seca y resbaladiza de savia, y tienes que apoyar una rodilla en el borde para no perder pie. Un zarcillo suelto te azota el muslo, con la torpeza de un miembro que ha dejado de obedecer, sin maldad. Te ríes. «Quieta», le dices, y por una vez es verdad.\n\nLe hablas al oído sin saber si entiende: que ahora mandas tú, que va a hacerlo como tú digas, que lo has ganado. Tu voz sale grave y segura, la de alguien que no conocías. La Ninfa tiembla contra tus manos y a ti se te endurece el cuerpo entero de un gusto que no pensabas encontrar aquí, en un invernadero muerto, delante de cinco desconocidos que respiran con la boca abierta.\n\nLa Ninfa baja la cara hasta la tuya y te huele el cuello. Por primera vez desde que empezó la noche su perfume se vuelve áspero, torpe, casi un ruego, y la sientes rendirse con el cuerpo antes de que lo haga el resto de ella. Te sube a la garganta el placer de tenerla sometida, una alegría fea que no te enorgullece y que no vas a negar. En el círculo alguien deja caer el cáliz, que rueda por las losas sin romperse.\n\nCuando por fin suelta lo que llevaba guardado es una lágrima ámbar, densa, que le resbala por la corteza y que recoges en un frasco con las manos todavía temblando. Por primera vez en trece años alguien ha jugado su juego mejor que ella, y lo sabes porque su cuerpo se ha rendido antes que sus palabras. Al marcharte, uno de los zarcillos te roza el tobillo y se queda un segundo de más.',
            addRelic: 'Lágrima de la Ninfa',
            nextSceneId: 'zarza_final_inversion_end',
          },
          onFail: {
            narrativeVelo: 'Los zarcillos se escurren entre tus dedos y te azotan antes de retirarse a las raíces profundas.',
            narrativeSensual: 'Las espinas te abren la palma al zafarse, y el jardín se cierra por este año dejándote sin savia y con la piel ardiendo.',
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
    actLabel: 'Epílogo · Final del fuego',
    title: 'Cenizas que recuerdan la primavera',
    location: 'Finca Herrera al amanecer',
    entityArtwork: 'ninfa',
    ambientTag: 'zarza',
    isEnding: true,
    endingSummary: 'La villa queda libre y Amalia recupera la voz. En el claro quemado del invernadero, sin embargo, cada primavera brotan rosas negras que nadie riega.',
    textVelo: [
      'El sol encuentra vigas negras y vidrio fundido. Los vecinos te miran con una mezcla de alivio y extrañeza, como quien despierta de una siesta demasiado larga.',
      'La cicatriz de la palma de Anselmo no desaparece. Simplemente deja de dolerle, y esa misma tarde pide marcharse del pueblo.',
    ],
    textSensual: [
      'Al amanecer el aire huele por fin a salitre y a ceniza limpia. Amalia llora en el umbral de su casa, libre del perfume que la ataba.',
      'Pero al doblar la esquina hacia la estación encuentras un pétalo húmedo pegado al cuello del abrigo, todavía tibio.',
    ],
    choices: [],
  },

  zarza_final_trato_end: {
    id: 'zarza_final_trato_end',
    arcId: 'vigilia-zarza',
    actLabel: 'Epílogo · Final del trato',
    title: 'El nuevo nombre en el jardín',
    location: 'Invernadero · Primer rayo de luz',
    entityArtwork: 'ninfa',
    ambientTag: 'zarza',
    isEnding: true,
    endingSummary: 'Trece personas regresan sanas a sus familias. Tú conservas la vida y el nombre, pero llevas una flor que no se marchita y un jardín que sabe esperar.',
    textVelo: [
      'La Ninfa cumple el pacto al pie de la letra. Al salir de la finca ves a los desaparecidos volver a pie por el sendero de la costa.',
      'En tu muñeca queda la marca de una pequeña flor oscura. No duele. Solo late un poco más deprisa cuando llueve.',
    ],
    textSensual: [
      'Trece personas vuelven a sus casas al alba, mientras tú caminas solo hacia el pueblo con el sabor dulce de la savia todavía en la lengua.',
      'Sabes que la historia no ha terminado. El jardín nunca olvida a quien firma el rescate de otros.',
    ],
    choices: [],
  },

  zarza_final_inversion_end: {
    id: 'zarza_final_inversion_end',
    arcId: 'vigilia-zarza',
    actLabel: 'Epílogo · Final de la savia',
    title: 'La savia en tus manos',
    location: 'Claros de la finca Herrera',
    entityArtwork: 'ninfa',
    ambientTag: 'zarza',
    isEnding: true,
    endingSummary: 'Has vencido a la Ninfa en su propio lenguaje y te has llevado su lágrima. No muere: simplemente deja de florecer este año.',
    textVelo: [
      'Anselmo observa en silencio cómo guardas el frasco de cristal ámbar en el bolsillo. La Ninfa se hunde en la tierra húmeda sin hostilidad, casi con respeto.',
      'Tienes en tu poder algo capaz de sanar heridas y de devolver la calma… si alguna vez te atreves a beberlo.',
    ],
    textSensual: [
      'Atada entre sus propias enredaderas, la Ninfa inclina el rostro antes de desaparecer en el mantillo negro. Guardas su esencia tibia junto al pecho, y todavía sientes en la piel el peso de sus zarcillos.',
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
    location: 'Encrucijada de la vigilia',
    entityArtwork: 'confidente',
    ambientTag: 'mascara',
    textVelo: [
      'Cada entidad mayor del mito no ataca con garras. Ofrece aquello que todavía no te atreves a pedir despierto, y lo hace con una cortesía que tarda en parecerte extraña.',
      'El pasillo tiene seis puertas. Tras la primera, la lluvia sube por el cristal en lugar de bajar. Tras la segunda, un salón de espejos espera con las lámparas encendidas. Tras la tercera hay una mesa de madera sin nadie que juzgue. Tras la cuarta, una cala con doce antorchas quietas. Tras la quinta, una habitación de hotel donde el reloj marca siempre la misma hora. Tras la sexta, un escenario con un libreto ya escrito.',
      'Puedes cruzar más de una antes de que la noche se cierre. Ninguna te devolverá exactamente al punto en el que entraste.',
    ],
    textSensual: [
      'El pasillo huele a cera caliente, a sal y a una colonia que reconoces demasiado bien. Cada puerta está entreabierta, y por cada rendija se oye a alguien respirar como si llevara años esperando que pasaras.',
      'Tras la primera puerta, la lluvia sube por el cristal y deja huellas tibias en la madera. Tras la segunda, un salón de espejos devuelve tu reflejo con una sonrisa que no has ensayado. Tras la tercera, una mesa de madera que nadie vigila te invita a sentarte sin pedir nombre. Tras la cuarta, el agua de una cala te llega a los tobillos más cálida que la sangre. Tras la quinta, una cama deshecha con el hueco de otro cuerpo todavía marcado. Tras la sexta, un escenario en penumbra donde alguien pronuncia tu nombre en voz baja.',
      'En cada una puedes mirar desde el umbral, hablar, ceder o plantar cara.',
    ],
    choices: [
      {
        id: 'hub_cthulhu',
        label: 'La habitación que soñaba con el mar',
        sublabel: 'Seducción onírica en un dormitorio sin ventanas',
        directOutcome: { narrativeVelo: 'La lluvia golpea los cristales a medianoche. Empujas la primera puerta.', narrativeSensual: 'Las tuberías respiran con olor a algas y sal tibia. Empujas la primera puerta.', nextSceneId: 'u_cthulhu' },
      },
      {
        id: 'hub_nyar',
        label: 'El salón de la persona que pudiste ser',
        sublabel: 'Una máscara que aprende tu rostro antes que tú',
        directOutcome: { narrativeVelo: 'Encuentras la puerta al final de una calle conocida.', narrativeSensual: 'Una máscara lisa adopta el tono exacto de tu piel.', nextSceneId: 'u_nyar' },
      },
      {
        id: 'hub_shub',
        label: 'La mesa donde nadie apartaba la mirada',
        sublabel: 'Una casa comunal que tiene sitio para ti',
        directOutcome: { narrativeVelo: 'La casa comunal huele a pan caliente y tierra húmeda.', narrativeSensual: 'Alguien aparta un plato para hacerte sitio sin preguntar.', nextSceneId: 'u_shub' },
      },
      {
        id: 'hub_dagon',
        label: 'Los votos que pronunciaba la marea',
        sublabel: 'Una promesa que se paga con el cuerpo',
        directOutcome: { narrativeVelo: 'Doce antorchas arden sin moverse en la cala negra.', narrativeSensual: 'El agua cubre los tobillos más cálida que la sangre.', nextSceneId: 'u_dagon' },
      },
      {
        id: 'hub_yog',
        label: 'La puerta que recordaba por los dos',
        sublabel: 'Una habitación de tarde antigua con alguien que no se fue',
        directOutcome: { narrativeVelo: 'A las tres y diecisiete aparece un pomo conocido en la pared.', narrativeSensual: 'Al otro lado espera alguien que todavía recuerda tus manos.', nextSceneId: 'u_yog' },
      },
      {
        id: 'hub_hastur',
        label: 'El último ensayo',
        sublabel: 'Un teatro cerrado hace veinte años y un papel con tu nombre',
        directOutcome: { narrativeVelo: 'Un acomodador inmóvil vestido de amarillo abre la sala.', narrativeSensual: 'Sobre la silla del escenario hay un libreto con tu nombre subrayado.', nextSceneId: 'u_hastur' },
      },
    ],
  },

  u_cthulhu: {
    id: 'u_cthulhu',
    arcId: 'umbrales-deseo',
    actLabel: 'Sección 24.1 · Seducción onírica',
    title: 'La habitación que soñaba con el mar',
    location: 'Dormitorio a medianoche',
    entityArtwork: 'vastago',
    ambientTag: 'mar',
    textVelo: [
      'Despiertas convencido de que no estás solo. El colchón cede a tu espalda bajo un peso que no se reparte como lo haría un cuerpo, porque toca más puntos de los que tienes. Cada respiración que sale de la pared trae olor a sal y a algas mojadas, y el suelo está húmedo bajo los pies descalzos.',
      '«No enciendas la luz —dice la voz desde el lado vacío de la cama, con la entonación de la persona que más quieres—. Si la enciendes, volverás a fingir que estás solo.»',
      'En el cristal, las gotas de lluvia suben despacio y dibujan torres que no se corresponden con ninguna ciudad que hayas visto. Una mano invisible roza la sábana y se detiene a la espera de tu decisión.',
    ],
    textSensual: [
      'El colchón se hunde a tu lado con el peso exacto del cuerpo que más añoras. El aliento junto a tu oído huele a mar profundo y pronuncia tu nombre con la aspereza exacta de tus recuerdos.',
      '«No quiero obligarte —susurra contra tu cuello—. Quiero que dejes de defenderte de algo que ya te ha encontrado.»',
      'Los dedos cálidos se detienen sobre la sábana, a centímetros de tu pecho. No avanzarán hasta que tú lo decidas.',
    ],
    textDirecto: [
      'Despiertas convencido de que no estás solo. El colchón cede a tu espalda bajo un peso que no se reparte como lo haría un cuerpo, porque toca más puntos de los que tienes. Cada vez que respiras, la pared de enfrente devuelve un aire con olor a sal y a algas mojadas, y el suelo está húmedo bajo tus pies descalzos.',
      '«No enciendas la luz —dice la voz desde el lado vacío de la cama, con la entonación de la persona que más echas de menos—. Si la enciendes, volverás a fingir que estás solo.» Arrastra la última sílaba como lo hacía ella, y justo ahí te das cuenta de que lo hace con un latido de retraso, igual que quien repite una palabra aprendida de oído.',
      'El radiador, que lleva toda la noche haciendo ruido de tubería vieja, se calla. En el silencio oyes el reloj del pasillo, que ya no marca la hora y marca tu pulso, un segundo antes de que lo notes. En el cristal, que no sabías que tuviera esta habitación, las gotas de lluvia suben despacio y dibujan torres que no corresponden a ninguna ciudad que hayas visto.',
      'Sobre la sábana, a un palmo de tu pecho, hay una mano. Tiene siete pliegues en cada dedo y cada pliegue se dobla en una dirección distinta. No avanza. Espera, y tú notas que ya te has girado hacia ella sin haberlo decidido. Hace años que nadie te toca sin pedirte algo a cambio, y la vergüenza de querer llega antes que el deseo y se queda más tiempo que él.',
    ],
    choices: [
      {
        id: 'cth_apartar',
        label: 'Apartarse y encender la luz',
        sublabel: 'Resistir el contacto y devolver el cuarto a su silencio',
        skillCheck: {
          skill: 'POD',
          difficulty: 'NORMAL',
          label: 'Apartar el sueño de R’lyeh',
          onSuccess: {
            narrativeVelo: 'La lámpara devuelve la habitación a su silencio ordinario. Te quedas un momento a oscuras con la sensación de que alguien ha salido por la ventana, y aun así conservas el cuarto.',
            narrativeSensual: 'Te incorporas y enciendes la luz. La almohada queda intacta y fría, y el hueco del colchón tarda en dejar de hundirse. La soledad te cae encima de golpe, como un peso que antes te sostenía.',
            acDelta: -1,
            nextSceneId: 'umbrales_hub',
          },
          onFail: {
            narrativeVelo: 'No tocas nada, pero la voz sigue hablándote en la oscuridad hasta el amanecer, y cada frase cierra una puerta dentro de ti que no sabías que existía.',
            narrativeSensual: 'Resistes el contacto físico, pero el rumor de la marea dentro del pecho te acompaña toda la noche. Cada vez que cierras los ojos, la mano invisible vuelve a posarse sobre tu vientre.',
            inhLoss: '1',
            nextSceneId: 'umbrales_hub',
          },
        },
      },
      {
        id: 'cth_interrogar',
        label: 'Interrogar a la voz',
        sublabel: 'Buscar la fisura en la forma en que habla',
        skillCheck: {
          skill: 'ocultismo',
          difficulty: 'NORMAL',
          label: 'Descifrar la ciudad sumergida',
          onSuccess: {
            narrativeVelo: 'Identificas que la voz usa un recuerdo real de la persona que imita para abrir paso a R’lyeh. Reconoces la palabra que el culto repite cuando quiere que confíes, y la anotas en la libreta antes de perderla.',
            narrativeSensual: 'Mientras escuchas su respiración descubres la fisura del engaño: no es la persona que imitaba, es el eco sumergido repitiendo tus palabras con un retardo de un latido. Lo sabes porque cuando callas, el silencio sigue hablando.',
            addFlag: 'pista_rlyeh',
            nextSceneId: 'umbrales_hub',
          },
          onFail: {
            narrativeVelo: 'Preguntar en la oscuridad solo invita a la voz a acercarse un palmo más. Cuando te das cuenta, la respuesta ya está dentro de tu cabeza y no sabes de quién es.',
            narrativeSensual: 'Tus preguntas quedan respondidas con un silencio salobre que te eriza la nuca. El silencio huele a sal y te deja la boca seca.',
            inhLoss: '1',
            nextSceneId: 'umbrales_hub',
          },
        },
      },
      {
        id: 'cth_aceptar',
        label: 'Aceptar el contacto',
        sublabel: 'Dejar que la marea te reclame la noche entera',
        directOutcome: {
          narrativeVelo: 'No apartas la mano. Te abres a ella despacio, primero con cautela y luego sin nada que esconder, y la escena avanza como avanzan las mareas: sin prisa y sin preguntar. Cuando por fin te quedas quieto, la sábana está húmeda y fría bajo tu espalda, y del lado vacío queda una hendidura en la almohada que tarda en cerrarse.',
          narrativeSensual: 'Dices que sí en voz alta, y el colchón te recibe como el agua recibe a quien ya no nada contra ella. Cuando por fin te quedas quieto, la sábana está húmeda y fría, y del lado vacío queda una hendidura en la almohada que tarda en cerrarse.',
          narrativeDirecto: 'Dices que sí en voz alta y la habitación toma nota. El radiador vuelve a sonar, tres golpes secos, como si alguien del piso de abajo hubiera pegado con una llave inglesa a la tubería para avisar de algo, y después se hace un silencio que no es de casa. El colchón se hunde junto a tu cadera. La voz dice tu nombre con el arrastre de siempre —«Ven aquí, tonto»— y esta vez el retraso de un latido te da medio segundo para arrepentirte. No lo usas.\n\nLa mano de siete pliegues se posa sobre tu vientre. Es más ancha que un plato llano y cubre de una cadera a la otra. Está fría, pero el frío dura lo que tarda tu piel en calentarlo: un hilo de agua te resbala hasta el costado, se evapora y deja una sal fina que pica. Cada dedo se mueve por separado, con una lentitud que parece ensayada, y los pliegues se curvan uno detrás de otro, de modo que lo que empieza como una caricia en línea recta acaba dibujando una espiral contra tu ombligo. Te quitas la camiseta tú solo, porque necesitas tener algo que hacer con las manos.\n\nLo que se tumba sobre ti pesa lo que pesa una persona y toca por más sitios que una persona. Lo notas en los hombros, en el esternón, en la cara interna de los muslos y en la nuca, todo a la vez, sin que ningún contacto estorbe a otro. Una boca sin labios te recorre la clavícula. No tiene dientes ni lengua que puedas nombrar; es una presión húmeda y tibia que sube y baja con tu respiración y que, cuando te arqueas, ya está ahí. Cada vez que decides adónde quieres que vaya, ha llegado antes.\n\n—Más abajo —le dices, y la voz que no es de ella te lo concede antes de que termines la frase. Pruebas a esperar, a no pedir nada, a ver qué hace si callas. No hace nada distinto: la presión sigue exactamente donde ibas a pedirla. Le has dado un silencio y te devuelve tu deseo en limpio, y entonces entiendes que no te escucha, que te lee. Te sale una risa corta y mala, de rabia. «Te lo dije», responde la voz con la entonación de ella, y la mano de siete pliegues baja por el interior de tu muslo y se detiene a una distancia que mides con la respiración.\n\nEn la mesilla el teléfono se enciende con su nombre en la pantalla. Suena una vez, dos. No contestas. La luz azul tiñe la pared y ves por fin lo que había debajo de tu peso: la sombra de un cuerpo, proyectada por algo que hay detrás del colchón, y cada una de sus articulaciones —cuentas nueve en el brazo derecho— se pliega con un chasquido húmedo de tendón nuevo. La llamada se corta. Entra en ti sin ayuda de las manos, por fases: primero una presión que tu cuerpo reconoce y acepta, después un calor salino que no cabe donde está y aun así cabe, y te sale un gemido ronco que no es el tuyo de siempre.\n\nEl ritmo no es el de nadie. Sube tres veces, se queda quieto, vuelve a subir, como si contara hasta un número que solo conoce él. Intentas acompasarte y cada vez que lo consigues cambia. Te agarras a la sábana y la tela se vuelve esponjosa y tibia, como arena que cede, y tus dedos se hunden hasta la muñeca. Fuera, las torres de la lluvia encienden ventanas una a una; cuentas cuarenta, cuarenta y una, y dejas de contar. Dices cosas sucias porque es lo único que te queda de tuyo: que no pare, que lo quieres hasta el fondo, que te rompa si hace falta. La voz de ella te contesta con tus mismas palabras, ordenadas de otra manera.\n\nEntonces eres tú quien manda. Sujetas esa muñeca de nueve articulaciones y la guías, la aprietas contra ti, le marcas el compás con las caderas. Funciona. Funciona demasiado bien, porque lo que tienes dentro se adapta al compás que le das con una obediencia de cerradura que cede a la llave correcta. Te corres con un temblor que empieza en la planta de los pies y te dobla las rodillas, con la boca abierta contra algo que no es un hombro, y en el último espasmo la voz se rompe en dos voces superpuestas: la de ella, que dice tu nombre, y otra más antigua y más grave que dice algo que no entiendes y que reconoces.\n\nNo te suelta. Hay una segunda ola, más honda, que llega mientras aún tiemblas de la primera, y esta vez no la pides. La mano de siete pliegues te sostiene la nuca, el agua fría vuelve a subirte por la espalda y te corres otra vez, seco, sin voz, con los ojos abiertos hacia el techo, donde la humedad ha dibujado una torre más. Cuando todo se aquieta, el radiador retoma su ruido de tubería y el colchón recupera su forma poco a poco, como una esponja grande.\n\nAmaneces con la piel salada y el cuerpo más ligero que en años. En el lado vacío de la cama queda una hendidura con la forma de una mano demasiado larga, y las sábanas están cubiertas de cristales de sal que crujen bajo tus rodillas cuando te levantas. El teléfono marca una llamada perdida de ella a las 03:17 que duró once horas. Tú sabes que no duró nada. Te quedas sentado en el borde de la cama con un puñado de sal en la palma, sin decidir si la tiras o la guardas.',
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
    actLabel: 'Sección 24.2 · La máscara',
    title: 'El salón de la persona que pudiste ser',
    location: 'Salón de madera encerada y espejos',
    entityArtwork: 'confidente',
    ambientTag: 'mascara',
    textVelo: [
      'La invitación decía: «Ven vestido como la persona que habrías sido si nadie te hubiera enseñado a avergonzarte». Un portero sin rostro te abre paso, y al cruzar el umbral el suelo de madera encerada devuelve tus pasos un segundo antes de que los des.',
      'Junto al espejo alto aguarda un anfitrión de mirada exacta. Sobre la mesa descansa una máscara lisa que adquiere el tono de tu piel cada vez que alguien la mira.',
      '«Póntela y nadie verá lo que temes que vean. Verán lo que deseabas que descubrieran. Puedes marcharte o cruzar esa puerta conmigo.»',
    ],
    textSensual: [
      'El perfume del salón es caro y antiguo. El anfitrión te mira sin prisa, como alguien que ya conoce todas tus objeciones antes de que las pronuncies.',
      'La máscara se calienta con solo acercar los dedos. Al otro lado de la puerta del fondo suena una risa idéntica a la tuya, pero mucho más libre.',
      '«No digas que te he empujado a desear la respuesta», sonríe el anfitrión sin tocar la máscara.',
    ],
    textDirecto: [
      'La invitación decía: «Ven vestido como la persona que habrías sido si nadie te hubiera enseñado a avergonzarte». Un portero sin rostro te abre la puerta y, al cruzar el umbral, la madera encerada del suelo devuelve tus pasos un segundo antes de que los des.',
      'El salón huele a cuero caro y a algo dulce que se quema despacio. Junto al espejo alto te espera un anfitrión de mirada exacta, con la edad que a ti te resulta más atractiva y con la comisura de la boca ajustada, mientras lo piensas, para confirmarlo. Te mira con la paciencia de quien conoce todas tus objeciones antes de que las pronuncies y las escucha igualmente hasta el final.',
      'Sobre la mesa descansa una máscara lisa, de un material que no sabrías nombrar, que adopta el tono de tu piel cada vez que alguien la mira. «Póntela y nadie verá lo que temes que vean —dice el anfitrión, sin acercarse—. Verán lo que deseabas que descubrieran.» Al otro lado de la puerta del fondo suena una risa idéntica a la tuya, más libre, sin el freno que tú le pones a cada carcajada.',
      'Te preguntas quién de los dos está detrás de esa puerta. La máscara se calienta cuando acercas los dedos y, bajo el perfume del salón, hueles tu propia colonia, la de hace diez años. El anfitrión no insiste. Espera con las manos a la vista: son largas, tibias, y tienen un callo de escribano en el dedo medio. Llevas la invitación en el bolsillo, doblada en cuatro, con la tinta violeta corrida en el pliegue. Todavía podrías volver a la calle, pero el espejo alto devuelve a alguien que ya no vuelve y que se toca el cuello con la naturalidad con que otros se rascan la cabeza.',
    ],
    choices: [
      {
        id: 'nyar_marcharse',
        label: 'Marcharse con la invitación',
        sublabel: 'Salir a la noche fría con la tarjeta intacta',
        directOutcome: {
          narrativeVelo: 'Sales a la noche fría con la tarjeta en el bolsillo. Puedes usarla como pista o quemarla cuando quieras que el recuerdo se vaya.',
          narrativeSensual: 'Das la espalda a los espejos antes de volver a escuchar tu propia risa libre al otro lado. La tarjeta pesa poco en la mano, y aun así no puedes soltarla.',
          acDelta: 1,
          addRelic: 'Invitación en tinta violeta',
          nextSceneId: 'umbrales_hub',
        },
      },
      {
        id: 'nyar_hablar',
        label: 'Quedarse a hablar con el anfitrión',
        sublabel: 'Sondear sus cláusulas antes de tocar la máscara',
        skillCheck: {
          skill: 'psicologia',
          difficulty: 'ARDUO',
          label: 'Leer la cláusula del anfitrión',
          onSuccess: {
            narrativeVelo: 'Comprendes la trampa antes de rozar la porcelana: cada vez que la uses, la máscara guardará un recuerdo tuyo y lo devolverá a otra persona cuando le convenga.',
            narrativeSensual: 'Bajo su cortesía impecable ves el hambre del coleccionista. La máscara no oculta tu rostro, lo va sustituyendo poco a poco, y cada vez que te la pones aprende un gesto más.',
            addFlag: 'sabe_clausula_mascara',
            nextSceneId: 'umbrales_hub',
          },
          onFail: {
            narrativeVelo: 'Su respuesta es tan certera que terminas confesando un temor que no pensabas decir en voz alta. Sabe el nombre exacto de la persona a la que se lo tenías guardado.',
            narrativeSensual: 'Mientras hablas, el espejo te devuelve una postura más recta y segura. Te descubres ensayando la sonrisa de la máscara sin haberla tocado.',
            inhLoss: '1d3',
            nextSceneId: 'umbrales_hub',
          },
        },
      },
      {
        id: 'nyar_usar',
        label: 'Ponerse la máscara y cruzar la puerta del espejo',
        sublabel: 'Entregarte a la persona que la máscara te deja ser',
        directOutcome: {
          narrativeVelo: 'La máscara se adhiere con un calor suave. La escena tras la puerta queda tras un velo de espejos ámbar que no oscurece nada de lo que pasa en la cama. Al salir, tardas un segundo de más en recordar tu expresión habitual.',
          narrativeSensual: 'Al cruzar hacia el cuarto forrado de espejos, tu reflejo ya no se avergüenza de nada. La entrega frente al cristal te deja una deuda con el salón y un recuerdo que ya no es solo tuyo.',
          narrativeDirecto: 'Te pones la máscara. La piel de debajo cede como si estuviera hecha a tu medida y el anfitrión te ayuda a atarla detrás de la nuca con dedos cuidadosos, sin rozarte más de lo necesario. Cuando levantas la vista, el espejo te devuelve a alguien que sonríe sin vergüenza, que no mira al suelo, que se pasa la lengua por el labio inferior sin comprobar antes quién mira. Esa persona te gusta más que tú. Lo dices en voz alta y el anfitrión asiente, como quien confirma una reserva.\n\nLa puerta del fondo da a un cuarto forrado de espejos del suelo al techo. Hay una cama baja cubierta de terciopelo oscuro que huele a naftalina y a naranjas, y una lámpara con la pantalla torcida que alguien ha dejado así a propósito. El anfitrión se sienta en el borde sin tocarte. Te desnudas despacio, prenda a prenda, porque cada una que cae te enseña un cuerpo que se reconoce en el cristal con una familiaridad que te marea. Él te mira con atención y sin prisa, y notas cómo se te endurecen los pezones bajo esa mirada, cómo el vientre se te encoge y se afloja, cómo el pulso te sube al cuello sin que nadie te lo haya pedido.\n\n—Dime qué quieres —dice. Su voz es amable y exacta, de recepcionista de hotel de lujo—. Lo que sea. Aquí no hace falta que lo merezcas.\n\n—Quiero que me toques como si no tuvieras que salir de esta habitación. —La frase sale sola, con una dicción que nunca has tenido, y te sorprende tanto que te ríes. Él también.\n\nSe acerca y te toma por la cintura con una mano que no se parece a las de nadie que hayas conocido: los dedos son largos, tibios, con una falange de más en cada uno, y te recorren la espalda en un orden que sabe dónde se esconde cada tensión. Lo besas. Su lengua es lenta, más lenta de lo que esperabas, y te explora la boca como quien repasa el inventario de una casa a la que piensa volver. Te tumba sobre el terciopelo. El peso es exacto, el de alguien que sabe cuánto puedes sostener, y te muerde el cuello justo debajo de la oreja.\n\nAlguien llama a la puerta con dos nudillos. Es el portero sin rostro, que ha abierto una rendija y sostiene una bandeja con dos copas llenas de un líquido ámbar que no recuerdas haber pedido. «Ahora no», dice el anfitrión sin girarse, y el portero cierra con el mismo cuidado con que ha abierto. Tú te quedas con la excitación colgando en el aire como una prenda sin percha y con una vergüenza breve y caliente, que el anfitrión aprovecha: te sujeta las muñecas contra el terciopelo, por encima de la cabeza, y te pregunta al oído si quieres que siga. Dices que sí. Lo dices tres veces, cada una con una voz distinta.\n\nEntra en ti despacio, un centímetro más lento que el anterior, y el espejo te devuelve la imagen de vuestros cuerpos encajados: tu espalda arqueada, tus piernas abiertas alrededor de sus caderas, la máscara brillante de sudor. Te ves gemir. Ves tus propios dedos clavándose en sus hombros hasta dejar marcas blancas. Él empuja con un ritmo parejo y tú le sigues, y cuando cambia de ángulo un calor te sube del vientre a la garganta y te hace decir cosas que despierto no dirías: que no pare, que lo quieres hasta el fondo, que te deje hecho un desastre para que mañana te dé vergüenza y no te importe.\n\nEntonces le pones la mano en el pecho y lo empujas. Cede. Te sientas a horcajadas sobre él, con las rodillas hundidas en el terciopelo, y te mueves a tu ritmo mientras él te mira con las manos abiertas sobre las sábanas, sin tocarte, esperando órdenes. «Más despacio», le pides, y obedece. «Ahora más fuerte.» Obedece también. Te envalentona y te inquieta a partes iguales que no discuta ni una sola, que cada orden se cumpla con la misma docilidad, y descubres en su cara un vacío agradable, una cortesía sin dueño. Podrías pedirle cualquier cosa y daría igual a quién se la pidieras.\n\nEn el espejo del fondo tu reflejo va un segundo por delante. Lo ves arquearse antes que tú, abrir la boca antes que tú, derramarse antes que tú, y esa ventaja te revienta: te corres con una contracción que te aprieta alrededor de él, con un grito que sale de la garganta de otro y llega al cuarto tarde. El anfitrión se deshace a la vez, con un solo suspiro largo, la boca contra tu cuello, repitiendo tu nombre con una pronunciación perfecta que nadie le ha enseñado.\n\nTe quedas tumbado de costado, con el terciopelo pegado a la piel sudada, y él te acaricia el pelo con la paciencia de un coleccionista que repasa una pieza. Sobre el espejo queda una huella de vaho con forma de máscara que se va borrando despacio. Al quitártela tardas un segundo de más en recordar qué cara tenías debajo, y en el borde del ojo derecho te queda una línea roja, fina, que no duele. El anfitrión te devuelve la invitación doblada en cuatro. La tinta violeta ha cambiado de sitio y ahora dice tu nombre.',
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
    actLabel: 'Sección 24.3 · Pertenencia',
    title: 'La mesa donde nadie apartaba la mirada',
    location: 'Casa comunal entre árboles negros',
    entityArtwork: 'cabra',
    ambientTag: 'rebano',
    textVelo: [
      'La casa huele a pan recién abierto, a cera y a tierra húmeda. Nadie te hace preguntas. Mueven platos y copas para hacerte sitio como si llevaran horas esperándote.',
      'Una mujer de cabello recogido sirve una bebida oscura en una taza de barro. «Aquí no tienes que explicar las cicatrices. La Madre promete algo más difícil que la belleza: que nadie volverá a echarte.»',
      'Fuera, las ramas golpean los cristales al compás de una percusión lenta que sube desde el suelo.',
    ],
    textSensual: [
      'Un vapor cálido a miel quemada sube de la taza de barro. Por un instante sientes el cansancio compartido de toda la casa y una aceptación tan honda que desarma cualquier defensa.',
      '«¿Cuál es el precio?», preguntas. Ella apoya sus dedos cerca de los tuyos sin presionar: «Que cuando otra persona llegue a esta mesa, hagas sitio».',
    ],
    textDirecto: [
      'La casa huele a pan recién abierto, a cera y a tierra húmeda. Nadie te hace preguntas. Mueven platos y copas para hacerte sitio como si llevaran horas esperándote, y en la cabecera una mujer de cincuenta y ocho años, Elvira, con el pelo recogido con un lápiz, sirve una bebida oscura en una taza de barro.',
      '«Aquí no tienes que explicar las cicatrices —dice, y te pone la taza entre las manos—. La Madre promete algo más difícil que la belleza: que nadie va a volver a echarte.» Un vapor tibio de miel quemada te sube a la cara. Preguntas cuál es el precio y ella apoya los dedos cerca de los tuyos, sin presionar: «Que cuando llegue otro a esta mesa, hagas sitio».',
      'Fuera, las ramas golpean los cristales al compás de una percusión lenta que sube desde el suelo: tres golpes, una pausa, tres golpes. En la sala contigua hay un colchón de paja cubierto de mantas, y de cada manta sale un calor de cuerpo que se nota desde la puerta. Una voz masculina ríe bajito. Alguien pregunta si ya te has quitado la chaqueta.',
      'Nadie te empuja a nada. Estás de pie, con la taza caliente en las manos y la paja crujiendo al otro lado del tabique, y sabes que lo que decidas aquí no lo vas a olvidar en ningún otro sitio. Hay cuatro caras vueltas hacia ti. Ninguna tiene prisa.',
    ],
    choices: [
      {
        id: 'shub_hospitalidad',
        label: 'Aceptar solo la hospitalidad y el pan',
        sublabel: 'Comer junto al fuego sin cruzar al patio',
        directOutcome: {
          narrativeVelo: 'Comes sin beber de la taza ritual y descansas junto al fuego. El calor de la casa te devuelve las fuerzas y el cansancio se va despacio, sin dejar nada detrás.',
          narrativeSensual: 'Compartes el pan tibio y el silencio amable sin cruzar al patio. El calor humano te devuelve la energía de las piernas y la respiración tranquila.',
          pvDelta: 2,
          acDelta: 2,
          nextSceneId: 'umbrales_hub',
        },
      },
      {
        id: 'shub_comunion',
        label: 'Beber de la taza y unirte a la comunión del patio',
        sublabel: 'Entregarte a la casa entera a cambio de sus heridas sanadas',
        directOutcome: {
          narrativeVelo: 'Bebes el caldo tibio y sales al círculo de antorchas sin que nadie te mire mal. Al despertar descubres que tus heridas han cerrado, pero percibes el pulso de toda la casa como si fuera el tuyo.',
          narrativeSensual: 'El calor de la bebida desciende hasta el vientre y se queda allí. Entre manos que no juzgan ni exigen explicaciones, tus heridas sanan mientras algo se anuda en tu pecho que ya no te deja irte del todo.',
          narrativeDirecto: 'Bebes. La taza de barro está tibia y el líquido sabe a miel quemada y a pan; te baja hasta el vientre y se queda ahí, como una brasa pequeña que alguien hubiera dejado a propósito. Elvira te quita la taza de las manos con la suavidad con que se le retira el plato a un convaleciente. Tiene las palmas ásperas de amasar, y cuando te ayuda a sacarte la camiseta por la cabeza huelen a harina y a tierra mojada. «Ven, que aquí cabes», dice. Es la primera vez en mucho tiempo que alguien te lo dice sin añadir un por favor.\n\nEn la sala de al lado hay un colchón de paja del tamaño de una cama y media, y sobre él os esperan Tomás, peón de la vega, de cuarenta y cuatro años, con las manos agrietadas de frío y los ojos bajos; Marga, de treinta y siete, que se ríe antes de que nadie haya dicho nada; e Íñigo, de veintinueve, que te pregunta en voz tan baja que tienes que acercarte para oírlo si está bien que te toque el hombro. Dices que sí. Íñigo te toca el hombro como si fuera de cristal.\n\nOs tumbáis. La paja no pincha. Cede bajo tu espalda con un calor de horno apagado y, muy hondo, algo golpea el suelo con la lentitud de un tambor de procesión. Nadie lo menciona. Marga te besa con la lengua por delante, sin preámbulo, y sabe a la misma bebida que tú; cuando se separa te susurra, divertida: «Qué cara de susto. Aquí se viene a que te quieran mal y mucho, cariño». Tomás te levanta una pierna con sus manos de cuero y te besa el interior de la rodilla, despacio, con una ternura que no cuadra con esas manos, y a ti se te escapa un gemido que no pensabas dar.\n\nSois cuatro cuerpos y solo cuentas cuatro la primera vez. Cuando vuelves a contar son cinco, y a la tercera, otra vez cuatro. Marga se coloca a horcajadas sobre tu cara y te pide con una voz sucia y alegre que no te cortes, que lleva tres días sin lavarse para esto; Íñigo, a tu derecha, te acaricia el pecho con dos dedos y pide permiso a cada centímetro con un «¿así?» que te desarma más que cualquier orden. Elvira se sienta junto a tu cabeza, te sostiene la nuca con una mano abierta y con la otra te aparta el pelo de la frente sin dejar de mirarte. «Tú déjate. Ya nos ocupamos nosotros.»\n\nEl viento abre un postigo y el candil se apaga. En la oscuridad os reís todos a la vez, y alguien tropieza con la jarra, que rueda por el suelo con ruido de campana sorda. El móvil de Marga vibra en el bolsillo de su abrigo, colgado de un clavo; ella gruñe, lo alcanza con el pie, lo vuelca bocabajo y dice «mi hermana, que ya hablará mañana». Nadie enciende nada. A oscuras los cuerpos se vuelven más ciertos, y el tambor del suelo ya no se oye debajo: lo notas en las muñecas, en el cuello, en las sienes.\n\nTomás entra en ti con un empuje lento y tú abres la boca sin proponértelo. Marga se desliza hacia un lado para dejarle sitio y te muerde el cuello. Íñigo, con la voz rota, te dice que eres precioso y que no sabe qué hacer con las manos, y tú le agarras una y la llevas adonde la necesitas. Elvira canta bajo, sin letra, al ritmo del suelo. Hay un momento, ni corto ni largo, en que ya no sabes de quién es cada gemido. Cada embestida te llega junto con una caricia y con un beso, y el calor que se acumula en la sala parece salir de un solo vientre enorme que os contuviera a todos.\n\nDices «esperad». Lo dices de verdad, con la voz limpia. Se detienen los cuatro en el mismo gesto: la mano de Elvira quieta en tu nuca, la de Íñigo en tu pecho, la boca de Marga a un palmo de la tuya. Esperan sin ofenderse ni impacientarse, y la facilidad con que se paran te enfría un segundo, porque ninguno ha pedido nada para sí. Entonces eres tú quien los mueve: giras a Tomás sobre la paja y te subes a él, pones a Marga la mano en la nuca y a Íñigo en el vientre, decides el compás. Obedecen en bloque, como cede una masa bajo la palma que la trabaja.\n\nTe corres primero, con un temblor largo que te sube de las plantas de los pies a la mandíbula, y detrás de ti, en el mismo segundo exacto, aunque cada uno por un camino distinto, se corren los otros tres: Tomás con un gruñido grave contra tu hombro, Marga riéndose y llorando con la cara hundida en tu pelo, Íñigo con un gemido pequeño y asombrado, como quien encuentra una escalera en su propia casa. Elvira suelta el aire que parecía llevar guardado toda la noche, y el golpe del suelo se para. En el rincón, sobre un taburete, Ambrosio, de sesenta y siete años, que no ha tocado a nadie, mueve los labios contando algo y asiente.\n\nNadie se levanta enseguida. Las manos siguen tocándote la espalda, el cuello, la cadera, con un cuidado que ya no busca nada, y Elvira te echa una manta por los hombros como a alguien que sale de un río. Por la ventana entra el primer frío de la madrugada. Sobre el tablón de la cocina te espera un plato limpio con una cuchara al lado, y Elvira te lo señala sin decir nada. «Cuando venga otro —dice por fin—, haces sitio.» Al salir encuentras en la palma izquierda una marca de harina que no se va con el agua, y durante tres días, andando por la calle, notarás bajo el talón el golpe sordo del suelo de aquella casa.',
          pvDelta: 4,
          inhLoss: '1d4',
          addMarca: 'Vínculo de Rebaño (Shub-Niggurath)',
          nextSceneId: 'umbrales_hub',
        },
      },
      {
        id: 'shub_combate',
        label: 'Enfrentar la presencia en el campo consagrado',
        sublabel: 'Salir al trigal y plantar cara al numen de la cosecha',
        directOutcome: {
          narrativeVelo: 'Sales al trigal negro más allá del patio y te enfrentas cara a cara a la Cabra de las Dos Sangres.',
          narrativeSensual: 'Rechazas la mesa para encarar al numen que bendice la cosecha entre el trigo alto, y el trigo se cierra alrededor de tus piernas como una boca que no quiere soltarte.',
          triggerCombatEntityId: 'cabra-dos-sangres',
          nextSceneId: 'umbrales_hub',
        },
      },
    ],
  },

  u_dagon: {
    id: 'u_dagon',
    arcId: 'umbrales-deseo',
    actLabel: 'Sección 24.4 · Linaje',
    title: 'Los votos que pronunciaba la marea',
    location: 'Cala sin mapa · Doce antorchas',
    entityArtwork: 'vastago',
    ambientTag: 'mar',
    textVelo: [
      'El sendero desciende entre rocas negras hasta una playa estrecha donde doce antorchas arden quietas, sin que el viento las mueva. El emisario espera en la orilla. Bajo sus orejas se abren unas líneas finas que cierran y abren al ritmo de su respiración.',
      '«No te ofrezco un hogar. Te recuerdo que ya tienes uno», dice mientras el agua tibia te cubre los tobillos y trae murmullos familiares desde el fondo.',
      'Puedes quedarte en la orilla, aceptar un favor de linaje o adentrarte en la corriente.',
    ],
    textSensual: [
      'El mar está casi corporal, más cálido que el aire nocturno. Los dedos finos del emisario rozan un instante tu muñeca y el olor a sal limpia resulta extrañamente reconfortante.',
      'En el murmullo de la marea oyes nombres pronunciados con afecto antiguo. «Si quieres verlo, la corriente puede enseñártelo.»',
    ],
    textDirecto: [
      'El sendero desciende entre rocas negras hasta una playa estrecha donde doce antorchas arden quietas, sin que el viento las mueva. En la orilla espera el emisario. Bajo sus orejas se abren unas líneas finas que se cierran y se abren al ritmo de su respiración, y tiene los pies descalzos hundidos en el agua hasta el tobillo.',
      '«No te ofrezco un hogar. Te recuerdo que ya tienes uno», dice, mientras el agua tibia te cubre los tobillos y trae murmullos familiares desde el fondo. El agua está casi a temperatura de cuerpo, más cálida que el aire de la noche, y el olor a sal limpia te resulta extrañamente reconfortante, como el de la ropa recién lavada en casa de tu abuela.',
      'En el murmullo de la marea oyes nombres pronunciados con un afecto antiguo, repetidos con la misma entonación, uno detrás de otro, como una lista pasada de generación en generación. «Si quieres verlo, la corriente puede enseñártelo.» Cuando la ola sube hasta la rodilla notas una presión suave por dentro de los muslos, como si alguien te sostuviera para que no caigas.',
      'El emisario no se mueve de la orilla, pero las líneas de su cuello vibran al mismo ritmo que el agua. Hay una piedra plana a tus pies y la espuma te lame los dedos. Puedes quedarte donde estás, y puedes dar el paso que falta.',
    ],
    choices: [
      {
        id: 'dagon_orilla',
        label: 'Escuchar desde la orilla',
        sublabel: 'Mojar solo los pies mientras aprendes los nombres antiguos de la costa',
        directOutcome: {
          narrativeVelo: 'Permaneces en la arena negra escuchando el coro lejano. Vas reconociendo nombres de pescadores que ya no existen, y cada nombre te deja una pequeña fatiga en los ojos.',
          narrativeSensual: 'Dejas que las olas mojen solo tus botas mientras aprendes los nombres antiguos de la costa. Cuando te vas, notas que uno de esos nombres se queda en la boca como una sal que no se borra.',
          inhLoss: '1',
          addFlag: 'conoce_votos_marea',
          nextSceneId: 'umbrales_hub',
        },
      },
      {
        id: 'dagon_entrar',
        label: 'Aceptar la inmersión ritual en la corriente',
        sublabel: 'Bajar al fondo de la cala y volver con una deuda',
        directOutcome: {
          narrativeVelo: 'Sigues al emisario mar adentro y desciendes hasta el fondo. Al regresar a la superficie descubres una línea brillante bajo las costillas y una deuda que no recuerdas haber contraído.',
          narrativeSensual: 'El agua te sostiene sin ahogarte mientras desciendes hasta la arena del fondo. Al volver a la playa toses agua limpia y comprendes que la marea ya conoce tu pulso, y que lo lleva consigo a cada sitio al que vayas.',
          narrativeDirecto: 'Te desnudas con calma, dejando la ropa doblada sobre una roca seca, y entras en la cala. El agua te sube por el vientre y cada ola te desliza la piel con una caricia lenta que empieza en el ombligo y termina en la nuca. El suelo es de arena fina y se mueve bajo tus pies con cada reflujo, de modo que tienes que clavar los dedos para no perder pie. Una antorcha chisporrotea a tu izquierda. Cuando te giras, el emisario ya está dentro del agua, a un brazo de distancia, y no has oído cómo entraba.\n\nDe cerca tiene siete pares de aberturas a lo largo de las costillas, cada una del largo de un dedo, y se abren y se cierran sin ritmo común, una detrás de otra, como si respiraran por turnos. La piel es fresca y lisa, de concha por dentro, y se calienta bajo tus manos hasta alcanzar tu misma temperatura. Los dedos tienen cuatro falanges y una membrana translúcida que llega hasta la segunda. Te toma por la cintura con una de esas manos y te acerca despacio. «Abre», dice, con una voz baja y húmeda, de frase aprendida. Abres la boca y él te besa con una lengua fría y larga que sabe a cobre y a algas.\n\nTe tumba de espaldas sobre la superficie y la corriente te sostiene, como un colchón que sube y baja con tu respiración. Algo largo y fresco se enrosca alrededor de tus caderas sin apretar. Una ola te cubre la cara, tragas sal, toses, y él te sujeta la nuca hasta que vuelves a respirar y te dice, sin ninguna prisa, «Otra vez». Te ríes con la garganta raspada. Le dices que sí, que otra vez, que más, y notas que el agua entiende antes que él.\n\nSus manos te recorren el pecho y bajan hasta el centro de tu cuerpo con una presión que no tiene prisa, y te abres a él. Lo que entra en ti es frío al principio y se calienta contra la piel, como una sal que se disuelve. Gimes sobre el agua y tu voz rebota en la cala y vuelve con un eco que suena a muchas voces. Te arqueas. La corriente te empuja hacia él y el movimiento de las olas te lleva dentro y fuera al mismo tiempo. «Dilo otra vez —te pide—, con tu nombre.» Lo dices. Lo dices mal, con la voz rota, y él lo repite sin una sola falta.\n\nEntonces se queda quieto. Tiene la cabeza vuelta hacia el mar abierto, las aberturas del costado cerradas todas a la vez, y escucha algo que tú no oyes, muy lejos y muy debajo. Dura lo que dura una ola. Estás suspendido entre dos empujes, con las piernas alrededor de su cintura y el cuerpo reclamando lo que no llega, y comprendes que lo que ha dejado de mirar eres tú, que para él eres lo que está pasando al lado de otra cosa. Te agarras a sus hombros con las uñas. «Vuelve», le dices, y le repites sus mismas palabras: «Abre. Otra vez». Él regresa como quien retoma una conversación a la que no ha dejado de pertenecer.\n\nEsta vez eres tú quien marca el ritmo. Lo aprietas con las piernas, le sujetas la cabeza con las dos manos y lo llevas hasta donde lo quieres, y la marea se acopla a ti con una obediencia callada. Un golpe de agua te llena los ojos y la boca, y mientras lo escupes oyes en el murmullo de la cala los nombres de tu familia, el de tu madre, el de la madre de tu madre, el de una tía abuela a la que no llegaste a conocer, todos dichos con el mismo afecto antiguo, y al final de la lista, con exactamente esa misma entonación, tu propio nombre.\n\nTe corres con una contracción que te aprieta alrededor de él y el mar entero parece tensarse con tu cuerpo. Gritas. El grito sale por la cala y vuelve repetido por muchas gargantas. Él te sostiene la cintura con un brazo y con el otro te aparta el pelo de la cara, y su respiración es más lenta que la tuya y las aberturas del costado se abren todas juntas, de una vez, como una persiana. Una segunda ola te alcanza sin que la pidas, más honda, y te corres otra vez flotando, sin voz, con las orejas bajo el agua y el rumor de la lista en la cabeza.\n\nCuando el temblor se apaga te ayuda a ponerte en pie. Las rodillas no te responden y la arena se te escurre entre los dedos. Tienes frío, la piel llena de sal, y en el hombro izquierdo, al tocarte, encuentras tres marcas blancas, pequeñas, como de dientes, que el agua no borra. Te vistes con los dedos torpes. Las doce antorchas se van apagando una a una mientras te abrochas, y la última tarda lo mismo que tú en atarte los cordones.\n\nAntes de que subas por el sendero, el emisario te pone en la mano una piedra húmeda con un nombre grabado. Lo reconoces. Es el tuyo, escrito con la letra de alguien que nunca ha tenido manos. Pesa más de lo que debería y está tibia, y la llevas apretada en el puño hasta la carretera.',
          inhLoss: '1d4',
          addDeuda: 'Deuda Salada con la Familia de la Marea',
          nextSceneId: 'umbrales_hub',
        },
      },
      {
        id: 'dagon_senora',
        label: 'Convocar a la Señora de las Aguas Dulces',
        sublabel: 'Negociar cara a cara con la matriarca de la corriente',
        directOutcome: {
          narrativeVelo: 'La matriarca de la corriente emerge frente a ti con la elegancia de una estatua antigua, para negociar cara a cara.',
          narrativeSensual: 'El agua se aquieta y la Señora se acerca para presentar su contrato. Lo hace cuerpo a cuerpo, sin soltarte la mano.',
          triggerCombatEntityId: 'senora-aguas',
          nextSceneId: 'umbrales_hub',
        },
      },
    ],
  },

  u_yog: {
    id: 'u_yog',
    arcId: 'umbrales-deseo',
    actLabel: 'Sección 24.5 · Umbral',
    title: 'La puerta que recordaba por los dos',
    location: 'Habitación de hotel · 03:17',
    entityArtwork: 'coro',
    ambientTag: 'cripta',
    textVelo: [
      'La puerta aparece a las tres y diecisiete en la pared donde antes colgaba un cuadro. Reconoces el pomo de latón de una casa que ya no existe, y el cerrojo está frío al tacto como si alguien lo hubiera estado sujetando desde dentro.',
      'Al otro lado hay una habitación bañada en luz de tarde antigua. Entre las motas de polvo flotan recuerdos exactos que nadie más podría conocer.',
      'El marco empieza a cerrarse despacio, como una exhalación.',
    ],
    textSensual: [
      'Al otro lado del umbral, la figura que más deseaste recuperar te mira con una tristeza auténtica. «Porque todavía piensas que tú y yo somos preguntas distintas», susurra.',
      'Flotan partículas de luz con escenas compartidas: manos bajo una mesa, trenes perdidos, palabras que nunca se dijeron a tiempo.',
    ],
    textDirecto: [
      'La puerta aparece a las tres y diecisiete en la pared donde antes colgaba un cuadro. Reconoces el pomo de latón de una casa que ya no existe, y el cerrojo está frío al tacto, como si alguien lo hubiera estado sujetando desde dentro. Al otro lado hay una habitación bañada en luz de tarde antigua, y entre las motas de polvo flotan recuerdos exactos que nadie más podría conocer.',
      'La figura que más deseaste recuperar te mira con una tristeza auténtica. «Porque todavía piensas que tú y yo somos preguntas distintas», susurra. Flotan partículas de luz con escenas compartidas: manos bajo una mesa, trenes perdidos, palabras que nunca se dijeron a tiempo. Una de esas partículas se te posa en el labio inferior y te quema un poco.',
      'El aire de la habitación huele a la colonia de aquel verano, a sábanas de algodón y a lluvia en el cristal. La figura abre los brazos sin decir nada, y el gesto es tan familiar que se te afloja el pecho. Junto a la ventana hay un sillón vacío, con una manta doblada sobre el reposabrazos, y no sabes por qué lo miras dos veces.',
      'El marco empieza a cerrarse despacio, como una exhalación. Todavía cabes por él.',
    ],
    choices: [
      {
        id: 'yog_cerrar',
        label: 'Cerrar la puerta antes de que desaparezca',
        sublabel: 'Empujar la hoja hasta oír el clic de la cerradura',
        directOutcome: {
          narrativeVelo: 'Empujas la hoja hasta oír el clic de la cerradura. El desgarro te deja cansado, pero notas que tu resistencia se afirma como un muro.',
          narrativeSensual: 'Cierras el marco con ambas manos mientras el calor de la tarde antigua se disuelve tras el papel pintado. Te quedas con las palmas pegadas a la madera, temblando.',
          acDelta: -1,
          addFlag: 'resistencia_yog',
          nextSceneId: 'umbrales_hub',
        },
      },
      {
        id: 'yog_compartir',
        label: 'Compartir un recuerdo desde el umbral sin cruzar',
        sublabel: 'Rozar la línea con los dedos y recibir una respuesta',
        directOutcome: {
          narrativeVelo: 'Intercambias una memoria desde la distancia segura. Recibes una verdad que no buscabas y dejas detrás otra que tampoco era tuya.',
          narrativeSensual: 'Rozas los dedos al otro lado de la línea del umbral. Sientes una emoción que no es tuya y despiertas con una respuesta grabada en la palma.',
          inhLoss: '1d3',
          addMarca: 'Eco táctil en la palma',
          nextSceneId: 'umbrales_hub',
        },
      },
      {
        id: 'yog_cruzar',
        label: 'Cruzar la puerta hacia la habitación luminosa',
        sublabel: 'Quedarte con alguien que ya no está en ningún otro sitio',
        directOutcome: {
          narrativeVelo: 'Cruzas el marco. La escena ocurre tras un velo de tiempos superpuestos. Al regresar conservas un recuerdo que pertenecía a la otra persona y que ya no es posible devolver.',
          narrativeSensual: 'Al cruzar, la frontera entre tu piel y la suya se vuelve difusa: cada caricia la sientes en dos cuerpos a la vez, y el placer llega siempre en dos tiempos distintos. Regresas al hotel con un lazo que no entra en ninguna cuenta.',
          narrativeDirecto: 'Cruzas el umbral y la puerta se cierra detrás de ti sin ruido. La habitación es más pequeña de lo que parecía desde fuera y más ancha de lo que cabe en la pared. La luz de tarde cae oblicua sobre un suelo de baldosa hidráulica que reconoces con los pies antes que con los ojos. La figura está a un paso. Tiene el hombro que recordabas, con la misma pequeña cicatriz junto a la clavícula, la izquierda, y cuando le pones la palma encima te da un calor que ya no sientes en ninguna otra parte.\n\nLo besas y el beso sabe a todos los besos de aquella época, a café con leche, a cigarrillo ajeno, a prisa. Las manos de ambos se buscan sin pensar. Le quitas la camisa y su piel se estremece bajo tus dedos, tibia como cuando dormía a tu lado. Os desnudáis torpemente, con los gestos viejos, y la luz de la tarde antigua te baña el cuerpo con un calor que no es de este siglo. «Siempre te quitabas los calcetines al final —dice la figura, y se ríe—. Siempre.» Te los quitas al final.\n\nTe tumba sobre la cama de vuestro primer piso, que ha ocupado el sitio de la del hotel, con la colcha de rayas y el muelle que chirriaba a la altura de la cadera. Su peso te aprieta igual que entonces, con la misma torpeza amable y la misma prisa por llegar adonde nunca llegasteis del todo. Te besa el cuello, el pecho, la cadera, el interior del muslo. Cada beso llega un poco después de lo que esperas, como si el tiempo se estirara para que lo sientas dos veces. A través del tabique suena el televisor de la vecina y, abajo, el tranvía que hacía temblar los vasos. Gimes. La figura te sujeta las muñecas por encima de la cabeza y su respiración te calienta la clavícula.\n\n—Dime lo que te gustaba —susurra, y te nombra con el apodo que solo os llamabais los dos, ese que nunca has escrito en ninguna parte.\n\n—Tú ya lo sabes.\n\n—Quiero que me lo digas.\n\nSe lo dices. Le dices dónde, cómo, con qué presión, con qué lentitud, y mientras hablas descubres que la cicatriz ha cambiado de hombro. Está en el derecho. Se lo señalas con la mirada y la figura, sin perder el gesto, baja los ojos, sonríe con una mueca de excusa y la devuelve al izquierdo con un parpadeo, igual que se corrige un borrador. «¿Cuál prefieres?», pregunta con exactitud de dependiente. Te quedas sin voz un segundo, con el pulso en la garganta. Comprendes que podrías pedirle cualquier cambio y que lo haría, y que ni lo uno ni lo otro le importaría.\n\nEntonces la dejas hacer, o quizá es ella quien te deja. Entra en ti despacio, reconociéndote, con el mismo ángulo de siempre y, al mismo tiempo, algo que no lo es: la presión se multiplica como si hubiera dos cuerpos empujando desde lugares distintos. Te arqueas. Cada empuje abre una imagen en el aire, vuestras manos bajo una mesa, un tren que sale sin vosotros, una frase que quedó a medias, y cada imagen te llega dos veces, una justo antes de que el cuerpo la reciba y otra justo después. Dices cosas que dijiste entonces y cosas que entonces no te atreviste a decir, y la figura responde a ambas con la misma voz cálida y algo torpe.\n\nTe corres con un temblor que te arrastra hacia atrás, y esa misma sacudida te alcanza una segunda vez un segundo antes de la primera, y una tercera después, de modo que no sabes cuántas veces te has corrido ni cuándo. El mundo se llena de polvo dorado. La figura también se deshace sobre tu vientre y te sonríe con la misma cara de entonces, con las cejas levantadas y los ojos entornados, y en ese gesto, que es exactamente el suyo, reconoces que no hay un solo detalle fuera de sitio y que eso es lo que no puede ser.\n\nCuando la luz empieza a apagarse la puerta ya está cerrada, pero el cristal de la ventana muestra vuestro reflejo doble: dos figuras tumbadas en la cama, abrazadas, y una tercera sentada en el sillón con las manos sobre las rodillas, que mira la escena con una paciencia que no se parece a la tuya. Sales con los zapatos en la mano. En el bolsillo, la tarjeta del hotel abre una habitación que no existe, y en la cabeza llevas un recuerdo de soledad que no te pertenece, de una noche de invierno, de una cena para uno, que ya no es posible devolver. El pomo de latón se te ha quedado frío en la palma.',
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
    actLabel: 'Sección 24.6 · Representación',
    title: 'El último ensayo',
    location: 'Teatro cerrado desde hace veinte años',
    entityArtwork: 'sacerdote',
    ambientTag: 'teatro',
    textVelo: [
      'Las luces del vestíbulo brillan sin polvo. Un acomodador inmóvil vestido de amarillo pálido abre la sala, donde esperan dos sillas, un espejo alto y un libreto con tu nombre en la portada.',
      'Desde la primera fila, el director observa en silencio: «No interpretes el deseo. Deja que el deseo te interprete».',
      'En el espejo del fondo ves una versión tuya más segura, más hermosa, y que se mueve un segundo antes que tú.',
    ],
    textSensual: [
      'La luz ámbar sobre las tablas vuelve cálida cada sombra. Una figura ligada a tu pasado espera al otro lado del escenario mientras la página tres del libreto aparece subrayada en amarillo con una frase que aún no has pronunciado.',
      '«Conserva tu nombre si quieres —dice el director desde la penumbra—. Por ahora.»',
    ],
    textDirecto: [
      'Las luces del vestíbulo brillan sin una mota de polvo. Un acomodador inmóvil, vestido de amarillo pálido, abre la sala. Dentro esperan dos sillas sobre el escenario, un espejo alto y un libreto con tu nombre en la portada. Desde la primera fila, el director observa en silencio: «No interpretes el deseo. Deja que el deseo te interprete».',
      'La luz ámbar sobre las tablas vuelve cálida cada sombra. En el espejo del fondo ves a una versión tuya más segura, más hermosa, que se mueve un segundo antes que tú. Una figura ligada a tu pasado espera al otro lado del escenario con las manos en la espalda, leyendo el libreto con atención de apuntador; a ti ni te ha visto entrar.',
      'La página tres aparece subrayada en amarillo, con una frase que todavía no has pronunciado. «Conserva tu nombre si quieres —dice el director desde la penumbra—. Por ahora.» Alguien tose en la oscuridad del patio de butacas, y después otra persona, y otra: hay público, aunque no lo ves.',
      'Lees la frase en voz alta. El teatro se apaga, salvo un foco que cae sobre ti y sobre la figura del otro lado. El espejo se gira para mostrar una segunda escena que no has escrito, con el mismo guion y con tu cuerpo en el papel. Te sudan las palmas. Todavía puedes soltar el libreto.',
    ],
    choices: [
      {
        id: 'hastur_abandonar',
        label: 'Abandonar el escenario antes de leer la réplica',
        sublabel: 'Dejar caer el libreto y salir por la puerta de emergencia',
        directOutcome: {
          narrativeVelo: 'Dejas caer el libreto y sales por la puerta de emergencia. Ver a tu reflejo adelantarse un segundo te deja una sensación de vacío en el estómago, pero sales libre.',
          narrativeSensual: 'Apartas la vista del espejo justo cuando tu reflejo empieza a sonreír por su cuenta. Sales a la calle fría con el pecho acelerado y la sensación de que alguien aplaude a tu espalda.',
          corLoss: '1',
          nextSceneId: 'umbrales_hub',
        },
      },
      {
        id: 'hastur_confesar',
        label: 'Improvisar una confesión fuera del libreto',
        sublabel: 'Decir algo que no estaba escrito y romper el guion',
        skillCheck: {
          skill: 'persuasion',
          difficulty: 'NORMAL',
          label: 'Romper el guion con verdad',
          onSuccess: {
            narrativeVelo: 'Dices algo que no estaba escrito en la página tres. El director cierra el cuaderno, recuperas el aliento y rompes el hechizo teatral.',
            narrativeSensual: 'Tu voz verdadera desbarata la acústica perfecta de la sala. El espejo vuelve a obedecerte, y la figura del escenario retrocede dos pasos sin soltarte la mano.',
            acDelta: 2,
            nextSceneId: 'umbrales_hub',
          },
          onFail: {
            narrativeVelo: 'Incluso tu improvisación suena exactamente como la línea siguiente del libreto. Alguien aplaude desde la última fila.',
            narrativeSensual: 'Intentas cambiar el texto, pero las palabras salen con la cadencia ensayada por otro. Lo último que te oyes decir es la réplica de la página tres, y ya no sabes si la dices tú.',
            inhLoss: '1d3',
            nextSceneId: 'umbrales_hub',
          },
        },
      },
      {
        id: 'hastur_papel',
        label: 'Aceptar el papel y leer la página subrayada',
        sublabel: 'Ocupar el papel hasta el final de la función',
        directOutcome: {
          narrativeVelo: 'Pronuncias la línea y la obra se representa hasta el aplauso final. Tu reflejo tarda un segundo de más en soltar la escena, y la sala sigue en silencio cuando sales.',
          narrativeSensual: 'En cuanto lees la frase en amarillo, el teatro baja las luces. Diriges la escena frente al espejo mientras desde la butaca el director susurra que hables más alto, para el público que ya ha entrado.',
          narrativeDirecto: 'Pronuncias la línea y la obra empieza. La figura cruza el escenario con pasos medidos y te toma el mentón entre los dedos. Su voz suena como la tuya grabada en una cinta, un poco más lenta. Te pide que te desnudes despacio para la platea, y tú lo haces mientras el foco te calienta la piel. Notas el aire frío en los pezones y el calor de la luz en el vientre, y cada prenda que cae suena en las tablas como el final de una línea. Desde la oscuridad, la voz del director, seca y atenta: «Un paso a la izquierda. Respira hacia el público».\n\nTe tumba sobre la tarima con una mano en el pecho y otra entre los muslos. El público es invisible, pero el silencio de la sala se vuelve un peso sobre la piel. Te besa la garganta y después el vientre, y el contacto de su boca es tan preciso que te arranca gemidos con un ritmo que no decides tú. Del foso del apuntador sale un susurro que dice tu réplica una fracción antes de que la pienses. No lo escuchas. Lo oyes igual.\n\nEl foco parpadea, se apaga, vuelve. En esa oscuridad de un segundo oyes crujir una butaca que se abate y a alguien que carraspea, y un cuerpo conocido te sujeta por las caderas con las dos manos, sin dejarte moverte. «Está en el texto», dice la figura, con tu entonación, cuando intentas protestar. Te pasa el pulgar por el labio inferior. Te abre las piernas con la rodilla.\n\nEn una pausa, el director dicta una indicación técnica con voz de lector de partituras: «Más cerca de la luz. Que se le vea la cara». La figura te gira la cabeza hacia el foco con dos dedos bajo la barbilla y te hace abrir los ojos. Ves por un instante las primeras filas, llenas de rostros que se vuelven hacia ti con la boca entreabierta y los ojos muy quietos, y reconoces entre ellos tu propia cara, repetida en seis butacas seguidas, con la expresión de quien espera el siguiente verso.\n\nEntra en ti con un empuje que llena el escenario de eco. El foco se mueve con cada embestida y tu cuerpo se enseña a una platea que no ves. Te agarras al borde de la tarima y te oyes gemir, primero bajo, luego con toda la garganta. La figura te habla al oído con las frases del libreto, crudas y exactas, cosas que nunca has dicho y que reconoces como tuyas: que quieres que te vean, que quieres que te oigan, que te da igual quién esté mirando. Cada vez que lo sientes hondo, el espejo del fondo se adelanta un segundo y tú lo imitas sin haberlo decidido, con la misma expresión de entrega.\n\nEntonces dices algo que no está escrito. Lo dices bajo, sin ensayo: «Más despacio». La figura se detiene a mitad de gesto, con la boca entreabierta, y repite la frase del libreto, palabra por palabra, como si no te hubiera oído. Insistes. Le sujetas la cara con las dos manos y la obligas a mirarte; no responde, pero tampoco te aparta. Desde la butaca, el director murmura con una satisfacción mal disimulada: «Eso no es del texto. Seguid». Vuelves a empujar tú. Cambias el ángulo, el ritmo, la presión, y la figura sigue cada cambio con una obediencia pulida, sin ganas propias. Descubres que no hay ninguna.\n\nLe dices entonces, entre dientes, lo que le harías si tuviera algo que perder: que lo quieres de rodillas, que lo quieres callado, que lo quieres mirándote. La figura se arrodilla, calla y te mira, y cada orden se cumple un segundo después de pronunciada, con una puntualidad de reloj, hasta que dejas de desear lo que pides y sigues pidiéndolo.\n\nTe corres con un temblor que te sacude las piernas y te dobla la espalda sobre las tablas. En el espejo, tu reflejo ya se había corrido un segundo antes, con la boca abierta y los ojos en blanco, y su gesto llega a la sala antes que el tuyo. La platea entera exhala a la vez, un solo aliento largo que te roza la piel de la nuca, y la figura se deshace contra tu cuello con una respiración que repite exactamente tu último gemido.\n\nDespués, el aplauso. Suena a un rumor seco de muchas cosas que se frotan, como un campo de insectos al caer la tarde, y se prolonga lo que tarda el foco en apagarse. Quedas tendido sobre la tarima con el libreto arrugado bajo la espalda y las costillas todavía subiendo y bajando, y la figura se levanta sin prisa y se inclina sobre ti. «Ya lo has dicho todo —susurra—. Ahora solo tienes que repetirlo.»\n\nAl salir, el acomodador de amarillo pálido te tiende un resguardo del guardarropa con tu nombre, para un abrigo que no has traído. Sigue tibio. En la última página del libreto, que llevas doblado en el bolsillo, ha aparecido una frase nueva con tu propia letra, y todavía no la has leído entera.',
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
      'A simple vista es una casa de barrio más. Lo que la delata es el olor a floresta vieja que sube por el portal, y las visitas que entran cansadas de noche y salen serenas al alba, sin acordarse de lo que han dicho.',
      'Anoche soñaste con la puerta de la cripta. Un cultista desertor, antiguo confesor del Círculo, te espera en el descansillo con las manos vacías y te cuenta la única regla que la casa no ha roto nunca:',
      '«La Congregación Doblada devuelve un rostro conocido por cada persona viva que resista una vigilia completa abajo, hasta el amanecer. Nunca ha perdido una apuesta.»',
    ],
    textSensual: [
      'La puerta de la cripta conoce tu nombre desde el sueño de anoche. El desertor tiembla al entregarte la llave, y no es miedo lo que le hace temblar: entre los rostros que todavía hablan en esa masa palpitante hay alguien que amaste y que llevas años sin tocar.',
      'Huele a cera, a tierra y a un perfume de piel tibia que te sube por la nuca. Cuando el desertor baja la voz, su aliento se mezcla con el de la escalera.',
      '«Abajo no te golpean —susurra—. Abajo te ofrecen todo lo que te faltó hasta que tú mismo pides quedarte.»',
    ],
    choices: [
      {
        id: 'doble_sonar_resistir',
        label: 'Bajar a la cripta para la vigilia voluntaria',
        sublabel: 'Pasar la noche entera entre los rostros',
        directOutcome: {
          narrativeVelo: 'Desciendes los escalones de piedra húmeda hasta el sótano abovedado. Decenas de respiraciones acompasadas llenan la oscuridad, y el suelo está caliente bajo los pies descalzos.',
          narrativeSensual: 'Bajas hacia la penumbra tibia. La masa respira como un coro de voces conocidas, y decenas de brazos se extienden hacia ti sin violencia, con la misma calma con que se recibe a alguien que vuelve a casa después de mucho tiempo.',
          corLoss: '1d3',
          nextSceneId: 'doble_acto2_prueba1',
        },
      },
      {
        id: 'doble_combate_directo',
        label: 'Enfrentarte a la Congregación en el círculo de velas',
        sublabel: 'Plantarte en el centro sin apartar la vista del abrazo',
        directOutcome: {
          narrativeVelo: 'Entras en el círculo de velas dispuesto a sostener el abrazo unánime de la Doblada sin rendirte.',
          narrativeSensual: 'La Doblada reconoce tu rostro en cuanto pisas la cripta y avanza con todos sus brazos abiertos, cada uno con una piel distinta, cada uno tibio como la mano de alguien que te espera en la cama.',
          narrativeDirecto: 'Entras en el círculo de velas con los pies descalzos, y la cera, todavía líquida, te sube entre los dedos. Plantarte en el centro era la idea; lo que haces es quedarte quieto mientras la Doblada se pone en pie. Es una sola cosa y son muchas. Cuentas ciento dieciocho brazos y, cuando los cuentas otra vez, son ciento diecinueve. Sesenta rostros asoman de una carne común que cambia de piel a cada palmo, morena, rosada, pecosa, con tatuajes que empiezan en un cuerpo y acaban en otro. Está a treinta y siete grados exactos. Respira entera, a una.\n\nSe vuelven hacia ti dos caras. Una es Amparo, sesenta y tres años, viuda del cuarto, la que te subía las bolsas de la compra. La otra es Nicanor, cincuenta y ocho, conductor de tranvía jubilado, con el bigote de siempre. Hablan por una sola boca: «Pasa, pasa, no te quedes en la puerta». Es una voz de vecinos, de escalera, de pan con aceite. Te quitas la camisa antes de que nadie te lo pida, para que el gesto sea tuyo.\n\nLos primeros brazos te rodean la cintura. Tienen manos distintas, una callosa, otra de uñas largas, otra de dedos manchados de tinta, y todas se cierran sobre tu piel con la misma presión, calculada como se calcula el peso de una taza. Una boca te besa el hombro. Otra, el cuello. Otra, más abajo, el vientre, con una lengua tibia que abre camino. Gimes y la Doblada gime contigo, sesenta gargantas en un solo acorde, y el eco hace que el sótano tenga más techo del que tiene.\n\nArriba se abre la trampilla. Una linterna barre la escalera y una voz de mujer pregunta desde lo alto: «¿Todo bien ahí abajo?». Se te hiela el cuerpo; el círculo, no. Del centro de la masa sale, con la entonación exacta de una vecina que se asoma a un patio, la respuesta: «Todo bien, Mari. Duérmete». La trampilla se cierra. Notas que has estado a punto de gritar y que algo dentro de la masa te ha tapado la boca con una caricia.\n\nTe tumban de espaldas sobre la piedra, entre las velas, y las manos se reparten el trabajo con la eficacia de una cuadrilla. Unas te sujetan los tobillos; otras te abren las rodillas con un cuidado que roza la cortesía; una boca baja entre tus muslos con una lengua larga que no es de nadie y es de todos. Te arqueas. Una mano de uñas largas te aprieta el pecho y otra te tapa los ojos para que no veas qué te hace cada cosa, y la oscuridad agranda cada contacto. Dices «más» sin querer decirlo. Alguien responde con un «sí» que viene de seis sitios.\n\nHablan sucio con dulzura de abuela. «Mira cómo te abres, bonito.» «Aquí no se juzga a nadie.» «Dilo otra vez.» Nicanor, con voz de conductor, te susurra al oído que ha llevado a media ciudad y a nadie como a ti. Tú contestas con lo que tienes: insultos cariñosos, palabras que no usas en el trabajo, un «cabrones» entre dientes que les arranca una risa común, enorme, de sesenta personas riéndose a la vez, y que te hace reír a ti.\n\nTe penetra algo que se parece a lo que esperas y que va cambiando mientras entra: primero un calor redondo, luego una presión ancha, luego una sucesión de pequeñas presiones, una detrás de otra, como si te recorriera por dentro una fila de personas. Contraes los muslos. El cuerpo de la Doblada te sigue con una docilidad exacta, y notas que cuando te tensas ellos se tensan, que cuando suspiras suspiran. Los rostros se acercan al tuyo de uno en uno, y cada cual te besa en la boca antes de ceder el sitio al siguiente.\n\nDices «parad». Se detienen todos, y la facilidad con que lo hacen te deja frío. Nadie protesta. Nadie pide nada para sí; en toda la masa no hay un solo deseo que no sea el tuyo. Entonces comprendes que te ofrecen un espejo con sesenta caras, y que lo que tomabas por entrega es obediencia. Lo aprovechas. Te incorporas, empujas, les marcas el ritmo con la mano, y la masa entera se ordena según tu mano: se pliega, se tumba, se abre.\n\nTe corres con un grito que rebota en la bóveda y vuelve cien veces. En el mismo segundo, sin que nadie diga una palabra, los sesenta rostros abren la boca, cierran los ojos y gimen a la vez, y el suelo vibra con ellos. Amparo llora, sonriendo. Nicanor repite tu nombre con una voz que no es la suya. Una gota de cera te cae en el pecho y no la sientes hasta que ya se ha enfriado.\n\nCuando levantas la cabeza tienes la espalda cubierta de marcas de manos y la garganta rota. La Doblada te sostiene todavía, sin prisa, con cuarenta o cincuenta brazos, a la espera. Entre dos hombros desconocidos aparece un rostro que reconoces y que no debería estar aquí. Te mira como si no te hubiera visto nunca. Es lo bastante tuyo para que te duela y lo bastante ajeno para que dudes, y el duelo continúa.',
          triggerCombatEntityId: 'congregacion-doblada',
          nextSceneId: 'doble_acto3_resolucion',
        },
      },
    ],
  },

  doble_acto2_prueba1: {
    id: 'doble_acto2_prueba1',
    arcId: 'doble-vigilia',
    actLabel: 'Acto II · Primer nocturno',
    title: 'La oferta de la Doblada',
    location: 'Cripta del templo madre',
    entityArtwork: 'doblada',
    ambientTag: 'cripta',
    textVelo: [
      'La primera hora de vigilia cae sobre tus hombros como una manta húmeda. Un rostro conocido asoma entre los pliegues de la Congregación y pronuncia, sin ninguna crueldad, la verdad exacta sobre tu soledad.',
      'Hay que sostener la mirada y no contestarle. Cada palabra que dejas sin responder pesa un poco más que la anterior.',
    ],
    textSensual: [
      'El rostro que más echabas de menos sonríe con ternura desde la masa viva. Tiene la piel marcada por la misma pequeña cicatriz junto al labio que recordabas, y cuando habla se le mueve el pecho bajo una tela que no es suya.',
      'Su voz no miente. Ha estado con mucha gente y sabe exactamente dónde te duele quedarte solo: en la base del cuello, en el hueco de la cadera, en las manos que nunca encuentran a nadie al final del día.',
      '«No tienes que ser fuerte por una sola noche —dice—. Ven y deja de pelear.»',
    ],
    choices: [
      {
        id: 'prueba1_pod',
        label: 'Resistir la oferta',
        sublabel: 'Mirar las velas del umbral y no responder',
        skillCheck: {
          skill: 'POD',
          difficulty: 'NORMAL',
          label: 'Sostener el primer nocturno',
          onSuccess: {
            narrativeVelo: 'Aprietas los dientes y mantienes la mirada fija en las velas del umbral. Sobrevives al primer nocturno sin ceder, y el silencio que dejas detrás de ti pesa más que cualquier respuesta.',
            narrativeSensual: 'Escuchas la promesa sin dar un paso hacia los brazos abiertos. Tu propia respiración te sirve de ancla, y el primer nocturno pasa mientras el rostro conocido sigue sonriendo sin que nadie le conteste.',
            nextSceneId: 'doble_acto2_prueba2',
          },
          onFail: {
            narrativeVelo: 'La verdad de su oferta te golpea hondo, y desde ahora sabes siempre dónde está la puerta de la cripta, aunque estés a kilómetros de ella.',
            narrativeSensual: 'Una parte de ti desea responderle que sí. Lo notas en la garganta antes que en la boca, y la sensación de haber estado a punto de decirlo te deja un temblor que tarda en irse.',
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
    actLabel: 'Acto II · Segundo y tercer nocturno',
    title: 'El abrazo y la caricia de muchos',
    location: 'Centro de la cripta',
    entityArtwork: 'doblada',
    ambientTag: 'cripta',
    textVelo: [
      'A las tres de la madrugada los brazos de la Doblada te rodean. No aprietan. Sostienen, como se sostiene a alguien que se va cayendo despacio, y ese cuidado es lo más difícil de resistir.',
      'Ramón, el panadero de la calle de abajo, cincuenta y dos años, te sostiene la nuca con una mano todavía marcada de harina. Begoña, la vecina del tercero, cuarenta y seis, te besó una vez en el portal y nunca lo volvió a mencionar; ahora te mira sin pestañear. Julián, el vigilante de la fábrica, tiene cuarenta y nueve años y una quemadura vieja en el antebrazo, y es el único que no habla.',
      'Hay que aguantar hasta el alba sin dejar que el cuerpo decida por ti. El cuerpo, sin embargo, empieza a decidir antes de que termines de pensarlo.',
      'Lo que ocurre después de medianoche se te escurre a medida que lo vives. Recuerdas el suelo tibio, una voz áspera que te dice que ya era hora de que alguien entrara sin llamar, y el momento exacto en que dejas de saber cuántas manos son. El resto queda detrás de una puerta que no llegas a abrir.',
      'Cuando asoma la primera luz por el respiradero estás tendido en la piedra, con la garganta en carne viva y la sensación de haber sido querido por gente que te conocía mejor que tú. Eso pesa más que cualquier herida.',
    ],
    textSensual: [
      'Docenas de manos tibias te rodean con una unanimidad que ninguna persona podría igualar. Ninguna aprieta, y tu piel empieza a contestar antes que tú.',
      'Reconoces entre ellas a Ramón, el panadero de cincuenta y dos años, a Begoña, la vecina del tercero, de cuarenta y seis, y a Julián, el vigilante de la fábrica, de cuarenta y nueve. Aguantas hasta que asoma la primera luz por el respiradero, con el cuerpo recordando cada falta de afecto.',
    ],
    textDirecto: [
      'A las tres de la madrugada el círculo se cierra sobre ti sin que nadie se mueva más de lo necesario. Docenas de manos tibias encuentran tus hombros y tu nuca, y lo hacen con una calma que no encaja con el resto de la cripta. Nadie pide nada. Esperan, como se espera en la puerta de una casa a la que se ha llegado tarde.',
      'Intentas pensar en otra cosa. Cuentas las velas, las respiraciones de la masa, el nombre de tu calle. Cada vez que cuentas, una mano baja un poco más por tu espalda y la cuenta se te pierde. Tu cuerpo responde antes que tu cabeza, y lo notas con la rabia de quien se sabe traicionado por su propia piel.',
      'Ramón, el panadero de la calle de abajo, cincuenta y dos años, te sostiene la nuca con una mano que todavía conserva marcas de harina. Begoña, la vecina del tercero, cuarenta y seis, te besó una vez en el portal y nunca lo volvió a mencionar; ahora te mira sin pestañear. Julián, el vigilante de la fábrica, tiene cuarenta y nueve años y una quemadura vieja en el antebrazo, y es el único que no habla.',
      'Nadie te empuja a nada. Te rodean, esperan, y la piedra del suelo está tibia como una sábana. Tu cuerpo ya ha empezado a contestar, y todavía puedes decidir hasta dónde.',
    ],
    choices: [
      {
        id: 'prueba2_resistencia',
        label: 'Sostener el abrazo hasta el amanecer',
        sublabel: 'Aguantar cada hora de caricias sin entregarte del todo',
        skillCheck: {
          skill: 'resistenciaCarnal',
          difficulty: 'NORMAL',
          label: 'Resistir el abrazo unánime',
          onSuccess: {
            narrativeVelo: 'Con el primer rayo pálido del alba, los brazos retroceden en silencio. Has completado la vigilia con vida y voluntad propia, y la Doblada cumple su palabra: libera el rostro pactado y se retira al fondo de la cripta.',
            narrativeSensual: 'Tiemblas de agotamiento, pero no cediste el último límite. Al amanecer la masa se abre con respeto y deja salir a la persona que viniste a buscar, mientras tú te quedas un momento más sobre el suelo tibio, sintiendo cómo se enfría tu propio cuerpo.',
            narrativeDirecto: 'Aguantas. No sabes cómo. Cuentas las velas, cuentas las respiraciones de la masa, cuentas los nombres de tu calle, y cuando pierdes la cuenta empiezas otra. Las manos no cesan. Begoña te besa con la lengua, áspera, riéndose, y te dice al oído que llevas tres años con la puerta cerrada y que ya es hora de que alguien entre sin llamar. Le contestas que no hay nadie en casa.\n\nJulián te separa las piernas y su boca recorre el interior de tus muslos con una paciencia técnica. Se detiene cada vez que respiras más fuerte, como si anotara cada vez. Tu cuerpo hace lo que quiere. Te corres una vez, con un grito que no has autorizado, con las uñas clavadas en la piedra, y lo que no concedes es lo otro: la palabra. Es la primera vez que Julián habla en toda la noche: «Respira», dice, y vuelve a callarse.\n\nRamón se coloca detrás de ti y te susurra, con frases cortas que pesan: «Di que sí y todo esto se queda contigo. Di que sí y no vuelves a dormir solo». Te agarras a su brazo para no caer y contestas que no. Los tres se detienen en el mismo segundo, sin ofenderse, y vuelven a empezar.\n\nUna vela se apaga con un resoplido y en la oscuridad que sigue la masa respira más fuerte. Begoña te toma la mano y la lleva a su propio pecho, y notas que le late el corazón a la misma velocidad que a ti. «Ves —dice, bajito—, no hace falta que digas nada para que te quieran un rato.» Es la frase más amable que has oído en meses, y la que más te cuesta contestar.\n\nAsí hasta el alba. Te tocan, te lamen, te muerden con un cuidado que no admite reproche, y cada vez te llevan hasta el borde y te dejan allí, con la espalda arqueada y la garganta abierta, esperando una palabra. No la dices. A las cinco casi la pronuncias, la boca se te forma sola, y la cierras contra el hombro de Julián, que sonríe sin burla y dice: «Otra vez será».\n\nCon el primer rayo pálido en el respiradero los brazos retroceden en silencio. Ramón te ayuda a sentarte, Begoña te echa un abrigo por los hombros y Julián te deja un vaso de agua en la mano, y los tres vuelven al círculo con una cortesía de vecinos que han bajado a echar una mano. La Doblada cumple su palabra: libera el rostro pactado y se retira al fondo. Tienes la garganta en carne viva y el cuerpo en llamas, y en el muslo la huella de una mano con tres pliegues en cada dedo.',
            acDelta: -4,
            addFlag: 'vigilia_completada',
            nextSceneId: 'doble_acto3_resolucion',
          },
          onFail: {
            narrativeVelo: 'El abrazo te arrastra más allá de lo que querías conceder, y dejas de contar las horas. Begoña te pide que la mires, Julián te dice que lo siente, Ramón no te suelta la cintura. Lo que sigue queda tras la misma puerta cerrada. Al alba sigues allí, con el pecho lleno de marcas de manos y la voz gastada. Todavía puedes luchar por el desenlace en el último acto, pero ya no tienes el cuerpo que tenías al bajar.',
            narrativeSensual: 'El calor unánime quiebra tus rodillas. Cedes a la ola de Begoña, de Ramón y de Julián, que no se detiene hasta el amanecer, y despiertas con el pecho cubierto de marcas de manos que no reconoces como tuyas.',
            narrativeDirecto: 'Dejas de contar. La última vela se te escapa de la cabeza a mitad de un número y con ella se va la excusa de estar pensando en otra cosa. Es la primera vez en años que no tienes un plan.\n\nBegoña se inclina sobre tu cara con el pelo suelto. «Llevas tres años con la puerta cerrada —dice con voz áspera, casi divertida—. Ya es hora de que alguien entre sin llamar.» Ramón habla desde detrás, grave, sin prisa: «No tienes que hacer nada. Solo dejar que te toquemos». Julián no dice nada durante un rato, y después, seco: «Tienes el pulso a ciento veinte. Lo noto en el cuello».\n\nTe bajan la ropa entre varios, sin tirones. La piedra del suelo está tibia, como una sábana que alguien ha planchado con la plancha de la cocina. Begoña te besa con la lengua, y sabe a café. Mientras tanto, sus dedos bajan por tu vientre hasta encontrarte húmedo. Gimes contra su boca. Ella se ríe contra tus labios y murmura: «Ya está. Lo sabía». Cuando baja hasta tu pecho y te muerde el pezón con los dientes justos, sientes un calor que te sube al vientre y te arranca el primer gemido de verdad.\n\nJulián te separa las piernas con las dos manos. Su boca recorre el interior de tus muslos despacio, y se detiene cada vez que notas que respiras más fuerte, como si contara tus respiraciones. Cuando por fin llega a tu sexo, lo hace con la lengua caliente y una presión exacta, sin apartarse hasta que te arqueas sobre la piedra y oyes tu propia voz pronunciando su nombre. Ramón te sujeta la cintura y te levanta un poco, y tú te agarras a su brazo. «Déjalo que termine —le dice a Julián—. Que lo sienta antes de que lo pida.»\n\nUna vela se vuelca y rueda por la piedra con un tintineo de cera. Nadie la levanta. Alguien la apaga con la mano sin quejarse, y el olor a mecha quemada se mezcla con el del pan y con el del sudor. Julián se ríe, un resoplido corto, y dice que menos mal que no ha sido el techo. Es la única broma de la noche y te alivia más de lo que debería.\n\nDurante toda la noche se oye hablar a la masa en voz baja, y cada voz tiene su modo de decir las cosas. Begoña habla sucio y directo: «Mira cómo te abres para mí, cariño. Te he visto así desde el portal». Ramón lo hace despacio, con frases cortas que pesan: «Aguanta. Ya casi. Déjame entrar más». Julián apenas dice nada y cuando lo hace es en tono técnico, como quien anota una medida: «Otra vez. Ahora sí tiembla». Cada frase cambia el ritmo de quien la recibe. Tú te descubres repitiéndolas, primero con vergüenza y después con ganas, hasta que tu voz suena igual que la de ellos.\n\nRamón entra en ti con un empuje lento y profundo. Su peso no aplasta, sostiene, y cada embestida empuja a Begoña contra tu pecho y a Julián contra tu costado. En algún momento te das cuenta de que los tres se mueven a la vez, con un mismo ritmo, como si fueran un solo cuerpo repartido en tres. Intentas separarte y Ramón te sujeta más fuerte: «Ya no hace falta que elijas. Déjalo ser». Su cara empieza a difuminarse. Los rasgos se corren hacia la de Begoña, los de Begoña hacia la de Julián, hasta que no sabes cuál de los tres te llena. Te corres con una contracción que te deja sin aire. En ese instante el suelo entero palpita contra tu espalda, y la piel de los tres se vuelve elástica y tibia, como si el grupo empezara a compartir la misma carne.\n\nLa vigilia sigue. Te quedas abierto, y cada persona de la masa te toca de una manera distinta: Julián con la lengua en el cuello, Begoña con dos dedos dentro, Ramón con la boca contra tu oreja diciéndote que no tengas miedo de disfrutar. Vuelves a correrte, más hondo, y el placer tarda en apagarse, como si hubiera un hueco de piedra bajo el pecho donde rebota. Pides más. La voz te sale grave, distinta de la tuya, y los tres responden a la vez: «Ya lo sabíamos».\n\nCuando asoma la primera luz por el respiradero, los brazos se aflojan despacio. Quedas tendido con los muslos pegajosos y la garganta en carne viva. Julián se levanta primero, con la cicatriz del antebrazo brillante de sudor, y dice tu nombre con la voz de alguien que acaba de reconocerse en otro. Donde antes había una mujer que no reconoces queda un plato de sopa tibia y un olor a incienso dulce que se te pega al pelo durante días.\n\nEsa misma mañana, al lavarte, encuentras huellas de dedos en la parte interior de los muslos. Una de ellas tiene tres pliegues en lugar de dos.',
            acDelta: -6,
            inhLoss: '1d3',
            nextSceneId: 'doble_acto3_resolucion',
          },
        },
      },
      {
        id: 'prueba2_piedad',
        label: 'Invocar la piedad: nombrar a un rostro concreto',
        sublabel: 'Decir un nombre real que la masa haya olvidado',
        skillCheck: {
          skill: 'persuasion',
          difficulty: 'ARDUO',
          label: 'Nombrar un rostro para hacer dudar a la masa',
          onSuccess: {
            narrativeVelo: 'Pronuncias su nombre completo. Ese rostro deja de sonreír y duda, y la masa entera retrocede un paso y te permite respirar hasta el alba.',
            narrativeSensual: 'Tu voz atraviesa el coro con un nombre real que la masa había olvidado. Begoña se aparta de tu pecho con los ojos llenos de agua, Julián te suelta los muslos, y el resto de los cuerpos se separa como si les hubieran quitado el calor de golpe.',
            addFlag: 'vigilia_completada',
            nextSceneId: 'doble_acto3_resolucion',
          },
          onFail: {
            narrativeVelo: 'Todos los rostros repiten el nombre a la vez, absorbiendo tu intento en un susurro colectivo que suena a tu propia voz.',
            narrativeSensual: 'Tu llamada se pierde entre docenas de bocas que responden con un cariño idéntico. Te besan mientras pronuncias el nombre, y el nombre se deshace en tu garganta antes de llegar a los labios.',
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
    location: 'Escalera de la cripta',
    entityArtwork: 'doblada',
    ambientTag: 'cripta',
    textVelo: [
      'La noche termina y quedan tres caminos delante de ti. Cada uno deja una marca distinta en la ciudad y en ti.',
      'Puedes arrancar el rostro pactado con un rito de desgarro, prender fuego a la cripta aunque la masa suplique que no pares, o aceptar la última negociación de la Doblada.',
    ],
    textSensual: [
      'La luz gris de la mañana entra por la rendija superior y cae sobre la escalera como una tela sucia. Abajo, la masa sigue respirando, y cada respiración te recuerda una de las voces de la noche.',
      'Puedes llevar a cabo la cirugía ritual del desgarro, consumir el templo entero en fuego o escuchar la última oferta de paz de la Congregación.',
    ],
    choices: [
      {
        id: 'doble_desgarro',
        label: 'El desgarro: extraer al ser querido con rito',
        sublabel: 'Sacar un solo nombre de la masa sin destruir a los demás',
        directOutcome: {
          narrativeVelo: 'Cuatro horas de liturgia separan la carne prestada de la propia. El liberado despierta respirando aire frío por primera vez en meses, y tarda en reconocer su propia voz.',
          narrativeSensual: 'Con paciencia quirúrgica y palabras limpias arrancas un nombre de la masa sin destruir a los demás. Mientras lo sacas, sientes cómo la piel que lo retiene se resiste y después se rinde, con un calor que se queda pegado a tus dedos. La cicatriz queda, pero el cuerpo vuelve vivo.',
          corLoss: '1',
          nextSceneId: 'doble_final_desgarro',
        },
      },
      {
        id: 'doble_fuego',
        label: 'El fuego: quemar la cripta entera',
        sublabel: 'Prender el aceite y dejar que el templo caiga sobre sí mismo',
        directOutcome: {
          narrativeVelo: 'El aceite arde rápido entre los cimientos. Escuchar a la masa arder te deja un ruido en la cabeza que no se irá en días, pero el templo madre desaparece de la ciudad.',
          narrativeSensual: 'Las llamas devoran los rostros que suplican que no detengas el calor. El edificio cae en cenizas y el horror queda sellado para siempre, aunque el olor a incienso dulce te persiga durante semanas.',
          corLoss: '1d6',
          nextSceneId: 'doble_final_fuego',
        },
      },
      {
        id: 'doble_pacto',
        label: 'La última negociación: disolver el templo a cambio de un testigo',
        sublabel: 'Quedarte como el límite vivo del acuerdo',
        directOutcome: {
          narrativeVelo: 'La Doblada libera a todos los cautivos y se disuelve de la ciudad a cambio de una promesa que tú pronuncias con calma, sabiendo que cumplirla te costará más de lo que dices.',
          narrativeSensual: 'Aceptas convertirte en el límite vivo del acuerdo: los demás salen libres hacia el amanecer mientras tú cierras la puerta desde dentro. Sientes el último abrazo de Begoña en la espalda, cálido y breve, antes de que se apague.',
          inhLoss: '1d6',
          nextSceneId: 'doble_final_negociacion',
        },
      },
    ],
  },

  doble_final_desgarro: {
    id: 'doble_final_desgarro',
    arcId: 'doble-vigilia',
    actLabel: 'Epílogo · La misa de los liberados',
    title: 'Lo perdido regresa con cicatrices',
    location: 'Salida de la casa del barrio',
    entityArtwork: 'doblada',
    ambientTag: 'cripta',
    isEnding: true,
    endingSummary: 'Has rescatado a quien amabas mediante la vigilia y el rito de desgarro. El templo sigue bajo tierra, pero sabes exactamente cuánto cuesta cada vida.',
    textVelo: [
      'Camináis juntos bajo la lluvia fina de la mañana. Quien volvió apenas habla, pero su mano aprieta la tuya con una fuerza real.',
      'El barrio entero finge no haber oído nada durante la noche, y tú también finges.',
    ],
    textSensual: [
      'El rescate no borra el recuerdo de la cripta, pero devuelve un cuerpo entero a la luz del día. Cuando llegáis a la esquina, el aire huele a pan recién horneado, y la persona que sacaste de la masa se detiene a mirar el escaparate de la panadería como si lo viera por primera vez.',
    ],
    choices: [],
  },

  doble_final_fuego: {
    id: 'doble_final_fuego',
    arcId: 'doble-vigilia',
    actLabel: 'Epílogo · Solar en cenizas',
    title: 'El barrio que niega lo ocurrido',
    location: 'Solar calcinado',
    entityArtwork: 'doblada',
    ambientTag: 'cripta',
    isEnding: true,
    endingSummary: 'La Congregación Doblada ha ardido hasta los cimientos. En el solar vacío, sin embargo, ya brotan flores que nadie plantó.',
    textVelo: [
      'Los bomberos no encuentran explicación para la profundidad del sótano ni para la ausencia de restos identificables.',
      'Has salvado a la ciudad entera de un templo mayor, y lo has pagado con tus propios sueños.',
    ],
    textSensual: [
      'Sales cubierto de hollín y silencio. Nadie volverá a desaparecer por esa puerta, aunque en tus oídos persista el eco de los rostros, y de vez en cuando te parezca oír el nombre de Begoña entre el ruido del tráfico.',
    ],
    choices: [],
  },

  doble_final_negociacion: {
    id: 'doble_final_negociacion',
    arcId: 'doble-vigilia',
    actLabel: 'Epílogo · El resto que habla',
    title: 'La puerta cerrada desde dentro',
    location: 'Cripta disuelta',
    entityArtwork: 'doblada',
    ambientTag: 'cripta',
    isEnding: true,
    endingSummary: 'Todos los rostros han sido liberados y el templo abandona la ciudad. Tu nombre queda como leyenda y advertencia del barrio.',
    textVelo: [
      'Decenas de personas despiertan en las calles cercanas sin recordar cómo volvieron a casa. El pacto se ha cumplido en sus términos exactos.',
    ],
    textSensual: [
      'Te quedas dentro de la cripta vacía, con la espalda contra la piedra y el calor de la masa todavía en la piel. Oyes cerrarse el portal de arriba y, después, un único latido que no sabes si es el tuyo.',
    ],
    choices: [],
  },
};
