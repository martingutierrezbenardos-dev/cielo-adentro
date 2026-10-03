/* Sprites de personajes (16×16, 4 direcciones, 2 cuadros de caminata) y retratos.
   Todos comparten una misma plantilla de cuerpo; cada personaje cambia colores
   y agrega detalles (gorra, sombrero, anteojos, pelo largo, peluca…). */
(function (CA) {
  "use strict";

  var P = CA.Pixel;
  var C = P.col;

  /* ---------- Plantillas ---------- */
  var BASE = {
    abajo: [
      "................",
      "....OOOOOOOO....",
      "...OHHHHHHHHO...",
      "..OHHHHHHHHHHO..",
      "..OHHHHHHHHHHO..",
      "..OHHSSSSSSHHO..",
      "..OHSSSSSSSSHO..",
      "..OHSESSSSESHO..",
      "...OSSSSSSSSO...",
      "....OOSSSSOO....",
      "...OCCCCCCCCO...",
      "..OSCCCCCCCCSO..",
      "..OSOCCCCCCOSO..",
      "...OOPPPPPPOO...",
      "....OPPOOPPO....",
      "....OZZOOZZO...."
    ],
    arriba: [
      "................",
      "....OOOOOOOO....",
      "...OHHHHHHHHO...",
      "..OHHHHHHHHHHO..",
      "..OHHHHHHHHHHO..",
      "..OHHHHHHHHHHO..",
      "..OHHHHHHHHHHO..",
      "..OhHHHHHHHHhO..",
      "...OhhhhhhhhO...",
      "....OOSSSSOO....",
      "...OCCCCCCCCO...",
      "..OSCCCCCCCCSO..",
      "..OSOCCCCCCOSO..",
      "...OOPPPPPPOO...",
      "....OPPOOPPO....",
      "....OZZOOZZO...."
    ],
    izq: [
      "................",
      ".....OOOOOOO....",
      "....OHHHHHHHO...",
      "...OHHHHHHHHHO..",
      "...OHHHHHHHHHO..",
      "..OSSHHHHHHHHO..",
      "..OSSSSSHHHHHO..",
      "..OESSSSSHHHhO..",
      "...OSSSSSShhO...",
      "....OOSSSOOO....",
      ".....OCCCCO.....",
      "....OCCCSCO.....",
      "....OCCCSCO.....",
      ".....OPPPPO.....",
      ".....OPPPO......",
      ".....OZZZO......"
    ]
  };
  // Piernas para el cuadro de caminata (filas 13 a 15).
  var PASO = {
    abajo: ["...OOPPPPPPOO...", "....OPPOOPPO....", "....OZZO.OOO...."],
    arriba: ["...OOPPPPPPOO...", "....OPPOOPPO....", "....OOO..OZZO..."],
    izq: [".....OPPPPO.....", "....OPPOOPPO....", "....OZZO.OZZO..."]
  };

  function copia(filas) { return filas.map(function (f) { return f.split(""); }); }
  // Escribe texto en una fila desde una columna; "_" deja el píxel como estaba.
  function pon(g, fila, texto, desde) {
    desde = desde || 0;
    for (var i = 0; i < texto.length; i++) {
      if (texto[i] !== "_") g[fila][desde + i] = texto[i];
    }
  }

  /* ---------- Personajes ---------- */
  var ECO = { O: "#1c6c78", H: "#1f8a84", h: "#16706c", S: C.cian, s: C.turquesa, E: "#1c6c78", C: "#58d8c8", c: "#2c9c94", P: "#2c9c94", Z: "#1c6c78", W: C.blanco, M: "#2c9c94", G: C.turquesa, g: "#2c9c94" };
  var ECO_HUME = {};
  Object.keys(ECO).forEach(function (k) { ECO_HUME[k] = ECO[k]; });
  ECO_HUME.H = "#e0fff8"; ECO_HUME.h = "#9ee8dc"; ECO_HUME.C = C.turquesa; ECO_HUME.c = "#2c9c94";

  var PERSONAJES = {
    tu: {
      colores: { O: C.negro, H: C.pelo1, h: "#24140c", S: C.piel1, E: C.negro, C: C.azul, c: C.azul2, P: C.gris3, Z: C.rojo2, G: C.rojo, g: C.rojo2, W: C.blanco },
      detalle: function (g, dir) {
        if (dir === "abajo") {
          pon(g, 2, "...OGGGGGGGGO...");
          pon(g, 3, "..OGGGGWWGGGGO..");
          pon(g, 4, "..OggggggggggO..");
        } else if (dir === "arriba") {
          pon(g, 2, "...OGGGGGGGGO...");
          pon(g, 3, "..OGGGGGGGGGGO..");
          pon(g, 4, "..OGGGGGGGGGGO..");
          pon(g, 5, "..OgggggggggggO.".slice(0, 16));
        } else {
          pon(g, 2, "....OGGGGGGGO...");
          pon(g, 3, "...OGGGWGGGGGO..");
          pon(g, 4, ".OgggggGGGGGGO..");
        }
      }
    },
    collao: {
      colores: { O: C.negro, H: C.pelo2, h: C.gris2, S: C.piel2, E: C.negro, C: C.blanco, c: C.gris1, P: C.noche2, Z: C.negro, W: C.blanco, R: C.ambar, L: C.azul },
      detalle: function (g, dir) {
        if (dir === "abajo") {
          pon(g, 1, "....OOOOOOOO....");
          pon(g, 0, "......OOOO......");
          pon(g, 6, "..OHLLLSSLLLHO..");
          pon(g, 7, "..OHLELSSLELHO..");
          pon(g, 10, "...OCRRRRRRCO...");
        } else if (dir === "arriba") {
          pon(g, 0, "......OOOO......");
          pon(g, 1, "....OOHHHHOO....");
          pon(g, 10, "...OCRRRRRRCO...");
        } else {
          pon(g, 0, "........OOO.....");
          pon(g, 1, ".....OOOHHHO....");
          pon(g, 6, "..OLLLSSSHHHHO..");
          pon(g, 7, "..OELSSSSHHHhO..");
          pon(g, 10, ".....ORRRRO.....");
        }
      }
    },
    ramiro: {
      colores: { O: C.negro, H: C.pelo2, h: C.gris2, S: C.piel2, E: C.negro, C: C.crema, c: C.arena1, P: C.gris3, Z: C.madera3, G: C.madera1, g: C.madera2, M: C.pelo2, V: C.madera2 },
      detalle: function (g, dir) {
        if (dir === "abajo") {
          pon(g, 1, "....OOOOOOOO....");
          pon(g, 2, "...OGGGGGGGGO...");
          pon(g, 3, "...OggggggggO...");
          pon(g, 4, ".OOGGGGGGGGGGOO.");
          pon(g, 5, "..OHSSSSSSSSHO..");
          pon(g, 8, "...OSMMMMMMSO...");
          pon(g, 10, "...OVCCCCCCVO...");
          pon(g, 11, "..OSVCCCCCCVSO..");
        } else if (dir === "arriba") {
          pon(g, 2, "...OGGGGGGGGO...");
          pon(g, 3, "...OggggggggO...");
          pon(g, 4, ".OOGGGGGGGGGGOO.");
          pon(g, 10, "...OVVVVVVVVO...");
          pon(g, 11, "..OSVVVVVVVVSO..");
        } else {
          pon(g, 2, "....OGGGGGGGO...");
          pon(g, 3, "....OgggggggO...");
          pon(g, 4, ".OGGGGGGGGGGGGO.");
          pon(g, 8, "...OMMSSSShhO...");
          pon(g, 10, ".....OVCCVO.....");
        }
      }
    },
    valentina: {
      colores: { O: C.negro, H: C.pelo1, h: "#24140c", S: C.piel2, E: C.negro, C: C.morado, c: "#4c2a74", P: C.noche2, Z: C.negro, R: C.turquesa, A: C.ambar },
      detalle: function (g, dir) {
        if (dir === "abajo") {
          pon(g, 8, "..OHSSSSSSSSHO..");
          pon(g, 9, "..OHOOSSSSOOHO..");
          pon(g, 10, "..OHCCCCCCCCHO..");
          pon(g, 11, "..OSRRRRRRRRSO..");
          pon(g, 7, "..AHSESSSSESHA..");
        } else if (dir === "arriba") {
          pon(g, 8, "..OHHHHHHHHHHO..");
          pon(g, 9, "..OHHHHHHHHHHO..");
          pon(g, 10, "..OhHHHHHHHHhO..");
          pon(g, 11, "..OShhhhhhhhSO..");
        } else {
          pon(g, 8, "...OSSSSSSHHHO..");
          pon(g, 9, "....OOSSSOHHHO..");
          pon(g, 10, ".....OCCCOhhO...");
          pon(g, 11, "....ORRRSRO.....");
        }
      }
    },
    tomas: {
      colores: { O: C.negro, H: C.pelo1, h: "#24140c", S: C.piel1, E: C.negro, C: C.rojo, c: C.rojo2, P: C.noche2, Z: C.negro }
    },
    descartes: {
      eco: true,
      colores: ECO,
      detalle: function (g, dir) {
        // Peluca larga y rizada, bigote y cuello blanco (siglo XVII)
        if (dir === "abajo") {
          pon(g, 6, ".OHHSSSSSSSSHHO.");
          pon(g, 7, ".OHHSESSSSESHHO.");
          pon(g, 8, ".OHHOMMSSMMOHHO.");
          pon(g, 9, ".OHHOOSSSSOOHHO.");
          pon(g, 10, "..OHWWWWWWWWHO..");
        } else if (dir === "arriba") {
          pon(g, 6, ".OHHHHHHHHHHHHO.");
          pon(g, 7, ".OHHHHHHHHHHHHO.");
          pon(g, 8, ".OhHHHHHHHHHHhO.");
          pon(g, 9, ".OhhhhhhhhhhhhO.");
          pon(g, 10, "..OhCCCCCCCChO..");
        } else {
          pon(g, 7, "..OESSSSSHHHHHO.");
          pon(g, 8, "...OMMSSSHHHHHO.");
          pon(g, 9, "....OOSSHHHHhO..");
          pon(g, 10, ".....OWWWhhO....");
        }
      }
    },
    hume: {
      eco: true,
      colores: ECO_HUME,
      detalle: function (g, dir) {
        // Peluca corta con rizos laterales y casaca (siglo XVIII); cara más redonda
        if (dir === "abajo") {
          pon(g, 5, ".OHHSSSSSSSSHHO.");
          pon(g, 6, ".OHSSSSSSSSSSHO.");
          pon(g, 7, ".OHSSESSSSESSHO.");
          pon(g, 8, "..OSSSSSSSSSSO..");
          pon(g, 9, "...OOSSSSSSOO...");
          pon(g, 10, "..OCCCWWWWCCCO..");
          pon(g, 11, ".OSCCCCCCCCCCSO.");
        } else if (dir === "arriba") {
          pon(g, 5, ".OHHHHHHHHHHHHO.");
          pon(g, 6, ".OHHHHHHHHHHHHO.");
          pon(g, 7, ".OhHHHhhhhHHHhO.");
          pon(g, 10, "..OCCCCCCCCCCO..");
          pon(g, 11, ".OSCCCCCCCCCCSO.");
        } else {
          pon(g, 6, "..OSSSSSHHHHHHO.");
          pon(g, 7, "..OESSSSSSHHHhO.");
          pon(g, 8, "..OSSSSSSShhhO..");
          pon(g, 10, "....OCCWCCO.....");
        }
      }
    }
  };

  var GALLINA = [
    "................",
    "...RR...........",
    "..ORRO..........",
    ".OBBBBO.........",
    "YYBEBBBO........",
    ".OBBBBBO....OO..",
    "..RBBBBBOOOObbO.",
    "..RBBBBBBBBBbbO.",
    "..OBBBBbbBBBBbO.",
    "..OBBBbbbbBBBO..",
    "...OBBBbbBBBBO..",
    "....OBBBBBBBO...",
    ".....OOOOOOO....",
    "......Y...Y.....",
    "......Y...Y.....",
    ".....YY..YY....."
  ];
  var GALLINA_PICA = GALLINA.slice(0, 3).map(function () { return "................"; }).concat([
    "...RR...........",
    "..ORRO..........",
    ".OBBBBO....OO...",
    ".OBEBBBOOOObbO..",
    "YYRBBBBBBBBBbO..",
    "..RBBBBbbBBBBbO.",
    "..OBBBbbbbBBBO..",
    "...OBBBbbBBBBO..",
    "....OBBBBBBBO...",
    ".....OOOOOOO....",
    "......Y...Y.....",
    ".....YY..YY....."
  ]).slice(0, 16);
  var COLORES_GALLINA = {
    clotilde: { O: C.negro, B: C.naranja, b: C.arena3, R: C.rojo, Y: C.ambar, E: C.negro },
    blanca: { O: C.negro, B: C.blanco, b: C.gris1, R: C.rojo, Y: C.ambar, E: C.negro },
    cafe: { O: C.negro, B: C.arena2, b: C.madera2, R: C.rojo, Y: C.ambar, E: C.negro }
  };

  function cuadro(id, dir, paso) {
    var per = PERSONAJES[id] || PERSONAJES.tomas;
    var base = dir === "der" ? "izq" : dir;
    var g = copia(BASE[base]);
    if (paso) PASO[base].forEach(function (f, i) { g[13 + i] = f.split(""); });
    if (per.detalle) per.detalle(g, base);
    return g.map(function (f) { return f.join(""); });
  }

  /* Devuelve la imagen 16×16 de un personaje.
     dir: abajo | arriba | izq | der. paso: 0 (quieto), 1 o 2 (caminando). */
  P.personaje = function (id, dir, paso) {
    dir = dir || "abajo";
    paso = paso || 0;
    if (id === "gallina" || id === "clotilde" || id === "gallina-blanca" || id === "gallina-cafe") {
      var tono = id === "gallina-blanca" ? "blanca" : id === "gallina-cafe" ? "cafe" : "clotilde";
      var der = dir === "der" || (dir === "abajo" && paso === 2);
      return P.imagen("gallina-" + tono + (paso === 1 ? "-p" : ""), paso === 1 ? GALLINA_PICA : GALLINA, COLORES_GALLINA[tono], der);
    }
    var per = PERSONAJES[id] || PERSONAJES.tomas;
    // En caminata hacia abajo/arriba, el segundo paso es el primero en espejo.
    var espejo = dir === "der" || ((dir === "abajo" || dir === "arriba") && paso === 2);
    var clave = "per-" + id + "-" + (dir === "der" ? "izq" : dir) + "-" + (paso ? 1 : 0);
    return P.imagen(clave, cuadro(id, dir, paso ? 1 : 0), per.colores, espejo);
  };

  P.esPersonaje = function (id) {
    return !!PERSONAJES[id] || /^(gallina|clotilde)/.test(id);
  };
  P.esEco = function (id) { return !!(PERSONAJES[id] && PERSONAJES[id].eco); };

  /* Retrato para la caja de diálogo: el sprite de frente, ampliado, sobre un fondo. */
  var retratos = {};
  P.retrato = function (id) {
    if (retratos[id]) return retratos[id];
    var eco = P.esEco(id);
    var spr = P.personaje(id === "gallina" ? "clotilde" : id, "abajo", 0);
    var l = P.lienzo(20, 20);
    l.x.fillStyle = eco ? C.noche2 : C.crema;
    l.x.fillRect(0, 0, 20, 20);
    if (eco) { l.x.fillStyle = C.noche3; l.x.fillRect(2, 2, 16, 16); }
    l.x.drawImage(spr, 2, 3);
    return (retratos[id] = P.aURL(l.c, 4));
  };
})(window.CA);
