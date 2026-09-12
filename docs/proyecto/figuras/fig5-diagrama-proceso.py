#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Figura 5: diagrama de proceso entradas - proceso - salidas de Alivia."""
# Rutas resueltas respecto de la ubicacion de este script, para que el
# generador funcione desde cualquier directorio de trabajo.
import pathlib as _pl
_RAIZ = _pl.Path(__file__).resolve().parents[3]
_FIG = _RAIZ / "docs" / "proyecto"
_DAT = _pl.Path(__file__).resolve().parent / "_datos"
_DAT.mkdir(exist_ok=True)
import xml.sax.saxutils as su

ENTRADAS = [
    "Datos de registro del usuario",
    "Selección de módulos activos",
    "Catálogo curado de obligaciones con su periodicidad",
    "Fechas base declaradas por el usuario",
    "Preferencias de anticipación y frecuencia de aviso",
    "Marco normativo vigente",
]
PASOS = [
    "Autenticación y creación de la sesión",
    "Activación de módulos según el plan contratado",
    "Creación de recordatorios a partir del catálogo",
    "Cálculo de la fecha de vencimiento según el intervalo",
    "Priorización por consecuencia legal o económica",
    "Evaluación diaria de los vencimientos que caen dentro de la ventana de anticipación",
    "Emisión del aviso y registro de su resultado real",
    "Reprogramación del ciclo al marcar la obligación como cumplida",
]
SALIDAS = [
    "Panel de obligaciones vigentes y próximas",
    "Aviso entregado antes del vencimiento",
    "Historial de cumplimiento del usuario",
    "Registro de avisos con su resultado de entrega",
    "Obligaciones cumplidas a tiempo y sanciones evitadas",
    "Indicadores de uso para la Entrega 2",
]

AZUL, AZUL_BG = "#3F7391", "#E6EEF5"
VERDE, VERDE_BG = "#4A8A62", "#E3F1E8"
DARK, DARK_BG = "#2B3440", "#EEF1F4"
GRIS = "#7C8794"

COL_W, MID_W = 320, 700
GAP = 62
PADX, PADY, LH = 14, 12, 16.0
FS, FS_H = 12.5, 13.5
TOP = 96


def wrap(text, w, fs):
    maxc = max(8, int((w - 2 * PADX) / (fs * 0.505)))
    lines, cur = [], ""
    for word in text.split():
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


def box_h(text, w, fs):
    return max(52, PADY * 2 + LH * len(wrap(text, w, fs)))


x_ent = 40
x_mid = x_ent + COL_W + GAP
x_sal = x_mid + MID_W + GAP
W = x_sal + COL_W + 40

# columnas laterales
h_ent = [box_h(t, COL_W, FS) for t in ENTRADAS]
h_sal = [box_h(t, COL_W, FS) for t in SALIDAS]
VG = 12
tot_ent = sum(h_ent) + VG * (len(h_ent) - 1)
tot_sal = sum(h_sal) + VG * (len(h_sal) - 1)

# pasos: 2 columnas x 4 filas dentro del contenedor
SW = (MID_W - 3 * 22) // 2
h_pasos = [box_h(t, SW, FS) for t in PASOS]
fila_h = [max(h_pasos[2 * i], h_pasos[2 * i + 1]) for i in range(4)]
MID_HEAD = 46
tot_mid = MID_HEAD + 18 + sum(fila_h) + VG * 3 + 20

CONT_H = max(tot_ent, tot_sal, tot_mid)
H = TOP + CONT_H + 60


def col(items, heights, x, total):
    """Devuelve posiciones y centradas verticalmente en el contenedor."""
    y = TOP + (CONT_H - total) / 2
    out = []
    for t, h in zip(items, heights):
        out.append((x, y, COL_W, h, t))
        y += h + VG
    return out


ent = col(ENTRADAS, h_ent, x_ent, tot_ent)
sal = col(SALIDAS, h_sal, x_sal, tot_sal)


def emit():
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
         f'viewBox="0 0 {W} {H}" role="img" '
         f'font-family="Segoe UI, Calibri, Helvetica, Arial, sans-serif">',
         '<title>Diagrama de proceso: entradas, proceso y salidas</title>',
         '<defs><marker id="fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" '
         f'markerHeight="7" orient="auto-start-reverse">'
         f'<path d="M 0 0 L 10 5 L 0 10 z" fill="{GRIS}"/></marker></defs>',
         f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>']

    def head(x, w, txt, color):
        o.append(f'<text x="{x + w/2:.1f}" y="{TOP - 26:.1f}" font-size="{FS_H}" '
                 f'font-weight="700" fill="{color}" text-anchor="middle" '
                 f'letter-spacing="1.1">{su.escape(txt)}</text>')

    head(x_ent, COL_W, "ENTRADAS", AZUL)
    head(x_mid, MID_W, "PROCESO", DARK)
    head(x_sal, COL_W, "SALIDAS", VERDE)

    def caja(x, y, w, h, txt, bg, st, tc, fs=FS, weight="400"):
        o.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="7" '
                 f'fill="{bg}" stroke="{st}" stroke-width="1.6"/>')
        lines = wrap(txt, w, fs)
        sy = y + h / 2 - (len(lines) - 1) * LH / 2 + fs * 0.35
        for i, ln in enumerate(lines):
            o.append(f'<text x="{x + w/2:.1f}" y="{sy + i*LH:.1f}" font-size="{fs}" '
                     f'font-weight="{weight}" fill="{tc}" text-anchor="middle">'
                     f'{su.escape(ln)}</text>')

    # contenedor del proceso
    cy = TOP + (CONT_H - tot_mid) / 2
    o.append(f'<rect x="{x_mid:.1f}" y="{cy:.1f}" width="{MID_W}" height="{tot_mid:.1f}" '
             f'rx="10" fill="{DARK_BG}" stroke="{DARK}" stroke-width="1.8"/>')
    o.append(f'<text x="{x_mid + MID_W/2:.1f}" y="{cy + 29:.1f}" font-size="12.5" '
             f'fill="{GRIS}" text-anchor="middle" font-style="italic">'
             f'Ocho pasos, del registro al cierre del ciclo</text>')

    # pasos numerados
    py = cy + MID_HEAD + 18
    for r in range(4):
        for c in range(2):
            i = 2 * r + c
            px = x_mid + 22 + c * (SW + 22)
            caja(px, py, SW, fila_h[r], PASOS[i], "#FFFFFF", DARK, DARK)
            o.append(f'<circle cx="{px + 13:.1f}" cy="{py + 13:.1f}" r="10.5" fill="{DARK}"/>')
            o.append(f'<text x="{px + 13:.1f}" y="{py + 17:.1f}" font-size="11" '
                     f'font-weight="700" fill="#FFFFFF" text-anchor="middle">{i+1}</text>')
        py += fila_h[r] + VG

    # cajas laterales
    for x, y, w, h, t in ent:
        caja(x, y, w, h, t, AZUL_BG, AZUL, "#1D3D52")
    for x, y, w, h, t in sal:
        caja(x, y, w, h, t, VERDE_BG, VERDE, "#1E5136")

    # flechas de agrupamiento
    bx1 = x_ent + COL_W + 16
    bx2 = x_mid - 16
    ymid = TOP + CONT_H / 2
    for x, y, w, h, t in ent:
        o.append(f'<path d="M {x+w+2:.1f} {y+h/2:.1f} L {bx1:.1f} {y+h/2:.1f} '
                 f'L {bx1:.1f} {ymid:.1f}" fill="none" stroke="{GRIS}" stroke-width="1.4"/>')
    o.append(f'<line x1="{bx1:.1f}" y1="{ymid:.1f}" x2="{x_mid-2:.1f}" y2="{ymid:.1f}" '
             f'stroke="{GRIS}" stroke-width="2" marker-end="url(#fl)"/>')

    bx3 = x_sal - 16
    o.append(f'<line x1="{x_mid+MID_W+2:.1f}" y1="{ymid:.1f}" x2="{bx3:.1f}" y2="{ymid:.1f}" '
             f'stroke="{GRIS}" stroke-width="2"/>')
    for x, y, w, h, t in sal:
        o.append(f'<path d="M {bx3:.1f} {ymid:.1f} L {bx3:.1f} {y+h/2:.1f} '
                 f'L {x-2:.1f} {y+h/2:.1f}" fill="none" stroke="{GRIS}" stroke-width="1.4" '
                 f'marker-end="url(#fl)"/>')

    o.append('</svg>')
    return "\n".join(o)


base = str(_FIG) + "/"
open(base + "figura-5-diagrama-proceso.svg", "w", encoding="utf-8").write(emit())
print(f"OK  lienzo {W} x {H:.0f}")
print(f"    entradas={len(ENTRADAS)} pasos={len(PASOS)} salidas={len(SALIDAS)}")
print(f"    alturas de columna: ent={tot_ent} proceso={tot_mid:.0f} sal={tot_sal}")
