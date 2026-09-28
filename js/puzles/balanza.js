/* Cap. 1 — «La balanza de la certeza»: las confirmaciones aumentan la confianza,
   pero nunca convierten la ley en demostrada; un contraejemplo la refuta. */
(function (CA) {
  "use strict";

  function T() { return DATOS.config.textos; }
  var fmt = function (n) { return n.toLocaleString("es-CL"); };

  CA.Puzles.registrar("balanza", function (cfg, ctx) {
    var est = ctx.estado;
    if (est.n == null) est.n = 0;
    var E = cfg.etiquetas;

    function confianza() {
      if (est.contra) return 0;
      return Math.round(100 * (1 - 1 / (1 + est.n / 25)) * 10) / 10;
    }

    function pintar() {
      var c = ctx.cuerpo;
      c.innerHTML = CA.html(cfg.intro) +
        '<div class="panel-suave"><strong>' + E.ley + "</strong> " + CA.UI.esc(cfg.ley) + "</div>" +
        '<p class="contador-grande" aria-live="polite">' + E.casos + " <strong>" + fmt(est.n) + "</strong>" +
        (est.contra ? " · " + E.contraejemplos + " <strong>1</strong>" : "") + "</p>" +
        '<div class="medidores">' +
        '<div class="medidor"><h4>' + E.confianza + '</h4><div class="barra-medidor" role="img" aria-label="' + E.confianza + ": " + confianza() + '%"><span style="width:' + confianza() + '%"></span><i class="meta-100"></i></div>' +
        '<p class="ayuda">' + (est.contra ? E.confianzaRefutada : E.confianzaAyuda) + "</p></div>" +
        '<div class="medidor"><h4>' + E.garantia + '</h4><div class="estado-ley ' + (est.contra ? "refutada" : "no-demostrada") + '" aria-live="polite">' +
        (est.contra ? E.refutada : E.noDemostrada) + "</div>" +
        '<p class="ayuda">' + (est.contra ? E.garantiaRefutada : (est.n > 0 ? E.garantiaAyuda.replace("{n}", fmt(est.n)) : E.garantiaInicio)) + "</p></div>" +
        "</div>";

      var fila = CA.UI.crear("div", "fila-botones");
      fila.style.justifyContent = "flex-start";
      var b1 = CA.UI.boton(E.agregar1, null, function () { est.n += 1; ctx.guardar(); pintar(); enfocar("b1"); });
      var b2 = CA.UI.boton(E.agregarMil, null, function () { est.n += 1000; ctx.guardar(); pintar(); enfocar("b2"); });
      var b3 = CA.UI.boton(E.contraejemplo, "boton-principal", function () { est.contra = true; ctx.guardar(); pintar(); enfocar("pregunta"); });
      b1.dataset.k = "b1"; b2.dataset.k = "b2";
      b1.disabled = b2.disabled = !!est.contra;
      b3.disabled = est.contra || est.n < cfg.minConfirmaciones;
      fila.appendChild(b1); fila.appendChild(b2); fila.appendChild(b3);
      c.appendChild(fila);
      if (!est.contra && est.n < cfg.minConfirmaciones) {
        c.appendChild(CA.UI.crear("p", "ayuda", E.faltanCasos.replace("{n}", cfg.minConfirmaciones - est.n)));
      }

      if (est.contra) {
        c.appendChild(CA.UI.crear("div", "panel-suave", CA.html(cfg.textoRefutada)));
        var p = cfg.pregunta;
        var h = CA.UI.crear("h3", null, CA.UI.esc(p.texto));
        h.tabIndex = -1;
        h.dataset.k = "pregunta";
        c.appendChild(h);
        var ops = CA.UI.crear("div", "opciones");
        var retro = CA.UI.crear("div", null);
        retro.setAttribute("aria-live", "polite");
        p.opciones.forEach(function (op) {
          var b = CA.UI.boton(CA.UI.esc(op.texto), "opcion", function () {
            b.classList.add(op.correcta ? "correcta" : "incorrecta");
            retro.className = "retro " + (op.correcta ? "ok" : "mal");
            retro.innerHTML = "<strong class=\"" + (op.correcta ? "ok" : "mal") + "\">" + (op.correcta ? T().bien : T().noDelTodo) + "</strong> " + CA.html(op.retro).replace(/^<p>/, "").replace(/<\/p>$/, "");
            if (op.correcta) {
              est.respondida = true;
              ops.querySelectorAll("button").forEach(function (x) { x.disabled = x !== b; });
              var f = CA.UI.crear("div", "fila-botones");
              var sig = CA.UI.boton(T().continuar, "boton-principal", ctx.completar);
              f.appendChild(sig);
              retro.appendChild(f);
              sig.focus();
            } else {
              b.disabled = true;
            }
            ctx.guardar();
          });
          ops.appendChild(b);
        });
        c.appendChild(ops);
        c.appendChild(retro);
      }
    }

    function enfocar(k) {
      var e = ctx.cuerpo.querySelector('[data-k="' + k + '"]');
      if (e && !e.disabled) e.focus();
    }

    pintar();
  });
})(window.CA);
