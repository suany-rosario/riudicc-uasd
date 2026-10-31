# Sitio RIUDICC · UASD

Sitio web del micro-observatorio de movilidad académica de la Universidad Autónoma de
Santo Domingo (UASD) en la red RIUDICC, proyecto Erasmus+ n.º 101178033.

Es un **sitio estático**: solo HTML, CSS y JavaScript, sin base de datos, sin WordPress
y sin herramientas de compilación. Se puede alojar en cualquier servidor web
(Cloudflare Pages, GitHub Pages, Netlify o un servidor Apache/Nginx de la universidad)
copiando la carpeta tal cual.

> Estado: sitio en desarrollo. No es todavía un sitio oficial de la UASD.

## Páginas

| Archivo | Qué es |
| --- | --- |
| `index.html` | Portada: qué es RIUDICC, la UASD en la red, próximas convocatorias, cómo participar y el **laboratorio** (panorama UNESCO + micro-observatorio UASD). |
| `tablon.html` | **Tablón de movilidad**: becas, intercambios, cursos y estancias, con filtros y formulario para proponer ofertas. |
| `formulario.html` | Formulario anónimo de **registro de movilidad** (alimenta el micro-observatorio). |

## Estructura

```
index.html, tablon.html, formulario.html
css/
  estilos.css            estilos comunes (colores, tipografía, cabecera, pie)
  formulario.css         estilos de formularios
  tablon.css             estilos del tablón
js/
  portal.js              dibuja la portada a partir de data/
  observatorio.js        gráficos y mapa del micro-observatorio
  tablon.js              lista y filtros del tablón, formulario de propuestas
  formulario.js          formulario de registro de movilidad
data/                    ← lo que se edita para actualizar el contenido
  contenido.js           textos, enlaces, correo, destacados, organismos de becas
  ofertas.js             convocatorias y ofertas del tablón (las actualiza el agente)
  panorama.js            datos UNESCO por país (reales)
  movilidades-demo.js    registros DEMOSTRATIVOS del micro-observatorio (ficticios)
  opciones-formulario.js listas del formulario (Plantilla 13 del MESCyT)
  mundo.js               fronteras para el mapa (Natural Earth, dominio público)
img/                     logos (UE, RIUDICC, UASD)
agente/
  INSTRUCCIONES.md       cómo trabaja el agente de convocatorias y qué fuentes vigila
  validar_ofertas.py     comprueba que data/ofertas.js esté bien antes de publicar
```

## Cómo actualizar el contenido

- **Textos, enlaces, correo y destacados:** `data/contenido.js`.
- **Convocatorias del tablón:** `data/ofertas.js`. Las vencidas se ocultan solas.
  La portada muestra automáticamente las 5 próximas en cerrar.
- **Datos del micro-observatorio:** hoy son ficticios (`data/movilidades-demo.js`)
  y la página lo avisa. Se sustituirán por los registros reales de la UASD.

Fechas siempre en formato `AAAA-MM-DD`.

## Ver el sitio en tu computadora

Abre `index.html` con doble clic en el navegador. Para probarlo como en internet,
desde esta carpeta:

```
python3 -m http.server 8000
```

y abre http://localhost:8000

## Publicar (GitHub + Cloudflare Pages)

1. Crear un repositorio en GitHub (por ejemplo `riudicc-uasd`) y subir esta carpeta.
2. En Cloudflare: *Workers & Pages → Create → Pages → Connect to Git*, elegir el repositorio.
   - Framework preset: **None**
   - Build command: *(vacío)*
   - Build output directory: `/`
3. Cada cambio que se guarde en GitHub se publica solo en unos segundos.
4. Dominio: en *Custom domains*, añadir el dominio propio o el subdominio que asigne
   la UASD (por ejemplo `riudicc.uasd.edu.do`; TI solo debe crear un registro CNAME).

## Agente de convocatorias

Un agente de IA revisa cada semana las fuentes listadas en `agente/INSTRUCCIONES.md`,
añade las convocatorias nuevas a `data/ofertas.js` y abre una **solicitud de cambio
(pull request)** en GitHub. Nada se publica hasta que una persona del equipo la revisa
y la aprueba.

## Conexiones opcionales (pendientes)

- `SITIO.formularioEndpoint` y `SITIO.tablonEndpoint` en `data/contenido.js`: dirección
  de una aplicación de Google Apps Script que guarda las respuestas del formulario y las
  propuestas del tablón en una hoja de Google. Mientras estén vacías, ambos formularios
  funcionan en **modo vista previa** y no guardan nada.

## Protección de datos

- El formulario de movilidad no pide nombre ni cédula y solo se publican cifras
  agregadas (Ley 172-13 de la República Dominicana).
- No publicar en el sitio listas de participantes ni datos personales.

## Créditos y visibilidad Erasmus+

Proyecto cofinanciado por el programa Erasmus+ de la Unión Europea (RIUDICC, 101178033).
El pie de página incluye el emblema de la UE y el descargo de responsabilidad
obligatorio; no deben quitarse.

Mapa: fronteras de Datamaps (MIT, © Mark DiMarco), derivadas de Natural Earth.
Datos de panorama: Instituto de Estadística de la UNESCO (UIS), vía Our World in Data.
