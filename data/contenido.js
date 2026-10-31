/* =====================================================================
   CONTENIDO DEL PORTAL RIUDICC–UASD
   Edite este archivo para actualizar textos, enlaces y listas.
   Cada bloque es una lista de elementos con el mismo formato.
   Fechas en formato AAAA-MM-DD.
   ===================================================================== */

window.SITIO = {
  correo: "srosario64@uasd.edu.do",
  actualizado: "2026-10-31",
  formularioMovilidad: "formulario.html",   // página del formulario de registro de movilidad
  formularioEndpoint: "",   // URL de la aplicación web de Google Apps Script que guarda el formulario. Vacío = vista previa, no guarda
  tablonMovilidad: "tablon.html",           // página pública del tablón
  tablonEndpoint: ""        // URL de la aplicación web del tablón (hoja de Google). Vacío = usa data/ofertas.js
};

/* ---------- Destacados de la portada ----------
   La primera tarjeta se genera sola con la próxima convocatoria que cierra (de data/ofertas.js).
   Aquí van las demás. */
window.DESTACADOS = [
  { etiqueta: "Participa", titulo: "Registro de movilidad UASD 2023–2026",
    texto: "¿Viajaste a un congreso, hiciste una estancia o recibiste visitantes? Regístralo en dos minutos y ayuda a construir el primer mapa de movilidad de la UASD.",
    enlace: "#participa" },
  { etiqueta: "Datos", titulo: "Ecuador es el país de la red donde más estudiantes salen a estudiar fuera",
    texto: "3,35 % de su matrícula estudia en otro país, frente a 1,04 % en República Dominicana y 0,74 % en México (UNESCO, 2023).",
    enlace: "#panorama" },
  { etiqueta: "Red", titulo: "Tablón de movilidad RIUDICC",
    texto: "Intercambios, cursos cortos, estancias y becas que publican las universidades de la red, revisados por el micro-observatorio.",
    enlace: "tablon.html" }
];

/* ---------- Qué es RIUDICC (sección de presentación) ----------
   Para actualizar las cifras, cambie "n" y "texto". Verifique cada cifra con la coordinación del proyecto. */
window.RIUDICC = {
  texto: "RIUDICC (Red Internacional de Universidades para el Desarrollo Inclusivo y el Intercambio Científico y Cultural) es un proyecto Erasmus+ de fortalecimiento de capacidades de la convocatoria 2024 (n.º 101178033), en ejecución de 2025 a 2026. Reúne a diez universidades de República Dominicana, México, Guatemala, Ecuador, España e Italia, coordinadas por la Universidad Complutense de Madrid, con el propósito de ofrecer oportunidades internacionales a estudiantes en situación de vulnerabilidad social y económica.",
  objetivosTitulo: "Objetivos específicos del proyecto",
  objetivos: [
    "Desarrollar las oficinas de relaciones internacionales.",
    "Estudiar las necesidades de movilidad y crear un programa piloto de becas bilaterales.",
    "Construir alianzas estables de colaboración.",
    "Crear un observatorio interuniversitario e implementar medidas sostenibles para el futuro de la alianza."
  ],
  objetivosFuente: "Fuente: propuesta RIUDICC, apartado 1.2.",
  logros: [
    { n: "24", texto: "entregables presentados" },
    { n: "3", texto: "encuentros internacionales de la red" },
    { n: "Madrid", texto: "cartas de intención firmadas para la continuidad de la alianza" },
    { n: "10", texto: "universidades socias en 6 países" }
  ],
  nota: "Cifras a octubre de 2026."
};

/* ---------- La UASD y la internacionalización ---------- */
window.UASD = {
  texto: "La Universidad Autónoma de Santo Domingo, fundada el 28 de octubre de 1538, es la universidad pública de la República Dominicana. En RIUDICC co-lidera el paquete de trabajo sobre inclusión y movilidad de poblaciones vulnerables (WP2) y pone en marcha su micro-observatorio de movilidad.",
  oficinas: [
    { nombre: "Dirección General de Cooperación y Relaciones Nacionales e Internacionales", rol: "Convenios, movilidad y relaciones con universidades e instituciones del exterior.", enlace: "https://uasd.edu.do/cooperacion-internacional/" },
    { nombre: "Dirección de Becas", rol: "Tramita becas nacionales e internacionales para estudiantes, egresados, docentes e investigadores.", enlace: "https://uasd.edu.do/cooperacion-internacional/direccion-becas/" },
    { nombre: "Vicerrectoría de Investigación y Postgrado", rol: "Proyectos de investigación, postgrados, congresos y redes regionales como el SIRCIP del CSUCA.", enlace: "https://uasd.edu.do/vicerrectoria-investigacion/" },
    { nombre: "Micro-observatorio de movilidad (RIUDICC)", rol: "Registro, análisis y difusión de la movilidad académica de la UASD.", enlace: "#observatorio" }
  ]
};


/* ---------- Convocatorias ----------
   Las convocatorias ya no se escriben aquí: están en data/ofertas.js (las actualiza el agente
   y se revisan antes de publicar). La portada muestra las próximas en cerrar. */

/* ---------- Organismos de becas por país ---------- */
window.ORGANISMOS_BECAS = [
  { pais: "República Dominicana", nombre: "MESCyT · becas internacionales", enlace: "https://mescyt.gob.do/noticias/mescyt-exhorta-a-jovenes-de-todo-el-territorio-nacional-postularse-a-becas-internacionales-2026/" },
  { pais: "República Dominicana", nombre: "UASD · Dirección de Becas", enlace: "https://uasd.edu.do/cooperacion-internacional/direccion-becas/" },
  { pais: "México", nombre: "SECIHTI · becas al extranjero", enlace: "https://secihti.mx/becas-al-extranjero/convocatorias-y-resultados-de-becas-al-extranjero/" },
  { pais: "Guatemala", nombre: "SEGEPLAN · portal de becas", enlace: "https://portal-becas.segeplan.gob.gt/becas_/busqueda" },
  { pais: "Ecuador", nombre: "SENESCYT · convocatorias", enlace: "https://siau.senescyt.gob.ec/portfolio/convocatorias/" },
  { pais: "España", nombre: "Fundación Carolina", enlace: "https://www.fundacioncarolina.es/convocatoria-de-becas-de-la-fundacion-carolina-20262027/" }
];
