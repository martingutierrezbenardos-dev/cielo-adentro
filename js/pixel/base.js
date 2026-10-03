/* Pixel art estilo Game Boy Color: paleta, lienzos y dibujo a partir de mapas de caracteres.
   Todo el arte es original y se genera en el navegador (no hay imágenes externas). */
window.CA = window.CA || {};

(function (CA) {
  "use strict";

  var P = CA.Pixel = CA.Pixel || {};

  P.TILE = 16;           // tamaño de una baldosa en píxeles
  P.ANCHO = 15;          // baldosas visibles en horizontal (240 px)
  P.ALTO = 10;           // baldosas visibles en vertical (160 px)

  /* Paleta inspirada en la Game Boy Color: pocos colores, saturados, con el
     desierto de Atacama de noche como identidad (azules, morados y ámbar). */
  P.col = {
    negro: "#100c20",
    noche1: "#121838",
    noche2: "#1e2a66",
    noche3: "#343a8c",
    morado: "#6a3c9c",
    lila: "#a880d8",
    rosa: "#f0849c",
    naranja: "#f89848",
    ambar: "#f8c838",
    crema: "#f8ecc0",
    blanco: "#f8f8f0",
    arena1: "#e8b070",
    arena2: "#c88848",
    arena3: "#8c5430",
    roca1: "#8a6478",
    roca2: "#5a3c5c",
    roca3: "#3a2848",
    asfalto: "#4a4868",
    asfalto2: "#3a3854",
    verde: "#58b050",
    verde2: "#2c6c3c",
    turquesa: "#40c8b8",
    cian: "#a8f8f0",
    rojo: "#d83c3c",
    rojo2: "#901c34",
    madera1: "#c07c40",
    madera2: "#8a4c24",
    madera3: "#5c2c18",
    gris1: "#c0c0d8",
    gris2: "#8080a0",
    gris3: "#50506c",
    piel1: "#f8c8a0",
    piel2: "#d8945c",
    piel3: "#a05c34",
    pelo1: "#3a2418",
    pelo2: "#d0d0dc",
    azul: "#3870d8",
    azul2: "#20408c",
    celeste: "#78b8f8",
    muro1: "#5c4c8c",
    muro2: "#40366c",
    muro3: "#2c2450",
    piso1: "#a87850",
    piso2: "#8a5c38"
  };
  var C = P.col;

  /* Generador pseudoaleatorio con semilla: el arte procedural queda siempre igual. */
  P.azar = function (semilla) {
    var a = semilla >>> 0;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };
  // Hash estable de una coordenada (para variar baldosas sin guardar nada).
  P.hash = function (x, y, s) {
    var h = (x * 374761393 + y * 668265263 + (s || 0) * 2147483647) | 0;
    h = (h ^ (h >>> 13)) * 1274126177 | 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };

  P.lienzo = function (w, h) {
    var c = document.createElement("canvas");
    c.width = w; c.height = h;
    var x = c.getContext("2d");
    x.imageSmoothingEnabled = false;
    return { c: c, x: x };
  };

  P.rect = function (x, px, py, w, h, color) {
    x.fillStyle = color;
    x.fillRect(px, py, w, h);
  };

  /* Dibuja un mapa de caracteres. "colores" asocia cada carácter a un color;
     el punto (.) y el espacio son transparentes. */
  P.dibujar = function (ctx, filas, colores, dx, dy, espejo) {
    for (var y = 0; y < filas.length; y++) {
      var f = filas[y];
      for (var i = 0; i < f.length; i++) {
        var ch = f[i];
        if (ch === "." || ch === " ") continue;
        var col = colores[ch];
        if (!col) continue;
        ctx.fillStyle = col;
        ctx.fillRect((dx || 0) + (espejo ? f.length - 1 - i : i), (dy || 0) + y, 1, 1);
      }
    }
  };

  /* Crea (y guarda en caché) una imagen a partir de un mapa de caracteres. */
  var cache = {};
  P.imagen = function (clave, filas, colores, espejo) {
    var k = clave + (espejo ? "#e" : "");
    if (cache[k]) return cache[k];
    var w = 0;
    filas.forEach(function (f) { w = Math.max(w, f.length); });
    var l = P.lienzo(w, filas.length);
    P.dibujar(l.x, filas, colores, 0, 0, espejo);
    return (cache[k] = l.c);
  };

  /* Crea (y guarda en caché) una imagen dibujada con una función. */
  P.hecha = function (clave, w, h, fn) {
    if (cache[clave]) return cache[clave];
    var l = P.lienzo(w, h);
    fn(l.x, w, h);
    return (cache[clave] = l.c);
  };

  /* Convierte un lienzo pequeño en una URL de imagen ampliada (para retratos en HTML). */
  P.aURL = function (lienzo, escala) {
    escala = escala || 4;
    var l = P.lienzo(lienzo.width * escala, lienzo.height * escala);
    l.x.drawImage(lienzo, 0, 0, l.c.width, l.c.height);
    return l.c.toDataURL();
  };
})(window.CA);
