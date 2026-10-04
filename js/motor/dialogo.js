/* Cuadro de texto estilo Game Boy: el texto aparece letra por letra, ▼ para seguir
   y opciones con cursor ▶. Avanza solo cuando la persona lo decide (sin tiempo límite).
   Teclas: Enter / Espacio / Z para seguir; flechas para elegir; 1, 2, 3… eligen directo. */
(function (CA) {
  "use strict";

  var el;
  var abiertos = 0;
  var resolverActual = null;
  var focoPrevio = null;
  var escribiendo = null;   // { completar: fn } mientras el texto se está escribiendo

  function $(id) { return document.getElementById(id); }

  function animacionesActivas() {
    return !document.body.classList.contains("sin-animaciones") &&
      !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  /* Escribe el HTML de a poco: recorre los nodos de texto y los va llenando. */
  function maquina(contenedor, html, alTerminar) {
    contenedor.innerHTML = html;
    if (!animacionesActivas()) { alTerminar(); return null; }
    var nodos = [];
    (function rec(n) {
      n.childNodes.forEach(function (h) {
        if (h.nodeType === 3) { nodos.push({ n: h, t: h.textContent }); h.textContent = ""; }
        else rec(h);
      });
    })(contenedor);
    var i = 0, k = 0, activo = true;
    function terminar() {
      if (!activo) return;
      activo = false;
      nodos.forEach(function (x) { x.n.textContent = x.t; });
      alTerminar();
    }
    function tic() {
      if (!activo) return;
      var porTic = 3;
      while (porTic-- > 0 && i < nodos.length) {
        var x = nodos[i];
        k++;
        x.n.textContent = x.t.slice(0, k);
        if (k >= x.t.length) { i++; k = 0; }
      }
      if (i >= nodos.length) terminar();
      else setTimeout(tic, 16);
    }
    tic();
    return { completar: terminar };
  }

  function mostrarLinea(linea, opciones) {
    return new Promise(function (resolver) {
      var quien = linea.quien ? CA.Datos.personaje(linea.quien) : null;
      el.hidden = false;
      el.className = "dialogo" + (quien ? "" : " narrador") + (opciones && opciones.length ? " con-opciones" : "");
      el.innerHTML = "";

      var lector = document.createElement("div");
      lector.className = "solo-lector";
      lector.setAttribute("aria-live", "polite");

      var caja = document.createElement("div");
      caja.className = "dialogo-caja";

      if (quien) {
        var n = document.createElement("div");
        n.className = "dialogo-nombre";
        n.textContent = CA.texto(quien.nombre);
        el.appendChild(n);
        if (quien.retrato && CA.Pixel) {
          var img = document.createElement("img");
          img.className = "dialogo-retrato";
          img.alt = "";
          img.src = CA.Pixel.retrato(quien.retrato);
          caja.appendChild(img);
        }
      }

      var t = document.createElement("div");
      t.className = "dialogo-texto";
      t.setAttribute("aria-hidden", "true");
      caja.appendChild(t);

      var flecha = document.createElement("button");
      flecha.type = "button";
      flecha.className = "dialogo-flecha";
      flecha.setAttribute("aria-label", DATOS.config.textos.continuar);
      flecha.innerHTML = '<span aria-hidden="true">▼</span>';
      caja.appendChild(flecha);
      el.appendChild(caja);
      el.appendChild(lector);

      var html = CA.html(linea.texto);
      lector.innerHTML = (quien ? CA.UI.esc(CA.texto(quien.nombre)) + ": " : "") + html;

      var ops = null, botones = [];
      if (opciones && opciones.length) {
        ops = document.createElement("div");
        ops.className = "dialogo-opciones";
        ops.setAttribute("role", "group");
        ops.setAttribute("aria-label", "Opciones de respuesta");
        ops.hidden = true;
        opciones.forEach(function (op, i) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "opcion-gb";
          b.innerHTML = '<span class="cursor" aria-hidden="true">▶</span><span class="num">' + (i + 1) + ".</span> " + CA.html(op.texto).replace(/^<p>|<\/p>$/g, "");
          b.addEventListener("click", function () { terminar(op); });
          ops.appendChild(b);
          botones.push(b);
        });
        el.insertBefore(ops, caja);
        flecha.hidden = true;
      }

      function listo() {
        escribiendo = null;
        caja.classList.add("listo");
        if (ops) {
          ops.hidden = false;
          if (!document.querySelector(".modal-fondo")) botones[0].focus({ preventScroll: true });
        } else if (!document.querySelector(".modal-fondo")) {
          flecha.focus({ preventScroll: true });
        }
      }

      function terminar(op) {
        resolverActual = null;
        resolver(op);
      }

      flecha.addEventListener("click", function (e) { e.stopPropagation(); avanzar(); });
      caja.addEventListener("click", function () { avanzar(); });

      function avanzar() {
        if (escribiendo) { escribiendo.completar(); return; }
        if (!ops) terminar(null);
      }

      resolverActual = { opciones: opciones, terminar: terminar, avanzar: avanzar, botones: botones };
      escribiendo = { completar: function () {} };
      var m = maquina(t, html, listo);
      if (m) escribiendo = m;
      el.scrollTop = 0;
    });
  }

  function claveOpcion(dialogoId, linea, i) {
    return "dlg/" + dialogoId + "/" + (linea.id || "") + "/" + i;
  }

  async function correr(dialogoId, lineas) {
    var gen = CA.generacion;
    abiertos++;
    if (abiertos === 1) focoPrevio = document.activeElement;
    try {
      var i = 0, guardia = 0;
      while (i < lineas.length && guardia++ < 500) {
        var l = lineas[i];
        if (!CA.cumple(l.si)) { i++; continue; }
        if (l.acciones) await CA.ejecutar(l.acciones);
        var elegida = null;
        if (l.texto) {
          var ops = (l.opciones || []).map(function (op, k) { return { op: op, k: k }; }).filter(function (x) {
            if (!CA.cumple(x.op.si)) return false;
            if (x.op.unaVez && CA.estado.visitados[claveOpcion(dialogoId, l, x.k)]) return false;
            return true;
          });
          var res = await mostrarLinea(l, ops.map(function (x) { return x.op; }));
          if (gen !== CA.generacion) return;
          if (res) {
            var elegidaK = ops.filter(function (x) { return x.op === res; })[0];
            if (elegidaK) CA.estado.visitados[claveOpcion(dialogoId, l, elegidaK.k)] = true;
            elegida = res;
          }
        }
        var salto = elegida ? elegida.ir : l.ir;
        if (elegida && elegida.acciones) await CA.ejecutar(elegida.acciones);
        if (gen !== CA.generacion) return;
        if (salto === "fin") break;
        if (salto) {
          var j = lineas.findIndex(function (x) { return x.id === salto; });
          if (j === -1) { console.warn("Etiqueta de diálogo no encontrada:", salto); i++; }
          else i = j;
          continue;
        }
        i++;
      }
    } finally {
      if (gen === CA.generacion) abiertos--;
      if (gen === CA.generacion && abiertos === 0) {
        el.hidden = true;
        el.innerHTML = "";
        escribiendo = null;
        if (focoPrevio && document.body.contains(focoPrevio) && !document.querySelector(".modal-fondo")) {
          focoPrevio.focus({ preventScroll: true });
        }
        focoPrevio = null;
      }
    }
  }

  CA.Dialogo = {
    iniciar: function () {
      el = $("dialogo");
      document.addEventListener("keydown", function (ev) {
        if (!resolverActual || document.querySelector(".modal-fondo")) return;
        var tag = (ev.target && ev.target.tagName) || "";
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        var r = resolverActual;
        var hayOps = r.opciones && r.opciones.length;
        var n = parseInt(ev.key, 10);
        if (hayOps && !escribiendo && n >= 1 && n <= r.opciones.length) {
          ev.preventDefault();
          r.terminar(r.opciones[n - 1]);
          return;
        }
        if (hayOps && !escribiendo && (ev.key === "ArrowDown" || ev.key === "ArrowUp" || ev.key === "s" || ev.key === "w")) {
          ev.preventDefault();
          var i = r.botones.indexOf(document.activeElement);
          var d = ev.key === "ArrowDown" || ev.key === "s" ? 1 : -1;
          i = i === -1 ? 0 : (i + d + r.botones.length) % r.botones.length;
          r.botones[i].focus();
          return;
        }
        var esA = ev.key === "Enter" || ev.key === " " || ev.key === "z" || ev.key === "Z" || ev.key === "x" || ev.key === "X";
        if (!esA) return;
        // En una opción con foco, Enter/Espacio la eligen (comportamiento normal del botón).
        if (tag === "BUTTON" && ev.target.classList.contains("opcion-gb") && !escribiendo && (ev.key === "Enter" || ev.key === " ")) return;
        ev.preventDefault();
        if (escribiendo) { escribiendo.completar(); return; }
        if (hayOps) {
          if (ev.key === "z" || ev.key === "Z") {
            var b = r.botones.indexOf(document.activeElement);
            if (b !== -1) r.terminar(r.opciones[b]);
          }
          return;
        }
        r.avanzar();
      });
    },

    abierto: function () { return abiertos > 0; },

    // Máquina de escribir reutilizable (la usan también los duelos).
    escribir: maquina,

    // Botón A en pantalla táctil.
    botonA: function () {
      var r = resolverActual;
      if (!r) return;
      if (escribiendo) { escribiendo.completar(); return; }
      if (r.opciones && r.opciones.length) {
        var b = r.botones.indexOf(document.activeElement);
        if (b !== -1) r.terminar(r.opciones[b]);
        return;
      }
      r.avanzar();
    },

    // Cancela cualquier diálogo en curso (ver CA.reiniciarFlujo).
    reiniciar: function () {
      var r = resolverActual;
      resolverActual = null;
      abiertos = 0;
      focoPrevio = null;
      if (escribiendo) { try { escribiendo.completar(); } catch (e) { /* nada */ } }
      escribiendo = null;
      if (el) { el.hidden = true; el.innerHTML = ""; }
      if (r) r.terminar(null);
    },

    abrir: async function (id) {
      var d = CA.Datos.dialogo(id);
      if (!d) { console.warn("Diálogo no encontrado:", id); return; }
      await correr(id, Array.isArray(d) ? d : d.lineas);
    },

    decir: async function (texto, quien) {
      await correr("_mensaje", [{ quien: quien, texto: texto }]);
    }
  };
})(window.CA);
