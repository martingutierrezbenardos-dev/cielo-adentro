/* Iconos de inventario (viewBox 48×48). */
(function (CA) {
  "use strict";
  var A = CA.Arte;
  var c = A.c;

  var iconos = {
    "llave-archivo": function () {
      return '<circle cx="15" cy="24" r="9" fill="none" stroke="' + c("ambar") + '" stroke-width="4"/>' +
        '<path d="M24 24 H42 M36 24 V31 M41 24 V29" stroke="' + c("ambar") + '" stroke-width="4" stroke-linecap="round"/>';
    },
    "linterna-roja": function () {
      return '<rect x="8" y="18" width="24" height="12" rx="3" fill="' + c("metal") + '"/>' +
        '<path d="M32 16 L40 12 V36 L32 32Z" fill="' + c("metal-2") + '"/>' +
        '<path d="M40 14 L46 10 V38 L40 34Z" fill="' + c("rojo") + '" opacity=".8"/>';
    },
    lupa: function () {
      return '<circle cx="20" cy="20" r="11" fill="' + c("turquesa") + '" fill-opacity=".25" stroke="' + c("metal-2") + '" stroke-width="4"/>' +
        '<path d="M28 28 L41 41" stroke="' + c("madera-2") + '" stroke-width="6" stroke-linecap="round"/>';
    },
    "tarjeta-acceso": function () {
      return '<rect x="7" y="12" width="34" height="24" rx="4" fill="' + c("turquesa") + '"/>' +
        '<rect x="11" y="17" width="10" height="8" rx="2" fill="' + c("ambar") + '"/>' +
        '<path d="M11 30 H35" stroke="' + c("cielo-1") + '" stroke-width="2"/>';
    },
    "tiza": function () {
      return '<rect x="10" y="20" width="30" height="9" rx="4" transform="rotate(-25 25 24)" fill="' + c("papel") + '"/>';
    }
  };

  A.objeto = function (id) {
    var f = iconos[id];
    var dib = f ? f() : '<circle cx="24" cy="24" r="14" fill="' + c("metal") + '"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' + dib + "</svg>";
  };
})(window.CA);
