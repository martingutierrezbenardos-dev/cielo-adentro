/* Escenarios del Capítulo 0 (lienzo 1600×900). Zonas de datos/cap0.js: x% = x/16, y% = y/9. */
(function (CA) {
  "use strict";
  var A = CA.Arte;
  var c = A.c;

  /* ---------- Camino al observatorio (atardecer) ---------- */
  A.registrarEscena("c0-camino", function () {
    var cielo = A.uid("atard");
    var luna = A.uid("luna");
    var espejo = A.uid("espejo");
    var s = "<defs>" +
      A.degradado(cielo, [[0, c("cielo-1")], [0.35, c("cielo-2")], [0.62, c("horizonte")], [0.8, c("rosa")], [1, c("ambar-suave")]]) +
      A.radial(luna, [[0, c("papel"), 0.35], [0.6, c("papel"), 0.08], [1, c("papel"), 0]]) +
      A.degradado(espejo, [[0, c("via-lactea"), 0.1], [0.5, c("via-lactea"), 0.85], [1, c("rosa"), 0.2]]) + "</defs>" +
      '<rect width="1600" height="900" fill="url(#' + cielo + ')"/>' +
      A.estrellas(60, 31, 0, 0, 1600, 260);
    // Luna llena enorme en el horizonte
    s += '<circle cx="300" cy="560" r="190" fill="url(#' + luna + ')"/>' +
      '<circle cx="300" cy="560" r="112" fill="' + c("papel") + '"/>' +
      '<g fill="' + c("arena-3") + '" opacity=".35"><circle cx="260" cy="530" r="22"/><circle cx="330" cy="590" r="16"/><circle cx="345" cy="520" r="10"/><circle cx="280" cy="600" r="9"/></g>';
    // cerros
    s += '<path d="M0 600 L180 560 L380 610 L600 540 L820 600 L1000 520 L1080 470 L1150 455 L1230 475 L1380 560 L1600 520 V900 H0Z" fill="' + c("cerro-lejos") + '"/>';
    // observatorio lejano en la cima
    s += '<rect x="1128" y="432" width="44" height="26" fill="' + c("metal") + '"/>' +
      '<path d="M1124 434 A26 26 0 0 1 1176 434Z" fill="' + c("cupula") + '"/>' +
      '<circle cx="1140" cy="446" r="3" fill="' + c("ambar") + '"/><circle cx="1160" cy="446" r="3" fill="' + c("ambar") + '"/>';
    s += '<path d="M0 640 C300 610 600 650 900 620 S1400 600 1600 630 V900 H0Z" fill="' + c("cerro") + '"/>';
    s += A.suelo(700);
    // camino en perspectiva
    s += '<path d="M380 900 L1075 600 L1125 600 L1300 900Z" fill="#3a3346"/>' +
      '<g stroke="' + c("ambar-suave") + '" stroke-width="6" stroke-dasharray="40 50" opacity=".6"><path d="M840 900 L1100 600"/></g>';
    // espejismo: parece agua sobre el asfalto caliente
    s += '<ellipse cx="1010" cy="706" rx="150" ry="16" fill="url(#' + espejo + ')"/>' +
      '<ellipse cx="1010" cy="704" rx="95" ry="6" fill="' + c("estrella") + '" opacity=".35"/>';
    // cactus y piedras
    s += A.cactus(180, 820, 0.8) + A.cactus(760, 750, 0.45) + A.piedras(41, 740, 16);
    // camioneta de Don Ramiro
    s += '<g transform="translate(1290 700)">' +
      '<rect x="0" y="60" width="300" height="80" rx="12" fill="' + c("ropa-3") + '"/>' +
      '<path d="M170 60 L190 0 H280 L300 60Z" fill="' + c("ropa-3") + '"/>' +
      '<path d="M196 10 H272 L286 56 H186Z" fill="' + c("via-lactea") + '" opacity=".6"/>' +
      '<circle cx="70" cy="140" r="30" fill="#1d1830"/><circle cx="240" cy="140" r="30" fill="#1d1830"/>' +
      '<circle cx="70" cy="140" r="12" fill="' + c("metal") + '"/><circle cx="240" cy="140" r="12" fill="' + c("metal") + '"/>' +
      '<rect x="286" y="80" width="14" height="16" rx="3" fill="' + c("ambar") + '"/></g>';
    s += A.figura("ramiro", 560, 880, 0.85);
    return s;
  });

  /* ---------- Pieza de la residencia ---------- */
  A.registrarEscena("c0-pieza", function (est, b) {
    var luz = A.uid("lampara");
    var s = '<rect width="1600" height="900" fill="' + c("muro-2") + '"/>' +
      "<defs>" + A.radial(luz, [[0, c("ambar"), 0.3], [1, c("ambar"), 0]]) + "</defs>" +
      '<rect x="0" y="760" width="1600" height="140" fill="' + c("suelo") + '"/>' +
      '<rect x="0" y="740" width="1600" height="20" fill="' + c("madera") + '"/>';
    // ventana con cielo
    s += '<rect x="550" y="140" width="360" height="320" rx="8" fill="' + c("madera-2") + '"/>' +
      '<rect x="566" y="156" width="328" height="288" fill="' + c("cielo-1") + '"/>' +
      A.estrellas(45, 12, 566, 156, 328, 288) +
      '<path d="M730 156 V444 M566 300 H894" stroke="' + c("madera-2") + '" stroke-width="10"/>';
    // mapa estelar en la pared
    s += '<rect x="1060" y="170" width="280" height="220" rx="4" fill="' + c("papel") + '"/>' +
      '<rect x="1072" y="182" width="256" height="196" fill="' + c("cielo-2") + '"/>' +
      '<g stroke="' + c("estrella") + '" stroke-width="2" opacity=".7" fill="none"><path d="M1100 330 L1150 280 L1210 300 L1260 240 L1300 270"/><path d="M1120 220 L1170 210 L1200 250"/></g>' +
      '<g fill="' + c("estrella") + '"><circle cx="1100" cy="330" r="4"/><circle cx="1150" cy="280" r="4"/><circle cx="1210" cy="300" r="4"/><circle cx="1260" cy="240" r="5"/><circle cx="1300" cy="270" r="3"/><circle cx="1120" cy="220" r="3"/><circle cx="1170" cy="210" r="4"/><circle cx="1200" cy="250" r="3"/></g>';
    // cama
    s += '<rect x="60" y="600" width="460" height="130" rx="10" fill="' + c("madera") + '"/>' +
      '<rect x="60" y="500" width="30" height="240" rx="6" fill="' + c("madera-2") + '"/>' +
      '<rect x="90" y="570" width="420" height="60" rx="14" fill="' + c("papel") + '"/>' +
      '<rect x="100" y="545" width="120" height="50" rx="18" fill="' + c("cupula") + '"/>' +
      '<path d="M230 570 H510 V640 C400 660 300 650 230 640Z" fill="' + c("ropa-2") + '"/>' +
      '<g stroke="' + c("ambar-suave") + '" stroke-width="4" opacity=".5"><path d="M260 600 H500 M260 620 H500"/></g>';
    // escritorio, lámpara, libro y vaso
    s += '<circle cx="1120" cy="560" r="170" fill="url(#' + luz + ')"/>' +
      '<rect x="990" y="600" width="470" height="24" rx="4" fill="' + c("madera-2") + '"/>' +
      '<rect x="1010" y="624" width="20" height="120" fill="' + c("madera") + '"/><rect x="1420" y="624" width="20" height="120" fill="' + c("madera") + '"/>' +
      '<path d="M1020 600 V540 L1050 500" stroke="' + c("metal") + '" stroke-width="6" fill="none"/>' +
      '<path d="M1030 480 L1090 500 L1060 535Z" fill="' + c("ambar") + '"/>';
    // libro abierto con papelitos
    s += '<path d="M1060 598 L1140 590 L1220 598 L1220 572 L1140 564 L1060 572Z" fill="' + c("papel") + '"/>' +
      '<path d="M1140 564 V590" stroke="' + c("madera") + '" stroke-width="3"/>' +
      '<rect x="1160" y="548" width="14" height="24" fill="' + c("ambar") + '"/><rect x="1180" y="552" width="14" height="22" fill="' + c("rosa") + '"/>';
    // vaso con bombilla (se ve quebrada por la refracción)
    s += '<rect x="1282" y="520" width="56" height="80" rx="6" fill="' + c("via-lactea") + '" opacity=".35" stroke="' + c("metal-2") + '" stroke-width="3"/>' +
      '<rect x="1284" y="548" width="52" height="50" fill="' + c("turquesa") + '" opacity=".35"/>' +
      '<path d="M1330 470 L1312 548" stroke="' + c("metal-2") + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M1300 550 L1288 592" stroke="' + c("metal-2") + '" stroke-width="7" stroke-linecap="round"/>';
    // puerta
    s += '<rect x="1470" y="330" width="120" height="420" rx="6" fill="' + c("madera") + '"/>' +
      '<rect x="1484" y="346" width="92" height="180" rx="4" fill="' + c("madera-2") + '"/>' +
      '<rect x="1484" y="545" width="92" height="190" rx="4" fill="' + c("madera-2") + '"/>' +
      '<circle cx="1486" cy="545" r="7" fill="' + c("ambar") + '"/>';
    if (b("c0-desperto")) {
      // luz del pasillo bajo la puerta: alguien golpea
      s += '<rect x="1470" y="744" width="120" height="10" fill="' + c("ambar-suave") + '" opacity=".8"/>';
    }
    return s;
  });

  /* ---------- El sueño: la cúpula, pero algo raro ---------- */
  A.registrarEscena("c0-sueno", function (est, b) {
    var velo = A.uid("velo");
    var s = A._escenas["c1-cupula"]({ banderas: {} }, function () { return false; });
    s += "<defs>" + A.radial(velo, [[0, c("rosa"), 0], [0.7, c("ropa-2"), 0.25], [1, c("cielo-1"), 0.75]]) + "</defs>" +
      '<rect width="1600" height="900" fill="url(#' + velo + ')"/>';
    // la pizarra dice algo inquietante
    s += '<rect x="1242" y="204" width="288" height="254" rx="4" fill="#1f3a33"/>' +
      A.textoLineas(["ESTO NO", "ES UN SUEÑO."], 1270, 290, 34, c("ambar-suave"));
    // reloj flotante
    s += '<g transform="translate(305 180) rotate(-12)">' +
      '<ellipse cx="0" cy="0" rx="72" ry="62" fill="' + c("papel") + '" stroke="' + c("madera") + '" stroke-width="8"/>' +
      '<path d="M0 0 V-40 M0 0 L30 12" stroke="#1d1830" stroke-width="6" stroke-linecap="round"/>' +
      '<g fill="#1d1830"><circle cx="0" cy="-50" r="4"/><circle cx="50" cy="0" r="4"/><circle cx="0" cy="50" r="4"/><circle cx="-50" cy="0" r="4"/></g></g>';
    // estrellitas flotando dentro de la cúpula
    s += '<g fill="' + c("ambar-suave") + '" opacity=".8">' +
      '<path d="M560 120 l8 18 l18 8 l-18 8 l-8 18 l-8 -18 l-18 -8 l18 -8Z"/>' +
      '<path d="M1130 90 l6 13 l13 6 l-13 6 l-6 13 l-6 -13 l-13 -6 l13 -6Z"/>' +
      '<path d="M980 520 l5 11 l11 5 l-11 5 l-5 11 l-5 -11 l-11 -5 l11 -5Z"/></g>';
    // tus manos, en primera persona
    s += '<g fill="' + c("piel-3") + '">' +
      '<path d="M620 900 C620 840 640 810 670 800 L700 790 C720 786 730 800 720 812 L700 830 L760 820 C780 818 784 842 764 848 L720 860 L730 900Z"/>' +
      '<path d="M980 900 C980 840 960 810 930 800 L900 790 C880 786 870 800 880 812 L900 830 L840 820 C820 818 816 842 836 848 L880 860 L870 900Z"/></g>';
    if (b("c0-p-pellizco") && b("c0-p-reloj") && b("c0-p-collao")) {
      var brillo = A.uid("despertar");
      s += "<defs>" + A.radial(brillo, [[0, "#ffffff", 1], [0.4, c("ambar-suave"), 0.7], [1, c("ambar"), 0]]) + "</defs>" +
        '<circle cx="800" cy="90" r="75" fill="url(#' + brillo + ')"/>';
    }
    return s;
  });

  /* ---------- Planetario (se reutiliza en el Capítulo 4) ---------- */
  A.registrarEscena("planetario", function (est, b) {
    var cup = A.uid("cup");
    var s = '<rect width="1600" height="900" fill="#07091c"/>' +
      "<defs>" + A.radial(cup, [[0, c("cielo-2")], [0.8, c("cielo-1")], [1, "#07091c"]]) + "</defs>" +
      '<ellipse cx="800" cy="600" rx="900" ry="640" fill="url(#' + cup + ')"/>' +
      A.estrellas(260, 77, 40, 20, 1520, 520) +
      '<g transform="rotate(-18 800 300)" fill="' + c("via-lactea") + '" opacity=".08"><ellipse cx="800" cy="300" rx="760" ry="80"/></g>' +
      '<g stroke="' + c("turquesa") + '" stroke-width="1.5" opacity=".35" fill="none">' +
      '<path d="M260 180 L330 140 L400 170 L450 120"/><path d="M1180 150 L1250 200 L1320 170 L1390 230"/><path d="M700 90 L760 60 L830 80"/></g>';
    // butacas
    s += '<g fill="#161330">' +
      '<path d="M0 720 C400 640 1200 640 1600 720 V900 H0Z"/></g>' +
      '<g fill="' + c("ropa-2") + '" opacity=".7">';
    for (var fila = 0; fila < 2; fila++) {
      for (var i = 0; i < 12; i++) {
        var x = 60 + i * 130 + fila * 60, y = 740 + fila * 80;
        if (x > 640 && x < 960) continue;
        s += '<rect x="' + x + '" y="' + y + '" width="80" height="50" rx="14"/>';
      }
    }
    s += "</g>";
    // proyector de estrellas (dos esferas sobre un pedestal)
    s += '<rect x="775" y="560" width="50" height="220" fill="' + c("metal") + '"/>' +
      '<ellipse cx="800" cy="780" rx="90" ry="18" fill="' + c("metal-2") + '"/>' +
      '<g transform="rotate(-20 800 520)">' +
      '<rect x="690" y="505" width="220" height="30" rx="12" fill="' + c("metal") + '"/>' +
      '<circle cx="700" cy="520" r="58" fill="' + c("metal-2") + '"/><circle cx="900" cy="520" r="58" fill="' + c("metal-2") + '"/>';
    var r = A.azar(5);
    for (var k = 0; k < 18; k++) {
      var cx = (k % 2 ? 900 : 700) + (r() - 0.5) * 80, cy = 520 + (r() - 0.5) * 80;
      s += '<circle cx="' + cx.toFixed(0) + '" cy="' + cy.toFixed(0) + '" r="4" fill="' + c("ambar-suave") + '"/>';
    }
    s += "</g>" +
      '<g stroke="' + c("ambar-suave") + '" stroke-width="2" opacity=".18"><path d="M700 520 L420 120 M700 520 L300 300 M900 520 L1200 120 M900 520 L1350 280"/></g>';
    if (est && est._planetarioExtra) s += est._planetarioExtra;
    if (b("c0-proyeccion")) s += A.figura("descartes", 400, 860, 0.95);
    if (b("c0-cogito")) s += A.figura("hume", 1400, 860, 0.95);
    if (b("c0-valentina") || (est && est.capitulo === "cap0")) s += A.figura("valentina", 1150, 860, 0.9);
    return s;
  });
})(window.CA);
