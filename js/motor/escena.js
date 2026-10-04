/* Mundo explorable estilo Game Boy: mapas de baldosas, movimiento por cuadrícula,
   cámara, personajes, puertas y zonas con las que se interactúa (tecla A / Enter).
   Mantiene la interfaz CA.Escena que usa el resto del motor (ir, refrescar, actual…). */
(function (CA) {
  "use strict";

  var P = CA.Pixel;
  var T = 16;
  var VEL = 150;            // ms por baldosa al caminar
  var GIRO = 90;            // ms de toque corto: solo gira, no camina

  var elEscenario, elMarco, lienzo, ctx, elLista, elEtiquetas, elLugar;
  var ocupado = 0;
  var escenaPrevia = null;

  var mapa = null;          // { id, datos, filas, w, h, modo, objetos }
  var jug = { x: 0, y: 0, dir: "abajo", moviendo: null, paso: 0 };
  var actores = [];         // personajes visibles (hotspots con sprite)
  var dirActor = {};        // orientación actual de cada actor (por id de hotspot)
  var teclas = {};          // direcciones presionadas
  var ordenTeclas = [];
  var ruta = null;          // pasos pendientes al caminar con clic / lista
  var alLlegar = null;      // acción al terminar la ruta
  var resaltar = false;
  var tiempo = 0;
  var ultimo = 0;
  var pedidoInteraccion = false;

  var DIRS = { arriba: [0, -1], abajo: [0, 1], izq: [-1, 0], der: [1, 0] };
  var OPUESTA = { arriba: "abajo", abajo: "arriba", izq: "der", der: "izq" };

  function $(id) { return document.getElementById(id); }
  function esperar(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function animacionesActivas() {
    return !document.body.classList.contains("sin-animaciones") &&
      !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  /* ---------- Tamaño: la pantalla se escala en múltiplos enteros cuando cabe ---------- */
  function ajustarTamano() {
    if (!elMarco || !elEscenario) return;
    var r = elMarco.getBoundingClientRect();
    var W = P.ANCHO * T, H = P.ALTO * T;
    var dispW = Math.max(160, r.width - 12), dispH = Math.max(100, r.height - 12);
    var esc = Math.min(dispW / W, dispH / H);
    if (esc >= 2) esc = Math.floor(esc);
    elEscenario.style.width = Math.floor(W * esc) + "px";
    elEscenario.style.height = Math.floor(H * esc) + "px";
    elEscenario.style.setProperty("--px", esc);
    document.body.classList.toggle("compacto", esc < 2.2);
  }

  /* ---------- Datos del mapa ---------- */
  function cargarMapa(id) {
    var esc = CA.Datos.escena(id);
    var m = esc.mapa || { terreno: ["x"] };
    var filas = m.terreno.slice();
    var w = 0;
    filas.forEach(function (f) { w = Math.max(w, f.length); });
    mapa = { id: id, escena: esc, datos: m, filas: filas, w: w, h: filas.length, modo: m.modo || "noche" };
  }

  function letra(x, y) {
    if (!mapa || y < 0 || y >= mapa.h || x < 0 || x >= mapa.w) return "x";
    return mapa.filas[y][x] || "x";
  }

  function objetosVisibles() {
    return (mapa.datos.objetos || []).filter(function (o) { return CA.cumple(o[3]); });
  }

  function hotspotsVisibles() {
    return (mapa.escena.hotspots || []).filter(function (hs) { return CA.cumple(hs.si); });
  }

  function area(hs) {
    var e = hs.en || [0, 0];
    return { x: e[0], y: e[1], w: e[2] || 1, h: e[3] || 1 };
  }
  function dentro(hs, x, y) {
    var a = area(hs);
    return x >= a.x && x < a.x + a.w && y >= a.y && y < a.y + a.h;
  }

  // Tipo de la máscara del decorado en (x, y): "#" sólido, "m" mostrador, null libre.
  function mascaraDecor(x, y) {
    var res = null;
    objetosVisibles().forEach(function (o) {
      var d = P.decor[o[0]];
      if (!d) return;
      var dx = x - o[1], dy = y - o[2];
      if (dx < 0 || dy < 0 || dx >= d.w || dy >= d.h) return;
      var fila = (d.solido || [])[dy] || "";
      var ch = fila[dx];
      if (ch === "#" || ch === "m") res = res === "#" ? "#" : ch;
    });
    return res;
  }

  function actorEn(x, y) {
    for (var i = 0; i < actores.length; i++) if (actores[i].x === x && actores[i].y === y) return actores[i];
    return null;
  }

  function libre(x, y) {
    if (x < 0 || y < 0 || x >= mapa.w || y >= mapa.h) return false;
    if (P.esSolido(letra(x, y))) return false;
    if (mascaraDecor(x, y)) return false;
    if (actorEn(x, y)) return false;
    return true;
  }

  function esMostrador(x, y) {
    return P.esMostrador(letra(x, y)) || mascaraDecor(x, y) === "m";
  }

  /* ---------- Actores (personajes con sprite) ---------- */
  // Si un personaje u objeto cambia de lugar (otra variante del mismo id), se desliza hasta allí.
  var posActor = {};
  function actualizarActores() {
    actores = [];
    hotspotsVisibles().forEach(function (hs) {
      if (!hs.sprite) return;
      var a = area(hs);
      var act = { hs: hs, id: hs.id, sprite: hs.sprite, x: a.x, y: a.y, dir: dirActor[hs.id] || hs.mira || "abajo" };
      var prev = posActor[hs.id];
      if (prev && (prev.x !== a.x || prev.y !== a.y)) posActor[hs.id] = { x: a.x, y: a.y, ox: prev.vx != null ? prev.vx : prev.x, oy: prev.vy != null ? prev.vy : prev.y, t0: tiempo };
      else if (!prev) posActor[hs.id] = { x: a.x, y: a.y, ox: a.x, oy: a.y, t0: -1e9 };
      actores.push(act);
    });
  }
  // Posición visual (en baldosas) de un actor, con el deslizamiento en curso.
  function posVisualActor(a) {
    var p = posActor[a.id];
    if (!p || !animacionesActivas()) return { x: a.x, y: a.y };
    var k = Math.min(1, (tiempo - p.t0) / 900);
    k = k * k * (3 - 2 * k);
    var r = { x: p.ox + (a.x - p.ox) * k, y: p.oy + (a.y - p.oy) * k };
    p.vx = r.x; p.vy = r.y;
    return r;
  }

  /* ---------- Zona frente al jugador ---------- */
  function zonaEn(x, y, soloPisar) {
    var lista = hotspotsVisibles();
    for (var i = 0; i < lista.length; i++) {
      var hs = lista[i];
      if (!!hs.pisar !== !!soloPisar) continue;
      if (dentro(hs, x, y)) return hs;
    }
    return null;
  }

  function frente() {
    var d = DIRS[jug.dir];
    return { x: jug.x + d[0], y: jug.y + d[1] };
  }

  function zonaAlFrente() {
    var f = frente();
    var hs = zonaEn(f.x, f.y, false);
    if (!hs && esMostrador(f.x, f.y)) {
      var d = DIRS[jug.dir];
      hs = zonaEn(f.x + d[0], f.y + d[1], false);
    }
    return hs;
  }

  /* ---------- Interacción ---------- */
  function claveVisita(hs) { return CA.estado.escena + "/" + hs.id; }

  async function activar(hs, objeto) {
    if (ocupado > 0 || !hs) return;
    CA.estado.visitados[claveVisita(hs)] = true;
    // Los personajes se dan vuelta para mirar a quien les habla.
    if (hs.sprite) {
      var a = area(hs);
      var dx = jug.x - a.x, dy = jug.y - a.y;
      var dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "izq" : "der") : (dy < 0 ? "arriba" : "abajo");
      if (!hs.fijo) { dirActor[hs.id] = dir; actualizarActores(); }
    }
    CA.Escena.bloquear(true);
    try {
      if (objeto) {
        if (hs.usar && hs.usar[objeto]) await CA.ejecutar(hs.usar[objeto]);
        else await CA.Dialogo.decir(DATOS.config.textos.noSirveAqui.replace("{objeto}", CA.Datos.objeto(objeto).nombre));
      } else {
        await CA.ejecutar(hs.acciones);
      }
    } finally {
      CA.Escena.bloquear(false);
      CA.Escena.refrescar();
    }
  }

  function interactuar() {
    if (ocupado > 0 || jug.moviendo || CA.Dialogo.abierto() || CA.UI.modalSuperior()) return;
    var hs = zonaAlFrente();
    if (hs) activar(hs);
  }

  /* Se pisa una baldosa: puertas y salidas. Si después de las acciones seguimos en
     la misma escena (por ejemplo, alguien nos dijo «todavía no»), se retrocede un paso. */
  async function alPisar(desde) {
    var hs = zonaEn(jug.x, jug.y, true);
    if (!hs) return;
    var escenaAntes = CA.estado.escena;
    ruta = null;
    await activar(hs);
    if (CA.estado.escena === escenaAntes && mapa && desde && zonaEn(jug.x, jug.y, true) === hs) {
      var dir = jug.dir;
      await caminarA(desde.x, desde.y, true);
      jug.dir = dir;
      guardarPos();
    }
  }

  /* ---------- Movimiento ---------- */
  function guardarPos() {
    CA.estado.pos = { escena: CA.estado.escena, x: jug.x, y: jug.y, dir: jug.dir };
  }

  function caminarA(x, y, retroceso, alTerminar) {
    return new Promise(function (resolver) {
      var dx = x - jug.x, dy = y - jug.y;
      if (!retroceso) jug.dir = dx < 0 ? "izq" : dx > 0 ? "der" : dy < 0 ? "arriba" : "abajo";
      jug.moviendo = { ox: jug.x, oy: jug.y, t: 0, fin: function () { if (alTerminar) alTerminar(); resolver(); } };
      jug.x = x; jug.y = y;
      jug.paso = jug.paso === 1 ? 2 : 1;
    });
  }

  function intentarPaso(dir) {
    jug.dir = dir;
    var d = DIRS[dir];
    var nx = jug.x + d[0], ny = jug.y + d[1];
    if (!libre(nx, ny)) return false;
    var desde = { x: jug.x, y: jug.y };
    caminarA(nx, ny, false, function () {
      guardarPos();
      CA.Guardado.guardar();
      if (zonaEn(jug.x, jug.y, true)) alPisar(desde);
    });
    return true;
  }

  function puedeMoverse() {
    return mapa && ocupado === 0 && !CA.Dialogo.abierto() && !CA.UI.modalSuperior() && CA.Juego.enPartida() && !jug.moviendo;
  }

  var giroDesde = 0, dirGiro = null;
  function actualizar(dt) {
    tiempo += dt;
    if (jug.moviendo) {
      jug.moviendo.t += dt;
      if (jug.moviendo.t < VEL) return;
      var sobra = jug.moviendo.t - VEL;
      var fin = jug.moviendo.fin;
      jug.moviendo = null;
      fin();
      // Si se sigue caminando, el paso siguiente empieza sin pausa.
      actualizarQuieto(true);
      if (jug.moviendo) jug.moviendo.t = Math.min(sobra, VEL / 2);
      return;
    }
    actualizarQuieto();
  }

  function actualizarQuieto(continuo) {
    if (!puedeMoverse()) return;

    if (pedidoInteraccion) { pedidoInteraccion = false; interactuar(); return; }
    if (pendiente) { var pd = pendiente; pendiente = null; irHacia(pd); }

    var dir = ordenTeclas[ordenTeclas.length - 1];
    if (dir) {
      ruta = null; alLlegar = null; pendiente = null;
      if (continuo) dirGiro = dir;
      if (dir !== jug.dir && dirGiro !== dir) { jug.dir = dir; dirGiro = dir; giroDesde = tiempo; return; }
      if (dirGiro === dir && tiempo - giroDesde < GIRO) return;
      if (!intentarPaso(dir)) jug.paso = 0;
      return;
    }
    dirGiro = null;
    if (ruta && ruta.length) {
      var sig = ruta.shift();
      if (!libre(sig.x, sig.y)) { ruta = null; alLlegar = null; return; }
      var dx = sig.x - jug.x, dy = sig.y - jug.y;
      intentarPaso(dx < 0 ? "izq" : dx > 0 ? "der" : dy < 0 ? "arriba" : "abajo");
      return;
    }
    if (ruta && !ruta.length) {
      ruta = null;
      var f = alLlegar; alLlegar = null;
      if (f) f();
      return;
    }
    jug.paso = 0;
  }

  /* ---------- Rutas (clic, toque o lista accesible) ---------- */
  function buscarRuta(destinos) {
    var clave = function (x, y) { return x + "," + y; };
    var objetivo = {};
    destinos.forEach(function (d) { objetivo[clave(d.x, d.y)] = d; });
    if (objetivo[clave(jug.x, jug.y)]) return { pasos: [], destino: objetivo[clave(jug.x, jug.y)] };
    var cola = [{ x: jug.x, y: jug.y }], prev = {};
    prev[clave(jug.x, jug.y)] = null;
    while (cola.length) {
      var n = cola.shift();
      var ds = [[0, -1], [0, 1], [-1, 0], [1, 0]];
      for (var i = 0; i < 4; i++) {
        var nx = n.x + ds[i][0], ny = n.y + ds[i][1], k = clave(nx, ny);
        if (k in prev) continue;
        // Una puerta solo puede ser el destino final, nunca un paso intermedio.
        var esObjetivo = !!objetivo[k];
        if (!libre(nx, ny)) continue;
        if (!esObjetivo && zonaEn(nx, ny, true)) continue;
        prev[k] = n;
        if (esObjetivo) {
          var pasos = [], c = { x: nx, y: ny };
          while (c && !(c.x === jug.x && c.y === jug.y)) { pasos.unshift({ x: c.x, y: c.y }); c = prev[clave(c.x, c.y)]; }
          return { pasos: pasos, destino: objetivo[k] };
        }
        cola.push({ x: nx, y: ny });
      }
    }
    return null;
  }

  // Lugares desde donde se puede interactuar con una zona (incluye a través de mostradores).
  function puntosDeAcceso(hs) {
    var a = area(hs), res = [];
    for (var x = a.x; x < a.x + a.w; x++) {
      for (var y = a.y; y < a.y + a.h; y++) {
        [["arriba", 0, 1], ["abajo", 0, -1], ["izq", 1, 0], ["der", -1, 0]].forEach(function (d) {
          var px = x + d[1], py = y + d[2];
          if (dentro(hs, px, py)) return;
          res.push({ x: px, y: py, dir: d[0] });
          if (esMostrador(px, py)) res.push({ x: px + d[1], y: py + d[2], dir: d[0] });
        });
      }
    }
    return res;
  }

  var pendiente = null;     // destino pedido mientras se terminaba un paso

  function irHacia(hs) {
    if (!puedeMoverse()) {
      if (jug.moviendo && ocupado === 0) pendiente = hs;
      return;
    }
    pendiente = null;
    if (hs.pisar) {
      var a = area(hs);
      var r0 = buscarRuta([{ x: a.x, y: a.y }]);
      if (!r0) return CA.UI.aviso(DATOS.config.textos.noLlegas);
      ruta = r0.pasos; alLlegar = null;
      return;
    }
    var r = buscarRuta(puntosDeAcceso(hs));
    if (!r) { CA.UI.aviso(DATOS.config.textos.noLlegas); return; }
    ruta = r.pasos;
    alLlegar = function () { jug.dir = r.destino.dir; activar(hs); };
  }

  function clicEnPantalla(ev) {
    if (!puedeMoverse() && !(jug.moviendo)) return;
    var r = lienzo.getBoundingClientRect();
    var px = (ev.clientX - r.left) / r.width * P.ANCHO * T;
    var py = (ev.clientY - r.top) / r.height * P.ALTO * T;
    var cam = camara();
    var tx = Math.floor((px + cam.x) / T), ty = Math.floor((py + cam.y) / T);
    if (tx === jug.x && ty === jug.y) { pedidoInteraccion = true; return; }
    var hs = zonaEn(tx, ty, false) || zonaEn(tx, ty, true);
    if (!hs && esMostrador(tx, ty)) {
      // clic en un mostrador: buscar algo detrás
      [[0, -1], [0, 1], [-1, 0], [1, 0]].some(function (d) { hs = zonaEn(tx + d[0], ty + d[1], false); return hs; });
    }
    if (hs) {
      // ¿ya estamos frente a la zona? interactuar directo
      var fz = zonaAlFrente();
      if (fz === hs) { pedidoInteraccion = true; return; }
      if (jug.moviendo) return;
      irHacia(hs);
      return;
    }
    if (jug.moviendo) return;
    var rr = buscarRuta([{ x: tx, y: ty }]);
    if (rr) { ruta = rr.pasos; alLlegar = null; }
  }

  /* ---------- Cámara y dibujo ---------- */
  function posVisual() {
    var x = jug.x * T, y = jug.y * T;
    if (jug.moviendo) {
      var k = Math.min(1, jug.moviendo.t / VEL);
      x = (jug.moviendo.ox + (jug.x - jug.moviendo.ox) * k) * T;
      y = (jug.moviendo.oy + (jug.y - jug.moviendo.oy) * k) * T;
    }
    return { x: Math.round(x * 2) / 2, y: Math.round(y * 2) / 2 };
  }

  function camara() {
    var W = P.ANCHO * T, H = P.ALTO * T;
    var pv = posVisual();
    var mw = mapa.w * T, mh = mapa.h * T;
    var cx = mw <= W ? -(W - mw) / 2 : Math.max(0, Math.min(mw - W, pv.x + T / 2 - W / 2));
    var cy = mh <= H ? -(H - mh) / 2 : Math.max(0, Math.min(mh - H, pv.y + T / 2 - H / 2));
    return { x: Math.round(cx * 2) / 2, y: Math.round(cy * 2) / 2 };
  }

  function frameJugador() {
    if (!jug.moviendo) return 0;
    var k = jug.moviendo.t / VEL;
    return k > 0.25 && k < 0.85 ? jug.paso : 0;
  }

  function dibujar() {
    if (!ctx) return;
    var W = P.ANCHO * T, H = P.ALTO * T;
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = P.col.negro;
    ctx.fillRect(0, 0, W, H);
    if (!mapa) return;
    var anim = animacionesActivas();
    var f2 = anim ? Math.floor(tiempo / 700) % 2 : 0;
    var f4 = anim ? Math.floor(tiempo / 220) % 4 : 0;
    var cam = camara();
    var x0 = Math.max(0, Math.floor(cam.x / T)), y0 = Math.max(0, Math.floor(cam.y / T));
    var x1 = Math.min(mapa.w - 1, Math.floor((cam.x + W) / T)), y1 = Math.min(mapa.h - 1, Math.floor((cam.y + H) / T));

    // 1. Terreno
    for (var y = y0; y <= y1; y++) {
      for (var x = x0; x <= x1; x++) {
        var img = P.terrenoXY(letra(x, y), x, y, f2, mapa.modo);
        if (img) P.dib(ctx, img, x * T - cam.x, y * T - cam.y);
      }
    }

    // 2. Decorados y personajes, ordenados por su base (para que se tapen bien)
    var est = { nova: CA.E.bandera("c1-nova") };
    var capas = [];
    objetosVisibles().forEach(function (o) {
      var d = P.decor[o[0]];
      if (!d) return;
      var plano = d.solido && d.solido.every(function (f) { return !f || /^\.*$/.test(f); });
      // Lo que va encima de un mueble (libro, vaso…) se dibuja después del mueble.
      capas.push({ base: o[2] + d.h - 1 + (plano ? 0.05 : 0), dib: function () {
        var im = P.imagenDecor(o[0], d.frames === 4 ? f4 : f2 + (d.frames === 3 ? Math.floor(tiempo / 300) % 3 : 0), est);
        if (im) P.dib(ctx, im, o[1] * T - cam.x, o[2] * T - cam.y);
      } });
    });
    actores.forEach(function (a) {
      var v = posVisualActor(a);
      capas.push({ base: v.y + 0.1, dib: function () {
        var flota = P.esEco(a.sprite) && anim ? Math.round(Math.sin(tiempo / 400 + a.x) * 1.5) - 1 : 0;
        var paso = 0;
        if (/^(gallina|clotilde)/.test(a.sprite) && anim) paso = (Math.floor(tiempo / 600 + a.x * 3) % 5 === 0) ? 1 : 0;
        var vx = Math.round(v.x * T * 2) / 2 - cam.x, vy = Math.round(v.y * T * 2) / 2 - cam.y;
        if (P.esPersonaje(a.sprite)) {
          sombra(vx, vy);
          P.dib(ctx, P.personaje(a.sprite, a.dir, paso), vx, vy - 2 + flota);
        } else {
          var im = P.imagenDecor(a.sprite, f4, est);
          if (im) P.dib(ctx, im, vx, vy);
        }
      } });
    });
    var pv = posVisual();
    capas.push({ base: (pv.y / T) + 0.2, dib: function () {
      sombra(pv.x - cam.x, pv.y - cam.y);
      var salto = jug.moviendo && frameJugador() ? -1 : 0;
      P.dib(ctx, P.personaje("tu", jug.dir, frameJugador()), pv.x - cam.x, pv.y - cam.y - 2 + salto);
    } });
    capas.sort(function (a, b) { return a.base - b.base; });
    capas.forEach(function (c) { c.dib(); });

    // 3. Tinte de la hora (atardecer, noche), como las paletas nocturnas de la Game Boy Color
    var tinte = tinteActual();
    if (tinte) {
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = tinte;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    // 4. Ayudas siempre visibles: flechas en las salidas, «!» sobre lo que aún no has
    //    revisado y un botón «A» sobre lo que tienes enfrente.
    var bote = anim ? Math.round(Math.sin(tiempo / 180)) : 0;
    hotspotsVisibles().forEach(function (hs) {
      var a = area(hs);
      if (hs.pisar) {
        flecha(a, dirSalida(hs), cam, anim ? Math.round(Math.sin(tiempo / 160) * 1.5) : 0);
      } else if (!resaltar && (hs.marca || !CA.estado.visitados[claveVisita(hs)])) {
        exclamacion(Math.round((a.x + a.w / 2) * T - cam.x), Math.round(a.y * T - cam.y) - 3 + bote);
      }
    });
    if (!jug.moviendo && ocupado === 0 && !CA.Dialogo.abierto()) {
      var fz = zonaAlFrente();
      if (fz) {
        var af = area(fz);
        botonA(Math.round((af.x + af.w / 2) * T - cam.x), Math.round(af.y * T - cam.y) - (CA.estado.visitados[claveVisita(fz)] || resaltar ? 3 : 14) + bote);
      }
    }

    // 5. Marcadores de zonas (tecla R)
    if (resaltar) {
      hotspotsVisibles().forEach(function (hs) {
        var a = area(hs);
        var mx = (a.x + a.w / 2) * T - cam.x, my = a.y * T - cam.y;
        var nuevo = !CA.estado.visitados[claveVisita(hs)];
        marcador(Math.round(mx), Math.round(my) - 2 - (anim && f2 ? 1 : 0), hs.pisar ? "salida" : nuevo ? "nuevo" : "visto");
      });
      posicionarEtiquetas(cam);
    }
  }

  // mapa.tinte: un color, o una lista [{ si: condición, color }] (se usa el primero que se cumpla).
  function tinteActual() {
    var t = mapa.datos.tinte;
    if (!t) return null;
    if (typeof t === "string") return t;
    for (var i = 0; i < t.length; i++) if (CA.cumple(t[i].si)) return t[i].color;
    return null;
  }

  function sombra(x, y) {
    ctx.fillStyle = "rgba(0,0,0,.28)";
    ctx.fillRect(x + 3, y + 13, 10, 3);
    ctx.fillRect(x + 2, y + 14, 12, 1);
  }

  // Hacia dónde lleva una salida: al borde del mapa más cercano, o hacia arriba si hay un muro encima.
  function dirSalida(hs) {
    if (hs.flecha) return hs.flecha;
    var a = area(hs);
    if (a.x === 0) return "izq";
    if (a.x + a.w >= mapa.w) return "der";
    if (a.y + a.h >= mapa.h) return "abajo";
    if (a.y === 0) return "arriba";
    return P.esSolido(letra(a.x, a.y - 1)) || mascaraDecor(a.x, a.y - 1) ? "arriba" : "abajo";
  }

  // Dibuja un patrón de caracteres centrado en (x, y) por arriba (y = base del dibujo).
  function patron(filas, x, y, colores, rot) {
    var h = filas.length, w = filas[0].length;
    for (var fy = 0; fy < h; fy++) {
      for (var fx = 0; fx < w; fx++) {
        var ch = filas[fy][fx];
        if (ch === "." || !colores[ch]) continue;
        var rx = fx - (w - 1) / 2, ry = fy - (h - 1) / 2, px = rx, py = ry;
        if (rot === "abajo") py = -ry;
        else if (rot === "izq") { px = ry; py = rx; }
        else if (rot === "der") { px = -ry; py = rx; }
        ctx.fillStyle = colores[ch];
        ctx.fillRect(Math.round(x + px - 0.5), Math.round(y + py - 0.5), 1, 1);
      }
    }
  }

  var FLECHA = [
    "....O....",
    "...OTO...",
    "..OTTTO..",
    ".OTTWTTO.",
    "OOOTWTOOO",
    "..OTTTO..",
    "..OTTTO..",
    "..OOOOO.."
  ];
  // Flecha flotante sobre cada baldosa de una salida, apuntando hacia donde lleva.
  function flecha(a, dir, cam, mov) {
    var d = DIRS[dir];
    for (var x = a.x; x < a.x + a.w; x++) {
      for (var y = a.y; y < a.y + a.h; y++) {
        patron(FLECHA, x * T - cam.x + 8 + d[0] * (mov + 1), y * T - cam.y + 8 + d[1] * (mov + 1),
          { O: P.col.negro, T: P.col.turquesa, W: P.col.blanco }, dir);
      }
    }
  }

  var GLOBO = [
    ".OOOOOOO.",
    "OWWWRWWWO",
    "OWWWRWWWO",
    "OWWWRWWWO",
    "OWWWWWWWO",
    "OWWWRWWWO",
    ".OOOOOOO.",
    "...OWO...",
    "....O...."
  ];
  // Globito «!» sobre lo que aún no has revisado (y = punta inferior).
  function exclamacion(x, y) {
    patron(GLOBO, x, y - 5, { O: P.col.negro, W: P.col.blanco, R: P.col.rojo });
  }

  var BOTON_A = [
    "..OOOOO..",
    ".ORRRRRO.",
    "ORRRWRRRO",
    "ORRWRWRRO",
    "ORRWWWRRO",
    "ORRWRWRRO",
    ".ORRRRRO.",
    "..OOOOO.."
  ];
  // Botón «A» redondo: indica que se puede interactuar con lo que está enfrente.
  function botonA(x, y) {
    patron(BOTON_A, x, y - 5, { O: P.col.negro, R: P.col.rojo, W: P.col.blanco });
  }

  function marcador(x, y, tipo) {
    var col = tipo === "salida" ? P.col.turquesa : tipo === "nuevo" ? P.col.ambar : P.col.gris1;
    ctx.fillStyle = P.col.negro;
    ctx.fillRect(x - 4, y - 11, 9, 10);
    ctx.fillRect(x - 1, y - 1, 3, 2);
    ctx.fillStyle = col;
    ctx.fillRect(x - 3, y - 10, 7, 8);
    ctx.fillStyle = P.col.negro;
    if (tipo === "salida") { ctx.fillRect(x - 1, y - 9, 1, 6); ctx.fillRect(x, y - 8, 1, 4); ctx.fillRect(x + 1, y - 7, 1, 2); }
    else { ctx.fillRect(x, y - 9, 1, 4); ctx.fillRect(x, y - 4, 1, 1); }
  }

  function posicionarEtiquetas(cam) {
    if (!elEtiquetas) return;
    var esc = elEscenario.clientWidth / (P.ANCHO * T);
    Array.prototype.forEach.call(elEtiquetas.children, function (el) {
      var hs = el._hs;
      var a = area(hs);
      el.style.left = (((a.x + a.w / 2) * T - cam.x) * esc) + "px";
      el.style.top = (((a.y) * T - cam.y - 12) * esc) + "px";
    });
  }

  function bucle(t) {
    var dt = ultimo ? Math.min(100, t - ultimo) : 16;
    ultimo = t;
    actualizar(dt);
    dibujar();
    requestAnimationFrame(bucle);
  }

  /* ---------- Teclado y controles táctiles ---------- */
  var MAPA_TECLAS = { ArrowUp: "arriba", ArrowDown: "abajo", ArrowLeft: "izq", ArrowRight: "der", w: "arriba", s: "abajo", a: "izq", d: "der", W: "arriba", S: "abajo", A: "izq", D: "der" };

  function presionar(dir) {
    if (!teclas[dir]) { teclas[dir] = true; ordenTeclas.push(dir); }
  }
  function soltar(dir) {
    delete teclas[dir];
    ordenTeclas = ordenTeclas.filter(function (d) { return d !== dir; });
  }
  function soltarTodo() { teclas = {}; ordenTeclas = []; }

  function enJuegoLibre(ev) {
    var tag = (ev.target && ev.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return false;
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
    if (!CA.Juego.enPartida() || CA.UI.modalSuperior() || CA.Dialogo.abierto()) return false;
    return true;
  }

  function teclaAbajo(ev) {
    if (!enJuegoLibre(ev)) return;
    var dir = MAPA_TECLAS[ev.key];
    var enLista = ev.target && ev.target.closest && ev.target.closest("#hotspots");
    if (dir && !enLista) { ev.preventDefault(); presionar(dir); return; }
    var tag = (ev.target && ev.target.tagName) || "";
    if ((ev.key === "Enter" || ev.key === " " || ev.key === "z" || ev.key === "Z") && tag !== "BUTTON" && tag !== "A" && !ev.repeat) {
      ev.preventDefault();
      pedidoInteraccion = true;
    }
  }
  function teclaArriba(ev) {
    var dir = MAPA_TECLAS[ev.key];
    if (dir) soltar(dir);
  }

  function crearControles() {
    var c = $("controles");
    if (!c) return;
    c.innerHTML =
      '<div class="cruceta" aria-hidden="true">' +
      '<button type="button" tabindex="-1" data-dir="arriba" class="c-arriba">▲</button>' +
      '<button type="button" tabindex="-1" data-dir="izq" class="c-izq">◀</button>' +
      '<span class="c-centro"></span>' +
      '<button type="button" tabindex="-1" data-dir="der" class="c-der">▶</button>' +
      '<button type="button" tabindex="-1" data-dir="abajo" class="c-abajo">▼</button>' +
      "</div>" +
      '<div class="botones-ab">' +
      '<button type="button" tabindex="-1" class="b-b" data-b="1" aria-label="B (volver)">B</button>' +
      '<button type="button" tabindex="-1" class="b-a" data-a="1" aria-label="A (interactuar)">A</button>' +
      "</div>";
    c.querySelectorAll("[data-dir]").forEach(function (b) {
      var d = b.dataset.dir;
      b.addEventListener("pointerdown", function (e) { e.preventDefault(); presionar(d); b.classList.add("activo"); });
      ["pointerup", "pointerleave", "pointercancel"].forEach(function (n) {
        b.addEventListener(n, function () { soltar(d); b.classList.remove("activo"); });
      });
    });
    c.querySelector("[data-a]").addEventListener("click", function () {
      if (CA.Dialogo.abierto()) CA.Dialogo.botonA();
      else pedidoInteraccion = true;
    });
    c.querySelector("[data-b]").addEventListener("click", function () {
      if (CA.Dialogo.abierto()) CA.Dialogo.botonA();
      else if (CA.UI.modalSuperior() && CA.UI.modalSuperior().cerrable) CA.UI.modalSuperior().cerrar();
    });
  }

  /* ---------- Lista accesible de zonas (Tab) y etiquetas visibles (R) ---------- */
  function refrescarLista() {
    if (!elLista) return;
    var foco = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.hs : null;
    elLista.innerHTML = "";
    if (elEtiquetas) elEtiquetas.innerHTML = "";
    hotspotsVisibles().forEach(function (hs, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "hotspot" + (hs.pisar ? " salida" : "");
      b.dataset.hs = hs.id + "#" + i;
      b.textContent = CA.texto(hs.etiqueta) + (hs.pisar ? " (ir)" : "");
      b.addEventListener("click", function () { irHacia(hs); });
      elLista.appendChild(b);
      if (elEtiquetas) {
        var e = document.createElement("span");
        e.className = "etiqueta-zona" + (hs.pisar ? " salida" : "");
        e.textContent = CA.texto(hs.etiqueta);
        e._hs = hs;
        elEtiquetas.appendChild(e);
      }
    });
    if (foco) {
      var mismo = elLista.querySelector('[data-hs="' + foco + '"]');
      if (mismo) mismo.focus({ preventScroll: true });
    }
  }

  /* ---------- Interfaz pública ---------- */
  CA.Escena = {
    iniciar: function () {
      elEscenario = $("escenario");
      elMarco = $("escenario-marco");
      elLista = $("hotspots");
      elEtiquetas = $("etiquetas");
      elLugar = $("lugar");
      lienzo = $("pantalla");
      lienzo.width = P.ANCHO * T * 2;   // el doble de píxeles (ver P.dib)
      lienzo.height = P.ALTO * T * 2;
      ctx = lienzo.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      window.addEventListener("resize", ajustarTamano);
      document.addEventListener("keydown", teclaAbajo);
      document.addEventListener("keyup", teclaArriba);
      window.addEventListener("blur", soltarTodo);
      lienzo.addEventListener("click", clicEnPantalla);
      crearControles();
      ajustarTamano();
      requestAnimationFrame(bucle);
    },

    ajustarTamano: ajustarTamano,

    bloquear: function (si) {
      ocupado = Math.max(0, ocupado + (si ? 1 : -1));
      if (ocupado > 0) { elLista.setAttribute("inert", ""); soltarTodo(); ruta = null; }
      else elLista.removeAttribute("inert");
    },

    ocupado: function () { return ocupado > 0; },

    desbloquearTodo: function () {
      ocupado = 0;
      ruta = null;
      soltarTodo();
      if (jug.moviendo) { var f = jug.moviendo.fin; jug.moviendo = null; f(); }
      if (elLista) elLista.removeAttribute("inert");
    },

    actual: function () { return CA.Datos.escena(CA.estado.escena); },

    // Objeto elegido en la mochila: se usa en lo que está enfrente.
    usarObjeto: function (objeto) {
      var hs = zonaAlFrente();
      if (hs) { activar(hs, objeto); return; }
      CA.Dialogo.decir(DATOS.config.textos.nadaEnfrente.replace("{objeto}", CA.Datos.objeto(objeto).nombre));
    },

    ir: async function (id) {
      var escena = CA.Datos.escena(id);
      if (!escena) { console.warn("Escena no encontrada:", id); return; }
      var cap = CA.Datos.capituloDe("escenas", id);
      if (cap) CA.estado.capitulo = cap;
      var previa = CA.estado.escena;
      var anim = animacionesActivas() && previa && previa !== id;
      if (anim) { elEscenario.classList.add("fundido"); await esperar(260); }
      ruta = null; alLlegar = null; pendiente = null; soltarTodo();
      if (jug.moviendo) { var f = jug.moviendo.fin; jug.moviendo = null; f(); }

      cargarMapa(id);
      dirActor = {};
      posActor = {};
      var pos = CA.estado.pos;
      var m = mapa.datos;
      var spawn;
      if (pos && pos.escena === id && (previa === id || previa === null)) spawn = [pos.x, pos.y, pos.dir];
      else spawn = (m.desde && previa && m.desde[previa]) || m.inicio || [1, 1, "abajo"];
      jug.x = spawn[0]; jug.y = spawn[1]; jug.dir = spawn[2] || "abajo"; jug.paso = 0;
      escenaPrevia = previa;
      CA.estado.escena = id;
      guardarPos();
      CA.Escena.refrescar();
      if (elLugar) {
        elLugar.textContent = escena.nombre;
        elLugar.classList.remove("ver"); void elLugar.offsetWidth; elLugar.classList.add("ver");
      }
      if (anim) { elEscenario.classList.remove("fundido"); await esperar(120); }
      CA.UI.actualizarBarra();
      CA.Guardado.guardar();
      if (escena.alEntrar) {
        CA.Escena.bloquear(true);
        try { await CA.ejecutar(escena.alEntrar); } finally { CA.Escena.bloquear(false); }
      }
    },

    refrescar: function () {
      if (!mapa || !CA.Escena.actual()) return;
      if (mapa.id !== CA.estado.escena) cargarMapa(CA.estado.escena);
      elEscenario.setAttribute("aria-label", "Escena: " + mapa.escena.nombre);
      actualizarActores();
      refrescarLista();
    },

    alternarResaltado: function (forzar) {
      resaltar = typeof forzar === "boolean" ? forzar : !resaltar;
      elEscenario.classList.toggle("resaltar", resaltar);
      var btn = $("btn-resaltar");
      if (btn) btn.setAttribute("aria-pressed", resaltar ? "true" : "false");
      return resaltar;
    },

    resaltado: function () { return resaltar; },

    // Para pruebas y para el modo docente.
    _jugador: function () { return { x: jug.x, y: jug.y, dir: jug.dir }; },
    _moviendo: function () { return !!(jug.moviendo || (ruta && ruta.length) || pendiente); },
    _escenaPrevia: function () { return escenaPrevia; }
  };
})(window.CA);
