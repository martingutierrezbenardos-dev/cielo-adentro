/* Baldosas de terreno y objetos de decorado (muebles, edificios, cielo…).
   Leyenda de terreno (ver README):
     Exteriores: .  arena        ,  arena con piedritas   =  asfalto       -  asfalto con línea
                 :  tierra       ^  roca (alto)           #  pared de roca  _  pirca / baranda
                 a b c  cielo (alto, medio, horizonte)    m  cerros lejanos
                 t  tierra del patio   f  cerca de palos  A  muro de adobe
     Interiores: W  muro alto    w  muro bajo   o  piso de madera   p  piso metálico
                 k  piso oscuro  s  cúpula con estrellas   z  piso de sueño
                 r  alfombra     d  salida (felpudo)       D  puerta (pasable)
                 x  vacío (negro) */
(function (CA) {
  "use strict";

  var P = CA.Pixel;
  var C = P.col;
  var T = P.TILE;

  function R(x, a, b, w, h, col) { x.fillStyle = col; x.fillRect(a, b, w, h); }

  /* ---------- Cielos ---------- */
  var CIELOS = {
    noche: { a: C.noche1, b: C.noche2, c: C.noche3, m: C.roca3, m2: C.muro3 },
    atardecer: { a: C.noche2, b: C.morado, c: C.naranja, m: C.roca2, m2: C.roca3 }
  };

  function estrellas(x, semilla, densidad, frame, alto) {
    var r = P.azar(semilla);
    var n = Math.floor(r() * densidad);
    for (var i = 0; i < n; i++) {
      var sx = Math.floor(r() * 16), sy = Math.floor(r() * (alto || 16));
      var brillante = r() < 0.25;
      var titila = r() < 0.4;
      var col = brillante ? C.blanco : (titila && frame ? C.lila : C.crema);
      R(x, sx, sy, 1, 1, col);
      if (brillante && frame === 0 && sx > 0 && sx < 15 && sy > 0 && sy < 15) {
        R(x, sx - 1, sy, 1, 1, C.lila); R(x, sx + 1, sy, 1, 1, C.lila);
        R(x, sx, sy - 1, 1, 1, C.lila); R(x, sx, sy + 1, 1, 1, C.lila);
      }
    }
  }

  /* Cada tipo de terreno: solido, dibujar(ctx, variante, frame, modo). */
  var TERRENO = {
    ".": { dibujar: function (x, v) {
      R(x, 0, 0, 16, 16, C.arena1);
      var r = P.azar(100 + v);
      for (var i = 0; i < 6; i++) R(x, Math.floor(r() * 16), Math.floor(r() * 16), 1, 1, C.arena2);
      if (v === 3) { R(x, 5, 9, 3, 1, C.arena2); R(x, 6, 8, 1, 1, C.arena2); }
    } },
    ",": { dibujar: function (x, v) {
      TERRENO["."].dibujar(x, v);
      if (v % 2) {
        // coirón (pasto seco)
        R(x, 4, 8, 1, 4, C.ambar); R(x, 6, 7, 1, 5, C.arena2); R(x, 8, 8, 1, 4, C.ambar); R(x, 5, 10, 3, 2, C.arena3);
      } else {
        R(x, 3, 10, 4, 3, C.roca1); R(x, 4, 9, 2, 1, C.roca1); R(x, 3, 12, 4, 1, C.roca2);
        R(x, 10, 5, 2, 2, C.roca1); R(x, 10, 6, 2, 1, C.roca2);
      }
    } },
    "=": { dibujar: function (x, v) {
      R(x, 0, 0, 16, 16, C.asfalto);
      var r = P.azar(200 + v);
      for (var i = 0; i < 5; i++) R(x, Math.floor(r() * 16), Math.floor(r() * 16), 1, 1, C.asfalto2);
    } },
    "-": { dibujar: function (x, v) {
      TERRENO["="].dibujar(x, v);
      R(x, 2, 7, 8, 2, C.ambar);
    } },
    ":": { dibujar: function (x, v) {
      R(x, 0, 0, 16, 16, C.arena2);
      var r = P.azar(300 + v);
      for (var i = 0; i < 7; i++) R(x, Math.floor(r() * 16), Math.floor(r() * 16), 1, 1, C.arena3);
      for (var j = 0; j < 3; j++) R(x, Math.floor(r() * 16), Math.floor(r() * 16), 1, 1, C.arena1);
    } },
    "t": { dibujar: function (x, v) {
      R(x, 0, 0, 16, 16, C.arena2);
      var r = P.azar(350 + v);
      for (var i = 0; i < 5; i++) R(x, Math.floor(r() * 16), Math.floor(r() * 16), 2, 1, C.madera2);
      if (v === 2) { R(x, 9, 4, 1, 1, C.ambar); R(x, 11, 6, 1, 1, C.ambar); R(x, 4, 12, 1, 1, C.ambar); }
    } },
    "^": { solido: true, dibujar: function (x, v) {
      R(x, 0, 0, 16, 16, C.roca1);
      R(x, 0, 0, 16, 2, C.arena2);
      var r = P.azar(400 + v);
      for (var i = 0; i < 4; i++) R(x, Math.floor(r() * 14), 3 + Math.floor(r() * 12), 3, 1, C.roca2);
    } },
    "#": { solido: true, dibujar: function (x, v) {
      R(x, 0, 0, 16, 16, C.roca2);
      R(x, 0, 0, 16, 1, C.roca1);
      R(x, 0, 15, 16, 1, C.roca3);
      R(x, (v * 5) % 12, 4, 1, 8, C.roca3); R(x, (v * 7 + 6) % 14, 2, 1, 6, C.roca3);
      R(x, 3, 10, 4, 1, C.roca1);
    } },
    "_": { solido: true, mostrador: true, dibujar: function (x, v) {
      TERRENO["."].dibujar(x, v);
      // pirca: muro bajo de piedras
      R(x, 0, 6, 16, 9, C.roca2);
      R(x, 0, 5, 16, 1, C.negro);
      R(x, 0, 15, 16, 1, C.roca3);
      R(x, 1, 6, 6, 4, C.roca1); R(x, 9, 6, 6, 4, C.roca1); R(x, 4, 10, 7, 4, C.roca1);
      R(x, 1, 9, 6, 1, C.roca3); R(x, 9, 9, 6, 1, C.roca3); R(x, 4, 13, 7, 1, C.roca3);
    } },
    "a": { solido: true, cielo: "a", dibujar: function (x, v, f, modo) {
      R(x, 0, 0, 16, 16, CIELOS[modo].a);
      estrellas(x, 500 + v, 5, f);
    } },
    "b": { solido: true, cielo: "b", dibujar: function (x, v, f, modo) {
      R(x, 0, 0, 16, 16, CIELOS[modo].b);
      if (modo === "noche") estrellas(x, 600 + v, 4, f);
      else { R(x, 0, 12, 16, 4, CIELOS[modo].a === C.noche2 ? C.lila : C.morado); estrellas(x, 600 + v, 2, f, 10); }
    } },
    "c": { solido: true, cielo: "c", dibujar: function (x, v, f, modo) {
      var cc = CIELOS[modo];
      R(x, 0, 0, 16, 16, cc.c);
      if (modo === "atardecer") { R(x, 0, 0, 16, 5, C.rosa); R(x, 0, 12, 16, 4, C.ambar); }
      else { R(x, 0, 0, 16, 6, C.noche2); estrellas(x, 700 + v, 2, f, 8); R(x, 0, 13, 16, 3, C.morado); }
    } },
    "m": { solido: true, dibujar: function (x, v, f, modo, tx) {
      var cc = CIELOS[modo];
      R(x, 0, 0, 16, 16, modo === "atardecer" ? C.ambar : C.morado);
      // silueta de cerros: altura según la columna
      for (var i = 0; i < 16; i++) {
        var gx = tx * 16 + i;
        var h = 6 + Math.round(4 * Math.sin(gx / 23) + 3 * Math.sin(gx / 9 + 1) + 1.5 * Math.sin(gx / 4));
        h = Math.max(2, Math.min(14, h));
        R(x, i, 16 - h, 1, h, cc.m);
        R(x, i, 16 - Math.max(1, h - 5), 1, Math.max(1, h - 5), cc.m2);
      }
    } },
    "f": { solido: true, dibujar: function (x, v) {
      TERRENO["t"].dibujar(x, v);
      R(x, 1, 3, 3, 12, C.madera2); R(x, 12, 3, 3, 12, C.madera2);
      R(x, 1, 3, 3, 1, C.madera1); R(x, 12, 3, 3, 1, C.madera1);
      R(x, 0, 6, 16, 2, C.madera1); R(x, 0, 11, 16, 2, C.madera1);
      R(x, 0, 8, 16, 1, C.madera3); R(x, 0, 13, 16, 1, C.madera3);
    } },
    "A": { solido: true, dibujar: function (x, v) {
      R(x, 0, 0, 16, 16, C.arena2);
      R(x, 0, 0, 16, 1, C.arena3);
      for (var f = 0; f < 4; f++) {
        var off = f % 2 ? 4 : 0;
        R(x, 0, f * 4 + 3, 16, 1, C.arena3);
        R(x, off + 6, f * 4, 1, 3, C.arena3);
        R(x, (off + 14) % 16, f * 4, 1, 3, C.arena3);
      }
      if (v === 1) R(x, 4, 5, 3, 2, C.arena1);
    } },

    /* Interiores */
    "W": { solido: true, dibujar: function (x, v, f, modo) {
      var m = modo === "sueno" ? [C.morado, "#5a2c88"] : [C.muro1, C.muro2];
      R(x, 0, 0, 16, 16, m[0]);
      R(x, 3, 0, 2, 16, m[1]); R(x, 11, 0, 2, 16, m[1]);
      if (modo === "sueno") { R(x, (v * 5) % 16, (v * 7) % 16, 1, 1, C.cian); }
    } },
    "w": { solido: true, dibujar: function (x, v, f, modo) {
      var m = modo === "sueno" ? [C.morado, "#5a2c88", C.lila] : [C.muro1, C.muro2, C.muro3];
      R(x, 0, 0, 16, 16, m[0]);
      R(x, 3, 0, 2, 11, m[1]); R(x, 11, 0, 2, 11, m[1]);
      R(x, 0, 11, 16, 5, m[2]);
      R(x, 0, 11, 16, 1, C.negro);
    } },
    "o": { dibujar: function (x, v) {
      R(x, 0, 0, 16, 16, C.piso1);
      R(x, 0, 7, 16, 1, C.piso2); R(x, 0, 15, 16, 1, C.piso2);
      R(x, (v * 5) % 16, 0, 1, 7, C.piso2); R(x, (v * 5 + 8) % 16, 8, 1, 7, C.piso2);
    } },
    "p": { dibujar: function (x, v) {
      R(x, 0, 0, 16, 16, C.gris2);
      R(x, 0, 0, 16, 1, C.gris1); R(x, 0, 0, 1, 16, C.gris1);
      R(x, 15, 0, 1, 16, C.gris3); R(x, 0, 15, 16, 1, C.gris3);
      R(x, 3, 3, 1, 1, C.gris3); R(x, 12, 12, 1, 1, C.gris3);
    } },
    "k": { dibujar: function (x, v) {
      R(x, 0, 0, 16, 16, C.noche1);
      R(x, 0, 15, 16, 1, "#0c1028"); R(x, 15, 0, 1, 16, "#0c1028");
      if (v === 1) R(x, 7, 7, 1, 1, C.noche3);
    } },
    "s": { solido: true, dibujar: function (x, v, f) {
      R(x, 0, 0, 16, 16, C.noche1);
      estrellas(x, 800 + v, 7, f);
    } },
    "z": { dibujar: function (x, v, f, modo, tx, ty) {
      var par = (tx + ty) % 2 === 0;
      R(x, 0, 0, 16, 16, par ? C.noche3 : C.morado);
      R(x, 0, 0, 16, 1, par ? C.lila : C.noche3);
    } },
    "r": { dibujar: function (x, v, f, modo, tx, ty) {
      R(x, 0, 0, 16, 16, C.rojo2);
      R(x, 1, 1, 14, 14, C.rojo);
      R(x, 3, 3, 10, 10, C.rojo2);
      R(x, 6, 6, 4, 4, C.ambar);
    } },
    "d": { dibujar: function (x, v, f, modo) {
      var base = modo === "metal" ? "p" : (modo === "oscuro" ? "k" : "o");
      TERRENO[base].dibujar(x, v);
      R(x, 2, 4, 12, 10, C.verde2);
      R(x, 3, 5, 10, 8, C.verde);
      R(x, 4, 7, 8, 1, C.verde2); R(x, 4, 10, 8, 1, C.verde2);
    } },
    "D": { dibujar: function (x) {
      R(x, 0, 0, 16, 16, C.madera3);
      R(x, 2, 1, 12, 15, C.negro);
      R(x, 3, 2, 10, 14, "#1a1430");
    } },
    "x": { solido: true, dibujar: function (x) { R(x, 0, 0, 16, 16, C.negro); } }
  };

  var VARIANTES = 4;
  P.terreno = function (ch, variante, frame, modo, tx) {
    var t = TERRENO[ch];
    if (!t) return null;
    var animado = !!t.cielo || ch === "s";
    var dep = ch === "m" ? tx : 0; // la silueta depende de la columna
    var clave = "ter-" + ch + "-" + variante + "-" + (animado ? frame : 0) + "-" + (modo || "") + "-" + dep;
    return P.hecha(clave, T, T, function (x) {
      t.dibujar(x, variante, animado ? frame : 0, modo || "noche", tx || 0, 0);
    });
  };
  P.terrenoXY = function (ch, tx, ty, frame, modo) {
    var t = TERRENO[ch];
    if (!t) return null;
    if (ch === "z" || ch === "r") {
      return P.hecha("ter-" + ch + "-" + ((tx + ty) % 2), T, T, function (x) { t.dibujar(x, 0, 0, modo, tx, ty); });
    }
    var v = Math.floor(P.hash(tx, ty, ch.charCodeAt(0)) * VARIANTES);
    var f = (frame + Math.floor(P.hash(ty, tx, 9) * 2)) % 2;
    return P.terreno(ch, v, f, modo, ch === "m" ? tx : 0);
  };
  P.esSolido = function (ch) { return !TERRENO[ch] || !!TERRENO[ch].solido; };
  P.esMostrador = function (ch) { return !!(TERRENO[ch] && TERRENO[ch].mostrador); };

  /* ---------- Objetos de decorado ----------
     w, h: tamaño en baldosas. solido: máscara por baldosa ("#" sólido, "." libre, "m" mostrador
     — se puede hablar a través de él). frames: cuadros de animación. */
  var DECOR = {};
  function decor(id, def) { DECOR[id] = def; }

  decor("cactus", { w: 1, h: 2, solido: [".", "#"], dibujar: function (x) {
    R(x, 6, 4, 5, 28, C.verde2); R(x, 7, 3, 3, 28, C.verde);
    R(x, 1, 12, 5, 3, C.verde2); R(x, 1, 7, 3, 7, C.verde2); R(x, 2, 7, 1, 6, C.verde);
    R(x, 11, 16, 4, 3, C.verde2); R(x, 13, 10, 3, 8, C.verde2); R(x, 13, 10, 1, 7, C.verde);
    R(x, 8, 6, 1, 1, C.crema); R(x, 8, 14, 1, 1, C.crema); R(x, 8, 22, 1, 1, C.crema);
    R(x, 4, 30, 9, 2, C.arena3);
  } });
  decor("piedra", { w: 1, h: 1, solido: ["#"], dibujar: function (x) {
    R(x, 2, 6, 12, 9, C.roca2); R(x, 3, 5, 9, 8, C.roca1); R(x, 5, 6, 3, 2, C.gris1); R(x, 1, 14, 14, 2, C.arena3);
  } });
  decor("letrero", { w: 1, h: 1, solido: ["#"], dibujar: function (x) {
    R(x, 7, 8, 2, 8, C.madera2);
    R(x, 1, 2, 14, 8, C.madera3); R(x, 2, 3, 12, 6, C.madera1);
    R(x, 4, 5, 8, 1, C.madera3); R(x, 4, 7, 6, 1, C.madera3);
  } });
  decor("camioneta", { w: 3, h: 2, solido: ["###", "###"], dibujar: function (x) {
    // vista desde arriba, de costado
    R(x, 1, 6, 46, 20, C.negro);
    R(x, 2, 7, 44, 18, C.rojo);
    R(x, 2, 7, 44, 3, "#f07070");
    R(x, 28, 4, 16, 6, C.negro); R(x, 29, 5, 14, 6, C.rojo2);
    R(x, 31, 6, 10, 3, C.celeste);
    R(x, 4, 10, 22, 12, C.rojo2); R(x, 5, 11, 20, 10, C.madera2);
    R(x, 44, 12, 3, 4, C.ambar);
    R(x, 0, 12, 2, 4, C.rojo2);
    [6, 34].forEach(function (cx) { R(x, cx, 23, 9, 7, C.negro); R(x, cx + 2, 25, 5, 3, C.gris2); });
  } });
  decor("charco", { w: 2, h: 1, solido: ["##"], frames: 4, dibujar: function (x, f) {
    var o = [0, 1, 2, 1][f];
    R(x, 3 - o, 6, 26 + o * 2, 5, C.lila);
    R(x, 5, 5, 22, 7, C.celeste);
    R(x, 8 + o * 2, 7, 10, 1, C.blanco);
    R(x, 14 - o, 9, 8, 1, C.cian);
    R(x, 1, 8, 2, 1, C.cian); R(x, 29, 8, 2, 1, C.cian);
  } });
  decor("luna", { w: 2, h: 2, solido: ["##", "##"], dibujar: function (x) {
    var filas = [
      "..........OOOOOOOOOOOO..........",
      ".......OOOCCCCCCCCCCCCOOO.......",
      ".....OOCCCCCCCCCCCCCCCCCCOO.....",
      "....OCCCCCCCCCCCCCCCCCCCCCCO....",
      "...OCCCCCCCKKKCCCCCCCCCCCCCCO...",
      "..OCCCCCCCKKKKKCCCCCCCCCKKCCCO..",
      "..OCCCCCCCKKKKKCCCCCCCCKKKKCCO..",
      ".OCCCCCCCCCKKKCCCCCCCCCCKKCCCCO.",
      ".OCCCCCCCCCCCCCCCCCCCCCCCCCCCCO.",
      "OCCCCKKCCCCCCCCCCCCCCCCCCCCCCCCO",
      "OCCCKKKKCCCCCCCCCCKKKCCCCCCCCCCO",
      "OCCCKKKKCCCCCCCCCKKKKKCCCCCCCCCO",
      "OCCCCKKCCCCCCCCCCKKKKKCCCCCCCCCO",
      "OCCCCCCCCCCCCCCCCCKKKCCCCCCCCCCO",
      "OCCCCCCCCCCCCCCCCCCCCCCCCCCKKCCO",
      "OCCCCCCCCCKKCCCCCCCCCCCCCCKKKKCO",
      "OCCCCCCCCKKKKCCCCCCCCCCCCCKKKKCO",
      "OCCCCCCCCCKKCCCCCCCCCCCCCCCKKCCO",
      "OCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCO",
      ".OCCCCCCCCCCCCCCCKKCCCCCCCCCCCO.",
      ".OCCCCCKKKCCCCCCKKKKCCCCCCCCCCO.",
      "..OCCCKKKKKCCCCCCKKCCCCCCCCCCO..",
      "..OCCCCKKKCCCCCCCCCCCCCKKCCCCO..",
      "...OCCCCCCCCCCCCCCCCCCKKKKCCO...",
      "....OCCCCCCCCCCCCCCCCCCKKCCO....",
      ".....OOCCCCCCCCCCCCCCCCCCOO.....",
      ".......OOOCCCCCCCCCCCCOOO.......",
      "..........OOOOOOOOOOOO..........",
      "................................",
      "................................",
      "................................",
      "................................"
    ];
    P.dibujar(x, filas, { O: C.ambar, C: C.crema, K: C.arena1 }, 0, 2);
  } });
  decor("observatorio-lejos", { w: 2, h: 1, solido: ["##", ""], dibujar: function (x) {
    R(x, 8, 7, 16, 7, C.gris2);
    R(x, 10, 3, 12, 4, C.gris1); R(x, 12, 2, 8, 1, C.gris1);
    R(x, 15, 3, 2, 4, C.noche2);
    R(x, 11, 10, 2, 2, C.ambar); R(x, 19, 10, 2, 2, C.ambar);
  } });
  decor("cupula", { w: 4, h: 4, solido: ["####", "####", "####", "#.##"], dibujar: function (x) {
    // muro cilíndrico
    R(x, 2, 26, 60, 38, C.gris3);
    R(x, 3, 27, 58, 36, C.gris2);
    R(x, 3, 27, 58, 4, C.gris1);
    for (var i = 0; i < 6; i++) R(x, 6 + i * 10, 31, 1, 30, C.gris3);
    // cúpula
    var filas = [
      "............OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO............",
      "........OOOOWWWWWWWWWWWWWWWWWWKKKKWWWWWWWWWWWWWWWWWWOOOO........",
      "......OOWWWWWWWWWWWWWWWWWWWWWWKKKKWWWWWWWWWWWWWWWWWWWWWWOO......",
      ".....OWWWWWWWWWWWWWWWWWWWWWWWWKKKKWWWWWWWWWWWWWWWWWWWWWWWWO.....",
      "....OWWWWWWWWWWWWWWWWWWWWWWWWWKKKKWWWWWWWWWWWWWWWWWWWWWWWWWO....",
      "...OWWWWWWWWWWWWWWWWWWWWWWWWWWKKKKWWWWWWWWWWWWWWWWWWWWWWWWWWO...",
      "..OWWWWWWWWWWWWWWWWWWWWWWWWWWWKKKKWWWWWWWWWWWWWWWWWWWWWWWWWWWO..",
      "..OWWWWWWWWWWWWWWWWWWWWWWWWWWWKKKKWWWWWWWWWWWWWWWWWWWWWWWWWWWO..",
      ".OWWWWWWWWWWWWWWWWWWWWWWWWWWWWKKKKWWWWWWWWWWWWWWWWWWWWWWWWWWWWO.",
      ".OWWWWWWWWWWWWWWWWWWWWWWWWWWWWKKKKWWWWWWWWWWWWWWWWWWWWWWWWWWWWO.",
      ".OWWWWWWWWWWWWWWWWWWWWWWWWWWWWKKKKWWWWWWWWWWWWWWWWWWWWWWWWWWWWO.",
      "OGWWWWWWWWWWWWWWWWWWWWWWWWWWWWKKKKWWWWWWWWWWWWWWWWWWWWWWWWWWWWGO",
      "OGGWWWWWWWWWWWWWWWWWWWWWWWWWWWKKKKWWWWWWWWWWWWWWWWWWWWWWWWWWWGGO",
      "OGGGWWWWWWWWWWWWWWWWWWWWWWWWWWKKKKWWWWWWWWWWWWWWWWWWWWWWWWWWGGGO",
      "OGGGGGWWWWWWWWWWWWWWWWWWWWWWWWKKKKWWWWWWWWWWWWWWWWWWWWWWWGGGGGGO",
      "OGGGGGGGGGWWWWWWWWWWWWWWWWWWWWKKKKWWWWWWWWWWWWWWWWWWWGGGGGGGGGGO",
      "OGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGO",
      "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO"
    ];
    P.dibujar(x, filas, { O: C.negro, W: C.gris1, G: C.gris2, K: C.noche2 }, 0, 9);
    // puerta (columna 1 de la última fila)
    R(x, 18, 46, 12, 18, C.negro); R(x, 19, 47, 10, 17, C.madera2); R(x, 20, 48, 8, 16, C.madera1);
    R(x, 26, 56, 1, 2, C.ambar);
    R(x, 17, 44, 14, 2, C.gris1);
    // ventanitas iluminadas
    R(x, 40, 40, 6, 5, C.negro); R(x, 41, 41, 4, 3, C.ambar);
    R(x, 50, 40, 6, 5, C.negro); R(x, 51, 41, 4, 3, C.ambar);
    R(x, 6, 40, 6, 5, C.negro); R(x, 7, 41, 4, 3, C.ambar);
  } });
  decor("casa", { w: 4, h: 3, solido: ["####", "####", "##.#"], dibujar: function (x) {
    // techo de calamina
    R(x, 0, 2, 64, 16, C.negro);
    R(x, 1, 3, 62, 14, C.gris2);
    for (var i = 0; i < 16; i++) R(x, 2 + i * 4, 3, 1, 14, C.gris3);
    R(x, 1, 3, 62, 2, C.gris1);
    // muro de adobe
    R(x, 2, 17, 60, 31, C.negro);
    R(x, 3, 17, 58, 30, C.arena2);
    for (var f = 0; f < 7; f++) {
      R(x, 3, 21 + f * 4, 58, 1, C.arena3);
      for (var k = 0; k < 8; k++) R(x, 5 + k * 8 + (f % 2) * 4, 17 + f * 4, 1, 4, C.arena3);
    }
    // ventana con luz
    R(x, 8, 24, 14, 11, C.negro); R(x, 9, 25, 12, 9, C.ambar); R(x, 15, 25, 1, 9, C.madera2); R(x, 9, 29, 12, 1, C.madera2);
    // puerta (columna 2 de la fila de abajo)
    R(x, 34, 30, 12, 18, C.negro); R(x, 35, 31, 10, 17, C.madera2); R(x, 36, 32, 8, 16, C.madera1); R(x, 42, 39, 1, 2, C.ambar);
    // macetero
    R(x, 50, 40, 8, 7, C.rojo2); R(x, 49, 36, 10, 4, C.verde); R(x, 52, 34, 4, 2, C.verde2);
  } });
  decor("campo-salar", { w: 3, h: 2, solido: ["###", "###"], frames: 2, dibujar: function (x, f, est) {
    var pts = [[6, 8], [14, 4], [22, 12], [31, 6], [37, 15], [26, 22], [12, 20]];
    // líneas tenues de la constelación
    x.fillStyle = C.noche3;
    for (var i = 0; i < pts.length - 1; i++) {
      var a = pts[i], b = pts[i + 1];
      var n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
      for (var k = 1; k < n; k += 2) x.fillRect(Math.round(a[0] + (b[0] - a[0]) * k / n), Math.round(a[1] + (b[1] - a[1]) * k / n), 1, 1);
    }
    pts.forEach(function (p, j) {
      var nova = est && est.nova && j === 4;
      if (nova) {
        R(x, p[0] - 1, p[1] - 1, 3, 3, C.blanco);
        R(x, p[0] - 4 - f, p[1], 9 + f * 2, 1, C.ambar); R(x, p[0], p[1] - 4 - f, 1, 9 + f * 2, C.ambar);
        R(x, p[0] - 2, p[1] - 2, 1, 1, C.cian); R(x, p[0] + 2, p[1] + 2, 1, 1, C.cian);
        R(x, p[0] + 2, p[1] - 2, 1, 1, C.cian); R(x, p[0] - 2, p[1] + 2, 1, 1, C.cian);
      } else {
        R(x, p[0], p[1], 1, 1, C.blanco);
        if (j % 2 === f) { R(x, p[0] - 1, p[1], 1, 1, C.lila); R(x, p[0] + 1, p[1], 1, 1, C.lila); }
      }
    });
  } });

  /* Interiores */
  decor("cama", { w: 1, h: 2, solido: ["#", "#"], dibujar: function (x) {
    R(x, 0, 0, 16, 32, C.negro);
    R(x, 1, 1, 14, 30, C.madera2);
    R(x, 2, 2, 12, 7, C.blanco); R(x, 2, 8, 12, 1, C.gris1);
    R(x, 2, 10, 12, 19, C.azul); R(x, 2, 10, 12, 2, C.celeste);
    R(x, 2, 16, 12, 1, C.azul2); R(x, 2, 22, 12, 1, C.azul2);
  } });
  decor("escritorio", { w: 3, h: 1, solido: ["mmm"], dibujar: function (x) {
    R(x, 0, 2, 48, 13, C.negro);
    R(x, 1, 3, 46, 7, C.madera1); R(x, 1, 10, 46, 4, C.madera2);
    R(x, 3, 14, 3, 2, C.madera3); R(x, 42, 14, 3, 2, C.madera3);
  } });
  decor("mesa", { w: 1, h: 1, solido: ["m"], dibujar: function (x) {
    R(x, 0, 2, 16, 13, C.negro);
    R(x, 1, 3, 14, 7, C.madera1); R(x, 1, 10, 14, 4, C.madera2);
    R(x, 2, 14, 2, 2, C.madera3); R(x, 12, 14, 2, 2, C.madera3);
  } });
  decor("libro", { w: 1, h: 1, solido: [""], dibujar: function (x) {
    R(x, 2, 2, 12, 8, C.negro); R(x, 3, 3, 5, 6, C.crema); R(x, 8, 3, 5, 6, C.blanco);
    R(x, 4, 4, 3, 1, C.gris2); R(x, 9, 4, 3, 1, C.gris2); R(x, 4, 6, 3, 1, C.gris2); R(x, 9, 6, 3, 1, C.gris2);
    R(x, 5, 1, 2, 2, C.rosa); R(x, 10, 1, 2, 2, C.ambar); R(x, 12, 6, 2, 1, C.turquesa);
  } });
  decor("vaso", { w: 1, h: 1, solido: [""], dibujar: function (x) {
    R(x, 5, 0, 6, 10, C.negro); R(x, 6, 1, 4, 8, C.celeste); R(x, 6, 1, 4, 2, C.cian);
    R(x, 9, -2, 1, 6, C.rosa); R(x, 8, 3, 1, 5, C.rosa);
  } });
  decor("ventana", { w: 2, h: 2, solido: ["##", "##"], frames: 2, dibujar: function (x, f) {
    R(x, 2, 2, 28, 24, C.negro);
    R(x, 4, 4, 24, 20, C.noche1);
    var e = [[7, 7], [12, 15], [20, 6], [24, 18], [16, 10], [9, 20], [26, 9]];
    e.forEach(function (p, i) { R(x, p[0], p[1], 1, 1, (i + f) % 3 ? C.crema : C.blanco); });
    R(x, 15, 4, 2, 20, C.madera2); R(x, 4, 13, 24, 2, C.madera2);
    R(x, 2, 26, 28, 3, C.madera1);
  } });
  decor("cuadro", { w: 1, h: 1, solido: ["#"], dibujar: function (x) {
    R(x, 2, 2, 12, 10, C.madera3); R(x, 3, 3, 10, 8, C.crema);
    R(x, 4, 8, 8, 2, C.gris2); R(x, 6, 5, 4, 3, C.gris2); R(x, 7, 4, 2, 1, C.gris1);
  } });
  decor("planta", { w: 1, h: 1, solido: ["#"], dibujar: function (x) {
    R(x, 4, 10, 8, 6, C.rojo2); R(x, 5, 10, 6, 1, C.rojo);
    R(x, 3, 2, 4, 8, C.verde); R(x, 9, 1, 4, 9, C.verde); R(x, 6, 4, 4, 7, C.verde2);
  } });
  decor("silla", { w: 1, h: 1, solido: ["#"], dibujar: function (x) {
    R(x, 3, 1, 10, 8, C.negro); R(x, 4, 2, 8, 6, C.madera2);
    R(x, 3, 8, 10, 4, C.negro); R(x, 4, 9, 8, 2, C.madera1);
    R(x, 4, 12, 2, 4, C.madera3); R(x, 10, 12, 2, 4, C.madera3);
  } });
  decor("estante", { w: 2, h: 1, solido: ["##"], dibujar: function (x) {
    R(x, 0, -8, 32, 24, C.negro);
    R(x, 1, -7, 30, 22, C.madera2);
    var cols = [C.rojo, C.azul, C.verde, C.ambar, C.lila, C.rojo2, C.turquesa, C.crema];
    for (var i = 0; i < 8; i++) { R(x, 3 + i * 3, -5, 2, 8, cols[i]); R(x, 3 + i * 3, 5, 2, 8, cols[(i + 3) % 8]); }
    R(x, 1, 3, 30, 2, C.madera1);
  } });

  decor("telescopio", { w: 2, h: 3, solido: ["##", "##", "##"], dibujar: function (x) {
    // base
    R(x, 6, 34, 20, 12, C.negro); R(x, 7, 35, 18, 10, C.gris3); R(x, 7, 35, 18, 2, C.gris2);
    R(x, 13, 22, 6, 14, C.gris3); R(x, 14, 22, 4, 13, C.gris2);
    // tubo inclinado
    for (var i = 0; i < 22; i++) {
      R(x, 4 + i, 24 - i, 9, 4, C.negro);
    }
    for (var j = 0; j < 22; j++) {
      R(x, 5 + j, 24 - j, 7, 2, C.blanco);
      R(x, 5 + j, 26 - j, 7, 1, C.gris1);
    }
    R(x, 24, 0, 8, 6, C.negro); R(x, 25, 1, 6, 4, C.noche3);
    R(x, 2, 24, 6, 6, C.negro); R(x, 3, 25, 4, 4, C.gris2);
  } });
  decor("consola", { w: 2, h: 1, solido: ["mm"], frames: 2, dibujar: function (x, f, est) {
    R(x, 0, 0, 32, 16, C.negro);
    R(x, 1, 1, 30, 14, C.gris3);
    R(x, 3, 2, 26, 9, C.negro);
    R(x, 4, 3, 24, 7, C.noche1);
    for (var i = 0; i < 7; i++) {
      var y = 4 + i;
      if (est && est.nova && i === 4) {
        R(x, 4, y, 14, 1, C.rojo); for (var k = 0; k < 6; k++) R(x, 18 + k, y - k, 2, 1, C.rojo);
      } else R(x, 4, Math.min(9, y), 24, 1, [C.turquesa, C.verde, C.ambar, C.celeste, C.lila, C.rosa, C.cian][i]);
    }
    R(x, 5, 12, 3, 2, f ? C.verde : C.verde2); R(x, 10, 12, 3, 2, C.ambar); R(x, 24, 12, 4, 2, C.rojo);
  } });
  decor("cuaderno-rojo", { w: 1, h: 1, solido: [""], dibujar: function (x) {
    R(x, 3, 2, 10, 9, C.negro); R(x, 4, 3, 8, 7, C.rojo); R(x, 4, 3, 2, 7, C.rojo2); R(x, 7, 5, 4, 1, C.crema);
  } });
  function pizarra(x, modo) {
    R(x, 0, 0, 32, 16, C.madera3);
    R(x, 1, 1, 30, 13, C.verde2);
    R(x, 1, 14, 30, 2, C.madera1);
    if (modo === "vacia") { R(x, 4, 4, 8, 1, C.gris2); R(x, 20, 9, 6, 1, C.gris2); }
    if (modo === "ley" || modo === "tachada") {
      R(x, 3, 3, 18, 1, C.blanco); R(x, 3, 6, 24, 1, C.blanco); R(x, 3, 9, 14, 1, C.blanco);
    }
    if (modo === "tachada") {
      for (var i = 0; i < 26; i++) R(x, 3 + i, 2 + Math.floor(i / 3), 1, 1, C.rojo);
      R(x, 25, 3, 3, 1, C.ambar); R(x, 27, 4, 1, 2, C.ambar); R(x, 26, 6, 1, 2, C.ambar); R(x, 26, 10, 1, 1, C.ambar);
    }
    if (modo === "sueno") {
      R(x, 3, 4, 26, 1, C.blanco); R(x, 3, 8, 20, 1, C.blanco);
      R(x, 26, 7, 3, 3, C.ambar);
    }
  }
  decor("pizarra", { w: 2, h: 1, solido: ["##"], dibujar: function (x) { pizarra(x, "vacia"); } });
  decor("pizarra-ley", { w: 2, h: 1, solido: ["##"], dibujar: function (x) { pizarra(x, "ley"); } });
  decor("pizarra-tachada", { w: 2, h: 1, solido: ["##"], dibujar: function (x) { pizarra(x, "tachada"); } });
  decor("pizarra-sueno", { w: 2, h: 1, solido: ["##"], dibujar: function (x) { pizarra(x, "sueno"); } });
  decor("puerta-cerrada", { w: 1, h: 1, solido: ["#"], dibujar: function (x) {
    R(x, 0, 0, 16, 16, C.negro); R(x, 1, 1, 14, 15, C.madera2); R(x, 2, 2, 12, 14, C.madera1);
    R(x, 4, 4, 8, 4, C.madera2); R(x, 4, 10, 8, 4, C.madera2); R(x, 11, 8, 2, 2, C.ambar);
  } });
  decor("puerta", { w: 1, h: 1, solido: ["#"], dibujar: function (x) { DECOR["puerta-cerrada"].dibujar(x); } });
  decor("archivador", { w: 2, h: 2, solido: ["##", "##"], dibujar: function (x) {
    R(x, 1, 0, 30, 32, C.negro);
    R(x, 2, 1, 28, 30, C.gris2);
    for (var i = 0; i < 4; i++) {
      R(x, 3, 2 + i * 7, 26, 6, C.gris1);
      R(x, 13, 4 + i * 7, 6, 2, C.gris3);
      R(x, 4, 3 + i * 7, 4, 2, C.crema);
    }
  } });
  decor("computador", { w: 1, h: 1, solido: [""], frames: 2, dibujar: function (x, f) {
    R(x, 1, 0, 14, 11, C.negro); R(x, 2, 1, 12, 9, C.gris1); R(x, 3, 2, 10, 6, C.noche1);
    for (var i = 0; i < 3; i++) R(x, 4, 3 + i * 2, 8, 1, f ? C.verde : C.turquesa);
    R(x, 6, 10, 4, 3, C.gris3); R(x, 3, 13, 10, 2, C.gris2);
  } });
  decor("bitacora", { w: 1, h: 1, solido: [""], dibujar: function (x) {
    R(x, 2, 3, 12, 9, C.negro); R(x, 3, 4, 10, 7, C.madera1); R(x, 3, 4, 10, 1, C.madera2);
    R(x, 5, 6, 6, 1, C.crema); R(x, 5, 8, 4, 1, C.crema);
  } });
  decor("proyector", { w: 2, h: 2, solido: ["##", "##"], frames: 2, dibujar: function (x, f) {
    R(x, 13, 14, 6, 14, C.gris3); R(x, 6, 26, 20, 6, C.negro); R(x, 7, 27, 18, 4, C.gris2);
    [[2, 4], [20, 4]].forEach(function (p) {
      R(x, p[0], p[1], 10, 10, C.negro); R(x, p[0] + 1, p[1] + 1, 8, 8, C.gris3);
      R(x, p[0] + 2, p[1] + 2, 2, 2, f ? C.blanco : C.ambar); R(x, p[0] + 6, p[1] + 3, 1, 1, C.crema);
      R(x, p[0] + 4, p[1] + 6, 1, 1, f ? C.ambar : C.blanco); R(x, p[0] + 7, p[1] + 7, 1, 1, C.crema);
    });
    R(x, 11, 8, 10, 4, C.gris2);
  } });
  decor("butaca", { w: 1, h: 1, solido: ["#"], dibujar: function (x) {
    R(x, 2, 1, 12, 14, C.negro); R(x, 3, 2, 10, 7, C.rojo2); R(x, 3, 9, 10, 4, C.rojo); R(x, 1, 7, 2, 7, C.rojo2); R(x, 13, 7, 2, 7, C.rojo2);
  } });
  decor("reloj", { w: 1, h: 1, solido: ["#"], frames: 4, dibujar: function (x, f) {
    var dy = [0, -1, -2, -1][f];
    R(x, 4, 13, 8, 2, "#2a1a50");
    R(x, 3, 1 + dy, 10, 10, C.negro); R(x, 4, 2 + dy, 8, 8, C.crema);
    R(x, 7, 3 + dy, 1, 3, C.negro); R(x, 8, 6 + dy, 2, 1, C.negro);
    R(x, 5, 0 + dy, 2, 1, C.ambar); R(x, 9, 0 + dy, 2, 1, C.ambar);
  } });
  decor("espejo", { w: 1, h: 2, solido: ["#", "#"], frames: 2, dibujar: function (x, f) {
    R(x, 2, 2, 12, 28, C.ambar); R(x, 3, 3, 10, 26, C.madera1);
    R(x, 4, 4, 8, 24, C.celeste); R(x, 5 + f, 6, 1, 8, C.blanco); R(x, 7 + f, 8, 1, 4, C.blanco);
  } });
  decor("luz", { w: 1, h: 1, solido: ["#"], frames: 4, dibujar: function (x, f) {
    var r = [6, 7, 8, 7][f];
    R(x, 8 - r, 7, r * 2, 2, C.crema); R(x, 7, 8 - r, 2, r * 2, C.crema);
    R(x, 4, 4, 8, 8, C.ambar); R(x, 5, 5, 6, 6, C.crema); R(x, 6, 6, 4, 4, C.blanco);
  } });
  decor("gallinero", { w: 3, h: 2, solido: ["###", "###"], dibujar: function (x) {
    R(x, 0, 2, 48, 10, C.negro); R(x, 1, 3, 46, 8, C.rojo2); R(x, 1, 3, 46, 2, C.rojo);
    R(x, 3, 12, 42, 20, C.negro); R(x, 4, 12, 40, 19, C.madera1);
    for (var i = 0; i < 6; i++) R(x, 4 + i * 7, 12, 1, 19, C.madera2);
    R(x, 18, 20, 12, 12, C.negro); R(x, 19, 21, 10, 11, "#2a1608");
    R(x, 15, 29, 18, 3, C.madera2);
  } });
  decor("fogon", { w: 1, h: 1, solido: ["m"], frames: 3, dibujar: function (x, f) {
    R(x, 1, 10, 14, 6, C.roca2); R(x, 2, 11, 12, 4, C.roca1);
    var llamas = [[5, 9, 2, 3], [8, 8, 2, 4], [11, 9, 1, 3]];
    llamas.forEach(function (l, i) { R(x, l[0], l[1] - ((f + i) % 2), l[2], l[3], (f + i) % 3 ? C.naranja : C.ambar); });
    R(x, 2, 1, 12, 8, C.negro); R(x, 3, 2, 10, 6, C.gris3); R(x, 3, 2, 10, 1, C.gris2);
    R(x, 1, 3, 2, 1, C.negro); R(x, 13, 3, 2, 1, C.negro);
    R(x, 6, 0, 1, 1, C.gris1); R(x, 9, -1 + f % 2, 1, 1, C.gris1);
  } });
  decor("ventana-adobe", { w: 1, h: 1, solido: ["#"], dibujar: function (x) {
    TERRENO.A.dibujar(x, 0);
    R(x, 3, 3, 10, 9, C.negro); R(x, 4, 4, 8, 7, C.ambar); R(x, 7, 4, 1, 7, C.madera2);
  } });
  decor("tablero-estrellas", { w: 2, h: 1, solido: ["##"], dibujar: function (x) {
    R(x, 1, 1, 30, 14, C.negro); R(x, 2, 2, 28, 12, C.noche2);
    [[5, 5], [9, 8], [14, 4], [19, 10], [24, 6], [27, 11]].forEach(function (p) { R(x, p[0], p[1], 1, 1, C.crema); });
  } });

  ["gallina-blanca", "gallina-cafe"].forEach(function (id, i) {
    decor(id, { w: 1, h: 1, solido: ["#"], frames: 2, dibujar: function (x, f) {
      x.drawImage(P.personaje(id, i ? "der" : "izq", f), 0, -2);
    } });
  });

  P.decor = DECOR;

  /* Imagen de un decorado (cuadro de animación f). Algunos dependen del estado (nova). */
  P.imagenDecor = function (id, f, est) {
    var d = DECOR[id];
    if (!d) return null;
    var frame = (d.frames ? f % d.frames : 0);
    var extra = est && est.nova ? "-n" : "";
    return P.hecha("dec-" + id + "-" + frame + extra, d.w * T, d.h * T, function (x) { d.dibujar(x, frame, est); });
  };
})(window.CA);

/* Portada: una pequeña escena del observatorio de noche, armada con las mismas baldosas. */
(function (CA) {
  "use strict";
  var P = CA.Pixel;
  var T = P.TILE;
  var FILAS = [
    "aaaaaaaaaaaaaaa",
    "aaaaaaaaaaaaaaa",
    "aaaaaaaaaaaaaaa",
    "bbbbbbbbbbbbbbb",
    "ccccccccccccccc",
    "mmmmmmmmmmmmmmm",
    ".,....,....,...",
    "...,......,..,.",
    ".,.....,.......",
    "....,.....,..,."
  ];
  var OBJ = [["campo-salar", 10, 1], ["cupula", 2, 5], ["casa", 9, 6], ["cactus", 7, 7], ["cactus", 14, 8], ["piedra", 0, 9]];
  P.portada = function (ctx, frame) {
    FILAS.forEach(function (f, y) {
      for (var x = 0; x < f.length; x++) P.dib(ctx, P.terrenoXY(f[x], x, y, frame, "noche"), x * T, y * T);
    });
    OBJ.forEach(function (o) {
      var im = P.imagenDecor(o[0], frame, {});
      if (im) P.dib(ctx, im, o[1] * T, o[2] * T);
    });
  };
})(window.CA);
