#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Figuras 2 y 3: arbol de problemas y arbol de objetivos de Alivia.

Las dos figuras son espejo exacto: mismo numero de cajas, misma geometria y
mismas aristas. Solo cambian los textos, los rotulos de banda y la paleta de
la mitad superior. La simetria se comprueba por asercion al final.
"""
import pathlib as _pl
import xml.sax.saxutils as su

_RAIZ = _pl.Path(__file__).resolve().parents[3]
_FIG = _RAIZ / "docs" / "proyecto"

PROBLEMAS = dict(
    slug="figura-2-arbol-problemas",
    titulo="Arbol de problemas",
    bandas=["Efectos indirectos", "Efectos directos", "Problema central",
            "Causas directas", "Causas raíz"],
    arriba2=[
        "Pérdidas económicas por multas, recargos e intereses de mora",
        "Deterioro de las relaciones familiares y laborales",
        "Deterioro de la salud mental: estrés crónico y ansiedad",
    ],
    arriba1=[
        "Incumplimiento de obligaciones legales y tributarias, y pérdida de descuentos por pronto pago",
        "Incumplimiento de compromisos familiares y laborales",
        "Desorganización y tensión sostenida en la rutina diaria",
    ],
    centro=("Los adultos entre 25 y 55 años residentes en Colombia "
            "olvidan con frecuencia obligaciones recurrentes de la vida cotidiana"),
    abajo1=[
        "Sobrecarga cognitiva por gestionar en paralelo varios dominios de responsabilidad",
        "Dispersión de la información en herramientas no integradas",
        "Desconocimiento de los ciclos de vencimiento de cada obligación",
    ],
    abajo2=[
        "Diversidad de áreas de vida que un adulto administra simultáneamente",
        "Dependencia de la memoria individual como único mecanismo de control",
        "Uso de notas sueltas, capturas de pantalla y aplicaciones sin conexión entre sí",
        "Herramientas disponibles diseñadas para contextos distintos al colombiano",
        "Los plazos legales y tributarios varían por norma, tipo de bien y municipio",
        "Ausencia de un criterio para distinguir lo urgente con consecuencia de lo deseable",
    ],
    color_arriba=("#B0544A", "#F6E3E0", "#EDC9C2", "#6E2A22"),
)

OBJETIVOS = dict(
    slug="figura-3-arbol-objetivos",
    titulo="Arbol de objetivos",
    bandas=["Fines indirectos", "Fines directos", "Objetivo central",
            "Medios directos", "Medios raíz"],
    arriba2=[
        "Ahorro económico por multas, recargos e intereses evitados",
        "Relaciones familiares y laborales menos tensionadas",
        "Mejor salud mental: menor estrés y ansiedad",
    ],
    arriba1=[
        "Cumplimiento puntual de obligaciones legales y tributarias, y acceso a descuentos por pronto pago",
        "Cumplimiento de compromisos familiares y laborales",
        "Rutina diaria organizada y con menor tensión",
    ],
    centro=("Los adultos entre 25 y 55 años residentes en Colombia "
            "recuerdan y cumplen a tiempo sus obligaciones recurrentes"),
    abajo1=[
        "Reducción de la carga cognitiva mediante delegación en un sistema externo",
        "Centralización de la información en una sola plataforma",
        "Conocimiento de los ciclos de vencimiento incorporado en el sistema",
    ],
    abajo2=[
        "Cobertura de todas las áreas de vida en módulos diferenciados",
        "Aviso automático que sustituye a la memoria como mecanismo de control",
        "Punto único de consulta que reemplaza notas y aplicaciones dispersas",
        "Diseño adaptado a la normatividad y a los plazos colombianos",
        "Catálogo curado de obligaciones con su periodicidad y su fuente normativa",
        "Priorización explícita por consecuencia legal o económica",
    ],
    color_arriba=("#4A8A62", "#E3F1E8", "#C9E4D4", "#1E5136"),
)

LEFT, DIAG_X, DIAG_W = 24, 150, 1560
RAIZ_W, RAIZ_GAP = 245, 18
WIDE_W, CENTRAL_W = 400, 1000
ROW_GAP, PAD_Y, LH = 56, 13, 16.5
FS, FS_C = 12.5, 15.5
AZUL, AZUL_D, AZUL_C, AZUL_T = "#3F7391", "#CFDDE9", "#E6EEF5", "#1D3D52"
CEN_BG, CEN_TX = "#2B3440", "#FFFFFF"
GRIS = "#7C8794"


def wrap(text, width_px, fs):
    maxc = max(8, int((width_px - 24) / (fs * 0.505)))
    lines, cur = [], ""
    for w in text.split():
        cand = f"{cur} {w}".strip()
        if len(cand) <= maxc:
            cur = cand
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def row_height(items, w, fs):
    return max(56, PAD_Y * 2 + LH * max(len(wrap(t, w, fs)) for t in items))


def alturas_comunes(specs):
    """Altura de cada banda = la mayor entre las dos figuras.

    Sin esto salen con distinta altura porque el texto envuelve en distinto
    numero de lineas, y dejan de ser espejo exacto.
    """
    filas = []
    for campo, w, fs in [("arriba2", WIDE_W, FS), ("arriba1", WIDE_W, FS),
                         ("centro", CENTRAL_W, FS_C), ("abajo1", WIDE_W, FS),
                         ("abajo2", RAIZ_W, FS)]:
        alto = 0
        for s in specs:
            items = s[campo] if isinstance(s[campo], list) else [s[campo]]
            alto = max(alto, row_height(items, w, fs))
        filas.append(alto)
    return filas


H_FILA = alturas_comunes([PROBLEMAS, OBJETIVOS])


def build(spec):
    tint, sup2_fill, sup1_fill, sup_text = spec["color_arriba"]
    pal = {"a2": (sup2_fill, tint, sup_text), "a1": (sup1_fill, tint, sup_text),
           "cen": (CEN_BG, CEN_BG, CEN_TX), "b1": (AZUL_D, AZUL, AZUL_T),
           "b2": (AZUL_C, AZUL, AZUL_T)}
    raiz_x = [DIAG_X + i * (RAIZ_W + RAIZ_GAP) for i in range(6)]
    raiz_cx = [x + RAIZ_W / 2 for x in raiz_x]
    pair_cx = [(raiz_cx[2 * i] + raiz_cx[2 * i + 1]) / 2 for i in range(3)]
    diag_cx = DIAG_X + DIAG_W / 2
    h = H_FILA
    y = [46]
    for k in range(4):
        y.append(y[k] + h[k] + ROW_GAP)
    W, H = DIAG_X + DIAG_W + 30, y[4] + h[4] + 40

    boxes = []
    for i, t in enumerate(spec["arriba2"]):
        boxes.append((f"a2_{i}", pair_cx[i] - WIDE_W / 2, y[0], WIDE_W, h[0], t, "a2", FS))
    for i, t in enumerate(spec["arriba1"]):
        boxes.append((f"a1_{i}", pair_cx[i] - WIDE_W / 2, y[1], WIDE_W, h[1], t, "a1", FS))
    boxes.append(("cen", diag_cx - CENTRAL_W / 2, y[2], CENTRAL_W, h[2],
                  spec["centro"], "cen", FS_C))
    for i, t in enumerate(spec["abajo1"]):
        boxes.append((f"b1_{i}", pair_cx[i] - WIDE_W / 2, y[3], WIDE_W, h[3], t, "b1", FS))
    for i, t in enumerate(spec["abajo2"]):
        boxes.append((f"b2_{i}", raiz_x[i], y[4], RAIZ_W, h[4], t, "b2", FS))

    edges = [(f"b2_{i}", f"b1_{i // 2}") for i in range(6)]
    edges += [(f"b1_{i}", "cen") for i in range(3)]
    edges += [("cen", f"a1_{i}") for i in range(3)]
    edges += [(f"a1_{i}", f"a2_{i}") for i in range(3)]
    rows = list(zip(spec["bandas"], y, h, [tint, tint, CEN_BG, AZUL, AZUL]))
    return boxes, edges, rows, W, H, pal


def svg_out(spec):
    boxes, edges, rows, W, H, pal = build(spec)
    BX = {b[0]: b for b in boxes}
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
         f'viewBox="0 0 {W} {H}" role="img" '
         f'font-family="Segoe UI, Calibri, Helvetica, Arial, sans-serif">',
         f'<title>{su.escape(spec["titulo"])}</title>',
         '<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" '
         f'markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" '
         f'fill="{GRIS}"/></marker></defs>',
         f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>']

    for label, yy, hh, col in rows:
        o.append(f'<text x="{LEFT}" y="{yy + hh/2 + 4:.1f}" font-size="10.5" '
                 f'font-weight="700" fill="{col}" letter-spacing="0.9">'
                 f'{su.escape(label.upper())}</text>')

    def anchor(bid, other_cx):
        x, w = BX[bid][1], BX[bid][3]
        if bid != "cen":
            return x + w / 2
        return min(max(other_cx, x + 26), x + w - 26)

    for a, b in edges:
        top, bot = (a, b) if BX[a][2] < BX[b][2] else (b, a)
        x1 = anchor(bot, BX[top][1] + BX[top][3] / 2)
        y1 = BX[bot][2]
        x2 = anchor(top, BX[bot][1] + BX[bot][3] / 2)
        y2 = BX[top][2] + BX[top][4]
        mid = (y1 + y2) / 2
        o.append(f'<path d="M {x1:.1f} {y1:.1f} L {x1:.1f} {mid:.1f} L {x2:.1f} {mid:.1f} '
                 f'L {x2:.1f} {y2:.1f}" fill="none" stroke="{GRIS}" stroke-width="1.6" '
                 f'marker-end="url(#ar)"/>')

    for bid, x, yy, w, hh, text, pt, fs in boxes:
        fill, stroke, tcol = pal[pt]
        weight = "700" if pt == "cen" else "400"
        o.append(f'<rect x="{x:.1f}" y="{yy:.1f}" width="{w:.1f}" height="{hh:.1f}" rx="7" '
                 f'fill="{fill}" stroke="{stroke}" stroke-width="1.7"/>')
        lines = wrap(text, w, fs)
        start = yy + hh / 2 - (len(lines) - 1) * LH / 2 + fs * 0.35
        for k, ln in enumerate(lines):
            o.append(f'<text x="{x + w/2:.1f}" y="{start + k*LH:.1f}" font-size="{fs}" '
                     f'font-weight="{weight}" fill="{tcol}" text-anchor="middle">'
                     f'{su.escape(ln)}</text>')
    o.append('</svg>')
    return "\n".join(o)


for spec in (PROBLEMAS, OBJETIVOS):
    (_FIG / (spec["slug"] + ".svg")).write_text(svg_out(spec), encoding="utf-8")
    b, e, r, W, H, _ = build(spec)
    print(f"{spec['slug']:32s} {W} x {H:.0f}  cajas={len(b)} aristas={len(e)}")

bp, ep, *_ = build(PROBLEMAS)
bo, eo, *_ = build(OBJETIVOS)
assert len(bp) == len(bo) and len(ep) == len(eo), "las figuras no son simetricas"
assert [x[1:5] for x in bp] == [x[1:5] for x in bo], "la geometria no coincide"
print("simetria verificada: misma geometria, mismas cajas, mismas aristas")
