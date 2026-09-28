/* Escenarios del Capítulo 1 y portada. Lienzo de 1600×900.
   Las coordenadas de los objetos coinciden con las "zonas" (en %) de datos/cap1.js:
   zona x% = x / 16, zona y% = y / 9. */
(function (CA) {
  "use strict";
  var A = CA.Arte;
  var c = A.c;

  /* Estrellas del "Campo del Salar" (región del cielo que estudia el observatorio) */
  var campo = [[1160, 130], [1225, 185], [1270, 215], [1330, 160], [1390, 240], [1200, 280], [1300, 300]];

  function campoDelSalar(nova, escala, dx, dy) {
    escala = escala || 1; dx = dx || 0; dy = dy || 0;
    var s = '<g transform="translate(' + dx + " " + dy + ") scale(" + escala + ')">';
    campo.forEach(function (p, i) {
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i === 2 ? 3.2 : 4) + '" fill="' + c("estrella") + '"/>';
      s += A.destello(p[0], p[1], 11, 0.9);
    });
    if (nova) {
      var g = A.uid("nova");
      s += "<defs>" + A.radial(g, [[0, "#ffffff", 1], [0.2, c("ambar-suave"), 0.9], [1, c("ambar"), 0]]) + "</defs>" +
        '<circle cx="1270" cy="215" r="70" fill="url(#' + g + ')"/>' +
        '<path d="M1270 150 V280 M1205 215 H1335 M1225 170 L1315 260 M1315 170 L1225 260" stroke="#fff" stroke-width="2.5" opacity=".8"/>' +
        '<circle cx="1270" cy="215" r="11" fill="#fff"/>';
    }
    return s + "</g>";
  }
  A.campoDelSalar = campoDelSalar;

  function observatorio() {
    var dom = A.uid("dom");
    return "<defs>" + A.degradado(dom, [[0, c("cupula")], [1, c("metal")]], false) + "</defs>" +
      // edificio
      '<rect x="470" y="520" width="360" height="245" fill="' + c("metal") + '"/>' +
      '<rect x="470" y="520" width="360" height="22" fill="' + c("metal-2") + '"/>' +
      // cúpula
      '<path d="M480 525 A170 170 0 0 1 820 525Z" fill="url(#' + dom + ')"/>' +
      '<path d="M632 358 L668 358 L676 525 L624 525Z" fill="' + c("cielo-1") + '"/>' +
      '<path d="M650 360 L650 525" stroke="' + c("metal") + '" stroke-width="2" opacity=".6"/>' +
      '<g stroke="' + c("metal") + '" stroke-width="2" opacity=".5" fill="none"><path d="M520 525 A130 150 0 0 1 600 395"/><path d="M780 525 A130 150 0 0 0 700 395"/></g>' +
      // puerta y ventanas iluminadas
      '<rect x="612" y="640" width="76" height="125" rx="4" fill="#2b2540"/>' +
      '<rect x="620" y="648" width="60" height="110" fill="' + c("ambar") + '" opacity=".25"/>' +
      '<circle cx="672" cy="705" r="4" fill="' + c("ambar") + '"/>' +
      '<rect x="505" y="600" width="60" height="36" rx="4" fill="' + c("ambar") + '" opacity=".75"/>' +
      '<rect x="735" y="600" width="60" height="36" rx="4" fill="' + c("ambar") + '" opacity=".75"/>' +
      '<path d="M640 765 L560 900 H760 L680 765Z" fill="' + c("arena-2") + '" opacity=".35"/>';
  }

  function casaRamiro() {
    return '<rect x="1150" y="610" width="260" height="160" fill="' + c("arena-2") + '"/>' +
      '<rect x="1150" y="610" width="260" height="160" fill="#000" opacity=".25"/>' +
      '<path d="M1135 620 L1280 560 L1425 620Z" fill="' + c("metal") + '"/>' +
      '<rect x="1185" y="650" width="60" height="50" rx="3" fill="' + c("ambar") + '" opacity=".85"/>' +
      '<path d="M1215 650 V700 M1185 675 H1245" stroke="' + c("madera") + '" stroke-width="4"/>' +
      '<rect x="1300" y="670" width="60" height="100" rx="3" fill="' + c("madera") + '"/>' +
      // gallinero
      '<g stroke="' + c("madera-2") + '" stroke-width="5">' +
      '<path d="M1430 700 V775 M1470 700 V775 M1510 700 V775 M1550 700 V775 M1430 715 H1560 M1430 745 H1560"/></g>' +
      '<g opacity=".9">' + A.gallina(1480, 770, 0.35) + A.gallina(1530, 772, 0.3) + "</g>";
  }

  /* ---------- Portada ---------- */
  A.registrarEscena("portada", function () {
    return A.cieloNoche({ n: 240, semilla: 3 }) + campoDelSalar(false) + A.cerros(560) + A.suelo(720) + observatorio() +
      A.cactus(250, 800, 0.9) + A.cactus(1480, 820, 0.7) + A.piedras(5, 760, 18);
  });

  /* ---------- Explanada (exterior) ---------- */
  A.registrarEscena("c1-exterior", function (est, b) {
    var nova = b("c1-nova");
    return A.cieloNoche({ n: 190, semilla: 11 }) +
      // marco sutil del Campo del Salar
      '<rect x="1120" y="90" width="320" height="230" rx="20" fill="none" stroke="' + c("turquesa") + '" stroke-dasharray="6 10" opacity=".35"/>' +
      campoDelSalar(nova) + A.cerros(560) + A.suelo(720) + observatorio() + casaRamiro() +
      A.cactus(230, 790, 0.9) + A.cactus(980, 810, 0.6) + A.piedras(21, 770, 22);
  });

  /* ---------- Cúpula del telescopio ---------- */
  A.registrarEscena("c1-cupula", function (est, b) {
    var nova = b("c1-nova");
    var ley = b("c1-ley");
    var refutada = b("c1-refutada");
    var pantalla = A.uid("pan");
    var s = "";
    // muro curvo y costillas de la cúpula
    s += '<rect width="1600" height="900" fill="' + c("muro") + '"/>';
    s += '<path d="M0 760 C0 200 400 -40 800 -40 C1200 -40 1600 200 1600 760Z" fill="' + c("muro-2") + '"/>';
    s += '<g stroke="' + c("muro-3") + '" stroke-width="10" fill="none">' +
      '<path d="M120 760 C160 300 500 20 800 -20"/><path d="M1480 760 C1440 300 1100 20 800 -20"/>' +
      '<path d="M400 760 C420 360 600 60 800 -20"/><path d="M1200 760 C1180 360 1000 60 800 -20"/></g>';
    // rendija abierta con cielo
    s += '<clipPath id="' + pantalla + 'r"><path d="M730 -10 H870 L880 420 H720Z"/></clipPath>' +
      '<g clip-path="url(#' + pantalla + 'r)"><rect x="700" y="-20" width="200" height="460" fill="' + c("cielo-1") + '"/>' +
      A.estrellas(40, 4, 720, 0, 170, 420) + (nova ? campoDelSalar(true, 0.9, -370, 20) : "") + "</g>" +
      '<path d="M730 -10 L720 420 M870 -10 L880 420" stroke="' + c("metal") + '" stroke-width="10"/>';
    // suelo
    s += '<rect x="0" y="760" width="1600" height="140" fill="' + c("suelo") + '"/>';
    s += '<path d="M0 760 H1600" stroke="' + c("muro-3") + '" stroke-width="4"/>';
    // puerta al archivo (izquierda)
    s += '<rect x="22" y="395" width="118" height="370" rx="6" fill="' + c("madera") + '"/>' +
      '<rect x="36" y="410" width="90" height="150" rx="4" fill="' + c("madera-2") + '"/>' +
      '<rect x="36" y="580" width="90" height="170" rx="4" fill="' + c("madera-2") + '"/>' +
      '<circle cx="122" cy="580" r="7" fill="' + c("ambar") + '"/>' +
      '<rect x="30" y="360" width="104" height="28" rx="4" fill="' + c("papel") + '"/>' +
      '<text x="82" y="381" font-size="18" text-anchor="middle" fill="' + c("cielo-1") + '" font-weight="700" font-family="sans-serif">ARCHIVO</text>';
    // consola del fotómetro
    s += '<rect x="170" y="600" width="440" height="30" rx="6" fill="' + c("madera-2") + '"/>' +
      '<rect x="190" y="630" width="20" height="130" fill="' + c("madera") + '"/><rect x="570" y="630" width="20" height="130" fill="' + c("madera") + '"/>' +
      '<rect x="200" y="430" width="260" height="165" rx="10" fill="' + c("metal") + '"/>' +
      '<rect x="212" y="442" width="236" height="130" rx="4" fill="#0b1a24"/>' +
      '<g stroke="' + c("turquesa") + '" opacity=".35" stroke-width="1"><path d="M212 475 H448 M212 507 H448 M212 539 H448"/></g>';
    if (nova) {
      s += '<path d="M220 540 H380 L392 540 L400 460 L410 452 L418 470 L440 480" stroke="' + c("rojo") + '" stroke-width="4" fill="none"/>' +
        '<text x="330" y="467" font-size="16" fill="' + c("rojo") + '" font-family="sans-serif">¡S-12!</text>';
    } else {
      s += '<path d="M220 520 H440" stroke="' + c("turquesa") + '" stroke-width="4" fill="none"/>' +
        '<text x="226" y="560" font-size="14" fill="' + c("turquesa") + '" font-family="sans-serif">brillo relativo · Campo del Salar</text>';
    }
    s += '<rect x="316" y="595" width="28" height="8" fill="' + c("metal-2") + '"/>';
    // cuaderno de la Dra. Collao sobre la consola
    s += '<g transform="rotate(-6 525 588)"><rect x="480" y="572" width="90" height="26" rx="3" fill="' + c("rojo") + '"/>' +
      '<rect x="486" y="576" width="78" height="4" fill="' + c("papel") + '" opacity=".6"/></g>';
    // telescopio
    s += '<rect x="765" y="560" width="70" height="200" fill="' + c("metal") + '"/>' +
      '<ellipse cx="800" cy="760" rx="80" ry="16" fill="' + c("metal-2") + '"/>' +
      '<path d="M740 560 H860 L840 470 H760Z" fill="' + c("metal-2") + '"/>' +
      '<g transform="rotate(-8 800 500)">' +
      '<rect x="745" y="130" width="110" height="400" rx="14" fill="' + c("cupula") + '"/>' +
      '<rect x="740" y="130" width="120" height="30" rx="8" fill="' + c("metal") + '"/>' +
      '<rect x="745" y="330" width="110" height="18" fill="' + c("metal") + '"/>' +
      '<rect x="855" y="420" width="36" height="22" rx="4" fill="' + c("metal") + '"/>' +
      '<rect x="885" y="410" width="16" height="42" rx="3" fill="#1d1830"/></g>';
    // pizarra de leyes
    s += '<rect x="1228" y="190" width="316" height="282" rx="10" fill="' + c("madera") + '"/>' +
      '<rect x="1242" y="204" width="288" height="254" rx="4" fill="#1f3a33"/>' +
      A.textoLineas(["LEYES DEL", "CAMPO DEL SALAR"], 1260, 244, 24, c("papel"));
    if (ley) {
      s += A.textoLineas(["Todas las estrellas", "del Campo del Salar", "tienen brillo", "constante."], 1262, 310, 23, c("ambar-suave"));
      if (refutada) {
        s += '<path d="M1255 330 L1520 430" stroke="' + c("rojo") + '" stroke-width="6" stroke-linecap="round"/>' +
          '<text x="1480" y="440" font-size="60" fill="' + c("rojo") + '" font-family="sans-serif" font-weight="700">?</text>';
      }
    } else {
      s += A.textoLineas(["(pendiente)"], 1262, 330, 22, c("papel"), ' opacity=".5"');
    }
    // escalera de salida (abajo a la derecha)
    s += '<path d="M1410 900 V800 H1600 V900Z" fill="#141126"/>' +
      '<g stroke="' + c("muro-3") + '" stroke-width="6"><path d="M1420 820 H1600 M1440 850 H1600 M1460 880 H1600"/></g>' +
      '<path d="M1410 800 V740 M1410 740 H1600" stroke="' + c("metal") + '" stroke-width="8"/>';
    // Dra. Collao
    s += A.figura("collao", 1065, 800, 0.95);
    return s;
  });

  /* ---------- Archivo de placas ---------- */
  A.registrarEscena("c1-archivo", function () {
    var luz = A.uid("luz");
    var s = '<rect width="1600" height="900" fill="' + c("muro-2") + '"/>' +
      "<defs>" + A.radial(luz, [[0, c("ambar"), 0.28], [1, c("ambar"), 0]]) + "</defs>" +
      '<rect x="0" y="780" width="1600" height="120" fill="' + c("suelo") + '"/>';
    // estanterías del fondo
    s += '<rect x="470" y="110" width="640" height="440" fill="' + c("madera") + '"/>';
    var r = A.azar(9);
    for (var fila = 0; fila < 4; fila++) {
      var y = 130 + fila * 105;
      s += '<rect x="480" y="' + (y + 88) + '" width="620" height="10" fill="' + c("madera-2") + '"/>';
      var x = 490;
      while (x < 1080) {
        var w = 22 + r() * 40, h = 55 + r() * 30;
        var col = [c("ropa-1"), c("ropa-2"), c("ropa-3"), c("papel"), c("metal")][Math.floor(r() * 5)];
        s += '<rect x="' + x.toFixed(0) + '" y="' + (y + 88 - h).toFixed(0) + '" width="' + w.toFixed(0) + '" height="' + h.toFixed(0) + '" rx="3" fill="' + col + '" opacity=".85"/>';
        x += w + 4;
      }
    }
    // archivador de placas
    s += '<rect x="115" y="325" width="310" height="470" rx="8" fill="' + c("metal") + '"/>';
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 2; j++) {
        var dx = 135 + j * 145, dy = 345 + i * 110;
        s += '<rect x="' + dx + '" y="' + dy + '" width="130" height="95" rx="5" fill="' + c("metal-2") + '"/>' +
          '<rect x="' + (dx + 45) + '" y="' + (dy + 40) + '" width="40" height="10" rx="4" fill="' + c("metal") + '"/>' +
          '<rect x="' + (dx + 35) + '" y="' + (dy + 12) + '" width="60" height="18" fill="' + c("papel") + '"/>';
      }
    }
    // cajón abierto con placas de vidrio
    s += '<path d="M135 455 H265 L300 490 H100Z" fill="' + c("metal-2") + '"/>' +
      '<g fill="#cfe8f5" opacity=".7"><rect x="130" y="430" width="10" height="45"/><rect x="150" y="428" width="10" height="47"/><rect x="170" y="430" width="10" height="45"/><rect x="190" y="432" width="10" height="43"/></g>';
    // foto antigua enmarcada
    s += '<rect x="1150" y="150" width="160" height="150" rx="4" fill="' + c("madera-2") + '"/>' +
      '<rect x="1164" y="164" width="132" height="122" fill="' + c("papel") + '"/>' +
      '<path d="M1170 280 L1210 230 L1240 255 L1265 220 L1290 280Z" fill="' + c("arena-2") + '" opacity=".7"/>' +
      '<path d="M1200 250 A28 28 0 0 1 1256 250Z" fill="' + c("metal") + '"/>' +
      '<g fill="' + c("madera") + '"><circle cx="1182" cy="205" r="8"/><circle cx="1206" cy="200" r="8"/><circle cx="1280" cy="206" r="8"/></g>';
    // escritorio y bitácora
    s += '<rect x="560" y="640" width="500" height="26" rx="4" fill="' + c("madera-2") + '"/>' +
      '<rect x="580" y="666" width="22" height="120" fill="' + c("madera") + '"/><rect x="1020" y="666" width="22" height="120" fill="' + c("madera") + '"/>' +
      '<path d="M650 638 L760 628 L870 638 L870 610 L760 600 L650 610Z" fill="' + c("papel") + '"/>' +
      '<path d="M760 600 V628" stroke="' + c("madera") + '" stroke-width="3"/>' +
      '<g stroke="' + c("madera") + '" stroke-width="2" opacity=".6"><path d="M665 616 L745 609 M665 624 L745 617 M775 609 L855 616 M775 617 L855 624"/></g>';
    // lámpara
    s += '<circle cx="960" cy="560" r="150" fill="url(#' + luz + ')"/>' +
      '<path d="M960 640 V580 L990 540" stroke="' + c("metal") + '" stroke-width="6" fill="none"/>' +
      '<path d="M970 520 L1030 540 L1000 575Z" fill="' + c("ambar") + '"/>';
    // computador del catálogo digital
    s += '<rect x="1080" y="600" width="300" height="20" rx="4" fill="' + c("madera-2") + '"/>' +
      '<rect x="1100" y="620" width="18" height="160" fill="' + c("madera") + '"/><rect x="1340" y="620" width="18" height="160" fill="' + c("madera") + '"/>' +
      '<rect x="1110" y="410" width="230" height="165" rx="10" fill="' + c("metal") + '"/>' +
      '<rect x="1122" y="422" width="206" height="130" rx="4" fill="#0b1a24"/>' +
      '<g fill="' + c("turquesa") + '" opacity=".75"><rect x="1135" y="438" width="120" height="8"/><rect x="1135" y="458" width="170" height="6"/><rect x="1135" y="474" width="150" height="6"/><rect x="1135" y="490" width="165" height="6"/><rect x="1135" y="506" width="140" height="6"/></g>' +
      '<rect x="1210" y="575" width="30" height="25" fill="' + c("metal") + '"/>';
    // puerta de salida
    s += '<rect x="1430" y="325" width="140" height="460" rx="6" fill="' + c("madera") + '"/>' +
      '<rect x="1446" y="342" width="108" height="200" rx="4" fill="' + c("madera-2") + '"/>' +
      '<rect x="1446" y="560" width="108" height="210" rx="4" fill="' + c("madera-2") + '"/>' +
      '<circle cx="1448" cy="560" r="7" fill="' + c("ambar") + '"/>';
    return s;
  });

  /* ---------- Patio de Don Ramiro (atardecer) ---------- */
  A.registrarEscena("c1-gallinero", function () {
    var cielo = A.uid("tarde");
    var sol = A.uid("sol");
    var s = "<defs>" + A.degradado(cielo, [[0, c("cielo-2")], [0.45, c("horizonte")], [0.75, c("rosa")], [1, c("ambar-suave")]]) +
      A.radial(sol, [[0, c("ambar-suave"), 1], [0.5, c("ambar"), 0.6], [1, c("ambar"), 0]]) + "</defs>" +
      '<rect width="1600" height="900" fill="url(#' + cielo + ')"/>' +
      '<circle cx="1250" cy="520" r="160" fill="url(#' + sol + ')"/><circle cx="1250" cy="520" r="45" fill="' + c("ambar-suave") + '"/>' +
      A.cerros(560) + A.suelo(690);
    // muro de adobe y casa
    s += '<rect x="0" y="470" width="560" height="300" fill="' + c("arena-2") + '"/>' +
      '<path d="M-10 480 L280 400 L570 480Z" fill="' + c("metal") + '"/>' +
      '<rect x="90" y="560" width="110" height="80" rx="4" fill="' + c("ambar") + '" opacity=".7"/>' +
      '<rect x="330" y="580" width="100" height="190" rx="4" fill="' + c("madera") + '"/>';
    // cerco del gallinero
    s += '<g stroke="' + c("madera") + '" stroke-width="8">' +
      '<path d="M560 640 V800 M720 640 V800 M880 640 V800 M1440 640 V800 M1600 640 V800 M560 670 H900 M560 720 H900 M1440 670 H1600 M1440 720 H1600"/></g>';
    // olla y fogón
    s += '<g><path d="M1250 830 l30 -40 l30 40Z" fill="' + c("madera") + '"/>' +
      '<path d="M1240 740 H1360 V790 C1360 815 1240 815 1240 790Z" fill="#2b2540"/>' +
      '<rect x="1232" y="732" width="136" height="14" rx="6" fill="' + c("metal") + '"/>' +
      '<path d="M1270 860 q10 -30 20 0 q10 -40 25 0 q10 -26 20 0" fill="' + c("rojo") + '"/>' +
      '<path d="M1300 720 q-20 -30 0 -60 q20 -30 0 -60" stroke="' + c("papel") + '" stroke-width="4" fill="none" opacity=".45"/></g>';
    // gallinas de fondo
    s += A.gallina(620, 780, 0.5) + A.gallina(890, 800, 0.45) + A.gallina(1500, 790, 0.5);
    // Clotilde, la protagonista
    s += '<ellipse cx="730" cy="800" rx="90" ry="14" fill="#000" opacity=".2"/>' + A.gallina(725, 725, 1.25);
    // Don Ramiro
    s += A.figura("ramiro", 1060, 820, 0.95);
    return s;
  });
})(window.CA);
