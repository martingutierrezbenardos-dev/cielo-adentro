/* Personajes ficticios y "ecos" de filósofos (siluetas y retratos estilizados originales). */
(function (CA) {
  "use strict";

  var A = CA.Arte;
  var c = A.c;

  /* ---------- Cabezas (coordenadas locales: centro de la cabeza en 0,0; radio ~42) ---------- */
  var cabezas = {
    collao: function () {
      return '<path d="M-48 8 C-52 -40 -30 -56 0 -56 C32 -56 54 -40 48 10 C44 -16 30 -30 0 -32 C-28 -30 -42 -14 -48 8Z" fill="' + c("pelo-gris") + '"/>' +
        '<ellipse cx="0" cy="0" rx="38" ry="44" fill="' + c("piel-1") + '"/>' +
        '<path d="M-40 -6 C-36 -40 -10 -48 6 -46 C26 -44 40 -30 40 -8 C30 -26 12 -30 -8 -28 C-24 -26 -34 -18 -40 -6Z" fill="' + c("pelo-gris") + '"/>' +
        '<g fill="none" stroke="#1d1830" stroke-width="3"><circle cx="-14" cy="2" r="10"/><circle cx="14" cy="2" r="10"/><path d="M-4 2 H4"/></g>' +
        '<circle cx="-14" cy="3" r="3" fill="#1d1830"/><circle cx="14" cy="3" r="3" fill="#1d1830"/>' +
        '<path d="M-10 24 Q0 30 10 24" stroke="#5a2e2a" stroke-width="3" fill="none" stroke-linecap="round"/>';
    },
    ramiro: function () {
      return '<ellipse cx="0" cy="2" rx="38" ry="44" fill="' + c("piel-2") + '"/>' +
        '<ellipse cx="0" cy="-30" rx="74" ry="14" fill="' + c("madera") + '"/>' +
        '<path d="M-36 -32 C-34 -66 34 -66 36 -32Z" fill="' + c("madera-2") + '"/>' +
        '<rect x="-36" y="-40" width="72" height="8" fill="' + c("ropa-3") + '"/>' +
        '<circle cx="-13" cy="0" r="3.5" fill="#1d1830"/><circle cx="13" cy="0" r="3.5" fill="#1d1830"/>' +
        '<path d="M-20 18 Q-10 10 0 16 Q10 10 20 18 Q12 26 0 22 Q-12 26 -20 18Z" fill="' + c("pelo-gris") + '"/>' +
        '<path d="M-8 32 Q0 36 8 32" stroke="#3a1e18" stroke-width="3" fill="none" stroke-linecap="round"/>';
    },
    tu: function () {
      return '<ellipse cx="0" cy="0" rx="38" ry="44" fill="' + c("piel-3") + '"/>' +
        '<path d="M-42 4 C-46 -40 -20 -54 2 -52 C28 -50 46 -36 42 4 C36 -20 22 -28 0 -28 C-20 -28 -36 -20 -42 4Z" fill="' + c("pelo-oscuro") + '"/>' +
        '<rect x="-44" y="-26" width="88" height="10" rx="5" fill="' + c("ropa-2") + '"/>' +
        '<circle cx="0" cy="-21" r="6" fill="' + c("rojo") + '"/>' +
        '<circle cx="-13" cy="4" r="3.5" fill="#1d1830"/><circle cx="13" cy="4" r="3.5" fill="#1d1830"/>' +
        '<path d="M-9 24 Q0 30 9 24" stroke="#5a2e2a" stroke-width="3" fill="none" stroke-linecap="round"/>';
    },
    tomas: function () {
      return '<ellipse cx="0" cy="0" rx="38" ry="44" fill="' + c("piel-3") + '"/>' +
        '<path d="M-40 -4 C-44 -44 40 -52 40 -4 C34 -24 20 -30 0 -30 C-20 -30 -34 -22 -40 -4Z" fill="' + c("pelo-oscuro") + '"/>' +
        '<path d="M-30 20 C-24 44 24 44 30 20 C20 30 -20 30 -30 20Z" fill="' + c("pelo-oscuro") + '" opacity=".85"/>' +
        '<circle cx="-13" cy="2" r="3.5" fill="#1d1830"/><circle cx="13" cy="2" r="3.5" fill="#1d1830"/>' +
        '<path d="M-8 20 Q0 24 8 20" stroke="#3a1e18" stroke-width="3" fill="none" stroke-linecap="round"/>';
    },
    valentina: function () {
      return '<path d="M-46 30 C-54 -40 -24 -58 0 -56 C26 -58 54 -40 46 30 C40 0 30 -20 0 -24 C-30 -20 -40 0 -46 30Z" fill="' + c("pelo-oscuro") + '"/>' +
        '<ellipse cx="0" cy="0" rx="36" ry="43" fill="' + c("piel-2") + '"/>' +
        '<path d="M-38 -6 C-34 -42 34 -42 38 -6 C24 -30 -4 -30 -38 -6Z" fill="' + c("pelo-oscuro") + '"/>' +
        '<circle cx="-13" cy="3" r="3.5" fill="#1d1830"/><circle cx="13" cy="3" r="3.5" fill="#1d1830"/>' +
        '<path d="M-9 22 Q0 28 9 22" stroke="#5a2e2a" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<circle cx="-38" cy="12" r="4" fill="' + c("ambar") + '"/><circle cx="38" cy="12" r="4" fill="' + c("ambar") + '"/>';
    },
    // Ecos: retratos estilizados, sin rasgos faciales detallados, con contorno luminoso.
    hume: function () {
      return '<path d="M-44 20 C-54 -30 -30 -56 0 -56 C30 -56 54 -30 44 20 C40 36 30 40 24 40 L24 10 L-24 10 L-24 40 C-30 40 -40 36 -44 20Z" fill="' + c("eco") + '" opacity=".35"/>' +
        '<ellipse cx="0" cy="0" rx="34" ry="42" fill="' + c("eco") + '" opacity=".55"/>' +
        '<path d="M-44 6 C-50 -8 -48 -22 -40 -24 C-46 -10 -42 0 -36 6Z M44 6 C50 -8 48 -22 40 -24 C46 -10 42 0 36 6Z" fill="' + c("eco") + '" opacity=".7"/>' +
        '<path d="M40 -10 C60 -4 62 20 50 30" stroke="' + c("eco") + '" stroke-width="7" fill="none" opacity=".6"/>';
    },
    popper: function () {
      return '<ellipse cx="0" cy="0" rx="36" ry="44" fill="' + c("eco") + '" opacity=".55"/>' +
        '<path d="M-38 4 C-40 -10 -34 -18 -28 -20 M38 4 C40 -10 34 -18 28 -20" stroke="' + c("eco") + '" stroke-width="8" fill="none" opacity=".7"/>' +
        '<g fill="none" stroke="' + c("estrella") + '" stroke-width="3" opacity=".8"><circle cx="-14" cy="2" r="10"/><circle cx="14" cy="2" r="10"/><path d="M-4 2 H4"/></g>';
    },
    kuhn: function () {
      return '<ellipse cx="0" cy="0" rx="37" ry="44" fill="' + c("eco") + '" opacity=".55"/>' +
        '<path d="M-38 -4 C-40 -40 40 -44 38 -6 C28 -28 -20 -30 -38 -4Z" fill="' + c("eco") + '" opacity=".75"/>' +
        '<g fill="none" stroke="' + c("estrella") + '" stroke-width="3" opacity=".8"><rect x="-26" y="-6" width="20" height="14" rx="3"/><rect x="6" y="-6" width="20" height="14" rx="3"/><path d="M-6 0 H6"/></g>';
    },
    descartes: function () {
      return '<path d="M-46 40 C-58 -20 -40 -58 0 -58 C40 -58 58 -20 46 40 C40 20 34 0 30 -14 L-30 -14 C-34 0 -40 20 -46 40Z" fill="' + c("eco") + '" opacity=".4"/>' +
        '<ellipse cx="0" cy="0" rx="33" ry="42" fill="' + c("eco") + '" opacity=".55"/>' +
        '<path d="M-36 -10 C-30 -44 30 -44 36 -10 C22 -30 -22 -30 -36 -10Z" fill="' + c("eco") + '" opacity=".75"/>' +
        '<path d="M-16 20 Q0 12 16 20" stroke="' + c("estrella") + '" stroke-width="4" fill="none" opacity=".7"/>' +
        '<path d="M-3 26 V36" stroke="' + c("estrella") + '" stroke-width="3" opacity=".6"/>';
    },
    gallina: function () {
      return gallinaCuerpo(0, 20, 1.1);
    }
  };

  function gallinaCuerpo(x, y, e) {
    return '<g transform="translate(' + x + " " + y + ") scale(" + e + ')">' +
      '<path d="M-60 -10 C-80 -40 -70 -70 -50 -64 C-60 -40 -40 -30 -30 -30Z" fill="' + c("madera") + '"/>' +
      '<ellipse cx="0" cy="0" rx="52" ry="40" fill="' + c("arena-3") + '"/>' +
      '<ellipse cx="-6" cy="4" rx="28" ry="18" fill="' + c("arena-2") + '"/>' +
      '<circle cx="36" cy="-38" r="22" fill="' + c("arena-3") + '"/>' +
      '<path d="M26 -60 q4 -12 10 -2 q4 -12 10 -2 q6 -8 8 4 Z" fill="' + c("rojo") + '"/>' +
      '<path d="M56 -40 L72 -34 L56 -28Z" fill="' + c("ambar") + '"/>' +
      '<path d="M50 -26 q4 10 -2 14 q-6 -6 2 -14Z" fill="' + c("rojo") + '"/>' +
      '<circle cx="42" cy="-42" r="4" fill="#1d1830"/>' +
      '<g stroke="' + c("ambar") + '" stroke-width="5" stroke-linecap="round"><path d="M-10 36 V60 M-10 60 l-8 6 M-10 60 l8 6"/><path d="M14 36 V60 M14 60 l-8 6 M14 60 l8 6"/></g>' +
      "</g>";
  }
  A.gallina = gallinaCuerpo;

  /* ---------- Cuerpos (pies en 0,0; altura ~430) ---------- */
  function cuerpoBase(op) {
    var s = "";
    // piernas
    s += '<rect x="-36" y="-180" width="30" height="176" rx="10" fill="' + op.pantalon + '"/>' +
      '<rect x="6" y="-180" width="30" height="176" rx="10" fill="' + op.pantalon + '"/>' +
      '<ellipse cx="-22" cy="-4" rx="24" ry="10" fill="#15122a"/><ellipse cx="22" cy="-4" rx="24" ry="10" fill="#15122a"/>';
    // brazos
    s += '<rect x="-84" y="-320" width="30" height="150" rx="14" fill="' + op.manga + '"/>' +
      '<rect x="54" y="-320" width="30" height="150" rx="14" fill="' + op.manga + '"/>' +
      '<circle cx="-69" cy="-168" r="14" fill="' + op.piel + '"/><circle cx="69" cy="-168" r="14" fill="' + op.piel + '"/>';
    // torso
    s += '<path d="M-64 -330 C-70 -250 -66 -200 -60 -160 H60 C66 -200 70 -250 64 -330 C40 -346 -40 -346 -64 -330Z" fill="' + op.torso + '"/>';
    // cuello
    s += '<rect x="-14" y="-352" width="28" height="24" fill="' + op.piel + '"/>';
    return s;
  }

  var figuras = {
    collao: function () {
      return cuerpoBase({ pantalon: "#2a2540", manga: c("ropa-1"), torso: c("ropa-1"), piel: c("piel-1") }) +
        '<path d="M0 -336 V-170" stroke="#1d4a4d" stroke-width="4"/>' +
        '<path d="M-40 -344 Q0 -320 40 -344 L36 -326 Q0 -306 -36 -326Z" fill="' + c("ambar") + '"/>' +
        '<path d="M22 -330 L30 -280" stroke="' + c("ambar") + '" stroke-width="10" stroke-linecap="round"/>' +
        '<rect x="-50" y="-250" width="30" height="36" rx="4" fill="#1d4a4d"/>' +
        '<g transform="translate(0 -392)">' + cabezas.collao() + "</g>";
    },
    ramiro: function () {
      return cuerpoBase({ pantalon: "#3b3450", manga: c("papel"), torso: c("papel"), piel: c("piel-2") }) +
        '<path d="M-64 -330 C-70 -250 -66 -200 -60 -170 H-18 V-336 C-40 -340 -56 -336 -64 -330Z M64 -330 C70 -250 66 -200 60 -170 H18 V-336 C40 -340 56 -336 64 -330Z" fill="' + c("madera") + '"/>' +
        '<g transform="translate(0 -392)">' + cabezas.ramiro() + "</g>";
    },
    tomas: function () {
      return cuerpoBase({ pantalon: "#2d3558", manga: c("ropa-3"), torso: c("ropa-3"), piel: c("piel-3") }) +
        '<path d="M-30 -336 L0 -300 L30 -336" stroke="' + c("papel") + '" stroke-width="6" fill="none"/>' +
        '<g transform="translate(0 -392)">' + cabezas.tomas() + "</g>";
    },
    valentina: function () {
      return cuerpoBase({ pantalon: "#1f2a44", manga: c("ropa-2"), torso: c("ropa-2"), piel: c("piel-2") }) +
        '<rect x="-40" y="-300" width="80" height="18" rx="6" fill="' + c("turquesa") + '"/>' +
        '<g transform="translate(0 -392)">' + cabezas.valentina() + "</g>";
    }
  };

  // Silueta luminosa de un eco (filósofo) con ropa de su época, muy estilizada.
  function eco(tipo) {
    var halo = A.uid("halo");
    var ropa;
    if (tipo === "descartes") {
      // Capa y cuello blanco del siglo XVII
      ropa = '<path d="M-74 -330 C-96 -220 -100 -120 -96 -10 H96 C100 -120 96 -220 74 -330 C40 -350 -40 -350 -74 -330Z"/>' +
        '<path d="M-52 -344 Q0 -300 52 -344 L44 -318 Q0 -284 -44 -318Z" fill="' + c("estrella") + '" opacity=".75"/>';
    } else if (tipo === "hume") {
      // Casaca larga del siglo XVIII
      ropa = '<path d="M-70 -330 C-90 -200 -96 -80 -100 -20 H100 C96 -80 90 -200 70 -330 C40 -350 -40 -350 -70 -330Z"/>' +
        '<path d="M-30 -340 L0 -290 L30 -340Z" fill="' + c("estrella") + '" opacity=".5"/>';
    } else {
      ropa = '<path d="M-66 -330 C-72 -250 -68 -200 -62 -160 H62 C68 -200 72 -250 66 -330 C40 -346 -40 -346 -66 -330Z"/>' +
        '<rect x="-36" y="-170" width="30" height="166" rx="10"/><rect x="6" y="-170" width="30" height="166" rx="10"/>' +
        '<path d="M-24 -338 L0 -300 L24 -338" stroke="' + c("estrella") + '" stroke-width="5" fill="none" opacity=".6"/>';
    }
    return "<defs>" + A.radial(halo, [[0, c("eco"), 0.35], [1, c("eco"), 0]]) + "</defs>" +
      '<ellipse cx="0" cy="-220" rx="190" ry="280" fill="url(#' + halo + ')"/>' +
      '<g fill="' + c("eco") + '" opacity=".5">' + ropa +
      '<rect x="-86" y="-322" width="28" height="150" rx="14"/><rect x="58" y="-322" width="28" height="150" rx="14"/></g>' +
      '<g transform="translate(0 -392)">' + cabezas[tipo]() + "</g>";
  }

  A.figura = function (id, x, y, escala) {
    var dib;
    if (id === "hume" || id === "popper" || id === "kuhn" || id === "descartes") dib = eco(id);
    else if (id === "gallina") dib = gallinaCuerpo(0, -70, 1);
    else dib = figuras[id] ? figuras[id]() : "";
    return '<g transform="translate(' + x + " " + y + ") scale(" + (escala || 1) + ')">' +
      '<ellipse cx="0" cy="0" rx="80" ry="14" fill="#000" opacity=".25"/>' + dib + "</g>";
  };

  A.retrato = function (id) {
    var esEco = id === "hume" || id === "popper" || id === "kuhn" || id === "descartes";
    var fondo = esEco ? c("cielo-1") : c("muro-3");
    var hombros = "";
    var colores = { collao: c("ropa-1"), ramiro: c("madera"), tu: c("ropa-2"), tomas: c("ropa-3"), valentina: c("ropa-2"), hume: c("eco"), popper: c("eco"), kuhn: c("eco"), descartes: c("eco") };
    if (id !== "gallina") {
      hombros = '<path d="M8 100 C10 78 30 70 50 70 C70 70 90 78 92 100Z" fill="' + (colores[id] || c("ropa-2")) + '"' + (esEco ? ' opacity=".5"' : "") + "/>";
    }
    var cab = cabezas[id] ? cabezas[id]() : "";
    var tr = id === "gallina" ? "translate(38 58) scale(.55)" : "translate(50 44) scale(.62)";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="' + fondo + '"/>' +
      hombros + '<g transform="' + tr + '">' + cab + "</g></svg>";
  };
})(window.CA);
