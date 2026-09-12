#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Figura 9: mapa de riesgos del proyecto en el plano probabilidad-impacto."""
# Rutas resueltas respecto de la ubicacion de este script, para que el
# generador funcione desde cualquier directorio de trabajo.
import pathlib as _pl
_RAIZ = _pl.Path(__file__).resolve().parents[3]
_FIG = _RAIZ / "docs" / "proyecto"
_DAT = _pl.Path(__file__).resolve().parent / "_datos"
_DAT.mkdir(exist_ok=True)
import xml.sax.saxutils as su

# n, etiqueta corta, probabilidad, impacto, nivel declarado en la Tabla 22
RIESGOS = [
    (1, "Fuga o tratamiento indebido de datos personales", "Baja",  "Muy alto", "Crítico"),
    (2, "Precio no competitivo o disposición a pagar insuficiente", "Alta", "Alto", "Alto"),
    (3, "Un vertical colombiano amplía su cobertura", "Alta",  "Alto",  "Alto"),
    (4, "Baja adopción o abandono en el piloto", "Media", "Alto",  "Alto"),
    (5, "Retraso del cronograma por dedicación parcial", "Alta",  "Medio", "Alto"),
    (6, "Un competidor global incorpora plantillas locales", "Baja", "Alto", "Medio"),
    (7, "Dependencia de un solo proveedor extranjero", "Media", "Medio", "Medio"),
    (8, "Desactualización del catálogo ante cambios normativos", "Media", "Medio", "Medio"),
    (9, "Variación de la tasa de cambio", "Media", "Bajo",  "Bajo"),
]

PROB = ["Alta", "Media", "Baja"]                     # de arriba abajo
IMP = ["Bajo", "Medio", "Alto", "Muy alto"]          # de izquierda a derecha
VP = {"Baja": 1, "Media": 2, "Alta": 3}
VI = {"Bajo": 1, "Medio": 2, "Alto": 3, "Muy alto": 4}


def nivel(p, i):
    """Regla declarada: impacto Muy alto escala a Crítico sea cual sea la
    probabilidad; en lo demás manda el producto probabilidad x impacto."""
    if i == "Muy alto":
        return "Crítico"
    s = VP[p] * VI[i]
    if s >= 9:
        return "Crítico"
    if s == 6:
        return "Alto"
    if s >= 3:
        return "Medio"
    return "Bajo"


COLOR = {
    "Bajo":    ("#E9F2EC", "#4A8A62", "#1E5136"),
    "Medio":   ("#FBF0D9", "#B8860B", "#6B4E05"),
    "Alto":    ("#F8E1D8", "#C4703F", "#7A3E17"),
    "Crítico": ("#F2D3CE", "#B0544A", "#6E2A22"),
}
DARK, GRIS = "#2B3440", "#7C8794"

LBL, CW, CH = 132, 244, 142
TOP, LEFT = 104, 132
W = LEFT + 4 * CW + 34
H = TOP + 3 * CH + 132
FS = 11.2


def wrap(t, w, fs):
    maxc = max(8, int((w - 26) / (fs * 0.505)))
    lines, cur = [], ""
    for word in t.split():
        cand = f"{cur} {word}".strip()
        if len(cand) <= maxc:
            cur = cand
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


celda = {}
for n, txt, p, i, decl in RIESGOS:
    celda.setdefault((p, i), []).append((n, txt, decl))

o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
     f'viewBox="0 0 {W} {H}" role="img" '
     f'font-family="Segoe UI, Calibri, Helvetica, Arial, sans-serif">',
     '<title>Mapa de riesgos</title>',
     f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>']

# cabeceras de impacto
for ci, imp in enumerate(IMP):
    x = LEFT + ci * CW
    o.append(f'<text x="{x + CW/2:.0f}" y="{TOP-22}" font-size="12" font-weight="700" '
             f'fill="{DARK}" text-anchor="middle" letter-spacing="0.5">'
             f'{su.escape(imp.upper())}</text>')
o.append(f'<text x="{LEFT + 2*CW:.0f}" y="{TOP + 3*CH + 44}" font-size="12.5" '
         f'font-weight="700" fill="{DARK}" text-anchor="middle" letter-spacing="0.6">'
         f'IMPACTO</text>')
o.append(f'<text transform="translate(38,{TOP + 1.5*CH:.0f}) rotate(-90)" font-size="12.5" '
         f'font-weight="700" fill="{DARK}" text-anchor="middle" letter-spacing="0.6">'
         f'PROBABILIDAD</text>')

# celdas
for ri, p in enumerate(PROB):
    y = TOP + ri * CH
    o.append(f'<text x="{LEFT-18}" y="{y + CH/2 + 4:.0f}" font-size="12" font-weight="700" '
             f'fill="{DARK}" text-anchor="end" letter-spacing="0.5">'
             f'{su.escape(p.upper())}</text>')
    for ci, i in enumerate(IMP):
        x = LEFT + ci * CW
        lv = nivel(p, i)
        bg, st, tc = COLOR[lv]
        o.append(f'<rect x="{x}" y="{y}" width="{CW}" height="{CH}" fill="{bg}" '
                 f'stroke="#FFFFFF" stroke-width="3"/>')
        o.append(f'<text x="{x+10}" y="{y+18}" font-size="9.5" font-weight="700" '
                 f'fill="{st}" opacity="0.7" letter-spacing="0.5">'
                 f'{su.escape(lv.upper())}</text>')
        items = celda.get((p, i), [])
        cy = y + CH / 2 - (len(items) * 52 - 10) / 2
        for n, txt, decl in items:
            o.append(f'<rect x="{x+12}" y="{cy:.0f}" width="{CW-24}" height="44" rx="8" '
                     f'fill="#FFFFFF" stroke="{st}" stroke-width="1.7"/>')
            o.append(f'<circle cx="{x+31}" cy="{cy+22:.0f}" r="13" fill="{st}"/>')
            o.append(f'<text x="{x+31}" y="{cy+27:.0f}" font-size="14" font-weight="700" '
                     f'fill="#FFFFFF" text-anchor="middle">{n}</text>')
            ln = wrap(txt, CW - 66, 9.6)[:3]
            sy = cy + 22 - (len(ln) - 1) * 5.6 + 3
            for k, l in enumerate(ln):
                o.append(f'<text x="{x+50}" y="{sy + k*11.2:.0f}" font-size="9.6" '
                         f'fill="{tc}">{su.escape(l)}</text>')
            cy += 52

# leyenda de niveles
ly = TOP + 3 * CH + 78
for k, lv in enumerate(["Bajo", "Medio", "Alto", "Crítico"]):
    bg, st, tc = COLOR[lv]
    x = LEFT + k * 150
    o.append(f'<rect x="{x}" y="{ly-11}" width="22" height="14" rx="3" fill="{bg}" '
             f'stroke="{st}" stroke-width="1.6"/>')
    o.append(f'<text x="{x+29}" y="{ly}" font-size="10.8" fill="{GRIS}">'
             f'{su.escape(lv)}</text>')
o.append(f'<text x="{W-34}" y="{ly}" font-size="10.5" fill="{GRIS}" text-anchor="end">'
         f'Impacto muy alto escala a Crítico · en lo demás, probabilidad × impacto</text>')
o.append('</svg>')

BASE = str(_FIG) + "/"
open(BASE + "figura-9-mapa-riesgos.svg", "w", encoding="utf-8").write("\n".join(o))
print(f"OK  lienzo {W} x {H}")
print("\nContraste entre el nivel declarado y la regla:")
cam = 0
for n, txt, p, i, decl in RIESGOS:
    calc = nivel(p, i)
    marca = "  <-- CAMBIA" if calc != decl else ""
    if calc != decl:
        cam += 1
    print(f"  {n}. {p:>5} / {i:<9} declarado={decl:<8} regla={calc:<8}{marca}")
print(f"\n{cam} riesgos cambian de nivel")
