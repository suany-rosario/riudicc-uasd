"""Valida data/ofertas.js antes de publicar.

Uso:  python3 agente/validar_ofertas.py
Sale con código 1 si encuentra errores (sirve para GitHub Actions).
"""
import json, re, sys, pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ARCHIVO = RAIZ / "data" / "ofertas.js"

TIPOS = {"Beca", "Intercambio semestral", "Curso corto", "Estancia de investigación",
         "Profesor visitante", "COIL / movilidad virtual", "Pasantía"}
NIVELES = {"Grado", "Postgrado", "Docentes", "Investigadores", "Personal administrativo", "Todos", ""}
MODALIDADES = {"Presencial", "Virtual", "Híbrida", ""}
OBLIGATORIOS = ["id", "titulo", "entidad", "tipo", "enlace"]


def cargar():
    texto = ARCHIVO.read_text(encoding="utf8")
    m = re.search(r"window\.OFERTAS\s*=\s*(\[.*\])\s*;?\s*$", texto, re.S)
    if not m:
        sys.exit("No se encontró 'window.OFERTAS=[...]' en data/ofertas.js")
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError as e:
        sys.exit(f"data/ofertas.js no es JSON válido: {e}")


def main():
    ofertas = cargar()
    errores, ids = [], set()
    for n, o in enumerate(ofertas, 1):
        quien = o.get("id") or f"entrada {n}"
        for campo in OBLIGATORIOS:
            if not str(o.get(campo, "")).strip():
                errores.append(f"{quien}: falta '{campo}'")
        if o.get("id") in ids:
            errores.append(f"{quien}: id repetido")
        ids.add(o.get("id"))
        if o.get("tipo") and o["tipo"] not in TIPOS:
            errores.append(f"{quien}: tipo no válido '{o['tipo']}'")
        if o.get("nivel", "") not in NIVELES:
            errores.append(f"{quien}: nivel no válido '{o['nivel']}'")
        if o.get("modalidad", "") not in MODALIDADES:
            errores.append(f"{quien}: modalidad no válida '{o['modalidad']}'")
        f = o.get("fecha_limite", "")
        if f and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", f):
            errores.append(f"{quien}: fecha_limite debe ser AAAA-MM-DD")
        if o.get("enlace") and not str(o["enlace"]).startswith("https://"):
            errores.append(f"{quien}: el enlace debe empezar por https://")
        if not isinstance(o.get("apoyos_inclusion", False), bool):
            errores.append(f"{quien}: apoyos_inclusion debe ser true o false")
    if errores:
        print("Errores en data/ofertas.js:")
        for e in errores:
            print(" -", e)
        sys.exit(1)
    print(f"data/ofertas.js correcto: {len(ofertas)} entradas.")


if __name__ == "__main__":
    main()
