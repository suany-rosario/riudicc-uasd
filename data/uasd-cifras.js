/* =====================================================================
   LA UASD EN CIFRAS · DATOS REALES
   Fuente: Dirección General de Planificación y Desarrollo Institucional, UASD.
   División de Estadística y Estudios Aplicados. Reportes estadísticos publicados en
   https://uasd.edu.do/desarrollo-institucional/estadisticas-generales-pbi/
   Matrícula: estudiantes de grado y técnico superior (no incluye postgrado ni a quienes
   solo tienen pendiente tesis, internado o pasantía). Consulta: 2026-10-31.
   Para actualizar: añadir el año nuevo a cada lista con las cifras del reporte oficial.
   ===================================================================== */
window.UASD_CIFRAS = {
  fuente: { nombre: "Estadísticas generales de la UASD (Dirección General de Planificación y Desarrollo Institucional)",
            enlace: "https://uasd.edu.do/desarrollo-institucional/estadisticas-generales-pbi/" },

  // Matrícula anual de grado y técnico superior, por sexo
  matricula: [
    { anio: 2017, total: 217830, mujeres: 146036, hombres: 71794 },
    { anio: 2018, total: 227018, mujeres: 152848, hombres: 74170 },
    { anio: 2019, total: 234850, mujeres: 159238, hombres: 75612 },
    { anio: 2020, total: 233804, mujeres: 159933, hombres: 73871 },
    { anio: 2021, total: 203407, mujeres: 143236, hombres: 60171 },
    { anio: 2022, total: 200439, mujeres: 141148, hombres: 59291 },
    { anio: 2023, total: 193354, mujeres: 136772, hombres: 56582 },
    { anio: 2024, total: 193792, mujeres: 137554, hombres: 56238 },
    { anio: 2025, total: 190326, mujeres: 136757, hombres: 53569 }
  ],

  // Estudiantes de grado con nacionalidad distinta de la dominicana
  extranjeros: [
    { anio: 2020, total: 205, venezuela: 93,  haiti: 93,  paises: 15 },
    { anio: 2021, total: 248, venezuela: 120, haiti: 108, paises: 14 },
    { anio: 2022, total: 341, venezuela: 168, haiti: 138, paises: 16 },
    { anio: 2023, total: 311, venezuela: 168, haiti: 113, paises: 17 },
    { anio: 2024, total: 319, venezuela: 181, haiti: 101, paises: 17 },
    { anio: 2025, total: 299, venezuela: 174, haiti: 89,  paises: 17 }
  ],
  // Detalle de 2025 por nacionalidad
  nacionalidades2025: [
    { k: "Venezolana", n: 174 }, { k: "Haitiana", n: 89 }, { k: "Colombiana", n: 6 }, { k: "Peruana", n: 6 },
    { k: "Cubana", n: 5 }, { k: "Española", n: 5 }, { k: "Chilena", n: 2 }, { k: "Ecuatoriana", n: 2 },
    { k: "Hondureña", n: 2 }, { k: "Brasileña", n: 1 }, { k: "Estadounidense", n: 1 }, { k: "Francesa", n: 1 },
    { k: "Guatemalteca", n: 1 }, { k: "Mexicana", n: 1 }, { k: "Neerlandesa", n: 1 }, { k: "Puertorriqueña", n: 1 },
    { k: "Ucraniana", n: 1 }
  ],

  // Matrícula 2025 por unidad académica y sexo.
  // "Organismos Académicos Comunes" agrupa a quienes cursan el ciclo básico común.
  facultades2025: [
    { k: "Ciencias de la Educación", mujeres: 20676, hombres: 7638 },
    { k: "Ciencias de la Salud", mujeres: 19903, hombres: 2617 },
    { k: "Humanidades", mujeres: 18281, hombres: 3409 },
    { k: "Ciencias Económicas y Sociales", mujeres: 11648, hombres: 4558 },
    { k: "Ingeniería y Arquitectura", mujeres: 4571, hombres: 6647 },
    { k: "Ciencias Jurídicas y Políticas", mujeres: 4209, hombres: 2397 },
    { k: "Ciencias", mujeres: 1686, hombres: 3592 },
    { k: "Artes", mujeres: 2465, hombres: 1495 },
    { k: "Cs. Agronómicas y Veterinarias", mujeres: 1026, hombres: 1285 },
    { k: "Ciclo básico (Organismos Académicos Comunes)", mujeres: 52292, hombres: 19931 }
  ],

  // Personal docente por facultad, primer semestre 2025 (programación docente 2025-10)
  docentes2025: [
    { k: "Ciencias de la Salud", n: 753 }, { k: "Ciencias", n: 641 }, { k: "Humanidades", n: 572 },
    { k: "Ciencias Económicas y Sociales", n: 493 }, { k: "Ciencias de la Educación", n: 403 },
    { k: "Ciencias Jurídicas y Políticas", n: 230 }, { k: "Ingeniería y Arquitectura", n: 213 },
    { k: "Artes", n: 100 }, { k: "Cs. Agronómicas y Veterinarias", n: 70 },
    { k: "Organismos Académicos Comunes", n: 45 }
  ],

  // Investigadores registrados en la Dirección de Investigaciones Científicas, 2023
  investigadores2023: { total: 179, mujeres: 69, hombres: 110,
    extranjeros: [ { k: "Cuba", n: 3 }, { k: "España", n: 2 }, { k: "Irán", n: 1 } ] },

  // Referencia nacional (UNESCO UIS): estudiantes internacionales en RD, % de la matrícula, 2024
  referenciaPaisEntrante: 1.92
};
