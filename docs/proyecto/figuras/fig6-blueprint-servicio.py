#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Figura 6: blueprint del servicio de Alivia, con linea de visibilidad."""
# Rutas resueltas respecto de la ubicacion de este script, para que el
# generador funcione desde cualquier directorio de trabajo.
import pathlib as _pl
_RAIZ = _pl.Path(__file__).resolve().parents[3]
_FIG = _RAIZ / "docs" / "proyecto"
_DAT = _pl.Path(__file__).resolve().parent / "_datos"
_DAT.mkdir(exist_ok=True)
import xml.sax.saxutils as su

ETAPAS = [
    ("Descubrimiento", False),
    ("Registro", False),
    ("Configuración inicial", True),
    ("Uso recurrente", True),
    ("Conversión", False),
    ("Soporte", False),
]

USUARIO = [
    "Encuentra la propuesta de valor",
    "Crea la cuenta y autoriza el tratamiento de sus datos",
    "Elige módulos y declara sus fechas base",
    "Recibe el aviso y marca la obligación como cumplida",
    "Activa un módulo de pago",
    "Consulta o ejerce derechos sobre sus datos",
]
VISIBLE = [
    "Página de inicio con la propuesta de valor",
    "Formulario de registro y aviso de privacidad",
    "Catálogo del módulo con sus periodicidades",
    "Aviso por correo y panel de obligaciones próximas",
    "Pasarela de pago en modo de pruebas",
    "Canal de atención al titular",
]
TRASTIENDA = [
    None,
    "Creación del usuario y registro de la autorización como evidencia",
    "Instanciación de recordatorios y cálculo de fechas de vencimiento",
    "Evaluación diaria de la ventana de anticipación, envío del aviso, "
    "registro del resultado y reprogramación del ciclo",
    "Verificación de la suscripción vigente en el servidor",
    "Trazabilidad de la solicitud y plazos de respuesta",
]

LBL_W, COL_W, COL_GAP = 172, 228, 11
PADX, PADY, LH = 12, 11, 15.5
FS, FS_H = 11.8, 12.5
TOP = 104

AZUL, U_BG, V_BG, TXT_AZ = "#3F7391", "#E6EEF5", "#CFDDE9", "#1D3D52"
DARK, T_BG = "#2B3440", "#EDF0F3"
GRIS, ORO = "#7C8794", "#B8860B"


def wrap(t, w, fs):
    maxc = max(8, int((w - 2 * PADX) / (fs * 0.505)))
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


def lane_h(items):
    n = max(len(wrap(t, COL_W, FS)) for t in items if t)
    return max(58, PADY * 2 + LH * n)


h_u, h_v, h_t = lane_h(USUARIO), lane_h(VISIBLE), lane_h(TRASTIENDA)
SEP = 34                       # espacio para cada linea rotulada
y_u = TOP
y_v = y_u + h_u + SEP
y_t = y_v + h_v + SEP
H = y_t + h_t + 46
W = LBL_W + 6 * COL_W + 5 * COL_GAP + 34

cx = [LBL_W + i * (COL_W + COL_GAP) for i in range(6)]


def emit():
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
         f'viewBox="0 0 {W} {H}" role="img" '
         f'font-family="Segoe UI, Calibri, Helvetica, Arial, sans-serif">',
         '<title>Blueprint del servicio</title>',
         f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>']

    # cabeceras de etapa
    for i, (nombre, mv) in enumerate(ETAPAS):
        x = cx[i]
        o.append(f'<rect x="{x:.0f}" y="{TOP-52}" width="{COL_W}" height="40" rx="6" '
                 f'fill="{DARK if mv else "#F4F6F8"}" stroke="{DARK if mv else GRIS}" '
                 f'stroke-width="1.5"/>')
        tc = "#FFFFFF" if mv else DARK
        lines = wrap(nombre, COL_W, FS_H)
        sy = TOP - 52 + 20 - (len(lines) - 1) * 7 + 4
        for k, ln in enumerate(lines):
            o.append(f'<text x="{x + COL_W/2:.0f}" y="{sy + k*14:.0f}" font-size="{FS_H}" '
                     f'font-weight="700" fill="{tc}" text-anchor="middle">'
                     f'{su.escape(str(i+1))}. {su.escape(ln)}</text>' if k == 0 else
                     f'<text x="{x + COL_W/2:.0f}" y="{sy + k*14:.0f}" font-size="{FS_H}" '
                     f'font-weight="700" fill="{tc}" text-anchor="middle">{su.escape(ln)}</text>')
        if mv:
            o.append(f'<text x="{x + COL_W/2:.0f}" y="{TOP-60}" font-size="10.5" '
                     f'font-weight="700" fill="{ORO}" text-anchor="middle" '
                     f'letter-spacing="0.6">★ MOMENTO DE VERDAD</text>')

    def carril(y, h, items, bg, st, tc, etiqueta, lblcol):
        o.append(f'<text x="{LBL_W-16}" y="{y + h/2 - 6:.0f}" font-size="11.5" '
                 f'font-weight="700" fill="{lblcol}" text-anchor="end" '
                 f'letter-spacing="0.5">{su.escape(etiqueta[0])}</text>')
        if len(etiqueta) > 1:
            o.append(f'<text x="{LBL_W-16}" y="{y + h/2 + 10:.0f}" font-size="11.5" '
                     f'font-weight="700" fill="{lblcol}" text-anchor="end" '
                     f'letter-spacing="0.5">{su.escape(etiqueta[1])}</text>')
        for i, t in enumerate(items):
            x = cx[i]
            if t is None:
                o.append(f'<rect x="{x:.0f}" y="{y:.0f}" width="{COL_W}" height="{h:.0f}" '
                         f'rx="7" fill="none" stroke="{GRIS}" stroke-width="1.2" '
                         f'stroke-dasharray="4 5"/>')
                o.append(f'<text x="{x + COL_W/2:.0f}" y="{y + h/2 + 4:.0f}" font-size="11" '
                         f'fill="{GRIS}" text-anchor="middle" font-style="italic">'
                         f'sin actividad</text>')
                continue
            o.append(f'<rect x="{x:.0f}" y="{y:.0f}" width="{COL_W}" height="{h:.0f}" rx="7" '
                     f'fill="{bg}" stroke="{st}" stroke-width="1.5"/>')
            lines = wrap(t, COL_W, FS)
            sy = y + h / 2 - (len(lines) - 1) * LH / 2 + FS * 0.35
            for k, ln in enumerate(lines):
                o.append(f'<text x="{x + COL_W/2:.0f}" y="{sy + k*LH:.0f}" font-size="{FS}" '
                         f'fill="{tc}" text-anchor="middle">{su.escape(ln)}</text>')

    carril(y_u, h_u, USUARIO, U_BG, AZUL, TXT_AZ, ["ACCIONES", "DEL USUARIO"], AZUL)
    carril(y_v, h_v, VISIBLE, V_BG, AZUL, TXT_AZ, ["LO QUE EL", "USUARIO VE"], AZUL)
    carril(y_t, h_t, TRASTIENDA, T_BG, DARK, DARK, ["TRASTIENDA", "DEL SISTEMA"], DARK)

    x0, x1 = LBL_W, W - 34

    def linea(y, txt, color, dash, wgt):
        o.append(f'<line x1="{x0}" y1="{y:.0f}" x2="{x1}" y2="{y:.0f}" stroke="{color}" '
                 f'stroke-width="{wgt}"' + (f' stroke-dasharray="{dash}"' if dash else '') + '/>')
        tw = len(txt) * 6.2 + 34
        o.append(f'<rect x="{x0+16}" y="{y-9:.0f}" width="{tw:.0f}" height="18" rx="9" '
                 f'fill="#FFFFFF"/>')
        o.append(f'<text x="{x0+16+tw/2:.0f}" y="{y+4:.0f}" font-size="10.5" '
                 f'font-weight="700" fill="{color}" text-anchor="middle" '
                 f'letter-spacing="0.7">{su.escape(txt)}</text>')

    linea(y_u + h_u + SEP / 2, "LÍNEA DE INTERACCIÓN", GRIS, "6 5", 1.4)
    linea(y_v + h_v + SEP / 2, "LÍNEA DE VISIBILIDAD", DARK, None, 2.4)

    o.append('</svg>')
    return "\n".join(o)


base = str(_FIG) + "/"
open(base + "figura-6-blueprint-servicio.svg", "w", encoding="utf-8").write(emit())
print(f"OK  lienzo {W} x {H}")
print(f"    carriles: usuario={h_u} visible={h_v} trastienda={h_t}")
