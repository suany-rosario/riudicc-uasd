"""Genera data/movilidad-publica.js (portal) a partir de interno/movilidades.js (panel RI).

El portal solo recibe lo necesario para los gráficos y el mapa: sentido, perfil,
unidad agrupada, país, motivo, apoyo, año y semestre. No incluye institución,
ciudad, fecha exacta, notas ni número de resolución.
Uso:  python3 agente/movilidad_publica.py
"""
import json, re, pathlib
RAIZ = pathlib.Path(__file__).resolve().parent.parent
src = (RAIZ / "interno" / "movilidades.js").read_text(encoding="utf8")
D = json.loads(re.search(r"window\.MOVILIDADES\s*=\s*(\{.*\})\s*;?\s*$", src, re.S).group(1))

FACS = ["Artes", "Ciencias de la Educación", "Ciencias de la Salud", "Ciencias Económicas y Sociales",
        "Ciencias Jurídicas y Políticas", "Ciencias Agronómicas y Veterinarias", "Ingeniería y Arquitectura", "Humanidades", "Ciencias"]
def grupo(f):
    f = f or ""
    if "Fit4Digital" in f: return "Ciencias de la Educación"
    if "HEMISPHERES" in f: return "Ciencias"
    for x in FACS:
        if x in f: return x
    if re.search(r"Rector|Vicerrector", f): return "Rectoría y vicerrectorías"
    if re.search(r"Recinto|Centro", f): return "Recintos y centros"
    if f == "Varias": return "Varias facultades"
    return "Administración y otras unidades"

rows = [{"sentido": r["sentido"], "perfil": r["perfil"], "facultad": grupo(r["facultad"]), "pais": r["pais"],
         "dimension": r["dimension"], "razon": r["razon"], "organismo": r["organismo"], "sexo": r["sexo"],
         "anio": r["anio"], "periodo": r["periodo"], "fuente": r["fuente"]} for r in D["rows"]]
hdr = ("/* Movilidad registrada de la UASD · versión pública para el portal (solo datos agregables).\n"
       "   Generado con agente/movilidad_publica.py desde interno/movilidades.js. No editar a mano. */\n")
(RAIZ / "data" / "movilidad-publica.js").write_text(
    hdr + "window.MOV_PUBLICA = " + json.dumps({"rows": rows, "coords": D["coords"]}, ensure_ascii=False) + ";\n", encoding="utf8")
print(len(rows), "filas;", sorted({r["facultad"] for r in rows}))
