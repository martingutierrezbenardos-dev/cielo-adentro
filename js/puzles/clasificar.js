/* Tipo genérico «clasificar» como duelo: el rival te plantea ideas o afirmaciones una
   por una y tus "movimientos" son las categorías. Si la elección no es la correcta,
   se explica por qué y se puede volver a intentar.
   Se usa en «Rastrear ideas» y «La horquilla de Hume» (y servirá para otros capítulos). */
(function (CA) {
  "use strict";

  function T() { return DATOS.config.textos; }
  var esc = function (s) { return CA.UI.esc(s); };

  CA.Puzles.registrar("clasificar", function (cfg, ctx) {
    var est = ctx.estado;
    if (!est.resueltos) est.resueltos = {};
    if (!est.errores) est.errores = 0;
    var D = cfg.duelo || {};
    var nombreRival = D.nombreRival || "ECO DE DAVID HUME";
    var rival = { sprite: D.rival || "hume" };

    function nombreCat(id) {
      var c = cfg.categorias.filter(function (x) { return x.id === id; })[0];
      return c ? c.nombre : id;
    }
    function resueltos() { return cfg.items.filter(function (it, i) { return est.resueltos[i]; }).length; }

    var b = CA.Combate.crear(ctx, { fondo: D.fondo || "planetario", rival: rival, tuyo: { sprite: "tu" } });

    function infoRival(it) {
      b.info("rival", {
        nombre: it ? (D.nombreItem || "IDEA") : nombreRival,
        detalle: it ? "«" + esc(it.texto) + "»" : "",
        equipo: cfg.items.map(function (x, i) { return !est.resueltos[i]; })
      });
    }
    function infoTuyo() {
      var n = resueltos();
      b.info("tuyo", {
        nombre: CA.texto("{nombre}").toUpperCase() || "TÚ",
        vida: { etq: D.etiquetaVida || "OK", valor: n / cfg.items.length, texto: n + "/" + cfg.items.length, invertir: true }
      });
    }

    (async function () {
      infoRival(null);
      infoTuyo();
      if (!resueltos()) {
        await b.decir((D.intro || "¡El {rival} te propone un duelo!").replace("{rival}", nombreRival));
        await b.decir(cfg.intro);
        if (cfg.categorias.some(function (x) { return x.descripcion; })) {
          await b.decir("**" + T().dueloMovimientos + ":**\n\n" + cfg.categorias.map(function (x) {
            return "**" + x.nombre + "**: " + (x.descripcion || "");
          }).join("\n"));
        }
      } else {
        await b.decir(T().dueloRetomar);
      }

      for (var i = 0; i < cfg.items.length; i++) {
        if (est.resueltos[i]) continue;
        var it = cfg.items[i];
        b.sprite("rival", { icono: D.icono || "idea" });
        infoRival(it);
        await b.animar("rival", "entrar");
        await b.decir((D.plantea || "¡{rival} plantea: «{item}»!").replace("{rival}", nombreRival).replace("{item}", it.texto));
        var usadas = {};
        for (;;) {
          var k = await b.menu(D.pregunta || T().dueloMovimientos, cfg.categorias.map(function (c) {
            return { html: esc(c.nombre), desc: c.descripcion, usada: usadas[c.id] };
          }), "«" + it.texto + "»");
          var cat = cfg.categorias[k];
          if (cat.id === it.correcta) {
            est.resueltos[i] = true;
            ctx.guardar();
            infoTuyo();
            await b.animar("rival", "golpe");
            await b.decir("[ok]**" + T().dueloEficaz + "**[/ok] **" + nombreCat(it.correcta) + ".** " + it.retro);
            await b.animar("rival", "caer");
            infoRival(null);
            break;
          }
          est.errores++;
          usadas[cat.id] = true;
          ctx.guardar();
          await b.animar("tuyo", "temblar");
          var expl = (it.retroMal && it.retroMal[cat.id]) || cfg.retroMalGenerica || "";
          await b.decir("[mal]**" + T().dueloNoEficaz + "**[/mal] " + expl);
        }
      }

      b.sprite("rival", rival);
      infoRival(null);
      await b.animar("rival", "entrar");
      if (cfg.cierre) await b.decir(cfg.cierre);
      await b.decir(D.victoria || T().dueloVictoria);
      ctx.completar();
    })();
  }, { combate: true });
})(window.CA);
