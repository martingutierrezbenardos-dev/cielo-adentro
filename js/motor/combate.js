/* Duelos filosóficos: una pantalla de combate al estilo de los RPG de Game Boy.
   Arriba, la escena (rival a la derecha, tu lado a la izquierda) con sus cuadros de
   estado; abajo, el cuadro de texto y el menú de "movimientos" (argumentos, categorías…).
   No hay derrota: un error explica por qué y deja volver a intentar. */
(function (CA) {
  "use strict";

  var P = CA.Pixel;
  var C = P.col;
  var ANCHO = 240, ALTO = 100, ESC = 3;

  function animacionesActivas() {
    return !document.body.classList.contains("sin-animaciones") &&
      !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }
  function esperar(ms) { return new Promise(function (r) { setTimeout(r, animacionesActivas() ? ms : 0); }); }

  /* ---------- Iconos de 16×16 para lo que no es un personaje ---------- */
  var ICONOS = {
    pensamiento: [
      "................",
      "....OOOOOOO.....",
      "..OOWWWWWWWOO...",
      ".OWWWWWWWWWWWO..",
      "OWWWWWYYYWWWWWO.",
      "OWWWWYWWWYWWWWO.",
      "OWWWWWWWYWWWWWO.",
      "OWWWWWWYWWWWWWO.",
      ".OWWWWWWWWWWWO..",
      "..OOWWWYWWWOO...",
      "....OOOOOOO.....",
      "......OWWO......",
      ".......OO.......",
      "....OWWO........",
      ".....OO.........",
      "................"
    ],
    idea: [
      "................",
      "......OOOO......",
      "....OOYYYYOO....",
      "...OYYWWYYYYO...",
      "..OYYWYYYYYYYO..",
      "..OYWYYYYYYYYO..",
      "..OYYYYYYYYYYO..",
      "..OYYYYYYYYYYO..",
      "...OYYYYYYYYO...",
      "....OYYYYYYO....",
      ".....OYYYYO.....",
      ".....OGGGGO.....",
      ".....OggggO.....",
      ".....OGGGGO.....",
      "......OggO......",
      ".......OO......."
    ],
    estrella: [
      ".......OO.......",
      ".......OYO......",
      "......OYYO......",
      "......OYYYO.....",
      "OOOOOOOYYYOOOOO.",
      "OYYYYYYYYYYYYYO.",
      ".OYYYYWWYYYYYO..",
      "..OOYYWYYYYOO...",
      "....OYYYYYYO....",
      "...OYYYYYYYYO...",
      "...OYYYOOYYYYO..",
      "..OYYYO..OOYYO..",
      "..OYYO.....OYYO.",
      ".OYOO.......OYO.",
      ".OO..........OO.",
      "................"
    ],
    ley: [
      "................",
      ".OOOOOOOOOOOOOO.",
      ".OMMMMMMMMMMMMO.",
      ".OMGGGGGGGGGGMO.",
      ".OMGWWWWWWWGGMO.",
      ".OMGGGGGGGGGGMO.",
      ".OMGWWWWWWWWGMO.",
      ".OMGGGGGGGGGGMO.",
      ".OMGWWWWWGGGGMO.",
      ".OMGGGGGGGGGGMO.",
      ".OMMMMMMMMMMMMO.",
      ".OOOOOOOOOOOOOO.",
      "...OMO....OMO...",
      "...OMO....OMO...",
      "..OOMOO..OOMOO..",
      "................"
    ]
  };
  var TONOS = [C.crema, C.celeste, C.rosa, C.cian, C.lila, C.ambar, "#b8f0a0", C.blanco];

  function imagenIcono(id, tono) {
    var cols = { O: C.negro, W: tono || C.crema, Y: id === "pensamiento" ? C.azul : C.ambar, G: id === "ley" ? C.verde2 : C.gris2, g: C.gris3, M: C.madera1 };
    if (id === "idea") cols.W = C.blanco;
    if (id === "estrella") cols.W = C.blanco;
    return P.imagen("icono-" + id + "-" + (tono || ""), ICONOS[id] || ICONOS.idea, cols);
  }

  function imagenDe(spec, frente) {
    if (!spec) return null;
    if (spec.icono) return imagenIcono(spec.icono, spec.tono);
    return P.personaje(spec.sprite, frente ? "abajo" : "arriba", 0);
  }

  /* ---------- Fondos ---------- */
  var FONDOS = {
    planetario: { cielo: [C.noche1, C.noche2], suelo: C.noche3, plataforma: C.morado, borde: C.lila, estrellas: true },
    cupula: { cielo: [C.muro2, C.muro1], suelo: C.gris2, plataforma: C.gris1, borde: C.gris3, estrellas: false },
    noche: { cielo: [C.noche1, C.noche3], suelo: C.roca2, plataforma: C.arena2, borde: C.arena3, estrellas: true }
  };

  function T() { return DATOS.config.textos; }

  CA.Combate = {
    TONOS: TONOS,

    /* Pregunta final de opción múltiple dentro del duelo: se repite hasta acertar.
       Las opciones ya probadas quedan tachadas. */
    pregunta: async function (b, p) {
      var usadas = {};
      for (;;) {
        var i = await b.menu(T().dueloPregunta, p.opciones.map(function (op, k) {
          return { html: CA.UI.esc(op.texto), usada: usadas[k] };
        }), "**" + p.texto + "**");
        var op = p.opciones[i];
        if (op.correcta) {
          await b.animar("rival", "golpe");
          await b.decir('<span class="ok">**' + T().bien + "**</span> " + op.retro);
          return;
        }
        usadas[i] = true;
        await b.animar("tuyo", "temblar");
        await b.decir('<span class="mal">**' + T().noDelTodo + "**</span> " + op.retro);
      }
    },

    /* Crea la pantalla de duelo dentro de ctx.cuerpo (la ventana del puzle).
       op: { fondo, rival: {sprite|icono}, tuyo: {sprite|icono} } */
    crear: function (ctx, op) {
      var modal = ctx.modal;
      modal.el.classList.add("modal-combate");
      modal.el.parentNode.classList.add("combate-fondo");
      var raiz = CA.UI.crear("div", "combate");
      raiz.innerHTML =
        '<div class="combate-escena"><canvas width="' + ANCHO + '" height="' + ALTO + '" aria-hidden="true"></canvas>' +
        '<div class="combate-info rival" aria-live="polite"></div><div class="combate-info tuyo" aria-live="polite"></div></div>' +
        '<div class="combate-abajo"><div class="combate-texto" aria-live="polite"></div><div class="combate-menu" role="group" hidden></div></div>';
      ctx.cuerpo.appendChild(raiz);

      var lienzo = raiz.querySelector("canvas");
      var g = lienzo.getContext("2d");
      g.imageSmoothingEnabled = false;
      var elTexto = raiz.querySelector(".combate-texto");
      var elMenu = raiz.querySelector(".combate-menu");
      var elAbajo = raiz.querySelector(".combate-abajo");
      var infos = { rival: raiz.querySelector(".combate-info.rival"), tuyo: raiz.querySelector(".combate-info.tuyo") };
      var fondo = FONDOS[op.fondo] || FONDOS.planetario;

      var lados = {
        rival: { spec: op.rival, x: 156, y: 4, dx: 0, dy: 0, visible: true, brillo: 0 },
        tuyo: { spec: op.tuyo, x: 30, y: 50, dx: 0, dy: 0, visible: true, brillo: 0 }
      };
      var vivo = true;
      var t0 = performance.now();

      function dibujar() {
        if (!vivo) return;
        var t = performance.now() - t0;
        var anim = animacionesActivas();
        // cielo en franjas
        g.fillStyle = fondo.cielo[0]; g.fillRect(0, 0, ANCHO, ALTO);
        g.fillStyle = fondo.cielo[1]; g.fillRect(0, 36, ANCHO, 30);
        g.fillStyle = fondo.suelo; g.fillRect(0, 66, ANCHO, ALTO - 66);
        if (fondo.estrellas) {
          var r = P.azar(77);
          for (var i = 0; i < 40; i++) {
            var sx = Math.floor(r() * ANCHO), sy = Math.floor(r() * 60);
            g.fillStyle = (anim && (Math.floor(t / 600) + i) % 5 === 0) ? C.lila : C.crema;
            g.fillRect(sx, sy, 1, 1);
          }
        }
        // líneas de velocidad sutiles (como en los combates portátiles)
        g.fillStyle = "rgba(255,255,255,.08)";
        for (var k = 0; k < 4; k++) g.fillRect(0, 70 + k * 7, ANCHO, 1);
        // plataformas
        plataforma(180, 54, 46, 9);
        plataforma(54, 96, 54, 10);
        ["rival", "tuyo"].forEach(function (lado) {
          var s = lados[lado];
          if (!s.visible) return;
          var im = imagenDe(s.spec, lado === "rival");
          if (!im) return;
          var resp = anim && s.dy === 0 ? Math.round(Math.sin(t / 500 + (lado === "rival" ? 0 : 2)) * 1) : 0;
          var x = s.x + s.dx, y = s.y + s.dy + resp;
          g.save();
          g.beginPath(); g.rect(0, 0, ANCHO, lado === "tuyo" ? ALTO : 58); g.clip();
          g.drawImage(im, x, y, im.width * ESC, im.height * ESC);
          if (s.brillo > 0) {
            g.globalAlpha = s.brillo;
            g.globalCompositeOperation = "source-atop";
            g.fillStyle = C.blanco;
            g.fillRect(x, y, im.width * ESC, im.height * ESC);
          }
          g.restore();
        });
        requestAnimationFrame(dibujar);
      }
      function plataforma(cx, cy, rx, ry) {
        g.fillStyle = fondo.borde;
        elipse(cx, cy, rx + 2, ry + 2);
        g.fillStyle = fondo.plataforma;
        elipse(cx, cy, rx, ry);
      }
      function elipse(cx, cy, rx, ry) {
        for (var y = -ry; y <= ry; y++) {
          var w = Math.round(rx * Math.sqrt(1 - (y * y) / (ry * ry)));
          g.fillRect(cx - w, cy + y, w * 2, 1);
        }
      }
      requestAnimationFrame(dibujar);

      /* ----- Texto con "▼" ----- */
      var esperandoA = null;
      function decir(html) {
        elMenu.hidden = true;
        elAbajo.classList.remove("con-menu");
        return new Promise(function (resolver) {
          elTexto.innerHTML = "";
          var cont = document.createElement("div");
          elTexto.appendChild(cont);
          var flecha = document.createElement("button");
          flecha.type = "button";
          flecha.className = "dialogo-flecha";
          flecha.setAttribute("aria-label", DATOS.config.textos.continuar);
          flecha.innerHTML = '<span aria-hidden="true">▼</span>';
          flecha.hidden = true;
          elTexto.appendChild(flecha);
          var m = null;
          function listo() {
            m = null;
            flecha.hidden = false;
            if (CA.UI.modalSuperior() === modal) flecha.focus({ preventScroll: true });
          }
          function avanzar() {
            if (m) { m.completar(); return; }
            esperandoA = null;
            resolver();
          }
          flecha.addEventListener("click", function (e) { e.stopPropagation(); avanzar(); });
          elTexto.onclick = avanzar;
          esperandoA = avanzar;
          m = CA.Dialogo.escribir(cont, CA.html(html), listo);
          elTexto.scrollTop = 0;
        });
      }

      /* ----- Menú de movimientos ----- */
      var menuActivo = null;
      function menu(titulo, opciones, textoArriba) {
        return new Promise(function (resolver) {
          if (textoArriba != null) {
            elTexto.onclick = null;
            elTexto.innerHTML = "<div>" + CA.html(textoArriba) + "</div>";
          }
          elAbajo.classList.add("con-menu");
          elMenu.hidden = false;
          elMenu.innerHTML = "";
          elMenu.setAttribute("aria-label", titulo || "");
          if (titulo) elMenu.appendChild(CA.UI.crear("div", "titulo-menu", CA.UI.esc(titulo)));
          var desc = CA.UI.crear("div", "desc-mov");
          desc.setAttribute("aria-hidden", "true");
          var botones = [];
          opciones.forEach(function (o, i) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "opcion-gb" + (o.usada ? " usada" : "");
            b.innerHTML = '<span class="cursor" aria-hidden="true">▶</span><span class="num">' + (i + 1) + ".</span> <span>" + o.html + "</span>";
            if (o.deshabilitada) b.disabled = true;
            if (o.desc) b.setAttribute("aria-description", o.desc);
            b.addEventListener("click", function () { elegir(i); });
            b.addEventListener("focus", function () { desc.innerHTML = o.desc ? CA.html(o.desc).replace(/^<p>|<\/p>$/g, "") : ""; });
            b.addEventListener("mouseenter", function () { desc.innerHTML = o.desc ? CA.html(o.desc).replace(/^<p>|<\/p>$/g, "") : ""; });
            elMenu.appendChild(b);
            botones.push(b);
          });
          if (opciones.some(function (o) { return o.desc; })) elMenu.appendChild(desc);
          function elegir(i) {
            if (opciones[i].deshabilitada) return;
            menuActivo = null;
            elMenu.hidden = true;
            elAbajo.classList.remove("con-menu");
            resolver(i);
          }
          menuActivo = { botones: botones, elegir: elegir, opciones: opciones };
          var primero = botones.filter(function (b) { return !b.disabled; })[0];
          if (primero) primero.focus({ preventScroll: true });
        });
      }

      /* ----- Cuadros de estado ----- */
      function info(lado, d) {
        var el = infos[lado];
        if (!d) { el.hidden = true; return; }
        el.hidden = false;
        var html = '<span class="nombre">' + CA.UI.esc(d.nombre || "") + "</span>";
        if (d.detalle) html += '<span class="detalle">' + d.detalle + "</span>";
        if (d.vida) {
          var v = Math.max(0, Math.min(1, d.vida.valor));
          var clase = v > 0.5 ? "" : v > 0.2 ? "medio" : "bajo";
          if (d.vida.invertir) clase = v > 0.66 ? "" : v > 0.33 ? "medio" : "bajo";
          html += '<span class="vida"><span class="etq">' + CA.UI.esc(d.vida.etq || "") + '</span><span class="tubo"><span class="' + clase + '" style="width:' + Math.round(v * 100) + '%"></span></span>' +
            (d.vida.texto != null ? '<span class="valor">' + CA.UI.esc(d.vida.texto) + "</span>" : "") + "</span>";
        }
        if (d.equipo) {
          html += '<span class="equipo" aria-hidden="true">' + d.equipo.map(function (vivo) { return "<i" + (vivo ? "" : ' class="fuera"') + "></i>"; }).join("") + "</span>";
        }
        el.innerHTML = html;
      }

      /* ----- Animaciones ----- */
      async function animar(lado, tipo) {
        var s = lados[lado];
        if (!animacionesActivas()) {
          if (tipo === "caer") s.visible = false;
          if (tipo === "entrar") { s.visible = true; s.dx = 0; s.dy = 0; }
          return;
        }
        var i;
        if (tipo === "golpe") {
          for (i = 0; i < 4; i++) { s.brillo = i % 2 ? 0 : 0.8; s.dx = i % 2 ? 3 : -3; await esperar(70); }
          s.brillo = 0; s.dx = 0;
        } else if (tipo === "brillo") {
          for (i = 0; i < 3; i++) { s.brillo = 0.7; await esperar(90); s.brillo = 0; await esperar(90); }
        } else if (tipo === "caer") {
          for (i = 0; i <= 8; i++) { s.dy = i * 7; await esperar(35); }
          s.visible = false; s.dy = 0;
        } else if (tipo === "entrar") {
          s.visible = true;
          var desde = lado === "rival" ? 90 : -90;
          for (i = 8; i >= 0; i--) { s.dx = Math.round(desde * i / 8); await esperar(30); }
          s.dx = 0;
        } else if (tipo === "temblar") {
          raiz.classList.remove("sacudir"); void raiz.offsetWidth; raiz.classList.add("sacudir");
          await esperar(380);
        }
      }

      function sprite(lado, spec) { lados[lado].spec = spec; lados[lado].visible = true; lados[lado].dy = 0; }

      /* ----- Teclado propio del duelo ----- */
      function tecla(ev) {
        if (!vivo || CA.UI.modalSuperior() !== modal) return;
        var tag = (ev.target && ev.target.tagName) || "";
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        var n = parseInt(ev.key, 10);
        if (menuActivo && n >= 1 && n <= menuActivo.botones.length) {
          ev.preventDefault(); menuActivo.elegir(n - 1); return;
        }
        var esA = ev.key === "Enter" || ev.key === " " || ev.key === "z" || ev.key === "Z";
        if (!esA) return;
        if (tag === "BUTTON" && (ev.key === "Enter" || ev.key === " ")) return; // el botón con foco se activa solo
        if (menuActivo) {
          var b = menuActivo.botones.indexOf(document.activeElement);
          if (b !== -1) { ev.preventDefault(); menuActivo.elegir(b); }
          return;
        }
        if (esperandoA) { ev.preventDefault(); esperandoA(); }
      }
      document.addEventListener("keydown", tecla);
      var cerrarOriginal = modal.cerrar;
      modal.cerrar = function (v) {
        vivo = false;
        document.removeEventListener("keydown", tecla);
        cerrarOriginal(v);
      };

      return { decir: decir, menu: menu, info: info, animar: animar, sprite: sprite, esperar: esperar, vivo: function () { return vivo; } };
    }
  };
})(window.CA);
