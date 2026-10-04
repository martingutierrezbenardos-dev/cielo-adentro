# Cielo Adentro

Aventura educativa de **filosofía de la ciencia** para 3° y 4° medio, al estilo de los RPG de Game Boy Color: caminas por mapas en pixel art, conversas con los personajes y enfrentas **duelos filosóficos** con pantalla de combate.
Quien juega es estudiante en práctica en el Observatorio Alto Tamarugo (ficticio), en el desierto de Atacama, donde fenómenos extraños obligan al equipo a preguntarse cómo sabe la ciencia lo que sabe.

**Jugar en línea:** https://martingutierrezbenardos-dev.github.io/cielo-adentro/

> **Estado:** Capítulos 0 y 1 completos y probados. Capítulos 2–4 en desarrollo.

## Capítulos

| # | Capítulo | Conceptos | Puzle central |
|---|----------|-----------|---------------|
| 0 | La duda y la experiencia | Duda metódica, argumento del sueño, genio maligno, cogito; impresiones e ideas, principio de copia, horquilla de Hume; racionalismo y empirismo | Duelo contra el eco de Descartes, «La criba de la duda»: tus creencias son tu equipo y caen ante los tres niveles de duda. Duelos contra el eco de Hume: «Rastrear ideas» y «La horquilla de Hume» |
| 1 | La inducción | Generalización universal, inducción vs. deducción, contraejemplo, asimetría, falibilismo; la gallina de Russell | Registrar observaciones, formular una ley y el duelo «La balanza de la certeza»: tu ley contra EL CASO SIGUIENTE, que ninguna confirmación derrota y un solo contraejemplo (S-12) gana |
| 2 | Hume y el problema de la inducción | Uniformidad de la naturaleza, circularidad, a priori / a posteriori, conjunción constante, costumbre | *(en desarrollo)* |
| 3 | Popper: falsacionismo y demarcación | Asimetría lógica, modus tollens, conjeturas y refutaciones, demarcación, Duhem-Quine | *(en desarrollo)* |
| 4 | Kuhn: paradigmas y revoluciones | Ciencia normal, anomalía, crisis, revolución, gestalt, inconmensurabilidad, valores | *(en desarrollo)* |

Duración aproximada: 10–15 minutos por capítulo.

## Cómo abrir el juego

**Opción 1 — Directo:** haz doble clic en `index.html`. Funciona sin internet y sin instalar nada (Chrome, Edge, Firefox o Safari recientes).

**Opción 2 — Servidor local (opcional):** si tienes Node.js, ejecuta `node tests/servidor.js` y abre `http://localhost:8765`.

## Cómo publicarlo en GitHub Pages

1. Crea un repositorio en GitHub y sube todos los archivos de esta carpeta (manteniendo las subcarpetas).
2. En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, elige la rama `main` y la carpeta `/ (root)`. Guarda.
3. En uno o dos minutos el juego estará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPOSITORIO/`.

**Al publicar cambios:** en `index.html`, sube el número de versión de los archivos (`?v=2` → `?v=3`, se puede reemplazar todo de una vez). Así los navegadores descargan los archivos nuevos en vez de mezclar versiones guardadas en caché.

No necesita backend ni base de datos. El progreso de cada estudiante se guarda en su propio navegador (localStorage). Si el navegador no permite guardar, el juego funciona igual, pero avisa que el progreso se perderá al cerrar.

## Cómo editar los textos (sin tocar la lógica)

Todo el contenido está en la carpeta `datos/`. Son archivos de texto que puedes abrir con cualquier editor (VS Code, Bloc de notas, TextEdit en modo texto plano).

| Archivo | Qué contiene |
|---------|--------------|
| `datos/config.js` | Título, **clave del modo docente**, textos de la interfaz, personajes y objetos |
| `datos/cap0.js`, `datos/cap1.js` (y `cap2.js`…) | Mapas, lugares y personajes, diálogos, observaciones y puzles de cada capítulo |
| `datos/cuaderno.js` | Entradas del cuaderno de campo (concepto, autor, obra, ejemplo) |
| `datos/glosario.js` | Términos del glosario |
| `datos/evaluacion.js` | Preguntas de reflexión y de opción múltiple de cada capítulo |
| `datos/docente.js` | Guía docente: objetivos, preguntas de discusión, errores frecuentes y soluciones |

**Reglas para no romper nada:**
- Cambia solo el texto **entre comillas**. Si necesitas comillas dentro de un texto, usa « » (como en el resto del juego).
- No borres las comas al final de cada línea ni las llaves `{ }` o corchetes `[ ]`.
- Formato disponible dentro de los textos: `**negrita**`, `_cursiva_`, y una línea en blanco (`\n\n`) para separar párrafos.
- Variables: `{nombre}` (nombre del estudiante), `{registros}` (observaciones registradas), `{faltan}` (observaciones que faltan).
- Si después de editar el juego se queda en blanco, lo más probable es una coma o comilla faltante. Abre la consola del navegador (F12) para ver la línea con el error.

### Cambiar la clave del modo docente
En `datos/config.js`, modifica `claveDocente: "profe2026"`. No es seguridad real: cualquiera que abra el archivo puede verla.

### Diálogos
Un diálogo es una lista de líneas:

```js
"c1-ramiro-1": [
  { quien: "ramiro", texto: "¡Buenas noches!" },
  { quien: "ramiro", texto: "¿Qué quiere saber?",
    opciones: [
      { texto: "Sobre las estrellas", ir: "estrellas" },
      { texto: "Nada, gracias", ir: "fin" }
    ] },
  { id: "estrellas", quien: "ramiro", texto: "Cuarenta años mirándolas…" }
]
```
- `quien` puede ser `collao`, `ramiro`, `gallina`, `tu`, `tomas`, `valentina`, `descartes`, `hume`, `popper`, `kuhn`. Sin `quien` es narración.
- `ir` salta a la línea con ese `id`; `"fin"` termina el diálogo.
- `si` muestra la línea solo si se cumple una condición (ver abajo).

### Mapas y lugares (hotspots) y condiciones
Cada escena es un mapa de baldosas de 16×16 píxeles. La pantalla muestra 15×10 baldosas y la cámara sigue a quien juega.

```js
"c0-pieza": {
  nombre: "Tu pieza en la residencia",
  mapa: {
    modo: "madera",              // estilo de muros/cielo: noche, atardecer, sueno, metal, oscuro, madera
    tinte: "#ffe4cc",            // (opcional) tiñe la escena; también [{ si: {...}, color: "..." }]
    terreno: [                   // una letra por baldosa (ver leyenda)
      "WWWWWWWWWW",
      "wwwwwwwwww",
      "oooooooooo",
      "oooooooodo"
    ],
    objetos: [ ["cama", 1, 2], ["escritorio", 5, 2], ["pizarra-ley", 9, 1, { bandera: "c1-ley" }] ],
    inicio: [8, 6, "arriba"],                     // dónde aparece quien juega
    desde: { "c0-sueno": [2, 3, "abajo"] }        // dónde aparece según la escena de la que viene
  },
  hotspots: [
    { id: "libro", etiqueta: "Libro con papelitos", en: [5, 2], acciones: [{ dialogo: "c0-libro" }] },
    { id: "ramiro", etiqueta: "Don Ramiro", en: [7, 7], sprite: "ramiro", mira: "izq", acciones: [...] },
    { id: "puerta", etiqueta: "Puerta", en: [8, 3], pisar: true, acciones: [{ ir: "c0-planetario" }] }
  ]
}
```
- `en`: `[x, y]` o `[x, y, ancho, alto]` en baldosas (la esquina superior izquierda es `[0, 0]`). Se interactúa mirando hacia el lugar y presionando **A**. A través de mesas, escritorios y pircas también se puede hablar.
- `sprite`: hace aparecer un personaje en ese lugar (`tu`, `collao`, `ramiro`, `valentina`, `descartes`, `hume`, `clotilde`) o un objeto animado (`luz`). Los personajes se dan vuelta para mirar a quien les habla.
- `pisar: true`: la acción ocurre al caminar encima (puertas, salidas). Si después de las acciones se sigue en la misma escena (por ejemplo, «todavía no»), quien juega retrocede un paso.
- Condiciones (`si`): `bandera`, `noBandera`, `tiene` (objeto), `noTiene`, `registrosMin`, `registrosMenos`, `registrado`, `noRegistrado`, `alguna`, `no`.
- Acciones: `dialogo`, `ir` (a otra escena), `dar`/`quitar` (objetos), `poner`/`sacar` (banderas), `registrar` (observación), `puzle`, `desbloquear` (cuaderno/glosario), `mensaje`, `evaluacion`, `finCapitulo`.
- `usar: { "llave-archivo": [ ...acciones ] }`: lo que pasa si se usa ese objeto desde la mochila mirando hacia este lugar.

**Leyenda del terreno** (`js/pixel/tiles.js`):

| Letra | Exteriores | Letra | Interiores |
|---|---|---|---|
| `.` `,` | arena (con piedritas o coirón) | `W` `w` | muro alto / muro bajo |
| `=` `-` | asfalto / con línea | `o` `p` `k` | piso de madera / metálico / oscuro |
| `:` `t` | tierra / tierra del patio | `z` | piso del sueño |
| `^` `#` | roca / pared de roca | `s` | cúpula con estrellas |
| `_` | pirca (se puede hablar por encima) | `r` | alfombra |
| `a` `b` `c` `m` | cielo alto, medio, horizonte, cerros | `d` `D` | felpudo de salida / puerta abierta |
| `f` `A` | cerca de palos / muro de adobe | `x` | vacío |

Objetos de decorado disponibles: `cama`, `escritorio`, `mesa`, `libro`, `vaso`, `ventana`, `cuadro`, `planta`, `silla`, `estante`, `telescopio`, `consola`, `cuaderno-rojo`, `pizarra`, `pizarra-ley`, `pizarra-tachada`, `pizarra-sueno`, `puerta-cerrada`, `archivador`, `computador`, `bitacora`, `proyector`, `butaca`, `reloj`, `espejo`, `luz`, `cactus`, `piedra`, `letrero`, `camioneta`, `charco`, `luna`, `observatorio-lejos`, `cupula`, `casa`, `campo-salar`, `gallinero`, `fogon`, `ventana-adobe`, `tablero-estrellas`, `gallina-blanca`, `gallina-cafe`.

### Puzles y duelos
Los textos, opciones, retroalimentación y **pistas (3 niveles)** de cada puzle están en la sección `puzles` del archivo del capítulo. En las opciones, `correcta: true` marca la respuesta correcta y `retro` es la explicación que se muestra.

Tipos de puzle reutilizables:
- `eleccion`: una o varias preguntas con opciones y retroalimentación (ventana de menú).
- `clasificar` (**duelo**): el rival plantea cada elemento y los «movimientos» son las categorías (`correcta` = id de la categoría; `retroMal` explica cada error posible). Se usa en «Rastrear ideas» y «La horquilla de Hume».
- `criba` (**duelo**): niveles de duda sucesivos; las creencias son tu equipo y cada una indica en qué nivel cae (`caeEn`: 0, 1, 2 o `null` si resiste todo).
- `balanza` (**duelo**): tu ley contra EL CASO SIGUIENTE (Capítulo 1).

En los duelos no se pierde: un error explica por qué y deja volver a intentar. «Salir del duelo» (Esc) guarda el avance. Los nombres y frases del rival se pueden cambiar con un bloque opcional `duelo` dentro del puzle, por ejemplo:

```js
duelo: { rival: "descartes", nombreRival: "ECO DE DESCARTES", intro: "¡El {rival} te desafía a un duelo de dudas!", usa: "¡{rival} usa {ataque}!" }
```

## Para el aula

- **Modo docente** (botón en la pantalla de inicio o en el menú): saltar a cualquier capítulo, ver soluciones, guía con objetivos, preguntas de discusión y errores conceptuales frecuentes, y progreso de la partida abierta.
- **Respuestas de estudiantes:** al final de cada capítulo hay 2–3 preguntas abiertas y 3 de comprobación. En «Menú → Mis respuestas» o en la pantalla final se descargan como `.txt` con nombre y curso.
- **Controles:** flechas o W A S D para caminar; **A** = Enter, Espacio o Z (hablar, mirar, avanzar texto); clic o toque en el mapa para caminar hasta ahí; **R** muestra los lugares importantes (❗ nuevo, ➜ salida); **I** mochila; **C** cuaderno; **G** glosario; **M** menú; **Esc** cerrar. En celulares y tablets aparecen una cruceta y botones A/B en pantalla.
- **Accesibilidad:** sin límite de tiempo; todo se puede jugar con teclado; con **Tab** se recorre una lista de los lugares y personas de la escena (Enter camina hasta ahí e interactúa), pensada también para lectores de pantalla; el texto de los diálogos se anuncia completo; tamaño de texto ajustable (4 niveles); modo de alto contraste; «reducir animaciones» desactiva el texto letra por letra y las animaciones.

## Estructura técnica

HTML + CSS + JavaScript sin frameworks, con un `<canvas>` de 240×160 píxeles escalado. Scripts clásicos (no módulos) para que funcione al abrir `index.html` directamente.

```
index.html
css/estilos.css            estética Game Boy Color (cuadros de texto, menús, duelos)
js/pixel/                  pixel art generado en el navegador: paleta, personajes, baldosas y decorados
js/motor/                  estado, guardado, mundo (mapas, movimiento, cámara), diálogos, mochila,
                           interfaz, puzles, duelos, evaluación, exportación, modo docente
js/puzles/                 mecánicas de cada puzle (criba, clasificar y balanza se juegan como duelos)
js/juego.js                arranque
datos/                     todo el contenido editable (incluye los mapas)
tests/                     servidor local, lista de verificación y recorrido automático
```

Todo el arte es original y se dibuja con código (no hay imágenes externas). La fuente pixelada de los títulos («Press Start 2P») se carga desde Google Fonts; sin internet se usa una fuente del sistema y el juego funciona igual.

**Recorrido automático (opcional):** con Node.js y Playwright instalados, `node tests/servidor.js` y luego `node tests/recorrido-automatico.js` juega los capítulos 0 y 1 completos (incluidos los duelos y la evaluación) y avisa si algo falla.
