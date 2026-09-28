/* Diálogos con opciones. Avanzan solo cuando la persona pulsa (sin presión de tiempo). */
(function (CA) {
  "use strict";

  var el;
  var abiertos = 0;
  var resolverActual = null;
  var focoPrevio = null;

  function $(id) { return document.getElementById(id); }

  function mostrarLinea(linea, opciones) {
    return new Promise(function (resolver) {
      var quien = linea.quien ? CA.Datos.personaje(linea.quien) : null;
      el.hidden = false;
      el.className = "dialogo" + (quien && quien.retrato ? "" : " sin-retrato") + (quien ? "" : " narrador");
      el.innerHTML = "";

      if (quien && quien.retrato) {
        var r = document.createElement("div");
        r.className = "dialogo-retrato";
        r.setAttribute("aria-hidden", "true");
        r.innerHTML = CA.Arte.retrato(quien.retrato);
        el.appendChild(r);
      }

      var cont = document.createElement("div");
      if (quien) {
        var n = document.createElement("div");
        n.className = "dialogo-nombre";
        n.textContent = CA.texto(quien.nombre);
        cont.appendChild(n);
      }
      var t = document.createElement("div");
      t.className = "dialogo-texto";
      t.innerHTML = CA.html(linea.texto);
      cont.appendChild(t);

      var primerBoton;
      if (opciones && opciones.length) {
        var ops = document.createElement("div");
        ops.className = "dialogo-opciones";
        ops.setAttribute("role", "group");
        ops.setAttribute("aria-label", "Opciones de respuesta");
        opciones.forEach(function (op, i) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "boton";
          b.innerHTML = '<span class="num">' + (i + 1) + ".</span> " + CA.html(op.texto).replace(/^<p>|<\/p>$/g, "");
          b.addEventListener("click", function () { terminar(op); });
          ops.appendChild(b);
          if (!primerBoton) primerBoton = b;
        });
        cont.appendChild(ops);
      } else {
        var c = document.createElement("div");
        c.className = "dialogo-continuar";
        var b2 = document.createElement("button");
        b2.type = "button";
        b2.className = "boton boton-principal";
        b2.innerHTML = DATOS.config.textos.continuar + ' <span class="tecla" aria-hidden="true">Enter</span>';
        b2.addEventListener("click", function () { terminar(null); });
        c.appendChild(b2);
        cont.appendChild(c);
        primerBoton = b2;
      }
      el.appendChild(cont);
      el.scrollTop = 0;

      function terminar(op) {
        resolverActual = null;
        resolver(op);
      }
      resolverActual = { opciones: opciones, terminar: terminar };
      if (primerBoton && !document.querySelector(".modal-fondo")) primerBoton.focus({ preventScroll: true });
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
        var n = parseInt(ev.key, 10);
        if (resolverActual.opciones && resolverActual.opciones.length && n >= 1 && n <= resolverActual.opciones.length) {
          ev.preventDefault();
          resolverActual.terminar(resolverActual.opciones[n - 1]);
        } else if ((!resolverActual.opciones || !resolverActual.opciones.length) && ev.key === "Enter" && tag !== "BUTTON") {
          ev.preventDefault();
          resolverActual.terminar(null);
        }
      });
    },

    abierto: function () { return abiertos > 0; },

    // Cancela cualquier diálogo en curso (ver CA.reiniciarFlujo).
    reiniciar: function () {
      var r = resolverActual;
      resolverActual = null;
      abiertos = 0;
      focoPrevio = null;
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
