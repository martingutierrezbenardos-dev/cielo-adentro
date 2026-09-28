/* Escenas: fondo SVG + zonas clicables (hotspots) como botones accesibles. */
(function (CA) {
  "use strict";

  var elEscenario, elFondo, elHotspots, elMarco;
  var ocupado = 0;

  function $(id) { return document.getElementById(id); }

  function ajustarTamano() {
    if (!elMarco) return;
    var r = elMarco.getBoundingClientRect();
    var disponibleW = Math.max(200, r.width - 16);
    var disponibleH = Math.max(120, r.height - 16);
    var w = Math.min(disponibleW, disponibleH * 16 / 9);
    var h = w * 9 / 16;
    elEscenario.style.width = Math.floor(w) + "px";
    elEscenario.style.height = Math.floor(h) + "px";
  }

  function esperar(ms) {
    return new Promise(function (res) { setTimeout(res, ms); });
  }

  function animacionesActivas() {
    return !document.body.classList.contains("sin-animaciones") &&
      !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function claveVisita(escenaId, hs) { return escenaId + "/" + hs.id; }

  async function alPulsar(hs) {
    if (ocupado > 0) return;
    var escenaId = CA.estado.escena;
    CA.estado.visitados[claveVisita(escenaId, hs)] = true;
    var objeto = CA.Inventario.seleccionado();
    CA.Escena.bloquear(true);
    try {
      if (objeto) {
        CA.Inventario.deseleccionar();
        if (hs.usar && hs.usar[objeto]) {
          await CA.ejecutar(hs.usar[objeto]);
        } else {
          await CA.Dialogo.decir(DATOS.config.textos.noSirveAqui.replace("{objeto}", CA.Datos.objeto(objeto).nombre));
        }
      } else {
        await CA.ejecutar(hs.acciones);
      }
    } finally {
      CA.Escena.bloquear(false);
      CA.Escena.refrescar();
    }
  }

  CA.Escena = {
    iniciar: function () {
      elEscenario = $("escenario");
      elFondo = $("fondo");
      elHotspots = $("hotspots");
      elMarco = $("escenario-marco");
      window.addEventListener("resize", ajustarTamano);
      ajustarTamano();
    },

    ajustarTamano: ajustarTamano,

    bloquear: function (si) {
      ocupado = Math.max(0, ocupado + (si ? 1 : -1));
      if (ocupado > 0) elHotspots.setAttribute("inert", "");
      else elHotspots.removeAttribute("inert");
    },

    ocupado: function () { return ocupado > 0; },

    desbloquearTodo: function () {
      ocupado = 0;
      if (elHotspots) elHotspots.removeAttribute("inert");
    },

    actual: function () { return CA.Datos.escena(CA.estado.escena); },

    ir: async function (id) {
      var escena = CA.Datos.escena(id);
      if (!escena) { console.warn("Escena no encontrada:", id); return; }
      var cap = CA.Datos.capituloDe("escenas", id);
      if (cap) CA.estado.capitulo = cap;
      var anim = animacionesActivas() && CA.estado.escena && CA.estado.escena !== id;
      if (anim) { elEscenario.classList.add("fundido"); await esperar(300); }
      CA.estado.escena = id;
      CA.Escena.refrescar();
      if (anim) { elEscenario.classList.remove("fundido"); await esperar(150); }
      CA.UI.actualizarBarra();
      CA.Guardado.guardar();
      if (escena.alEntrar) {
        CA.Escena.bloquear(true);
        try { await CA.ejecutar(escena.alEntrar); } finally { CA.Escena.bloquear(false); }
      }
      // Foco al primer hotspot para navegar con teclado.
      if (!document.querySelector(".modal-fondo") && !CA.Dialogo.abierto()) {
        var primero = elHotspots.querySelector(".hotspot");
        if (primero && document.activeElement === document.body) primero.focus({ preventScroll: true });
      }
    },

    refrescar: function () {
      var escena = CA.Escena.actual();
      if (!escena || !elFondo) return;
      var enfocado = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.hs : null;

      elFondo.innerHTML = CA.Arte.escena(escena.fondo, CA.estado);
      elEscenario.setAttribute("aria-label", "Escena: " + escena.nombre);

      elHotspots.innerHTML = "";
      (escena.hotspots || []).forEach(function (hs) {
        if (!CA.cumple(hs.si)) return;
        var b = document.createElement("button");
        b.type = "button";
        b.className = "hotspot" + (hs.salida ? " salida" : "") + (hs.etiquetaArriba || (hs.zona[1] + hs.zona[3] > 86) ? " etiqueta-arriba" : "") +
          (hs.zona[0] + hs.zona[2] / 2 < 18 ? " et-izq" : (hs.zona[0] + hs.zona[2] / 2 > 76 ? " et-der" : ""));
        if (!CA.estado.visitados[claveVisita(CA.estado.escena, hs)]) b.classList.add("nuevo");
        b.style.left = hs.zona[0] + "%";
        b.style.top = hs.zona[1] + "%";
        b.style.width = hs.zona[2] + "%";
        b.style.height = hs.zona[3] + "%";
        b.dataset.hs = hs.id;
        b.setAttribute("aria-label", CA.texto(hs.etiqueta) + (hs.salida ? " (ir)" : ""));
        var et = document.createElement("span");
        et.className = "hs-etiqueta";
        et.textContent = CA.texto(hs.etiqueta);
        b.appendChild(et);
        b.addEventListener("click", function () { alPulsar(hs); });
        elHotspots.appendChild(b);
      });

      if (enfocado) {
        var mismo = elHotspots.querySelector('[data-hs="' + enfocado + '"]');
        if (mismo) mismo.focus({ preventScroll: true });
      }
    },

    alternarResaltado: function (forzar) {
      var activo = typeof forzar === "boolean" ? forzar : !elEscenario.classList.contains("resaltar");
      elEscenario.classList.toggle("resaltar", activo);
      var btn = $("btn-resaltar");
      if (btn) btn.setAttribute("aria-pressed", activo ? "true" : "false");
      return activo;
    }
  };
})(window.CA);
