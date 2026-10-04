/* =========================================================
   GUÍA DOCENTE (visible solo en el modo docente)
   ========================================================= */
DATOS.docente = {
  general: "**Sugerencia de uso:** una clase de 90 minutos alcanza para dos capítulos (≈ 15 min cada uno) y 45–60 minutos de discusión. Los estudiantes pueden jugar en parejas: discutir cada decisión en voz alta mejora el aprendizaje. Al final, cada estudiante descarga un archivo .txt con sus respuestas abiertas.",

  cap0: {
    duracion: "12–15 minutos de juego",
    objetivos: [
      "Reconocer la duda metódica como un método para alcanzar certeza, no como una tesis escéptica.",
      "Distinguir el alcance de los tres argumentos de la Meditación Primera: errores de los sentidos, sueño y genio maligno.",
      "Comprender por qué el «pienso, existo» resiste incluso a la hipótesis del genio maligno.",
      "Distinguir impresiones de ideas y aplicar el principio de copia de Hume.",
      "Clasificar afirmaciones como relaciones de ideas o cuestiones de hecho (horquilla de Hume).",
      "Contrastar racionalismo y empirismo, y formular la pregunta que abre el problema de la inducción."
    ],
    discusion: [
      "¿Es razonable dudar de todo lo que alguna vez nos engañó? ¿Qué perderíamos si lo hiciéramos en la vida diaria?",
      "¿Hay alguna forma de saber que ahora no estamos soñando? Comparen el argumento del sueño con la respuesta que Descartes da en la Meditación Sexta (coherencia de la vigilia).",
      "El genio maligno y el «cerebro en una cubeta»: ¿qué cambia (y qué no) al pasar de un demonio a una simulación tecnológica?",
      "¿Existe alguna idea que no provenga de la experiencia? Pongan a prueba el principio de copia con ejemplos (números, infinito, justicia…).",
      "¿Por qué «el Sol saldrá mañana» no es una relación de ideas, aunque estemos casi seguros de ello?"
    ],
    errores: [
      { error: "«Descartes era escéptico.»",
        aclaracion: "Usa argumentos escépticos como método, pero su objetivo es alcanzar certezas." },
      { error: "«El argumento del sueño dice que la vida es un sueño.»",
        aclaracion: "Dice que no tenemos una señal segura para descartar que estemos soñando, lo que basta para poner en duda las percepciones." },
      { error: "«El genio maligno es una creencia de Descartes.»",
        aclaracion: "Es una hipótesis de trabajo para llevar la duda al extremo; Descartes la descarta después." },
      { error: "«Para Hume, todo lo que imaginamos lo hemos visto.»",
        aclaracion: "Podemos imaginar lo que nunca vimos (una montaña de oro), pero combinando ideas simples que sí vienen de impresiones." },
      { error: "«Relación de ideas = algo muy seguro; cuestión de hecho = algo dudoso.»",
        aclaracion: "El criterio no es el grado de seguridad, sino si la negación es contradictoria y cómo se justifica (razón o experiencia)." },
      { error: "«Racionalistas y empiristas se oponen en todo.»",
        aclaracion: "La clasificación es útil pero simplificada: ambos reconocen papeles a la razón y a la experiencia." }
    ],
    recorrido: [
      "Camino: mirar el charco (espejismo) y la Luna → Subir al observatorio.",
      "Pieza: leer el libro (Descartes) → Dormir. (El vaso con bombilla es opcional.)",
      "Sueño: probar el pellizco, el reloj y preguntarle a la Dra. Collao → interactuar con la luz brillante para despertar.",
      "Pieza: Valentina golpea la puerta → ir al planetario.",
      "Planetario: hablar con el eco de Descartes → duelo «La criba de la duda».",
      "Hablar con el eco de Hume → duelos «Rastrear ideas» y «La horquilla de Hume» → reflexión final."
    ],
    soluciones: {
      "c0-criba": "Nivel 1 (sentidos): caen el charco y la Luna; resisten las demás. Nivel 2 (sueño): caen «Estoy aquí…» y «Tengo un cuerpo…»; resisten 2 + 3 = 5, el cuadrado y «existo». Nivel 3 (genio maligno): caen 2 + 3 = 5 y el cuadrado; resiste «Yo, que ahora estoy dudando, existo». Pregunta final: «Porque para dudar, soñar o ser engañado tengo que estar pensando…».",
      "c0-ideas": "Frío del viento: copia de una impresión. Montaña de oro y vicuña con alas: combinación. Sabor del copao sin haberlo probado: sin la impresión no se puede formar. Fuerza que «obliga» en el choque: no encuentro su impresión. Rojo de las luces: copia de una impresión.",
      "c0-horquilla": "Relaciones de ideas: cuadrado de cuatro lados, 2 + 3 = 5, ninguna persona soltera está casada. Cuestiones de hecho: el Sol saldrá mañana, el agua del salar es salada, el fuego quema, las estrellas del Campo del Salar tienen brillo constante."
    }
  },

  cap1: {
    duracion: "10–15 minutos de juego",
    objetivos: [
      "Distinguir entre un resumen de observaciones y una generalización universal (ley).",
      "Reconocer que una generalización inductiva va más allá de la evidencia: gana poder predictivo a cambio de un riesgo.",
      "Comprender que ninguna cantidad finita de casos confirmatorios garantiza lógicamente una generalización universal.",
      "Reconocer la asimetría: un contraejemplo bien establecido basta para refutar una generalización universal.",
      "Distinguir entre confianza razonable y demostración lógica."
    ],
    discusion: [
      "¿Era irracional la confianza de Clotilde? ¿Qué diferencia hay entre una creencia razonable y una creencia garantizada?",
      "¿Por qué la Dra. Collao insiste en que las observaciones vengan de fuentes distintas? ¿Qué problemas evita eso y cuáles no?",
      "¿Es lo mismo decir «la inducción no garantiza su conclusión» que «la inducción no sirve»?",
      "¿Qué cambia si la ley se refiere a un conjunto finito y ya observado por completo (por ejemplo, «todas las personas de esta sala miden menos de 2 m»)?",
      "¿Qué opinas de la opción de «redefinir» qué cuenta como estrella del Campo del Salar para salvar la ley? (Anticipa el Capítulo 3.)"
    ],
    errores: [
      { error: "«La inducción va de lo particular a lo general y la deducción de lo general a lo particular.»",
        aclaracion: "Caracterización escolar imprecisa. El criterio relevante es si la verdad de las premisas garantiza la de la conclusión." },
      { error: "«Con suficientes casos, la ley queda demostrada.»",
        aclaracion: "Los casos aumentan la confianza o el apoyo, pero una generalización universal nunca queda demostrada por casos finitos." },
      { error: "«Si la ley fue refutada, las observaciones anteriores eran falsas.»",
        aclaracion: "Las observaciones pasadas siguen siendo verdaderas; lo falso es la generalización universal." },
      { error: "«Entonces la ciencia no sabe nada.»",
        aclaracion: "El falibilismo no es escepticismo total: las leyes pueden estar muy bien apoyadas y seguir siendo revisables." }
    ],
    recorrido: [
      "Explanada → Entrar a la cúpula (la Dra. Collao entrega la llave del archivo).",
      "Registrar 6 de 7 observaciones: telescopio, fotómetro, cuaderno rojo (cúpula); placas, bitácora, catálogo (archivo: frente a la puerta, abrir la mochila con I y elegir la llave); Don Ramiro (explanada).",
      "Pizarra → puzle «Formular la ley».",
      "Don Ramiro, frente a su casa → escena de la gallina (Russell) → salir del patio.",
      "En la explanada aparece la nova → mirar el cielo (opcional) → telescopio de la cúpula.",
      "Hablar con la Dra. Collao → duelo «La balanza de la certeza» → «¿Y ahora qué hacemos con la ley?» → reflexión final."
    ],
    soluciones: {
      "c1-ley": "Opción correcta: «Todas las estrellas del Campo del Salar tienen brillo constante.» (Las otras son un resumen, un enunciado existencial débil y una afirmación exagerada: «está demostrado».)",
      "c1-balanza": "En el duelo, usar al menos 5 confirmaciones (con «+1» o «+1.000»), luego «Agregar la observación de S-12». Respuesta: «Ninguna cantidad finita basta: la conclusión siempre va más allá de los casos observados.»",
      "c1-conclusion": "Paso 1: reformular como hipótesis revisable. Paso 2: «Ninguna cantidad finita de casos confirmatorios garantiza lógicamente…». Paso 3: «Sí: generalizar nos permite predecir y actuar…»."
    }
  }
};
