/* Resumen de respuestas y descarga como .txt para entregar al profesor o profesora. */
(function (CA) {
  "use strict";

  function T() { return DATOS.config.textos; }
  var esc = function (s) { return CA.UI.esc(s); };

  function capitulosConEvaluacion() {
    return CA.Datos.capitulos().filter(function (c) { return DATOS.evaluacion && DATOS.evaluacion[c]; });
  }

  function textoPlano() {
    var j = CA.estado.jugador;
    var lineas = [];
    var fecha = new Date();
    lineas.push(DATOS.config.titulo + " — " + T().respuestasDe);
    lineas.push("=".repeat(60));
    lineas.push(T().nombre + ": " + (j.nombre || "—"));
    lineas.push(T().curso + ": " + (j.curso || "—"));
    lineas.push(T().fecha + ": " + fecha.toLocaleDateString("es-CL") + " " + fecha.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }));
    lineas.push(T().capitulosCompletados + ": " + (CA.estado.completados.length ? CA.estado.completados.map(function (c) { return CA.Datos.capitulo(c) ? CA.Datos.capitulo(c).numero : c; }).join(", ") : "—"));
    lineas.push("");
    capitulosConEvaluacion().forEach(function (cid) {
      var cap = CA.Datos.capitulo(cid);
      var ev = DATOS.evaluacion[cid];
      var r = CA.estado.respuestas[cid] || { abiertas: {}, multiple: {} };
      lineas.push("-".repeat(60));
      lineas.push("CAPÍTULO " + cap.numero + ": " + cap.titulo.toUpperCase());
      lineas.push("-".repeat(60));
      ev.abiertas.forEach(function (p, i) {
        lineas.push("");
        lineas.push((i + 1) + ". " + CA.texto(p.pregunta));
        var t = (r.abiertas[p.id] || "").trim();
        lineas.push(t ? t : "(" + T().sinResponder + ")");
      });
      lineas.push("");
      lineas.push(T().comprobacion + ":");
      ev.multiple.forEach(function (p, i) {
        var m = r.multiple[p.id];
        var estado;
        if (!m) estado = T().sinResponder;
        else if (p.opciones[m.primera] && p.opciones[m.primera].correcta) estado = T().alPrimerIntento;
        else if (m.correcta) estado = T().conIntentos.replace("{n}", m.intentos);
        else estado = T().sinResolver;
        lineas.push("  " + (i + 1) + ". " + estado);
      });
      lineas.push("");
    });
    return lineas.join("\r\n");
  }

  function nombreArchivo() {
    var j = CA.estado.jugador;
    var limpio = function (s) {
      return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
    };
    return [limpio(j.nombre) || "estudiante", limpio(j.curso) || "curso", limpio(DATOS.config.titulo)].join("_") + ".txt";
  }

  function descargar() {
    var blob = new Blob(["﻿" + textoPlano()], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo();
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 500);
  }

  CA.Exportar = {
    textoPlano: textoPlano,
    nombreArchivo: nombreArchivo,
    descargar: descargar,

    abrir: function (opciones) {
      opciones = opciones || {};
      CA.UI.modal({
        titulo: opciones.final ? T().finalTitulo : T().misRespuestas,
        clase: "ancho",
        construir: function (cuerpo) {
          var j = CA.estado.jugador;
          var html = opciones.final ? CA.html(T().finalTexto) : "";
          html += "<p><strong>" + T().nombre + ":</strong> " + esc(j.nombre || "—") + " · <strong>" + T().curso + ":</strong> " + esc(j.curso || "—") + "</p>";
          var alguna = false;
          capitulosConEvaluacion().forEach(function (cid) {
            var cap = CA.Datos.capitulo(cid);
            var r = CA.estado.respuestas[cid];
            if (!r) return;
            alguna = true;
            html += '<section class="resumen-cap"><h3>Capítulo ' + cap.numero + " · " + esc(cap.titulo) + "</h3>";
            DATOS.evaluacion[cid].abiertas.forEach(function (p) {
              html += "<p><strong>" + esc(CA.texto(p.pregunta)) + "</strong></p><blockquote>" + (esc((r.abiertas[p.id] || "").trim()) || "<em>" + T().sinResponder + "</em>") + "</blockquote>";
            });
            var n = DATOS.evaluacion[cid].multiple.length;
            var alPrimero = DATOS.evaluacion[cid].multiple.filter(function (p) {
              var m = r.multiple[p.id];
              return m && p.opciones[m.primera] && p.opciones[m.primera].correcta;
            }).length;
            html += "<p class=\"ayuda\">" + T().resumenMultiple.replace("{n}", alPrimero).replace("{total}", n) + "</p></section>";
          });
          if (!alguna) html += "<p>" + T().sinRespuestasAun + "</p>";
          cuerpo.innerHTML = html;
          var fila = CA.UI.crear("div", "fila-botones");
          fila.appendChild(CA.UI.boton(T().descargarTxt, "boton-principal", descargar));
          cuerpo.appendChild(fila);
        }
      });
    }
  };
})(window.CA);
