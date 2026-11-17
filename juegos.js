/* ============================================================
   Juegos interactivos
   ============================================================ */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const D = window.DATOS;

  let juegoActual = null;
  let manejarClick = null;
  let intervalo = null;
  let estado = null;

  const meta = {
    vf: { titulo: 'Verdadero o falso', tipo: 'pct' },
    parear: { titulo: 'Emparejar conceptos', tipo: 'pct' },
    completar: { titulo: 'Completar la función', tipo: 'pct' },
    vertice: { titulo: 'Identificar el vértice', tipo: 'pct' },
    reto: { titulo: 'Reto contrarreloj', tipo: 'pts' },
    sudoku: { titulo: 'Sudoku cuadrático', tipo: 'pct' },
    crucigrama: { titulo: 'Crucigrama algebraico', tipo: 'pct' },
    sopa: { titulo: 'Sopa de letras', tipo: 'pct' },
    ordenar: { titulo: 'Ordena los pasos', tipo: 'pct' },
    relampago: { titulo: 'Desafío relámpago', tipo: 'pts' }
  };

  function mezclar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function puntajeTexto() {
    if (!estado) return 'Puntaje: 0';
    if (juegoActual === 'reto') return `Puntos: ${estado.puntos}`;
    if (juegoActual === 'parear') return `Parejas: ${estado.emparejadas.size}/${D.parejas.length}`;
    if (juegoActual === 'vf') return `Aciertos: ${estado.aciertos}/${estado.lista.length}`;
    if (juegoActual === 'completar') return `Aciertos: ${estado.aciertos}/${estado.lista.length}`;
    if (juegoActual === 'vertice') return `Aciertos: ${estado.aciertos}/${estado.lista.length}`;
    return 'Puntaje: 0';
  }

  function actualizarPuntaje() {
    const el = $('puntajeJuego');
    if (el) el.textContent = puntajeTexto();
  }

  function barra(actual, total) {
    const pct = total ? Math.round(actual / total * 100) : 0;
    return `<div class="progreso-juego"><span>${actual} de ${total}</span><div class="barra-avance"><span style="width:${pct}%"></span></div><span>${pct}%</span></div>`;
  }

  function feedback(ok, titulo, texto) {
    return `<div class="feedback ${ok ? 'ok' : 'mal'}">
      <svg class="icono"><use href="#${ok ? 'i-check-circulo' : 'i-x-circulo'}"/></svg>
      <div><strong>${titulo}</strong>${texto}</div>
    </div>`;
  }

  function limpiarIntervalo() {
    if (intervalo) { clearInterval(intervalo); intervalo = null; }
  }

  function registrar(id, valor) {
    if (window.FC && FC.registrarJuego) FC.registrarJuego(id, valor);
    actualizarRecords();
  }

  function actualizarRecords() {
    const juegos = (window.FC && FC.progreso && FC.progreso.juegos) || {};
    let completados = 0;
    Object.keys(meta).forEach((id) => {
      const el = $('record-' + id);
      const dato = juegos[id];
      if (dato && dato.veces > 0) {
        completados++;
        if (el) el.textContent = meta[id].tipo === 'pts' ? `${dato.mejor} pts` : `${dato.mejor} %`;
      } else if (el) {
        el.textContent = 'sin jugar';
      }
    });
    const texto = $('juegosCompletadosTexto');
    if (texto) texto.textContent = `${completados} de 10 completados`;
  }

  function mostrarResultado(titulo, cifra, mensaje, id) {
    limpiarIntervalo();
    const cuerpo = $('juegoCuerpo');
    cuerpo.innerHTML = `<div class="resultado-juego">
      <div class="medalla"><svg class="icono"><use href="#i-trofeo"/></svg></div>
      <h3>${titulo}</h3>
      <div class="cifra-grande">${cifra}</div>
      <p>${mensaje}</p>
      <div class="acciones-juego">
        <button type="button" class="btn btn-primario" data-repetir="${id}"><svg class="icono"><use href="#i-reiniciar"/></svg>Jugar de nuevo</button>
        <button type="button" class="btn btn-secundario" data-salir-juego><svg class="icono"><use href="#i-dado"/></svg>Volver a los juegos</button>
      </div>
    </div>`;
    manejarClick = (e) => {
      const repetir = e.target.closest('[data-repetir]');
      if (repetir) { abrir(repetir.dataset.repetir); return; }
      if (e.target.closest('[data-salir-juego]')) salir();
    };
    actualizarRecords();
  }

  /* ---------------- Verdadero o falso ---------------- */
  function iniciarVF() {
    estado = { lista: mezclar(D.vf), idx: 0, aciertos: 0, respondida: false };
    renderVF();
  }

  function renderVF() {
    const e = estado;
    const item = e.lista[e.idx];
    const cuerpo = $('juegoCuerpo');
    cuerpo.innerHTML = `
      ${barra(e.idx + 1, e.lista.length)}
      <div class="vf-enunciado">${item.texto}</div>
      <div class="vf-botones">
        <button type="button" class="vf-boton verdadero" data-vf="true" ${e.respondida ? 'disabled' : ''}><svg class="icono"><use href="#i-check"/></svg>Verdadero</button>
        <button type="button" class="vf-boton falso" data-vf="false" ${e.respondida ? 'disabled' : ''}><svg class="icono"><use href="#i-x"/></svg>Falso</button>
      </div>
      <div id="feedbackVF"></div>
      <div class="acciones-juego">${e.respondida ? '<button type="button" class="btn btn-primario" data-siguiente-vf>Siguiente <svg class="icono"><use href="#i-flecha"/></svg></button>' : ''}</div>`;
    actualizarPuntaje();

    manejarClick = (ev) => {
      const boton = ev.target.closest('[data-vf]');
      if (boton && !e.respondida) {
        const elegido = boton.dataset.vf === 'true';
        e.respondida = true;
        const acierto = elegido === item.verdadero;
        if (acierto) e.aciertos++;
        document.querySelectorAll('[data-vf]').forEach((b) => {
          b.disabled = true;
          const valor = b.dataset.vf === 'true';
          if (valor === item.verdadero) b.classList.add('correcta');
          else if (b === boton) b.classList.add('incorrecta');
        });
        $('feedbackVF').innerHTML = feedback(acierto, acierto ? '¡Correcto!' : 'Respuesta incorrecta', item.explicacion);
        const acciones = cuerpo.querySelector('.acciones-juego');
        acciones.innerHTML = '<button type="button" class="btn btn-primario" data-siguiente-vf>Siguiente <svg class="icono"><use href="#i-flecha"/></svg></button>';
        actualizarPuntaje();
        return;
      }
      if (ev.target.closest('[data-siguiente-vf]')) {
        if (e.idx < e.lista.length - 1) {
          e.idx++;
          e.respondida = false;
          renderVF();
        } else {
          const pct = Math.round(e.aciertos / e.lista.length * 100);
          registrar('vf', pct);
          const msg = pct >= 90 ? '¡Excelente dominio de los conceptos!' : pct >= 70 ? 'Muy bien: repasa las afirmaciones que fallaste.' : 'Conviene repasar las explicaciones antes de volver a intentarlo.';
          mostrarResultado('Juego terminado', `${pct} %`, `${e.aciertos} de ${e.lista.length} afirmaciones correctas. ${msg}`, 'vf');
        }
      }
    };
  }

  /* ---------------- Emparejar ---------------- */
  function iniciarParear() {
    estado = {
      izquierda: mezclar(D.parejas.map((p, i) => ({ id: i, texto: p.concepto }))),
      derecha: mezclar(D.parejas.map((p, i) => ({ id: i, texto: p.definicion }))),
      seleccionIzq: null,
      seleccionDer: null,
      emparejadas: new Set(),
      errores: 0,
      error: [],
      inicio: Date.now(),
      segundos: 0,
      terminado: false
    };
    limpiarIntervalo();
    intervalo = setInterval(() => {
      if (!estado || estado.terminado) return;
      estado.segundos = Math.floor((Date.now() - estado.inicio) / 1000);
      const el = $('parearTiempo');
      if (el) el.textContent = `${estado.segundos} s`;
    }, 1000);
    renderParear();
  }

  function renderParear() {
    const e = estado;
    const total = D.parejas.length;
    const izq = e.izquierda.map((f) => {
      const activa = e.seleccionIzq === f.id;
      const hecha = e.emparejadas.has(f.id);
      const error = e.error.includes('i' + f.id);
      return `<button type="button" class="ficha${activa ? ' seleccionada' : ''}${hecha ? ' emparejada' : ''}${error ? ' error' : ''}" data-parear-lado="i" data-parear-id="${f.id}" ${hecha ? 'disabled' : ''}>${f.texto}</button>`;
    }).join('');
    const der = e.derecha.map((f) => {
      const activa = e.seleccionDer === f.id;
      const hecha = e.emparejadas.has(f.id);
      const error = e.error.includes('d' + f.id);
      return `<button type="button" class="ficha${activa ? ' seleccionada' : ''}${hecha ? ' emparejada' : ''}${error ? ' error' : ''}" data-parear-lado="d" data-parear-id="${f.id}" ${hecha ? 'disabled' : ''}>${f.texto}</button>`;
    }).join('');
    $('juegoCuerpo').innerHTML = `
      ${barra(e.emparejadas.size, total)}
      <p style="font-size:.85rem;color:var(--muted);margin-bottom:.8rem">Selecciona un concepto y luego su definición o fórmula.</p>
      <div class="emparejar">
        <div class="columna-emparejar"><div class="columna-titulo">Concepto</div>${izq}</div>
        <div class="columna-emparejar"><div class="columna-titulo">Definición o fórmula</div>${der}</div>
      </div>
      <div class="emparejar-estado">
        <span>Parejas: <strong>${e.emparejadas.size}/${total}</strong></span>
        <span>Intentos fallidos: <strong>${e.errores}</strong></span>
        <span>Tiempo: <strong id="parearTiempo">${e.segundos} s</strong></span>
      </div>`;
    actualizarPuntaje();

    manejarClick = (ev) => {
      const ficha = ev.target.closest('[data-parear-lado]');
      if (!ficha || e.terminado || e.error.length) return;
      const lado = ficha.dataset.parearLado;
      const id = Number(ficha.dataset.parearId);
      if (lado === 'i') e.seleccionIzq = id; else e.seleccionDer = id;

      if (e.seleccionIzq !== null && e.seleccionDer !== null) {
        if (e.seleccionIzq === e.seleccionDer) {
          e.emparejadas.add(e.seleccionIzq);
          e.seleccionIzq = null;
          e.seleccionDer = null;
          renderParear();
          if (e.emparejadas.size === total) {
            e.terminado = true;
            limpiarIntervalo();
            const precision = Math.max(40, Math.round(100 * total / (total + e.errores)));
            registrar('parear', precision);
            mostrarResultado('¡Todas las parejas encontradas!', `${precision} %`,
              `Completaste las ${total} parejas en ${e.segundos} segundos con ${e.errores} intentos fallidos.`, 'parear');
          }
        } else {
          e.errores++;
          e.error = ['i' + e.seleccionIzq, 'd' + e.seleccionDer];
          renderParear();
          setTimeout(() => {
            if (!estado || estado.terminado) return;
            estado.error = [];
            estado.seleccionIzq = null;
            estado.seleccionDer = null;
            renderParear();
          }, 550);
        }
      } else {
        renderParear();
      }
    };
  }

  /* ---------------- Completar la función ---------------- */
  function iniciarCompletar() {
    estado = { lista: mezclar(D.completar).slice(0, 5), idx: 0, aciertos: 0, respondida: false };
    renderCompletar();
  }

  function renderCompletar() {
    const e = estado;
    const ronda = e.lista[e.idx];
    $('juegoCuerpo').innerHTML = `
      ${barra(e.idx + 1, e.lista.length)}
      <div class="completar-pregunta">
        <p>${ronda.enunciado}</p>
        <div class="completar-campos">
          <span>f(x) =</span>
          <input type="text" inputmode="decimal" id="cmpA" aria-label="coeficiente a" placeholder="a" ${e.respondida ? 'disabled' : ''}>
          <span>x² +</span>
          <input type="text" inputmode="decimal" id="cmpB" aria-label="coeficiente b" placeholder="b" ${e.respondida ? 'disabled' : ''}>
          <span>x +</span>
          <input type="text" inputmode="decimal" id="cmpC" aria-label="coeficiente c" placeholder="c" ${e.respondida ? 'disabled' : ''}>
        </div>
        <p style="font-size:.75rem;color:var(--muted)">Escribe los números (puedes usar negativos y decimales con coma o punto).</p>
      </div>
      <div id="feedbackCompletar"></div>
      <div class="acciones-juego">
        <button type="button" class="btn btn-secundario" data-pista><svg class="icono"><use href="#i-bombilla"/></svg>Pista</button>
        <button type="button" class="btn btn-primario" data-comprobar ${e.respondida ? 'disabled' : ''}>Comprobar</button>
        ${e.respondida ? '<button type="button" class="btn btn-primario" data-siguiente-completar>Siguiente <svg class="icono"><use href="#i-flecha"/></svg></button>' : ''}
      </div>`;
    actualizarPuntaje();

    manejarClick = (ev) => {
      if (ev.target.closest('[data-pista]')) {
        $('feedbackCompletar').innerHTML = `<div class="feedback info"><svg class="icono"><use href="#i-bombilla"/></svg><div><strong>Pista</strong>${ronda.pista}</div></div>`;
        return;
      }
      if (ev.target.closest('[data-comprobar]') && !e.respondida) {
        const valores = ['cmpA', 'cmpB', 'cmpC'].map((id) => {
          const input = $(id);
          const texto = (input.value || '').trim().replace(',', '.');
          const num = parseFloat(texto);
          return { input, num: isFinite(num) ? num : NaN };
        });
        e.respondida = true;
        const aciertosCampos = valores.map((v, i) => {
          const ok = isFinite(v.num) && Math.abs(v.num - ronda.valores[i]) < 1e-9;
          v.input.classList.add(ok ? 'correcto' : 'incorrecto');
          v.input.disabled = true;
          return ok;
        });
        const todos = aciertosCampos.every(Boolean);
        if (todos) e.aciertos++;
        $('feedbackCompletar').innerHTML = feedback(todos, todos ? '¡Función completada!' : 'Revisa los coeficientes',
          `${ronda.explicacion}<br><strong>Respuesta correcta:</strong> a = ${ronda.valores[0]}, b = ${ronda.valores[1]}, c = ${ronda.valores[2]}.`);
        const acciones = $('juegoCuerpo').querySelector('.acciones-juego');
        acciones.innerHTML = `<button type="button" class="btn btn-secundario" data-pista disabled>Pista usada</button>
          <button type="button" class="btn btn-primario" data-siguiente-completar>Siguiente <svg class="icono"><use href="#i-flecha"/></svg></button>`;
        actualizarPuntaje();
        return;
      }
      if (ev.target.closest('[data-siguiente-completar]')) {
        if (e.idx < e.lista.length - 1) {
          e.idx++;
          e.respondida = false;
          renderCompletar();
        } else {
          const pct = Math.round(e.aciertos / e.lista.length * 100);
          registrar('completar', pct);
          mostrarResultado('Retos completados', `${pct} %`,
            `Completaste correctamente ${e.aciertos} de ${e.lista.length} funciones. ${pct >= 80 ? '¡Muy buen trabajo!' : 'Repasa la forma vértice y la forma factorizada.'}`, 'completar');
        }
      }
    };
  }

  /* ---------------- Identificar el vértice ---------------- */
  function iniciarVertice() {
    estado = { lista: mezclar(D.vertices).slice(0, 8), idx: 0, aciertos: 0, respondida: false, opciones: [] };
    renderVertice();
  }

  function renderVertice() {
    const e = estado;
    const item = e.lista[e.idx];
    if (!e.opciones.length) e.opciones = mezclar([item.correcto, ...item.distractores]);
    const letras = ['A', 'B', 'C', 'D'];
    $('juegoCuerpo').innerHTML = `
      ${barra(e.idx + 1, e.lista.length)}
      <p style="font-size:.85rem;color:var(--muted);margin-bottom:.6rem">¿Cuál es el vértice de esta función?</p>
      <div class="vertices-funcion">f(x) = ${item.funcion}</div>
      <div class="opciones vertices">
        ${e.opciones.map((op, i) => `<button type="button" class="opcion vertice-opcion" data-vertice="${i}" ${e.respondida ? 'disabled' : ''}><span class="letra">${letras[i]}</span>${op}</button>`).join('')}
      </div>
      <div id="feedbackVertice"></div>
      <div class="acciones-juego">${e.respondida ? '<button type="button" class="btn btn-primario" data-siguiente-vertice>Siguiente <svg class="icono"><use href="#i-flecha"/></svg></button>' : ''}</div>`;
    actualizarPuntaje();

    manejarClick = (ev) => {
      const boton = ev.target.closest('[data-vertice]');
      if (boton && !e.respondida) {
        e.respondida = true;
        const elegido = e.opciones[Number(boton.dataset.vertice)];
        const acierto = elegido === item.correcto;
        if (acierto) e.aciertos++;
        document.querySelectorAll('[data-vertice]').forEach((b) => {
          b.disabled = true;
          if (e.opciones[Number(b.dataset.vertice)] === item.correcto) b.classList.add('correcta');
          else if (b === boton) b.classList.add('incorrecta');
        });
        $('feedbackVertice').innerHTML = feedback(acierto, acierto ? '¡Vértice correcto!' : 'Ese no es el vértice',
          `El vértice es <strong>${item.correcto}</strong>. Recuerda: h = −b/2a y k = f(h). Sustituye h en la función para obtener k.`);
        $('juegoCuerpo').querySelector('.acciones-juego').innerHTML = '<button type="button" class="btn btn-primario" data-siguiente-vertice>Siguiente <svg class="icono"><use href="#i-flecha"/></svg></button>';
        actualizarPuntaje();
        return;
      }
      if (ev.target.closest('[data-siguiente-vertice]')) {
        if (e.idx < e.lista.length - 1) {
          e.idx++;
          e.respondida = false;
          e.opciones = [];
          renderVertice();
        } else {
          const pct = Math.round(e.aciertos / e.lista.length * 100);
          registrar('vertice', pct);
          mostrarResultado('Ronda terminada', `${pct} %`,
            `Identificaste correctamente ${e.aciertos} de ${e.lista.length} vértices. ${pct >= 80 ? '¡Excelente cálculo!' : 'Practica h = −b/2a antes de volver a jugar.'}`, 'vertice');
        }
      }
    };
  }

  /* ---------------- Reto contrarreloj ---------------- */
  function iniciarReto() {
    const lista = mezclar(D.reto).map((item) => {
      const orden = mezclar(item.opciones.map((_, i) => i));
      return Object.assign({}, item, {
        opciones: orden.map((i) => item.opciones[i]),
        correcta: orden.indexOf(item.correcta)
      });
    });
    estado = {
      lista, idx: 0, puntos: 0, aciertos: 0, fallos: 0,
      racha: 0, mejorRacha: 0, respondida: false, tiempo: 60, terminado: false
    };
    limpiarIntervalo();
    renderReto();
    intervalo = setInterval(() => {
      if (!estado || estado.terminado) return;
      estado.tiempo--;
      const reloj = $('retoReloj');
      const barraT = $('retoBarra');
      if (reloj) {
        reloj.innerHTML = `<svg class="icono"><use href="#i-reloj"/></svg>${estado.tiempo} s`;
        reloj.classList.toggle('urgente', estado.tiempo <= 10);
      }
      if (barraT) barraT.style.width = `${Math.max(0, estado.tiempo / 60 * 100)}%`;
      if (estado.tiempo <= 0) terminarReto();
    }, 1000);
  }

  function renderReto() {
    const e = estado;
    const item = e.lista[e.idx % e.lista.length];
    $('juegoCuerpo').innerHTML = `
      <div class="reto-cabecera">
        <span class="reto-reloj" id="retoReloj"><svg class="icono"><use href="#i-reloj"/></svg>${e.tiempo} s</span>
        <div class="reto-puntaje"><span>Puntos: <strong id="retoPuntos">${e.puntos}</strong></span><span>Racha: <strong id="retoRacha">${e.racha}</strong></span><span>Aciertos: <strong id="retoAciertos">${e.aciertos}</strong></span></div>
      </div>
      <div class="temporizador"><div class="temporizador-barra" id="retoBarra" style="width:${e.tiempo / 60 * 100}%"></div></div>
      <div class="pregunta-juego">${item.pregunta}</div>
      <div class="opciones">
        ${item.opciones.map((op, i) => `<button type="button" class="opcion" data-reto="${i}"><span class="letra">${'ABCD'[i]}</span>${op}</button>`).join('')}
      </div>
      <div id="feedbackReto"></div>`;
    actualizarPuntaje();

    manejarClick = (ev) => {
      const boton = ev.target.closest('[data-reto]');
      if (!boton || e.respondida || e.terminado) return;
      e.respondida = true;
      const elegido = Number(boton.dataset.reto);
      const acierto = elegido === item.correcta;
      document.querySelectorAll('[data-reto]').forEach((b) => {
        b.disabled = true;
        if (Number(b.dataset.reto) === item.correcta) b.classList.add('correcta');
        else if (b === boton) b.classList.add('incorrecta');
      });
      if (acierto) {
        e.aciertos++;
        e.racha++;
        e.mejorRacha = Math.max(e.mejorRacha, e.racha);
        let ganancia = 10;
        if (e.racha % 3 === 0) ganancia += 5;
        e.puntos += ganancia;
        $('feedbackReto').innerHTML = `<div class="feedback ok"><svg class="icono"><use href="#i-check-circulo"/></svg><div><strong>+${ganancia} puntos</strong>${e.racha % 3 === 0 ? '¡Bono de racha de 3 aciertos!' : '¡Sigue así!'}</div></div>`;
      } else {
        e.fallos++;
        e.racha = 0;
        $('feedbackReto').innerHTML = `<div class="feedback mal"><svg class="icono"><use href="#i-x-circulo"/></svg><div><strong>Incorrecto</strong>La respuesta correcta era <strong>${'ABCD'[item.correcta]}</strong>.</div></div>`;
      }
      const puntosEl = $('retoPuntos');
      const rachaEl = $('retoRacha');
      const aciertosEl = $('retoAciertos');
      if (puntosEl) puntosEl.textContent = e.puntos;
      if (rachaEl) rachaEl.textContent = e.racha;
      if (aciertosEl) aciertosEl.textContent = e.aciertos;
      actualizarPuntaje();
      setTimeout(() => {
        if (!estado || estado.terminado) return;
        estado.idx++;
        estado.respondida = false;
        renderReto();
      }, 550);
    };
  }

  function terminarReto() {
    if (!estado || estado.terminado) return;
    estado.terminado = true;
    limpiarIntervalo();
    registrar('reto', estado.puntos);
    const total = estado.aciertos + estado.fallos;
    const precision = total ? Math.round(estado.aciertos / total * 100) : 0;
    mostrarResultado('¡Tiempo cumplido!', `${estado.puntos} pts`,
      `Respondiste ${total} preguntas: ${estado.aciertos} correctas y ${estado.fallos} incorrectas (${precision} % de precisión). Mejor racha: ${estado.mejorRacha}.`, 'reto');
  }


  /* ---------------- Sudoku cuadrático ---------------- */
  function iniciarSudoku() {
    estado = { solucion: [1,2,3,4,3,4,1,2,2,1,4,3,4,3,2,1], valores: [1,0,0,4,0,4,0,0,0,1,4,0,4,0,2,0], intentos: 0, terminado: false };
    renderSudoku();
  }
  function renderSudoku() {
    const e = estado;
    const celdas = e.valores.map((v, i) => `<button type="button" class="sudoku-celda ${v && [0,3,5,9,10,12,14].includes(i) ? 'fija' : ''}" data-sudoku="${i}" ${[0,3,5,9,10,12,14].includes(i) ? 'disabled' : ''}>${v || '·'}</button>`).join('');
    $('juegoCuerpo').innerHTML = `<div class="juego-intro-mini"><strong>Regla:</strong> cada fila y columna debe contener 1, 2, 3 y 4 una sola vez. Las casillas con fondo violeta son pistas.</div><div class="sudoku-tablero">${celdas}</div><div id="feedbackSudoku"></div><div class="acciones-juego"><button type="button" class="btn btn-secundario" data-limpiar-sudoku>Limpiar casillas</button><button type="button" class="btn btn-primario" data-comprobar-sudoku>Comprobar tablero</button></div>`;
    actualizarPuntaje();
    manejarClick = (ev) => {
      const celda = ev.target.closest('[data-sudoku]');
      if (celda && !celda.disabled && !e.terminado) { const i = Number(celda.dataset.sudoku); e.valores[i] = (e.valores[i] + 1) % 5; renderSudoku(); return; }
      if (ev.target.closest('[data-limpiar-sudoku]')) { e.valores = e.valores.map((v, i) => [0,3,5,9,10,12,14].includes(i) ? v : 0); renderSudoku(); return; }
      if (ev.target.closest('[data-comprobar-sudoku]')) {
        e.intentos++;
        const completos = e.valores.every(Boolean);
        const correctos = completos && e.valores.every((v, i) => v === e.solucion[i]);
        $('feedbackSudoku').innerHTML = feedback(correctos, correctos ? '¡Sudoku resuelto!' : 'Aún hay casillas por revisar', correctos ? 'Completaste el tablero respetando filas y columnas. ¡Gran razonamiento lógico!' : 'Cada fila y columna debe tener los cuatro números sin repetir. Corrige las casillas marcadas y vuelve a comprobar.');
        if (correctos) { e.terminado = true; registrar('sudoku', Math.max(60, 100 - (e.intentos - 1) * 10)); setTimeout(() => mostrarResultado('Sudoku completado', '100 %', `Resuelto en ${e.intentos} comprobación(es). La lógica también se entrena con matemáticas.`, 'sudoku'), 350); }
      }
    };
  }

  /* ---------------- Crucigrama algebraico ---------------- */
  const CRUCIGRAMA = [
    ['1', 'Curva que representa una función cuadrática', 'PARABOLA'],
    ['2', 'Punto máximo o mínimo de la curva', 'VERTICE'],
    ['3', 'Valor de x cuando f(x) = 0', 'RAIZ'],
    ['4', 'b² − 4ac, informa cuántas raíces hay', 'DELTA'],
    ['5', 'Método que usa −b ± √Δ sobre 2a', 'FORMULA'],
    ['6', 'Ingreso menos costo', 'GANANCIA']
  ];
  function iniciarCrucigrama() { estado = { respuestas: {}, terminado: false }; renderCrucigrama(); }
  function renderCrucigrama() {
    const e = estado;
    const filas = CRUCIGRAMA.map(([n, pista, palabra]) => `<div class="crucigrama-fila"><div class="crucigrama-num">${n}</div><div class="crucigrama-pista"><strong>${pista}</strong><small>${palabra.length} letras</small></div><div class="crucigrama-casillas">${palabra.split('').map((_, i) => `<input maxlength="1" aria-label="${n}, letra ${i+1}" data-crucigrama="${n}-${i}" value="${e.respuestas[`${n}-${i}`] || ''}" ${e.terminado ? 'disabled' : ''}>`).join('')}</div></div>`).join('');
    $('juegoCuerpo').innerHTML = `<div class="juego-intro-mini"><strong>Mini crucigrama:</strong> lee la pista, escribe una letra en cada casilla y descubre el vocabulario esencial de las parábolas.</div><div class="crucigrama-tablero">${filas}</div><div id="feedbackCrucigrama"></div><div class="acciones-juego"><button type="button" class="btn btn-primario" data-comprobar-crucigrama>Comprobar palabras</button></div>`;
    $('juegoCuerpo').querySelectorAll('[data-crucigrama]').forEach((input) => input.addEventListener('input', () => { input.value = input.value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÑ]/g, '').slice(-1); e.respuestas[input.dataset.crucigrama] = input.value; }));
    actualizarPuntaje();
    manejarClick = (ev) => {
      if (!ev.target.closest('[data-comprobar-crucigrama]')) return;
      let correctas = 0;
      CRUCIGRAMA.forEach(([n, , palabra]) => { const escrito = palabra.split('').map((_, i) => (e.respuestas[`${n}-${i}`] || '')).join(''); if (escrito === palabra) correctas++; });
      const pct = Math.round(correctas / CRUCIGRAMA.length * 100);
      $('feedbackCrucigrama').innerHTML = feedback(pct === 100, pct === 100 ? '¡Crucigrama completado!' : `${correctas} de ${CRUCIGRAMA.length} palabras correctas`, pct === 100 ? 'Has conectado conceptos, fórmulas y aplicaciones.' : 'Revisa las letras marcadas en las pistas y completa las palabras restantes.');
      if (pct === 100) { e.terminado = true; registrar('crucigrama', pct); setTimeout(() => mostrarResultado('¡Palabras encontradas!', `${pct} %`, 'Tu vocabulario algebraico está creciendo.', 'crucigrama'), 350); }
    };
  }

  /* ---------------- Sopa de letras ---------------- */
  function crearSopa() {
    const n = 10; const letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'; const grid = Array.from({ length: n * n }, () => letras[Math.floor(Math.random() * letras.length)]); const palabras = [['RAIZ', 0, 0, 0, 3], ['VERTICE', 1, 9, 7, 9], ['PARABOLA', 4, 0, 4, 7], ['DELTA', 8, 2, 8, 6], ['FACTOR', 2, 1, 2, 6]]; const celdas = [];
    palabras.forEach(([word, r1, c1, r2, c2]) => { const dr = Math.sign(r2-r1), dc = Math.sign(c2-c1), set = []; for (let k=0;k<word.length;k++) { const r=r1+dr*k, c=c1+dc*k, idx=r*n+c; grid[idx]=word[k]; set.push(idx); } celdas.push(set); });
    return { n, grid, palabras: palabras.map((p,i)=>({ nombre:p[0], celdas:celdas[i] })) };
  }
  function iniciarSopa() { estado = Object.assign(crearSopa(), { seleccion: new Set(), terminado: false }); renderSopa(); }
  function renderSopa() {
    const e = estado; const celdas = e.grid.map((l, i) => `<button type="button" class="sopa-celda ${e.seleccion.has(i) ? 'seleccionada' : ''}" data-sopa="${i}">${l}</button>`).join(''); const lista = e.palabras.map((p)=>`<span class="palabra-sopa ${p.celdas.every(i=>e.seleccion.has(i)) ? 'encontrada' : ''}">${p.nombre}</span>`).join('');
    $('juegoCuerpo').innerHTML = `<div class="juego-intro-mini"><strong>Cómo jugar:</strong> toca las letras de una palabra en cualquier orden. Cuando creas que la encontraste, pulsa comprobar.</div><div class="sopa-layout"><div class="sopa-tablero">${celdas}</div><div class="sopa-lista"><h4>Palabras ocultas</h4>${lista}</div></div><div id="feedbackSopa"></div><div class="acciones-juego"><button type="button" class="btn btn-secundario" data-limpiar-sopa>Limpiar selección</button><button type="button" class="btn btn-primario" data-comprobar-sopa>Comprobar búsqueda</button></div>`;
    actualizarPuntaje();
    manejarClick = (ev) => { const cell=ev.target.closest('[data-sopa]'); if(cell && !e.terminado){ const i=Number(cell.dataset.sopa); e.seleccion.has(i)?e.seleccion.delete(i):e.seleccion.add(i); renderSopa(); return; } if(ev.target.closest('[data-limpiar-sopa]')){e.seleccion.clear();renderSopa();return;} if(ev.target.closest('[data-comprobar-sopa]')){const halladas=e.palabras.filter(p=>p.celdas.every(i=>e.seleccion.has(i))).length; const pct=Math.round(halladas/e.palabras.length*100); $('feedbackSopa').innerHTML=feedback(pct===100,pct===100?'¡Sopa resuelta!':`Encontraste ${halladas} de ${e.palabras.length}`,pct===100?'Las palabras clave quedaron conectadas en la cuadrícula.':'Busca las letras de las palabras que todavía aparecen sin marcar.'); if(pct===100){e.terminado=true;registrar('sopa',pct);setTimeout(()=>mostrarResultado('¡Sopa completada!',`${pct} %`,'Encontraste todo el vocabulario de funciones cuadráticas.','sopa'),350);}} };
  }

  /* ---------------- Ordena los pasos ---------------- */
  const PASOS = [
    'Identifica a, b y c en la ecuación ax² + bx + c = 0.',
    'Calcula el discriminante: Δ = b² − 4ac.',
    'Sustituye los valores en x = (−b ± √Δ) / 2a.',
    'Simplifica las dos soluciones y comprueba sustituyendo.'
  ];
  function iniciarOrdenar() { estado = { orden: mezclar(PASOS.map((texto,i)=>({id:i,text:texto}))), terminado:false }; renderOrdenar(); }
  function renderOrdenar() { const e=estado; const tarjetas=e.orden.map((paso,i)=>`<div class="orden-tarjeta"><span class="orden-num">${i+1}</span><span>${paso.text}</span><button type="button" class="orden-flecha" data-mover="${i}" data-dir="up" ${i===0?'disabled':''}>↑</button><button type="button" class="orden-flecha" data-mover="${i}" data-dir="down" ${i===e.orden.length-1?'disabled':''}>↓</button></div>`).join(''); $('juegoCuerpo').innerHTML=`<div class="juego-intro-mini"><strong>Organiza el método:</strong> usa las flechas para poner en orden la solución de una ecuación cuadrática.</div><div class="orden-lista">${tarjetas}</div><div id="feedbackOrdenar"></div><div class="acciones-juego"><button type="button" class="btn btn-primario" data-comprobar-ordenar>Comprobar orden</button></div>`; actualizarPuntaje(); manejarClick=(ev)=>{const b=ev.target.closest('[data-mover]'); if(b){const i=Number(b.dataset.mover), j=b.dataset.dir==='up'?i-1:i+1; if(j>=0&&j<e.orden.length){[e.orden[i],e.orden[j]]=[e.orden[j],e.orden[i]];renderOrdenar();}return;} if(ev.target.closest('[data-comprobar-ordenar]')){const ok=e.orden.every((p,i)=>p.id===i); $('feedbackOrdenar').innerHTML=feedback(ok,ok?'¡Método en orden!':'Revisa la secuencia',ok?'Ahora puedes aplicar el procedimiento a cualquier ecuación cuadrática.':'Primero identifica los coeficientes, luego calcula Δ, sustituye y finalmente comprueba.'); if(ok){e.terminado=true;registrar('ordenar',100);setTimeout(()=>mostrarResultado('Procedimiento dominado','100 %','Ordenaste cada paso como lo haría un matemático.','ordenar'),350);}}}; }

  /* ---------------- Desafío relámpago ---------------- */
  function iniciarRelampago() { const lista=mezclar(D.reto).map((item)=>{const o=mezclar(item.opciones.map((_,i)=>i));return Object.assign({},item,{opciones:o.map(i=>item.opciones[i]),correcta:o.indexOf(item.correcta)});}); estado={lista,idx:0,puntos:0,aciertos:0,fallos:0,racha:0,tiempo:45,terminado:false,respondida:false}; limpiarIntervalo(); renderRelampago(); intervalo=setInterval(()=>{if(!estado||estado.terminado)return;estado.tiempo--;const r=$('relampagoReloj'),b=$('relampagoBarra');if(r)r.textContent=`${estado.tiempo} s`;if(b)b.style.width=`${Math.max(0,estado.tiempo/45*100)}%`;if(estado.tiempo<=0)terminarRelampago();},1000); }
  function renderRelampago(){const e=estado,item=e.lista[e.idx%e.lista.length];$('juegoCuerpo').innerHTML=`<div class="reto-cabecera relampago-cabecera"><span class="reto-reloj" id="relampagoReloj">${e.tiempo} s</span><div class="reto-puntaje"><span>Puntos: <strong>${e.puntos}</strong></span><span>Racha: <strong>${e.racha}</strong></span></div></div><div class="temporizador"><div class="temporizador-barra" id="relampagoBarra" style="width:${e.tiempo/45*100}%"></div></div><div class="pregunta-juego">${item.pregunta}</div><div class="opciones">${item.opciones.map((op,i)=>`<button type="button" class="opcion" data-relampago="${i}"><span class="letra">${'ABCD'[i]}</span>${op}</button>`).join('')}</div><div id="feedbackRelampago"></div>`;actualizarPuntaje();manejarClick=(ev)=>{const b=ev.target.closest('[data-relampago]');if(!b||e.respondida||e.terminado)return;e.respondida=true;const ok=Number(b.dataset.relampago)===item.correcta;if(ok){e.aciertos++;e.racha++;e.puntos+=10+(e.racha%3===0?5:0);}else{e.fallos++;e.racha=0;}document.querySelectorAll('[data-relampago]').forEach(x=>{x.disabled=true;if(Number(x.dataset.relampago)===item.correcta)x.classList.add('correcta');else if(x===b)x.classList.add('incorrecta');});$('feedbackRelampago').innerHTML=feedback(ok,ok?'¡Respuesta rápida!':'Casi',ok?'Sumaste puntos y mantienes la racha.':`La respuesta correcta era ${'ABCD'[item.correcta]}.`);setTimeout(()=>{if(!estado||estado.terminado)return;e.idx++;e.respondida=false;renderRelampago();},360);};}
  function terminarRelampago(){if(!estado||estado.terminado)return;estado.terminado=true;limpiarIntervalo();registrar('relampago',estado.puntos);const total=estado.aciertos+estado.fallos;mostrarResultado('¡Ráfaga terminada!',`${estado.puntos} pts`,`Respondiste ${total} preguntas y lograste una mejor racha de ${estado.racha}.`,'relampago');}
  /* ---------------- Navegación ---------------- */
  function abrir(id) {
    if (!meta[id]) return;
    juegoActual = id;
    limpiarIntervalo();
    estado = null;
    $('juegosLobby').classList.add('oculto');
    $('panelJuego').classList.remove('oculto');
    $('tituloJuego').textContent = meta[id].titulo;
    $('puntajeJuego').textContent = 'Puntaje: 0';
    if (id === 'vf') iniciarVF();
    else if (id === 'parear') iniciarParear();
    else if (id === 'completar') iniciarCompletar();
    else if (id === 'vertice') iniciarVertice();
    else if (id === 'reto') iniciarReto();
    else if (id === 'sudoku') iniciarSudoku();
    else if (id === 'crucigrama') iniciarCrucigrama();
    else if (id === 'sopa') iniciarSopa();
    else if (id === 'ordenar') iniciarOrdenar();
    else if (id === 'relampago') iniciarRelampago();
    $('panelJuego').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function salir() {
    limpiarIntervalo();
    juegoActual = null;
    estado = null;
    manejarClick = null;
    $('panelJuego').classList.add('oculto');
    $('juegosLobby').classList.remove('oculto');
    actualizarRecords();
  }

  function init() {
    document.querySelectorAll('[data-jugar]').forEach((boton) => {
      boton.addEventListener('click', () => abrir(boton.dataset.jugar));
    });
    const salirBtn = $('salirJuego');
    if (salirBtn) salirBtn.addEventListener('click', salir);
    const cuerpo = $('juegoCuerpo');
    if (cuerpo) {
      cuerpo.addEventListener('click', (e) => { if (manejarClick) manejarClick(e); });
      cuerpo.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && juegoActual === 'completar' && estado && !estado.respondida) {
          const btn = cuerpo.querySelector('[data-comprobar]');
          if (btn) { e.preventDefault(); btn.click(); }
        }
      });
    }
    actualizarRecords();
  }

  window.Juegos = { init, abrir, salir, actualizarRecords };
})();
