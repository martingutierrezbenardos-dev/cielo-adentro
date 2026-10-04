// Recorrido automático de los capítulos 0 y 1 (requiere Playwright).
// Uso: node tests/servidor.js  y en otra terminal  node tests/recorrido-automatico.js [capturas]
const { chromium } = require('playwright');
const DIR = require('os').tmpdir() + '/cielo-adentro-';
const capturas = process.argv[2] === 'capturas';
let n = 0;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errores = [];
  p.on('pageerror', e => errores.push('pageerror: ' + e.message));
  p.on('console', m => { if ((m.type() === 'error' || m.type() === 'warning') && !/ERR_CERT|fonts/.test(m.text())) errores.push(m.type() + ': ' + m.text()); });
  await p.goto('http://localhost:8765/');
  await p.waitForTimeout(400);
  await p.fill('#in-nombre', 'Ana');
  await p.fill('#in-curso', '4B');
  await p.click('#btn-nueva');
  await p.waitForTimeout(600);

  const intentos = {};
  async function foto(nombre) { if (capturas) await p.screenshot({ path: DIR + 'r' + String(++n).padStart(2, '0') + '-' + nombre + '.png' }); }

  async function estado() {
    return p.evaluate(() => {
      const q = s => document.querySelector(s);
      return {
        escena: CA.estado.escena,
        dlg: !q('#dialogo').hidden,
        dlgOps: !!q('#dialogo .dialogo-opciones:not([hidden])'),
        combate: !!q('.modal-combate'),
        menu: !!q('.combate-menu:not([hidden])'),
        menuTxt: [...document.querySelectorAll('.combate-menu .opcion-gb')].map(b => (b.disabled ? '!' : '') + (b.classList.contains('usada') ? '~' : '') + b.innerText),
        textoMenu: q('.combate-texto') ? q('.combate-texto').innerText : '',
        modal: q('.modal:not(.modal-combate) h2') ? q('.modal:not(.modal-combate) h2').textContent : null,
        ocupado: CA.Escena.ocupado()
      };
    });
  }

  // Resuelve lo que esté abierto (diálogos, duelos, puzles, evaluación) hasta volver al mapa.
  async function resolver(max = 4000) {
    for (let i = 0; i < max; i++) {
      const e = await estado();
      if (e.combate) {
        if (e.menu) {
          const k = e.textoMenu + '|' + e.menuTxt.join('/');
          intentos[k] = (intentos[k] || 0);
          let idx;
          const s12 = e.menuTxt.findIndex(t => /S-12/.test(t));
          if (s12 !== -1) idx = e.menuTxt[s12].startsWith('!') ? 1 : s12;
          else {
            const libres = e.menuTxt.map((t, j) => [t, j]).filter(([t]) => !t.startsWith('!') && !t.startsWith('~'));
            idx = libres[intentos[k] % libres.length][1];
          }
          intentos[k]++;
          await p.keyboard.press(String(idx + 1));
        } else {
          await p.keyboard.press('Enter');
        }
        await p.waitForTimeout(40);
        continue;
      }
      if (e.modal) {
        const hecho = await p.evaluate(() => {
          const m = document.querySelector('.modal:not(.modal-combate)');
          // Evaluación: llenar textos
          m.querySelectorAll('textarea').forEach(t => { if (!t.value) { t.value = 'Respuesta de prueba con varias palabras.'; t.dispatchEvent(new Event('input', { bubbles: true })); } });
          // en cada grupo de opciones sin respuesta correcta, probar la siguiente
          const grupos = [...m.querySelectorAll('.opciones')].filter(g => !g.querySelector('.correcta'));
          if (grupos.length) {
            const g = grupos[0];
            const k = +(g.dataset.k || 0); g.dataset.k = k + 1;
            const ops = [...g.querySelectorAll('.opcion')].filter(x => !x.disabled);
            if (ops.length) { ops[k % ops.length].click(); return 'op'; }
          }
          const principal = [...m.querySelectorAll('.boton-principal')].find(x => !x.disabled && x.offsetParent);
          if (principal && /Siguiente|Terminar|Continuar|Ver resumen/.test(principal.textContent)) { principal.click(); return principal.textContent; }
          const ops = [...m.querySelectorAll('.pregunta')];
          return 'nada:' + m.querySelector('h2').textContent;
        });
        if (hecho === 'nada:Resumen final') return true; // pantalla final del juego
        if (/^nada/.test(hecho)) { console.log('Atascado en modal', hecho); return false; }
        await p.waitForTimeout(80);
        continue;
      }
      if (e.dlg) {
        await p.keyboard.press(e.dlgOps ? '1' : 'Enter');
        await p.waitForTimeout(40);
        continue;
      }
      if (e.ocupado || await p.evaluate(() => !!CA.Escena._moviendo && CA.Escena._moviendo())) { await p.waitForTimeout(80); continue; }
      return true;
    }
    console.log('resolver: demasiados pasos');
    return false;
  }

  async function ir(etiqueta, fotoNombre) {
    const ok = await p.evaluate(et => {
      const b = [...document.querySelectorAll('#hotspots button')].find(x => x.textContent.startsWith(et));
      if (!b) return [...document.querySelectorAll('#hotspots button')].map(x => x.textContent);
      b.click();
      return true;
    }, etiqueta);
    if (ok !== true) { console.log('No encontré', etiqueta, 'en', await p.evaluate(() => CA.estado.escena), ok); return false; }
    // esperar a llegar (o a que se abra algo)
    for (let i = 0; i < 100; i++) {
      await p.waitForTimeout(100);
      const e = await estado();
      if (e.dlg || e.combate || e.modal || e.ocupado) break;
      const quieto = await p.evaluate(() => !CA.Escena.ocupado());
      if (i > 30 && quieto) break;
    }
    if (fotoNombre) await foto(fotoNombre);
    return resolver();
  }

  async function paso(et, f) { const r = await ir(et, f); console.log((r ? 'ok   ' : 'FALLA') + ' ' + et + ' → ' + (await estado()).escena); if (!r) throw new Error('falló ' + et); }

  try {
    await resolver();
    await foto('camino');
    await paso('Charco en el camino', 'charco');
    await paso('Charco en el camino');     // el espejismo se aleja: hay que seguirlo
    await paso('Subir al observatorio');   // todavía no: debe retroceder
    await paso('La Luna');
    await paso('Letrero');
    await paso('Subir al observatorio');
    await foto('pieza');
    await paso('Vaso de agua');
    await paso('Libro con papelitos');
    await paso('Dormir');
    await foto('sueno');
    await paso('Espejo');
    await paso('Reloj flotante');
    await paso('Dra. Collao');
    await paso('Una luz muy brillante');
    await paso('Ir al planetario', 'pieza-despierto');
    await foto('planetario');
    await paso('Valentina');
    await paso('Figura luminosa', 'descartes');
    await paso('Eco de David Hume', 'hume');
    console.log('Capítulo 0 completado:', await p.evaluate(() => CA.estado.completados));
    await resolver();
    await foto('cap1');
    await paso('Entrar a la cúpula');
    await foto('cupula');
    await paso('Telescopio');
    await paso('Pantalla del fotómetro');
    await paso('Cuaderno rojo');
    await paso('Puerta del archivo');
    // usar la llave desde la mochila
    await p.keyboard.press('i');
    await p.waitForTimeout(200);
    await foto('mochila');
    await p.click('.objeto-mochila');
    await resolver();
    console.log('tras usar llave →', (await estado()).escena);
    await foto('archivo');
    await paso('Archivador');
    await paso('Bitácora');
    await paso('Catálogo');
    await paso('Volver a la cúpula');
    await paso('Bajar a la explanada');
    await paso('Don Ramiro');
    await paso('Entrar a la cúpula');
    await paso('Pizarra de leyes');
    await paso('Bajar a la explanada');
    await paso('Don Ramiro', 'ramiro-invita');
    await foto('gallinero');
    await paso('Clotilde');
    await paso('Volver a la explanada');
    await foto('nova');
    await paso('El Campo del Salar');
    await paso('Entrar a la cúpula');
    await paso('Telescopio');
    await paso('Dra. Inés Collao', 'collao-final');
    const comp = await p.evaluate(() => CA.estado.completados);
    console.log('Completados:', comp);
    if (comp.indexOf('cap1') === -1) process.exitCode = 1;
  } catch (e) {
    process.exitCode = 1;
    console.log('ERROR:', e.message);
    await foto('error');
  }
  console.log(errores.join('\n') || 'sin errores de consola');
  if (errores.length) process.exitCode = 1;
  await b.close();
})();
