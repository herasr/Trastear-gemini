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
          narrativeSensual: 'Cedes al abrazo de la sombra conocida. La voz de la puerta se convierte en una boca que te besa el cuello, y las manos que se detenían a dos dedos de tu mejilla ahora te recorren el pecho y el vientre con una precisión que te conoce de otros tiempos. Gimes sin contenerte, y el perfume de la víspera te llena la garganta. Tu cuerpo se abre a la sombra como una puerta que lleva años esperando, y la sombra entra sin prisa, con la paciencia de quien espera a que llegues tú. Te corres con un temblor largo que te deja las piernas flojas sobre las sábanas. Al alba tienes más poder en las manos y menos resistencia frente al perfume, y en la piel queda una marca de dedos largos que no se borra al lavarte.',
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
      'Las antorchas rodean el estanque seco del invernadero. Anselmo oficia el rito menor con cinco miembros del Círculo y alza el cáliz de savia tibia, que humea en el aire frío.',
      'La tierra se abre entre las losas y la Ninfa de la Zarza Negra se yergue bajo la luna: pálida, coronada de hojas negras, envuelta en zarcillos que respiran al ritmo de los presentes. Su forma no encaja con ninguna anatomía humana, y los ojos de los demás se niegan a mirarla del todo.',
      'Sus ojos, sin blanco ni pupila humana, se fijan en ti. El jardín ha hecho su elección.',
    ],
    textSensual: [
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
          narrativeSensual: 'Aceptas el pulso del invernadero cuerpo a cuerpo. Los zarcillos se cierran alrededor de tu cintura, tibios y húmedos, y el duelo empieza sin pausas: cada tirón de la enredadera busca la piel bajo tu ropa, y cada respuesta tuya le devuelve el golpe con la misma intención. Te pegas a su cuerpo de corteza y sientes la presión de muchos puntos a la vez, como si la planta entera te tocara por dentro. Gimes contra su savia, y la Ninfa responde con un sonido parecido a una flor que se abre a destiempo. Cuando te corres, el invernadero entero se estremece con tu temblor, y el tallo que te sujetaba se afloja un instante, lo justo para que decidas si quieres seguir.',
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
            narrativeSensual: 'Con una precisión implacable dominas la tensión de las enredaderas hasta obligar al tallo a ceder. Atas sus zarcillos a la piedra del estanque y la Ninfa se queda quieta, con la respiración agitada y la corteza brillante de sudor. Le recorres la superficie con las manos y sientes cómo cada fibra tiembla bajo tu tacto. Cuando te inclinas sobre ella, la savia gotea tibia por tu muñeca, y el placer de tenerla sometida te sube hasta la garganta. Por primera vez en trece años, alguien ha jugado su juego mejor que ella, y lo sabe porque su cuerpo se rinde antes que sus palabras.',
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
      'El colchón se hunde a tu lado con el peso exacto del cuerpo que más añoras, y el aliento junto a tu oído huele a mar profundo. Pronuncia tu nombre con la aspereza de tus recuerdos, esa manera de arrastrar la sílaba final que nadie más usa.',
      '«No quiero obligarte —susurra contra tu cuello—. Quiero que dejes de defenderte de algo que ya te ha encontrado.»',
      'Los dedos cálidos se detienen sobre la sábana, a centímetros de tu pecho. Tienen más articulaciones de las que deberían caber en una mano: cuentas siete pliegues en cada dedo, y cada pliegue se curva en una dirección distinta. No avanzarán hasta que tú lo decidas, y lo sabes porque ya te estás inclinando hacia ellos.',
      'Quien habla no piensa como la persona que imita. Te ofrece cuidado sin preguntarse si lo mereces, y cada caricia llega un segundo antes de que sientas la piel que la espera. Parece atender a algo que está muy lejos, bajo el suelo de la habitación, y tu cuerpo aun así responde como si fuera a ti a quien busca.',
      'Te quitas la camiseta sin que nadie te lo pida. La mano invisible sube por tu costado y deja una estela de agua fría que se evapora sobre la piel caliente. Cuando el aliento baja hasta tu vientre, sientes la respiración de algo que se adapta a tu ritmo con una precisión que no es humana, como si hubiera estudiado tus pulsaciones durante años.',
      'La boca que no tiene labores de boca te recorre el cuello y se detiene en la clavícula. Sientes un tirón suave, sin dolor, y después una corriente tibia que te baja por el pecho hasta la cintura. Te arqueas. La cama vibra como una lancha en un muelle. Afuera las torres siguen subiendo por el cristal y, por un momento, te parece que cada gota que pasa es una ventana que se enciende.',
      'Tu propia voz sale más grave de lo que recuerdas. Pides más en un tono que no reconoces, y la voz de la persona que imita responde sin sonar sorprendida: «Ya lo sabía. Lo he estado esperando».',
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
          narrativeSensual: 'Dices que sí en voz alta, y la respuesta es un peso que se sube encima de tu cadera. Las manos de siete pliegues te sujetan los muslos sin apretar, y el colchón se mueve con un ritmo que no es el de la respiración humana: sube, se detiene, vuelve a subir, como si tuviera que llegar a un punto que solo conoce él. Tú te agarras a las sábanas porque necesitas algo que se mueva con tu cuerpo, y en cambio la superficie se vuelve esponjosa y tibia, como arena que cede. Cuando entra en ti, lo hace por fases. Primero sientes una presión que tu cuerpo reconoce y después una plenitud que no debería caber, un calor salino que se extiende por dentro y te hace gemir sin proponértelo. Te mueves contra él, y tu propia respiración se acopla al oleaje del cristal. Las torres de fuera encienden sus ventanas una a una, y tú sigues el compás de cada ventana hasta que el placer se vuelve tan grande que ya no distingues dónde termina tu piel. En el último tramo la voz de la persona que imitaba se rompe, se vuelve dos voces superpuestas, y pronuncias su nombre y el de algo más antiguo al mismo tiempo. Te corres con un temblor que te dobla las piernas y te deja con la boca abierta contra su hombro, que no es un hombro. Después, la respiración se calma en el cuarto, y te quedas tendido con el olor a mar en los labios. Despiertas descansado, con la piel salada y el cuerpo más ligero. Del lado vacío de la cama queda un surco húmedo en la sábana, con la forma de una mano demasiado larga.',
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
      'El perfume del salón es caro y antiguo, de cuero y de algo dulce que se quema despacio. El anfitrión te mira sin prisa, como alguien que ya conoce todas tus objeciones antes de que las pronuncies, y en su mirada no hay juicio, solo una paciencia que te desarma más que cualquier reproche.',
      'La máscara se calienta con solo acercar los dedos. Al otro lado de la puerta del fondo suena una risa idéntica a la tuya, pero más libre, sin el freno que tú le pones cada vez que hablas. Te preguntas quién de los dos está detrás de la puerta.',
      '«No digas que te he obligado a desear la respuesta», sonríe el anfitrión sin tocar la máscara. Su voz es amable y suave, y al decirlo se acerca lo justo para que notes el calor de su aliento en la mejilla.',
      'Te pones la máscara. La piel debajo cede como si estuviera hecha para ti, y el anfitrión te ayuda a atarla detrás de la nuca con dedos cuidadosos. Al mirarte en el espejo ves a alguien que sonríe sin vergüenza, que no mira al suelo, que se toca el cuello con la misma naturalidad con que los demás se rascan la cabeza. Esa persona te gusta más que tú mismo. Lo dices en voz alta, y el anfitrión asiente como si lo hubiera sabido siempre.',
      'La puerta del fondo da a un cuarto forrado de espejos. Dentro hay una cama baja cubierta de terciopelo oscuro y el anfitrión se sienta en el borde sin tocarte. Te quitas la chaqueta y después el resto, despacio, porque cada prenda que cae te muestra un cuerpo que se reconoce en el cristal. El anfitrión te observa con una atención que no tiene prisa, y tú notas cómo se te endurecen los pezones bajo esa mirada, cómo el vientre se te encoge y se afloja, cómo la respiración se te acelera sin que lo decidas.',
      'Cuando te acercas, el anfitrión te toma por la cintura con una mano que no se parece a la de nadie que hayas conocido: los dedos son largos, cálidos, y te recorren la espalda en un orden que sabe dónde se esconde cada tensión. Lo besas en la boca y la lengua de él es más lenta de lo que esperas, más profunda, como si quisiera recordar el sabor de tu saliva para siempre. Gimes. Te arrodillas sobre el terciopelo y tus manos le desabrochan la camisa; debajo, la piel de él tiene el tacto de la seda cuando se calienta. Lo tocas con la misma seguridad que la máscara te ha dado, y él cierra los ojos un instante, como alguien que oye su nombre en voz alta por primera vez en años.',
      'Te tumba sobre el terciopelo y se coloca encima con cuidado. Sientes su peso exacto, un peso que no aplasta. Entra en ti despacio, cada centímetro más lento que el anterior, y el espejo te devuelve la imagen de vuestros cuerpos encajados, la espalda curvada, tus piernas abiertas alrededor de sus caderas. Te ves gemir, ves la máscara brillar con el sudor, ves tus propios dedos apretando sus hombros hasta dejar marcas blancas. Él empuja con un ritmo parejo y tú le sigues, y cuando cambia de ángulo sientes un calor que sube hasta la garganta y te hace decir palabras que nunca dirías despierto: que no pares, que lo quieres dentro, que quieres ser él por un momento. El anfitrión sonríe con la boca de tu propia sonrisa.',
      'En el último tramo el cuarto se llena de tu voz rebotando en los espejos. Te corres con una contracción que te aprieta alrededor de él, y en ese instante el reflejo del fondo se mueve con un segundo de adelanto, sonríe antes que tú y se derrama también. Cuando cae la última ola, te quedas tumbado de costado, con el terciopelo pegado a la piel sudada y el anfitrión acariciándote el pelo como si fueras su obra. Sobre el espejo queda una huella de vaho con forma de máscara, que se va borrando despacio.',
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
          narrativeSensual: 'Al cruzar hacia el cuarto forrado de espejos, tu reflejo ya no se avergüenza de nada, y la escena que sigue es la de la máscara completa: cada beso, cada empuje, cada palabra que pronuncias frente al cristal. Al salir te queda una deuda con el salón y un recuerdo que ya no es solo tuyo.',
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
      'Un vapor cálido a miel quemada sube de la taza de barro. Notas el cansancio compartido de toda la casa, y una aceptación tan honda que desarma cualquier defensa que te quedara.',
      '«¿Cuál es el precio?», preguntas. Ella apoya los dedos cerca de los tuyos sin presionar: «Que cuando otra persona llegue a esta mesa, hagas sitio».',
      'En la sala contigua hay un colchón de paja cubierto de mantas, y de cada manta sale un calor humano que se nota desde la puerta. Una voz masculina ríe bajito y alguien pregunta si ya te has quitado la chaqueta. Nadie te obliga a nada. Te quedas de pie, con el vapor en la cara, y sabes que lo que decidas aquí no lo olvidarás en ningún otro sitio.',
      'Cuando te quitas la camiseta, la mujer del pelo recogido te ayuda a bajarla sin prisa, y sus manos son ásperas de tierra y de tallos. Sientes un hormigueo caliente en el pecho, y el mismo calor te sube por los muslos al notar el roce de otros cuerpos que se acercan para hacerte sitio. Alguien te besa el hombro. Después otra persona te besa el cuello, y una tercera te recorre el costado con las yemas, con la misma calma con que se amasa el pan.',
      'Te tumban sobre la paja y las mantas se pliegan bajo tu espalda. Cuatro manos te sujetan y ninguna aprieta. Alguien te abre las piernas con cuidado, y la boca que baja por tu vientre tiene una lengua caliente y paciente que se detiene justo donde tu cuerpo quiere que se detenga. Gimes sin vergüenza. A tu lado, una mujer más joven se incorpora para besarte la boca mientras el hombre que te atiende cambia de posición, y sientes cómo cada movimiento de los demás se acopla al tuyo como si toda la casa respirara con un solo pulmón.',
      'El hombre se coloca entre tus piernas y entra en ti con un empuje lento y largo. Tu espalda se arquea contra la paja. La mujer de la boca te aprieta un pezón con los dedos, y tú le devuelves el beso con más fuerza. Otro cuerpo se acerca por detrás, tibio, y alguien te toma la mano y la lleva a una piel que se mueve contra la tuya. Ya no sabes de quién es cada gemido. Solo sabes que cada empuje te llega a la vez que una caricia, y que cuando te abres más, los demás se abren también, sin celos y sin prisas.',
      'En el último tramo el ritmo se vuelve común, como una canción que todos conocen. Te corres con un temblor que se contagia a los demás, y en ese instante alguien suelta un suspiro largo que se parece al de la mujer del pan. Cuando el calor se aplaca, siguen tocándote la espalda y el cuello, y nadie se levanta. Por la ventana entra el primer frío de la madrugada, y sobre el tablón de la cocina queda un plato limpio con una cuchara al lado, esperando a quien venga después.',
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
      'El agua está casi a temperatura de cuerpo, más cálida que el aire de la noche. Los dedos finos del emisario rozan un instante tu muñeca, y el olor a sal limpia te resulta extrañamente reconfortante, como el de la ropa recién lavada en casa de tu abuela.',
      'En el murmullo de la marea oyes nombres pronunciados con un afecto antiguo, repetidos con la misma entonación. «Si quieres verlo, la corriente puede enseñártelo.»',
      'Te acercas al borde del agua con los pies descalzos. Cuando la ola sube hasta la rodilla, notas una presión suave que te aprieta los muslos por dentro, como si alguien te sostuviera para que no caigas. El emisario no se mueve de la orilla, pero las líneas de su cuello vibran al mismo ritmo que el agua.',
      'Te desnudas con calma y entras en la cala. El agua te sube por el vientre, y cada ola te desliza la piel con una caricia lenta que empieza en el ombligo y termina en la nuca. Te tumbas de espaldas sobre la superficie y la corriente te sostiene, como un colchón que sube y baja con tu respiración. Notas algo que te acaricia por debajo, largo y fresco, y que se enrolla alrededor de tus caderas sin apretar.',
      'Cuando el emisario se mete en el agua, lo hace sin ruido. Sus manos te recorren el pecho y bajan hasta el centro de tu cuerpo con una presión que no tiene prisa. Te abres a él, y lo que entra en ti es frío al principio y después se calienta contra la piel, como una sal que se disuelve. Gimes sobre el agua, y tu voz rebota en la cala y vuelve con un eco que suena a muchas voces. Te arqueas. La corriente te empuja hacia él y el movimiento de las olas te lleva dentro y fuera al mismo tiempo.',
      'Cada vez que el ritmo sube, el agua sube con él y te cubre la boca. Tragas sal y te quedas sin aire un instante, y ese instante te hace temblar de un placer que te deja la garganta en carne viva. Él te sujeta la cintura con un brazo y con el otro te aparta el pelo de la cara. Su respiración es irregular, más lenta que la tuya, y las líneas de su cuello se abren y cierran al compás de tus gemidos. Te besa y su lengua sabe a algas y a cobre.',
      'El último tramo es el más largo. El emisario se hunde un poco más y tú sientes el suelo de la cala bajo las nalgas, un fondo de arena que se mueve con el agua. Te corres con una contracción que te aprieta alrededor de él, y el mar entero parece tensarse con tu cuerpo. Cuando el temblor se apaga, la marea te sube hasta el pecho y te deja salir a la superficie tosiendo. En el hombro izquierdo quedan tres marcas blancas, como de dientes pequeños, que el agua no borra.',
      'Al volver a la playa tienes frío y la piel llena de sal. Te vistes con los dedos temblorosos y el emisario te observa desde la orilla con las doce antorchas detrás. Antes de irte te pone en la mano una piedra húmeda con un nombre grabado. Lo reconoces. Es el tuyo, escrito con la letra de alguien que nunca ha tenido manos.',
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
      'Flotan partículas de luz con escenas compartidas: manos bajo una mesa, trenes perdidos, palabras que nunca se dijeron a tiempo. Una de esas partículas se te posa en el labio inferior y te quema un poco.',
      'Te acercas al marco. El aire de la habitación huele a la colonia de aquel verano, a sábanas de algodón y a lluvia en el cristal. La figura abre los brazos sin decir nada, y el gesto es tan familiar que se te afloja el pecho.',
      'Cruzas el umbral. Tiene la piel del hombro que recordabas, con la misma pequeña cicatriz junto a la clavícula. Lo besas y el beso sabe a todos los besos que te diste en esa época. Las manos de ambos se buscan sin pensar. Le quitas la camisa y su piel se estremece bajo tus dedos, cálida como cuando dormía a tu lado. Tú también te quedas desnudo, y la luz de la tarde antigua te baña el cuerpo con un calor que no es de este siglo.',
      'Te tumba sobre la cama, que ya no es la del hotel sino la de vuestro primer piso. Su peso te aprieta igual que entonces, con la misma torpeza amable y la misma prisa por llegar a donde no llegarían nunca. Te besa el cuello y el pecho, la cadera, el interior del muslo. Cada beso llega un poco después de lo que esperas, como si el tiempo se estirara para que lo sientas dos veces. Gimes. Él te sujeta las muñecas por encima de la cabeza y su respiración te calienta la clavícula.',
      'Entra en ti despacio, reconociéndote. Notas el mismo ángulo de siempre y al mismo tiempo algo que no lo es: la presión se multiplica como si hubiera dos cuerpos empujando desde lugares distintos. Te arqueas. Cada empuje abre una imagen en el aire: vuestras manos bajo una mesa, un tren que sale sin ustedes, una frase que quedó a medias. Te corres con un temblor que te arrastra hacia atrás y el mundo se llena de polvo dorado. Él también se deshace sobre tu vientre y te sonríe con la misma cara de entonces.',
      'Cuando la luz empieza a apagarse, el marco de la puerta ya está cerrado, pero el cristal de la ventana muestra vuestro reflejo doble: dos figuras tumbadas en la cama, abrazadas, y una tercera sentada en el sillón con las manos sobre las rodillas, que mira la escena con una paciencia que no se parece a la tuya.',
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
          narrativeSensual: 'Al cruzar, la frontera entre tu piel y la suya se vuelve difusa: cada caricia la sientes en dos cuerpos a la vez, y cada orgasmo llega en dos tiempos distintos. Regresas al hotel con un lazo que no entra en ninguna cuenta.',
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
      'La luz ámbar sobre las tablas vuelve cálida cada sombra. Una figura ligada a tu pasado espera al otro lado del escenario, y la página tres del libreto aparece subrayada en amarillo con una frase que aún no has pronunciado.',
      '«Conserva tu nombre si quieres —dice el director desde la penumbra—. Por ahora.»',
      'Lees la frase en voz alta. El teatro se apaga, salvo un foco que cae sobre ti y sobre la figura del otro lado. El espejo se gira para mostrar una segunda escena que no has escrito, con el mismo guion y con tu cuerpo en el papel.',
      'La figura se acerca por el escenario con pasos medidos y te toma el mentón entre los dedos. Su voz suena como la tuya grabada en una cinta, un poco más lenta de lo normal. Te pide que te desnudes despacio para la platea, y tú lo haces mientras el foco te calienta la piel. Notas el aire frío en los pezones y el calor de la luz en el vientre, y cada prenda que cae suena en el suelo como una línea que se acaba.',
      'Te tumba sobre la tarima con una mano en el pecho y otra entre los muslos. El público está invisible, pero el silencio de la sala se vuelve un peso. Te besa la garganta y después el vientre, y el contacto de su boca es tan preciso que te arranca gemidos con un ritmo que no decides tú. Sientes el teatro entero inclinarse hacia la escena, y tu propia respiración se vuelve el sonido más fuerte de la sala.',
      'Entra en ti con un empuje que llena el escenario de eco. El foco se mueve con cada embestida y tu cuerpo se muestra a una platea que no ves. Te agarras al borde de la tarima y te oyes gemir, primero bajo y después con toda la garganta. Cada vez que lo sientes profundo, el espejo del fondo se adelanta un segundo y tú lo imitas sin haberlo decidido, con la misma expresión de entrega. Te corres con un temblor que te sacude las piernas, y en ese instante la platea entera exhala a la vez.',
      'Cuando el foco se apaga, quedas tendido sobre la tarima con el libreto arrugado bajo la espalda. La figura se levanta sin prisa y se inclina sobre ti. «Ya lo has dicho todo —susurra—. Ahora solo tienes que repetirlo.» En la última página del libreto, una frase nueva ha aparecido con tu letra.',
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
      'A las tres de la madrugada, los brazos de la Doblada te rodean. No aprietan. Te sostienen como se sostiene a alguien que se está cayendo despacio, y ese cuidado es lo que más cuesta resistir.',
      'Hay que aguantar hasta el alba sin dejar que el cuerpo decida por ti.',
    ],
    textSensual: [
      'Docenas de manos tibias rodean tus hombros, tu cintura, tus muslos y tu rostro, con una unanimidad que ninguna persona podría igualar. No buscan herirte: buscan convencer a tu piel de que diga sí, y la piel empieza a contestar antes que tú.',
      'Entre las manos reconoces a cada uno. El hombro ancho de Ramón, el panadero de la calle de abajo, cincuenta y dos años y las manos llenas de harina. La boca de Begoña, la vecina del tercero, cuarenta y seis años, que te besó una vez en el portal y nunca lo volvió a mencionar. El pecho de Julián, el vigilante de la fábrica, cuarenta y nueve años, con su cicatriz de quemadura en el antebrazo. Y detrás, los ojos de tu madre, que llevaba quince años muerta, mirándote sin reproche.',
      'Te besa primero la boca que más conoces, y su lengua tiene el sabor a café y a pan del horno del barrio. Te bajan la ropa entre varios, sin prisa y sin tirones. Te tumban sobre el suelo de piedra, y la piedra está tibia como una sábana que alguien ha planchado con la plancha de la cocina. Cuando Begoña se inclina sobre tu pecho y te muerde el pezón con los dientes justos, sientes un calor que te baja al vientre y te arranca el primer gemido de verdad.',
      'Julián te separa las piernas con las dos manos y su boca baja por el interior de tus muslos. Notas cada pausa de su respiración, cada vez que se detiene para mirarte antes de seguir. Ramón te sujeta la cintura y te levanta un poco, y el movimiento hace que tu sexo quede al alcance de la boca de Julián, que lo recorre despacio, con la lengua caliente, hasta que te arqueas y te oyes gritar su nombre. Begoña te besa mientras tanto, y su mano te aprieta la muñeca contra el suelo.',
      'Entonces los rostros empiezan a cambiar. Ramón sigue dentro de tu cuerpo con un empuje lento y profundo, pero su cara se confunde con la de Begoña, y la de Begoña con la de Julián, hasta que no sabes cuál de los tres te llena. Tu madre se inclina sobre ti y te besa en la frente. Notas el peso de varios cuerpos encima de ti y sientes que la piel de cada uno se vuelve tibia y elástica, como si todo el grupo estuviera empezando a compartir la misma carne. Te corres con una contracción que te deja sin aire, y en ese instante el suelo entero palpita contra tu espalda, como un corazón que se alegra de tener un cuerpo más.',
      'La vigilia sigue. El calor unánime quiebra tus rodillas y te deja abierto, y cada persona de la masa te toca de una manera distinta: Julián con la lengua en el cuello, Begoña con los dedos dentro, Ramón con la respiración contra tu oreja diciéndote que no tengas miedo de disfrutar. Tus gemidos se mezclan con los de todos. Vuelves a correrte más hondo, y esta vez el placer tarda en apagarse, como un eco dentro de un hueco de piedra.',
      'Cuando asoma la primera luz por el respiradero, los brazos se aflojan despacio. Te quedas tendido en el suelo, con los muslos pegajosos y la garganta en carne viva. Quien se levanta primero es Julián. Te mira con la cicatriz del antebrazo brillando por el sudor y dice tu nombre con la voz de alguien que acaba de reconocerse en otro. Tu madre ya no está en el círculo. En el sitio donde estaba queda un plato de sopa tibia, y un olor a incienso dulce que se te pega al pelo.',
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
            acDelta: -4,
            addFlag: 'vigilia_completada',
            nextSceneId: 'doble_acto3_resolucion',
          },
          onFail: {
            narrativeVelo: 'El abrazo te arrastra al borde del clímax, y sigues allí hasta que el alba decide por ti. Todavía puedes luchar por el desenlace en el último acto, pero ya no tienes el cuerpo que tenías al bajar.',
            narrativeSensual: 'El calor unánime quiebra tus rodillas y te arrastra al interior del círculo. Te entregas a Ramón, a Begoña y a Julián en una misma ola que no se detiene hasta el amanecer, y despiertas con el pecho cubierto de marcas de manos que no reconoces como tuyas.',
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
