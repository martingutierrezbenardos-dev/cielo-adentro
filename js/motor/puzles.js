/* Marco común de los puzles: ventana, pistas escalonadas (3 niveles), estado guardado y cierre. */
(function (CA) {
  "use strict";

  var tipos = {};

  function T() { return DATOS.config.textos; }

  CA.Puzles = {
    registrar: function (tipo, fn) { tipos[tipo] = fn; },

    completado: function (id) {
      return !!(CA.estado.puzles[id] && CA.estado.puzles[id].completado);
    },

    // Devuelve una promesa: true si se completó, false si se cerró antes.
    abrir: function (id) {
      var cfg = CA.Datos.puzle(id);
      if (!cfg) { console.warn("Puzle no encontrado:", id); return Promise.resolve(true); }
      if (CA.Puzles.completado(id) && !cfg.repetible) return Promise.resolve(true);
      var fn = tipos[cfg.tipo];
      if (!fn) { console.warn("Tipo de puzle desconocido:", cfg.tipo); return Promise.resolve(true); }

      return new Promise(function (resolver) {
        var terminado = false;
        if (!CA.estado.puzles[id]) CA.estado.puzles[id] = {};
        var est = CA.estado.puzles[id];

        var m = CA.UI.modal({
          titulo: cfg.titulo,
          clase: "ancho",
          alCerrar: function () { resolver(terminado); },
          construir: function (cuerpo, modal) {
            var zonaPistas = CA.UI.crear("div", "pistas");
            zonaPistas.setAttribute("aria-live", "polite");
            var zona = CA.UI.crear("div", null);
            cuerpo.appendChild(zonaPistas);
            cuerpo.appendChild(zona);

            var pistas = cfg.pistas || [];
            function pintarPistas() {
              var n = CA.estado.pistas[id] || 0;
              zonaPistas.innerHTML = "";
              for (var i = 0; i < n && i < pistas.length; i++) {
                var p = CA.UI.crear("div", "pista", "<strong>" + T().pista + " " + (i + 1) + ":</strong> " + CA.html(pistas[i]).replace(/^<p>|<\/p>$/g, ""));
                zonaPistas.appendChild(p);
              }
              if (bPista) {
                bPista.innerHTML = T().pedirPista + " (" + Math.min(n, pistas.length) + "/" + pistas.length + ")";
                bPista.disabled = n >= pistas.length;
              }
            }
            var bPista = null;
            if (pistas.length) {
              bPista = CA.UI.boton("", null, function () {
                CA.estado.pistas[id] = Math.min(pistas.length, (CA.estado.pistas[id] || 0) + 1);
                pintarPistas();
                CA.Guardado.guardar();
                var ult = zonaPistas.lastElementChild;
                if (ult) ult.scrollIntoView({ block: "nearest" });
              });
              modal.acciones.insertBefore(bPista, modal.acciones.firstChild);
            }
            pintarPistas();

            var ctx = {
              id: id,
              cfg: cfg,
              cuerpo: zona,
              modal: modal,
              estado: est,
              guardar: function () { CA.Guardado.guardar(); },
              completar: function () {
                terminado = true;
                est.completado = true;
                CA.Guardado.guardarYa();
                modal.cerrar();
              }
            };
            fn(cfg, ctx);
          }
        });
        void m;
      });
    }
  };

  /* ---------- Tipo genérico: elección con retroalimentación, en uno o varios pasos ---------- */
  CA.Puzles.registrar("eleccion", function (cfg, ctx) {
    var est = ctx.estado;
    if (est.paso == null) est.paso = 0;
    if (!est.intentos) est.intentos = {};

    function pintar() {
      var c = ctx.cuerpo;
      c.innerHTML = "";
      if (est.paso >= cfg.pasos.length) {
        if (cfg.cierre) c.appendChild(CA.UI.crear("div", "panel-suave", CA.html(cfg.cierre)));
        var fila = CA.UI.crear("div", "fila-botones");
        var b = CA.UI.boton(cfg.botonFinal || T().terminar, "boton-principal", ctx.completar);
        fila.appendChild(b);
        c.appendChild(fila);
        b.focus();
        return;
      }
      var paso = cfg.pasos[est.paso];
      if (est.paso === 0 && cfg.intro) c.appendChild(CA.UI.crear("div", "puzle-intro", CA.html(cfg.intro)));
      if (cfg.pasos.length > 1) c.appendChild(CA.UI.crear("p", "contador", T().paso + " " + (est.paso + 1) + " / " + cfg.pasos.length));
      c.appendChild(CA.UI.crear("h3", null, CA.html(paso.pregunta).replace(/^<p>|<\/p>$/g, "")));
      if (paso.contexto) c.appendChild(CA.UI.crear("div", "panel-suave", CA.html(paso.contexto)));
      var ops = CA.UI.crear("div", "opciones");
      ops.setAttribute("role", "group");
      var retro = CA.UI.crear("div", null);
      retro.setAttribute("aria-live", "polite");
      var resuelto = false;
      paso.opciones.forEach(function (op, i) {
        var b = CA.UI.boton(CA.html(op.texto).replace(/^<p>|<\/p>$/g, ""), "opcion", function () {
          if (resuelto) return;
          var k = est.paso + "";
          est.intentos[k] = (est.intentos[k] || 0) + 1;
          b.classList.add(op.correcta ? "correcta" : "incorrecta");
          retro.className = "retro " + (op.correcta ? "ok" : "mal");
          retro.innerHTML = "<strong class=\"" + (op.correcta ? "ok" : "mal") + "\">" + (op.correcta ? T().bien : T().noDelTodo) + "</strong> " + CA.html(op.retro).replace(/^<p>/, "").replace(/<\/p>$/, "");
          if (op.correcta) {
            resuelto = true;
            ops.querySelectorAll("button").forEach(function (x) { x.disabled = x !== b; });
            var fila = CA.UI.crear("div", "fila-botones");
            var ultimo = est.paso + 1 >= cfg.pasos.length && !cfg.cierre;
            var sig = CA.UI.boton(ultimo ? (cfg.botonFinal || T().terminar) : T().continuar, "boton-principal", function () {
              est.paso++;
              ctx.guardar();
              if (ultimo) ctx.completar(); else pintar();
            });
            fila.appendChild(sig);
            retro.appendChild(fila);
            sig.focus();
          } else {
            b.disabled = true;
            b.setAttribute("aria-disabled", "true");
          }
          ctx.guardar();
        });
        b.dataset.indice = i;
        ops.appendChild(b);
      });
      c.appendChild(ops);
      c.appendChild(retro);
    }
    pintar();
  });
})(window.CA);
