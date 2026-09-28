/* Índice de datos, evaluación de condiciones ("si") y ejecución de acciones. */
(function (CA) {
  "use strict";

  var lista = CA.lista;

  /* ---------- Índice: busca escenas, diálogos, puzles y observaciones en todos los capítulos ---------- */
  CA.Datos = {
    capitulos: function () {
      return (DATOS.config.capitulos || []).filter(function (id) { return DATOS.capitulos && DATOS.capitulos[id]; });
    },
    capitulo: function (id) { return (DATOS.capitulos || {})[id] || null; },
    buscar: function (tipo, id) {
      var caps = DATOS.capitulos || {};
      var actual = CA.estado.capitulo;
      if (actual && caps[actual] && caps[actual][tipo] && caps[actual][tipo][id]) return caps[actual][tipo][id];
      for (var k in caps) {
        if (caps[k][tipo] && caps[k][tipo][id]) return caps[k][tipo][id];
      }
      return null;
    },
    capituloDe: function (tipo, id) {
      var caps = DATOS.capitulos || {};
      for (var k in caps) {
        if (caps[k][tipo] && caps[k][tipo][id]) return k;
      }
      return null;
    },
    escena: function (id) { return CA.Datos.buscar("escenas", id); },
    dialogo: function (id) { return CA.Datos.buscar("dialogos", id); },
    puzle: function (id) { return CA.Datos.buscar("puzles", id); },
    observacion: function (id) { return CA.Datos.buscar("observaciones", id); },
    objeto: function (id) { return (DATOS.objetos || {})[id] || { nombre: id }; },
    personaje: function (id) { return (DATOS.personajes || {})[id] || null; }
  };

  /* Cuenta observaciones confirmatorias registradas en el capítulo actual. */
  function registrosDelCapitulo() {
    var cap = CA.Datos.capitulo(CA.estado.capitulo);
    if (!cap || !cap.observaciones) return 0;
    return CA.estado.registro.filter(function (id) {
      var o = cap.observaciones[id];
      return o && !o.contradice;
    }).length;
  }
  CA.registrosDelCapitulo = registrosDelCapitulo;

  /* ---------- Condiciones ---------- */
  function cumple(si) {
    if (!si) return true;
    if (Array.isArray(si)) return si.every(cumple);
    var E = CA.E;
    if (si.bandera && !lista(si.bandera).every(E.bandera)) return false;
    if (si.noBandera && lista(si.noBandera).some(E.bandera)) return false;
    if (si.tiene && !lista(si.tiene).every(E.tiene)) return false;
    if (si.noTiene && lista(si.noTiene).some(E.tiene)) return false;
    if (si.registrado && !lista(si.registrado).every(function (r) { return CA.estado.registro.indexOf(r) !== -1; })) return false;
    if (si.noRegistrado && lista(si.noRegistrado).some(function (r) { return CA.estado.registro.indexOf(r) !== -1; })) return false;
    if (si.registrosMin != null && registrosDelCapitulo() < si.registrosMin) return false;
    if (si.registrosMenos != null && registrosDelCapitulo() >= si.registrosMenos) return false;
    if (si.alguna && !si.alguna.some(cumple)) return false;
    if (si.no && cumple(si.no)) return false;
    return true;
  }
  CA.cumple = cumple;

  /* ---------- Texto con variables ---------- */
  CA.texto = function (t) {
    if (t == null) return "";
    var j = CA.estado.jugador || {};
    return String(t)
      .replace(/\{nombre\}/g, j.nombre || "")
      .replace(/\{registros\}/g, String(registrosDelCapitulo()))
      .replace(/\{faltan\}/g, function () {
        var cap = CA.Datos.capitulo(CA.estado.capitulo);
        var n = (cap && cap.observacionesNecesarias) || 0;
        return String(Math.max(0, n - registrosDelCapitulo()));
      });
  };

  /* Convierte texto de datos a HTML seguro: **negrita**, _cursiva_, párrafos con línea en blanco. */
  CA.html = function (t) {
    var s = CA.texto(t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[\s(«"])_(.+?)_(?=[\s.,;:!?)»"]|$)/g, "$1<em>$2</em>");
    return s.split(/\n\s*\n/).map(function (p) { return "<p>" + p.replace(/\n/g, "<br>") + "</p>"; }).join("");
  };

  /* ---------- Acciones ---------- */
  // Ejecuta una lista de acciones en orden. Devuelve false si una acción "bloqueante"
  // (puzle, evaluación) quedó sin completar: en ese caso se detiene el resto.
  CA.ejecutar = async function (acciones) {
    var arr = lista(acciones);
    var gen = CA.generacion;
    for (var i = 0; i < arr.length; i++) {
      var ok = await ejecutarUna(arr[i]);
      if (gen !== CA.generacion) return false; // el flujo se reinició: se abandona la cadena
      if (ok === false) { despues(); return false; }
    }
    despues();
    return true;
  };

  function despues() {
    if (CA.Escena && CA.Escena.refrescar) CA.Escena.refrescar();
    if (CA.Inventario) CA.Inventario.render();
    if (CA.UI && CA.UI.actualizarBarra) CA.UI.actualizarBarra();
    CA.Guardado.guardar();
  }

  async function ejecutarUna(a) {
    if (!a) return true;
    var E = CA.E;

    if (a.si || a.entonces || a.sino) {
      if (cumple(a.si)) return a.entonces ? CA.ejecutar(a.entonces) : true;
      return a.sino ? CA.ejecutar(a.sino) : true;
    }
    if (a.poner) E.poner(a.poner);
    if (a.sacar) E.sacar(a.sacar);
    if (a.dar) {
      lista(a.dar).forEach(function (o) {
        if (!E.tiene(o)) CA.UI.aviso(CA.texto(DATOS.config.textos.objetoRecibido).replace("{objeto}", CA.Datos.objeto(o).nombre));
      });
      E.dar(a.dar);
    }
    if (a.quitar) E.quitar(a.quitar);
    if (a.registrar) {
      lista(a.registrar).forEach(function (id) {
        if (E.registrar(id)) {
          var cap = CA.Datos.capitulo(CA.estado.capitulo);
          var obs = CA.Datos.observacion(id);
          var n = cap && cap.observacionesNecesarias;
          var msj = obs && obs.contradice ? DATOS.config.textos.observacionContraria
            : (n ? DATOS.config.textos.observacionRegistrada : DATOS.config.textos.observacionRegistradaSimple);
          CA.UI.aviso(CA.texto(msj).replace("{n}", n || ""));
        }
      });
    }
    if (a.desbloquear) {
      ["cuaderno", "glosario"].forEach(function (tipo) {
        lista(a.desbloquear[tipo]).forEach(function (id) {
          if (E.desbloquear(tipo, id)) {
            var fuente = tipo === "cuaderno" ? DATOS.cuaderno : DATOS.glosario;
            var nombre = fuente && fuente[id] ? (fuente[id].titulo || fuente[id].termino) : id;
            var plantilla = tipo === "cuaderno" ? DATOS.config.textos.cuadernoNuevo : DATOS.config.textos.glosarioNuevo;
            CA.UI.aviso(plantilla.replace("{titulo}", nombre));
          }
        });
      });
    }
    if (a.mensaje) await CA.Dialogo.decir(a.mensaje, a.quien);
    if (a.dialogo) await CA.Dialogo.abrir(a.dialogo);
    if (a.puzle) {
      var hecho = await CA.Puzles.abrir(a.puzle);
      if (!hecho) return false;
    }
    if (a.evaluacion) {
      var listo = await CA.Evaluacion.abrir(a.evaluacion);
      if (!listo) return false;
    }
    if (a.ir) await CA.Escena.ir(a.ir);
    if (a.finCapitulo) await CA.Juego.finCapitulo(a.finCapitulo === true ? CA.estado.capitulo : a.finCapitulo);
    return true;
  }
})(window.CA);
