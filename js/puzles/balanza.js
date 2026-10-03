/* Cap. 1 — «La balanza de la certeza» como duelo: tu ley contra EL CASO SIGUIENTE.
   Cada confirmación sube tu confianza, pero al caso siguiente no le hace nada: la ley
   nunca queda demostrada. Un solo contraejemplo (S-12) basta para derribarla. */
(function (CA) {
  "use strict";

  function T() { return DATOS.config.textos; }
  var fmt = function (n) { return n.toLocaleString("es-CL"); };
  var esc = function (s) { return CA.UI.esc(s); };

  CA.Puzles.registrar("balanza", function (cfg, ctx) {
    var est = ctx.estado;
    if (est.n == null) est.n = 0;
    var E = cfg.etiquetas;
    var D = cfg.duelo || {};
    var nombreRival = D.nombreRival || "EL CASO SIGUIENTE";

    function confianza() {
      if (est.contra) return 0;
      return Math.round(100 * (1 - 1 / (1 + est.n / 25)) * 10) / 10;
    }

    var b = CA.Combate.crear(ctx, { fondo: D.fondo || "cupula", rival: { icono: "estrella" }, tuyo: { icono: "ley" } });

    function infoRival() {
      b.info("rival", {
        nombre: nombreRival,
        detalle: esc(E.garantia) + " <strong>" + esc(est.contra ? E.refutada : E.noDemostrada) + "</strong>"
      });
    }
    function infoTuyo() {
      var c = confianza();
      b.info("tuyo", {
        nombre: D.nombreTuyo || "TU LEY",
        detalle: esc(E.casos) + " <strong>" + fmt(est.n) + "</strong>" + (est.contra ? " · " + esc(E.contraejemplos) + " <strong>1</strong>" : ""),
        vida: { etq: D.etiquetaVida || "CONF.", valor: c / 100, texto: est.contra ? "0%" : String(c).replace(".", ",") + "%", invertir: true }
      });
    }

    (async function () {
      infoRival();
      infoTuyo();
      if (!est.contra) {
        if (!est.n) {
          await b.decir(D.intro || "¡Duelo mental en la pizarra!");
          await b.decir(cfg.intro);
          await b.decir("**" + E.ley + "** " + cfg.ley);
        } else {
          await b.decir(T().dueloRetomar);
        }
        while (!est.contra) {
          var faltan = cfg.minConfirmaciones - est.n;
          var texto = (est.n > 0 ? E.garantiaAyuda.replace("{n}", fmt(est.n)) : E.garantiaInicio) +
            (faltan > 0 ? "\n\n_" + E.faltanCasos.replace("{n}", faltan) + "_" : "");
          var r = await b.menu(T().dueloMovimientos, [
            { html: esc(E.agregar1), desc: E.confianzaAyuda },
            { html: esc(E.agregarMil), desc: E.confianzaAyuda },
            { html: esc(E.contraejemplo), deshabilitada: faltan > 0, desc: faltan > 0 ? E.faltanCasos.replace("{n}", faltan) : "" }
          ], texto);
          if (r === 0 || r === 1) {
            est.n += r === 0 ? 1 : 1000;
            ctx.guardar();
            await b.animar("tuyo", "brillo");
            infoTuyo();
            await b.decir("**" + E.confianza + ": " + String(confianza()).replace(".", ",") + "%.** " +
              (D.noAfecta || "¡{rival} no se inmuta!").replace("{rival}", nombreRival) + " " + E.garantiaAyuda.replace("{n}", fmt(est.n)));
          } else {
            est.contra = true;
            ctx.guardar();
            await b.animar("rival", "brillo");
            await b.decir(D.s12 || "¡EL CASO SIGUIENTE resultó ser S-12!");
            await b.animar("tuyo", "golpe");
            infoTuyo();
            infoRival();
            await b.animar("tuyo", "caer");
            await b.decir('<span class="mal">**' + E.refutada + ".**</span> " + E.confianzaRefutada);
            await b.decir(E.garantiaRefutada);
          }
        }
      } else {
        b.sprite("tuyo", { icono: "ley" });
        await b.animar("tuyo", "caer");
        await b.decir(T().dueloRetomar);
      }
      await b.decir(cfg.textoRefutada);
      await CA.Combate.pregunta(b, cfg.pregunta);
      est.respondida = true;
      ctx.guardar();
      await b.decir(D.victoria || T().dueloVictoria);
      ctx.completar();
    })();
  }, { combate: true });
})(window.CA);
