/* ============================================================
   Gráfica interactiva de funciones cuadráticas
   ============================================================ */
(function () {
  'use strict';

  const estado = {
    a: 1, b: 0, c: 0,
    vista: null,
    mostrar: { vertice: true, eje: true, raices: true, corte: true, puntos: false },
    arrastrando: false,
    ultimo: { x: 0, y: 0 },
    inicializado: false
  };

  const fmtNum = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 });
  const fmtCompacto = new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 1 });

  function fmt(n) {
    if (!isFinite(n)) return '—';
    if (Math.abs(n) < 1e-10) n = 0;
    return fmtNum.format(n).replace(/-/g, '−');
  }

  function fmtEje(n) {
    if (!isFinite(n)) return '';
    if (Math.abs(n) < 1e-10) n = 0;
    if (Math.abs(n) >= 10000) return fmtCompacto.format(n).replace(/-/g, '−');
    return fmtNum.format(n).replace(/-/g, '−');
  }

  function limitar(v, min, max) { return Math.min(max, Math.max(min, v)); }

  function calcular(a, b, c) {
    const res = { a, b, c, delta: null, h: null, k: null, raices: [], tipoRaices: 'none' };
    if (a === 0) return res;
    res.delta = b * b - 4 * a * c;
    res.h = -b / (2 * a);
    res.k = a * res.h * res.h + b * res.h + c;
    if (res.delta > 1e-9) {
      const raiz = Math.sqrt(res.delta);
      res.raices = [(-b - raiz) / (2 * a), (-b + raiz) / (2 * a)].sort((p, q) => p - q);
      res.tipoRaices = 'dos';
    } else if (Math.abs(res.delta) <= 1e-9) {
      res.raices = [-b / (2 * a)];
      res.tipoRaices = 'una';
    }
    return res;
  }

  /* ---------------- Formato de la ecuación ---------------- */
  function termino(coef, variable, potencia, primero) {
    if (Math.abs(coef) < 1e-10) return '';
    const abs = Math.abs(coef);
    const signo = coef < 0 ? '−' : '+';
    let cuerpo;
    if (variable === '') {
      cuerpo = fmt(abs);
    } else {
      cuerpo = (Math.abs(abs - 1) < 1e-10 ? '' : fmt(abs)) + variable;
      if (potencia) cuerpo += '<sup>' + potencia + '</sup>';
    }
    if (primero) return (coef < 0 ? '−' : '') + cuerpo;
    return ' ' + signo + ' ' + cuerpo;
  }

  function ecuacionHTML(a, b, c) {
    if (Math.abs(a) < 1e-10) {
      let txt = termino(b, 'x', '', true) + termino(c, '', '', false);
      return 'f(x) = ' + (txt.trim() || '0');
    }
    return 'f(x) = ' + termino(a, 'x', '2', true) + termino(b, 'x', '', false) + termino(c, '', '', false);
  }

  function ecuacionTexto(a, b, c) {
    const el = document.createElement('div');
    el.innerHTML = ecuacionHTML(a, b, c);
    return el.textContent;
  }

  function formaVerticeHTML(a, h, k) {
    const coefA = Math.abs(Math.abs(a) - 1) < 1e-10 ? (a < 0 ? '−' : '') : fmt(a);
    const interior = h >= 0 ? `(x − ${fmt(h)})` : `(x + ${fmt(Math.abs(h))})`;
    const kTxt = Math.abs(k) < 1e-10 ? '' : (k > 0 ? ` + ${fmt(k)}` : ` − ${fmt(Math.abs(k))}`);
    return `f(x) = ${coefA}${interior}<sup>2</sup>${kTxt}`;
  }

  /* ---------------- Canvas y vista ---------------- */
  function prepararCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 20 || rect.height < 20) return null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, W: rect.width, H: rect.height };
  }

  function ajustarVista() {
    const canvas = document.getElementById('lienzoGrafica');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const W = rect.width || 900;
    const H = rect.height || 560;
    const { a, b, c } = estado;
    if (a === 0) {
      estado.vista = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
      return;
    }
    const h = -b / (2 * a);
    const k = a * h * h + b * h + c;
    const xSpan = limitar(24 / Math.sqrt(Math.abs(a)), 12, 60);
    const xMin = h - xSpan / 2;
    const xMax = h + xSpan / 2;

    let yMin = Infinity, yMax = -Infinity;
    for (let i = 0; i <= 160; i++) {
      const x = xMin + (xMax - xMin) * i / 160;
      const y = a * x * x + b * x + c;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    }
    if (k < yMin) yMin = k;
    if (k > yMax) yMax = k;

    const objetivo = xSpan * (H / W) * 1.7;
    let ySpan = Math.max(yMax - yMin, objetivo * 0.55);
    ySpan = Math.min(ySpan, objetivo);
    const centroY = k + (a > 0 ? ySpan * 0.22 : -ySpan * 0.22);
    estado.vista = {
      xMin, xMax,
      yMin: centroY - ySpan / 2,
      yMax: centroY + ySpan / 2
    };
  }

  function pasoBonito(valor) {
    if (!isFinite(valor) || valor <= 0) return 1;
    const exponente = Math.floor(Math.log10(valor));
    const base = Math.pow(10, exponente);
    const n = valor / base;
    let paso;
    if (n <= 1) paso = 1;
    else if (n <= 2) paso = 2;
    else if (n <= 5) paso = 5;
    else paso = 10;
    return paso * base;
  }

  function mundoAXPx(x, vista, W) { return (x - vista.xMin) / (vista.xMax - vista.xMin) * W; }
  function mundoAYPx(y, vista, H) { return (vista.yMax - y) / (vista.yMax - vista.yMin) * H; }

  function etiqueta(ctx, texto, x, y, fondo, color, centrada) {
    ctx.save();
    ctx.font = '600 11px Inter, Segoe UI, sans-serif';
    const ancho = ctx.measureText(texto).width;
    const pad = 5;
    const alto = 18;
    let x0 = centrada ? x - ancho / 2 - pad : x;
    let y0 = y - alto / 2;
    x0 = limitar(x0, 2, ctx.canvas.width); // se corrige luego por DPR
    const r = 5;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x0, y0, ancho + pad * 2, alto, r);
    else {
      ctx.moveTo(x0 + r, y0);
      ctx.arcTo(x0 + ancho + pad * 2, y0, x0 + ancho + pad * 2, y0 + alto, r);
      ctx.arcTo(x0 + ancho + pad * 2, y0 + alto, x0, y0 + alto, r);
      ctx.arcTo(x0, y0 + alto, x0, y0, r);
      ctx.arcTo(x0, y0, x0 + ancho + pad * 2, y0, r);
    }
    ctx.fillStyle = fondo;
    ctx.fill();
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(texto, x0 + pad, y0 + alto / 2 + .5);
    ctx.restore();
  }

  function dibujarEjes(ctx, W, H, vista, mini) {
    const colorGrid = mini ? '#eceef7' : '#e7e9f4';
    const colorTexto = '#7b829d';
    const colorEje = '#9aa1bb';
    const pasoX = pasoBonito((vista.xMax - vista.xMin) / (W / (mini ? 46 : 74)));
    const pasoY = pasoBonito((vista.yMax - vista.yMin) / (H / (mini ? 36 : 54)));

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = colorGrid;
    ctx.beginPath();
    const x0 = Math.ceil(vista.xMin / pasoX) * pasoX;
    for (let x = x0; x <= vista.xMax + 1e-9; x += pasoX) {
      const px = Math.round(mundoAXPx(x, vista, W)) + .5;
      ctx.moveTo(px, 0);
      ctx.lineTo(px, H);
    }
    const y0 = Math.ceil(vista.yMin / pasoY) * pasoY;
    for (let y = y0; y <= vista.yMax + 1e-9; y += pasoY) {
      const py = Math.round(mundoAYPx(y, vista, H)) + .5;
      ctx.moveTo(0, py);
      ctx.lineTo(W, py);
    }
    ctx.stroke();

    // Ejes principales
    const px0 = mundoAXPx(0, vista, W);
    const py0 = mundoAYPx(0, vista, H);
    ctx.strokeStyle = colorEje;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    if (py0 >= 0 && py0 <= H) { ctx.moveTo(0, py0); ctx.lineTo(W, py0); }
    if (px0 >= 0 && px0 <= W) { ctx.moveTo(px0, 0); ctx.lineTo(px0, H); }
    ctx.stroke();

    if (!mini) {
      ctx.fillStyle = colorTexto;
      ctx.font = '500 10px Inter, Segoe UI, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const etiquetaY = limitar(py0 + 4, 2, H - 16);
      for (let x = x0; x <= vista.xMax + 1e-9; x += pasoX) {
        if (Math.abs(x) < pasoX * 1e-6) continue;
        const px = mundoAXPx(x, vista, W);
        if (px < 14 || px > W - 14) continue;
        ctx.fillText(fmtEje(x), px, etiquetaY);
      }
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const etiquetaX = limitar(px0 - 5, 34, W - 4);
      for (let y = y0; y <= vista.yMax + 1e-9; y += pasoY) {
        if (Math.abs(y) < pasoY * 1e-6) continue;
        const py = mundoAYPx(y, vista, H);
        if (py < 10 || py > H - 10) continue;
        ctx.fillText(fmtEje(y), etiquetaX, py);
      }
      // Etiquetas de los ejes
      ctx.font = 'italic 600 12px Georgia, serif';
      ctx.fillStyle = '#6f7794';
      if (py0 >= 0 && py0 <= H - 14) {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText('x', W - 12, py0 - 5);
      }
      if (px0 >= 12 && px0 <= W) {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('y', px0 + 7, 6);
      }
    }
    ctx.restore();
  }

  function puntosParabola(a, b, c, vista, W) {
    const pts = [];
    const n = Math.max(80, Math.min(400, Math.round(W / 2)));
    for (let i = 0; i <= n; i++) {
      const x = vista.xMin + (vista.xMax - vista.xMin) * i / n;
      pts.push([x, a * x * x + b * x + c]);
    }
    return pts;
  }

  function dibujarParabola(ctx, a, b, c, vista, W, H) {
    const pts = puntosParabola(a, b, c, vista, W);
    const grad = ctx.createLinearGradient(0, H, W, 0);
    grad.addColorStop(0, '#6d4aff');
    grad.addColorStop(.55, '#9a5cf6');
    grad.addColorStop(1, '#ff5d9e');
    ctx.save();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3.2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    pts.forEach(([x, y], i) => {
      const px = mundoAXPx(x, vista, W);
      const py = mundoAYPx(y, vista, H);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.restore();
  }

  function dibujarElementos(ctx, datos, vista, W, H, mini) {
    const { a, b, c, h, k, raices, delta } = datos;
    if (a === 0) return;
    ctx.save();
    const vx = mundoAXPx(h, vista, W);
    const vy = mundoAYPx(k, vista, H);
    const raicesPx = raices.map((r) => ({ x: mundoAXPx(r, vista, W), y: mundoAYPx(0, vista, H), valor: r }));
    const cortePx = { x: mundoAXPx(0, vista, W), y: mundoAYPx(c, vista, H) };
    const cerca = (p, q, d) => Math.hypot(p.x - q.x, p.y - q.y) < d;

    // Eje de simetría
    if (estado.mostrar.eje) {
      const px = vx;
      if (px >= 0 && px <= W) {
        ctx.strokeStyle = 'rgba(245, 165, 36, .85)';
        ctx.lineWidth = 1.6;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, H);
        ctx.stroke();
        ctx.setLineDash([]);
        if (!mini) etiqueta(ctx, `x = ${fmt(h)}`, limitar(px + 6, 4, W - 90), 18, 'rgba(255, 246, 229, .95)', '#a56a00', false);
      }
    }

    // Raíces
    if (estado.mostrar.raices && raices.length) {
      raicesPx.forEach((r, indice) => {
        const px = r.x;
        const py = r.y;
        if (px < -20 || px > W + 20 || py < -20 || py > H + 20) return;
        ctx.beginPath();
        ctx.arc(px, py, mini ? 4.5 : 6, 0, Math.PI * 2);
        ctx.fillStyle = '#0fae9c';
        ctx.fill();
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        if (!mini) {
          const raizEnVertice = Math.abs(k) < 1e-9;
          if (!raizEnVertice) {
            const separadas = raicesPx.length < 2 || Math.abs(raicesPx[0].x - raicesPx[1].x) > 110;
            const dy = separadas ? 24 : (indice === 0 ? 24 : 44);
            const ty = py + dy > H - 12 ? py - 24 : py + dy;
            etiqueta(ctx, `x = ${fmt(r.valor)}`, px, ty, 'rgba(230, 250, 246, .96)', '#0a7a5c', true);
          }
        }
      });
    }

    // Corte con el eje y
    if (estado.mostrar.corte) {
      const px = cortePx.x;
      const py = cortePx.y;
      if (px >= 0 && px <= W && py >= 0 && py <= H) {
        ctx.beginPath();
        ctx.arc(px, py, mini ? 3.5 : 5, 0, Math.PI * 2);
        ctx.fillStyle = '#2f6bff';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        if (!mini) {
          const pegado = cerca(cortePx, { x: vx, y: vy }, 34) || raicesPx.some((r) => cerca(cortePx, r, 34));
          if (!pegado) etiqueta(ctx, `(0, ${fmt(c)})`, px + 8, py - 18, 'rgba(234, 240, 255, .96)', '#2f4fa8', false);
        }
      }
    }

    // Puntos de apoyo simétricos
    if (estado.mostrar.puntos) {
      [-2, -1, 1, 2].forEach((d) => {
        const x = h + d;
        const y = a * x * x + b * x + c;
        const px = mundoAXPx(x, vista, W);
        const py = mundoAYPx(y, vista, H);
        if (px < 0 || px > W || py < 0 || py > H) return;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(109, 74, 255, .65)';
        ctx.fill();
      });
    }

    // Vértice
    if (estado.mostrar.vertice) {
      const px = vx;
      const py = vy;
      if (px >= 0 && px <= W && py >= 0 && py <= H) {
        ctx.beginPath();
        ctx.arc(px, py, mini ? 4.5 : 7, 0, Math.PI * 2);
        ctx.fillStyle = '#ff6b6b';
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        if (!mini) {
          const texto = `V(${fmt(h)}, ${fmt(k)})`;
          const tx = limitar(px + 10, 4, W - 130);
          const abajo = py + 24 <= H - 14;
          const ty = abajo ? py + 24 : Math.max(14, py - 24);
          etiqueta(ctx, texto, tx, ty, 'rgba(255, 240, 240, .97)', '#b33131', false);
        }
      }
    }
    ctx.restore();
  }

  function dibujarPrincipal() {
    const canvas = document.getElementById('lienzoGrafica');
    if (!canvas) return;
    const prep = prepararCanvas(canvas);
    if (!prep) return;
    const { ctx, W, H } = prep;
    const { a, b, c } = estado;
    if (!estado.vista) ajustarVista();
    const vista = estado.vista;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fbfbff';
    ctx.fillRect(0, 0, W, H);
    dibujarEjes(ctx, W, H, vista, false);

    if (a === 0) {
      ctx.save();
      ctx.fillStyle = '#b33131';
      ctx.font = '600 14px Inter, Segoe UI, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('a = 0: la función es lineal, no hay parábola', W / 2, H / 2);
      ctx.restore();
      return;
    }

    const datos = calcular(a, b, c);
    dibujarParabola(ctx, a, b, c, vista, W, H);
    dibujarElementos(ctx, datos, vista, W, H, false);
  }

  /* ---------------- Panel de datos ---------------- */
  function actualizarPanel() {
    const { a, b, c } = estado;
    const datos = calcular(a, b, c);
    const $ = (id) => document.getElementById(id);
    if (!$('datoVertice')) return;

    $('ecuacionViva').innerHTML = ecuacionHTML(a, b, c);
    const aviso = $('avisoGrafica');
    if (aviso) aviso.classList.toggle('oculto', a !== 0);

    if (a === 0) {
      $('datoVertice').textContent = 'No aplica';
      $('datoEje').textContent = 'No aplica';
      $('datoDiscriminante').textContent = 'No aplica';
      $('datoRaices').textContent = 'No aplica';
      $('datoDireccion').textContent = 'Recta (a = 0)';
      $('datoCorteY').textContent = `(0, ${fmt(c)})`;
      $('datoFormaVertice').textContent = 'No aplica';
      $('datoDominio').textContent = 'ℝ';
      $('datoRango').textContent = 'ℝ';
      $('pasosGrafica').innerHTML = '<div class="aviso-grafica"><svg class="icono"><use href="#i-alerta"/></svg><span>Con a = 0 la expresión f(x) = bx + c es lineal. Elige un valor de a distinto de cero para analizar la parábola.</span></div>';
      $('tablaValores').innerHTML = '';
      $('resumenGrafica').textContent = 'La función es lineal porque a es cero.';
      return;
    }

    const { h, k, delta, raices } = datos;
    $('datoVertice').textContent = `(${fmt(h)}, ${fmt(k)})`;
    $('datoEje').textContent = `x = ${fmt(h)}`;
    $('datoDiscriminante').textContent = `Δ = ${fmt(delta)}`;
    $('datoDireccion').textContent = a > 0 ? 'Hacia arriba · mínimo' : 'Hacia abajo · máximo';
    $('datoCorteY').textContent = `(0, ${fmt(c)})`;
    $('datoFormaVertice').innerHTML = formaVerticeHTML(a, h, k);
    $('datoDominio').textContent = 'ℝ (todos los reales)';
    $('datoRango').textContent = a > 0 ? `[${fmt(k)}, +∞)` : `(−∞, ${fmt(k)}]`;

    if (delta > 1e-9) {
      $('datoRaices').textContent = `x₁ = ${fmt(raices[0])}; x₂ = ${fmt(raices[1])}`;
    } else if (Math.abs(delta) <= 1e-9) {
      $('datoRaices').textContent = `x = ${fmt(raices[0])} (doble)`;
    } else {
      $('datoRaices').textContent = 'No hay raíces reales';
    }

    // Pasos
    const pasoRaiz = Math.sqrt(Math.max(delta, 0));
    const raizHTML = delta > 1e-9
      ? `x = (−b ± √Δ) / 2a = (${fmt(-b)} ± √${fmt(delta)}) / (2·${fmt(a)}) = (${fmt(-b)} ± ${fmt(pasoRaiz)}) / ${fmt(2 * a)}<br>x₁ = ${fmt(raices[0])} &nbsp;·&nbsp; x₂ = ${fmt(raices[1])}`
      : (Math.abs(delta) <= 1e-9
        ? `x = −b / 2a = ${fmt(h)} (raíz doble)`
        : `Δ = ${fmt(delta)} &lt; 0: no hay raíces reales (la parábola no corta el eje x)`);

    $('pasosGrafica').innerHTML = [
      `<div class="calculo-linea"><span>Coeficientes</span><code>a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}</code></div>`,
      `<div class="calculo-linea"><span>Discriminante</span><code>Δ = b² − 4ac = (${fmt(b)})² − 4(${fmt(a)})(${fmt(c)}) = ${fmt(delta)}</code></div>`,
      `<div class="calculo-linea"><span>Vértice (h)</span><code>h = −b / 2a = −(${fmt(b)}) / (2·${fmt(a)}) = ${fmt(h)}</code></div>`,
      `<div class="calculo-linea"><span>Vértice (k)</span><code>k = f(${fmt(h)}) = ${fmt(a)}(${fmt(h)})² + ${fmt(b)}(${fmt(h)}) + ${fmt(c)} = ${fmt(k)}</code></div>`,
      `<div class="calculo-linea"><span>Raíces</span><code>${raizHTML}</code></div>`,
      `<div class="calculo-linea"><span>Forma vértice</span><code>${formaVerticeHTML(a, h, k)}</code></div>`,
      `<div class="calculo-linea"><span>Interpretación</span><code>${a > 0 ? 'a &gt; 0: abre hacia arriba; el vértice es el valor mínimo.' : 'a &lt; 0: abre hacia abajo; el vértice es el valor máximo.'}</code></div>`
    ].join('');

    // Tabla de valores
    const filas = [];
    for (let i = -3; i <= 3; i++) {
      const x = h + i;
      const y = a * x * x + b * x + c;
      filas.push(`<tr${i === 0 ? ' class="destacada"' : ''}><td>${fmt(x)}</td><td>${fmt(y)}</td></tr>`);
    }
    $('tablaValores').innerHTML = `<thead><tr><th>x</th><th>f(x)</th></tr></thead><tbody>${filas.join('')}</tbody>`;

    const raicesTexto = delta > 1e-9
      ? `y sus raíces son ${fmt(raices[0])} y ${fmt(raices[1])}`
      : (Math.abs(delta) <= 1e-9 ? `con una raíz doble en ${fmt(h)}` : 'sin raíces reales');
    $('resumenGrafica').textContent = `La función ${ecuacionTexto(a, b, c)} abre ${a > 0 ? 'hacia arriba' : 'hacia abajo'}, tiene vértice en (${fmt(h)}, ${fmt(k)}), eje de simetría x = ${fmt(h)} ${raicesTexto}, y discriminante ${fmt(delta)}.`;
  }

  /* ---------------- Mini-gráficas de ejemplos ---------------- */
  function dibujarMini(canvas) {
    const prep = prepararCanvas(canvas);
    if (!prep) return;
    const { ctx, W, H } = prep;
    const a = parseFloat(canvas.dataset.a);
    const b = parseFloat(canvas.dataset.b);
    const c = parseFloat(canvas.dataset.c);
    const xMin = parseFloat(canvas.dataset.xmin);
    const xMax = parseFloat(canvas.dataset.xmax);
    if ([a, b, c, xMin, xMax].some((v) => !isFinite(v))) return;

    const datos = calcular(a, b, c);
    let yMin = Infinity, yMax = -Infinity;
    for (let i = 0; i <= 120; i++) {
      const x = xMin + (xMax - xMin) * i / 120;
      const y = a * x * x + b * x + c;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    }
    if (datos.k !== null) { yMin = Math.min(yMin, datos.k); yMax = Math.max(yMax, datos.k); }
    yMin = Math.min(yMin, 0);
    yMax = Math.max(yMax, 0);
    const margen = Math.max((yMax - yMin) * 0.12, 0.6);
    const vista = { xMin, xMax, yMin: yMin - margen, yMax: yMax + margen };

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fbfbff';
    ctx.fillRect(0, 0, W, H);
    dibujarEjes(ctx, W, H, vista, true);
    dibujarParabola(ctx, a, b, c, vista, W, H);
    dibujarElementos(ctx, datos, vista, W, H, true);
  }

  function dibujarMinis() {
    document.querySelectorAll('canvas.mini-grafica').forEach(dibujarMini);
  }

  /* ---------------- Interacción ---------------- */
  function sincronizar(a, b, c, reajustar) {
    estado.a = a; estado.b = b; estado.c = c;
    const ar = document.getElementById('aRango'), an = document.getElementById('aNumero');
    const br = document.getElementById('bRango'), bn = document.getElementById('bNumero');
    const cr = document.getElementById('cRango'), cn = document.getElementById('cNumero');
    if (ar) ar.value = a; if (an) an.value = a;
    if (br) br.value = b; if (bn) bn.value = b;
    if (cr) cr.value = c; if (cn) cn.value = c;
    if (reajustar) ajustarVista();
    dibujarPrincipal();
    actualizarPanel();
  }

  function zoom(factor, punto) {
    const canvas = document.getElementById('lienzoGrafica');
    if (!canvas || !estado.vista) return;
    const rect = canvas.getBoundingClientRect();
    const vista = estado.vista;
    const px = punto ? punto.x : rect.width / 2;
    const py = punto ? punto.y : rect.height / 2;
    const wx = vista.xMin + (px / rect.width) * (vista.xMax - vista.xMin);
    const wy = vista.yMax - (py / rect.height) * (vista.yMax - vista.yMin);
    const spanX = (vista.xMax - vista.xMin) / factor;
    const spanY = (vista.yMax - vista.yMin) / factor;
    const fx = px / rect.width;
    const fy = py / rect.height;
    estado.vista = {
      xMin: wx - spanX * fx,
      xMax: wx + spanX * (1 - fx),
      yMin: wy - spanY * (1 - fy),
      yMax: wy + spanY * fy
    };
    dibujarPrincipal();
  }

  function init() {
    if (estado.inicializado) return;
    const canvas = document.getElementById('lienzoGrafica');
    if (!canvas) return;
    estado.inicializado = true;

    ['a', 'b', 'c'].forEach((clave) => {
      const rango = document.getElementById(clave + 'Rango');
      const numero = document.getElementById(clave + 'Numero');
      if (rango) {
        rango.addEventListener('input', () => {
          const v = parseFloat(rango.value) || 0;
          estado[clave] = v;
          if (numero) numero.value = v;
          dibujarPrincipal();
          actualizarPanel();
        });
      }
      if (numero) {
        numero.addEventListener('input', () => {
          let v = parseFloat(numero.value);
          if (!isFinite(v)) return;
          v = limitar(v, parseFloat(numero.min), parseFloat(numero.max));
          estado[clave] = v;
          if (rango) rango.value = v;
          dibujarPrincipal();
          actualizarPanel();
        });
        numero.addEventListener('blur', () => {
          let v = parseFloat(numero.value);
          if (!isFinite(v)) v = 0;
          v = limitar(v, parseFloat(numero.min), parseFloat(numero.max));
          numero.value = v;
          estado[clave] = v;
          if (rango) rango.value = v;
          dibujarPrincipal();
          actualizarPanel();
        });
      }
    });

    document.querySelectorAll('[data-preset]').forEach((boton) => {
      boton.addEventListener('click', () => {
        let a, b, c;
        if (boton.dataset.preset === 'aleatorio') {
          do {
            a = Math.round((Math.random() * 6 - 3) * 10) / 10;
          } while (Math.abs(a) < 0.3);
          b = Math.round((Math.random() * 12 - 6) * 10) / 10;
          c = Math.round((Math.random() * 16 - 8) * 10) / 10;
        } else {
          [a, b, c] = boton.dataset.preset.split(',').map(Number);
        }
        estado.vista = null;
        sincronizar(a, b, c, true);
      });
    });

    const toggles = {
      mostrarVertice: 'vertice',
      mostrarEje: 'eje',
      mostrarRaices: 'raices',
      mostrarCorte: 'corte',
      mostrarPuntos: 'puntos'
    };
    Object.keys(toggles).forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', () => {
          estado.mostrar[toggles[id]] = el.checked;
          dibujarPrincipal();
        });
      }
    });

    const zIn = document.getElementById('zoomIn');
    const zOut = document.getElementById('zoomOut');
    const zReset = document.getElementById('zoomReset');
    if (zIn) zIn.addEventListener('click', () => zoom(1.3));
    if (zOut) zOut.addEventListener('click', () => zoom(1 / 1.3));
    if (zReset) zReset.addEventListener('click', () => { ajustarVista(); dibujarPrincipal(); });

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const factor = Math.exp(-e.deltaY * 0.0016);
      zoom(limitar(factor, 0.6, 1.7), { x: e.clientX - rect.left, y: e.clientY - rect.top });
    }, { passive: false });

    canvas.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      estado.arrastrando = true;
      estado.ultimo = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
      canvas.classList.add('arrastrando');
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!estado.arrastrando || !estado.vista) return;
      const rect = canvas.getBoundingClientRect();
      const dx = e.clientX - estado.ultimo.x;
      const dy = e.clientY - estado.ultimo.y;
      estado.ultimo = { x: e.clientX, y: e.clientY };
      const vista = estado.vista;
      const spanX = vista.xMax - vista.xMin;
      const spanY = vista.yMax - vista.yMin;
      const despX = -dx * spanX / rect.width;
      const despY = dy * spanY / rect.height;
      estado.vista = {
        xMin: vista.xMin + despX, xMax: vista.xMax + despX,
        yMin: vista.yMin + despY, yMax: vista.yMax + despY
      };
      dibujarPrincipal();
    });
    const soltar = (e) => {
      estado.arrastrando = false;
      canvas.classList.remove('arrastrando');
      if (e.pointerId !== undefined && canvas.hasPointerCapture && canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
    };
    canvas.addEventListener('pointerup', soltar);
    canvas.addEventListener('pointercancel', soltar);
    canvas.addEventListener('pointerleave', () => {
      if (estado.arrastrando) {
        estado.arrastrando = false;
        canvas.classList.remove('arrastrando');
      }
    });

    document.querySelectorAll('.detalle-solucion').forEach((detalle) => {
      detalle.addEventListener('toggle', () => {
        if (detalle.open) setTimeout(dibujarMinis, 30);
      });
    });

    if ('ResizeObserver' in window) {
      const observador = new ResizeObserver(() => {
        dibujarPrincipal();
        dibujarMinis();
      });
      const caja = canvas.parentElement;
      if (caja) observador.observe(caja);
    }
    window.addEventListener('resize', () => {
      clearTimeout(init._temporizador);
      init._temporizador = setTimeout(() => { dibujarPrincipal(); dibujarMinis(); }, 150);
    });

    sincronizar(1, 0, 0, true);
  }

  window.Grafica = {
    init,
    activar() {
      dibujarPrincipal();
      setTimeout(dibujarMinis, 60);
    },
    redibujarMinis: dibujarMinis
  };
})();
