/* =========================================================
   CONFIGURACIÓN GENERAL
   Puedes editar este archivo con cualquier editor de texto.
   Cuida las comillas y las comas al final de cada línea.
   ========================================================= */
window.DATOS = window.DATOS || {};
DATOS.capitulos = DATOS.capitulos || {};

DATOS.config = {
  titulo: "Cielo Adentro",
  subtitulo: "Una aventura de filosofía de la ciencia en el desierto de Atacama",

  // Clave del modo docente. No es seguridad real: cualquiera que abra este archivo la puede ver.
  claveDocente: "profe2026",

  // Nombre con que se guarda la partida en el navegador. Si lo cambias, las partidas anteriores no se cargan.
  claveGuardado: "cielo-adentro-v1",

  // Orden de los capítulos. Un capítulo sin archivo de datos se omite.
  capitulos: ["cap0", "cap1", "cap2", "cap3", "cap4"],

  // Textos de la interfaz
  textos: {
    continuar: "Continuar",
    cerrar: "Cerrar",
    terminar: "Terminar",
    paso: "Paso",
    bien: "¡Bien!",
    noDelTodo: "No del todo.",
    correcto: "Correcto.",
    incorrecto: "No es la mejor respuesta.",
    intentaOtra: "Prueba con otra opción.",
    pista: "Pista",
    pedirPista: "Pista",
    objetivo: "Objetivo:",
    ejemplo: "Ejemplo:",

    inventario: "Inventario:",
    inventarioVacio: "(vacío)",
    usarObjeto: "Elegiste «{objeto}». Ahora pulsa la zona donde quieres usarlo (Esc para cancelar).",
    noSirveAqui: "No parece útil usar «{objeto}» aquí.",
    objetoRecibido: "Recibiste: {objeto}",

    observacionRegistrada: "Observación registrada en tu cuaderno ({registros}/{n}).",
    observacionRegistradaSimple: "Observación registrada en tu cuaderno.",
    observacionContraria: "Observación registrada: ¡contradice la ley!",
    cuadernoNuevo: "Nueva entrada en el cuaderno: {titulo}",
    glosarioNuevo: "Nuevo término en el glosario: {titulo}",

    cuadernoTitulo: "Cuaderno de campo",
    pestanaRegistro: "Registro de observaciones",
    pestanaEntradas: "Entradas",
    pestanaGlosario: "Glosario",
    observacionesContador: "Observaciones que apoyan la ley: {n} (se necesitan {total}).",
    registroVacio: "Todavía no registras observaciones.",
    entradasContador: "Entradas descubiertas: {n} de {total}.",
    cuadernoVacio: "Aún no hay entradas. Se desbloquean mientras juegas.",
    glosarioContador: "Términos descubiertos: {n} de {total}.",
    glosarioVacio: "Aún no hay términos. Se desbloquean mientras juegas.",
    buscar: "Buscar en el glosario…",
    sinResultados: "No hay términos que coincidan.",

    ajustes: "Ajustes",
    ajustesTitulo: "Ajustes",
    tamanoTexto: "Tamaño del texto",
    visual: "Visualización",
    altoContraste: "Alto contraste en paneles y textos",
    sinAnimaciones: "Reducir animaciones",
    guardadoActivo: "Tu progreso se guarda automáticamente en este navegador.",
    guardadoNoDisponible: "Aviso: este navegador no permite guardar. Puedes jugar igual, pero el progreso se perderá al cerrar la página.",

    ayuda: "Ayuda y teclas",
    ayudaTitulo: "Cómo jugar",
    ayudaIntro: "Explora cada escena pulsando sus zonas. No hay tiempo límite: los textos avanzan solo cuando tú decides. Si te atascas, mira el **Objetivo** en la barra superior o pide una **pista** dentro de cada puzle.",
    ayudaTeclas: [
      ["Tab / Mayús+Tab", "Moverse entre zonas y botones"],
      ["Enter o Espacio", "Activar la zona o botón seleccionado"],
      ["R", "Resaltar todas las zonas de la escena"],
      ["C", "Abrir o cerrar el cuaderno de campo"],
      ["G", "Abrir el glosario"],
      ["I", "Ir al inventario"],
      ["M", "Menú"],
      ["1, 2, 3…", "Elegir una opción en los diálogos"],
      ["Esc", "Cerrar ventanas o cancelar el uso de un objeto"],
      ["?", "Esta ayuda"]
    ],

    menuTitulo: "Menú",
    volverAlJuego: "Volver al juego",
    misRespuestas: "Mis respuestas",
    modoDocente: "Modo docente",
    volverInicio: "Pantalla de inicio",

    tuNombre: "Tu nombre",
    tuCurso: "Tu curso",
    cursoEjemplo: "Por ejemplo: 4° medio B",
    comenzar: "Comenzar",
    continuarPartida: "Continuar partida",
    nuevaPartida: "Nueva partida",
    faltanDatos: "Escribe tu nombre y tu curso para comenzar (aparecen en el archivo de respuestas).",
    confirmarNueva: "¿Empezar una partida nueva? Se borrará el progreso guardado en este navegador.",

    evaluacionTitulo: "Reflexión · Capítulo {n}: {titulo}",
    reflexion: "Preguntas de reflexión (respuesta escrita)",
    comprobacion: "Preguntas de comprobación",
    terminarCapitulo: "Terminar capítulo",
    evaluacionLista: "Todo listo. Puedes terminar el capítulo.",
    evaluacionFalta: "Para terminar: responde todas las preguntas abiertas y encuentra la respuesta correcta en las de comprobación.",

    capituloCompletado: "Capítulo {n} completado",
    siguienteCapitulo: "Siguiente capítulo",
    verFinal: "Ver resumen final",
    proximamente: "_Los siguientes capítulos estarán disponibles pronto._",

    finalTitulo: "Resumen final",
    finalTexto: "Aquí están tus respuestas. Descárgalas como archivo de texto para entregarlas a tu profesor o profesora.",
    respuestasDe: "Respuestas de reflexión",
    nombre: "Nombre",
    curso: "Curso",
    fecha: "Fecha",
    capitulosCompletados: "Capítulos completados",
    sinResponder: "sin responder",
    alPrimerIntento: "correcta al primer intento",
    conIntentos: "correcta después de {n} intentos",
    sinResolver: "sin resolver",
    resumenMultiple: "Comprobación: {n} de {total} correctas al primer intento.",
    sinRespuestasAun: "Todavía no hay respuestas. Aparecerán al final de cada capítulo.",
    descargarTxt: "Descargar mis respuestas (.txt)",

    docenteClave: "Clave del modo docente",
    docenteClaveMala: "Clave incorrecta.",
    entrar: "Entrar",
    docenteAviso: "**Modo docente.** Puedes saltar a cualquier capítulo y ver las soluciones. Saltar a un capítulo reinicia ese capítulo en esta partida.",
    docenteCapitulos: "Saltar a capítulo",
    docenteGuia: "Guía docente",
    docenteSoluciones: "Soluciones",
    docenteProgreso: "Progreso",
    docenteSaltarIntro: "Elige un capítulo para comenzarlo desde el principio. Los capítulos anteriores se marcan como completados.",
    docenteVerFinal: "Ver pantalla final",
    docenteDuracion: "Duración estimada",
    docenteObjetivos: "Objetivos de aprendizaje",
    docenteDiscusion: "Preguntas para la discusión en clase",
    docenteErrores: "Errores conceptuales frecuentes",
    docenteRecorrido: "Recorrido mínimo",
    docenteProgresoIntro: "Progreso de la partida abierta en este navegador.",
    docenteCompletado: "Completado",
    docentePistas: "Pistas usadas",
    clasificados: "Clasificados: {n} de {total}."
  }
};

/* Personajes: "retrato" indica qué dibujo usar en la caja de diálogo. */
DATOS.personajes = {
  tu: { nombre: "{nombre}", retrato: "tu" },
  collao: { nombre: "Dra. Inés Collao", retrato: "collao" },
  ramiro: { nombre: "Don Ramiro", retrato: "ramiro" },
  gallina: { nombre: "Clotilde (diario imaginario)", retrato: "gallina" },
  tomas: { nombre: "Tomás", retrato: "tomas" },
  valentina: { nombre: "Valentina", retrato: "valentina" },
  descartes: { nombre: "Eco de René Descartes", retrato: "descartes" },
  hume: { nombre: "Eco de David Hume", retrato: "hume" },
  popper: { nombre: "Eco de Karl Popper", retrato: "popper" },
  kuhn: { nombre: "Eco de Thomas Kuhn", retrato: "kuhn" }
};

/* Objetos del inventario */
DATOS.objetos = {
  "llave-archivo": { nombre: "Llave del archivo", descripcion: "Una llave antigua de bronce con una etiqueta: «Archivo de placas»." },
  "linterna-roja": { nombre: "Linterna roja", descripcion: "Luz roja: ilumina sin arruinar la visión nocturna." },
  "lupa": { nombre: "Lupa", descripcion: "Para mirar de cerca." },
  "tarjeta-acceso": { nombre: "Tarjeta de acceso", descripcion: "Abre la sala del radiotelescopio." },
  "tiza": { nombre: "Tiza", descripcion: "Para escribir en la pizarra." }
};
