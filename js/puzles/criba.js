/* Cap. 0 — «La criba de la duda» como duelo: el eco de Descartes ataca con tres niveles
   de duda y tus creencias son tu equipo. En cada nivel decides cuáles resisten y cuáles
   caen. Las que caen quedan fuera del duelo. Al final solo queda lo que resiste a toda duda. */
(function (CA) {
  "use strict";

  function T() { return DATOS.config.textos; }
  var esc = function (s) { return CA.UI.esc(s); };

  CA.Puzles.registrar("criba", function (cfg, ctx) {
    var est = ctx.estado;
    if (est.nivel == null) est.nivel = 0;
    if (!est.ok) est.ok = {};          // "nivel:id" -> true cuando se respondió bien
    if (!est.intentos) est.intentos = 0;
    var E = cfg.etiquetas;
    var D = cfg.duelo || {};
    var nombreRival = D.nombreRival || "ECO DE DESCARTES";

    function enPie(nivel) {
      return cfg.creencias.filter(function (c) { return c.caeEn == null || c.caeEn >= nivel; });
    }
    function tono(cr) { return CA.Combate.TONOS[cfg.creencias.indexOf(cr) % CA.Combate.TONOS.length]; }

    var total = 0;
    cfg.niveles.forEach(function (n, i) { total += enPie(i).length; });

    var b = CA.Combate.crear(ctx, { fondo: D.fondo || "planetario", rival: { sprite: D.rival || "descartes" }, tuyo: { icono: "pensamiento", tono: tono(cfg.creencias[0]) } });

    function infoRival() {
      var hechas = Object.keys(est.ok).length;
      var nv = cfg.niveles[Math.min(est.nivel, cfg.niveles.length - 1)];
      b.info("rival", {
        nombre: nombreRival,
        detalle: est.nivel < cfg.niveles.length ? esc(E.nivel + " " + (est.nivel + 1) + ": " + nv.titulo) : esc(D.sinDudas || "Sin más dudas"),
        vida: { etq: D.etiquetaVida || "DUDAS", valor: (total - hechas) / total, texto: (total - hechas) + "/" + total }
      });
    }
    function infoTuyo(cr) {
      var nivel = Math.min(est.nivel, cfg.niveles.length);
      b.info("tuyo", {
        nombre: D.nombreTuyo || "TUS CREENCIAS",
        detalle: cr ? "«" + esc(cr.texto) + "»" : "",
        equipo: cfg.creencias.map(function (c) { return c.caeEn == null || c.caeEn >= nivel; })
      });
    }

    async function nivel() {
      var nv = cfg.niveles[est.nivel];
      infoRival();
      infoTuyo(null);
      await b.animar("rival", "brillo");
      await b.decir((D.usa || "¡{rival} usa {ataque}!").replace("{rival}", nombreRival).replace("{ataque}", nv.titulo.toUpperCase()));
      await b.decir(nv.argumento);
      var lista = enPie(est.nivel);
      for (var i = 0; i < lista.length; i++) {
        var cr = lista[i];
        var clave = est.nivel + ":" + cr.id;
        if (est.ok[clave]) continue;
        var cae = cr.caeEn === est.nivel;
        b.sprite("tuyo", { icono: "pensamiento", tono: tono(cr) });
        infoTuyo(cr);
        await b.animar("tuyo", "entrar");
        for (;;) {
          var r = await b.menu(E.pregunta, [
            { html: esc(E.resiste), desc: D.descResiste || "Este argumento no alcanza para dudar de ella." },
            { html: esc(E.cae), desc: D.descCae || "Con este argumento, se puede dudar de ella." }
          ], "«" + cr.texto + "»\n\n_" + nv.titulo + "_");
          var eligeCae = r === 1;
          est.intentos++;
          if (eligeCae === cae) {
            est.ok[clave] = true;
            ctx.guardar();
            infoRival();
            if (cae) {
              await b.animar("tuyo", "golpe");
              await b.animar("tuyo", "caer");
              infoTuyo(cr);
              await b.decir('<span class="ok">**' + E.cayo + "**</span> " + (cr.retro[est.nivel] || ""));
            } else {
              await b.animar("tuyo", "brillo");
              await b.decir('<span class="ok">**' + E.resistio + "**</span> " + (cr.retro[est.nivel] || ""));
            }
            break;
          }
          ctx.guardar();
          await b.animar("tuyo", "temblar");
          var expl = cr.pistaError && cr.pistaError[est.nivel] ? cr.pistaError[est.nivel] : (cae ? E.errorDebiaCaer : E.errorDebiaResistir);
          await b.decir('<span class="mal">**' + T().noDelTodo + "**</span> " + expl);
        }
      }
      est.nivel++;
      ctx.guardar();
      if (est.nivel < cfg.niveles.length) await b.decir(E.siguienteNivel + "…");
    }

    (async function () {
      infoRival();
      infoTuyo(null);
      var nuevo = est.nivel === 0 && !Object.keys(est.ok).length;
      if (nuevo) {
        await b.decir((D.intro || "¡El {rival} te desafía a un duelo de dudas!").replace("{rival}", nombreRival));
        await b.decir(cfg.intro);
      } else {
        await b.decir(T().dueloRetomar);
      }
      while (est.nivel < cfg.niveles.length) await nivel();

      // Lo que queda en pie
      var quedan = enPie(cfg.niveles.length);
      if (quedan.length) {
        b.sprite("tuyo", { icono: "pensamiento", tono: tono(quedan[0]) });
        infoTuyo(quedan[0]);
        await b.animar("tuyo", "entrar");
      }
      infoRival();
      await b.decir("**" + E.queda + "** " + quedan.map(function (c) { return "«" + c.texto + "»"; }).join(" "));
      await b.decir(cfg.textoFinal);
      await CA.Combate.pregunta(b, cfg.pregunta);
      await b.decir(D.victoria || T().dueloVictoria);
      ctx.completar();
    })();
  }, { combate: true });
})(window.CA);
