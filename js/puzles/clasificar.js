/* Tipo genérico «clasificar»: cada elemento se asigna a una categoría.
   Si la elección es incorrecta, se explica por qué y se puede reintentar.
   Se usa en varios capítulos (ideas e impresiones, horquilla de Hume, falsabilidad…). */
(function (CA) {
  "use strict";

  function T() { return DATOS.config.textos; }
  var esc = function (s) { return CA.UI.esc(s); };
  var limpio = function (t) { return CA.html(t).replace(/^<p>/, "").replace(/<\/p>$/, ""); };

  CA.Puzles.registrar("clasificar", function (cfg, ctx) {
    var est = ctx.estado;
    if (!est.resueltos) est.resueltos = {};
    if (!est.errores) est.errores = 0;

    function nombreCat(id) {
      var c = cfg.categorias.filter(function (x) { return x.id === id; })[0];
      return c ? c.nombre : id;
    }

    function todos() { return cfg.items.every(function (it, i) { return est.resueltos[i]; }); }

    function pintar(foco) {
      var c = ctx.cuerpo;
      c.innerHTML = CA.html(cfg.intro);
      if (cfg.categorias.some(function (x) { return x.descripcion; })) {
        var leyenda = '<div class="panel-suave"><ul style="margin:0;padding-left:1.2rem">';
        cfg.categorias.forEach(function (x) {
          leyenda += "<li><strong>" + esc(x.nombre) + ":</strong> " + limpio(x.descripcion || "") + "</li>";
        });
        c.appendChild(CA.UI.crear("div", null, leyenda + "</ul></div>"));
      }
      var n = cfg.items.filter(function (it, i) { return est.resueltos[i]; }).length;
      c.appendChild(CA.UI.crear("p", "contador", T().clasificados.replace("{n}", n).replace("{total}", cfg.items.length)));

      var lista = CA.UI.crear("div", "lista-entradas");
      cfg.items.forEach(function (it, i) {
        var t = CA.UI.crear("div", "entrada");
        t.appendChild(CA.UI.crear("h4", null, esc(it.texto)));
        var fila = CA.UI.crear("div", "pestanas");
        fila.setAttribute("role", "group");
        fila.setAttribute("aria-label", it.texto);
        fila.style.marginBottom = "0";
        var retro = CA.UI.crear("div", null);
        retro.setAttribute("aria-live", "polite");
        cfg.categorias.forEach(function (cat) {
          var b = CA.UI.boton(esc(cat.nombre), null, function () {
            if (est.resueltos[i]) return;
            if (cat.id === it.correcta) {
              est.resueltos[i] = true;
              ctx.guardar();
              pintar(i);
            } else {
              est.errores++;
              ctx.guardar();
              b.classList.add("incorrecta");
              b.disabled = true;
              retro.className = "retro mal";
              var expl = (it.retroMal && it.retroMal[cat.id]) || cfg.retroMalGenerica || "";
              retro.innerHTML = "<strong class=\"mal\">" + T().noDelTodo + "</strong> " + limpio(expl);
            }
          });
          if (est.resueltos[i]) {
            b.disabled = cat.id !== it.correcta;
            if (cat.id === it.correcta) { b.classList.add("correcta"); b.setAttribute("aria-disabled", "true"); }
          }
          fila.appendChild(b);
        });
        if (est.resueltos[i]) {
          retro.className = "retro ok";
          retro.innerHTML = "<strong class=\"ok\">" + esc(nombreCat(it.correcta)) + ".</strong> " + limpio(it.retro);
        }
        t.appendChild(fila);
        t.appendChild(retro);
        lista.appendChild(t);
      });
      c.appendChild(lista);

      if (todos()) {
        if (cfg.cierre) c.appendChild(CA.UI.crear("div", "panel-suave", CA.html(cfg.cierre)));
        var f = CA.UI.crear("div", "fila-botones");
        var fin = CA.UI.boton(cfg.botonFinal || T().terminar, "boton-principal", ctx.completar);
        f.appendChild(fin);
        c.appendChild(f);
        if (foco != null) fin.focus();
      } else if (foco != null) {
        // Lleva el foco al siguiente elemento sin resolver.
        for (var k = 0; k < cfg.items.length; k++) {
          var j = (foco + 1 + k) % cfg.items.length;
          if (!est.resueltos[j]) {
            var b2 = lista.children[j].querySelector("button:not(:disabled)");
            if (b2) { b2.focus(); break; }
          }
        }
      }
    }
    pintar();
  });
})(window.CA);
