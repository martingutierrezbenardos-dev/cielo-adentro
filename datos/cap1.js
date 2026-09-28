/* =========================================================
   CAPÍTULO 1 — LA INDUCCIÓN
   ---------------------------------------------------------
   Cómo leer este archivo (ver README para más detalle):
   - escenas: cada escena tiene "hotspots" (zonas clicables).
     "zona": [x, y, ancho, alto] en % del escenario.
     "si": condición para que la zona aparezca.
     "acciones": lo que ocurre al pulsarla, en orden.
   - dialogos: listas de líneas {quien, texto, opciones}.
     En los textos: **negrita**, _cursiva_, {nombre} = nombre del estudiante,
     {registros} = observaciones registradas, {faltan} = observaciones que faltan.
   - puzles: textos, opciones, retroalimentación y pistas (3 niveles).
   Todas las banderas de este capítulo empiezan con "c1-".
   ========================================================= */
DATOS.capitulos.cap1 = {
  id: "cap1",
  numero: 1,
  titulo: "La inducción",
  prefijo: "c1-",
  escenaInicial: "c1-exterior",
  observacionesNecesarias: 6,

  // Lo que aparece en la barra superior. Se muestra el PRIMERO cuya condición se cumple.
  objetivos: [
    { si: { bandera: "c1-fin" }, texto: "Capítulo completado. Habla con la Dra. Collao para continuar." },
    { si: { bandera: "c1-conclusion" }, texto: "Habla con la Dra. Collao para escribir tus reflexiones." },
    { si: { bandera: "c1-refutada" }, texto: "Habla con la Dra. Collao sobre lo que significa S-12." },
    { si: { bandera: "c1-nova" }, texto: "Confirma lo que viste con el telescopio de la cúpula." },
    { si: { bandera: "c1-gallina" }, texto: "Sal del patio y vuelve a la explanada: está anocheciendo." },
    { si: { bandera: "c1-ley" }, texto: "Ve a celebrar a la casa de Don Ramiro." },
    { si: { registrosMin: 6 }, texto: "Escribe una ley en la pizarra de la cúpula." },
    { si: { bandera: "c1-intro" }, texto: "Registra observaciones del Campo del Salar ({registros}/6): cúpula, archivo y Don Ramiro." },
    { texto: "Entra a la cúpula y busca a la Dra. Collao." }
  ],

  // La ley que aparece en el registro del cuaderno.
  leyFormulada: {
    si: { bandera: "c1-ley" },
    refutadaSi: { bandera: "c1-refutada" },
    titulo: "Ley formulada",
    texto: "Todas las estrellas del Campo del Salar tienen brillo constante.",
    refutadaEtiqueta: "Refutada por S-12"
  },

  // Observaciones que se anotan en el cuaderno. "contradice: true" = contraejemplo.
  observaciones: {
    "obs-placa-1961": {
      fuente: "Placas fotográficas de vidrio",
      fecha: "1958–1961",
      texto: "Las siete estrellas del Campo del Salar tienen el mismo tamaño en todas las placas. Ninguna variación de brillo medible."
    },
    "obs-bitacora-1978": {
      fuente: "Bitácora del observador nocturno",
      fecha: "1978",
      texto: "82 noches de observación. Anotación repetida: «Campo del Salar sin novedad. Brillos constantes»."
    },
    "obs-catalogo": {
      fuente: "Catálogo digital del observatorio",
      fecha: "1995–2020",
      texto: "25 años de mediciones automáticas, más de 9.000 registros. Brillo constante dentro del margen de error."
    },
    "obs-collao": {
      fuente: "Cuaderno de la Dra. Collao",
      fecha: "2023",
      texto: "Medición con el fotómetro nuevo: las siete estrellas, estables."
    },
    "obs-fotometro": {
      fuente: "Fotómetro de la cúpula",
      fecha: "Esta semana",
      texto: "Seis noches seguidas de medición: brillo constante en las siete estrellas."
    },
    "obs-telescopio": {
      fuente: "Tu propia observación con el telescopio",
      fecha: "Esta noche, 21:10",
      texto: "Las siete estrellas se ven como en las placas antiguas."
    },
    "obs-ramiro": {
      fuente: "Testimonio de Don Ramiro",
      fecha: "1985 a hoy",
      texto: "«Cuarenta años mirando ese rincón del cielo desde mi puerta. Nunca le vi cambio a ninguna.»"
    },
    "obs-s12": {
      fuente: "Fotómetro y telescopio",
      fecha: "Esta noche, 23:47",
      texto: "La estrella S-12 del Campo del Salar aumentó su brillo miles de veces en pocas horas. Confirmado con dos instrumentos.",
      contradice: true
    }
  },

  cierre: "**Lo que descubriste:** ninguna cantidad finita de casos confirmatorios garantiza lógicamente la verdad de una generalización universal. Aun así, generalizar vale la pena: nos permite predecir, siempre que tratemos nuestras leyes como revisables.\n\n**Pregunta para el próximo capítulo:** si el pasado no garantiza el futuro, ¿por qué confiamos en que el futuro se parecerá al pasado?",

  /* ---------------------------------------------------------
     ESCENAS
     --------------------------------------------------------- */
  escenas: {
    "c1-exterior": {
      nombre: "Explanada del observatorio",
      fondo: "c1-exterior",
      alEntrar: [
        { si: { noBandera: "c1-llegada" }, entonces: [{ dialogo: "c1-llegada" }] },
        { si: { bandera: "c1-noche", noBandera: "c1-nova" }, entonces: [{ dialogo: "c1-nova-aparece" }] }
      ],
      hotspots: [
        { id: "puerta", etiqueta: "Entrar a la cúpula", zona: [37, 69, 7.5, 16], salida: true,
          acciones: [{ ir: "c1-cupula" }] },
        { id: "casa", etiqueta: "Casa de Don Ramiro", zona: [71, 63, 27, 24],
          si: { noBandera: "c1-ley" },
          acciones: [{ dialogo: "c1-ramiro-1" }] },
        { id: "casa", etiqueta: "Casa de Don Ramiro", zona: [71, 63, 27, 24],
          si: { bandera: "c1-ley", noBandera: "c1-gallina" },
          acciones: [{ dialogo: "c1-ramiro-invita" }, { ir: "c1-gallinero" }] },
        { id: "casa", etiqueta: "Casa de Don Ramiro", zona: [71, 63, 27, 24],
          si: { bandera: "c1-gallina" },
          acciones: [{ dialogo: "c1-ramiro-despues" }] },
        { id: "cielo", etiqueta: "El Campo del Salar (cielo)", zona: [70, 9, 20, 26],
          si: { noBandera: "c1-nova" },
          acciones: [{ dialogo: "c1-cielo-1" }] },
        { id: "cielo", etiqueta: "El Campo del Salar (cielo)", zona: [70, 9, 20, 26],
          si: { bandera: "c1-nova" },
          acciones: [{ dialogo: "c1-cielo-nova" }] }
      ]
    },

    "c1-cupula": {
      nombre: "Cúpula del telescopio",
      fondo: "c1-cupula",
      alEntrar: [
        { si: { noBandera: "c1-intro" }, entonces: [{ dialogo: "c1-encargo" }] }
      ],
      hotspots: [
        { id: "telescopio", etiqueta: "Telescopio", zona: [45, 14, 12, 70],
          si: { noBandera: "c1-nova" },
          acciones: [{ dialogo: "c1-telescopio-1" }] },
        { id: "telescopio", etiqueta: "Telescopio", zona: [45, 14, 12, 70],
          si: { bandera: "c1-nova", noBandera: "c1-refutada" },
          acciones: [{ dialogo: "c1-telescopio-nova" }] },
        { id: "telescopio", etiqueta: "Telescopio", zona: [45, 14, 12, 70],
          si: { bandera: "c1-refutada" },
          acciones: [{ dialogo: "c1-telescopio-despues" }] },

        { id: "fotometro", etiqueta: "Pantalla del fotómetro", zona: [12.5, 47.5, 16.5, 19],
          si: { noBandera: "c1-nova" },
          acciones: [{ dialogo: "c1-fotometro-1" }] },
        { id: "fotometro", etiqueta: "Pantalla del fotómetro", zona: [12.5, 47.5, 16.5, 19],
          si: { bandera: "c1-nova" },
          acciones: [{ dialogo: "c1-fotometro-nova" }] },

        { id: "cuaderno-collao", etiqueta: "Cuaderno rojo de la Dra. Collao", zona: [29.5, 62, 7, 7.5],
          acciones: [{ dialogo: "c1-cuaderno-collao" }] },

        { id: "collao", etiqueta: "Dra. Inés Collao", zona: [61, 40, 11.5, 50],
          si: { noBandera: "c1-refutada" },
          acciones: [{ dialogo: "c1-collao" }] },
        { id: "collao", etiqueta: "Dra. Inés Collao", zona: [61, 40, 11.5, 50],
          si: { bandera: "c1-refutada", noBandera: "c1-balanza" },
          acciones: [
            { dialogo: "c1-collao-crisis" },
            { puzle: "c1-balanza" },
            { poner: "c1-balanza", desbloquear: { glosario: ["deduccion", "asimetria"] } },
            { dialogo: "c1-collao-tras-balanza" },
            { puzle: "c1-conclusion" },
            { poner: "c1-conclusion", desbloquear: { cuaderno: "generalizacion", glosario: "falibilismo" } },
            { dialogo: "c1-collao-cierre" },
            { evaluacion: "cap1" },
            { poner: "c1-fin" },
            { finCapitulo: true }
          ] },
        { id: "collao", etiqueta: "Dra. Inés Collao", zona: [61, 40, 11.5, 50],
          si: { bandera: "c1-balanza", noBandera: "c1-conclusion" },
          acciones: [
            { dialogo: "c1-collao-retomar" },
            { puzle: "c1-conclusion" },
            { poner: "c1-conclusion", desbloquear: { cuaderno: "generalizacion", glosario: "falibilismo" } },
            { dialogo: "c1-collao-cierre" },
            { evaluacion: "cap1" },
            { poner: "c1-fin" },
            { finCapitulo: true }
          ] },
        { id: "collao", etiqueta: "Dra. Inés Collao", zona: [61, 40, 11.5, 50],
          si: { bandera: "c1-conclusion", noBandera: "c1-fin" },
          acciones: [
            { dialogo: "c1-collao-reflexion" },
            { evaluacion: "cap1" },
            { poner: "c1-fin" },
            { finCapitulo: true }
          ] },
        { id: "collao", etiqueta: "Dra. Inés Collao", zona: [61, 40, 11.5, 50],
          si: { bandera: "c1-fin" },
          acciones: [{ dialogo: "c1-collao-fin" }, { finCapitulo: true }] },

        { id: "pizarra", etiqueta: "Pizarra de leyes", zona: [77, 21, 19.5, 31],
          si: { noBandera: "c1-ley", registrosMenos: 6 },
          acciones: [{ dialogo: "c1-pizarra-faltan" }] },
        { id: "pizarra", etiqueta: "Pizarra de leyes", zona: [77, 21, 19.5, 31],
          si: { noBandera: "c1-ley", registrosMin: 6 },
          acciones: [
            { dialogo: "c1-pizarra-pre" },
            { puzle: "c1-ley" },
            { poner: "c1-ley", desbloquear: { cuaderno: "induccion", glosario: ["ley-cientifica", "generalizacion-universal"] } },
            { dialogo: "c1-ley-celebra" }
          ] },
        { id: "pizarra", etiqueta: "Pizarra de leyes", zona: [77, 21, 19.5, 31],
          si: { bandera: "c1-ley" },
          acciones: [{ dialogo: "c1-pizarra-ver" }] },

        { id: "puerta-archivo", etiqueta: "Puerta del archivo", zona: [1, 39, 8.5, 47],
          si: { noBandera: "c1-archivo-abierto" },
          acciones: [{ dialogo: "c1-archivo-cerrado" }],
          usar: {
            "llave-archivo": [
              { poner: "c1-archivo-abierto", quitar: "llave-archivo" },
              { mensaje: "La llave gira con un chasquido. La puerta del archivo se abre." },
              { ir: "c1-archivo" }
            ]
          } },
        { id: "puerta-archivo", etiqueta: "Entrar al archivo", zona: [1, 39, 8.5, 47], salida: true,
          si: { bandera: "c1-archivo-abierto" },
          acciones: [{ ir: "c1-archivo" }] },

        { id: "salida", etiqueta: "Bajar a la explanada", zona: [88, 80, 12, 20], salida: true,
          acciones: [{ ir: "c1-exterior" }] }
      ]
    },

    "c1-archivo": {
      nombre: "Archivo de placas",
      fondo: "c1-archivo",
      hotspots: [
        { id: "archivador", etiqueta: "Archivador de placas fotográficas", zona: [7, 36, 19.5, 53],
          acciones: [{ dialogo: "c1-placas" }] },
        { id: "bitacora", etiqueta: "Bitácora de 1978", zona: [40, 64, 15, 9],
          acciones: [{ dialogo: "c1-bitacora" }] },
        { id: "computador", etiqueta: "Catálogo digital", zona: [69, 44.5, 15, 22],
          acciones: [{ dialogo: "c1-catalogo" }] },
        { id: "foto", etiqueta: "Fotografía antigua", zona: [71.5, 16, 10.5, 18],
          acciones: [{ dialogo: "c1-foto" }] },
        { id: "salida", etiqueta: "Volver a la cúpula", zona: [89, 36, 10, 52], salida: true,
          acciones: [{ ir: "c1-cupula" }] }
      ]
    },

    "c1-gallinero": {
      nombre: "Patio de Don Ramiro",
      fondo: "c1-gallinero",
      alEntrar: [
        { si: { noBandera: "c1-gallina" }, entonces: [{ dialogo: "c1-gallina-diario" }] }
      ],
      hotspots: [
        { id: "clotilde", etiqueta: "Clotilde", zona: [39, 62, 13, 27],
          acciones: [{ dialogo: "c1-clotilde" }] },
        { id: "ramiro", etiqueta: "Don Ramiro", zona: [61, 42, 11, 50],
          acciones: [{ dialogo: "c1-ramiro-patio" }] },
        { id: "olla", etiqueta: "Olla sobre el fogón", zona: [76.5, 79, 9.5, 14],
          acciones: [{ dialogo: "c1-olla" }] },
        { id: "salida", etiqueta: "Volver a la explanada", zona: [0, 50, 8, 40], salida: true,
          acciones: [{ poner: "c1-noche" }, { ir: "c1-exterior" }] }
      ]
    }
  },

  /* ---------------------------------------------------------
     DIÁLOGOS
     quien: collao, ramiro, gallina, tu (o sin "quien" = narración)
     --------------------------------------------------------- */
  dialogos: {
    "c1-llegada": [
      { texto: "Desierto de Atacama, casi 3.000 metros de altura. El aire es tan seco y el cielo tan oscuro que se ven miles de estrellas a simple vista." },
      { texto: "Hoy empieza de verdad tu práctica en el **Observatorio Alto Tamarugo**. Te dijeron que buscaras a la Dra. Inés Collao en la cúpula del telescopio." },
      { texto: "**Consejo:** pulsa las zonas de la escena para interactuar. Con la tecla **R** (o el botón «Resaltar zonas») verás todo lo que se puede explorar. Nada tiene tiempo límite.",
        acciones: [{ poner: "c1-llegada" }] }
    ],

    "c1-encargo": [
      { quien: "collao", texto: "¡Llegaste, {nombre}! Soy Inés Collao. …¿Por qué me miras así? Cualquiera diría que ya me habías visto en sueños." },
      { quien: "collao", texto: "En fin. Aquí me toca vigilar el **Campo del Salar**: siete estrellas que se levantan justo encima del salar." },
      { quien: "collao", texto: "Mañana enviamos un informe y queremos incluir una **ley** sobre esas estrellas: algo general, que sirva para predecir. Pero una ley no se inventa en el aire.",
        opciones: [
          { texto: "¿Y de dónde sale una ley?", ir: "donde" },
          { texto: "¿Qué tengo que hacer?", ir: "tarea" }
        ] },
      { id: "donde", quien: "collao", texto: "De las observaciones. Miras muchos casos, notas un patrón y das un salto: afirmas que el patrón vale para _todos_ los casos, también los que nadie ha visto. A ese salto se le llama **inducción**.",
        acciones: [{ desbloquear: { glosario: "induccion" } }] },
      { id: "tarea", quien: "collao", texto: "Reúne al menos **seis observaciones** del brillo de esas estrellas, de fuentes distintas: el telescopio, el fotómetro, mi cuaderno, el archivo antiguo… y Don Ramiro, el cuidador, que lleva décadas mirando ese cielo." },
      { quien: "collao", texto: "Toma, la llave del archivo. Para usarla, elígela en tu inventario (abajo) y después pulsa la puerta. Lo que registres queda en tu **cuaderno de campo** (tecla C).",
        acciones: [{ dar: "llave-archivo", poner: "c1-intro" }] },
      { quien: "collao", texto: "Cuando tengas suficientes observaciones, escribe la ley en la pizarra." }
    ],

    "c1-collao": [
      { si: { registrosMenos: 6 }, quien: "collao", texto: "Llevas {registros} observaciones; te faltan {faltan}. Mientras más variadas sean las fuentes, mejor.",
        opciones: [
          { texto: "¿Por qué importa que sean variadas?", ir: "variadas", unaVez: true },
          { texto: "¿Dónde puedo buscar?", ir: "donde" },
          { texto: "Sigo buscando.", ir: "fin" }
        ] },
      { si: { registrosMin: 6, noBandera: "c1-ley" }, quien: "collao", texto: "Seis observaciones o más, décadas de datos, instrumentos distintos, y todas de acuerdo. Ya puedes escribir la ley en la pizarra.", ir: "fin" },
      { si: { bandera: "c1-ley", noBandera: "c1-gallina" }, quien: "collao", texto: "Ley escrita. Don Ramiro preparó algo en su casa por el aniversario del observatorio. Anda, yo termino de calibrar.", ir: "fin" },
      { si: { bandera: "c1-gallina", noBandera: "c1-nova" }, quien: "collao", texto: "Ya está oscureciendo. Sal a mirar el cielo: es la mejor hora.", ir: "fin" },
      { si: { bandera: "c1-nova" }, quien: "collao", texto: "¿Viste el Campo del Salar? ¡Confírmalo en el telescopio! Bueno… sin apuro: la estrella no se va a ir a ninguna parte.", ir: "fin" },
      { id: "variadas", quien: "collao", texto: "Si todas las observaciones vinieran del mismo instrumento, un defecto del instrumento se repetiría en todas. Fuentes distintas nos protegen de ese tipo de error.", ir: "fin" },
      { id: "donde", quien: "collao", texto: "Aquí en la cúpula: el telescopio, la pantalla del fotómetro y mi cuaderno rojo. En el archivo: placas, bitácoras y el catálogo digital. Y afuera, Don Ramiro.", ir: "fin" }
    ],

    "c1-archivo-cerrado": [
      { si: { tiene: "llave-archivo" }, texto: "Está cerrada con llave. Tienes la llave del archivo: elígela en el inventario (abajo) y después pulsa esta puerta.", ir: "fin" },
      { texto: "Está cerrada con llave. La Dra. Collao debe tenerla." }
    ],

    "c1-telescopio-1": [
      { si: { noRegistrado: "obs-telescopio" }, texto: "Acercas el ojo al ocular. Ahí están las siete estrellas del Campo del Salar, tranquilas, igual que en las placas antiguas.",
        acciones: [{ registrar: "obs-telescopio" }], ir: "fin" },
      { texto: "Las siete estrellas siguen ahí, tranquilas. Ya anotaste esta observación." }
    ],
    "c1-fotometro-1": [
      { si: { noRegistrado: "obs-fotometro" }, texto: "La pantalla del fotómetro muestra seis noches seguidas de medición. Siete líneas perfectamente planas: ninguna estrella cambió su brillo.",
        acciones: [{ registrar: "obs-fotometro" }], ir: "fin" },
      { texto: "Siete líneas planas. Ya anotaste esta observación." }
    ],
    "c1-fotometro-nova": [
      { texto: "La línea de S-12 se dispara hacia arriba. No es un error de pantalla: el fotómetro registró la hora exacta, 23:47." }
    ],
    "c1-cuaderno-collao": [
      { si: { noRegistrado: "obs-collao" }, texto: "El cuaderno rojo de la Dra. Collao. Última medición de 2023: las siete estrellas, estables. Al margen, con letra apurada: «Aburrido. Excelente.»",
        acciones: [{ registrar: "obs-collao" }], ir: "fin" },
      { texto: "«Aburrido. Excelente.» Ya anotaste esta observación." }
    ],

    "c1-placas": [
      { si: { noRegistrado: "obs-placa-1961" }, texto: "Abres un cajón. Placas de vidrio de 1958 a 1961, con puntitos negros: cada punto es una estrella. Alguien midió el tamaño de cada punto con una regla milimétrica." },
      { si: { noRegistrado: "obs-placa-1961" }, texto: "Las siete estrellas del Campo del Salar tienen el mismo tamaño en todas las placas. Anotas la observación.",
        acciones: [{ registrar: "obs-placa-1961" }], ir: "fin" },
      { texto: "Placas de vidrio, puntitos negros, siempre del mismo tamaño. Ya anotaste esta observación." }
    ],
    "c1-bitacora": [
      { si: { noRegistrado: "obs-bitacora-1978" }, texto: "Una bitácora de 1978 escrita a mano. Ochenta y dos noches seguidas, la misma frase: «Campo del Salar sin novedad. Brillos constantes». Alguien dibujó al margen un gato durmiendo.",
        acciones: [{ registrar: "obs-bitacora-1978" }], ir: "fin" },
      { texto: "«Sin novedad. Brillos constantes.» Y el gato, que sigue durmiendo. Ya anotaste esta observación." }
    ],
    "c1-catalogo": [
      { si: { noRegistrado: "obs-catalogo" }, texto: "El catálogo digital: veinticinco años de mediciones automáticas, más de 9.000 registros. En el gráfico, siete líneas planas.",
        acciones: [{ registrar: "obs-catalogo" }], ir: "fin" },
      { texto: "Más de 9.000 registros, siete líneas planas. Ya anotaste esta observación." }
    ],
    "c1-foto": [
      { texto: "Una foto de 1957: el equipo fundador posa frente a la cúpula recién construida. Detrás, alguien escribió: «Para quienes vengan a mirar»." }
    ],

    "c1-pizarra-faltan": [
      { texto: "La pizarra espera una ley. Pero antes necesitas más observaciones: llevas {registros} de 6." }
    ],
    "c1-pizarra-pre": [
      { texto: "Tomas la tiza. Tienes décadas de datos a tu favor. ¿Qué vas a escribir?" }
    ],
    "c1-ley-celebra": [
      { quien: "collao", texto: "«Todas las estrellas del Campo del Salar tienen brillo constante.» Clara, general y útil: con ella podemos predecir cómo se verán esas estrellas mañana, o en diez años." },
      { quien: "collao", texto: "Esto merece celebrarse. Don Ramiro está preparando algo en su casa por el aniversario del observatorio. Anda, que yo termino de calibrar." }
    ],
    "c1-pizarra-ver": [
      { si: { noBandera: "c1-refutada" }, texto: "Tu ley sigue en la pizarra, con tu letra. Se ve muy segura de sí misma.", ir: "fin" },
      { texto: "La ley, tachada. Al lado, alguien dibujó un signo de interrogación enorme." }
    ],

    "c1-ramiro-1": [
      { quien: "ramiro", texto: "¡Buenas noches! ¿Cómo va ese primer día de práctica? Pase, pase, que afuera corre viento." },
      { quien: "ramiro", texto: "¿Las estrellas del Salar? Uf. Cuarenta años mirando ese rincón del cielo desde esta puerta, todas las noches antes de dormir. Nunca le vi cambio a ninguna.",
        acciones: [{ registrar: "obs-ramiro" }],
        opciones: [
          { texto: "¿Todas las noches, durante cuarenta años?", ir: "noches" },
          { texto: "Gracias, don Ramiro.", ir: "fin" }
        ] },
      { id: "noches", quien: "ramiro", texto: "Bueno, las noches despejadas, que acá son casi todas. Y con las gallinas es igual: todas las mañanas les llevo maíz a las siete, puntualito. Ya me esperan en la puerta." }
    ],
    "c1-ramiro-invita": [
      { quien: "ramiro", texto: "¡Llegó justo! Mañana es el aniversario del observatorio y habrá cazuela para todo el equipo. Pase al patio, le presento a las gallinas." }
    ],
    "c1-ramiro-despues": [
      { si: { bandera: "c1-nova" }, quien: "ramiro", texto: "¿Vio eso en el cielo? Cuarenta años mirando y nunca había visto algo así. Parece que mi testimonio quedó cojo, ¿no?", ir: "fin" },
      { quien: "ramiro", texto: "Vaya a mirar el cielo, que esta noche está limpiecito." }
    ],

    "c1-gallina-diario": [
      { texto: "En el patio, entre las gallinas, una destaca: gorda, colorada y con aire de profesora." },
      { quien: "ramiro", texto: "Ella es la Clotilde, la más lista del gallinero. Si supiera escribir, llevaría un diario." },
      { texto: "Las gallinas no escriben diarios, claro. Pero imaginemos que Clotilde sí. Diría algo así:" },
      { quien: "gallina", texto: "**Día 1.** Llegué a este patio. A las siete de la mañana apareció un humano con maíz. Interesante. Lo anoto." },
      { quien: "gallina", texto: "**Día 2.** Siete de la mañana: maíz. **Día 3:** maíz. No saco conclusiones apresuradas. Soy una gallina científica." },
      { quien: "gallina", texto: "**Día 60.** Sesenta mañanas, sesenta raciones. Con frío, con viento, con visitas. Formulo una ley: _«Todas las mañanas, el humano trae maíz»_." },
      { quien: "gallina", texto: "**Día 363.** Mi ley tiene 363 confirmaciones y ningún contraejemplo. Hoy escuché al humano decir «mañana», «aniversario» y «cazuela». No sé qué significa, pero mi confianza nunca había sido tan alta." },
      { texto: "Silencio en el patio." },
      { quien: "ramiro", texto: "(riéndose) Tranquila, Clotilde, que este año la cazuela es de puras verduras. Pero dígame usted, que estudia estas cosas: si hubiera sido cazuela de ave, ¿de qué le habrían servido a la Clotilde sus 363 mañanas?",
        opciones: [
          { texto: "De nada: la mañana 364 podía ser distinta de todas las anteriores.", ir: "r1" },
          { texto: "De mucho: con tantos casos, lo razonable era esperar el maíz.", ir: "r2" }
        ] },
      { id: "r1", quien: "ramiro", texto: "Eso mismo. Y fíjese que la Clotilde no era tonta: razonaba igualito que nosotros.", ir: "comun" },
      { id: "r2", quien: "ramiro", texto: "Puede ser: con lo que ella sabía, esperar el maíz era lo más sensato. Y aun así se iba a equivocar. Las dos cosas pueden ser ciertas a la vez.", ir: "comun" },
      { id: "comun", texto: "Esta escena es una versión de un ejemplo del filósofo **Bertrand Russell** (1912): un animal que, tras muchas experiencias repetidas, espera que el futuro sea igual al pasado… justo hasta el día en que no lo es.",
        acciones: [{ poner: "c1-gallina", desbloquear: { cuaderno: "gallina-russell" } }] },
      { texto: "Está anocheciendo. Cuando quieras, sal del patio hacia la explanada." }
    ],
    "c1-clotilde": [
      { texto: "Clotilde te mira de reojo. En su diario imaginario acaba de corregir su ley: «_Casi_ todas las mañanas, el humano trae maíz… hasta nuevo aviso»." }
    ],
    "c1-olla": [
      { texto: "Una olla enorme sobre el fogón. Huele a zapallo, choclo y porotos verdes. Clotilde puede dormir tranquila… esta vez." }
    ],
    "c1-ramiro-patio": [
      { quien: "ramiro", texto: "Ya va a oscurecer. Vaya a mirar el cielo, que esta noche está limpiecito." }
    ],

    "c1-nova-aparece": [
      { texto: "Ya es de noche. Cruzas la explanada y algo te detiene." },
      { texto: "En el Campo del Salar hay un punto de luz intenso, justo donde antes había una estrellita discreta.",
        acciones: [{ poner: "c1-nova" }] }
    ],
    "c1-cielo-1": [
      { texto: "El Campo del Salar: siete estrellas en un rincón del cielo, justo sobre el salar. La más débil se llama S-12. Esta noche todas se ven tranquilas." }
    ],
    "c1-cielo-nova": [
      { texto: "Una de las siete, S-12, brilla como ninguna. Es imposible no verla." },
      { texto: "¿Un error de tus ojos? Habrá que confirmarlo con instrumentos: el telescopio de la cúpula.",
        acciones: [{ poner: "c1-nova-vista" }] }
    ],

    "c1-telescopio-nova": [
      { texto: "Apuntas al Campo del Salar. No hay duda: S-12, que durante más de sesenta años fue un puntito discreto, ahora brilla miles de veces más." },
      { quien: "collao", texto: "El fotómetro dice lo mismo. No es una falla: es una **nova**, una estrella que aumenta su brillo de forma repentina." },
      { quien: "tu", texto: "Pero… nuestra ley decía que _todas_ tienen brillo constante." },
      { quien: "collao", texto: "Decía. Ven, hablemos.",
        acciones: [{ registrar: "obs-s12", poner: "c1-refutada", desbloquear: { cuaderno: "nova-1572", glosario: "contraejemplo" } }] }
    ],
    "c1-telescopio-despues": [
      { texto: "S-12 sigue brillando. Mañana astrónomos de todo el mundo van a apuntar sus telescopios hacia aquí." }
    ],

    "c1-collao-crisis": [
      { quien: "collao", texto: "Más de sesenta años de datos. Miles de mediciones. Fuentes muy distintas. Y basta una sola noche para que la ley sea falsa.",
        opciones: [
          { texto: "¿Hicimos algo mal?", ir: "mal" },
          { texto: "¿Y si hubiéramos tenido más datos?", ir: "mas" }
        ] },
      { id: "mal", quien: "collao", texto: "No necesariamente. Hicimos lo que hace la ciencia todo el tiempo: generalizar. Lo que hay que entender es qué tipo de apoyo nos daban esos datos. Hagamos un experimento mental.", ir: "balanza" },
      { id: "mas", quien: "collao", texto: "Buena pregunta. Hagamos un experimento mental." },
      { id: "balanza", quien: "collao", texto: "Imagina una balanza con dos lados: uno mide nuestra confianza en la ley; el otro, si la ley queda lógicamente demostrada. Vamos a cargarla con confirmaciones." }
    ],
    "c1-collao-tras-balanza": [
      { quien: "collao", texto: "¿Ves la asimetría? Las confirmaciones nunca terminaban de demostrar la ley, pero un solo contraejemplo la derribó." },
      { quien: "collao", texto: "Ahora decidamos qué hacer con la pizarra… y qué aprendimos." }
    ],
    "c1-collao-retomar": [
      { quien: "collao", texto: "Retomemos: ¿qué hacemos con la ley y qué aprendimos?" }
    ],
    "c1-collao-cierre": [
      { quien: "collao", texto: "Hoy viste algo que a mucha gente le cuesta aceptar: nuestras mejores leyes son generalizaciones que podrían fallar mañana. Y aun así, las necesitamos." },
      { quien: "collao", texto: "Antes de irte, escribe tus reflexiones. Me sirven más que cualquier informe." }
    ],
    "c1-collao-reflexion": [
      { quien: "collao", texto: "¿Terminamos tus reflexiones? Tómate el tiempo que necesites." }
    ],
    "c1-collao-fin": [
      { quien: "collao", texto: "Buen trabajo hoy. Mañana nos espera algo más raro todavía: preguntarnos _por qué_ confiamos en que el futuro se parecerá al pasado." }
    ]
  },

  /* ---------------------------------------------------------
     PUZLES
     --------------------------------------------------------- */
  puzles: {
    "c1-ley": {
      tipo: "eleccion",
      titulo: "Formular la ley",
      intro: "Tienes {registros} observaciones: décadas de registros, instrumentos distintos, personas distintas. Todas coinciden. La Dra. Collao quiere una **ley**: un enunciado general que sirva para predecir lo que todavía no hemos observado.",
      pasos: [
        {
          pregunta: "¿Qué escribes en la pizarra?",
          opciones: [
            { texto: "«Todas las estrellas del Campo del Salar que hemos observado hasta hoy tuvieron brillo constante.»", correcta: false,
              retro: "Es verdad, pero es solo un **resumen** de lo ya visto. No dice nada sobre mañana ni sobre casos no observados, así que no sirve para predecir. Una ley va más allá de los datos: eso es lo que ganamos al generalizar… y también lo que arriesgamos." },
            { texto: "«Algunas estrellas del Campo del Salar tienen brillo constante.»", correcta: false,
              retro: "Es seguro, pero dice muy poco: no permite predecir qué hará ninguna estrella en particular. Las leyes científicas suelen tener forma **universal**: «todos los…»." },
            { texto: "«Está demostrado que todas las estrellas del Campo del Salar tienen brillo constante.»", correcta: false,
              retro: "El contenido va bien encaminado, pero la palabra «demostrado» promete demasiado. ¿Tus observaciones _demuestran_ algo sobre casos que nadie ha observado todavía? Guarda esta duda: volverá." },
            { texto: "«Todas las estrellas del Campo del Salar tienen brillo constante.»", correcta: true,
              retro: "Es una **generalización universal** obtenida por **inducción**: pasas de muchos casos observados a una afirmación sobre _todos_ los casos, incluidos los futuros. Gracias a eso puedes predecir." }
          ]
        }
      ],
      pistas: [
        "Una ley tiene que decir algo sobre casos que aún no has observado, no solo sobre los que ya viste.",
        "Busca un enunciado de la forma «Todas las X son Y» que no exagere lo que realmente sabemos.",
        "Descarta el resumen del pasado, el «algunas» y el «está demostrado». Queda uno."
      ]
    },

    "c1-balanza": {
      tipo: "balanza",
      titulo: "La balanza de la certeza",
      intro: "La Dra. Collao dibuja una balanza en la pizarra: «Imagina que antes de esta noche hubiéramos seguido acumulando confirmaciones. Agrega casos y mira qué pasa con cada lado. Cuando quieras, agrega la observación de S-12».",
      ley: "Todas las estrellas del Campo del Salar tienen brillo constante.",
      minConfirmaciones: 5,
      etiquetas: {
        ley: "Ley:",
        casos: "Casos confirmatorios:",
        contraejemplos: "Contraejemplos:",
        confianza: "Nuestra confianza en la ley",
        confianzaAyuda: "Sube con cada caso, pero cada vez menos. Es una actitud razonable, no una prueba.",
        confianzaRefutada: "Un solo caso contrario bien comprobado basta para que la ley universal sea falsa.",
        garantia: "¿Queda lógicamente demostrada?",
        noDemostrada: "NO DEMOSTRADA",
        refutada: "REFUTADA",
        garantiaInicio: "Agrega casos y observa si esto cambia.",
        garantiaAyuda: "Con {n} casos, sigue sin estar demostrada: el caso siguiente aún podría ser distinto.",
        garantiaRefutada: "Si todas fueran constantes, S-12 no podría cambiar. S-12 cambió. Por lo tanto, no todas son constantes.",
        agregar1: "+1 confirmación",
        agregarMil: "+1.000 confirmaciones",
        contraejemplo: "Agregar la observación de S-12",
        faltanCasos: "Agrega al menos {n} confirmación(es) más antes de sumar el caso de S-12."
      },
      textoRefutada: "Fíjate en la **asimetría**: miles de casos a favor no bastaron para demostrar la ley, pero un solo caso en contra, si está bien comprobado, basta para refutarla.",
      pregunta: {
        texto: "¿Cuántas confirmaciones habrían hecho falta para DEMOSTRAR la ley antes de esta noche?",
        opciones: [
          { texto: "Unas 10.000: con eso desaparece cualquier duda razonable.", correcta: false,
            retro: "Con 10.000 casos la confianza puede ser altísima, pero el caso 10.001 todavía podría ser distinto. Confianza alta no es lo mismo que demostración." },
          { texto: "Haber observado todas las estrellas de la región hasta hoy.", correcta: false,
            retro: "¡Ya lo habíamos hecho! Observamos las siete. Pero la ley también habla del **futuro**, y ninguna observación hecha hasta hoy cubre lo que pasará mañana." },
          { texto: "Ninguna cantidad finita basta: la conclusión siempre va más allá de los casos observados.", correcta: true,
            retro: "Exacto. En una inferencia inductiva, todas las premisas pueden ser verdaderas y la conclusión, falsa. Las confirmaciones aumentan nuestra confianza, pero no garantizan lógicamente la ley." },
          { texto: "Un millón: a esa escala el error se vuelve imposible.", correcta: false,
            retro: "Aun con un millón de casos sigue siendo lógicamente posible que el siguiente sea distinto. Muchos casos hacen el error improbable (quizás), no imposible." }
        ]
      },
      pistas: [
        "Agrega confirmaciones y mira el recuadro de la derecha. ¿Cambia en algún momento?",
        "Compara lo que pasa con 1.000 casos a favor y con 1 caso en contra.",
        "La respuesta correcta no da un número: dice que la conclusión siempre va más allá de los casos observados."
      ]
    },

    "c1-conclusion": {
      tipo: "eleccion",
      titulo: "¿Y ahora qué hacemos con la ley?",
      intro: "La ley quedó refutada. La Dra. Collao te pide ayuda para decidir qué hacer con ella y qué aprendimos.",
      pasos: [
        {
          pregunta: "¿Qué hacemos con la ley de la pizarra?",
          opciones: [
            { texto: "Borrarla y declarar que sesenta años de observaciones no sirvieron de nada.", correcta: false,
              retro: "Las observaciones siguen siendo verdaderas: esas estrellas sí fueron constantes cuando se midieron. Lo que resultó falso fue la generalización universal, no los datos." },
            { texto: "Ignorar S-12: es un solo caso contra miles; seguramente es un error.", correcta: false,
              retro: "Es sensato revisar si es un error, y ya lo hiciste: dos instrumentos lo confirman. Una ley universal no se decide por mayoría de votos: un solo caso bien comprobado basta para refutarla." },
            { texto: "Reformularla: «Las estrellas del Campo del Salar suelen mantener un brillo constante durante décadas, aunque alguna puede cambiar bruscamente (como S-12). Es una hipótesis revisable».", correcta: true,
              retro: "Buena decisión: conservas lo que los datos apoyan, reconoces el contraejemplo y presentas la generalización como falible, abierta a revisión." },
            { texto: "Cambiar la definición: «Si una estrella cambia de brillo, entonces no era realmente del Campo del Salar».", correcta: false,
              retro: "Así la ley ya no podría fallar nunca… porque dejaría de decir algo sobre el mundo. Redefinir las palabras para salvar una ley es una trampa. (Volverás a esto en el Capítulo 3.)" }
          ]
        },
        {
          pregunta: "¿Qué aprendimos? Elige la conclusión más precisa.",
          opciones: [
            { texto: "Que necesitábamos más observaciones antes de formular la ley.", correcta: false,
              retro: "Más casos habrían aumentado nuestra confianza, pero no habrían evitado el problema: S-12 igual habría cambiado. El número de casos no era el problema de fondo." },
            { texto: "Que ninguna cantidad finita de casos confirmatorios garantiza lógicamente la verdad de una generalización universal.", correcta: true,
              retro: "Esta es la idea central del capítulo. Las generalizaciones inductivas van más allá de la evidencia; por eso pueden ser muy razonables y, aun así, falsas." },
            { texto: "Que la ciencia no sirve, porque todo lo que dice puede ser falso.", correcta: false,
              retro: "Que una afirmación _pueda_ ser falsa no la vuelve inútil. Gracias a la ley pudimos predecir y, cuando falló, lo notamos de inmediato. Eso es una virtud." },
            { texto: "Que la inducción siempre lleva a conclusiones falsas.", correcta: false,
              retro: "La inducción muchas veces acierta: seis de las siete estrellas sí siguieron constantes. El punto es que no _garantiza_ su conclusión, no que siempre se equivoque." }
          ]
        },
        {
          pregunta: "Entonces, ¿vale la pena seguir generalizando?",
          opciones: [
            { texto: "No. Si no hay garantía, lo honesto es no afirmar nada más allá de lo observado.", correcta: false,
              retro: "Sin generalizar no podríamos predecir nada: ni que el agua hervirá, ni que un puente resistirá. Renunciar a generalizar tiene un costo enorme." },
            { texto: "Sí: generalizar nos permite predecir y actuar. Lo que arriesgamos es equivocarnos, así que tratamos las leyes como revisables.", correcta: true,
              retro: "Esa es la apuesta: ganamos poder de predicción y aceptamos el riesgo de error. Queda una pregunta más profunda: _¿por qué_ confiamos en que el futuro se parecerá al pasado? La investigarás en el próximo capítulo." },
            { texto: "Sí, siempre que usemos al menos 1.000 casos: así la ley queda asegurada.", correcta: false,
              retro: "Ningún umbral de casos asegura una ley universal. Lo que sí podemos hacer es buscar casos variados y seguir poniéndola a prueba." }
          ]
        }
      ],
      cierre: "La Dra. Collao tacha la palabra «Todas» en la pizarra y escribe al lado, en letra chica: _«hasta nuevo aviso»_.",
      pistas: [
        "Distingue entre los datos (lo que se observó) y la generalización (lo que afirmamos sobre todos los casos).",
        "Una buena reformulación conserva lo que sabemos, reconoce el contraejemplo y no hace trampa cambiando el significado de las palabras.",
        "Paso 2: la respuesta menciona que ninguna cantidad finita de casos basta. Paso 3: generalizar sí vale la pena, pero de forma revisable."
      ]
    }
  }
};
