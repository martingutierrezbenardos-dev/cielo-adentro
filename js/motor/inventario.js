/* Inventario: se selecciona un objeto y luego se pulsa una zona de la escena para usarlo. */
(function (CA) {
  "use strict";

  var el;
  var sel = null;

  CA.Inventario = {
    iniciar: function () { el = document.getElementById("inventario"); },

    seleccionado: function () { return sel; },

    deseleccionar: function () {
      sel = null;
      document.getElementById("escenario").classList.remove("usando");
      CA.Inventario.render();
    },

    enfocar: function () {
      var b = el && el.querySelector(".objeto");
      if (b) b.focus();
      else CA.UI.aviso(DATOS.config.textos.inventarioVacio);
    },

    render: function () {
      if (!el) return;
      if (sel && !CA.E.tiene(sel)) sel = null;
      el.innerHTML = "";
      var t = document.createElement("span");
      t.className = "inventario-titulo";
      t.textContent = DATOS.config.textos.inventario;
      el.appendChild(t);
      if (!CA.estado.inventario.length) {
        var v = document.createElement("span");
        v.className = "inventario-vacio";
        v.textContent = DATOS.config.textos.inventarioVacio;
        el.appendChild(v);
        return;
      }
      CA.estado.inventario.forEach(function (id) {
        var o = CA.Datos.objeto(id);
        var b = document.createElement("button");
        b.type = "button";
        b.className = "objeto";
        b.setAttribute("aria-pressed", sel === id ? "true" : "false");
        b.title = o.descripcion || o.nombre;
        b.innerHTML = CA.Arte.objeto(id) + "<span>" + o.nombre + "</span>";
        b.addEventListener("click", function () {
          if (sel === id) { CA.Inventario.deseleccionar(); return; }
          sel = id;
          document.getElementById("escenario").classList.add("usando");
          CA.Inventario.render();
          CA.UI.aviso(DATOS.config.textos.usarObjeto.replace("{objeto}", o.nombre));
          var primero = document.querySelector("#hotspots .hotspot");
          if (primero) primero.focus();
        });
        el.appendChild(b);
      });
    }
  };
})(window.CA);
