/* Cap. 0 — «La criba de la duda»: se aplican, uno tras otro, los niveles de duda de Descartes
   a un conjunto de creencias. En cada nivel hay que decidir cuáles resisten y cuáles caen.
   Las que caen ya no vuelven. Al final solo queda lo que resiste a toda duda. */
(function (CA) {
  "use strict";

  function T() { return DATOS.config.textos; }
  var esc = function (s) { return CA.UI.esc(s); };
  var limpio = function (t) { return CA.html(t).replace(/^<p>/, "").replace(/<\/p>$/, ""); };

  CA.Puzles.registrar("criba", function (cfg, ctx) {
    var est = ctx.estado;
    if (est.nivel == null) est.nivel = 0;
    if (!est.ok) est.ok = {};          // "nivel:id" -> true cuando se respondió bien
    if (!est.intentos) est.intentos = 0;
    var E = cfg.etiquetas;

    function enPie(nivel) {
      // Creencias que siguen en pie al comenzar este nivel.
      return cfg.creencias.filter(function (c) { return c.caeEn == null || c.caeEn >= nivel; });
    }
    function caidas(nivel) {
      return cfg.creencias.filter(function (c) { return c.caeEn != null && c.caeEn < nivel; });
    }

    function pintar(enfocar) {
      var c = ctx.cuerpo;
      c.innerHTML = "";
      var fin = est.nivel >= cfg.niveles.length;
      if (est.nivel === 0) c.appendChild(CA.UI.crear("div", "puzle-intro", CA.html(cfg.intro)));

      // Progreso de niveles
      var prog = cfg.niveles.map(function (n, i) {
        var marca = i < est.nivel ? "✔" : (i === est.nivel ? "▶" : "·");
        return '<span style="margin-right:1rem;' + (i === est.nivel ? "color:var(--ui-acento);font-weight:700" : "") + '">' + marca + " " + esc(n.titulo) + "</span>";
      }).join("");
      c.appendChild(CA.UI.crear("p", "contador", prog));

      if (!fin) {
        var nv = cfg.niveles[est.nivel];
        c.appendChild(CA.UI.crear("h3", null, E.nivel + " " + (est.nivel + 1) + ": " + esc(nv.titulo)));
        c.appendChild(CA.UI.crear("div", "panel-suave", CA.html(nv.argumento)));
        c.appendChild(CA.UI.crear("p", null, "<strong>" + esc(E.pregunta) + "</strong>"));

        var lista = CA.UI.crear("div", "lista-entradas");
        var todasOk = true;
        enPie(est.nivel).forEach(function (cr) {
          var clave = est.nivel + ":" + cr.id;
          var cae = cr.caeEn === est.nivel;
          var tarjeta = CA.UI.crear("div", "entrada");
          tarjeta.appendChild(CA.UI.crear("h4", null, "«" + esc(cr.texto) + "»"));
          var fila = CA.UI.crear("div", "pestanas");
          fila.style.marginBottom = "0";
          var retro = CA.UI.crear("div", null);
          retro.setAttribute("aria-live", "polite");
          var bR = CA.UI.boton(E.resiste, null, null);
          var bC = CA.UI.boton(E.cae, null, null);
          function responder(eligeCae, boton) {
            var bien = eligeCae === cae;
            est.intentos++;
            if (bien) est.ok[clave] = true;
            ctx.guardar();
            if (bien) { pintar(clave); return; }
            boton.classList.add("incorrecta");
            retro.className = "retro mal";
            retro.innerHTML = "<strong class=\"mal\">" + T().noDelTodo + "</strong> " + limpio(cr.pistaError && cr.pistaError[est.nivel] ? cr.pistaError[est.nivel] : (cae ? E.errorDebiaCaer : E.errorDebiaResistir));
          }
          bR.addEventListener("click", function () { responder(false, bR); });
          bC.addEventListener("click", function () { responder(true, bC); });
          bR.dataset.k = clave + ":r";
          if (est.ok[clave]) {
            bR.disabled = bC.disabled = true;
            (cae ? bC : bR).classList.add("correcta");
            (cae ? bC : bR).disabled = false;
            (cae ? bC : bR).setAttribute("aria-disabled", "true");
            retro.className = "retro ok";
            retro.innerHTML = "<strong class=\"ok\">" + (cae ? E.cayo : E.resistio) + "</strong> " + limpio(cr.retro[est.nivel] || "");
            tarjeta.style.opacity = cae ? ".8" : "1";
          } else {
            todasOk = false;
          }
          fila.appendChild(bR);
          fila.appendChild(bC);
          tarjeta.appendChild(fila);
          tarjeta.appendChild(retro);
          lista.appendChild(tarjeta);
        });
        c.appendChild(lista);

        if (todasOk) {
          var f = CA.UI.crear("div", "fila-botones");
          var sig = CA.UI.boton(est.nivel + 1 < cfg.niveles.length ? E.siguienteNivel : E.verQueQueda, "boton-principal", function () {
            est.nivel++;
            ctx.guardar();
            pintar("inicio");
            ctx.cuerpo.parentNode.scrollTop = 0;
          });
          f.appendChild(sig);
          c.appendChild(f);
          sig.focus();
        } else if (enfocar && enfocar !== "inicio") {
          var siguiente = ctx.cuerpo.querySelector("button:not(:disabled):not([aria-disabled])");
          if (siguiente) siguiente.focus();
        }
      } else {
        // Lo que resiste a todo
        var quedan = enPie(cfg.niveles.length);
        c.appendChild(CA.UI.crear("h3", null, esc(E.queda)));
        quedan.forEach(function (cr) {
          c.appendChild(CA.UI.crear("div", "entrada", "<h4>«" + esc(cr.texto) + "»</h4>"));
        });
        c.appendChild(CA.UI.crear("div", "panel-suave", CA.html(cfg.textoFinal)));
        preguntaFinal(c);
      }

      // Creencias caídas
      var ca = caidas(Math.min(est.nivel, cfg.niveles.length));
      if (ca.length) {
        var html = "<h3>" + esc(E.yaCayeron) + '</h3><ul class="registro-lista">';
        ca.forEach(function (cr) {
          html += '<li class="contradice"><s>«' + esc(cr.texto) + "»</s> — " + esc(E.cayoCon) + " " + esc(cfg.niveles[cr.caeEn].titulo.toLowerCase()) + "</li>";
        });
        c.appendChild(CA.UI.crear("div", null, html + "</ul>"));
      }
    }

    function preguntaFinal(c) {
      var p = cfg.pregunta;
      c.appendChild(CA.UI.crear("h3", null, esc(p.texto)));
      var ops = CA.UI.crear("div", "opciones");
      var retro = CA.UI.crear("div", null);
      retro.setAttribute("aria-live", "polite");
      p.opciones.forEach(function (op) {
        var b = CA.UI.boton(esc(op.texto), "opcion", function () {
          b.classList.add(op.correcta ? "correcta" : "incorrecta");
          retro.className = "retro " + (op.correcta ? "ok" : "mal");
          retro.innerHTML = "<strong class=\"" + (op.correcta ? "ok" : "mal") + "\">" + (op.correcta ? T().bien : T().noDelTodo) + "</strong> " + limpio(op.retro);
          if (op.correcta) {
            ops.querySelectorAll("button").forEach(function (x) { x.disabled = x !== b; });
            var f = CA.UI.crear("div", "fila-botones");
            var fin = CA.UI.boton(T().terminar, "boton-principal", ctx.completar);
            f.appendChild(fin);
            retro.appendChild(f);
            fin.focus();
          } else {
            b.disabled = true;
          }
        });
        ops.appendChild(b);
      });
      c.appendChild(ops);
      c.appendChild(retro);
    }

    pintar();
  });
})(window.CA);
