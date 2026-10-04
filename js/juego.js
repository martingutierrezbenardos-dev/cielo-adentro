/* Arranque: pantalla de inicio, inicio y fin de capítulos. */
(function (CA) {
  "use strict";

  var enPartida = false;
  function T() { return DATOS.config.textos; }
  function $(id) { return document.getElementById(id); }

  function mostrarJuego(si) {
    enPartida = si;
    $("barra").hidden = !si;
    $("controles").hidden = !si;
    document.body.classList.toggle("en-partida", si);
    $("inicio").hidden = si;
    if (si) {
      CA.Escena.ajustarTamano();
      CA.Inventario.render();
      CA.UI.actualizarBarra();
    }
  }

  function prefijo(capId) {
    var cap = CA.Datos.capitulo(capId);
    return (cap && cap.prefijo) || capId + "-";
  }

  // Portada animada (las estrellas titilan) mientras la pantalla de inicio esté visible.
  function dibujarPortada(lienzo) {
    var ctx = lienzo.getContext("2d");
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.imageSmoothingEnabled = false;
    var f = 0;
    (function tic() {
      if (!document.body.contains(lienzo) || $("inicio").hidden) return;
      CA.Pixel.portada(ctx, f);
      f = 1 - f;
      if (!document.body.classList.contains("sin-animaciones")) setTimeout(tic, 900);
    })();
  }

  CA.Juego = {
    enPartida: function () { return enPartida; },

    pantallaInicio: function () {
      if (enPartida) CA.Guardado.guardarYa();
      CA.reiniciarFlujo();
      mostrarJuego(false);
      var guardado = CA.Guardado.cargar();
      var el = $("inicio");
      el.className = "inicio";
      el.innerHTML = '<div class="inicio-arte" aria-hidden="true"><canvas width="480" height="320"></canvas></div>';
      dibujarPortada(el.querySelector("canvas"));
      var panel = CA.UI.crear("div", "inicio-panel");
      var hayPartida = guardado && guardado.capitulo;
      var j = hayPartida ? guardado.jugador : CA.estado.jugador;
      panel.innerHTML =
        "<h1>" + CA.UI.esc(DATOS.config.titulo) + "</h1>" +
        '<p class="sub">' + CA.UI.esc(DATOS.config.subtitulo) + "</p>" +
        '<form id="form-inicio">' +
        '<div class="campo"><label for="in-nombre">' + T().tuNombre + '</label><input id="in-nombre" autocomplete="name" maxlength="60" required></div>' +
        '<div class="campo"><label for="in-curso">' + T().tuCurso + '</label><input id="in-curso" maxlength="30" placeholder="' + CA.UI.esc(T().cursoEjemplo) + '" required></div>' +
        '<p class="ayuda" id="inicio-error" aria-live="polite"></p>' +
        '<div class="inicio-botones">' +
        (hayPartida ? '<button type="button" class="boton boton-principal" id="btn-continuar">' + T().continuarPartida + "</button>" : "") +
        '<button type="submit" class="boton' + (hayPartida ? "" : " boton-principal") + '" id="btn-nueva">' + (hayPartida ? T().nuevaPartida : T().comenzar) + "</button>" +
        "</div></form>" +
        '<div class="inicio-pie">' +
        '<button type="button" class="boton" id="in-ajustes">' + T().ajustes + "</button>" +
        '<button type="button" class="boton" id="in-ayuda">' + T().ayuda + "</button>" +
        '<button type="button" class="boton" id="in-docente">' + T().modoDocente + "</button>" +
        "</div>" +
        (CA.Guardado.disponible ? "" : '<p class="ayuda">' + T().guardadoNoDisponible + "</p>");
      el.appendChild(panel);

      panel.querySelector("#in-nombre").value = j.nombre || "";
      panel.querySelector("#in-curso").value = j.curso || "";

      function datos() {
        var n = panel.querySelector("#in-nombre").value.trim();
        var c = panel.querySelector("#in-curso").value.trim();
        if (!n || !c) { panel.querySelector("#inicio-error").textContent = T().faltanDatos; return null; }
        return { nombre: n, curso: c };
      }

      panel.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();
        var d = datos();
        if (!d) return;
        if (hayPartida && !window.confirm(T().confirmarNueva)) return;
        CA.Juego.nuevaPartida(d);
      });
      if (hayPartida) {
        panel.querySelector("#btn-continuar").addEventListener("click", function () {
          var d = datos();
          CA.estado = guardado;
          if (d) CA.estado.jugador = d;
          CA.Juego.continuar();
        });
      }
      panel.querySelector("#in-ajustes").addEventListener("click", CA.UI.abrirAjustes);
      panel.querySelector("#in-ayuda").addEventListener("click", CA.UI.abrirAyuda);
      panel.querySelector("#in-docente").addEventListener("click", function () {
        if (!CA.estado.jugador.nombre) {
          var d = datos();
          CA.estado.jugador = d || { nombre: "Docente", curso: "—" };
        }
        CA.Docente.abrir();
      });
      setTimeout(function () {
        var f = hayPartida ? panel.querySelector("#btn-continuar") : panel.querySelector("#in-nombre");
        if (f) f.focus();
      }, 50);
    },

    nuevaPartida: function (jugador) {
      CA.reiniciarFlujo();
      CA.estado = CA.estadoInicial();
      CA.estado.jugador = jugador;
      CA.Guardado.guardarYa();
      mostrarJuego(true);
      CA.Juego.iniciarCapitulo(CA.Datos.capitulos()[0]);
    },

    continuar: function () {
      CA.reiniciarFlujo();
      mostrarJuego(true);
      if (!CA.Datos.escena(CA.estado.escena)) {
        CA.Juego.iniciarCapitulo(CA.estado.capitulo || CA.Datos.capitulos()[0]);
        return;
      }
      // Se vuelve a "entrar" a la escena: si la partida se cerró a mitad de un evento
      // de entrada, este se repite (las banderas evitan que se dupliquen los ya hechos).
      CA.Escena.ir(CA.estado.escena);
    },

    iniciarCapitulo: async function (capId) {
      var cap = CA.Datos.capitulo(capId);
      if (!cap) return;
      mostrarJuego(true);
      CA.estado.capitulo = capId;
      CA.estado.escena = null;
      await CA.Escena.ir(cap.escenaInicial);
    },

    // Reinicia las banderas y puzles del capítulo y lo comienza (modo docente).
    saltarACapitulo: function (capId) {
      CA.reiniciarFlujo();
      var p = prefijo(capId);
      Object.keys(CA.estado.banderas).forEach(function (b) { if (b.indexOf(p) === 0) delete CA.estado.banderas[b]; });
      var cap = CA.Datos.capitulo(capId);
      Object.keys(cap.puzles || {}).forEach(function (pid) { delete CA.estado.puzles[pid]; });
      CA.estado.registro = CA.estado.registro.filter(function (r) { return !(cap.observaciones && cap.observaciones[r]); });
      if (cap.inventarioInicial) CA.E.dar(cap.inventarioInicial);
      // Los capítulos anteriores se consideran completados.
      var todos = CA.Datos.capitulos();
      todos.slice(0, todos.indexOf(capId)).forEach(function (c) {
        if (CA.estado.completados.indexOf(c) === -1) CA.estado.completados.push(c);
      });
      if (!CA.estado.jugador.nombre) CA.estado.jugador = { nombre: "Docente", curso: "—" };
      CA.Juego.iniciarCapitulo(capId);
    },

    finCapitulo: function (capId) {
      if (CA.estado.completados.indexOf(capId) === -1) CA.estado.completados.push(capId);
      CA.Guardado.guardarYa();
      var cap = CA.Datos.capitulo(capId);
      var todos = CA.Datos.capitulos();
      var sig = todos[todos.indexOf(capId) + 1];
      var hayMasPlaneados = (DATOS.config.capitulos || []).indexOf(capId) < (DATOS.config.capitulos || []).length - 1;
      return new Promise(function (resolver) {
        CA.UI.modal({
          titulo: T().capituloCompletado.replace("{n}", cap.numero),
          cerrable: false,
          construir: function (cuerpo, modal) {
            cuerpo.innerHTML = CA.html(cap.cierre || "") + (!sig && hayMasPlaneados ? CA.html(T().proximamente) : "");
            var fila = CA.UI.crear("div", "fila-botones");
            fila.appendChild(CA.UI.boton(T().misRespuestas, null, function () { CA.Exportar.abrir(); }));
            if (sig) {
              fila.appendChild(CA.UI.boton(T().siguienteCapitulo, "boton-principal", function () {
                modal.cerrar(); resolver(); CA.Juego.iniciarCapitulo(sig);
              }));
            } else {
              fila.appendChild(CA.UI.boton(T().verFinal, "boton-principal", function () {
                modal.cerrar(); resolver(); CA.Exportar.abrir({ final: true });
              }));
            }
            cuerpo.appendChild(fila);
          }
        });
      });
    }
  };

  /* ---------- Arranque ---------- */
  function arrancar() {
    document.title = DATOS.config.titulo;
    CA.Escena.iniciar();
    CA.Dialogo.iniciar();
    CA.Inventario.iniciar();
    CA.UI.iniciar();
    CA.Juego.pantallaInicio();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancar);
  else arrancar();
})(window.CA);
