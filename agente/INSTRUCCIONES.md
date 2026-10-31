# Agente de convocatorias · RIUDICC–UASD

Instrucciones para el agente de IA que busca convocatorias cada semana y propone
nuevas entradas para el tablón (`data/ofertas.js`).

## Qué hace el agente

1. Revisa las fuentes de la lista de abajo.
2. Detecta convocatorias **nuevas y abiertas** (que no estén ya en `data/ofertas.js`).
3. Abre la página o el PDF oficial de cada una y extrae los datos.
4. Añade las entradas a `data/ofertas.js` en una rama nueva y abre una
   **solicitud de cambio (pull request)** con la lista de lo que agregó.
5. **No publica nada directamente.** Una persona del equipo revisa la solicitud
   y la aprueba (merge). Al aprobarla, Cloudflare Pages publica el sitio actualizado.

## Reglas

- Solo convocatorias **abiertas** en la fecha de la revisión.
- Solo convocatorias a las que pueda postular personal o estudiantado de la **UASD /
  República Dominicana**, o de las universidades de la red RIUDICC. Si la página
  no deja claro que República Dominicana es elegible, dilo en `descripcion`
  ("Verificar que RD sea elegible") para que la persona revisora lo compruebe.
- Cada dato sale de la **página oficial** de la convocatoria. Nunca inventar fechas,
  montos ni requisitos. Si un dato no aparece, dejar el campo vacío (`""`).
- `fecha_limite` es la fecha de cierre oficial (`AAAA-MM-DD`). Si la hora o la zona horaria
  importan, explicarlo en `descripcion` (por ejemplo, "23:59 hora de Chile").
- `enlace` apunta a la página o PDF oficial, nunca a un blog o agregador.
- No agregar datos personales de nadie.
- No duplicar: comparar con los `id`, títulos y enlaces que ya existen.
- Opcional: borrar entradas vencidas hace más de 60 días.

## Formato de cada entrada

```json
{
  "id": "organismo-programa-anio",
  "estado": "Aprobada",
  "tipo_registro": "convocatoria",
  "origen": "agente",
  "titulo": "Nombre oficial de la convocatoria",
  "entidad": "Organismo que la ofrece",
  "tipo": "Beca",
  "pais": "País de destino",
  "nivel": "Postgrado",
  "modalidad": "Presencial",
  "area": "Áreas o 'Todas'",
  "fecha_limite": "2026-12-15",
  "plazas": "",
  "cubre": "Qué financia",
  "descripcion": "Requisitos clave, elegibilidad de RD, cómo postular, hora de cierre.",
  "enlace": "https://…",
  "contacto": "",
  "apoyos_inclusion": false
}
```

Valores permitidos:

- `tipo`: Beca · Intercambio semestral · Curso corto · Estancia de investigación ·
  Profesor visitante · COIL / movilidad virtual · Pasantía
- `nivel`: Grado · Postgrado · Docentes · Investigadores · Personal administrativo · Todos
- `modalidad`: Presencial · Virtual · Híbrida
- `tipo_registro`: `convocatoria` (externa) u `oferta` (de una universidad de la red)
- `apoyos_inclusion`: `true` si ofrece apoyos para poblaciones vulnerables

Lo que va entre `window.OFERTAS=` y el `;` final debe ser **JSON válido**.
Antes de abrir la solicitud de cambio, ejecutar:

```
python3 agente/validar_ofertas.py
```

## Fuentes a vigilar

> Lista inicial. Ajustar con el equipo: añadir o quitar fuentes.

**República Dominicana**
- MESCyT · becas internacionales — https://mescyt.gob.do
- UASD · Dirección de Becas — https://uasd.edu.do/cooperacion-internacional/direccion-becas/

**Unión Europea y España**
- Erasmus Mundus (catálogo de maestrías) — https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en
- Fundación Carolina — https://www.fundacioncarolina.es
- AUIP · Asociación Universitaria Iberoamericana de Postgrado — https://auip.org

**Otros programas con RD elegible**
- OEA · becas — https://www.oas.org/es/becas/
- DAAD (Alemania) — https://www.daad.de
- AGCID (Chile) — https://www.agci.cl
- GKS (Corea) — https://www.studyinkorea.go.kr
- MEXT (Japón) — embajada de Japón en RD
- Chevening (Reino Unido) — https://www.chevening.org

**Universidades de la red RIUDICC**
- Páginas de relaciones internacionales de cada universidad socia (completar).

## Cómo se ejecuta

- **Ahora (prueba):** tarea programada semanal en Claude que sigue estas instrucciones
  y abre la solicitud de cambio en el repositorio de GitHub.
- **Cuando el sitio pase a TI:** GitHub Actions + API de Claude, con estas mismas
  instrucciones, dentro de este repositorio.
