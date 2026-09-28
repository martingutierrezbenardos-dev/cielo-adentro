/* Guardado automático en localStorage. Si el navegador lo bloquea, el juego sigue en memoria. */
(function (CA) {
  "use strict";

  var avisado = false;

  function clave() { return DATOS.config.claveGuardado || "cielo-adentro"; }
  function claveAjustes() { return clave() + "-ajustes"; }

  function probar() {
    try {
      var k = "__prueba_ca__";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  }

  function avisarFallo() {
    if (avisado) return;
    avisado = true;
    if (CA.UI && CA.UI.aviso) CA.UI.aviso(DATOS.config.textos.guardadoNoDisponible);
  }

  var temporizador = null;

  CA.Guardado = {
    disponible: probar(),

    guardar: function () {
      // Agrupa varios cambios seguidos en una sola escritura.
      clearTimeout(temporizador);
      temporizador = setTimeout(CA.Guardado.guardarYa, 150);
    },

    guardarYa: function () {
      clearTimeout(temporizador);
      try {
        window.localStorage.setItem(clave(), JSON.stringify(CA.estado));
        return true;
      } catch (e) {
        avisarFallo();
        return false;
      }
    },

    cargar: function () {
      try {
        var t = window.localStorage.getItem(clave());
        if (!t) return null;
        var d = JSON.parse(t);
        if (!d || d.version !== 1) return null;
        // Completa campos que pudieran faltar en guardados antiguos.
        var base = CA.estadoInicial();
        Object.keys(base).forEach(function (k) { if (d[k] === undefined) d[k] = base[k]; });
        return d;
      } catch (e) {
        return null;
      }
    },

    borrar: function () {
      try { window.localStorage.removeItem(clave()); } catch (e) { /* sin guardado */ }
    },

    guardarAjustes: function (aj) {
      try { window.localStorage.setItem(claveAjustes(), JSON.stringify(aj)); } catch (e) { /* sin guardado */ }
    },

    cargarAjustes: function () {
      try {
        var t = window.localStorage.getItem(claveAjustes());
        return t ? JSON.parse(t) : null;
      } catch (e) {
        return null;
      }
    }
  };
})(window.CA);
