/* ============================================================
   Datos de la plataforma: preguntas, juegos y temas
   ============================================================ */
(function () {
  'use strict';

  const temas = {
    concepto: 'Función cuadrática',
    parabola: 'La parábola',
    vertice: 'Vértice',
    eje: 'Eje de simetría',
    raices: 'Raíces',
    discriminante: 'Discriminante',
    formula: 'Fórmula general',
    factorizacion: 'Factorización',
    completacion: 'Completación de cuadrados',
    aplicaciones: 'Aplicaciones'
  };

  /* ---------------- QUIZ DE PRÁCTICA (18 preguntas) ---------------- */
  const quiz = [
    {
      id: 'q1', nivel: 'facil', tema: 'concepto',
      pregunta: '¿Cuál de las siguientes expresiones corresponde a una función cuadrática?',
      opciones: [
        '<span class="formula">f(x) = 2x + 3</span>',
        '<span class="formula">f(x) = x<sup>2</sup> − 4x + 1</span>',
        '<span class="formula">f(x) = 1/x</span>',
        '<span class="formula">f(x) = x<sup>3</sup> + 2x</span>'
      ],
      correcta: 1,
      explicacion: 'Una función cuadrática tiene la forma <strong>ax² + bx + c</strong> con a ≠ 0. En <em>x² − 4x + 1</em> el término x² está presente y a = 1, así que es cuadrática. Las otras son lineal, racional y cúbica.'
    },
    {
      id: 'q2', nivel: 'facil', tema: 'concepto',
      pregunta: 'En <span class="formula">f(x) = 3x<sup>2</sup> − 2x + 5</span>, ¿cuáles son los valores de a, b y c?',
      opciones: ['a = 3, b = 2, c = 5', 'a = 3, b = −2, c = 5', 'a = −2, b = 3, c = 5', 'a = 3, b = 5, c = −2'],
      correcta: 1,
      explicacion: 'El coeficiente de x² es a = 3; el coeficiente de x es b = −2 (incluye su signo) y el término independiente es c = 5. Escribir b = 2 es un error frecuente porque se pierde el signo negativo.'
    },
    {
      id: 'q3', nivel: 'facil', tema: 'concepto',
      pregunta: '¿Qué condición debe cumplir el coeficiente <em>a</em> para que la función sea cuadrática?',
      opciones: ['a = 0', 'a ≠ 0', 'a &gt; 0', 'a &lt; 0'],
      correcta: 1,
      explicacion: 'Si a = 0 desaparece el término x² y la función se vuelve lineal. Por eso la única condición es <strong>a ≠ 0</strong>; a puede ser positivo o negativo.'
    },
    {
      id: 'q4', nivel: 'facil', tema: 'parabola',
      pregunta: 'Si <strong>a &lt; 0</strong>, ¿hacia dónde abre la parábola?',
      opciones: ['Hacia arriba', 'Hacia abajo', 'Hacia la derecha', 'No se puede determinar'],
      correcta: 1,
      explicacion: 'El signo de a determina la concavidad. Si <strong>a &lt; 0</strong> la parábola abre hacia abajo y su vértice es un punto máximo; si a &gt; 0 abre hacia arriba.'
    },
    {
      id: 'q5', nivel: 'facil', tema: 'vertice',
      pregunta: 'El vértice de la función <span class="formula">f(x) = x<sup>2</sup></span> es:',
      opciones: ['(1, 1)', '(0, 0)', '(−1, 1)', '(0, 1)'],
      correcta: 1,
      explicacion: 'Para f(x) = x² se tiene a = 1, b = 0 y c = 0. El eje es x = −b/2a = 0 y f(0) = 0, por lo tanto el vértice es <strong>(0, 0)</strong>.'
    },
    {
      id: 'q6', nivel: 'facil', tema: 'eje',
      pregunta: 'El eje de simetría de <span class="formula">f(x) = x<sup>2</sup> − 4x + 1</span> es:',
      opciones: ['x = −2', 'x = 2', 'x = 4', 'x = 1'],
      correcta: 1,
      explicacion: 'Usamos x = −b/2a con a = 1 y b = −4: <strong>x = −(−4)/(2·1) = 2</strong>. El eje es la recta vertical x = 2.'
    },

    {
      id: 'q7', nivel: 'medio', tema: 'vertice',
      pregunta: '¿Cuál es el vértice de <span class="formula">f(x) = x<sup>2</sup> − 6x + 5</span>?',
      opciones: ['(3, 4)', '(3, −4)', '(−3, −4)', '(6, 5)'],
      correcta: 1,
      explicacion: 'h = −b/2a = −(−6)/2 = 3. Luego k = f(3) = 9 − 18 + 5 = −4. El vértice es <strong>(3, −4)</strong> y, como a &gt; 0, es un mínimo.'
    },
    {
      id: 'q8', nivel: 'medio', tema: 'discriminante',
      pregunta: 'El discriminante de <span class="formula">x<sup>2</sup> − 4x + 4 = 0</span> es:',
      opciones: ['0', '8', '−8', '16'],
      correcta: 0,
      explicacion: 'Δ = b² − 4ac = (−4)² − 4(1)(4) = 16 − 16 = <strong>0</strong>. Por eso la ecuación tiene una raíz doble: x = 2.'
    },
    {
      id: 'q9', nivel: 'medio', tema: 'raices',
      pregunta: 'Las raíces de <span class="formula">x<sup>2</sup> − 5x + 6 = 0</span> son:',
      opciones: ['2 y 3', '−2 y −3', '1 y 6', '−1 y −6'],
      correcta: 0,
      explicacion: 'Buscamos dos números que sumen 5 y multipliquen 6: son 2 y 3. Entonces (x − 2)(x − 3) = 0, de donde <strong>x = 2 y x = 3</strong>.'
    },
    {
      id: 'q10', nivel: 'medio', tema: 'discriminante',
      pregunta: 'Si el discriminante de una ecuación cuadrática es <strong>Δ = −9</strong>, ¿cuántas raíces reales tiene?',
      opciones: ['Dos raíces distintas', 'Una raíz doble', 'Ninguna raíz real', 'Tres raíces'],
      correcta: 2,
      explicacion: 'Un discriminante negativo indica que no hay raíces reales, porque la raíz cuadrada de un número negativo no existe en los números reales. La parábola no corta el eje x.'
    },
    {
      id: 'q11', nivel: 'medio', tema: 'concepto',
      pregunta: 'La gráfica de <span class="formula">f(x) = 2x<sup>2</sup> − 3x + 7</span> corta el eje y en:',
      opciones: ['(0, 7)', '(7, 0)', '(0, 2)', '(0, −3)'],
      correcta: 0,
      explicacion: 'El corte con el eje y se obtiene evaluando x = 0: f(0) = 2(0)² − 3(0) + 7 = 7. El punto es <strong>(0, 7)</strong>, que corresponde al término c.'
    },
    {
      id: 'q12', nivel: 'medio', tema: 'factorizacion',
      pregunta: '¿Cuál es la factorización de <span class="formula">x<sup>2</sup> + 5x + 6</span>?',
      opciones: ['(x + 1)(x + 6)', '(x + 2)(x + 3)', '(x − 2)(x − 3)', '(x + 5)(x + 1)'],
      correcta: 1,
      explicacion: 'Necesitamos dos números que sumen 5 y multipliquen 6: 2 y 3. Por eso <strong>(x + 2)(x + 3)</strong>. Al multiplicar se obtiene x² + 5x + 6.'
    },

    {
      id: 'q13', nivel: 'dificil', tema: 'formula',
      pregunta: 'Las raíces de <span class="formula">2x<sup>2</sup> − 7x + 3 = 0</span> son:',
      opciones: ['x = 3 y x = 1/2', 'x = −3 y x = −1/2', 'x = 3 y x = 2', 'x = 1/3 y x = 2'],
      correcta: 0,
      explicacion: 'a = 2, b = −7, c = 3. Δ = 49 − 24 = 25 y √25 = 5. Entonces x = (7 ± 5)/4, lo que da x₁ = 12/4 = <strong>3</strong> y x₂ = 2/4 = <strong>1/2</strong>.'
    },
    {
      id: 'q14', nivel: 'dificil', tema: 'vertice',
      pregunta: 'El vértice de <span class="formula">f(x) = −2x<sup>2</sup> + 8x − 3</span> es:',
      opciones: ['(2, 5)', '(−2, 5)', '(2, −5)', '(4, 5)'],
      correcta: 0,
      explicacion: 'h = −8/(2·(−2)) = −8/(−4) = 2. Luego k = −2(2)² + 8(2) − 3 = −8 + 16 − 3 = 5. El vértice es <strong>(2, 5)</strong> y es un máximo porque a &lt; 0.'
    },
    {
      id: 'q15', nivel: 'dificil', tema: 'completacion',
      pregunta: 'Al completar el cuadrado, <span class="formula">x<sup>2</sup> + 8x + 11</span> se escribe como:',
      opciones: ['(x + 4)² − 5', '(x + 4)² + 5', '(x + 8)² − 53', '(x − 4)² − 5'],
      correcta: 0,
      explicacion: 'La mitad de 8 es 4 y 4² = 16. Sumamos y restamos 16: x² + 8x + 16 − 16 + 11 = <strong>(x + 4)² − 5</strong>. El vértice sería (−4, −5).'
    },
    {
      id: 'q16', nivel: 'dificil', tema: 'aplicaciones',
      pregunta: 'El rango de <span class="formula">f(x) = x<sup>2</sup> − 2x + 4</span> es:',
      opciones: ['[3, +∞)', '(−∞, 3]', '[4, +∞)', 'Todos los reales'],
      correcta: 0,
      explicacion: 'El vértice está en h = 2/2 = 1 y k = 1 − 2 + 4 = 3. Como a &gt; 0, la parábola abre hacia arriba y el valor mínimo es 3: el rango es <strong>[3, +∞)</strong>.'
    },
    {
      id: 'q17', nivel: 'dificil', tema: 'aplicaciones',
      pregunta: 'Una pelota sigue la trayectoria <span class="formula">h(t) = −5t<sup>2</sup> + 20t + 1,5</span>. Su altura máxima es:',
      opciones: ['21,5 m', '20 m', '1,5 m', '4,07 m'],
      correcta: 0,
      explicacion: 'El máximo ocurre en t = −20/(2·(−5)) = 2 s. Entonces h(2) = −5(4) + 20(2) + 1,5 = −20 + 40 + 1,5 = <strong>21,5 m</strong>. El valor 4,07 s es el tiempo en que cae al suelo.'
    },
    {
      id: 'q18', nivel: 'dificil', tema: 'completacion',
      pregunta: '¿Cuál función tiene vértice en (1, 5) y pasa por el punto (0, 3)?',
      opciones: [
        '<span class="formula">f(x) = −2x<sup>2</sup> + 4x + 3</span>',
        '<span class="formula">f(x) = 2x<sup>2</sup> − 4x + 3</span>',
        '<span class="formula">f(x) = −2x<sup>2</sup> − 4x + 3</span>',
        '<span class="formula">f(x) = −x<sup>2</sup> + 2x + 5</span>'
      ],
      correcta: 0,
      explicacion: 'Con vértice (1, 5), la forma es f(x) = a(x − 1)² + 5. Como pasa por (0, 3): 3 = a(0 − 1)² + 5 = a + 5, entonces a = −2. Desarrollando: −2(x − 1)² + 5 = <strong>−2x² + 4x + 3</strong>.'
    }
  ];

  /* ---------------- EVALUACIÓN FINAL (18 preguntas) ---------------- */
  const evaluacion = [
    {
      id: 'e1', nivel: 'facil', tema: 'parabola',
      pregunta: 'En <span class="formula">f(x) = −2x<sup>2</sup> + 4x − 1</span>, la parábola abre:',
      opciones: ['Hacia arriba', 'Hacia abajo', 'Hacia la derecha', 'No se puede saber'],
      correcta: 1,
      explicacion: 'El coeficiente a = −2 es negativo, por lo tanto la parábola abre hacia abajo y su vértice es un máximo.'
    },
    {
      id: 'e2', nivel: 'facil', tema: 'concepto',
      pregunta: 'El punto donde la gráfica de una función cuadrática corta el eje y es:',
      opciones: ['(0, a)', '(0, b)', '(0, c)', '(c, 0)'],
      correcta: 2,
      explicacion: 'Al evaluar x = 0 queda f(0) = a(0)² + b(0) + c = c. Por eso el corte con el eje y es siempre <strong>(0, c)</strong>.'
    },
    {
      id: 'e3', nivel: 'facil', tema: 'eje',
      pregunta: 'La fórmula del eje de simetría de una parábola es:',
      opciones: ['x = b/2a', 'x = −b/2a', 'x = −2a/b', 'x = c/a'],
      correcta: 1,
      explicacion: 'El eje de simetría es la recta vertical que pasa por el vértice: <strong>x = −b/2a</strong>. El signo negativo es fundamental.'
    },
    {
      id: 'e4', nivel: 'facil', tema: 'discriminante',
      pregunta: 'Si el discriminante es positivo (Δ &gt; 0), la ecuación cuadrática tiene:',
      opciones: ['Dos raíces reales distintas', 'Una raíz doble', 'Ninguna raíz real', 'Tres raíces'],
      correcta: 0,
      explicacion: 'Δ &gt; 0 hace que √Δ sea un número real positivo y distinto de cero, por lo que la fórmula general produce <strong>dos raíces reales diferentes</strong>.'
    },
    {
      id: 'e5', nivel: 'facil', tema: 'vertice',
      pregunta: 'El vértice de <span class="formula">f(x) = (x − 2)<sup>2</sup> + 3</span> es:',
      opciones: ['(2, 3)', '(−2, 3)', '(2, −3)', '(3, 2)'],
      correcta: 0,
      explicacion: 'En la forma vértice f(x) = a(x − h)² + k, el vértice es (h, k). Aquí h = 2 y k = 3, así que el vértice es <strong>(2, 3)</strong>.'
    },
    {
      id: 'e6', nivel: 'facil', tema: 'parabola',
      pregunta: 'Si el valor absoluto de <em>a</em> aumenta, la parábola:',
      opciones: ['Se hace más angosta', 'Se hace más amplia', 'Se desplaza a la derecha', 'Cambia de orientación'],
      correcta: 0,
      explicacion: 'Un |a| mayor hace que la parábola crezca más rápido y por eso se ve <strong>más angosta</strong>. Un |a| pequeño la hace más amplia. La orientación depende solo del signo.'
    },

    {
      id: 'e7', nivel: 'medio', tema: 'discriminante',
      pregunta: 'El discriminante de <span class="formula">3x<sup>2</sup> − 2x + 1 = 0</span> es:',
      opciones: ['−8', '8', '−4', '16'],
      correcta: 0,
      explicacion: 'Δ = (−2)² − 4(3)(1) = 4 − 12 = <strong>−8</strong>. Al ser negativo, la ecuación no tiene raíces reales.'
    },
    {
      id: 'e8', nivel: 'medio', tema: 'raices',
      pregunta: 'Las raíces de <span class="formula">x<sup>2</sup> − 9 = 0</span> son:',
      opciones: ['3 y −3', '9 y −9', '3 solamente', 'No tiene raíces'],
      correcta: 0,
      explicacion: 'Se puede factorizar como diferencia de cuadrados: (x − 3)(x + 3) = 0. Por eso las raíces son <strong>x = 3 y x = −3</strong>.'
    },
    {
      id: 'e9', nivel: 'medio', tema: 'vertice',
      pregunta: 'El vértice de <span class="formula">f(x) = 2x<sup>2</sup> − 12x + 13</span> es:',
      opciones: ['(3, −5)', '(−3, −5)', '(3, 5)', '(6, 13)'],
      correcta: 0,
      explicacion: 'h = −(−12)/(2·2) = 3. k = 2(9) − 12(3) + 13 = 18 − 36 + 13 = −5. El vértice es <strong>(3, −5)</strong>.'
    },
    {
      id: 'e10', nivel: 'medio', tema: 'factorizacion',
      pregunta: 'La factorización de <span class="formula">6x<sup>2</sup> + 7x − 3</span> es:',
      opciones: ['(3x − 1)(2x + 3)', '(3x + 1)(2x − 3)', '(6x − 1)(x + 3)', '(2x + 1)(3x − 3)'],
      correcta: 0,
      explicacion: 'Buscamos dos números que multipliquen 6·(−3) = −18 y sumen 7: son 9 y −2. Reescribimos 6x² + 9x − 2x − 3 = 3x(2x + 3) − (2x + 3) = <strong>(3x − 1)(2x + 3)</strong>.'
    },
    {
      id: 'e11', nivel: 'medio', tema: 'completacion',
      pregunta: '<span class="formula">2x<sup>2</sup> − 8x + 5</span> equivale a:',
      opciones: ['2(x − 2)² − 3', '2(x − 2)² + 3', '2(x − 4)² − 11', '2(x + 2)² − 3'],
      correcta: 0,
      explicacion: 'Factorizamos 2: 2(x² − 4x) + 5. Completamos: x² − 4x = (x − 2)² − 4. Entonces 2[(x − 2)² − 4] + 5 = <strong>2(x − 2)² − 3</strong>. El vértice es (2, −3).'
    },
    {
      id: 'e12', nivel: 'medio', tema: 'aplicaciones',
      pregunta: 'El valor máximo de <span class="formula">f(x) = −x<sup>2</sup> + 6x − 5</span> es:',
      opciones: ['4', '5', '9', '−4'],
      correcta: 0,
      explicacion: 'El vértice está en x = −6/(2·(−1)) = 3. Al evaluar: f(3) = −9 + 18 − 5 = <strong>4</strong>. Como a &lt; 0, ese valor es el máximo.'
    },

    {
      id: 'e13', nivel: 'dificil', tema: 'aplicaciones',
      pregunta: 'Una parábola corta el eje x en x = −1 y x = 4, y pasa por (0, −8). Su función es:',
      opciones: [
        '<span class="formula">f(x) = 2x<sup>2</sup> − 6x − 8</span>',
        '<span class="formula">f(x) = −2x<sup>2</sup> + 6x + 8</span>',
        '<span class="formula">f(x) = x<sup>2</sup> − 3x − 4</span>',
        '<span class="formula">f(x) = 2x<sup>2</sup> + 6x + 8</span>'
      ],
      correcta: 0,
      explicacion: 'Con raíces −1 y 4, la forma factorizada es f(x) = a(x + 1)(x − 4). Al evaluar (0, −8): −8 = a(1)(−4) = −4a, entonces a = 2. Desarrollando: 2(x + 1)(x − 4) = <strong>2x² − 6x − 8</strong>.'
    },
    {
      id: 'e14', nivel: 'dificil', tema: 'discriminante',
      pregunta: 'Si <span class="formula">f(x) = x<sup>2</sup> + bx + 9</span> tiene una sola raíz real, el valor positivo de b es:',
      opciones: ['3', '6', '9', '−6'],
      correcta: 1,
      explicacion: 'Una sola raíz real implica Δ = 0: b² − 4(1)(9) = 0, es decir b² = 36. Los valores posibles son b = 6 y b = −6; el positivo es <strong>6</strong>.'
    },
    {
      id: 'e15', nivel: 'dificil', tema: 'aplicaciones',
      pregunta: 'El costo diario <span class="formula">C(x) = x<sup>2</sup> − 8x + 25</span> (en miles de pesos) tiene un costo mínimo de:',
      opciones: ['9 mil pesos', '25 mil pesos', '4 mil pesos', '0 pesos'],
      correcta: 0,
      explicacion: 'El mínimo está en x = 8/2 = 4 artículos. Entonces C(4) = 16 − 32 + 25 = <strong>9</strong>, es decir, 9 000 pesos. El término 25 es el costo cuando x = 0, no el mínimo.'
    },
    {
      id: 'e16', nivel: 'dificil', tema: 'aplicaciones',
      pregunta: 'Una pelota sigue <span class="formula">h(t) = −5t<sup>2</sup> + 15t + 10</span>. ¿En qué tiempo positivo cae al suelo?',
      opciones: ['Aproximadamente 3,56 s', '2 s', '1,5 s', '5 s'],
      correcta: 0,
      explicacion: 'Resolvemos −5t² + 15t + 10 = 0, que equivale a t² − 3t − 2 = 0. Con la fórmula general: t = (3 ± √17)/2. La solución positiva es (3 + 4,12)/2 ≈ <strong>3,56 s</strong>.'
    },
    {
      id: 'e17', nivel: 'dificil', tema: 'eje',
      pregunta: 'La función <span class="formula">f(x) = x<sup>2</sup> − 4x</span> es decreciente en el intervalo:',
      opciones: ['(−∞, 2]', '[2, +∞)', '[−4, 0]', 'Todos los reales'],
      correcta: 0,
      explicacion: 'El vértice está en x = 4/2 = 2 y a &gt; 0. La parábola baja hasta el vértice y luego sube: es decreciente en <strong>(−∞, 2]</strong> y creciente en [2, +∞).'
    },
    {
      id: 'e18', nivel: 'dificil', tema: 'formula',
      pregunta: 'La suma de las raíces de <span class="formula">2x<sup>2</sup> − 5x + 1 = 0</span> es:',
      opciones: ['5/2', '−5/2', '1/2', '5'],
      correcta: 0,
      explicacion: 'Por las relaciones de Vieta, la suma de las raíces es −b/a = −(−5)/2 = <strong>5/2</strong>. También se obtiene sumando (5 + √17)/4 y (5 − √17)/4.'
    }
  ];

  /* ---------------- VERDADERO O FALSO ---------------- */
  const vf = [
    { texto: 'Toda función cuadrática tiene dos raíces reales.', verdadero: false, explicacion: 'Falso. Depende del discriminante: puede tener dos, una o ninguna raíz real. Por ejemplo, x² + 4 = 0 no tiene raíces reales.' },
    { texto: 'El vértice es el punto más alto o más bajo de la parábola.', verdadero: true, explicacion: 'Verdadero. Si a &gt; 0 es el punto mínimo; si a &lt; 0 es el punto máximo.' },
    { texto: 'Si a &gt; 0, la parábola abre hacia arriba.', verdadero: true, explicacion: 'Verdadero. El signo de a determina la concavidad: positivo hacia arriba, negativo hacia abajo.' },
    { texto: 'El eje de simetría pasa por el vértice.', verdadero: true, explicacion: 'Verdadero. El eje es la recta vertical x = −b/2a, que contiene al vértice V(h, k).' },
    { texto: 'El discriminante se calcula como b² − 4ac.', verdadero: true, explicacion: 'Verdadero. Esa expresión aparece dentro de la raíz cuadrada en la fórmula general.' },
    { texto: 'Si Δ = 0, la parábola no corta el eje x.', verdadero: false, explicacion: 'Falso. Si Δ = 0 la parábola es tangente al eje x: lo toca en un solo punto, la raíz doble.' },
    { texto: 'El término independiente c indica el corte con el eje y.', verdadero: true, explicacion: 'Verdadero. f(0) = c, así que la gráfica pasa por (0, c).' },
    { texto: 'La gráfica de f(x) = x² es una línea recta.', verdadero: false, explicacion: 'Falso. Es una parábola que abre hacia arriba con vértice en (0, 0).' },
    { texto: 'El vértice de f(x) = x² + 1 es (0, 1).', verdadero: true, explicacion: 'Verdadero. El eje es x = 0 y f(0) = 1, por lo que el vértice es (0, 1).' },
    { texto: 'Una función cuadrática puede tener tres raíces reales.', verdadero: false, explicacion: 'Falso. Como máximo tiene dos raíces reales, porque una parábola corta el eje x en dos puntos como máximo.' },
    { texto: 'Cuanto mayor es |a|, más angosta es la parábola.', verdadero: true, explicacion: 'Verdadero. Un valor absoluto de a grande hace que la curva crezca más rápido y se vea más estrecha.' },
    { texto: 'La fórmula general sirve para resolver cualquier ecuación ax² + bx + c = 0 con a ≠ 0.', verdadero: true, explicacion: 'Verdadero. Es el método más general: solo hay que calcular el discriminante y sustituir correctamente.' }
  ];

  /* ---------------- EMPAREJAR CONCEPTOS ---------------- */
  const parejas = [
    { concepto: 'Función cuadrática', definicion: '<span class="formula">f(x) = ax² + bx + c</span>, con a ≠ 0' },
    { concepto: 'Parábola', definicion: 'Curva simétrica en forma de U que representa la función' },
    { concepto: 'Vértice', definicion: 'Punto máximo o mínimo de la parábola: V(h, k)' },
    { concepto: 'Eje de simetría', definicion: 'Recta vertical <span class="formula">x = −b/2a</span> que pasa por el vértice' },
    { concepto: 'Discriminante', definicion: '<span class="formula">Δ = b² − 4ac</span>, indica el número de raíces reales' },
    { concepto: 'Raíz o cero', definicion: 'Valor de x para el que <span class="formula">f(x) = 0</span>' },
    { concepto: 'Fórmula general', definicion: '<span class="formula">x = (−b ± √(b² − 4ac))/2a</span>' },
    { concepto: 'Completar cuadrados', definicion: 'Escribir la función como <span class="formula">a(x − h)² + k</span>' }
  ];

  /* ---------------- COMPLETAR LA FUNCIÓN ---------------- */
  const completar = [
    {
      id: 'c1',
      enunciado: 'La parábola tiene vértice en (2, −3) y su coeficiente principal es a = 2. Completa los coeficientes de <span class="formula">f(x) = ax² + bx + c</span>.',
      pista: 'Empieza con la forma vértice: f(x) = 2(x − 2)² − 3 y desarrolla el cuadrado.',
      valores: [2, -8, 5],
      explicacion: '2(x − 2)² − 3 = 2(x² − 4x + 4) − 3 = 2x² − 8x + 8 − 3 = 2x² − 8x + 5. Por eso a = 2, b = −8 y c = 5.'
    },
    {
      id: 'c2',
      enunciado: 'Las raíces de la función son x = 1 y x = 4, y su coeficiente principal es a = 1. Completa <span class="formula">f(x) = ax² + bx + c</span>.',
      pista: 'Usa la forma factorizada: f(x) = a(x − r₁)(x − r₂).',
      valores: [1, -5, 4],
      explicacion: 'f(x) = 1(x − 1)(x − 4) = x² − 4x − x + 4 = x² − 5x + 4. Entonces a = 1, b = −5 y c = 4.'
    },
    {
      id: 'c3',
      enunciado: 'La parábola corta el eje y en (0, 3) y su vértice es (1, 5). Completa los coeficientes de <span class="formula">f(x) = ax² + bx + c</span>.',
      pista: 'Escribe f(x) = a(x − 1)² + 5 y usa el punto (0, 3) para hallar a.',
      valores: [-2, 4, 3],
      explicacion: '3 = a(0 − 1)² + 5 ⟹ 3 = a + 5 ⟹ a = −2. Entonces f(x) = −2(x − 1)² + 5 = −2x² + 4x − 2 + 5 = −2x² + 4x + 3.'
    },
    {
      id: 'c4',
      enunciado: 'La función está escrita como <span class="formula">f(x) = (x + 3)² − 1</span>. Exprésala en la forma <span class="formula">f(x) = ax² + bx + c</span>.',
      pista: 'Recuerda que (x + 3)² = x² + 6x + 9.',
      valores: [1, 6, 8],
      explicacion: '(x + 3)² − 1 = x² + 6x + 9 − 1 = x² + 6x + 8. Por eso a = 1, b = 6 y c = 8. Su vértice es (−3, −1).'
    },
    {
      id: 'c5',
      enunciado: 'La función <span class="formula">f(x) = x² + 2x + k</span> tiene una sola raíz real. Completa los valores de a, b y k.',
      pista: 'Una sola raíz real significa que el discriminante es igual a cero.',
      valores: [1, 2, 1],
      explicacion: 'Para una raíz doble, Δ = b² − 4ac = 2² − 4(1)(k) = 0. Entonces 4 − 4k = 0, de donde k = 1. La función es x² + 2x + 1 = (x + 1)², con raíz doble x = −1.'
    },
    {
      id: 'c6',
      enunciado: 'La parábola tiene vértice en (0, −4) y pasa por el punto (2, 0). Completa los coeficientes de <span class="formula">f(x) = ax² + bx + c</span>.',
      pista: 'Con vértice (0, −4), la forma es f(x) = ax² − 4. Sustituye el punto (2, 0).',
      valores: [1, 0, -4],
      explicacion: '0 = a(2)² − 4 ⟹ 0 = 4a − 4 ⟹ a = 1. Como el vértice está en x = 0, b = 0 y c = −4. La función es f(x) = x² − 4.'
    }
  ];

  /* ---------------- IDENTIFICAR EL VÉRTICE ---------------- */
  const vertices = [
    { funcion: 'x² − 6x + 5', correcto: '(3, −4)', distractores: ['(−3, −4)', '(3, 4)', '(6, 5)'] },
    { funcion: 'x² + 4x + 1', correcto: '(−2, −3)', distractores: ['(2, −3)', '(−2, 3)', '(4, 1)'] },
    { funcion: '−x² + 2x + 3', correcto: '(1, 4)', distractores: ['(−1, 4)', '(1, −4)', '(2, 3)'] },
    { funcion: '2x² − 8x + 3', correcto: '(2, −5)', distractores: ['(−2, −5)', '(2, 5)', '(4, 3)'] },
    { funcion: 'x² − 2x', correcto: '(1, −1)', distractores: ['(−1, −1)', '(1, 1)', '(2, 0)'] },
    { funcion: '−2x² − 4x + 1', correcto: '(−1, 3)', distractores: ['(1, 3)', '(−1, −3)', '(−2, 1)'] },
    { funcion: 'x² + 8x + 16', correcto: '(−4, 0)', distractores: ['(4, 0)', '(−4, 16)', '(−8, 16)'] },
    { funcion: '3x² − 6x + 2', correcto: '(1, −1)', distractores: ['(−1, −1)', '(1, 1)', '(2, 2)'] },
    { funcion: '−x² + 6x − 5', correcto: '(3, 4)', distractores: ['(−3, 4)', '(3, −4)', '(6, −5)'] },
    { funcion: 'x² − 10x + 21', correcto: '(5, −4)', distractores: ['(−5, −4)', '(5, 4)', '(10, 21)'] }
  ];

  /* ---------------- RETO CONTRARRELOJ ---------------- */
  const reto = [
    { pregunta: '¿Hacia dónde abre f(x) = −3x² + 1?', opciones: ['Arriba', 'Abajo', 'Derecha', 'No abre'], correcta: 1 },
    { pregunta: 'Vértice de f(x) = x² − 4x + 3', opciones: ['(2, −1)', '(−2, −1)', '(4, 3)', '(2, 1)'], correcta: 0 },
    { pregunta: 'Discriminante de x² + 2x + 1', opciones: ['0', '4', '−4', '1'], correcta: 0 },
    { pregunta: 'Si Δ &lt; 0, el número de raíces reales es:', opciones: ['0', '1', '2', '3'], correcta: 0 },
    { pregunta: 'Eje de simetría de f(x) = x² + 6x', opciones: ['x = −3', 'x = 3', 'x = 6', 'x = 0'], correcta: 0 },
    { pregunta: 'Raíces de x² − 16 = 0', opciones: ['±4', '±16', '4', '−4'], correcta: 0 },
    { pregunta: 'Vértice de f(x) = (x − 5)² + 2', opciones: ['(5, 2)', '(−5, 2)', '(5, −2)', '(2, 5)'], correcta: 0 },
    { pregunta: 'En f(x) = 4 − 2x² + x, el valor de a es:', opciones: ['4', '−2', '1', '2'], correcta: 1 },
    { pregunta: 'Corte con el eje y de f(x) = x² − 7x + 2', opciones: ['(0, 2)', '(2, 0)', '(0, −7)', '(0, 1)'], correcta: 0 },
    { pregunta: '¿Qué método resuelve cualquier ecuación cuadrática?', opciones: ['Fórmula general', 'Factorización', 'Solo graficar', 'Regla de tres'], correcta: 0 },
    { pregunta: 'Discriminante de 2x² − 3x + 1', opciones: ['1', '−1', '17', '9'], correcta: 0 },
    { pregunta: 'Raíces de x² − 3x + 2', opciones: ['1 y 2', '−1 y −2', '3 y 2', '0 y 3'], correcta: 0 },
    { pregunta: 'Vértice de f(x) = −x² + 4x', opciones: ['(2, 4)', '(−2, 4)', '(2, −4)', '(4, 0)'], correcta: 0 },
    { pregunta: 'Si a &gt; 0, el vértice es un punto:', opciones: ['Mínimo', 'Máximo', 'De corte', 'De inflexión'], correcta: 0 },
    { pregunta: 'Forma vértice de x² − 2x + 3', opciones: ['(x − 1)² + 2', '(x + 1)² + 2', '(x − 2)² + 3', '(x − 1)² − 2'], correcta: 0 },
    { pregunta: 'Factorización de x² − x − 6', opciones: ['(x − 3)(x + 2)', '(x + 3)(x − 2)', '(x − 6)(x + 1)', '(x − 1)(x + 6)'], correcta: 0 },
    { pregunta: 'Rango de f(x) = x² + 1', opciones: ['[1, +∞)', '(−∞, 1]', '[0, +∞)', 'Todos los reales'], correcta: 0 }
  ];

  quiz.push(
    { id: 'q19', nivel: 'facil', tema: 'aplicaciones', pregunta: 'En un lanzamiento, <span class="formula">h(t) = −5t² + 20t</span>. ¿En qué instante alcanza su altura máxima?', opciones: ['1 s', '2 s', '4 s', '5 s'], correcta: 1, explicacion: 'El máximo está en el eje de simetría: t = −b/2a = −20/(−10) = <strong>2 s</strong>.' },
    { id: 'q20', nivel: 'medio', tema: 'aplicaciones', pregunta: 'Un área rectangular se modela con <span class="formula">A(x) = x(18 − 2x)</span>. ¿Cuál es el ancho que produce el área máxima?', opciones: ['3 m', '4,5 m', '9 m', '18 m'], correcta: 1, explicacion: 'A(x) = −2x² + 18x. El eje es x = −18/(−4) = <strong>4,5 m</strong>.' },
    { id: 'q21', nivel: 'medio', tema: 'aplicaciones', pregunta: 'La ganancia <span class="formula">G(x) = −2x² + 80x − 300</span> representa ventas. ¿Qué cantidad maximiza la ganancia?', opciones: ['10 unidades', '20 unidades', '40 unidades', '80 unidades'], correcta: 1, explicacion: 'La ganancia máxima ocurre en x = −80/(2·−2) = <strong>20</strong> unidades.' },
    { id: 'q22', nivel: 'dificil', tema: 'aplicaciones', pregunta: 'Un arco tiene altura <span class="formula">h(x) = −0,25x² + 4</span>. ¿Qué representa h(0) = 4?', opciones: ['El ancho total', 'La altura máxima', 'Una raíz', 'El eje de simetría'], correcta: 1, explicacion: 'Como b = 0, el vértice está en x = 0 y h(0) = c = <strong>4</strong>; por tanto representa la altura máxima del arco.' }
  );
  evaluacion.push(
    { id: 'e19', nivel: 'facil', tema: 'aplicaciones', pregunta: 'Una fuente de agua sigue <span class="formula">h(t) = −t² + 6t + 1</span>. ¿Cuál es su altura inicial?', opciones: ['0 m', '1 m', '6 m', '−1 m'], correcta: 1, explicacion: 'La altura inicial es h(0) = c = <strong>1 m</strong>.' },
    { id: 'e20', nivel: 'medio', tema: 'aplicaciones', pregunta: 'El costo de producir x cuadernos es <span class="formula">C(x) = x² − 12x + 50</span>. ¿En qué cantidad se obtiene el costo mínimo?', opciones: ['6 cuadernos', '12 cuadernos', '−6 cuadernos', '50 cuadernos'], correcta: 0, explicacion: 'Como a > 0, el mínimo está en el vértice: x = −(−12)/(2·1) = <strong>6</strong>.' },
    { id: 'e21', nivel: 'medio', tema: 'raices', pregunta: 'Una pelota toca el suelo cuando <span class="formula">−5t² + 15t = 0</span>. ¿Cuál es el tiempo positivo?', opciones: ['0 s', '1 s', '3 s', '15 s'], correcta: 2, explicacion: 'Factorizamos −5t(t − 3) = 0. Los tiempos son 0 y <strong>3 s</strong>; el tiempo positivo de aterrizaje es 3 s.' },
    { id: 'e22', nivel: 'dificil', tema: 'aplicaciones', pregunta: 'Un rectángulo tiene perímetro 40 m y área <span class="formula">A(x) = x(20 − x)</span>. ¿Cuál es su área máxima?', opciones: ['100 m²', '200 m²', '400 m²', '20 m²'], correcta: 0, explicacion: 'A(x) = −x² + 20x. El vértice está en x = 10 y A(10) = <strong>100 m²</strong>.' }
  );
  reto.push(
    { pregunta: 'Un balón sigue h(t) = −5t² + 20t + 1. ¿Cuándo llega a su altura máxima?', opciones: ['1 s', '2 s', '4 s', '20 s'], correcta: 1 },
    { pregunta: 'Área máxima de A(x) = −x² + 12x − 20:', opciones: ['16', '20', '36', '12'], correcta: 0 },
    { pregunta: 'Si G(x) = −x² + 10x − 9, la cantidad que maximiza G es:', opciones: ['5', '10', '9', '1'], correcta: 0 },
    { pregunta: 'En un arco h(x) = −0,5x² + 8, la altura máxima es:', opciones: ['0', '4', '8', '−8'], correcta: 2 },
    { pregunta: 'Una raíz de x² − 7x + 12 es:', opciones: ['2', '3', '5', '12'], correcta: 1 }
  );
  window.DATOS = { temas, quiz, evaluacion, vf, parejas, completar, vertices, reto };
})();
