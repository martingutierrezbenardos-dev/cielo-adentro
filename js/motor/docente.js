/* Modo docente: clave simple (sin seguridad real), salto a capítulos, soluciones y guía. */
(function (CA) {
  "use strict";

  var activo = false;
  function T() { return DATOS.config.textos; }
  var esc = function (s) { return CA.UI.esc(s); };

  function lista(items) {
    return "<ul>" + (items || []).map(function (x) { return "<li>" + CA.html(x).replace(/^<p>|<\/p>$/g, "") + "</li>"; }).join("") + "</ul>";
  }

  function pestanaCapitulos(zona, modal) {
    var html = CA.html(T().docenteSaltarIntro);
    zona.innerHTML = html;
    var c = CA.UI.crear("div", "inicio-botones");
    CA.Datos.capitulos().forEach(function (cid) {
      var cap = CA.Datos.capitulo(cid);
      c.appendChild(CA.UI.boton("Capítulo " + cap.numero + " · " + esc(cap.titulo), null, function () {
        modal.cerrar();
        CA.Juego.saltarACapitulo(cid);
      }));
    });
    zona.appendChild(c);
    var fila = CA.UI.crear("div", "fila-botones");
    fila.appendChild(CA.UI.boton(T().docenteVerFinal, null, function () { modal.cerrar(); CA.Exportar.abrir({ final: true }); }));
    zona.appendChild(fila);
  }

  function pestanaGuia(zona) {
    var d = DATOS.docente || {};
    var html = "";
    if (d.general) html += '<div class="docente-bloque">' + CA.html(d.general) + "</div>";
    CA.Datos.capitulos().forEach(function (cid) {
      var g = d[cid];
      var cap = CA.Datos.capitulo(cid);
      if (!g) return;
      html += '<section class="docente-bloque"><h3>Capítulo ' + cap.numero + " · " + esc(cap.titulo) + "</h3>";
      if (g.duracion) html += "<p><strong>" + T().docenteDuracion + ":</strong> " + esc(g.duracion) + "</p>";
      html += "<p><strong>" + T().docenteObjetivos + "</strong></p>" + lista(g.objetivos);
      html += "<p><strong>" + T().docenteDiscusion + "</strong></p>" + lista(g.discusion);
      html += "<p><strong>" + T().docenteErrores + "</strong></p><ul>" + (g.errores || []).map(function (e) {
        return "<li><strong>" + esc(e.error) + "</strong> — " + CA.html(e.aclaracion).replace(/^<p>|<\/p>$/g, "") + "</li>";
      }).join("") + "</ul></section>";
    });
    zona.innerHTML = html;
  }

  function pestanaSoluciones(zona) {
    var d = DATOS.docente || {};
    var html = "";
    CA.Datos.capitulos().forEach(function (cid) {
      var g = d[cid];
      var cap = CA.Datos.capitulo(cid);
      if (!g || !g.soluciones) return;
      html += '<section class="docente-bloque"><h3>Capítulo ' + cap.numero + " · " + esc(cap.titulo) + "</h3>";
      if (g.recorrido) html += "<p><strong>" + T().docenteRecorrido + "</strong></p>" + lista(g.recorrido);
      Object.keys(g.soluciones).forEach(function (pid) {
        var p = CA.Datos.puzle(pid);
        html += "<p><strong>" + esc(p ? p.titulo : pid) + "</strong></p>" + CA.html(g.soluciones[pid]);
      });
      html += "</section>";
    });
    zona.innerHTML = html;
  }

  function pestanaProgreso(zona) {
    var html = "<p>" + T().docenteProgresoIntro + "</p><table class=\"tabla\"><thead><tr><th>Puzle</th><th>" + T().docenteCompletado + "</th><th>" + T().docentePistas + "</th></tr></thead><tbody>";
    CA.Datos.capitulos().forEach(function (cid) {
      var cap = CA.Datos.capitulo(cid);
      Object.keys(cap.puzles || {}).forEach(function (pid) {
        html += "<tr><td>" + esc(cap.puzles[pid].titulo) + "</td><td>" + (CA.Puzles.completado(pid) ? "Sí" : "No") + "</td><td>" + (CA.estado.pistas[pid] || 0) + "</td></tr>";
      });
    });
    zona.innerHTML = html + "</tbody></table>";
  }

  function panel() {
    CA.UI.modal({
      titulo: T().modoDocente,
      clase: "ancho",
      construir: function (cuerpo, modal) {
        cuerpo.appendChild(CA.UI.crear("div", "aviso-docente", CA.html(T().docenteAviso)));
        var tabs = CA.UI.crear("div", "pestanas");
        tabs.setAttribute("role", "tablist");
        var zona = CA.UI.crear("div", null);
        var defs = [
          ["capitulos", T().docenteCapitulos, pestanaCapitulos],
          ["guia", T().docenteGuia, pestanaGuia],
          ["soluciones", T().docenteSoluciones, pestanaSoluciones],
          ["progreso", T().docenteProgreso, pestanaProgreso]
        ];
        var bs = {};
        function activar(id) {
          defs.forEach(function (d) { bs[d[0]].setAttribute("aria-selected", d[0] === id ? "true" : "false"); });
          defs.filter(function (d) { return d[0] === id; })[0][2](zona, modal);
        }
        defs.forEach(function (d) {
          var b = CA.UI.boton(d[1], null, function () { activar(d[0]); });
          b.setAttribute("role", "tab");
          bs[d[0]] = b;
          tabs.appendChild(b);
        });
        cuerpo.appendChild(tabs);
        cuerpo.appendChild(zona);
        activar("capitulos");
      }
    });
  }

  CA.Docente = {
    activo: function () { return activo; },
    abrir: function () {
      if (activo) { panel(); return; }
      CA.UI.modal({
        titulo: T().modoDocente,
        construir: function (cuerpo, modal) {
          cuerpo.innerHTML = '<form class="campo" id="form-docente"><label for="clave-docente">' + T().docenteClave + '</label>' +
            '<input id="clave-docente" type="password" autocomplete="off">' +
            '<p class="ayuda" id="docente-error" aria-live="polite"></p>' +
            '<div class="fila-botones"><button class="boton boton-principal" type="submit">' + T().entrar + "</button></div></form>";
          cuerpo.querySelector("form").addEventListener("submit", function (e) {
            e.preventDefault();
            var v = cuerpo.querySelector("#clave-docente").value.trim();
            if (v === String(DATOS.config.claveDocente)) {
              activo = true;
              modal.cerrar();
              panel();
            } else {
              cuerpo.querySelector("#docente-error").textContent = T().docenteClaveMala;
            }
          });
        }
      });
    }
  };
})(window.CA);
