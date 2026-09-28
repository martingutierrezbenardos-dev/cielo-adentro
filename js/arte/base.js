/* Utilidades de dibujo SVG. Todo el arte es original, en estilo de ilustración plana.
   Los colores vienen de variables CSS (css/estilos.css) para mantener la paleta coherente. */
window.CA = window.CA || {};

(function (CA) {
  "use strict";

  var contador = 0;

  var A = CA.Arte = CA.Arte || {};
  A._escenas = {};

  // Se resuelve el color real desde las variables CSS (funciona en todos los navegadores,
  // incluso donde var() no se acepta dentro de atributos SVG).
  var cache = {};
  A.c = function (nombre) {
    if (cache[nombre]) return cache[nombre];
    var v = "";
    try { v = getComputedStyle(document.documentElement).getPropertyValue("--c-" + nombre).trim(); } catch (e) { /* sin estilos */ }
    return (cache[nombre] = v || "#888");
  };
  A.uid = function (p) { contador++; return (p || "g") + contador; };

  // Generador pseudoaleatorio con semilla: las estrellas quedan siempre en el mismo lugar.
  A.azar = function (semilla) {
    var a = semilla >>> 0;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };

  A.svg = function (contenido, vb) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (vb || "0 0 1600 900") +
      '" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' + contenido + "</svg>";
  };

  A.degradado = function (id, paradas, vertical) {
    var s = '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (vertical === false ? 1 : 0) + '" y2="' + (vertical === false ? 0 : 1) + '">';
    paradas.forEach(function (p) {
      s += '<stop offset="' + p[0] + '" style="stop-color:' + p[1] + ';stop-opacity:' + (p[2] == null ? 1 : p[2]) + '"/>';
    });
    return s + "</linearGradient>";
  };

  A.radial = function (id, paradas) {
    var s = '<radialGradient id="' + id + '">';
    paradas.forEach(function (p) {
      s += '<stop offset="' + p[0] + '" style="stop-color:' + p[1] + ';stop-opacity:' + (p[2] == null ? 1 : p[2]) + '"/>';
    });
    return s + "</radialGradient>";
  };

  // Cielo nocturno con vía láctea y estrellas.
  A.cieloNoche = function (op) {
    op = op || {};
    var id = A.uid("cielo");
    var alto = op.alto || 900;
    var s = "<defs>" + A.degradado(id, [
      [0, A.c("cielo-1")], [0.55, A.c("cielo-2")], [0.85, A.c("cielo-3")], [1, A.c("horizonte")]
    ]) + "</defs>";
    s += '<rect x="0" y="0" width="1600" height="' + alto + '" fill="url(#' + id + ')"/>';
    if (op.viaLactea !== false) {
      var difuso = A.uid("difuso");
      s += '<defs><filter id="' + difuso + '" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="28"/></filter></defs>';
      s += '<g transform="rotate(-24 800 300)" fill="' + A.c("via-lactea") + '" filter="url(#' + difuso + ')">' +
        '<ellipse cx="800" cy="300" rx="900" ry="120" opacity=".07"/>' +
        '<ellipse cx="760" cy="300" rx="700" ry="70" opacity=".08"/>' +
        '<ellipse cx="820" cy="305" rx="520" ry="34" opacity=".09"/>' +
        '<ellipse cx="600" cy="290" rx="120" ry="18" fill="' + A.c("cielo-1") + '" opacity=".35"/>' +
        '<ellipse cx="980" cy="312" rx="90" ry="14" fill="' + A.c("cielo-1") + '" opacity=".35"/></g>';
    }
    s += A.estrellas(op.n || 170, op.semilla || 7, 0, 0, 1600, op.limite || alto * 0.72);
    return s;
  };

  A.estrellas = function (n, semilla, x0, y0, w, h) {
    var r = A.azar(semilla);
    var s = '<g fill="' + A.c("estrella") + '">';
    for (var i = 0; i < n; i++) {
      var x = x0 + r() * w, y = y0 + r() * h;
      var rad = 0.6 + Math.pow(r(), 3) * 2.4;
      var op = 0.35 + r() * 0.65;
      s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + rad.toFixed(2) + '" opacity="' + op.toFixed(2) + '"/>';
      if (rad > 2.3) s += A.destello(x, y, rad * 3.2, op);
    }
    return s + "</g>";
  };

  A.destello = function (x, y, l, op) {
    return '<path d="M' + (x - l) + " " + y + "H" + (x + l) + "M" + x + " " + (y - l) + "V" + (y + l) +
      '" stroke="' + A.c("estrella") + '" stroke-width="1" opacity="' + ((op || 1) * 0.6).toFixed(2) + '"/>';
  };

  // Cordones montañosos en capas.
  A.cerros = function (y) {
    y = y || 560;
    return '<path d="M0 ' + (y + 40) + " L120 " + (y - 10) + " L260 " + (y + 30) + " L420 " + (y - 40) + " L560 " + (y + 20) +
      " L700 " + (y - 20) + " L860 " + (y + 30) + " L960 " + (y - 150) + " L1000 " + (y - 158) + " L1040 " + (y - 150) +
      " L1180 " + (y + 10) + " L1320 " + (y - 30) + " L1460 " + (y + 20) + " L1600 " + (y - 10) + " V900 H0Z\" fill=\"" + A.c("cerro-lejos") + '"/>' +
      '<path d="M960 ' + (y - 150) + " L1000 " + (y - 158) + " L1040 " + (y - 150) + " L1022 " + (y - 128) + " L1006 " + (y - 138) +
      " L990 " + (y - 124) + " L975 " + (y - 136) + 'Z" fill="' + A.c("cupula") + '" opacity=".55"/>' +
      '<path d="M0 ' + (y + 90) + " C200 " + (y + 40) + " 340 " + (y + 70) + " 520 " + (y + 50) + " S900 " + (y + 90) +
      " 1100 " + (y + 60) + " S1450 " + (y + 50) + " 1600 " + (y + 80) + ' V900 H0Z" fill="' + A.c("cerro") + '"/>';
  };

  A.suelo = function (y) {
    var id = A.uid("suelo");
    return "<defs>" + A.degradado(id, [[0, A.c("arena")], [1, A.c("cerro-cerca")]]) + "</defs>" +
      '<path d="M0 ' + y + " C300 " + (y - 20) + " 600 " + (y + 15) + " 900 " + (y - 5) + " S1400 " + (y - 15) + " 1600 " + y +
      ' V900 H0Z" fill="url(#' + id + ')"/>';
  };

  A.piedras = function (semilla, y0, n) {
    var r = A.azar(semilla);
    var s = '<g fill="' + A.c("cerro-cerca") + '" opacity=".8">';
    for (var i = 0; i < n; i++) {
      var x = r() * 1600, y = y0 + r() * (900 - y0), w = 8 + r() * 26;
      s += '<ellipse cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" rx="' + w.toFixed(0) + '" ry="' + (w * 0.45).toFixed(0) + '"/>';
    }
    return s + "</g>";
  };

  A.cactus = function (x, y, e) {
    e = e || 1;
    return '<g transform="translate(' + x + " " + y + ") scale(" + e + ')" fill="' + A.c("ropa-1") + '" opacity=".75">' +
      '<rect x="-14" y="-170" width="28" height="170" rx="14"/>' +
      '<path d="M-14 -80 H-40 a12 12 0 0 1 -12 -12 V-130 a10 10 0 0 1 20 0 V-100 H-14Z"/>' +
      '<path d="M14 -100 H38 a12 12 0 0 0 12 -12 V-140 a10 10 0 0 0 -20 0 V-120 H14Z"/></g>';
  };

  // Texto SVG en varias líneas.
  A.textoLineas = function (lineas, x, y, tam, color, extra) {
    var s = '<text x="' + x + '" y="' + y + '" font-size="' + tam + '" fill="' + color + '" font-family="Segoe Print, Comic Sans MS, cursive"' + (extra || "") + ">";
    lineas.forEach(function (l, i) {
      s += '<tspan x="' + x + '" dy="' + (i === 0 ? 0 : tam * 1.25) + '">' + l + "</tspan>";
    });
    return s + "</text>";
  };

  A.registrarEscena = function (id, fn) { A._escenas[id] = fn; };

  A.escena = function (id, estado) {
    var fn = A._escenas[id];
    if (!fn) return A.svg(A.cieloNoche() + '<text x="800" y="450" fill="#fff" font-size="40" text-anchor="middle">Escena sin arte: ' + id + "</text>");
    return A.svg(fn(estado || CA.estado, function (b) { return !!(estado && estado.banderas && estado.banderas[b]); }));
  };
})(window.CA);
