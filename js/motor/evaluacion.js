/* Evaluación de fin de capítulo: reflexión abierta + opción múltiple con retroalimentación. */
(function (CA) {
  "use strict";

  function T() { return DATOS.config.textos; }

  CA.Evaluacion = {
    // Promesa: true si la persona terminó la evaluación.
    abrir: function (capId) {
      var ev = (DATOS.evaluacion || {})[capId];
      if (!ev) return Promise.resolve(true);
      var resp = CA.E.respuestas(capId);
      var cap = CA.Datos.capitulo(capId);

      return new Promise(function (resolver) {
        var listo = false;
        CA.UI.modal({
          titulo: T().evaluacionTitulo.replace("{n}", cap ? cap.numero : "").replace("{titulo}", cap ? cap.titulo : ""),
          clase: "ancho",
          alCerrar: function () { resolver(listo); },
          construir: function (cuerpo, modal) {
            var html = ev.intro ? CA.html(ev.intro) : "";
            cuerpo.innerHTML = html;

            // Preguntas abiertas
            var h = CA.UI.crear("h3", null, T().reflexion);
            cuerpo.appendChild(h);
            ev.abiertas.forEach(function (p, i) {
              var d = CA.UI.crear("div", "pregunta campo");
              var idCampo = "ab-" + capId + "-" + p.id;
              d.innerHTML = '<label for="' + idCampo + '">' + (i + 1) + ". " + CA.UI.esc(CA.texto(p.pregunta)) + "</label>" +
                (p.ayuda ? '<span class="ayuda" id="' + idCampo + '-ay">' + CA.UI.esc(p.ayuda) + "</span>" : "") +
                '<textarea id="' + idCampo + '"' + (p.ayuda ? ' aria-describedby="' + idCampo + '-ay"' : "") + "></textarea>";
              var ta = d.querySelector("textarea");
              ta.value = resp.abiertas[p.id] || "";
              ta.addEventListener("input", function () {
                resp.abiertas[p.id] = ta.value;
                CA.Guardado.guardar();
                revisar();
              });
              cuerpo.appendChild(d);
            });

            // Opción múltiple
            cuerpo.appendChild(CA.UI.crear("h3", null, T().comprobacion));
            ev.multiple.forEach(function (p, i) {
              var d = CA.UI.crear("div", "pregunta");
              d.appendChild(CA.UI.crear("p", null, "<strong>" + (i + 1) + ".</strong> " + CA.UI.esc(CA.texto(p.pregunta))));
              var ops = CA.UI.crear("div", "opciones");
              ops.setAttribute("role", "group");
              var retro = CA.UI.crear("div", null);
              retro.setAttribute("aria-live", "polite");
              var r = resp.multiple[p.id] || null;
              p.opciones.forEach(function (op, k) {
                var b = CA.UI.boton(String.fromCharCode(97 + k) + ") " + CA.UI.esc(op.texto), "opcion", function () {
                  var reg = resp.multiple[p.id] || { primera: k, intentos: 0 };
                  reg.intentos++;
                  reg.ultima = k;
                  if (op.correcta) reg.correcta = true;
                  resp.multiple[p.id] = reg;
                  CA.Guardado.guardar();
                  marcar(k);
                  revisar();
                });
                ops.appendChild(b);
              });
              function marcar(k) {
                var op = p.opciones[k];
                var botones = ops.querySelectorAll("button");
                botones.forEach(function (x, j) {
                  x.classList.remove("correcta", "incorrecta");
                  if (j === k) x.classList.add(op.correcta ? "correcta" : "incorrecta");
                });
                retro.className = "retro " + (op.correcta ? "ok" : "mal");
                retro.innerHTML = "<strong class=\"" + (op.correcta ? "ok" : "mal") + "\">" + (op.correcta ? T().correcto : T().incorrecto) + "</strong> " +
                  CA.html(op.retro).replace(/^<p>/, "").replace(/<\/p>$/, "") +
                  (op.correcta ? "" : " <em>" + T().intentaOtra + "</em>");
              }
              if (r && r.ultima != null) marcar(r.ultima);
              d.appendChild(ops);
              d.appendChild(retro);
              cuerpo.appendChild(d);
            });

            var estadoFinal = CA.UI.crear("p", "ayuda");
            estadoFinal.setAttribute("aria-live", "polite");
            var fila = CA.UI.crear("div", "fila-botones");
            var bTerminar = CA.UI.boton(T().terminarCapitulo, "boton-principal", function () {
              if (!completa()) return;
              listo = true;
              CA.E.poner(capId + "-evaluado");
              CA.Guardado.guardarYa();
              modal.cerrar();
            });
            fila.appendChild(bTerminar);
            cuerpo.appendChild(estadoFinal);
            cuerpo.appendChild(fila);

            function completa() {
              var abiertasOk = ev.abiertas.every(function (p) { return (resp.abiertas[p.id] || "").trim().length > 0; });
              var multOk = ev.multiple.every(function (p) { return resp.multiple[p.id] && resp.multiple[p.id].correcta; });
              return abiertasOk && multOk;
            }
            function revisar() {
              var ok = completa();
              bTerminar.disabled = !ok;
              estadoFinal.textContent = ok ? T().evaluacionLista : T().evaluacionFalta;
            }
            revisar();
          }
        });
      });
    }
  };
})(window.CA);
