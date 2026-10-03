/* Mochila: lista de objetos. Para usar uno, ponte frente a algo, abre la mochila (tecla I)
   y elige el objeto: se usa en lo que tienes enfrente. */
(function (CA) {
  "use strict";

  function T() { return DATOS.config.textos; }

  CA.Inventario = {
    iniciar: function () {},

    // Compatibilidad con el motor anterior: ya no hay objeto "seleccionado".
    seleccionado: function () { return null; },
    deseleccionar: function () {},

    // Actualiza el contador del botón de la mochila.
    render: function () {
      var b = document.getElementById("btn-mochila");
      if (!b) return;
      var n = CA.estado.inventario.length;
      var c = b.querySelector(".cuenta");
      if (c) c.textContent = n ? String(n) : "";
    },

    enfocar: function () { CA.Inventario.abrir(); },

    abrir: function () {
      var sup = CA.UI.modalSuperior();
      if (sup && sup.tipo === "mochila") { sup.cerrar(); return; }
      if (CA.Dialogo.abierto() || CA.Escena.ocupado()) return;
      var m = CA.UI.modal({
        titulo: T().mochilaTitulo,
        construir: function (cuerpo, modal) {
          if (!CA.estado.inventario.length) {
            cuerpo.innerHTML = "<p>" + T().mochilaVacia + "</p>";
            return;
          }
          cuerpo.appendChild(CA.UI.crear("p", "ayuda", T().mochilaAyuda));
          var lista = CA.UI.crear("div", "opciones");
          CA.estado.inventario.forEach(function (id) {
            var o = CA.Datos.objeto(id);
            var b = CA.UI.boton('<span class="cursor" aria-hidden="true">▶</span><strong>' + CA.UI.esc(o.nombre) + "</strong>" +
              (o.descripcion ? '<span class="desc">' + CA.UI.esc(o.descripcion) + "</span>" : ""), "opcion objeto-mochila", function () {
              modal.cerrar();
              CA.Escena.usarObjeto(id);
            });
            lista.appendChild(b);
          });
          cuerpo.appendChild(lista);
        }
      });
      m.tipo = "mochila";
    }
  };
})(window.CA);
