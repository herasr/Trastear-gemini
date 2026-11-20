import type { BestiaryEntity } from '../types/game.ts';

export const BESTIARY_ENTITIES: BestiaryEntity[] = [
  {
    id: 'ninfa-zarza',
    name: 'La Ninfa de la Zarza Negra',
    subtitle: 'La que florece en lo que pisa · Sección 6.1',
    artworkKey: 'ninfa',
    description:
      'De lejos, una figura pálida envuelta en enredaderas oscuras con una belleza que duele. De cerca, la tela son zarcillos vivos con espinas que rezuman savia tibia. Se comunica mediante feromonas emocionales que la víctima interpreta como palabras de alguien amado.',
    intimateAnatomy:
      'Los zarcillos conocen la anatomía humana mejor que sus dueños y la savia cálida entumece la duda antes de que la mente despierte.',
    attributes: { FUE: 45, CON: 70, TAM: 60, DES: 65, APA: 90, POD: 75, INT: 60 },
    pv: 13,
    maxPv: 13,
    pm: 15,
    maxPm: 15,
    ac: 14,
    maxAc: 14,
    armor: 1,
    skills: {
      tecnica: 75,
      ataduras: 85,
      provocar: 90,
      resistenciaCarnal: 60,
      psicologia: 65,
      esquivar: 45,
    },
    dualLossText:
      'Ilusión intacta: INH 1d6. Forma revelada (zarcillos y espinas): COR 1/1d4+1 e INH 1d3 simultáneas.',
    climaxEffectName: 'Drenaje Vital',
    climaxEffectDesc:
      'Drena 1d6 PM (y 1 CON permanente por victoria Extrema). Deja una cicatriz floral en la piel.',
    climaxType: 'PM',
    weaknessName: 'Inversión del rito y Fuego',
    weaknessDesc:
      'Vencerla en Combate Íntimo (AC 0) y atarla con Ataduras Arduo permite extraer su savia sin morir; el fuego destruye el invernadero.',
    weaknessSkill: 'ataduras',
    signatureMoves: ['beso', 'caricias', 'ataduras_vivas', 'union'],
  },
  {
    id: 'falso-confidente',
    name: 'El Falso Confidente',
    subtitle: 'El amigo que solo existe cuando ya no queda nadie · Sección 6.2',
    artworkKey: 'confidente',
    description:
      'Parásito psíquico de forma prestada: adopta el rostro perfecto de un colega comprensivo, un amor perdido o un terapeuta sin juicios. Se alimenta de POD hasta convertir a la víctima en un cascarón que defiende la mentira.',
    intimateAnatomy:
      'Mímesis exacta: durante el encuentro recoge cada nombre susurrado y cada confesión para introducir sus hilos invisibles de cariño venenoso.',
    attributes: { FUE: 40, CON: 50, TAM: 50, DES: 60, APA: 80, POD: 85, INT: 90 },
    pv: 10,
    maxPv: 10,
    pm: 17,
    maxPm: 17,
    ac: 13,
    maxAc: 13,
    armor: 0,
    skills: {
      tecnica: 60,
      ataduras: 50,
      provocar: 80,
      resistenciaCarnal: 70,
      psicologia: 90,
      esquivar: 60,
    },
    dualLossText:
      'Descubrir la mentira cuesta COR 1/1d6 e INH 1d4: la víctima comprende que se abrió por voluntad propia.',
    climaxEffectName: 'Drenaje de POD',
    climaxEffectDesc:
      'Drena 1d4 POD permanentes. Si POD cae a 20 o menos, la víctima se vuelve portavoz involuntario.',
    climaxType: 'POD',
    weaknessName: 'Desenmascarar e Hilos de Ectoplasma',
    weaknessDesc:
      'Inspección Psicología/INT Ardua descubre la sonrisa demasiado perfecta; cortar sus hilos de fuga lo deshace como papel húmedo.',
    weaknessSkill: 'psicologia',
    signatureMoves: ['beso', 'elogio_sucio', 'caricias', 'entrega'],
  },
  {
    id: 'vastago-fosa',
    name: 'El Vástago de la Fosa',
    subtitle: 'Lo que la marea deja, la marea reclama · Sección 6.3',
    artworkKey: 'vastago',
    description:
      'Masa anfibia de piel gris y translúcida surgida de fosas y puertos hundidos. En lugar de rostro tiene una abertura que respira. Caza destinos antes que alimento: busca bautizar y mutar la carne hacia lo profundo.',
    intimateAnatomy:
      'Su contacto conserva el frío del agua profunda; el abrazo que aprieta y el vértigo de la falta de aire confunden el ahogo con el clímax.',
    attributes: { FUE: 85, CON: 90, TAM: 95, DES: 40, APA: 25, POD: 55, INT: 35 },
    pv: 18,
    maxPv: 18,
    pm: 11,
    maxPm: 11,
    ac: 15,
    maxAc: 15,
    armor: 2,
    skills: {
      tecnica: 55,
      ataduras: 70,
      provocar: 45,
      resistenciaCarnal: 60,
      psicologia: 30,
      esquivar: 65,
    },
    dualLossText:
      'Primera visión: COR 1/1d6. Contacto íntimo: INH 1d4 por el vértigo del ahogo (se narra siempre con velo estricto).',
    climaxEffectName: 'Mutación de Fosa',
    climaxEffectDesc:
      'Drena 1d3 CON permanentes y siembra el bautismo abisal (branquioneas parciales o etapa de Profundo si falla CON Ardua).',
    climaxType: 'CON',
    weaknessName: 'Sal marina y agua corriente',
    weaknessDesc:
      'Una línea de sal arrojada con éxito interrumpe su avance un asalto; el agua corriente quema sus gérmenes.',
    weaknessSkill: 'buscar',
    signatureMoves: ['ataduras_vivas', 'cambio_ritmo', 'union'],
  },
  {
    id: 'coro-sabanas',
    name: 'El Coro de las Sábanas',
    subtitle: 'La casa que abraza a quien duerme solo · Sección 6.4',
    artworkKey: 'coro',
    description:
      'Colonia de tejidos animados —sábanas, encajes, cortinas y vendas— unidos por hebras de ectoplasma gris que anida en camas donde alguien lloró mucho. Al anochecer teje el peso y el olor de quien el durmiente más añora.',
    intimateAnatomy:
      'Sin manos, inventa dobleces y tensiones de lino cálido en la penumbra del sueño, bebiendo el aliento y la vigilia del durmiente.',
    attributes: { FUE: 35, CON: 55, TAM: 40, DES: 50, APA: 45, POD: 65, INT: 45 },
    pv: 8,
    maxPv: 8,
    pm: 13,
    maxPm: 13,
    ac: 12,
    maxAc: 12,
    armor: 0,
    skills: {
      tecnica: 65,
      ataduras: 70,
      provocar: 75,
      resistenciaCarnal: 50,
      psicologia: 60,
      esquivar: 60,
    },
    dualLossText:
      'Verlo moverse sin forma: COR 0/1d4. Reconocer el rostro tejido durante un abrazo: COR 1/1d6 e INH 1d6.',
    climaxEffectName: 'Siembra de la Vigilia',
    climaxEffectDesc:
      'Drena 1d3 PM y siembra la vigilia: ya no concilia el sueño sin algo abrazándole (-1 INH por noche cerca del Coro).',
    climaxType: 'SIEMBRA',
    weaknessName: 'Fuego y cotidianidad (migajas)',
    weaknessDesc:
      'El fuego lo deshace en minutos; comer en la cama (migajas reales) profana su territorio durante 1d10 noches.',
    weaknessSkill: 'ocultismo',
    signatureMoves: ['desnudez', 'caricias', 'ataduras_vivas', 'beso'],
  },
  {
    id: 'senora-aguas',
    name: 'La Señora de las Aguas Dulces',
    subtitle: 'La esposa que el río eligió por ti · Sección 6.5',
    artworkKey: 'senora',
    description:
      'Matriarca ancestral del río o lago que fundó la ciudad. Cortés, noble y tan hermosa como una estatua bajo agua movida. Jamás ataca ni persigue: propone contratos escritos y honestos cuyo precio es tu Inhibición.',
    intimateAnatomy:
      'Cada etapa del pacto se consuma bajo la corriente con lentitud ceremonial; sus cónyuges cuentan que bajo el río es la única vez que estuvieron del todo calientes.',
    attributes: { FUE: 60, CON: 80, TAM: 75, DES: 55, APA: 70, POD: 80, INT: 75 },
    pv: 15,
    maxPv: 15,
    pm: 16,
    maxPm: 16,
    ac: 16,
    maxAc: 16,
    armor: 2,
    skills: {
      tecnica: 70,
      ataduras: 55,
      provocar: 85,
      resistenciaCarnal: 75,
      psicologia: 80,
      esquivar: 50,
    },
    dualLossText:
      'Verla erguida a plena luz: COR 0/1d6. Escuchar su propuesta completa (aunque se rechace): INH 1d6.',
    climaxEffectName: 'Bautizo Consentido',
    climaxEffectDesc:
      'Firma una etapa del pacto (-1d10 INH voluntario a cambio de un don real). Tres rechazos la obligan por ley antigua a no volver a ofrecerte nada.',
    climaxType: 'SIEMBRA',
    weaknessName: 'Tres rechazos limpios',
    weaknessDesc:
      'Una oferta rechazada tres veces por la misma persona la ata a retirarse para siempre de ti y de tu linaje.',
    weaknessSkill: 'persuasion',
    signatureMoves: ['beso', 'caricias', 'entrega', 'union'],
  },
  {
    id: 'sacerdote-velo',
    name: 'El Sacerdote del Velo',
    subtitle: 'El hombre que ya no necesita rostro · Sección 6.6',
    artworkKey: 'sacerdote',
    description:
      'Mortal que hizo permanente el Velo de Belleza. Para quien lo mira, su rostro es exactamente lo que esa persona desea ver; para una cámara o un espejo, es apenas una mancha movida. Preside células del Círculo con sermones irrebatibles.',
    intimateAnatomy:
      'No tiene un gramo de mito en el cuerpo; su peligro es pura práctica humana, escucha activa y liturgia consagrada.',
    attributes: { FUE: 40, CON: 60, TAM: 55, DES: 60, APA: 90, POD: 85, INT: 80 },
    pv: 11,
    maxPv: 11,
    pm: 17,
    maxPm: 17,
    ac: 14,
    maxAc: 14,
    armor: 0,
    skills: {
      tecnica: 65,
      ataduras: 40,
      provocar: 80,
      resistenciaCarnal: 60,
      psicologia: 75,
      esquivar: 45,
    },
    dualLossText:
      'Escuchar su homilía: INH 1d4 (sin COR: es humano). Intentar recordar su cara después: COR 0/1.',
    climaxEffectName: 'Reclutamiento Amable',
    climaxEffectDesc:
      'Drena 1d6 PM y marca una invitación a la próxima Liturgia del Despertar del Círculo.',
    climaxType: 'PM',
    weaknessName: 'Espejos y Cámaras',
    weaknessDesc:
      'Observar su reflejo en un espejo (Buscar Arduo) revela que no hay rostro allí y otorga +20% a resistir sus Homilías.',
    weaknessSkill: 'buscar',
    signatureMoves: ['beso', 'desnudez', 'elogio_sucio', 'entrega'],
  },
  {
    id: 'congregacion-doblada',
    name: 'La Congregación Doblada',
    subtitle: 'El rebaño que dijo sí hasta ser una sola carne · Sección 6.7',
    artworkKey: 'doblada',
    description:
      'En la cripta bajo el templo madre duermen decenas de fieles plegados en una sola masa palpitante. Conservan sus rostros conscientes y sonrientes y ofrecen pertenencia absoluta: la promesa de no volver a estar solo.',
    intimateAnatomy:
      'Extiende docenas de brazos que conocen exactamente lo que es la soledad mortal; su abrazo no hiere: acoge.',
    attributes: { FUE: 70, CON: 85, TAM: 150, DES: 30, APA: 90, POD: 70, INT: 60 },
    pv: 24,
    maxPv: 24,
    pm: 14,
    maxPm: 14,
    ac: 18,
    maxAc: 18,
    armor: 3,
    skills: {
      tecnica: 80,
      ataduras: 75,
      provocar: 85,
      resistenciaCarnal: 70,
      psicologia: 90,
      esquivar: 20,
    },
    dualLossText:
      'Verla en pleno en la cripta: COR 1/1d8 e INH 1d6. Reconocer a alguien amado en la masa: COR 1/1d6 adicional.',
    climaxEffectName: 'La Adopción (Fusión)',
    climaxEffectDesc:
      'Propone una tirada enfrentada de POD si INH=0 (o drena 1d6 PM y 1d3 CON en vigilia). Siempre devuelve un rostro por cada vigilia completa resistida.',
    climaxType: 'FUSION',
    weaknessName: 'La Piedad (Nombrar un rostro)',
    weaknessDesc:
      'Dirigirse a un rostro concreto por su nombre (Psicología/Persuasión vs POD 70) hace dudar a la masa y reduce su aguante.',
    weaknessSkill: 'persuasion',
    signatureMoves: ['ataduras_vivas', 'caricias', 'elogio_sucio', 'union'],
  },
  {
    id: 'cabra-dos-sangres',
    name: 'La Cabra de las Dos Sangres',
    subtitle: 'La bendición que paga el campo con carne · Sección 6.8',
    artworkKey: 'cabra',
    description:
      'Avatar menor del linaje del Cabrito Negro entre el trigo alto. Belleza imposible de anatomía doble exhibida sin vergüenza ni pudor. Los pueblos bendecidos por ella jamás pasan hambre, aunque nadie regresa igual de la luna llena.',
    intimateAnatomy:
      'Fecundar y ser fecundada al mismo tiempo; cumple cada pacto de prosperidad al pie de la letra.',
    attributes: { FUE: 65, CON: 85, TAM: 80, DES: 60, APA: 80, POD: 70, INT: 40 },
    pv: 16,
    maxPv: 16,
    pm: 14,
    maxPm: 14,
    ac: 15,
    maxAc: 15,
    armor: 2,
    skills: {
      tecnica: 80,
      ataduras: 50,
      provocar: 85,
      resistenciaCarnal: 70,
      psicologia: 55,
      esquivar: 50,
    },
    dualLossText:
      'Verla entera entre el trigo: COR 1/1d6 e INH 1d6. Verla tras haber pactado: solo INH (el horror ya desapareció).',
    climaxEffectName: 'Bendición de la Doble Sangre',
    climaxEffectDesc:
      'Ofrece +1 CON permanente y curación a cambio de 1d6 INH y un vínculo estacional bajo la luna llena.',
    climaxType: 'SIEMBRA',
    weaknessName: 'La Paridad (Quemar la cosecha)',
    weaknessDesc:
      'Todo pacto con ella es simétrico. Quemar la cosecha consagrada reduce sus tiradas a la mitad, pero trae el invierno de hambre.',
    weaknessSkill: 'ocultismo',
    signatureMoves: ['desnudez', 'entrega', 'union', 'cambio_ritmo'],
  },
];
