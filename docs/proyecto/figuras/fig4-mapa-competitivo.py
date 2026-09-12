#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Figura 4: mapa de posicionamiento competitivo de Alivia.

Ejes:
  X = amplitud de cobertura (cuantas areas de la vida atiende)
  Y = profundidad: contenido precargado y contexto colombiano
"""
# Rutas resueltas respecto de la ubicacion de este script, para que el
# generador funcione desde cualquier directorio de trabajo.
import pathlib as _pl
_RAIZ = _pl.Path(__file__).resolve().parents[3]
_FIG = _RAIZ / "docs" / "proyecto"
_DAT = _pl.Path(__file__).resolve().parent / "_datos"
_DAT.mkdir(exist_ok=True)
import xml.sax.saxutils as su

# id, etiqueta, x, y (0-100), tipo, (dx, dy, anclaje del rotulo)
PUNTOS = [
    ("gcal",  "Google Calendar y Keep", 56,  9, "gen", (0, 30, "middle")),
    ("anydo", "Any.do",                 69, 21, "gen", (0, -20, "middle")),
    ("tick",  "TickTick",               80, 11, "gen", (0, 30, "middle")),
    ("todo",  "Todoist",                89, 25, "gen", (0, -20, "middle")),
    ("notion","Notion",                 94,  6, "gen", (-8, 30, "end")),
    ("r5",    "R5",                     14, 87, "ver", (26, 6, "start")),
    ("aim",   "AIMEDIC",                10, 68, "ver", (26, 6, "start")),
    ("pet",   "Apps de carnet\nveterinario", 19, 46, "ver", (26, 0, "start")),
    ("aliv",  "ALIVIA",                 79, 84, "ali", (0, -26, "middle")),
]

# Se colocan en las esquinas libres de cada cuadrante para no chocar con los puntos.
CUADRANTES = [
    (0,  98, "Verticales colombianos", "Profundos pero estrechos:\ncubren un solo dominio", "start", 12, 4),
    (50, 96, "El espacio vacío", "Cobertura amplia con\ncontenido local precargado", "start", 12, 4),
    (0,  14, "Sin propuesta", "Ni amplitud ni contenido", "start", 12, 4),
    (50, 44, "Genéricos globales", "Amplios pero vacíos:\nel usuario aporta el contenido", "start", 12, 4),
]

W, H = 1240, 880
ML, MR, MT, MB = 132, 56, 92, 118          # margenes del area de trazado
PW, PH = W - ML - MR, H - MT - MB

AZUL, TERRA, DARK = "#3F7391", "#B0544A", "#2B3440"
GRIS, GRIS_T = "#9AA4AF", "#6B7580"
TINTE_OK = "#EFF6F1"
COL = {"gen": AZUL, "ver": TERRA, "ali": DARK}


def px(x): return ML + PW * x / 100.0
def py(y): return MT + PH * (1 - y / 100.0)


def out():
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
         f'viewBox="0 0 {W} {H}" role="img" '
         f'font-family="Segoe UI, Calibri, Helvetica, Arial, sans-serif">',
         '<title>Mapa de posicionamiento competitivo</title>',
         '<defs><marker id="fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" '
         f'markerHeight="8" orient="auto-start-reverse">'
         f'<path d="M 0 0 L 10 5 L 0 10 z" fill="{GRIS_T}"/></marker></defs>',
         f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>']

    # cuadrante superior derecho resaltado
    o.append(f'<rect x="{px(50):.1f}" y="{py(100):.1f}" width="{PW/2:.1f}" '
             f'height="{PH/2:.1f}" fill="{TINTE_OK}"/>')

    # rejilla suave
    for v in (25, 50, 75):
        o.append(f'<line x1="{px(v):.1f}" y1="{py(0):.1f}" x2="{px(v):.1f}" y2="{py(100):.1f}" '
                 f'stroke="#E8EBEE" stroke-width="1"/>')
        o.append(f'<line x1="{px(0):.1f}" y1="{py(v):.1f}" x2="{px(100):.1f}" y2="{py(v):.1f}" '
                 f'stroke="#E8EBEE" stroke-width="1"/>')
    # ejes medios
    o.append(f'<line x1="{px(50):.1f}" y1="{py(0):.1f}" x2="{px(50):.1f}" y2="{py(100):.1f}" '
             f'stroke="{GRIS}" stroke-width="1.4" stroke-dasharray="5 4"/>')
    o.append(f'<line x1="{px(0):.1f}" y1="{py(50):.1f}" x2="{px(100):.1f}" y2="{py(50):.1f}" '
             f'stroke="{GRIS}" stroke-width="1.4" stroke-dasharray="5 4"/>')
    # marco
    o.append(f'<rect x="{px(0):.1f}" y="{py(100):.1f}" width="{PW:.1f}" height="{PH:.1f}" '
             f'fill="none" stroke="{GRIS}" stroke-width="1.6"/>')

    # rotulos de cuadrante
    for cx, cy, titulo, sub, anc, dx, dy in CUADRANTES:
        x, y = px(cx) + dx, py(cy) + dy
        o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="13.5" font-weight="700" '
                 f'fill="{GRIS_T}" text-anchor="{anc}" letter-spacing="0.4">'
                 f'{su.escape(titulo.upper())}</text>')
        for i, ln in enumerate(sub.split("\n")):
            o.append(f'<text x="{x:.1f}" y="{y + 19 + i*15:.1f}" font-size="12" '
                     f'fill="{GRIS}" text-anchor="{anc}">{su.escape(ln)}</text>')

    # ejes con flecha
    o.append(f'<line x1="{ML-46:.1f}" y1="{py(0):.1f}" x2="{ML-46:.1f}" y2="{py(100)-14:.1f}" '
             f'stroke="{GRIS_T}" stroke-width="1.8" marker-end="url(#fl)"/>')
    o.append(f'<line x1="{px(0):.1f}" y1="{H-MB+52:.1f}" x2="{px(100)+14:.1f}" y2="{H-MB+52:.1f}" '
             f'stroke="{GRIS_T}" stroke-width="1.8" marker-end="url(#fl)"/>')

    # titulos de eje
    ycx = MT + PH / 2
    o.append(f'<text transform="translate({ML-62:.1f},{ycx:.1f}) rotate(-90)" font-size="13.5" '
             f'font-weight="700" fill="{DARK}" text-anchor="middle" letter-spacing="0.4">'
             f'PROFUNDIDAD DE CONTENIDO LOCAL</text>')
    o.append(f'<text transform="translate({ML-80:.1f},{ycx:.1f}) rotate(-90)" font-size="11.5" '
             f'fill="{GRIS}" text-anchor="middle">Contenedor vacío  →  obligaciones colombianas precargadas</text>')
    o.append(f'<text x="{ML + PW/2:.1f}" y="{H-MB+78:.1f}" font-size="13.5" font-weight="700" '
             f'fill="{DARK}" text-anchor="middle" letter-spacing="0.4">'
             f'AMPLITUD DE COBERTURA</text>')
    o.append(f'<text x="{ML + PW/2:.1f}" y="{H-MB+97:.1f}" font-size="11.5" fill="{GRIS}" '
             f'text-anchor="middle">Un solo dominio  →  las siete áreas de la vida adulta</text>')

    # puntos
    for pid, label, x, y, tipo, (dx, dy, anc) in PUNTOS:
        cx, cy = px(x), py(y)
        col = COL[tipo]
        if tipo == "ali":
            o.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="19" fill="{col}" opacity="0.14"/>')
            o.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="10" fill="{col}" '
                     f'stroke="#FFFFFF" stroke-width="2.5"/>')
        else:
            o.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="7" fill="{col}" '
                     f'stroke="#FFFFFF" stroke-width="2"/>')
        fs = 15 if tipo == "ali" else 12.5
        fw = "700" if tipo == "ali" else "600"
        for i, ln in enumerate(label.split("\n")):
            o.append(f'<text x="{cx+dx:.1f}" y="{cy+dy+i*15:.1f}" font-size="{fs}" '
                     f'font-weight="{fw}" fill="{col}" text-anchor="{anc}">{su.escape(ln)}</text>')

    # leyenda
    lx, ly = ML, 46
    for i, (col, txt) in enumerate([(AZUL, "Genéricos globales"),
                                    (TERRA, "Verticales colombianos"),
                                    (DARK, "Este proyecto")]):
        o.append(f'<circle cx="{lx + i*220:.1f}" cy="{ly-4:.1f}" r="6" fill="{col}"/>')
        o.append(f'<text x="{lx + i*220 + 14:.1f}" y="{ly:.1f}" font-size="12.5" '
                 f'fill="{GRIS_T}">{su.escape(txt)}</text>')

    o.append('</svg>')
    return "\n".join(o)


base = str(_FIG) + "/"
open(base + "figura-4-mapa-competitivo.svg", "w", encoding="utf-8").write(out())
print(f"OK  lienzo {W} x {H}  puntos={len(PUNTOS)}")
# comprobacion de solapamiento entre puntos
for i in range(len(PUNTOS)):
    for j in range(i + 1, len(PUNTOS)):
        a, b = PUNTOS[i], PUNTOS[j]
        d = ((px(a[2]) - px(b[2]))**2 + (py(a[3]) - py(b[3]))**2) ** 0.5
        if d < 46:
            print(f"  AVISO puntos proximos: {a[1]} / {b[1]}  ({d:.0f} px)")
print("comprobacion de solapamiento terminada")
