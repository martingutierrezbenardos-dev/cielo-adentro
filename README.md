# Cielo Adentro

Aventura gráfica educativa (*point and click*) de **filosofía de la ciencia** para 3° y 4° medio.
Quien juega es estudiante en práctica en el Observatorio Alto Tamarugo (ficticio), en el desierto de Atacama, donde fenómenos extraños obligan al equipo a preguntarse cómo sabe la ciencia lo que sabe.

> **Estado:** Capítulos 0 y 1 completos y probados. Capítulos 2–4 en desarrollo.

## Capítulos

| # | Capítulo | Conceptos | Puzle central |
|---|----------|-----------|---------------|
| 0 | La duda y la experiencia | Duda metódica, argumento del sueño, genio maligno, cogito; impresiones e ideas, principio de copia, horquilla de Hume; racionalismo y empirismo | «La criba de la duda» (aplicar los tres niveles de duda de Descartes a las propias creencias), «Rastrear ideas» y «La horquilla de Hume» |
| 1 | La inducción | Generalización universal, inducción vs. deducción, contraejemplo, asimetría, falibilismo; la gallina de Russell | Registrar observaciones, formular una ley y enfrentar un contraejemplo (una nova) en «La balanza de la certeza» |
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

No necesita backend ni base de datos. El progreso de cada estudiante se guarda en su propio navegador (localStorage). Si el navegador no permite guardar, el juego funciona igual, pero avisa que el progreso se perderá al cerrar.

## Cómo editar los textos (sin tocar la lógica)

Todo el contenido está en la carpeta `datos/`. Son archivos de texto que puedes abrir con cualquier editor (VS Code, Bloc de notas, TextEdit en modo texto plano).

| Archivo | Qué contiene |
|---------|--------------|
| `datos/config.js` | Título, **clave del modo docente**, textos de la interfaz, personajes y objetos |
| `datos/cap0.js`, `datos/cap1.js` (y `cap2.js`…) | Escenas, zonas clicables, diálogos, observaciones y puzles de cada capítulo |
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

### Zonas clicables (hotspots) y condiciones
```js
{ id: "pizarra", etiqueta: "Pizarra de leyes", zona: [77, 21, 19.5, 31],
  si: { bandera: "c1-ley" },
  acciones: [ { dialogo: "c1-pizarra-ver" } ] }
```
- `zona`: `[x, y, ancho, alto]` en porcentaje del escenario.
- Condiciones (`si`): `bandera`, `noBandera`, `tiene` (objeto), `noTiene`, `registrosMin`, `registrosMenos`, `registrado`, `noRegistrado`.
- Acciones: `dialogo`, `ir` (a otra escena), `dar`/`quitar` (objetos), `poner`/`sacar` (banderas), `registrar` (observación), `puzle`, `desbloquear` (cuaderno/glosario), `mensaje`, `evaluacion`, `finCapitulo`.

### Puzles
Los textos, opciones, retroalimentación y **pistas (3 niveles)** de cada puzle están en la sección `puzles` del archivo del capítulo. En las opciones, `correcta: true` marca la respuesta correcta y `retro` es la explicación que se muestra.

Tipos de puzle reutilizables:
- `eleccion`: una o varias preguntas con opciones y retroalimentación.
- `clasificar`: asignar cada elemento a una categoría (`correcta` = id de la categoría; `retroMal` explica cada error posible). Se usa en «Rastrear ideas» y «La horquilla de Hume».
- `criba`: niveles de duda sucesivos; cada creencia indica en qué nivel cae (`caeEn`: 0, 1, 2 o `null` si resiste todo).
- `balanza`: el medidor de confirmaciones del Capítulo 1.

## Para el aula

- **Modo docente** (botón en la pantalla de inicio o en el menú): saltar a cualquier capítulo, ver soluciones, guía con objetivos, preguntas de discusión y errores conceptuales frecuentes, y progreso de la partida abierta.
- **Respuestas de estudiantes:** al final de cada capítulo hay 2–3 preguntas abiertas y 3 de comprobación. En «Menú → Mis respuestas» o en la pantalla final se descargan como `.txt` con nombre y curso.
- **Accesibilidad:** sin límite de tiempo; todo se puede jugar con teclado (Tab, Enter, **R** para resaltar zonas, **C** cuaderno, **G** glosario, **M** menú, **Esc** cerrar); tamaño de texto ajustable (4 niveles); modo de alto contraste; reducir animaciones.

## Estructura técnica

HTML + CSS + JavaScript sin frameworks. Scripts clásicos (no módulos) para que funcione al abrir `index.html` directamente.

```
index.html
css/estilos.css            paleta y estilos
js/motor/                  estado, guardado, escenas, diálogos, inventario, interfaz, puzles, evaluación, exportación, modo docente
js/puzles/                 mecánicas específicas de cada puzle
js/arte/                   ilustraciones SVG originales (escenarios, personajes, objetos)
js/juego.js                arranque
datos/                     todo el contenido editable
tests/                     servidor local de prueba y lista de verificación
```
