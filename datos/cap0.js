/* =========================================================
   CAPÍTULO 0 — LA DUDA Y LA EXPERIENCIA (Descartes y Hume)
   Noche de llegada al observatorio. Prepara el paso a la inducción (Capítulo 1).
   Formato: igual que datos/cap1.js (ver README). Banderas con prefijo "c0-".
   ========================================================= */
DATOS.capitulos.cap0 = {
  id: "cap0",
  numero: 0,
  titulo: "La duda y la experiencia",
  prefijo: "c0-",
  escenaInicial: "c0-camino",

  objetivos: [
    { si: { bandera: "c0-fin" }, texto: "Capítulo completado. Habla con el eco de Hume para continuar." },
    { si: { bandera: "c0-horquilla" }, texto: "Habla con el eco de Hume para escribir tus reflexiones." },
    { si: { bandera: "c0-cogito" }, texto: "Habla con el eco de David Hume." },
    { si: { bandera: "c0-proyeccion" }, texto: "Habla con la figura luminosa: el eco de René Descartes." },
    { si: { bandera: "c0-desperto" }, texto: "Sal por la puerta de tu pieza y acompaña a Valentina al planetario." },
    { si: { bandera: "c0-sueno-visto" }, texto: "Busca una señal segura de que no estás soñando (prueba al menos tres cosas)." },
    { si: { bandera: "c0-libro" }, texto: "Es tarde: acuéstate a dormir." },
    { si: { bandera: "c0-pieza-vista" }, texto: "Explora tu pieza. Hay un libro sobre el escritorio." },
    { si: { bandera: ["c0-espejismo", "c0-luna"] }, texto: "Sube al observatorio (en la cima del cerro)." },
    { texto: "Mira con calma el paisaje: algo en el camino y algo en el cielo llaman la atención." }
  ],

  cierre: "**Lo que descubriste:** Descartes usa la duda como **método** para buscar una certeza absoluta y la encuentra en el «pienso, existo». Hume, en cambio, rastrea el origen de las ideas en la **experiencia** y distingue relaciones de ideas de cuestiones de hecho.\n\n**Pregunta para el próximo capítulo:** si todo lo que sabemos sobre los hechos viene de experiencias particulares, ¿cómo llegamos a leyes generales sobre _todos_ los casos?",

  /* ---------------------------------------------------------
     ESCENAS (mapas). Ver README: «Mapas y lugares».
     mapa.terreno: una letra por baldosa. mapa.objetos: [tipo, x, y, condición].
     Cada lugar (hotspot) está "en" [x, y] o [x, y, ancho, alto], en baldosas.
     sprite: personaje que aparece ahí. pisar: se activa al caminar encima (puertas).
     --------------------------------------------------------- */
  escenas: {
    "c0-camino": {
      nombre: "Camino al observatorio",
      mapa: {
        modo: "atardecer",
        tinte: "#ffe4cc",
        terreno: [
          "aaaaaaaaaaaaaaaaaaaa",
          "aaaaaaaaaaaaaaaaaaaa",
          "bbbbbbbbbbbbbbbbbbbb",
          "cccccccccccccccccccc",
          "mmmmmmmmmmmmmmmmmmmm",
          "___________:::______",
          "..,.......,:::.,....",
          ".........,.:::......",
          "====================",
          "-=-=-=-=-=-=-=-=-=-=",
          "====================",
          ".,......,......,..,.",
          "......,.........,...",
          "..,.......,.........",
          ".......,.......,..,."
        ],
        objetos: [
          ["luna", 2, 2], ["observatorio-lejos", 11, 4], ["camioneta", 3, 8],
          ["charco", 15, 9], ["letrero", 15, 6], ["cactus", 1, 11], ["cactus", 17, 12],
          ["cactus", 8, 6], ["piedra", 13, 13], ["piedra", 0, 7]
        ],
        inicio: [5, 7, "der"]
      },
      alEntrar: [
        { si: { noBandera: "c0-llegada" }, entonces: [{ dialogo: "c0-llegada" }] }
      ],
      hotspots: [
        { id: "espejismo", etiqueta: "Charco en el camino", en: [15, 9, 2, 1],
          acciones: [{ dialogo: "c0-espejismo" }] },
        { id: "luna", etiqueta: "La Luna", en: [2, 2, 2, 3],
          acciones: [{ dialogo: "c0-luna" }] },
        { id: "ramiro", etiqueta: "Don Ramiro", en: [7, 7], sprite: "ramiro", mira: "izq",
          acciones: [{ dialogo: "c0-ramiro-camino" }] },
        { id: "letrero", etiqueta: "Letrero", en: [15, 6],
          acciones: [{ dialogo: "c0-letrero" }] },
        { id: "observatorio", etiqueta: "Subir al observatorio", en: [11, 5, 3, 1], pisar: true,
          si: { bandera: ["c0-espejismo", "c0-luna"] },
          acciones: [{ dialogo: "c0-subir" }, { ir: "c0-pieza" }] },
        { id: "observatorio", etiqueta: "Subir al observatorio", en: [11, 5, 3, 1], pisar: true,
          si: { alguna: [{ noBandera: "c0-espejismo" }, { noBandera: "c0-luna" }] },
          acciones: [{ dialogo: "c0-todavia-no" }] }
      ]
    },

    "c0-pieza": {
      nombre: "Tu pieza en la residencia",
      mapa: {
        modo: "madera",
        terreno: [
          "WWWWWWWWWW",
          "wwwwwwwwww",
          "oooooooooo",
          "oooooooooo",
          "oooorrrooo",
          "oooorrrooo",
          "oooooooooo",
          "oooooooodo"
        ],
        objetos: [
          ["ventana", 3, 0], ["cuadro", 1, 1], ["estante", 8, 1], ["cama", 1, 2],
          ["escritorio", 5, 2], ["libro", 5, 2], ["vaso", 7, 2], ["silla", 6, 3], ["planta", 9, 2]
        ],
        inicio: [8, 6, "arriba"],
        desde: { "c0-camino": [8, 6, "arriba"], "c0-sueno": [2, 3, "abajo"] }
      },
      alEntrar: [
        { si: { noBandera: "c0-pieza-vista" }, entonces: [{ dialogo: "c0-pieza-llegada" }] },
        { si: { bandera: "c0-desperto", noBandera: "c0-golpe" }, entonces: [{ dialogo: "c0-despertar" }] }
      ],
      hotspots: [
        { id: "libro", etiqueta: "Libro con papelitos", en: [5, 2],
          acciones: [{ dialogo: "c0-libro" }] },
        { id: "vaso", etiqueta: "Vaso de agua con bombilla", en: [7, 2],
          acciones: [{ dialogo: "c0-bombilla" }] },
        { id: "ventana", etiqueta: "Ventana", en: [3, 1, 2, 1],
          acciones: [{ dialogo: "c0-ventana" }] },
        { id: "cama", etiqueta: "Cama", en: [1, 2, 1, 2],
          si: { noBandera: "c0-libro" },
          acciones: [{ mensaje: "Todavía no tienes sueño. ¿Y ese libro sobre el escritorio?" }] },
        { id: "cama", etiqueta: "Dormir", en: [1, 2, 1, 2],
          si: { bandera: "c0-libro", noBandera: "c0-desperto" },
          acciones: [{ dialogo: "c0-dormir" }, { ir: "c0-sueno" }] },
        { id: "cama", etiqueta: "Cama", en: [1, 2, 1, 2],
          si: { bandera: "c0-desperto" },
          acciones: [{ mensaje: "Ya no tienes nada de sueño. Valentina te espera en el pasillo." }] },
        { id: "puerta", etiqueta: "Puerta", en: [8, 7], pisar: true,
          si: { noBandera: "c0-desperto" },
          acciones: [{ mensaje: "El pasillo está en silencio. Mejor descansar: mañana empieza la práctica." }] },
        { id: "puerta", etiqueta: "Ir al planetario con Valentina", en: [8, 7], pisar: true,
          si: { bandera: "c0-desperto" },
          acciones: [{ ir: "c0-planetario" }] }
      ]
    },

    "c0-sueno": {
      nombre: "La cúpula… ¿o no?",
      mapa: {
        modo: "sueno",
        terreno: [
          "WWWWWWWWWWW",
          "wwwwwwwwwww",
          "zzzzzzzzzzz",
          "zzzzzzzzzzz",
          "zzzzzzzzzzz",
          "zzzzzzzzzzz",
          "zzzzzzzzzzz",
          "zzzzzzzzzzz"
        ],
        objetos: [
          ["espejo", 2, 0], ["pizarra-sueno", 8, 1], ["telescopio", 4, 2], ["reloj", 1, 4]
        ],
        inicio: [5, 6, "arriba"]
      },
      alEntrar: [
        { si: { noBandera: "c0-sueno-visto" }, entonces: [{ dialogo: "c0-sueno-inicio" }] }
      ],
      hotspots: [
        { id: "manos", etiqueta: "Espejo (pellizcarte)", en: [2, 1],
          acciones: [{ dialogo: "c0-pellizco" }] },
        { id: "reloj", etiqueta: "Reloj flotante", en: [1, 4],
          acciones: [{ dialogo: "c0-reloj" }] },
        { id: "collao", etiqueta: "Dra. Collao (¿?)", en: [8, 4], sprite: "collao", mira: "izq",
          acciones: [{ dialogo: "c0-collao-sueno" }] },
        { id: "pizarra", etiqueta: "Pizarra", en: [8, 1, 2, 1],
          acciones: [{ dialogo: "c0-pizarra-sueno" }] },
        { id: "despertar", etiqueta: "Una luz muy brillante", en: [6, 1], sprite: "luz",
          si: { bandera: ["c0-p-pellizco", "c0-p-reloj", "c0-p-collao"] },
          acciones: [
            { dialogo: "c0-despertando" },
            { poner: "c0-desperto", desbloquear: { cuaderno: "sueno" } },
            { ir: "c0-pieza" }
          ] }
      ]
    },

    "c0-planetario": {
      nombre: "Planetario",
      mapa: {
        modo: "oscuro",
        tinte: "#c8c4f0",
        terreno: [
          "sssssssssssss",
          "sssssssssssss",
          "kkkkkkkkkkkkk",
          "kkkkkkkkkkkkk",
          "kkkkkkkkkkkkk",
          "kkkkkkkkkkkkk",
          "kkkkkkkkkkkkk",
          "kkkkkkkkkkkkk",
          "kkkkkkkkkkkkk"
        ],
        objetos: [
          ["proyector", 5, 3],
          ["butaca", 1, 6], ["butaca", 2, 6], ["butaca", 3, 6], ["butaca", 9, 6], ["butaca", 10, 6], ["butaca", 11, 6],
          ["butaca", 1, 7], ["butaca", 2, 7], ["butaca", 3, 7], ["butaca", 9, 7], ["butaca", 10, 7], ["butaca", 11, 7]
        ],
        inicio: [6, 8, "arriba"]
      },
      alEntrar: [
        { si: { noBandera: "c0-proyeccion" }, entonces: [{ dialogo: "c0-planetario-intro" }] }
      ],
      hotspots: [
        { id: "cielo", etiqueta: "Cielo proyectado", en: [0, 0, 13, 2],
          acciones: [{ dialogo: "c0-cielo-proyectado" }] },
        { id: "proyector", etiqueta: "Proyector de estrellas", en: [5, 3, 2, 2],
          acciones: [{ dialogo: "c0-proyector" }] },
        { id: "valentina", etiqueta: "Valentina", en: [8, 4], sprite: "valentina", mira: "izq",
          acciones: [{ dialogo: "c0-valentina" }] },

        { id: "descartes", etiqueta: "Figura luminosa (eco de Descartes)", en: [2, 3], sprite: "descartes",
          si: { bandera: "c0-proyeccion", noBandera: "c0-cogito" },
          acciones: [
            { dialogo: "c0-descartes-1" },
            { puzle: "c0-criba" },
            { poner: "c0-cogito", desbloquear: { cuaderno: ["genio-maligno", "cogito"], glosario: ["cogito", "escepticismo", "racionalismo"] } },
            { dialogo: "c0-descartes-2" }
          ] },
        { id: "descartes", etiqueta: "Eco de René Descartes", en: [2, 3], sprite: "descartes",
          si: { bandera: "c0-cogito" },
          acciones: [{ dialogo: "c0-descartes-despues" }] },

        { id: "hume", etiqueta: "Eco de David Hume", en: [10, 3], sprite: "hume",
          si: { bandera: "c0-cogito", noBandera: "c0-ideas" },
          acciones: [
            { dialogo: "c0-hume-1" },
            { puzle: "c0-ideas" },
            { poner: "c0-ideas", desbloquear: { cuaderno: "impresiones-ideas", glosario: ["impresion", "idea-hume", "principio-copia", "empirismo"] } },
            { dialogo: "c0-hume-2" },
            { puzle: "c0-horquilla" },
            { poner: "c0-horquilla", desbloquear: { cuaderno: ["horquilla", "racionalismo-empirismo", "hume-duda"], glosario: ["relaciones-ideas", "cuestiones-hecho", "a-priori", "a-posteriori"] } },
            { dialogo: "c0-hume-3" },
            { evaluacion: "cap0" },
            { poner: "c0-fin" },
            { finCapitulo: true }
          ] },
        { id: "hume", etiqueta: "Eco de David Hume", en: [10, 3], sprite: "hume",
          si: { bandera: "c0-ideas", noBandera: "c0-horquilla" },
          acciones: [
            { dialogo: "c0-hume-retomar" },
            { puzle: "c0-horquilla" },
            { poner: "c0-horquilla", desbloquear: { cuaderno: ["horquilla", "racionalismo-empirismo", "hume-duda"], glosario: ["relaciones-ideas", "cuestiones-hecho", "a-priori", "a-posteriori"] } },
            { dialogo: "c0-hume-3" },
            { evaluacion: "cap0" },
            { poner: "c0-fin" },
            { finCapitulo: true }
          ] },
        { id: "hume", etiqueta: "Eco de David Hume", en: [10, 3], sprite: "hume",
          si: { bandera: "c0-horquilla", noBandera: "c0-fin" },
          acciones: [{ dialogo: "c0-hume-reflexion" }, { evaluacion: "cap0" }, { poner: "c0-fin" }, { finCapitulo: true }] },
        { id: "hume", etiqueta: "Eco de David Hume", en: [10, 3], sprite: "hume",
          si: { bandera: "c0-fin" },
          acciones: [{ dialogo: "c0-hume-fin" }, { finCapitulo: true }] }
      ]
    }
  },

  dialogos: {
    /* ----- Camino ----- */
    "c0-llegada": [
      { texto: "Atardecer en el desierto de Atacama. La camioneta de Don Ramiro se detiene a un costado del camino. Allá arriba, en la cima del cerro, se ve la cúpula del **Observatorio Alto Tamarugo**." },
      { quien: "ramiro", texto: "Paré para que mire el paisaje, {nombre}. La primera vez hay que verlo con calma. Yo soy Ramiro, el cuidador." },
      { quien: "ramiro", texto: "La Dra. Collao llega mañana. Hoy le toca instalarse y descansar, que las noches acá son largas." },
      { texto: "**Consejo:** camina con las **flechas** (o W A S D) y presiona **A** (Enter o Espacio) frente a algo o alguien para interactuar. También puedes hacer clic donde quieras ir. Con la tecla **R** verás los lugares importantes. Nada tiene tiempo límite.",
        acciones: [{ poner: "c0-llegada" }] }
    ],
    "c0-espejismo": [
      { si: { noBandera: "c0-espejismo" }, texto: "A lo lejos, sobre el asfalto, brilla un charco de agua. Hasta parece reflejar el cielo." },
      { si: { noBandera: "c0-espejismo" }, quien: "ramiro", texto: "¿Agua? En este camino no llueve hace años. Camine un poco y verá." },
      { si: { noBandera: "c0-espejismo" }, texto: "A medida que avanzas, el «charco» retrocede y desaparece. Era un **espejismo**: el aire caliente sobre el asfalto curva la luz que viene del cielo, y el cielo parece reflejado en el suelo." },
      { si: { noBandera: "c0-espejismo" }, texto: "Tus ojos no inventaron la luz: esa luz sí llegaba desde ahí. Lo que falló fue tu juicio: «ahí hay agua».",
        acciones: [{ poner: "c0-espejismo" }], ir: "fin" },
      { texto: "El «charco» sigue ahí, siempre un poco más lejos. Ahora sabes que no es agua… pero tus ojos lo siguen viendo igual." }
    ],
    "c0-luna": [
      { si: { noBandera: "c0-luna" }, texto: "La Luna llena asoma sobre los cerros. Se ve enorme, mucho más grande que cuando está en lo alto del cielo." },
      { si: { noBandera: "c0-luna" }, quien: "ramiro", texto: "Así sale siempre. Mi abuela decía que la Luna se acerca para mirar el salar.",
        opciones: [
          { texto: "¿Y de verdad está más cerca?", ir: "cerca" },
          { texto: "Es impresionante.", ir: "cerca" }
        ] },
      { id: "cerca", si: { noBandera: "c0-luna" }, texto: "No lo está. Si la midieras con una foto, tendría el mismo tamaño junto a los cerros que en lo alto. Es una **ilusión**: la vemos más grande cuando está junto al paisaje. Todavía se discute por qué pasa.",
        acciones: [{ poner: "c0-luna" }], ir: "fin" },
      { texto: "La Luna sigue pareciendo enorme, aunque sabes que no ha cambiado de tamaño." }
    ],
    "c0-ramiro-camino": [
      { si: { bandera: ["c0-espejismo", "c0-luna"] }, quien: "ramiro", texto: "¿Vio? El desierto es bien engañador. ¿Vamos subiendo? El observatorio está en la cima.", ir: "fin" },
      { quien: "ramiro", texto: "Mire con calma: el camino, el cielo… Acá la vista le hace trampas a uno." }
    ],
    "c0-letrero": [
      { texto: "«OBSERVATORIO ALTO TAMARUGO ↑». Debajo, alguien escribió con plumón: «Mire el cielo con calma»." }
    ],
    "c0-todavia-no": [
      { quien: "ramiro", texto: "Espérese un poquito, que todavía no ha mirado nada. Fíjese en el camino y en el cielo." }
    ],
    "c0-subir": [
      { quien: "ramiro", texto: "Vamos, que refresca rápido." },
      { texto: "Suben por un camino de tierra. Mientras la camioneta salta entre las piedras, piensas: si tus ojos te engañaron dos veces en diez minutos… ¿en qué más te podrían estar engañando?" }
    ],

    /* ----- Pieza ----- */
    "c0-pieza-llegada": [
      { texto: "Tu pieza en la residencia del observatorio: una cama, un escritorio y una ventana llena de estrellas." },
      { quien: "ramiro", texto: "Aquí se queda. El baño está al fondo del pasillo. Y en el escritorio le dejaron un libro: la estudiante en práctica del año pasado dijo que era «para la primera noche».",
        acciones: [{ poner: "c0-pieza-vista" }] }
    ],
    "c0-libro": [
      { si: { noBandera: "c0-libro" }, texto: "Un libro viejo: _Meditaciones metafísicas_, de René Descartes (1641). Tiene papelitos de colores pegados y una nota en la primera página:" },
      { si: { noBandera: "c0-libro" }, texto: "«Para quien llegue después de mí: Descartes quería encontrar algo **absolutamente cierto**, algo de lo que no se pudiera dudar. Su método fue raro: dudar de todo lo que se pueda dudar, aunque sea un poquito, y ver qué queda en pie. Pruébalo tu primera noche acá. — V.»" },
      { si: { noBandera: "c0-libro" }, texto: "Un papelito marca una idea subrayada: es prudente no fiarse del todo de quien nos ha engañado alguna vez. Piensas en el charco y en la Luna.",
        acciones: [{ poner: "c0-libro", desbloquear: { cuaderno: "duda-metodica", glosario: "duda-metodica" } }], ir: "fin" },
      { texto: "_Meditaciones metafísicas_. La nota de «V.» sigue ahí: «dudar de todo lo que se pueda dudar, y ver qué queda en pie»." }
    ],
    "c0-bombilla": [
      { texto: "La bombilla parece quebrada justo donde entra al agua. La sacas: está entera. La vuelves a meter: quebrada otra vez." },
      { texto: "Tercer engaño de la noche. Y eso que la tienes aquí mismo, a un palmo de la cara.", acciones: [{ poner: "c0-bombilla" }] }
    ],
    "c0-ventana": [
      { texto: "Nunca habías visto tantas estrellas. ¿O será que nunca habías mirado de verdad?" }
    ],
    "c0-dormir": [
      { texto: "Apagas la luz. Por la ventana, las estrellas siguen ahí. Te duermes pensando en ellas…" }
    ],
    "c0-despertar": [
      { texto: "Despiertas de golpe. Es tu pieza: la ventana, las estrellas, el libro sobre el escritorio." },
      { texto: "En el sueño todo te parecía igual de real que ahora. Entonces… ¿cómo sabes que _ahora_ no estás soñando?" },
      { texto: "Alguien golpea la puerta." },
      { quien: "valentina", texto: "¿Estás despierto? Perdón, ¿despierta? Bueno… ¿estás en vigilia? Soy Valentina, técnica del observatorio. Te escuché dar vueltas." },
      { quien: "valentina", texto: "Voy a calibrar el proyector del planetario. ¿Quieres verlo? Es lo más parecido a un sueño que tenemos acá.",
        acciones: [{ poner: "c0-golpe" }] }
    ],

    /* ----- Sueño ----- */
    "c0-sueno-inicio": [
      { texto: "Estás en la cúpula del telescopio. No recuerdas cómo llegaste, pero te parece de lo más normal." },
      { quien: "collao", texto: "¡Por fin! Soy la Dra. Collao. Te estaba esperando." },
      { texto: "Algo se siente raro. ¿Estarás soñando? Busca una señal que te lo asegure.",
        acciones: [{ poner: "c0-sueno-visto" }] }
    ],
    "c0-pellizco": [
      { texto: "Frente al espejo, decides hacer la prueba más conocida. Te pellizcas el brazo. ¡Auch! Duele de verdad." },
      { texto: "Pero… ¿nunca has soñado que algo te dolía, que corrías, que te caías? El dolor también se puede soñar.",
        acciones: [{ poner: "c0-p-pellizco" }] }
    ],
    "c0-reloj": [
      { texto: "Miras el reloj: 3:14. Vuelves a mirar: 3:14. Todo en orden… aunque el reloj esté flotando, cosa que te parece bastante normal." },
      { texto: "En los sueños lo absurdo parece normal. Y que algo esté en orden tampoco prueba nada.",
        acciones: [{ poner: "c0-p-reloj" }] }
    ],
    "c0-collao-sueno": [
      { quien: "tu", texto: "Dra. Collao… ¿esto es un sueño?" },
      { quien: "collao", texto: "¡Qué pregunta! Claro que no. Estás en la cúpula, conmigo, y ahí está el telescopio." },
      { texto: "Muy convincente. Pero es justo lo que diría alguien dentro de un sueño.",
        acciones: [{ poner: "c0-p-collao" }] }
    ],
    "c0-pizarra-sueno": [
      { texto: "La pizarra dice: «ESTO NO ES UN SUEÑO». Muy tranquilizador… si no fuera porque en un sueño puede estar escrita cualquier cosa." }
    ],
    "c0-despertando": [
      { texto: "Ninguna prueba te dio certeza: dentro del sueño, cada señal podía ser parte del sueño." },
      { texto: "La luz crece y te envuelve…" }
    ],

    /* ----- Planetario ----- */
    "c0-planetario-intro": [
      { texto: "Entras al planetario. Está completamente oscuro… y de pronto, el cielo entero se enciende sobre tu cabeza." },
      { quien: "valentina", texto: "Bonito, ¿no? Es una proyección. Cada estrella es un puntito de luz que sale de esas esferas." },
      { quien: "valentina", texto: "Con las luces apagadas, casi nadie distingue esta proyección del cielo real. Mi profe decía que un planetario es un «genio maligno» con buenas intenciones.",
        opciones: [
          { texto: "¿Un genio maligno?", ir: "genio" },
          { texto: "¿Eso es del libro que me dejaste?", ir: "genio" }
        ] },
      { id: "genio", quien: "valentina", texto: "Es de Descartes. Él imaginó un ser muy poderoso y engañador que pusiera en tu mente todo lo que ves, tocas y hasta lo que calculas. Como este planetario, pero para todo." },
      { texto: "Sientes un escalofrío. Junto a las butacas, a la izquierda, una figura luminosa empieza a formarse.",
        acciones: [{ poner: "c0-proyeccion" }] }
    ],
    "c0-cielo-proyectado": [
      { texto: "Miles de estrellas. Si no supieras que es una proyección, jurarías que es el cielo de verdad." }
    ],
    "c0-proyector": [
      { texto: "Dos esferas llenas de agujeritos, con una lámpara adentro. De aquí sale todo el «cielo»." }
    ],
    "c0-valentina": [
      { si: { noBandera: "c0-cogito" }, quien: "valentina", texto: "¿Con quién hablas? Yo no veo a nadie… Bueno, cada quien tiene su forma de pensar. Yo sigo calibrando.", ir: "fin" },
      { si: { noBandera: "c0-fin" }, quien: "valentina", texto: "¿Otra vez hablando con el aire? Este lugar le hace eso a la gente. A mí me pasó el año pasado.", ir: "fin" },
      { quien: "valentina", texto: "Mañana conoces a la Dra. Collao. De verdad, esta vez." }
    ],

    "c0-descartes-1": [
      { quien: "descartes", texto: "No te asustes. Soy solo un eco: lo que queda de una idea cuando mucha gente la ha pensado. En vida me llamé René Descartes." },
      { quien: "descartes", texto: "Esta noche tus sentidos te engañaron más de una vez: el agua del camino, la Luna gigante, la bombilla quebrada. Y en tu sueño todo te parecía tan real como ahora." },
      { quien: "descartes", texto: "Yo quise encontrar un conocimiento absolutamente seguro. Para eso me propuse un método: tratar como falso todo aquello en que pudiera imaginar la menor duda, y ver si quedaba algo en pie.",
        opciones: [
          { texto: "¿Entonces usted pensaba que no podemos saber nada?", ir: "metodo" },
          { texto: "Probemos.", ir: "probar" }
        ] },
      { id: "metodo", quien: "descartes", texto: "¡Todo lo contrario! No dudo para quedarme en la duda, como los escépticos. Dudo para encontrar un fundamento firme. Mi duda es un **método**, no una conclusión." },
      { id: "probar", quien: "descartes", texto: "Hagamos la prueba con tus propias creencias. Vamos a pasarlas por tres coladores, cada uno más fino que el anterior." }
    ],
    "c0-descartes-2": [
      { quien: "descartes", texto: "Lo encontraste: **pienso, existo**. Aunque un genio me engañe en todo, no puede hacer que yo no exista mientras pienso. Esa es la primera certeza." },
      { quien: "descartes", texto: "A partir de ahí intenté reconstruir el conocimiento con la **razón**, usando ideas claras y distintas, como las de la matemática. Por confiar sobre todo en la razón, a quienes pensamos así nos llaman **racionalistas**." },
      { quien: "descartes", texto: "Pero mira quién llega: alguien que nació sesenta años después de mi muerte y que no está nada de acuerdo conmigo." }
    ],
    "c0-descartes-despues": [
      { quien: "descartes", texto: "Recuerda: dudar es un método. Y al final de la duda, hay una certeza." }
    ],

    "c0-hume-1": [
      { quien: "hume", texto: "Buenas noches. David Hume, de Edimburgo. Un escocés con más apetito que certezas." },
      { quien: "hume", texto: "Monsieur Descartes busca la certeza en la razón. Yo prefiero una pregunta más modesta: ¿de dónde vienen nuestras ideas?" },
      { quien: "hume", texto: "Llamo **impresiones** a las percepciones vivas: lo que ves, oyes, tocas o sientes ahora mismo. Y llamo **ideas** a sus copias más débiles: lo que recuerdas o imaginas." },
      { quien: "hume", texto: "Compara el frío del viento del camino cuando lo sentiste, con ese mismo frío cuando lo recuerdas ahora. El recuerdo es más pálido, ¿verdad?" },
      { quien: "hume", texto: "Mi tesis: toda idea simple es copia de una impresión anterior. La imaginación puede combinar, recortar y mezclar ideas, pero no puede inventar una idea simple de la nada. Pongámosla a prueba." }
    ],
    "c0-hume-2": [
      { quien: "hume", texto: "Fíjate en la idea cuya impresión no encontraste: la fuerza que «obliga» a una bola a mover a otra. La guardaremos para otra noche: me da la impresión, valga la palabra, de que traerá problemas." },
      { quien: "hume", texto: "Ahora, otra herramienta. Todo lo que podemos conocer cae en uno de dos grupos. Algunos le dicen «la horquilla de Hume»; a mí me suena a cubierto de mesa, pero me gusta." }
    ],
    "c0-hume-retomar": [
      { quien: "hume", texto: "¿Seguimos con la horquilla? Recuerda la prueba: intenta negar cada afirmación." }
    ],
    "c0-hume-3": [
      { quien: "hume", texto: "Las relaciones de ideas se conocen con la sola razón, pero no nos dicen cómo es el mundo. Todo lo que sabemos sobre **cuestiones de hecho** viene, en último término, de la experiencia. Por eso me llaman **empirista**." },
      { quien: "descartes", texto: "Y yo sigo pensando que la razón puede llegar mucho más lejos, mi estimado." },
      { quien: "hume", texto: "Lo sé. Y yo sigo pensando que su duda universal, si alguien la practicara de verdad, no tendría cura: ni siquiera la razón podría sacarnos de ella, porque también estaría en duda. Prefiero una duda más moderada." },
      { quien: "hume", texto: "Te dejo una pregunta, {nombre}. La experiencia siempre es de casos **particulares**: esta Luna, este charco, esta noche. Pero la ciencia habla de leyes **generales**: todas las lunas, todas las estrellas, todas las noches. ¿Cómo se pasa de unos a otras?" },
      { quien: "hume", texto: "Mañana, en la cúpula, la Dra. Collao te pondrá frente a esa pregunta. Antes de dormir, escribe lo que piensas." }
    ],
    "c0-hume-reflexion": [
      { quien: "hume", texto: "¿Escribimos tus reflexiones? Tómate tu tiempo: yo tengo toda la eternidad." }
    ],
    "c0-hume-fin": [
      { quien: "hume", texto: "Buenas noches. Y recuerda: de lo que pasará mañana solo la experiencia puede hablarte… si es que puede." }
    ]
  },

  puzles: {
    "c0-criba": {
      tipo: "criba",
      titulo: "La criba de la duda",
      intro: "Descartes te pide que pongas a prueba tus creencias. Vas a aplicar **tres niveles de duda**, uno tras otro. En cada nivel, decide qué creencias **resisten** ese argumento y cuáles **caen** (es decir, pueden ponerse en duda con él). Lo que cae queda fuera para siempre.",
      niveles: [
        { titulo: "Los sentidos engañan",
          argumento: "Esta noche tus sentidos te engañaron: el charco que no era agua, la Luna que parecía más grande, la bombilla que parecía quebrada. Es prudente no fiarse del todo de quien nos ha engañado alguna vez.\n\nPero ojo: esos engaños ocurrieron con cosas **lejanas o en condiciones especiales**. ¿Alcanza este argumento para dudar de _todo_?" },
        { titulo: "El argumento del sueño",
          argumento: "Esta noche soñaste que estabas en la cúpula, y todo te pareció real: el dolor del pellizco, el reloj, la voz de la Dra. Collao. No hay ninguna señal completamente segura para distinguir la vigilia del sueño.\n\nEntonces, cualquier cosa que percibes _ahora_ podría ser un sueño. ¿Qué creencias resisten, incluso si estuvieras soñando?" },
        { titulo: "El genio maligno",
          argumento: "Imagina, como en el planetario, un ser muy poderoso y engañador que pone en tu mente todo lo que crees, y que incluso te hace equivocarte cada vez que sumas o cuentas los lados de una figura.\n\n¿Queda algo que ni siquiera él pueda hacer falso?" }
      ],
      creencias: [
        { id: "charco", texto: "Eso que brilla a lo lejos en el camino es agua.", caeEn: 0,
          retro: ["Es justo el tipo de percepción lejana que ya te engañó."] },
        { id: "luna", texto: "La Luna junto a los cerros es más grande que la Luna en lo alto del cielo.", caeEn: 0,
          retro: ["Un caso típico de engaño de los sentidos."] },
        { id: "aqui", texto: "Estoy aquí, en el planetario, mirando estas estrellas.", caeEn: 1,
          retro: [
            "Descartes admite que sería extravagante dudar de lo que percibo de cerca y en buenas condiciones solo porque los sentidos engañan a veces. Hace falta un argumento más fuerte.",
            "Podrías estar soñando que estás en el planetario, igual que soñaste que estabas en la cúpula."
          ],
          pistaError: [
            "Los engaños de esta noche fueron con cosas lejanas o en condiciones raras. ¿Basta eso para dudar de lo que tienes justo enfrente, en buenas condiciones? Descartes piensa que no: para eso necesitará un argumento más fuerte.",
            "Piensa en tu sueño: ¿no te parecía igual de real estar en la cúpula?"
          ] },
        { id: "manos", texto: "Tengo un cuerpo: estas son mis manos.", caeEn: 1,
          retro: [
            "Tus manos están aquí, a la vista, en buenas condiciones. Los engaños ocasionales de los sentidos no bastan para dudar de esto.",
            "En tu sueño también «tenías» manos, y te pellizcaste. Soñar con un cuerpo no garantiza tenerlo tal como lo percibes."
          ],
          pistaError: [
            "¿Tus manos están lejos o en malas condiciones, como el charco o la Luna? Este primer argumento es más limitado de lo que parece.",
            "En el sueño te pellizcaste y te dolió. ¿Esas manos eran reales?"
          ] },
        { id: "suma", texto: "2 + 3 = 5.", caeEn: 2,
          retro: [
            "No es algo que percibas con los sentidos: un engaño de la vista no la afecta.",
            "Dormido o despierto, 2 + 3 siguen siendo 5. El sueño afecta lo que percibo, no las verdades matemáticas.",
            "Si un genio maligno pudiera hacerte errar cada vez que sumas, ni siquiera esto sería seguro."
          ],
          pistaError: [
            "¿Esta creencia depende de lo que ves? Los engaños de los sentidos no la tocan.",
            "En tu sueño, ¿2 + 3 dejaba de ser 5?",
            "Este nivel es el más radical: el genio puede engañarte incluso cuando razonas o calculas."
          ] },
        { id: "cuadrado", texto: "Un cuadrado tiene cuatro lados.", caeEn: 2,
          retro: [
            "No depende de percibir nada lejano ni en malas condiciones.",
            "Ya sea que sueñes o no, un cuadrado no tiene más de cuatro lados. (Es un ejemplo del propio Descartes.)",
            "El genio maligno podría engañarte incluso en esto, cada vez que cuentas los lados."
          ],
          pistaError: [
            "¿Esta creencia depende de lo que ves a lo lejos?",
            "¿Un cuadrado soñado tendría otro número de lados?",
            "Este nivel es el más radical: el genio puede engañarte incluso cuando razonas."
          ] },
        { id: "existo", texto: "Yo, que ahora estoy dudando, existo.", caeEn: null,
          retro: [
            "Dudar no depende de los sentidos.",
            "Incluso si sueño, soy yo quien sueña.",
            "Si el genio me engaña, tengo que existir para ser engañado. Mientras pienso, existo."
          ],
          pistaError: [
            "¿Puede alguien dudar sin existir? Para dudar, tiene que haber alguien que duda.",
            "¿Quién estaría soñando, si no existieras?",
            "Para que el genio te engañe, ¿no tiene que haber alguien a quien engañar?"
          ] }
      ],
      etiquetas: {
        nivel: "Nivel",
        pregunta: "¿Qué pasa con cada creencia ante este argumento?",
        resiste: "Resiste",
        cae: "Cae (se puede dudar)",
        resistio: "Resiste.",
        cayo: "Cae.",
        errorDebiaCaer: "Este argumento sí permite ponerla en duda. Vuelve a leerlo.",
        errorDebiaResistir: "Este argumento no alcanza para ponerla en duda. Vuelve a leerlo.",
        siguienteNivel: "Aplicar la siguiente duda",
        verQueQueda: "Ver qué queda en pie",
        queda: "Lo que resiste a toda duda:",
        yaCayeron: "Creencias que ya cayeron",
        cayoCon: "cayó con:"
      },
      textoFinal: "Descartes llega al mismo lugar: **pienso, existo**. En las _Meditaciones_ lo dice así: la afirmación «yo soy, yo existo» es necesariamente verdadera cada vez que la pienso. La fórmula más famosa, «pienso, luego existo», aparece en el _Discurso del método_ (1637).",
      pregunta: {
        texto: "¿Por qué esa creencia resiste incluso al genio maligno?",
        opciones: [
          { texto: "Porque la percibo con los sentidos de forma muy clara.", correcta: false,
            retro: "Los sentidos cayeron en el primer nivel. Esta certeza no viene de ellos." },
          { texto: "Porque es una verdad matemática, y la matemática no se puede dudar.", correcta: false,
            retro: "Justo en el tercer nivel la matemática cayó. Esta certeza es de otro tipo." },
          { texto: "Porque para dudar, soñar o ser engañado tengo que estar pensando, y para pensar tengo que existir.", correcta: true,
            retro: "Exacto. El genio podría engañarte en todo lo que piensas, pero no en que estás pensando. Dudar de que piensas ya sería pensar." },
          { texto: "Porque Descartes estaba muy seguro de sí mismo.", correcta: false,
            retro: "No se trata de un sentimiento de seguridad, sino de algo que no se puede negar sin contradecirse al negarlo." }
        ]
      },
      pistas: [
        "Lee cada argumento con cuidado: cada uno tiene un alcance distinto. El primero es el más débil y el último, el más fuerte.",
        "Nivel 1: solo caen los engaños sobre cosas lejanas o en condiciones especiales. Nivel 2: cae lo que depende de percibir el mundo y el propio cuerpo. Nivel 3: cae incluso la matemática.",
        "Hay una sola creencia que resiste los tres niveles: la que trata sobre quien está dudando."
      ]
    },

    "c0-ideas": {
      tipo: "clasificar",
      titulo: "Rastrear ideas",
      intro: "Hume te propone un juego de detective: para cada idea, busca de qué **impresiones** proviene. Si una idea no puede rastrearse hasta ninguna impresión, Hume sospecha de ella.",
      categorias: [
        { id: "simple", nombre: "Copia de una impresión", descripcion: "la idea reproduce algo que sentiste o percibiste directamente." },
        { id: "compuesta", nombre: "Combinación de impresiones", descripcion: "la imaginación juntó ideas que sí vienen de impresiones." },
        { id: "imposible", nombre: "Sin la impresión no se puede formar", descripcion: "si nunca tuviste la impresión, no puedes tener la idea." },
        { id: "sospechosa", nombre: "No encuentro su impresión", descripcion: "buscas la impresión de origen y no aparece." }
      ],
      retroMalGenerica: "Vuelve a preguntarte: ¿de qué impresiones viene esta idea?",
      items: [
        { texto: "El frío del viento en el camino, cuando lo recuerdas ahora.", correcta: "simple",
          retro: "Es la copia más pálida de una impresión que tuviste: sentir el viento.",
          retroMal: { compuesta: "No hay nada combinado: es el recuerdo de una sola sensación.", imposible: "Sí tuviste la impresión: sentiste ese viento hace un rato.", sospechosa: "La impresión está a la vista: la sentiste en el camino." } },
        { texto: "Una montaña de oro.", correcta: "compuesta",
          retro: "Nunca viste una, pero has visto montañas y has visto oro. La imaginación los juntó. (Es un ejemplo del propio Hume.)",
          retroMal: { simple: "¿Has visto alguna vez una montaña de oro? Si no, no puede ser copia directa de una impresión.", imposible: "Puedes imaginarla perfectamente, así que sí puedes formar la idea. ¿Con qué piezas?", sospechosa: "Busca sus partes: ¿has visto montañas? ¿Has visto oro?" } },
        { texto: "Una vicuña con alas de cóndor.", correcta: "compuesta",
          retro: "Vicuñas y alas de cóndor vienen de impresiones; la imaginación hizo el montaje.",
          retroMal: { simple: "Nadie ha visto una vicuña alada. ¿De qué partes está hecha la idea?", imposible: "Puedes imaginarla sin problemas. ¿Con qué piezas la armaste?", sospechosa: "Sus partes sí vienen de impresiones: vicuñas y cóndores." } },
        { texto: "El sabor del copao (el fruto de un cactus del norte), para alguien que nunca lo ha probado.", correcta: "imposible",
          retro: "Hume da un ejemplo parecido: no podemos tener una idea justa del sabor de la piña sin haberla probado. Sin la impresión, no hay idea.",
          retroMal: { simple: "Esa persona nunca lo probó: ¿de qué impresión sería copia?", compuesta: "Podrías armar una descripción («ácido, jugoso…»), pero esa no es la idea del sabor mismo. ¿Se puede tener sin probarlo?", sospechosa: "La impresión existe (el sabor del copao), solo que esta persona no la ha tenido. Es otra categoría." } },
        { texto: "La fuerza invisible que «obliga» a una bola de billar a mover a otra cuando chocan.", correcta: "sospechosa",
          retro: "Ves una bola moverse, el choque y la otra bola moverse. Pero ¿ves la «fuerza que obliga»? Hume dirá que no hay impresión de esa conexión necesaria. Guarda esta pregunta: volverá en el Capítulo 2.",
          retroMal: { simple: "¿Qué ves exactamente cuando chocan? Movimiento, contacto, más movimiento. ¿Dónde está la impresión de la «obligación»?", compuesta: "¿De qué impresiones estaría hecha? Busca la de la «obligación»… ¿aparece?", imposible: "No es que te falte probar algo: es que, por más que mires choques, esa impresión no aparece." } },
        { texto: "El rojo de las luces traseras de la camioneta de Don Ramiro.", correcta: "simple",
          retro: "Lo viste: la idea es copia de esa impresión de color.",
          retroMal: { compuesta: "Un color es una idea simple: no está hecha de partes.", imposible: "Sí tuviste la impresión: viste esas luces.", sospechosa: "La impresión está clarísima: la viste." } }
      ],
      cierre: "**Principio de copia:** toda idea simple proviene de una impresión simple que la precede. Para Hume esto funciona como detector: si alguien usa una palabra y no podemos encontrar la impresión de la que proviene su idea, hay que sospechar que la palabra no significa lo que creemos.",
      pistas: [
        "Pregúntate por cada idea: ¿la sentí o la percibí así, directamente, alguna vez?",
        "Si es algo que nunca viste pero está hecho de partes que sí viste, es una combinación.",
        "El sabor que nunca se probó no se puede formar; la «fuerza que obliga» es la idea cuya impresión no aparece."
      ]
    },

    "c0-horquilla": {
      tipo: "clasificar",
      titulo: "La horquilla de Hume",
      intro: "Hume divide todo lo que podemos conocer en dos grupos. Una prueba útil: **intenta negar la afirmación**. Si la negación es contradictoria (no se puede pensar sin contradecirse), es una relación de ideas. Si la negación se puede pensar sin contradicción, aunque sea falsa, es una cuestión de hecho.",
      categorias: [
        { id: "ri", nombre: "Relación de ideas", descripcion: "se sabe con la sola razón; negarla es contradictorio (matemática, lógica, definiciones)." },
        { id: "ch", nombre: "Cuestión de hecho", descripcion: "solo la experiencia puede decirnos si es verdadera; negarla no es contradictorio." }
      ],
      items: [
        { texto: "Un cuadrado tiene cuatro lados.", correcta: "ri",
          retro: "Un cuadrado de tres lados no sería un cuadrado: la negación es contradictoria.",
          retroMal: { ch: "¿Necesitas salir a medir cuadrados para saberlo? Intenta pensar un cuadrado de cinco lados." } },
        { texto: "El Sol saldrá mañana.", correcta: "ch",
          retro: "«El Sol no saldrá mañana» es muy probablemente falso, pero se puede pensar sin contradicción. Es un ejemplo del propio Hume.",
          retroMal: { ri: "Parece segurísimo, pero intenta negarlo: «mañana no sale el Sol». ¿Es contradictorio o solo muy improbable?" } },
        { texto: "2 + 3 = 5.", correcta: "ri",
          retro: "Basta entender los números y la suma. Negarlo es contradictorio.",
          retroMal: { ch: "¿Hay que observar el mundo para saberlo, o basta con entender los números?" } },
        { texto: "El agua del salar es salada.", correcta: "ch",
          retro: "Hay que probarla (o medirla). Un salar de agua dulce sería raro, no contradictorio.",
          retroMal: { ri: "¿Es contradictorio imaginar un salar de agua dulce? Raro, sí; contradictorio, no." } },
        { texto: "Ninguna persona soltera está casada.", correcta: "ri",
          retro: "Basta entender las palabras: «soltera» significa «no casada».",
          retroMal: { ch: "¿Harías una encuesta para comprobarlo? Fíjate en el significado de «soltera»." } },
        { texto: "El fuego quema.", correcta: "ch",
          retro: "Lo sabemos por experiencia. Un fuego que no quema sería sorprendente, pero es pensable.",
          retroMal: { ri: "¿Cómo lo sabes: por el significado de la palabra «fuego» o porque lo has experimentado?" } },
        { texto: "Las siete estrellas del Campo del Salar tienen brillo constante.", correcta: "ch",
          retro: "Solo mirando el cielo, muchas veces, podríamos apoyar esta afirmación. Guárdala: mañana la vas a necesitar.",
          retroMal: { ri: "¿Puedes saberlo sin mirar el cielo? Imagina que una de esas estrellas cambia: ¿es contradictorio?" } }
      ],
      cierre: "**La horquilla de Hume:** las relaciones de ideas son seguras, pero no informan sobre el mundo. Las cuestiones de hecho sí informan sobre el mundo, pero solo la experiencia las respalda. Descartes buscaba certezas firmes; Hume insiste en que casi todo lo que nos importa en la vida y en la ciencia es del segundo tipo.",
      pistas: [
        "Para cada afirmación, intenta decir lo contrario. ¿Suena imposible o solo falso?",
        "Matemática y definiciones: relaciones de ideas. Lo que hay que observar o medir: cuestiones de hecho.",
        "Ojo con «El Sol saldrá mañana»: aunque sea casi seguro, su negación no es contradictoria."
      ]
    }
  }
};
