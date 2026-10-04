/* Interfaz: ventanas modales, avisos, barra superior, cuaderno, glosario, ajustes, ayuda y teclado. */
(function (CA) {
  "use strict";

  var pila = [];
  var T = function () { return DATOS.config.textos; };

  function crear(tag, clase, html) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function boton(texto, clase, fn) {
    var b = crear("button", "boton" + (clase ? " " + clase : ""));
    b.type = "button";
    b.innerHTML = texto;
    if (fn) b.addEventListener("click", fn);
    return b;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function enfocables(raiz) {
    return Array.prototype.filter.call(
      raiz.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'),
      function (e) { return !e.disabled && e.offsetParent !== null; }
    );
  }

  /* ---------- Modales ---------- */
  function modal(op) {
    var capa = document.getElementById("capa-modal");
    var fondo = crear("div", "modal-fondo");
    var caja = crear("div", "modal" + (op.clase ? " " + op.clase : ""));
    caja.setAttribute("role", "dialog");
    caja.setAttribute("aria-modal", "true");
    var idTitulo = "mt-" + Math.random().toString(36).slice(2);
    caja.setAttribute("aria-labelledby", idTitulo);

    var cab = crear("div", "modal-cabecera");
    var h = crear("h2", null);
    h.id = idTitulo;
    h.textContent = op.titulo || "";
    var acciones = crear("div", "acciones");
    cab.appendChild(h);
    cab.appendChild(acciones);

    var cuerpo = crear("div", "modal-cuerpo");
    caja.appendChild(cab);
    caja.appendChild(cuerpo);
    fondo.appendChild(caja);

    var focoPrevio = document.activeElement;
    var cerrado = false;
    var m = {
      el: caja, cuerpo: cuerpo, acciones: acciones, titulo: h,
      cerrable: op.cerrable !== false,
      cerrar: function (valor) {
        if (cerrado) return;
        cerrado = true;
        fondo.remove();
        pila.splice(pila.indexOf(m), 1);
        if (focoPrevio && document.body.contains(focoPrevio)) focoPrevio.focus({ preventScroll: true });
        else if (pila.length) { var f = enfocables(pila[pila.length - 1].el)[0]; if (f) f.focus(); }
        if (op.alCerrar) op.alCerrar(valor);
      }
    };

    if (m.cerrable) {
      var bc = boton(T().cerrar + ' <span class="tecla" aria-hidden="true">Esc</span>', null, function () { m.cerrar(); });
      acciones.appendChild(bc);
    }

    capa.appendChild(fondo);
    pila.push(m);
    if (op.construir) op.construir(cuerpo, m);
    setTimeout(function () {
      var f = op.foco ? caja.querySelector(op.foco) : null;
      f = f || enfocables(cuerpo)[0] || enfocables(caja)[0];
      if (f) f.focus({ preventScroll: true });
      cuerpo.scrollTop = 0;
    }, 30);
    return m;
  }

  function modalSuperior() { return pila[pila.length - 1] || null; }

  /* ---------- Avisos breves (no bloquean ni desaparecen demasiado rápido) ---------- */
  function aviso(texto) {
    var cont = document.getElementById("avisos");
    if (!cont) return;
    var a = crear("div", "aviso");
    a.textContent = texto;
    cont.appendChild(a);
    setTimeout(function () { a.remove(); }, 6000);
    while (cont.children.length > 4) cont.firstChild.remove();
  }

  /* ---------- Barra superior ---------- */
  function actualizarBarra() {
    var cap = CA.Datos.capitulo(CA.estado.capitulo);
    var tc = document.getElementById("barra-capitulo");
    var to = document.getElementById("barra-objetivo");
    if (!tc || !to) return;
    if (!cap) { tc.textContent = ""; to.textContent = ""; return; }
    var escena = CA.Escena.actual();
    tc.textContent = "Capítulo " + cap.numero + " · " + cap.titulo + (escena ? " — " + escena.nombre : "");
    var obj = (cap.objetivos || []).filter(function (o) { return CA.cumple(o.si); })[0];
    to.textContent = obj ? T().objetivo + " " + CA.texto(obj.texto) : "";
  }

  /* ---------- Cuaderno de campo ---------- */
  function htmlEntrada(e) {
    var meta = [];
    if (e.autor) meta.push(esc(e.autor));
    if (e.obra) meta.push("<em>" + esc(e.obra) + "</em>");
    return '<article class="entrada"><h4>' + esc(e.titulo) + "</h4>" +
      (meta.length ? '<div class="meta">' + meta.join(" · ") + "</div>" : "") +
      CA.html(e.concepto) +
      (e.ejemplo ? '<div class="ejemplo"><strong>' + T().ejemplo + "</strong> " + CA.html(e.ejemplo).replace(/^<p>|<\/p>$/g, "") + "</div>" : "") +
      "</article>";
  }

  function pestanaRegistro(cuerpo) {
    var caps = CA.Datos.capitulos();
    var html = "";
    var alguno = false;
    caps.forEach(function (cid) {
      var cap = CA.Datos.capitulo(cid);
      if (!cap.observaciones) return;
      var ids = CA.estado.registro.filter(function (r) { return cap.observaciones[r]; });
      if (!ids.length) return;
      alguno = true;
      html += "<h3>" + esc("Capítulo " + cap.numero + " · " + cap.titulo) + "</h3>";
      if (cap.observacionesNecesarias && cid === CA.estado.capitulo) {
        var n = ids.filter(function (r) { return !cap.observaciones[r].contradice; }).length;
        html += '<p class="contador">' + T().observacionesContador.replace("{n}", n).replace("{total}", cap.observacionesNecesarias) + "</p>";
      }
      html += '<ul class="registro-lista">';
      ids.forEach(function (r) {
        var o = cap.observaciones[r];
        html += '<li class="' + (o.contradice ? "contradice" : "") + '"><span class="fuente">' + esc(o.fuente) + "</span> · " +
          esc(o.fecha || "") + "<br>" + esc(CA.texto(o.texto)) + "</li>";
      });
      html += "</ul>";
      if (cap.leyFormulada && CA.cumple(cap.leyFormulada.si)) {
        var refutada = CA.cumple(cap.leyFormulada.refutadaSi);
        html += '<div class="entrada' + (refutada ? " contradice" : "") + '" style="margin-top:.6rem"><h4>' + esc(cap.leyFormulada.titulo) + "</h4>" +
          "<p>" + (refutada ? "<s>" + esc(cap.leyFormulada.texto) + "</s> <strong style=\"color:var(--ui-error)\">" + esc(cap.leyFormulada.refutadaEtiqueta) + "</strong>" : esc(cap.leyFormulada.texto)) + "</p></div>";
      }
    });
    cuerpo.innerHTML = alguno ? html : "<p>" + T().registroVacio + "</p>";
  }

  function pestanaEntradas(cuerpo) {
    var todas = Object.keys(DATOS.cuaderno || {});
    var abiertas = todas.filter(function (id) { return CA.estado.cuaderno.indexOf(id) !== -1; });
    var html = '<p class="contador">' + T().entradasContador.replace("{n}", abiertas.length).replace("{total}", todas.length) + "</p>";
    html += '<div class="lista-entradas">';
    // Orden: el del archivo de datos.
    todas.forEach(function (id) {
      if (abiertas.indexOf(id) !== -1) html += htmlEntrada(DATOS.cuaderno[id]);
    });
    html += "</div>";
    if (!abiertas.length) html += "<p>" + T().cuadernoVacio + "</p>";
    cuerpo.innerHTML = html;
  }

  function pestanaGlosario(cuerpo) {
    var todos = Object.keys(DATOS.glosario || {});
    var abiertos = todos.filter(function (id) { return CA.estado.glosario.indexOf(id) !== -1; })
      .sort(function (a, b) { return DATOS.glosario[a].termino.localeCompare(DATOS.glosario[b].termino, "es"); });
    cuerpo.innerHTML = '<p class="contador">' + T().glosarioContador.replace("{n}", abiertos.length).replace("{total}", todos.length) + "</p>" +
      '<label class="solo-lector" for="buscar-glosario">' + T().buscar + "</label>" +
      '<input id="buscar-glosario" class="buscador" type="search" placeholder="' + esc(T().buscar) + '">' +
      '<div class="lista-entradas" id="lista-glosario"></div>';
    var listaEl = cuerpo.querySelector("#lista-glosario");
    function pintar(filtro) {
      var f = (filtro || "").toLowerCase();
      var html = "";
      abiertos.forEach(function (id) {
        var g = DATOS.glosario[id];
        if (f && (g.termino + " " + g.definicion).toLowerCase().indexOf(f) === -1) return;
        html += '<article class="entrada"><h4>' + esc(g.termino) + "</h4>" + CA.html(g.definicion) + "</article>";
      });
      if (!abiertos.length) html = "<p>" + T().glosarioVacio + "</p>";
      else if (!html) html = "<p>" + T().sinResultados + "</p>";
      listaEl.innerHTML = html;
    }
    cuerpo.querySelector("#buscar-glosario").addEventListener("input", function (e) { pintar(e.target.value); });
    pintar("");
  }

  function abrirCuaderno(pestana) {
    if (modalSuperior() && modalSuperior().tipo === "cuaderno") { modalSuperior().cerrar(); return; }
    var m = modal({
      titulo: T().cuadernoTitulo,
      construir: function (cuerpo) {
        var tabs = crear("div", "pestanas");
        tabs.setAttribute("role", "tablist");
        var zona = crear("div", null);
        var defs = [
          ["registro", T().pestanaRegistro, pestanaRegistro],
          ["entradas", T().pestanaEntradas, pestanaEntradas],
          ["glosario", T().pestanaGlosario, pestanaGlosario]
        ];
        var botones = {};
        function activar(id) {
          defs.forEach(function (d) { botones[d[0]].setAttribute("aria-selected", d[0] === id ? "true" : "false"); });
          defs.filter(function (d) { return d[0] === id; })[0][2](zona);
        }
        defs.forEach(function (d) {
          var b = boton(d[1], null, function () { activar(d[0]); });
          b.setAttribute("role", "tab");
          botones[d[0]] = b;
          tabs.appendChild(b);
        });
        cuerpo.appendChild(tabs);
        cuerpo.appendChild(zona);
        activar(pestana || "entradas");
      }
    });
    m.tipo = "cuaderno";
  }

  /* ---------- Ajustes ---------- */
  var ajustes = { escala: 1, contraste: false, sinAnimaciones: false };

  function aplicarAjustes() {
    document.documentElement.style.setProperty("--escala", ajustes.escala);
    document.body.classList.toggle("alto-contraste", !!ajustes.contraste);
    document.body.classList.toggle("sin-animaciones", !!ajustes.sinAnimaciones);
    if (CA.Escena && CA.Escena.ajustarTamano) setTimeout(CA.Escena.ajustarTamano, 0);
  }

  function abrirAjustes() {
    modal({
      titulo: T().ajustesTitulo,
      construir: function (cuerpo) {
        var tamanos = [[1, "A"], [1.2, "A+"], [1.4, "A++"], [1.6, "A+++"]];
        var html = "<h3>" + T().tamanoTexto + '</h3><div class="pestanas" role="group" aria-label="' + esc(T().tamanoTexto) + '">';
        tamanos.forEach(function (t) {
          html += '<button type="button" class="boton" data-escala="' + t[0] + '" aria-pressed="' + (ajustes.escala === t[0]) + '" style="font-size:' + (0.85 + (t[0] - 1)) + 'rem">' + t[1] + "</button>";
        });
        html += "</div>";
        html += '<h3>' + T().visual + '</h3><div class="campo"><label><input type="checkbox" id="aj-contraste"' + (ajustes.contraste ? " checked" : "") + "> " + T().altoContraste + "</label></div>" +
          '<div class="campo"><label><input type="checkbox" id="aj-anim"' + (ajustes.sinAnimaciones ? " checked" : "") + "> " + T().sinAnimaciones + "</label></div>" +
          '<p class="ayuda">' + (CA.Guardado.disponible ? T().guardadoActivo : T().guardadoNoDisponible) + "</p>";
        cuerpo.innerHTML = html;
        cuerpo.querySelectorAll("[data-escala]").forEach(function (b) {
          b.addEventListener("click", function () {
            ajustes.escala = parseFloat(b.dataset.escala);
            cuerpo.querySelectorAll("[data-escala]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
            aplicarAjustes();
            CA.Guardado.guardarAjustes(ajustes);
          });
        });
        cuerpo.querySelector("#aj-contraste").addEventListener("change", function (e) {
          ajustes.contraste = e.target.checked; aplicarAjustes(); CA.Guardado.guardarAjustes(ajustes);
        });
        cuerpo.querySelector("#aj-anim").addEventListener("change", function (e) {
          ajustes.sinAnimaciones = e.target.checked; aplicarAjustes(); CA.Guardado.guardarAjustes(ajustes);
        });
      }
    });
  }

  /* ---------- Ayuda de teclas ---------- */
  function abrirAyuda() {
    modal({
      titulo: T().ayudaTitulo,
      construir: function (cuerpo) {
        var filas = T().ayudaTeclas.map(function (f) {
          return "<tr><th scope=\"row\">" + esc(f[0]) + "</th><td>" + esc(f[1]) + "</td></tr>";
        }).join("");
        cuerpo.innerHTML = CA.html(T().ayudaIntro) + '<table class="tabla"><tbody>' + filas + "</tbody></table>";
      }
    });
  }

  /* ---------- Menú ---------- */
  function abrirMenu() {
    var m = modal({
      titulo: T().menuTitulo,
      construir: function (cuerpo, mm) {
        var c = crear("div", "inicio-botones");
        c.appendChild(boton(T().volverAlJuego, "boton-principal", function () { mm.cerrar(); }));
        c.appendChild(boton(T().mochila, null, function () { mm.cerrar(); CA.Inventario.abrir(); }));
        c.appendChild(boton(T().cuadernoTitulo, null, function () { mm.cerrar(); abrirCuaderno("entradas"); }));
        c.appendChild(boton(T().misRespuestas, null, function () { mm.cerrar(); CA.Exportar.abrir(); }));
        c.appendChild(boton(T().ajustes, null, function () { mm.cerrar(); abrirAjustes(); }));
        c.appendChild(boton(T().ayuda, null, function () { mm.cerrar(); abrirAyuda(); }));
        c.appendChild(boton(T().modoDocente, null, function () { mm.cerrar(); CA.Docente.abrir(); }));
        c.appendChild(boton(T().volverInicio, null, function () { mm.cerrar(); CA.Juego.pantallaInicio(); }));
        cuerpo.appendChild(c);
      }
    });
    m.tipo = "menu";
  }

  /* ---------- Teclado global ---------- */
  function teclado(ev) {
    var tag = (ev.target && ev.target.tagName) || "";
    var escribiendo = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
    var sup = modalSuperior();

    if (ev.key === "Escape") {
      if (sup && sup.cerrable) { ev.preventDefault(); sup.cerrar(); return; }
      if (CA.Escena.resaltado && CA.Escena.resaltado()) { CA.Escena.alternarResaltado(false); return; }
      return;
    }

    // En menús y ventanas, las flechas mueven el cursor entre botones (como en la Game Boy).
    if (sup && (ev.key === "ArrowDown" || ev.key === "ArrowUp") && tag === "BUTTON") {
      var fb = enfocables(sup.el).filter(function (e) { return e.tagName === "BUTTON"; });
      var j = fb.indexOf(document.activeElement);
      if (j !== -1) {
        ev.preventDefault();
        fb[(j + (ev.key === "ArrowDown" ? 1 : -1) + fb.length) % fb.length].focus();
      }
      return;
    }

    if (ev.key === "Tab" && sup) {
      var f = enfocables(sup.el);
      if (!f.length) return;
      var i = f.indexOf(document.activeElement);
      if (ev.shiftKey && (i <= 0)) { ev.preventDefault(); f[f.length - 1].focus(); }
      else if (!ev.shiftKey && (i === f.length - 1 || i === -1)) { ev.preventDefault(); f[0].focus(); }
      return;
    }

    if (escribiendo || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (!CA.Juego.enPartida()) return;
    var k = ev.key.toLowerCase();
    if (sup && !(k === "c" && sup.tipo === "cuaderno") && !(k === "i" && sup.tipo === "mochila")) return;
    if (CA.Dialogo.abierto() && k !== "c" && k !== "g") return;
    if (k === "r") { ev.preventDefault(); CA.Escena.alternarResaltado(); }
    else if (k === "c") { ev.preventDefault(); abrirCuaderno("entradas"); }
    else if (k === "g") { ev.preventDefault(); abrirCuaderno("glosario"); }
    else if (k === "i") { ev.preventDefault(); CA.Inventario.abrir(); }
    else if (ev.key === "?") { ev.preventDefault(); abrirAyuda(); }
    else if (k === "m") { ev.preventDefault(); abrirMenu(); }
  }

  CA.UI = {
    crear: crear,
    boton: boton,
    esc: esc,
    modal: modal,
    modalSuperior: modalSuperior,
    cerrarTodos: function () {
      while (pila.length) pila[pila.length - 1].cerrar();
    },
    aviso: aviso,
    actualizarBarra: actualizarBarra,
    abrirCuaderno: abrirCuaderno,
    abrirAjustes: abrirAjustes,
    abrirAyuda: abrirAyuda,
    abrirMenu: abrirMenu,
    htmlEntrada: htmlEntrada,

    iniciar: function () {
      var guardados = CA.Guardado.cargarAjustes();
      if (guardados) Object.keys(ajustes).forEach(function (k) { if (guardados[k] !== undefined) ajustes[k] = guardados[k]; });
      aplicarAjustes();

      document.getElementById("btn-cuaderno").addEventListener("click", function () { abrirCuaderno("entradas"); });
      document.getElementById("btn-glosario").addEventListener("click", function () { abrirCuaderno("glosario"); });
      document.getElementById("btn-resaltar").addEventListener("click", function () { CA.Escena.alternarResaltado(); });
      document.getElementById("btn-mochila").addEventListener("click", function () { CA.Inventario.abrir(); });
      document.getElementById("btn-ajustes").addEventListener("click", abrirAjustes);
      document.getElementById("btn-menu").addEventListener("click", abrirMenu);
      document.addEventListener("keydown", teclado);
    }
  };
})(window.CA);
