/* ============================================================
   Navegación, progreso guardado y retroalimentación
   ============================================================ */
(function () {
  'use strict';

  const CLAVE = 'fc_progreso_v2';
  const SECCIONES = ['inicio', 'explicaciones', 'ejemplos', 'grafica', 'juegos', 'quiz', 'evaluacion', 'retroalimentacion', 'recursos', 'ayuda', 'creditos'];
  const TITULOS = {
    inicio: 'Inicio', explicaciones: 'Explicaciones', ejemplos: 'Ejemplos resueltos', grafica: 'Gráfica interactiva',
    juegos: 'Juegos', quiz: 'Quiz de práctica', evaluacion: 'Evaluación final', retroalimentacion: 'Retroalimentación',
    recursos: 'Recursos', ayuda: 'Ayuda', creditos: 'Créditos'
  };
  const TOTAL_CONCEPTOS = 9;
  const TOTAL_EJEMPLOS = 6;
  const TOTAL_JUEGOS = 10;

  let almacenamientoDisponible = true;
  try {
    localStorage.setItem('__fc_prueba', '1');
    localStorage.removeItem('__fc_prueba');
  } catch (e) {
    almacenamientoDisponible = false;
  }

  function estadoInicial() {
    return {
      version: 2,
      secciones: [],
      conceptos: [],
      ejemplos: [],
      juegos: {},
      quiz: { mejor: 0, ultimo: null, intentos: 0 },
      evaluacion: { mejor: 0, ultimo: null, intentos: 0 },
      historial: [],
      estudiante: '',
      tema: 'claro'
    };
  }

  function cargar() {
    const base = estadoInicial();
    if (!almacenamientoDisponible) return base;
    try {
      const crudo = localStorage.getItem(CLAVE);
      if (!crudo) return base;
      const datos = JSON.parse(crudo);
      const resultado = Object.assign(base, datos);
      resultado.secciones = Array.isArray(datos.secciones) ? datos.secciones : [];
      resultado.conceptos = Array.isArray(datos.conceptos) ? datos.conceptos : [];
      resultado.ejemplos = Array.isArray(datos.ejemplos) ? datos.ejemplos : [];
      resultado.juegos = datos.juegos && typeof datos.juegos === 'object' ? datos.juegos : {};
      resultado.quiz = Object.assign({ mejor: 0, ultimo: null, intentos: 0 }, datos.quiz || {});
      resultado.evaluacion = Object.assign({ mejor: 0, ultimo: null, intentos: 0 }, datos.evaluacion || {});
      resultado.historial = Array.isArray(datos.historial) ? datos.historial : [];
      resultado.tema = datos.tema === 'oscuro' ? 'oscuro' : 'claro';
      return resultado;
    } catch (e) {
      return base;
    }
  }

  let progreso = cargar();
  let conceptoActivo = 'funcion';
  let temporizadorToast = null;

  function guardar() {
    if (!almacenamientoDisponible) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(progreso));
    } catch (e) {
      almacenamientoDisponible = false;
    }
  }

  function toast(mensaje) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.innerHTML = `<svg class="icono"><use href="#i-check-circulo"/></svg>${mensaje}`;
    el.classList.add('visible');
    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(() => el.classList.remove('visible'), 3400);
  }

  /* ---------------- Cálculo del progreso ---------------- */
  function juegosCompletados() {
    return Object.keys(progreso.juegos).filter((id) => progreso.juegos[id] && progreso.juegos[id].veces > 0).length;
  }

  function calcularProgreso() {
    const pConceptos = Math.min(progreso.conceptos.length, TOTAL_CONCEPTOS) / TOTAL_CONCEPTOS * 25;
    const pEjemplos = Math.min(progreso.ejemplos.length, TOTAL_EJEMPLOS) / TOTAL_EJEMPLOS * 15;
    const pJuegos = Math.min(juegosCompletados(), TOTAL_JUEGOS) / TOTAL_JUEGOS * 20;
    const pQuiz = (progreso.quiz.mejor || 0) * 0.2;
    const pEval = (progreso.evaluacion.mejor || 0) * 0.2;
    return Math.round(Math.min(100, pConceptos + pEjemplos + pJuegos + pQuiz + pEval));
  }

  function actualizarProgreso() {
    const pct = calcularProgreso();
    const texto = document.getElementById('textoProgreso');
    const barra = document.getElementById('barraProgreso');
    const anillo = document.getElementById('anilloCabecera');
    if (texto) texto.textContent = pct + '%';
    if (barra) barra.style.width = pct + '%';
    if (anillo) anillo.setAttribute('stroke-dasharray', `${(pct / 100 * 94.25).toFixed(2)} 94.25`);

    actualizarPanelRetro(pct);
  }

  function actualizarPanelRetro(pct) {
    const porcentaje = document.getElementById('porcentajeProgreso');
    if (!porcentaje) return;
    const circunferencia = 326.73;
    porcentaje.textContent = pct + '%';
    const circulo = document.getElementById('circuloProgreso');
    if (circulo) circulo.setAttribute('stroke-dasharray', `${(pct / 100 * circunferencia).toFixed(1)} ${circunferencia}`);

    const resumen = document.getElementById('textoResumenProgreso');
    const detalle = document.getElementById('detalleResumenProgreso');
    if (resumen && detalle) {
      if (pct === 0) {
        resumen.textContent = '¡Tu aventura apenas comienza!';
        detalle.textContent = 'Explora los conceptos, juega y completa las evaluaciones. Tu avance se guarda automáticamente en este dispositivo.';
      } else if (pct < 40) {
        resumen.textContent = 'Ya diste los primeros pasos';
        detalle.textContent = 'Sigue con las explicaciones y la gráfica interactiva; luego refuerza con los juegos. Cada actividad suma a tu progreso.';
      } else if (pct < 80) {
        resumen.textContent = 'Vas por muy buen camino';
        detalle.textContent = 'Ya conoces varias herramientas. Completa los juegos que faltan y presenta el quiz y la evaluación final.';
      } else if (pct < 100) {
        resumen.textContent = '¡Estás muy cerca de completarlo!';
        detalle.textContent = 'Revisa los temas con menor porcentaje y repite las actividades para consolidar tu aprendizaje.';
      } else {
        resumen.textContent = '¡Completaste todo el recorrido!';
        detalle.textContent = 'Recorriste los conceptos, los ejemplos, los juegos y las evaluaciones. Repasa lo que quieras o ayuda a un compañero a aprender.';
      }
    }

    const metricas = document.getElementById('metricasProgreso');
    if (metricas) {
      metricas.innerHTML = `
        <div class="metrica"><strong>${progreso.conceptos.length}/${TOTAL_CONCEPTOS}</strong><span>conceptos</span></div>
        <div class="metrica"><strong>${progreso.ejemplos.length}/${TOTAL_EJEMPLOS}</strong><span>ejemplos</span></div>
        <div class="metrica"><strong>${juegosCompletados()}/${TOTAL_JUEGOS}</strong><span>juegos</span></div>`;
    }

    const stats = document.getElementById('estadisticasRetro');
    if (stats) {
      const totalActividades = progreso.historial.length;
      stats.innerHTML = `
        <div class="estadistica"><span class="icono-cuadro azul"><svg class="icono"><use href="#i-quiz"/></svg></span><strong>${progreso.quiz.mejor || 0}%</strong><span>Mejor quiz</span><small>${progreso.quiz.intentos || 0} intento(s)</small></div>
        <div class="estadistica"><span class="icono-cuadro rosa"><svg class="icono"><use href="#i-medalla"/></svg></span><strong>${progreso.evaluacion.mejor || 0}%</strong><span>Mejor evaluación</span><small>${progreso.evaluacion.intentos || 0} intento(s)</small></div>
        <div class="estadistica"><span class="icono-cuadro ambar"><svg class="icono"><use href="#i-dado"/></svg></span><strong>${juegosCompletados()}/${TOTAL_JUEGOS}</strong><span>Juegos completados</span><small>récords guardados</small></div>
        <div class="estadistica"><span class="icono-cuadro verde"><svg class="icono"><use href="#i-barras"/></svg></span><strong>${totalActividades}</strong><span>Actividades evaluadas</span><small>en tu historial</small></div>`;
    }

    actualizarTemas();
    actualizarRecomendaciones();
    actualizarInsignias();
    actualizarHistorial();
  }

  function actualizarInsignias() {
    const cont = document.getElementById('insigniasRetro');
    if (!cont) return;
    const juegos = juegosCompletados();
    const logros = [
      { icono: 'i-bombilla', titulo: 'Primera idea', texto: 'Explora tu primer concepto', ok: progreso.conceptos.length >= 1 },
      { icono: 'i-grafica', titulo: 'Observador', texto: 'Visita la gráfica interactiva', ok: progreso.secciones.includes('grafica') },
      { icono: 'i-dado', titulo: 'Jugador curioso', texto: 'Completa 3 juegos', ok: juegos >= 3 },
      { icono: 'i-rayo', titulo: 'Racha de estudio', texto: 'Alcanza 80 % en el quiz', ok: (progreso.quiz.mejor || 0) >= 80 },
      { icono: 'i-medalla', titulo: 'Evaluador', texto: 'Aprueba la evaluación final', ok: (progreso.evaluacion.mejor || 0) >= 70 },
      { icono: 'i-trofeo', titulo: 'Maestro de la parábola', texto: 'Completa los 10 juegos', ok: juegos >= 10 }
    ];
    cont.innerHTML = logros.map((l) => `<div class="insignia-card ${l.ok ? 'desbloqueada' : ''}"><span class="insignia-icono"><svg class="icono"><use href="#${l.icono}"/></svg></span><div><strong>${l.titulo}</strong><small>${l.texto}</small></div><span class="insignia-estado">${l.ok ? '✓' : '·'}</span></div>`).join('');
  }

  function agregarTemas() {
    const mapa = {};
    progreso.historial.forEach((intento) => {
      if (!intento.temas) return;
      Object.keys(intento.temas).forEach((tema) => {
        if (!mapa[tema]) mapa[tema] = { ok: 0, total: 0 };
        mapa[tema].ok += intento.temas[tema].ok || 0;
        mapa[tema].total += intento.temas[tema].total || 0;
      });
    });
    return mapa;
  }

  function actualizarTemas() {
    const cont = document.getElementById('barrasTemas');
    if (!cont) return;
    const mapa = agregarTemas();
    const temas = Object.keys(window.DATOS.temas).filter((t) => mapa[t] && mapa[t].total > 0);
    if (!temas.length) {
      cont.innerHTML = '<div class="sin-datos">Aún no hay resultados por tema. Completa el <a href="#quiz" data-seccion="quiz">quiz</a> o la <a href="#evaluacion" data-seccion="evaluacion">evaluación final</a> para ver este análisis.</div>';
      return;
    }
    cont.innerHTML = temas.map((tema) => {
      const pct = Math.round(mapa[tema].ok / mapa[tema].total * 100);
      const clase = pct >= 80 ? 'alta' : pct >= 60 ? 'media' : 'baja';
      return `<div class="barra-tema">
        <span class="nombre">${window.DATOS.temas[tema]}</span>
        <div class="barra-fondo"><span class="${clase}" style="width:${pct}%"></span></div>
        <span class="valor">${pct}%</span>
      </div>`;
    }).join('');
  }

  function actualizarRecomendaciones() {
    const cont = document.getElementById('recomendacionesRetro');
    if (!cont) return;
    const mapa = agregarTemas();
    const filas = Object.keys(mapa).map((tema) => ({
      tema, pct: Math.round(mapa[tema].ok / mapa[tema].total * 100), ok: mapa[tema].ok, total: mapa[tema].total
    })).filter((f) => f.total > 0).sort((a, b) => a.pct - b.pct);

    if (!filas.length) {
      cont.innerHTML = `<div class="recomendacion-item">
        <span class="icono-cuadro"><svg class="icono"><use href="#i-quiz"/></svg></span>
        <div><h4>Empieza con el quiz de práctica</h4><p>Al responder sabrás qué temas dominas y cuáles necesitas reforzar.</p><a class="enlace-flecha" href="#quiz" data-seccion="quiz">Ir al quiz <svg class="icono"><use href="#i-flecha"/></svg></a></div>
      </div>`;
      return;
    }

    const debiles = filas.filter((f) => f.pct < 70).slice(0, 3);
    const fuertes = filas.filter((f) => f.pct >= 80);
    let html = '';

    if (debiles.length) {
      debiles.forEach((f) => {
        const enlace = f.tema === 'aplicaciones'
          ? `<a class="enlace-flecha" href="#ejemplos" data-seccion="ejemplos">Ver ejemplos aplicados <svg class="icono"><use href="#i-flecha"/></svg></a>`
          : `<a class="enlace-flecha" href="#explicaciones" data-ir-concepto="${f.tema}">Repasar ${window.DATOS.temas[f.tema]} <svg class="icono"><use href="#i-flecha"/></svg></a>`;
        html += `<div class="recomendacion-item">
          <span class="icono-cuadro coral"><svg class="icono"><use href="#i-bombilla"/></svg></span>
          <div><h4>Refuerza: ${window.DATOS.temas[f.tema]}</h4><p>Acertaste ${f.ok} de ${f.total} preguntas (${f.pct} %). Lee la explicación, revisa un ejemplo y vuelve a practicar.</p>${enlace}</div>
        </div>`;
      });
    } else {
      html += `<div class="recomendacion-item">
        <span class="icono-cuadro verde"><svg class="icono"><use href="#i-trofeo"/></svg></span>
        <div><h4>¡Dominas todos los temas evaluados!</h4><p>Mantén el nivel resolviendo el reto contrarreloj o explicando un ejercicio a un compañero.</p><a class="enlace-flecha" href="#juegos" data-seccion="juegos">Aceptar el reto <svg class="icono"><use href="#i-flecha"/></svg></a></div>
      </div>`;
    }

    if (fuertes.length) {
      html += `<div class="recomendacion-item">
        <span class="icono-cuadro verde"><svg class="icono"><use href="#i-estrella"/></svg></span>
        <div><h4>Fortalezas: ${fuertes.slice(0, 3).map((f) => window.DATOS.temas[f.tema]).join(', ')}</h4><p>Sigue usando la gráfica interactiva para conectar las fórmulas con lo que ves.</p></div>
      </div>`;
    }
    cont.innerHTML = html;
  }

  function actualizarHistorial() {
    const cont = document.getElementById('historialRetro');
    if (!cont) return;
    if (!progreso.historial.length) {
      cont.innerHTML = '<div class="sin-datos">Todavía no has completado actividades evaluadas. Tus resultados aparecerán aquí en orden cronológico.</div>';
      return;
    }
    const filas = progreso.historial.slice(0, 10).map((a) => {
      const fecha = new Date(a.fecha);
      const fechaTexto = isNaN(fecha.getTime()) ? '—' : fecha.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) + ' · ' + fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
      const tipo = a.tipo === 'evaluacion' ? '<span class="etiqueta-tipo eval">Evaluación</span>' : '<span class="etiqueta-tipo">Quiz</span>';
      const clase = a.porcentaje >= 70 ? 'puntaje-bien' : 'puntaje-mal';
      return `<tr><td>${fechaTexto}</td><td>${tipo}</td><td>${a.puntaje}/${a.total}</td><td class="${clase}">${a.porcentaje}%</td></tr>`;
    }).join('');
    cont.innerHTML = `<div style="overflow-x:auto"><table class="tabla-historial">
      <thead><tr><th>Fecha</th><th>Actividad</th><th>Puntaje</th><th>Resultado</th></tr></thead>
      <tbody>${filas}</tbody></table></div>`;
  }

  /* ---------------- Registro de actividades ---------------- */
  function registrarIntento(tipo, datos) {
    if (tipo !== 'quiz' && tipo !== 'evaluacion') return;
    const registro = progreso[tipo] || { mejor: 0, intentos: 0, ultimo: null };
    registro.intentos = (registro.intentos || 0) + 1;
    registro.mejor = Math.max(registro.mejor || 0, datos.porcentaje);
    registro.ultimo = {
      puntaje: datos.puntaje,
      total: datos.total,
      porcentaje: datos.porcentaje,
      fecha: new Date().toISOString()
    };
    progreso[tipo] = registro;
    progreso.historial.unshift({
      tipo,
      fecha: new Date().toISOString(),
      puntaje: datos.puntaje,
      total: datos.total,
      porcentaje: datos.porcentaje,
      temas: datos.temas || {}
    });
    progreso.historial = progreso.historial.slice(0, 30);
    guardar();
    actualizarProgreso();
    toast(`Resultado guardado: ${datos.porcentaje} % (${datos.puntaje} de ${datos.total})`);
  }

  function registrarJuego(id, valor) {
    const registro = progreso.juegos[id] || { mejor: 0, veces: 0 };
    registro.veces = (registro.veces || 0) + 1;
    registro.mejor = Math.max(registro.mejor || 0, valor);
    registro.ultimo = valor;
    registro.fecha = new Date().toISOString();
    progreso.juegos[id] = registro;
    guardar();
    actualizarProgreso();
  }

  /* ---------------- Tema visual ---------------- */
  function aplicarTema(tema) {
    const oscuro = tema === 'oscuro';
    document.body.classList.toggle('tema-oscuro', oscuro);
    const boton = document.getElementById('btnTema');
    if (boton) {
      boton.innerHTML = `<svg class="icono"><use href="#${oscuro ? 'i-sol' : 'i-luna'}"/></svg>`;
      boton.title = oscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
      boton.setAttribute('aria-label', boton.title);
    }
    document.documentElement.style.colorScheme = oscuro ? 'dark' : 'light';
  }
  function alternarTema() {
    progreso.tema = progreso.tema === 'oscuro' ? 'claro' : 'oscuro';
    aplicarTema(progreso.tema);
    guardar();
    toast(progreso.tema === 'oscuro' ? 'Modo oscuro activado' : 'Modo claro activado');
  }

  /* ---------------- Navegación ---------------- */
  function cerrarMenu() {
    const nav = document.getElementById('navegacion');
    const btn = document.getElementById('btnMenu');
    if (nav) nav.classList.remove('abierto');
    if (btn) {
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Abrir menú');
    }
    const mas = document.getElementById('menuMas');
    if (mas) mas.classList.remove('abierto');
    const btnMas = document.getElementById('btnMenuMas');
    if (btnMas) btnMas.setAttribute('aria-expanded', 'false');
  }

  function mostrarSeccion(id, desplazar) {
    if (!SECCIONES.includes(id)) id = 'inicio';
    document.querySelectorAll('.seccion').forEach((s) => s.classList.toggle('activa', s.id === id));
    document.querySelectorAll('.enlace-nav[data-seccion]').forEach((a) => {
      const activo = a.dataset.seccion === id;
      a.classList.toggle('activo', activo);
      if (activo) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    cerrarMenu();
    if (desplazar !== false) window.scrollTo({ top: 0, behavior: 'auto' });
    try {
      history.replaceState(null, '', location.pathname + location.search);
    } catch (e) { /* archivo local sin historial */ }
    document.title = `${TITULOS[id]} · Funciones cuadráticas 10°`;

    if (!progreso.secciones.includes(id)) {
      progreso.secciones.push(id);
      guardar();
    }

    if (id === 'explicaciones') {
      if (!progreso.conceptos.length) marcarConcepto(conceptoActivo);
    } else if (id === 'grafica' && window.Grafica) {
      window.Grafica.activar();
    } else if (id === 'ejemplos' && window.Grafica) {
      setTimeout(() => window.Grafica.redibujarMinis(), 80);
    } else if (id === 'juegos' && window.Juegos) {
      window.Juegos.actualizarRecords();
    } else if (id === 'quiz' && window.Cuestionarios) {
      window.Cuestionarios.activar('quiz');
    } else if (id === 'evaluacion' && window.Cuestionarios) {
      window.Cuestionarios.activar('evaluacion');
    } else if (id === 'retroalimentacion') {
      actualizarProgreso();
    }
    actualizarProgreso();
  }

  /* ---------------- Conceptos ---------------- */
  function marcarConcepto(id) {
    conceptoActivo = id;
    if (!progreso.conceptos.includes(id)) {
      progreso.conceptos.push(id);
      guardar();
      actualizarProgreso();
    }
    document.querySelectorAll('.indice-conceptos button[data-concepto]').forEach((b) => {
      b.classList.toggle('visto', progreso.conceptos.includes(b.dataset.concepto));
    });
  }

  function abrirConcepto(id, sinDesplazar) {
    const panel = document.getElementById('concepto-' + id);
    if (!panel) return;
    if (!document.getElementById('explicaciones').classList.contains('activa')) {
      mostrarSeccion('explicaciones', false);
    }
    document.querySelectorAll('.panel-concepto').forEach((p) => p.classList.toggle('activo', p.id === 'concepto-' + id));
    document.querySelectorAll('.indice-conceptos button[data-concepto]').forEach((b) => {
      b.classList.toggle('activo', b.dataset.concepto === id);
    });
    marcarConcepto(id);
    if (!sinDesplazar) {
      const destino = document.querySelector('.conceptos');
      if (destino) {
        const y = destino.getBoundingClientRect().top + window.scrollY - 92;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }
  }

  /* ---------------- Reinicio ---------------- */
  function abrirModal() {
    const modal = document.getElementById('modalReiniciar');
    if (!modal) return;
    modal.classList.add('abierto');
    const confirmar = document.getElementById('btnConfirmarReinicio');
    if (confirmar) setTimeout(() => confirmar.focus(), 60);
  }

  function cerrarModal() {
    const modal = document.getElementById('modalReiniciar');
    if (modal) modal.classList.remove('abierto');
  }

  function reiniciarTodo() {
    if (almacenamientoDisponible) {
      try { localStorage.removeItem(CLAVE); } catch (e) { /* sin almacenamiento */ }
    }
    progreso = estadoInicial();
    conceptoActivo = 'funcion';
    document.querySelectorAll('.indice-conceptos button[data-concepto]').forEach((b) => b.classList.remove('visto'));
    document.querySelectorAll('.panel-concepto').forEach((p) => p.classList.toggle('activo', p.id === 'concepto-funcion'));
    document.querySelectorAll('.indice-conceptos button[data-concepto]').forEach((b) => b.classList.toggle('activo', b.dataset.concepto === 'funcion'));
    if (window.Cuestionarios) {
      window.Cuestionarios.reiniciar('quiz');
      window.Cuestionarios.reiniciar('evaluacion');
    }
    if (window.Juegos) {
      window.Juegos.salir();
      window.Juegos.actualizarRecords();
    }
    guardar();
    actualizarProgreso();
    cerrarModal();
    toast('Progreso reiniciado. ¡Puedes empezar de nuevo!');
  }

  /* ---------------- Eventos ---------------- */
  function init() {
    if (window.Grafica) window.Grafica.init();
    if (window.Juegos) window.Juegos.init();
    if (window.Cuestionarios) window.Cuestionarios.init();

    document.addEventListener('click', (e) => {
      const irConcepto = e.target.closest('[data-ir-concepto]');
      if (irConcepto) {
        e.preventDefault();
        abrirConcepto(irConcepto.dataset.irConcepto);
        return;
      }
      const enlace = e.target.closest('[data-seccion]');
      if (enlace) {
        e.preventDefault();
        mostrarSeccion(enlace.dataset.seccion);
      }
    });

    const btnMenu = document.getElementById('btnMenu');
    if (btnMenu) {
      btnMenu.addEventListener('click', () => {
        const nav = document.getElementById('navegacion');
        const abierto = nav.classList.toggle('abierto');
        btnMenu.setAttribute('aria-expanded', abierto ? 'true' : 'false');
        btnMenu.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
      });
    }

    const btnMenuMas = document.getElementById('btnMenuMas');
    if (btnMenuMas) {
      btnMenuMas.addEventListener('click', (e) => {
        e.stopPropagation();
        const contenedor = document.getElementById('menuMas');
        const abierto = contenedor.classList.toggle('abierto');
        btnMenuMas.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      });
    }

    document.addEventListener('click', (e) => {
      const mas = document.getElementById('menuMas');
      if (mas && mas.classList.contains('abierto') && !e.target.closest('#menuMas')) {
        mas.classList.remove('abierto');
        const b = document.getElementById('btnMenuMas');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });

    document.querySelectorAll('.indice-conceptos button[data-concepto]').forEach((boton) => {
      boton.addEventListener('click', () => abrirConcepto(boton.dataset.concepto));
    });
    document.querySelectorAll('[data-siguiente-concepto]').forEach((b) => {
      b.addEventListener('click', () => abrirConcepto(b.dataset.siguienteConcepto));
    });
    document.querySelectorAll('[data-anterior-concepto]').forEach((b) => {
      b.addEventListener('click', () => abrirConcepto(b.dataset.anteriorConcepto));
    });

    // Ejemplos vistos
    document.querySelectorAll('.detalle-solucion').forEach((detalle, i) => {
      detalle.addEventListener('toggle', () => {
        if (detalle.open) {
          const id = 'e' + (i + 1);
          if (!progreso.ejemplos.includes(id)) {
            progreso.ejemplos.push(id);
            guardar();
            actualizarProgreso();
          }
        }
      });
    });

    const btnTema = document.getElementById('btnTema');
    if (btnTema) btnTema.addEventListener('click', alternarTema);
    aplicarTema(progreso.tema || 'claro');

    const reiniciarCabecera = document.getElementById('btnReiniciarCabecera');
    const reiniciarPanel = document.getElementById('btnReiniciarPanel');
    if (reiniciarCabecera) reiniciarCabecera.addEventListener('click', abrirModal);
    if (reiniciarPanel) reiniciarPanel.addEventListener('click', abrirModal);

    const modal = document.getElementById('modalReiniciar');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
        if (e.target.closest('[data-cerrar-modal]')) cerrarModal();
      });
    }
    const confirmar = document.getElementById('btnConfirmarReinicio');
    if (confirmar) confirmar.addEventListener('click', reiniciarTodo);

    const imprimirFormulario = document.getElementById('btnImprimirFormulario');
    if (imprimirFormulario) {
      imprimirFormulario.addEventListener('click', () => {
        document.body.classList.add('imprimiendo-formulario');
        window.print();
      });
    }
    window.addEventListener('afterprint', () => {
      document.body.classList.remove('imprimiendo-formulario');
      document.body.classList.remove('imprimiendo-certificado');
    });

    function ajustarAlturaCabecera() {
      const barra = document.querySelector('.barra-fija');
      if (barra) document.documentElement.style.setProperty('--altura-cabecera', barra.offsetHeight + 'px');
    }
    ajustarAlturaCabecera();
    window.addEventListener('resize', ajustarAlturaCabecera);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        cerrarMenu();
        cerrarModal();
        return;
      }
      if (e.altKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const activa = document.querySelector('.seccion.activa');
        if (!activa) return;
        const indice = SECCIONES.indexOf(activa.id);
        const nuevo = e.key === 'ArrowRight' ? Math.min(SECCIONES.length - 1, indice + 1) : Math.max(0, indice - 1);
        e.preventDefault();
        mostrarSeccion(SECCIONES[nuevo]);
      }
    });

    actualizarProgreso();
    document.querySelectorAll('.indice-conceptos button[data-concepto]').forEach((b) => {
      b.classList.toggle('visto', progreso.conceptos.includes(b.dataset.concepto));
    });

    const inicial = location.hash.replace('#', '');
    mostrarSeccion(SECCIONES.includes(inicial) ? inicial : 'inicio', false);

    if (!almacenamientoDisponible) {
      setTimeout(() => toast('Tu navegador bloquea el almacenamiento: el progreso no se guardará.'), 900);
    }
  }

  window.FC = {
    get progreso() { return progreso; },
    guardar,
    toast,
    actualizarProgreso,
    registrarIntento,
    registrarJuego,
    mostrarSeccion,
    abrirConcepto,
    calcularProgreso
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
