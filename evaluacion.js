/* ============================================================
   Quiz de práctica y evaluación final
   ============================================================ */
(function () {
  'use strict';

  const D = window.DATOS;
  const $ = (id) => document.getElementById(id);

  const CONFIGS = {
    quiz: {
      id: 'quiz', contenedor: 'quizApp', datos: D.quiz, guardar: 'quiz',
      titulo: 'Quiz de práctica', icono: 'i-quiz', color: 'azul',
      descripcion: 'Dieciocho preguntas para repasar los conceptos esenciales. Cada respuesta se corrige al instante y te explica el porqué.',
      permiteNombre: false
    },
    evaluacion: {
      id: 'evaluacion', contenedor: 'evalApp', datos: D.evaluacion, guardar: 'evaluacion',
      titulo: 'Evaluación final', icono: 'i-medalla', color: 'rosa',
      descripcion: 'La prueba integradora del proyecto. Al terminar obtendrás tu puntaje, una recomendación personalizada y, si apruebas, tu certificado.',
      permiteNombre: true
    }
  };

  const estados = { quiz: null, evaluacion: null };
  const letras = ['A', 'B', 'C', 'D'];

  function mezclar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function prepararPregunta(item) {
    const orden = mezclar(item.opciones.map((_, i) => i));
    return Object.assign({}, item, {
      opciones: orden.map((i) => item.opciones[i]),
      correcta: orden.indexOf(item.correcta)
    });
  }

  const mapaConceptos = {
    concepto: 'funcion', parabola: 'parabola', vertice: 'vertice', eje: 'eje',
    raices: 'raices', discriminante: 'discriminante', formula: 'formula',
    factorizacion: 'factorizacion', completacion: 'completacion'
  };

  function escapar(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }

  function barra(actual, total) {
    const pct = total ? Math.round(actual / total * 100) : 0;
    return `<div class="quiz-cabecera">
      <span class="quiz-pasos">Pregunta ${actual} de ${total}</span>
      <span class="quiz-puntaje" id="puntajeQuiz">Aciertos: 0</span>
    </div>
    <div class="barra-avance"><span style="width:${pct}%"></span></div>`;
  }

  function intro(cfg) {
    const est = estados[cfg.id];
    const mejor = (window.FC && FC.progreso && FC.progreso[cfg.guardar]) ? FC.progreso[cfg.guardar].mejor : 0;
    const nombre = (window.FC && FC.progreso && FC.progreso.estudiante) || '';
    const niveles = { facil: 0, medio: 0, dificil: 0 };
    cfg.datos.forEach((p) => { niveles[p.nivel] = (niveles[p.nivel] || 0) + 1; });

    const campoNombre = cfg.permiteNombre
      ? `<div class="campo-nombre">
           <label for="nombreEval">Tu nombre (para el certificado, opcional)</label>
           <input type="text" id="nombreEval" maxlength="70" placeholder="Escribe tu nombre completo" value="${escapar(nombre)}">
         </div>`
      : '';

    const mejorTexto = mejor > 0 ? `Tu mejor resultado hasta ahora: <strong>${mejor} %</strong>.` : 'Aún no has completado este cuestionario.';

    $(cfg.contenedor).innerHTML = `<div class="tarjeta-cuestionario">
      <div class="quiz-intro">
        <span class="icono-cuadro ${cfg.color}"><svg class="icono"><use href="#${cfg.icono}"/></svg></span>
        <h3>${cfg.titulo}</h3>
        <p>${cfg.descripcion}</p>
        <div class="resumen-quiz">
          <div><strong>${cfg.datos.length}</strong><span>preguntas</span></div>
          <div><strong>${niveles.facil}</strong><span>fáciles</span></div>
          <div><strong>${niveles.medio}</strong><span>medias</span></div>
        </div>
        <p style="font-size:.8rem;color:var(--muted);margin-top:-.6rem">También incluye ${niveles.dificil} preguntas difíciles.</p>
        ${campoNombre}
        <div class="reglas">
          <strong>Antes de empezar:</strong>
          <ul>
            <li>Cada pregunta tiene una sola respuesta correcta (A, B, C o D).</li>
            <li>Al elegir verás de inmediato si acertaste y una explicación del procedimiento.</li>
            <li>Cada acierto vale 1 punto; no hay penalización por responder mal.</li>
            <li>Puedes repetirlo cuantas veces quieras: se guarda tu mejor resultado.</li>
            <li>${mejorTexto}</li>
          </ul>
        </div>
        <button type="button" class="btn btn-primario btn-grande" data-iniciar="${cfg.id}">Comenzar ${cfg.permiteNombre ? 'la evaluación' : 'el quiz'} <svg class="icono"><use href="#i-flecha"/></svg></button>
      </div>
    </div>`;
    est.fase = 'intro';
  }

  function iniciar(cfg) {
    let nombre = '';
    if (cfg.permiteNombre) {
      const campo = $('nombreEval');
      nombre = campo ? campo.value.trim().slice(0, 70) : '';
      if (window.FC) {
        FC.progreso.estudiante = nombre;
        FC.guardar();
      }
    }
    estados[cfg.id] = {
      fase: 'juego', idx: 0, respuestas: [], aciertos: 0,
      respondida: false, guardado: false, nombre,
      preguntas: cfg.datos.map(prepararPregunta)
    };
    renderPregunta(cfg);
  }

  function renderPregunta(cfg) {
    const est = estados[cfg.id];
    const item = est.preguntas[est.idx];
    const cont = $(cfg.contenedor);
    cont.innerHTML = `<div class="tarjeta-cuestionario">
      ${barra(est.idx + 1, est.preguntas.length)}
      <div class="pregunta-cabecera">
        <span class="nivel ${item.nivel}">${item.nivel === 'facil' ? 'Fácil' : item.nivel === 'medio' ? 'Medio' : 'Difícil'}</span>
        <span class="tema-chip">${D.temas[item.tema] || item.tema}</span>
      </div>
      <div class="enunciado">${item.pregunta}</div>
      <div class="opciones-cuestionario" role="group" aria-label="Opciones de respuesta">
        ${item.opciones.map((op, i) => `<button type="button" class="opcion-cuestionario" data-opcion="${i}">
          <span class="letra">${letras[i]}</span><span>${op}</span>
        </button>`).join('')}
      </div>
      <div id="feedbackQuiz" aria-live="polite"></div>
      <div class="acciones-juego" id="accionesQuiz"></div>
    </div>`;
    const puntaje = $('puntajeQuiz');
    if (puntaje) puntaje.textContent = `Aciertos: ${est.aciertos}`;
    const primera = cont.querySelector('[data-opcion]');
    if (primera) primera.focus({ preventScroll: true });
  }

  function responder(cfg, indice) {
    const est = estados[cfg.id];
    if (!est || est.fase !== 'juego' || est.respondida) return;
    const item = est.preguntas[est.idx];
    est.respondida = true;
    const acierto = indice === item.correcta;
    if (acierto) est.aciertos++;

    est.respuestas.push({
      id: item.id, tema: item.tema, nivel: item.nivel,
      pregunta: item.pregunta, opciones: item.opciones,
      correcta: item.correcta, elegida: indice, acierto,
      explicacion: item.explicacion
    });

    const cont = $(cfg.contenedor);
    cont.querySelectorAll('[data-opcion]').forEach((b) => {
      b.disabled = true;
      const i = Number(b.dataset.opcion);
      if (i === item.correcta) b.classList.add('correcta');
      else if (i === indice) b.classList.add('incorrecta');
    });

    const feedback = $('feedbackQuiz');
    if (feedback) {
      feedback.innerHTML = `<div class="feedback ${acierto ? 'ok' : 'mal'}">
        <svg class="icono"><use href="#${acierto ? 'i-check-circulo' : 'i-x-circulo'}"/></svg>
        <div><strong>${acierto ? '¡Respuesta correcta!' : 'Respuesta incorrecta'}</strong>
        ${acierto ? '' : `La respuesta correcta es <strong>${letras[item.correcta]}</strong>. `}${item.explicacion}</div>
      </div>`;
    }
    const puntaje = $('puntajeQuiz');
    if (puntaje) puntaje.textContent = `Aciertos: ${est.aciertos}`;
    const acciones = $('accionesQuiz');
    if (acciones) {
      const ultimo = est.idx === est.preguntas.length - 1;
      acciones.innerHTML = `<button type="button" class="btn btn-primario" data-siguiente="${cfg.id}">${ultimo ? 'Ver resultados' : 'Siguiente pregunta'} <svg class="icono"><use href="#i-flecha"/></svg></button>`;
    }
  }

  function siguiente(cfg) {
    const est = estados[cfg.id];
    if (!est || !est.respondida) return;
    if (est.idx < est.preguntas.length - 1) {
      est.idx++;
      est.respondida = false;
      renderPregunta(cfg);
    } else {
      mostrarResultados(cfg);
    }
  }

  function porTema(respuestas) {
    const mapa = {};
    respuestas.forEach((r) => {
      if (!mapa[r.tema]) mapa[r.tema] = { ok: 0, total: 0 };
      mapa[r.tema].total++;
      if (r.acierto) mapa[r.tema].ok++;
    });
    return mapa;
  }

  function recomendacionesHTML(respuestas) {
    const mapa = porTema(respuestas);
    const filas = Object.keys(mapa).map((tema) => ({
      tema,
      pct: Math.round(mapa[tema].ok / mapa[tema].total * 100),
      ok: mapa[tema].ok,
      total: mapa[tema].total
    })).sort((a, b) => a.pct - b.pct);

    const debiles = filas.filter((f) => f.pct < 70);
    const fuertes = filas.filter((f) => f.pct >= 80);

    let html = '';
    if (debiles.length) {
      html += '<p><strong>Prioriza estos temas:</strong> dedica entre 10 y 15 minutos a repasar cada uno, mira sus ejemplos y luego vuelve a practicar.</p><ul>';
      debiles.forEach((f) => {
        const enlace = mapaConceptos[f.tema]
          ? `<a href="#explicaciones" data-ir-concepto="${mapaConceptos[f.tema]}">${D.temas[f.tema]}</a>`
          : `<a href="#ejemplos" data-seccion="ejemplos">${D.temas[f.tema]}</a>`;
        html += `<li>${enlace} — acertaste ${f.ok} de ${f.total} (${f.pct} %).</li>`;
      });
      html += '</ul>';
    } else {
      html += '<p><strong>¡Dominas todos los temas de esta actividad!</strong> Ahora intenta explicar los procedimientos a un compañero o resolver un ejemplo nuevo sin mirar la solución.</p>';
    }
    if (fuertes.length) {
      html += `<p style="margin-top:.5rem"><strong>Fortalezas:</strong> ${fuertes.map((f) => D.temas[f.tema]).join(', ')}. Sigue practicando con el <a href="#grafica" data-seccion="grafica">laboratorio de gráficas</a> y el <a href="#juegos" data-seccion="juegos">reto contrarreloj</a>.</p>`;
    }
    return html;
  }

  function mostrarResultados(cfg) {
    const est = estados[cfg.id];
    est.fase = 'resultados';
    const total = est.preguntas.length;
    const pct = Math.round(est.aciertos / total * 100);
    const incorrectas = total - est.aciertos;
    const circunferencia = 2 * Math.PI * 68;
    const avance = (pct / 100 * circunferencia).toFixed(1);

    if (!est.guardado && window.FC) {
      FC.registrarIntento(cfg.guardar, {
        puntaje: est.aciertos, total, porcentaje: pct,
        temas: porTema(est.respuestas)
      });
      est.guardado = true;
    }

    const titulo = pct >= 90 ? '¡Excelente dominio del tema!' : pct >= 70 ? '¡Muy buen trabajo!' : pct >= 50 ? 'Vas por buen camino' : 'Necesitas repasar un poco más';
    const mensaje = pct >= 70
      ? 'Comprendes los conceptos fundamentales de las funciones cuadráticas.'
      : 'Revisa las explicaciones y los ejemplos antes de volver a intentarlo; identificar el error es el primer paso para mejorar.';

    const revision = est.respuestas.map((r, i) => `<details class="revision-item ${r.acierto ? 'correcta' : 'incorrecta'}">
      <summary><span class="marca">${r.acierto ? '✓' : '✗'}</span><span class="texto">${i + 1}. ${r.pregunta}</span></summary>
      <div class="detalle">
        <p><strong>Tu respuesta:</strong> ${letras[r.elegida]}. ${r.opciones[r.elegida]}</p>
        <p><strong>Respuesta correcta:</strong> ${letras[r.correcta]}. ${r.opciones[r.correcta]}</p>
        <p><strong>Explicación:</strong> ${r.explicacion}</p>
      </div>
    </details>`).join('');

    const fecha = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
    const nombreEstudiante = est.nombre ? escapar(est.nombre) : 'Estudiante de grado décimo';
    const certificado = cfg.permiteNombre && pct >= 70 ? `
      <div class="certificado" id="certificadoFinal">
        <div class="sello"><svg class="icono"><use href="#i-medalla"/></svg></div>
        <h4>Certificado de finalización</h4>
        <p>Se certifica que</p>
        <div class="nombre">${nombreEstudiante}</div>
        <p>completó la evaluación final de <strong>Funciones cuadráticas</strong> de la plataforma educativa del grado décimo, obteniendo un resultado de <strong>${pct} %</strong> (${est.aciertos} de ${total} respuestas correctas).</p>
        <p>Paipa, Boyacá · ${fecha}</p>
        <div class="firmas">
          <span>Milton Ney Pedroza Soler<br>Docente orientador</span>
          <span>I. E. Armando Solano<br>Paipa, Boyacá</span>
        </div>
      </div>
      <div style="text-align:center;margin-top:.8rem" class="no-imprimir">
        <button type="button" class="btn btn-secundario" data-imprimir-certificado><svg class="icono"><use href="#i-imprimir"/></svg>Imprimir certificado</button>
      </div>` : '';

    $(cfg.contenedor).innerHTML = `<div class="tarjeta-cuestionario">
      <div class="resultado-cuestionario">
        <div class="resultado-hero">
          <div class="anillo-resultado">
            <svg viewBox="0 0 160 160" aria-hidden="true">
              <circle class="fondo" cx="80" cy="80" r="68"/>
              <circle class="valor" cx="80" cy="80" r="68" stroke-dasharray="${avance} ${circunferencia.toFixed(1)}"/>
            </svg>
            <div class="centro"><strong>${pct}%</strong><span>de logro</span></div>
          </div>
          <h3>${titulo}</h3>
          <p>${mensaje}</p>
          <div class="estadisticas-resultado">
            <div><strong>${est.aciertos}/${total}</strong><span>puntaje total</span></div>
            <div class="ok"><strong>${est.aciertos}</strong><span>correctas</span></div>
            <div class="mal"><strong>${incorrectas}</strong><span>incorrectas</span></div>
          </div>
        </div>

        <div class="bloque-recomendacion">
          <h4><svg class="icono"><use href="#i-bombilla"/></svg>Recomendación de estudio</h4>
          ${recomendacionesHTML(est.respuestas)}
        </div>

        <h4 style="font-size:1rem;margin-bottom:.2rem">Revisión de respuestas</h4>
        <p style="font-size:.8rem;color:var(--muted)">Haz clic en cada pregunta para ver tu respuesta, la correcta y la explicación.</p>
        <div class="revision">${revision}</div>

        ${certificado}

        <div class="acciones-resultado no-imprimir">
          <button type="button" class="btn btn-primario" data-repetir="${cfg.id}"><svg class="icono"><use href="#i-reiniciar"/></svg>${cfg.permiteNombre ? 'Repetir evaluación' : 'Repetir quiz'}</button>
          <a href="#retroalimentacion" class="btn btn-secundario" data-seccion="retroalimentacion"><svg class="icono"><use href="#i-chat"/></svg>Ver mi progreso</a>
          ${cfg.id === 'quiz' ? '<a href="#evaluacion" class="btn btn-secundario" data-seccion="evaluacion"><svg class="icono"><use href="#i-medalla"/></svg>Ir a la evaluación final</a>' : '<a href="#explicaciones" class="btn btn-secundario" data-seccion="explicaciones"><svg class="icono"><use href="#i-libro"/></svg>Repasar conceptos</a>'}
        </div>
      </div>
    </div>`;
    const cont = $(cfg.contenedor);
    cont.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.FC && FC.actualizarProgreso) FC.actualizarProgreso();
  }

  function imprimirCertificado() {
    document.body.classList.add('imprimiendo-certificado');
    window.print();
  }

  function init() {
    Object.keys(CONFIGS).forEach((id) => {
      const cfg = CONFIGS[id];
      const cont = $(cfg.contenedor);
      if (!cont) return;
      estados[id] = { fase: 'intro' };
      cont.addEventListener('click', (e) => {
        if (e.target.closest('[data-iniciar]')) { iniciar(cfg); return; }
        if (e.target.closest('[data-repetir]')) { iniciar(cfg); return; }
        const opcion = e.target.closest('[data-opcion]');
        if (opcion) { responder(cfg, Number(opcion.dataset.opcion)); return; }
        if (e.target.closest('[data-siguiente]')) { siguiente(cfg); return; }
        if (e.target.closest('[data-imprimir-certificado]')) { imprimirCertificado(); }
      });
      cont.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.closest('[data-siguiente]')) {
          e.preventDefault();
          siguiente(cfg);
        }
      });
      intro(cfg);
    });
    window.addEventListener('afterprint', () => {
      document.body.classList.remove('imprimiendo-certificado');
    });
  }

  function activar(id) {
    const cfg = CONFIGS[id];
    if (!cfg) return;
    const est = estados[id];
    if (!est || est.fase === 'intro') intro(cfg);
  }

  function reiniciar(id) {
    const cfg = CONFIGS[id];
    if (!cfg) return;
    estados[id] = { fase: 'intro' };
    intro(cfg);
  }

  window.Cuestionarios = { init, activar, reiniciar };
})();
