/* Estado global del juego: banderas, inventario, registro, cuaderno, respuestas. */
window.CA = window.CA || {};

(function (CA) {
  "use strict";

  function estadoInicial() {
    return {
      version: 1,
      jugador: { nombre: "", curso: "" },
      capitulo: null,
      escena: null,
      banderas: {},
      inventario: [],
      registro: [],        // ids de observaciones anotadas
      cuaderno: [],        // ids de entradas desbloqueadas
      glosario: [],        // ids de términos desbloqueados
      respuestas: {},      // { cap1: { abiertas: {id: texto}, multiple: {id: {primera, final, correcta}} } }
      pistas: {},          // { puzleId: nivel usado }
      puzles: {},          // estado interno de cada puzle
      completados: [],     // capítulos terminados
      visitados: {}        // hotspots ya usados (para marcar "nuevo")
    };
  }

  CA.estadoInicial = estadoInicial;

  // "Generación" del flujo de juego: al volver al inicio, empezar otra partida o saltar
  // de capítulo se incrementa, y todo diálogo o cadena de acciones pendiente se cancela.
  CA.generacion = 0;
  CA.reiniciarFlujo = function () {
    CA.generacion++;
    if (CA.Dialogo && CA.Dialogo.reiniciar) CA.Dialogo.reiniciar();
    if (CA.UI && CA.UI.cerrarTodos) CA.UI.cerrarTodos();
    if (CA.Escena && CA.Escena.desbloquearTodo) CA.Escena.desbloquearTodo();
    if (CA.Inventario && CA.Inventario.seleccionado && CA.Inventario.seleccionado()) CA.Inventario.deseleccionar();
  };
  CA.estado = estadoInicial();

  function lista(v) { return v == null ? [] : Array.isArray(v) ? v : [v]; }
  CA.lista = lista;

  CA.E = {
    bandera: function (n) { return !!CA.estado.banderas[n]; },
    poner: function (n) { lista(n).forEach(function (b) { CA.estado.banderas[b] = true; }); },
    sacar: function (n) { lista(n).forEach(function (b) { delete CA.estado.banderas[b]; }); },
    tiene: function (o) { return CA.estado.inventario.indexOf(o) !== -1; },
    dar: function (o) {
      lista(o).forEach(function (x) {
        if (CA.estado.inventario.indexOf(x) === -1) CA.estado.inventario.push(x);
      });
    },
    quitar: function (o) {
      lista(o).forEach(function (x) {
        var i = CA.estado.inventario.indexOf(x);
        if (i !== -1) CA.estado.inventario.splice(i, 1);
      });
    },
    registrar: function (id) {
      if (CA.estado.registro.indexOf(id) !== -1) return false;
      CA.estado.registro.push(id);
      return true;
    },
    desbloquear: function (tipo, id) {
      var arr = CA.estado[tipo];
      if (!arr || arr.indexOf(id) !== -1) return false;
      arr.push(id);
      return true;
    },
    respuestas: function (cap) {
      if (!CA.estado.respuestas[cap]) CA.estado.respuestas[cap] = { abiertas: {}, multiple: {} };
      return CA.estado.respuestas[cap];
    }
  };
})(window.CA);
