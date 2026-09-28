/* =========================================================
   EVALUACIÓN DE FIN DE CAPÍTULO
   - abiertas: preguntas de reflexión (respuesta escrita).
   - multiple: preguntas de comprobación; cada opción tiene
     "retro" (retroalimentación que explica el porqué).
   El estudiante puede reintentar; se registra si acertó al primer intento.
   ========================================================= */
DATOS.evaluacion = {
  cap0: {
    intro: "Antes de dormir (de verdad, esta vez), escribe tus reflexiones sobre la noche. En las preguntas abiertas no hay una única respuesta correcta: lo importante es que justifiques.",
    abiertas: [
      { id: "a1", pregunta: "Descartes dice que es prudente no fiarse del todo de quien nos ha engañado alguna vez. ¿Estás de acuerdo? ¿Hasta dónde debería llegar la duda?" },
      { id: "a2", pregunta: "¿Cómo podrías saber que ahora mismo no estás soñando? ¿Te convence alguna señal? Justifica." },
      { id: "a3", pregunta: "¿De dónde crees que viene nuestro conocimiento: de la razón, de la experiencia o de ambas? Da un ejemplo propio." }
    ],
    multiple: [
      {
        id: "m1",
        pregunta: "¿Cuál es el propósito de la duda metódica de Descartes?",
        opciones: [
          { texto: "Demostrar que no podemos conocer nada con certeza.", correcta: false,
            retro: "Esa sería una conclusión escéptica. Descartes usa la duda como herramienta para salir de ella." },
          { texto: "Encontrar una verdad absolutamente cierta que sirva de fundamento al conocimiento.", correcta: true,
            retro: "Exacto. Por eso su duda es «metódica»: es un camino hacia la certeza, que encuentra en el «pienso, existo»." },
          { texto: "Mostrar que los sentidos siempre mienten.", correcta: false,
            retro: "Descartes dice que los sentidos engañan _a veces_; eso basta para no fiarse del todo de ellos, pero no dice que siempre mientan." },
          { texto: "Probar que la vida es un sueño.", correcta: false,
            retro: "El argumento del sueño no afirma que estemos soñando, sino que no tenemos una señal segura para descartarlo." }
        ]
      },
      {
        id: "m2",
        pregunta: "Según Hume, ¿de dónde provienen nuestras ideas simples?",
        opciones: [
          { texto: "Son innatas: nacemos con ellas.", correcta: false,
            retro: "Esa es una tesis racionalista que Hume rechaza." },
          { texto: "De la imaginación, que puede crear ideas simples de la nada.", correcta: false,
            retro: "Para Hume la imaginación combina y separa ideas, pero no crea ideas simples sin una impresión previa." },
          { texto: "De impresiones: percepciones vivas de los sentidos o de nuestros sentimientos.", correcta: true,
            retro: "Correcto. Es el principio de copia: toda idea simple es copia de una impresión simple." },
          { texto: "De los libros y de lo que nos enseñan.", correcta: false,
            retro: "Lo que leemos o nos enseñan combina ideas que ya tenemos; el origen último, para Hume, son las impresiones." }
        ]
      },
      {
        id: "m3",
        pregunta: "Para Hume, la afirmación «El Sol saldrá mañana» es…",
        opciones: [
          { texto: "una relación de ideas, porque es evidente.", correcta: false,
            retro: "Que algo sea muy seguro no lo convierte en relación de ideas. La prueba es si su negación es contradictoria." },
          { texto: "una cuestión de hecho: su negación no es contradictoria y solo la experiencia puede apoyarla.", correcta: true,
            retro: "Exacto. «El Sol no saldrá mañana» es pensable sin contradicción. Este ejemplo será clave en el Capítulo 2." },
          { texto: "algo que podemos demostrar con la sola razón.", correcta: false,
            retro: "Con la sola razón solo se demuestran relaciones de ideas; esta afirmación habla del mundo." },
          { texto: "una afirmación sin sentido, porque no hay impresión del mañana.", correcta: false,
            retro: "Tiene sentido perfectamente: sus ideas (Sol, salir, mañana) vienen de impresiones. Lo que está en juego es cómo la justificamos." }
        ]
      }
    ]
  },

  cap1: {
    intro: "Antes de cerrar la noche, la Dra. Collao te pide tus reflexiones. No hay respuestas únicas en las preguntas abiertas: lo importante es que justifiques.",
    abiertas: [
      { id: "a1", pregunta: "Piensa en una generalización que uses en tu vida diaria (sobre el transporte, el clima, una persona, etc.). ¿En cuántos casos se basa? ¿Qué pasaría si fallara?" },
      { id: "a2", pregunta: "Clotilde tenía 363 confirmaciones de su ley. ¿Era irracional su confianza? Justifica tu respuesta." },
      { id: "a3", pregunta: "Si ninguna cantidad de casos garantiza una ley universal, ¿por qué crees que la ciencia sigue usando generalizaciones?" }
    ],
    multiple: [
      {
        id: "m1",
        pregunta: "Una astrónoma ha observado 10.000 estrellas de cierto tipo y todas tienen una propiedad P. ¿Qué se sigue LÓGICAMENTE (con necesidad) de esas observaciones?",
        opciones: [
          { texto: "Que todas las estrellas de ese tipo tienen la propiedad P.", correcta: false,
            retro: "Esa es una conclusión inductiva: va más allá de los casos observados. Puede ser razonable, pero no se sigue con necesidad." },
          { texto: "Que las 10.000 estrellas observadas tienen la propiedad P.", correcta: true,
            retro: "Solo eso se sigue con necesidad: es lo que ya dicen las observaciones. Todo lo que vaya más allá es un salto inductivo." },
          { texto: "Que la próxima estrella de ese tipo tendrá la propiedad P.", correcta: false,
            retro: "Es una predicción inductiva. Puede ser muy probable, pero no está garantizada lógicamente." },
          { texto: "Nada: las observaciones no sirven para concluir nada.", correcta: false,
            retro: "Las observaciones sí permiten concluir cosas (y apoyar generalizaciones). Lo que no hacen es garantizar lógicamente una generalización universal." }
        ]
      },
      {
        id: "m2",
        pregunta: "¿Cuál es la diferencia principal entre un argumento deductivo válido y uno inductivo?",
        opciones: [
          { texto: "El deductivo va de lo general a lo particular, y el inductivo de lo particular a lo general, siempre.", correcta: false,
            retro: "Es una caracterización escolar frecuente, pero imprecisa: hay deducciones de lo particular a lo particular e inducciones de lo particular a lo particular (por ejemplo, predecir el próximo caso). La diferencia está en la necesidad de la conclusión." },
          { texto: "En el deductivo válido, si las premisas son verdaderas, la conclusión no puede ser falsa; en el inductivo, la conclusión puede ser falsa aunque las premisas sean verdaderas.", correcta: true,
            retro: "Exacto. La deducción válida preserva la verdad con necesidad; la inducción amplía nuestro conocimiento, pero a cambio de un riesgo." },
          { texto: "El deductivo lo usan los matemáticos y el inductivo, los científicos.", correcta: false,
            retro: "La ciencia usa ambos: por ejemplo, deduce predicciones a partir de hipótesis. La diferencia no está en quién los usa." },
          { texto: "El inductivo es siempre más débil y por eso no debería usarse en ciencia.", correcta: false,
            retro: "Que no garantice su conclusión no lo vuelve inútil: sin inducción no podríamos generalizar ni predecir." }
        ]
      },
      {
        id: "m3",
        pregunta: "Tras miles de mediciones constantes, se observa (y se confirma con dos instrumentos) que S-12 cambió de brillo. ¿Qué ocurre con la ley «Todas las estrellas del Campo del Salar tienen brillo constante»?",
        opciones: [
          { texto: "Sigue siendo verdadera, porque los casos a favor son muchos más que el caso en contra.", correcta: false,
            retro: "Una ley universal no se decide por mayoría: un solo caso bien comprobado en contra basta para que sea falsa." },
          { texto: "Queda refutada como ley universal, aunque las observaciones anteriores sigan siendo verdaderas.", correcta: true,
            retro: "Correcto. Los datos pasados no se vuelven falsos; lo falso es la afirmación de que _todas_ las estrellas son constantes." },
          { texto: "Demuestra que la inducción nunca funciona.", correcta: false,
            retro: "Muestra que la inducción es falible, no que nunca funcione. Muchas generalizaciones inductivas son exitosas." },
          { texto: "No se puede saber nada, porque cualquier observación podría estar equivocada.", correcta: false,
            retro: "Es sano revisar las observaciones, y eso se hizo con dos instrumentos. Dudar de todo por igual impediría aprender de la experiencia." }
        ]
      }
    ]
  }
};
