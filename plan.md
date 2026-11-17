# Plan de publicación oficial — Funciones Cuadráticas

## Alcance
Convertir la plataforma educativa existente en un sitio web público, permanente y responsive para estudiantes de grado décimo de la Institución Educativa Armando Solano. Se conservará la experiencia ya construida y se ampliará con actividades lúdicas más llamativas y preguntas contextualizadas.

## Implementación
- Publicación estática sin base de datos: la aplicación funciona en navegador y guarda el progreso localmente mediante `localStorage`.
- La fuente principal permanecerá separada en `index.html`, `css/estilos.css` y módulos JavaScript para facilitar mantenimiento.
- Se conservará una versión autónoma en un solo HTML como respaldo de presentación.
- Se añadirá `manus-routes.json` con la ruta pública `/` y documentos SEO básicos.
- Se configurará la compilación estática reproducible (`bash build-static.sh`) usando `public/` como salida.
- Se incluirá un manifiesto PWA propio (`manifest.webmanifest`) con el logotipo oficial y modo independiente para instalación desde el celular.

## Experiencia ampliada
- Nuevos juegos: Sudoku cuadrático, crucigrama de conceptos y sopa de letras.
- Retos adicionales: ordenar pasos de resolución, organizar procedimientos con controles táctiles y desafío relámpago.
- Más preguntas contextualizadas sobre deportes, áreas, costos, ganancias, puentes y lectura de gráficas.
- Modo oscuro, insignias, barra de avance y mensajes de celebración.
- Accesibilidad móvil, controles táctiles, instrucciones claras y retroalimentación inmediata.

## Diseño

### Opciones consideradas
- **Laboratorio neón educativo** (0.06): paneles luminosos, colores violeta/cian y sensación de experimento.
- **Cuaderno editorial** (0.04): tarjetas de papel, anotaciones y énfasis en la lectura paso a paso.
- **Arcade matemático** (0.08): retos cortos, insignias, puntuaciones y una paleta energética.

### Elección: Arcade matemático
- **Movimiento:** diseño de producto educativo contemporáneo con energía de videojuego casual.
- **Principios:** claridad primero, recompensa visible, interacción breve y aprendizaje explicable.
- **Color:** violeta como identidad, cian para aciertos y coral para retos; el color comunica estado, no solo decoración.
- **Layout:** portada panorámica, navegación por secciones y módulos de juego con paneles de reto.
- **Firmas:** curvas parabólicas, anillos de progreso y chips de nivel/racha.
- **Interacción:** cada respuesta produce una consecuencia clara: explicación, puntos, racha o recomendación.
- **Animación:** transiciones suaves, celebración corta al acertar, sin movimiento permanente que distraiga.
- **Tipografía:** Plus Jakarta Sans para lectura y Cambria Math para fórmulas.
- **Esencia:** un entrenador interactivo que convierte las funciones cuadráticas en práctica visual y jugable. Personalidad: claro, curioso, motivador.
- **Voz:** “Prueba, observa y descubre por qué funciona.” / “Tu próxima racha empieza con una parábola.”
- **Marca:** símbolo de parábola dentro de un cuadrado redondeado.
- **Color propio:** violeta `#6d4aff` combinado con coral `#ff5d9e`.

## Estructura
- `index.html`: contenido semántico, secciones y contenedores de interacción.
- `css/estilos.css`: sistema visual, responsive, modo oscuro, impresión y estados de juego.
- `js/datos.js`: conceptos, ejemplos, preguntas y bancos de retos.
- `js/grafica.js`: gráfica y cálculo de propiedades de la función.
- `js/juegos.js`: juegos rápidos y nuevos juegos de tablero/palabras.
- `js/evaluacion.js`: quiz, evaluación, retroalimentación y certificado.
- `js/app.js`: navegación, progreso local, insignias, tema y reinicio.
- `manus-routes.json`: manifiesto de rutas públicas.
- `LEEME.txt`: instrucciones de uso y publicación.
