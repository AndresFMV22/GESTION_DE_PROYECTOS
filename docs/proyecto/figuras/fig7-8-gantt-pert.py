#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Figuras 7 (Gantt) y 8 (red PERT) del cronograma de Alivia."""
# Rutas resueltas respecto de la ubicacion de este script, para que el
# generador funcione desde cualquier directorio de trabajo.
import pathlib as _pl
_RAIZ = _pl.Path(__file__).resolve().parents[3]
_FIG = _RAIZ / "docs" / "proyecto"
_DAT = _pl.Path(__file__).resolve().parent / "_datos"
_DAT.mkdir(exist_ok=True)
import json, xml.sax.saxutils as su

S = str(_DAT / "crono.json")
BASE = str(_FIG) + "/"
D = json.load(open(S))
A, T = D['act'], D['T']
IDS = sorted(A, key=int)

ROJO, ROJO_BG = "#B0544A", "#EDC9C2"
AZUL, AZUL_BG = "#3F7391", "#CFDDE9"
DARK, GRIS, GRIS_C = "#2B3440", "#7C8794", "#E8EBEE"

FASES = []
for k in IDS:
    f = A[k]['fase']
    if not FASES or FASES[-1][0] != f:
        FASES.append((f, []))
    FASES[-1][1].append(k)


# ------------------------------------------------------------------ GANTT
def gantt():
    LBL, TL = 500, 820
    RH, FH, TOP = 23, 27, 84
    filas = sum(len(v) + 1 for _, v in FASES)
    H = TOP + filas * RH + len(FASES) * (FH - RH) + 58
    W = LBL + TL + 130

    def x(d):
        return LBL + TL * d / T

    o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
         f'viewBox="0 0 {W} {H}" role="img" '
         f'font-family="Segoe UI, Calibri, Helvetica, Arial, sans-serif">',
         '<title>Diagrama de Gantt</title>',
         f'<defs><marker id="dep" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4.6" '
         f'markerHeight="4.6" orient="auto">'
         f'<path d="M 0 1.2 L 10 5 L 0 8.8 z" fill="context-stroke"/></marker></defs>',
         f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>']

    # eje
    for d in range(0, T + 1, 10):
        o.append(f'<line x1="{x(d):.1f}" y1="{TOP-16}" x2="{x(d):.1f}" y2="{H-42}" '
                 f'stroke="{GRIS_C}" stroke-width="1"/>')
        o.append(f'<text x="{x(d):.1f}" y="{TOP-22}" font-size="10" fill="{GRIS}" '
                 f'text-anchor="middle">{d}</text>')
    o.append(f'<text x="{LBL + TL/2:.0f}" y="{H-24}" font-size="11.5" fill="{GRIS}" '
             f'text-anchor="middle">Días hábiles desde el inicio del proyecto</text>')
    o.append(f'<text x="16" y="{TOP-22}" font-size="11.5" font-weight="700" fill="{DARK}">'
             f'ACTIVIDAD</text>')
    o.append(f'<text x="{LBL-172}" y="{TOP-22}" font-size="11.5" font-weight="700" '
             f'fill="{DARK}">RESPONSABLE</text>')

    fila_y = {}
    y = TOP
    for fase, ids in FASES:
        y += FH
        for k in ids:
            fila_y[k] = y + 10.5
            y += RH
    # bandas de fase primero, para que no tapen los conectores
    yy = TOP
    for fase, ids in FASES:
        o.append(f'<rect x="10" y="{yy:.0f}" width="{W-50}" height="{FH-4}" fill="#F1F4F6"/>')
        o.append(f'<text x="18" y="{yy+17:.0f}" font-size="11.5" font-weight="700" '
                 f'fill="{DARK}" letter-spacing="0.4">{su.escape(fase.upper())}</text>')
        yy += FH + len(ids) * RH

    # dependencias fin-inicio. Dos ruteos, segun haya hueco o no entre barras:
    #   - con hueco: codo por la derecha y entrada horizontal a la barra sucesora
    #   - sin hueco: bajada vertical y entrada por el borde superior o inferior
    BH = 7.5                                    # media altura de la barra
    for k in IDS:
        for p in A[k]['pred']:
            xa, ya = x(A[p]['EF']), fila_y[p]
            xb, yb = x(A[k]['ES']), fila_y[k]
            crit = A[k]['holg'] == 0 and A[p]['holg'] == 0
            col = ROJO if crit else GRIS
            op = "0.9" if crit else "0.5"
            baja = yb > ya
            if xb - xa >= 16:
                cod = xa + 8
                d = (f"M {xa:.1f} {ya:.1f} L {cod:.1f} {ya:.1f} "
                     f"L {cod:.1f} {yb:.1f} L {xb-6:.1f} {yb:.1f}")
            else:
                yin = yb - BH - 2 if baja else yb + BH + 2
                d = (f"M {xa:.1f} {ya:.1f} L {xb:.1f} {ya:.1f} "
                     f"L {xb:.1f} {yin:.1f}")
            o.append(f'<path d="{d}" fill="none" stroke="{col}" stroke-width="1.1" '
                     f'opacity="{op}" marker-end="url(#dep)"/>')

    y = TOP
    for fase, ids in FASES:
        y += FH
        for k in ids:
            v = A[k]
            crit = v['holg'] == 0
            nom = v['nom'][:52] + ('…' if len(v['nom']) > 52 else '')
            o.append(f'<text x="18" y="{y+15:.0f}" font-size="11" fill="{DARK}">'
                     f'{k}. {su.escape(nom)}</text>')
            o.append(f'<text x="{LBL-172}" y="{y+15:.0f}" font-size="10" fill="{GRIS}">'
                     f'{su.escape(v["resp"][:30])}</text>')
            # holgura
            if not crit:
                o.append(f'<rect x="{x(v["EF"]):.1f}" y="{y+6:.0f}" '
                         f'width="{x(v["EF"]+v["holg"])-x(v["EF"]):.1f}" height="9" rx="2" '
                         f'fill="{AZUL_BG}" opacity="0.75"/>')
            bw = max(3.0, x(v['EF']) - x(v['ES']))
            o.append(f'<rect x="{x(v["ES"]):.1f}" y="{y+3:.0f}" width="{bw:.1f}" height="15" '
                     f'rx="3" fill="{ROJO if crit else AZUL}"/>')
            if v['dur'] == 0:
                o.append(f'<path d="M {x(v["ES"]):.1f} {y+3} l 7 7.5 l -7 7.5 l -7 -7.5 z" '
                         f'fill="{DARK}"/>')
            y += RH
    # hitos de control al cierre de cada fase
    HITOS = [('11', 'Entrega 1'), ('16', 'Campo cerrado'), ('24', 'Producto construido'),
             ('27', 'Piloto cerrado'), ('28', 'Entrega 2')]
    for k, nom in HITOS:
        hx, hy = x(A[k]['EF']), fila_y[k]
        o.append(f'<path d="M {hx:.1f} {hy-9:.1f} l 8 9 l -8 9 l -8 -9 z" fill="{DARK}" '
                 f'stroke="#FFFFFF" stroke-width="1.4"/>')
        o.append(f'<text x="{hx+13:.1f}" y="{hy+3.5:.1f}" font-size="9.5" font-weight="700" '
                 f'fill="{DARK}">{su.escape(nom)}</text>')

    # leyenda
    lx = 16
    for i, (c, t) in enumerate([(ROJO, "Ruta crítica"), (AZUL, "Con holgura"),
                                (AZUL_BG, "Holgura disponible")]):
        o.append(f'<rect x="{lx + i*150:.0f}" y="{H-33}" width="22" height="11" rx="2" fill="{c}"/>')
        o.append(f'<text x="{lx + i*150 + 29:.0f}" y="{H-24}" font-size="10.5" '
                 f'fill="{GRIS}">{su.escape(t)}</text>')
    o.append(f'<path d="M {lx+458:.0f} {H-33} l 7 8 l -7 8 l -7 -8 z" fill="{DARK}"/>')
    o.append(f'<text x="{lx+472:.0f}" y="{H-24}" font-size="10.5" fill="{GRIS}">Hito de control</text>')
    o.append('</svg>')
    open(BASE + "figura-7-gantt.svg", "w", encoding="utf-8").write("\n".join(o))
    return W, H


# ------------------------------------------------------------------- PERT
def pert():
    rank = {}

    def r(k):
        if k not in rank:
            rank[k] = 0 if not A[k]['pred'] else 1 + max(r(p) for p in A[k]['pred'])
        return rank[k]
    for k in IDS:
        r(k)
    cols = {}
    for k in IDS:
        cols.setdefault(rank[k], []).append(k)
    ncol = max(cols) + 1
    CUT = 9                                   # primera banda: columnas 0..8

    NW, NH, CG, RG = 76, 62, 86, 32
    LEFT, TOP, BG = 34, 78, 92
    bandas = [list(range(0, CUT)), list(range(CUT - 1, ncol))]
    maxrow = max(len(v) for v in cols.values())
    bh = maxrow * NH + (maxrow - 1) * RG
    W = LEFT + max(len(b) for b in bandas) * (NW + CG) - CG + LEFT
    H = TOP + 2 * bh + BG + 84

    pos, banda = {}, {}
    for bi, band in enumerate(bandas):
        y0 = TOP + bi * (bh + BG)
        for ci, c in enumerate(band):
            ids = cols[c]
            oy = y0 + (bh - (len(ids) * NH + (len(ids) - 1) * RG)) / 2
            for j, k in enumerate(ids):
                p = (LEFT + ci * (NW + CG), oy + j * (NH + RG))
                if bi == 1 and c == CUT - 1:
                    pos.setdefault(k + "*", p)      # fantasma de enlace
                else:
                    pos[k] = p
                    banda[k] = bi

    o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
         f'viewBox="0 0 {W} {H}" role="img" '
         f'font-family="Segoe UI, Calibri, Helvetica, Arial, sans-serif">',
         '<title>Red PERT</title>',
         '<defs>'
         f'<marker id="a1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" '
         f'markerHeight="6" orient="auto-start-reverse">'
         f'<path d="M 0 0 L 10 5 L 0 10 z" fill="{GRIS}"/></marker>'
         f'<marker id="a2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" '
         f'markerHeight="6" orient="auto-start-reverse">'
         f'<path d="M 0 0 L 10 5 L 0 10 z" fill="{ROJO}"/></marker></defs>',
         f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>']

    for bi in range(2):
        y0 = TOP + bi * (bh + BG)
        o.append(f'<text x="{LEFT}" y="{y0-18}" font-size="11" font-weight="700" '
                 f'fill="{GRIS}" letter-spacing="0.6">'
                 f'{"NIVELES 1 A 9" if bi==0 else "NIVELES 9 A 17  (continúa)"}</text>')

    def P(k):
        return pos.get(k) or pos[k + "*"]

    # aristas
    for k in IDS:
        for p in A[k]['pred']:
            src = pos.get(p) or pos.get(p + "*")
            dst = pos.get(k) or pos.get(k + "*")
            if p + "*" in pos and k in pos:
                src = pos[p + "*"]
            elif p in pos and k in pos and rank[k] >= CUT and rank[p] == CUT - 1:
                src = pos[p + "*"]
            crit = A[k]['holg'] == 0 and A[p]['holg'] == 0
            x1, y1 = src[0] + NW, src[1] + NH / 2
            x2, y2 = dst[0], dst[1] + NH / 2
            mx = (x1 + x2) / 2
            col, mk, wd = (ROJO, "a2", 2.2) if crit else (GRIS, "a1", 1.3)
            salto = rank[k] - rank[p]
            if salto > 1:
                # carril de paso por debajo de la banda, para no cruzar nodos
                bi = banda.get(k, banda.get(p, 0))
                yl = TOP + bi * (bh + BG) + bh + 16
                o.append(f'<path d="M {x1:.0f} {y1:.0f} L {x1+16:.0f} {y1:.0f} '
                         f'L {x1+16:.0f} {yl:.0f} L {x2-20:.0f} {yl:.0f} '
                         f'L {x2-20:.0f} {y2:.0f} L {x2-3:.0f} {y2:.0f}" fill="none" '
                         f'stroke="{col}" stroke-width="{wd}" stroke-dasharray="7 4" '
                         f'opacity="0.8" marker-end="url(#{mk})"/>')
            else:
                o.append(f'<path d="M {x1:.0f} {y1:.0f} C {mx:.0f} {y1:.0f} {mx:.0f} {y2:.0f} '
                         f'{x2-3:.0f} {y2:.0f}" fill="none" stroke="{col}" stroke-width="{wd}" '
                         f'marker-end="url(#{mk})"/>')

    # nodos
    for key, (px, py) in pos.items():
        k = key.rstrip("*")
        ghost = key.endswith("*")
        v = A[k]
        crit = v['holg'] == 0
        fill = ROJO_BG if crit else AZUL_BG
        st = ROJO if crit else AZUL
        op = ' opacity="0.45"' if ghost else ''
        o.append(f'<rect x="{px:.0f}" y="{py:.0f}" width="{NW}" height="{NH}" rx="8" '
                 f'fill="{fill}" stroke="{st}" stroke-width="{2.2 if crit else 1.6}"{op}/>')
        o.append(f'<text x="{px+NW/2:.0f}" y="{py+27:.0f}" font-size="19" font-weight="700" '
                 f'fill="{ROJO if crit else AZUL}" text-anchor="middle"{op}>{k}</text>')
        o.append(f'<text x="{px+NW/2:.0f}" y="{py+43:.0f}" font-size="10.5" fill="{DARK}" '
                 f'text-anchor="middle"{op}>{v["dur"]} d</text>')
        o.append(f'<text x="{px+NW/2:.0f}" y="{py+55:.0f}" font-size="9.5" fill="{GRIS}" '
                 f'text-anchor="middle"{op}>h={v["holg"]}</text>')

    ly = H - 34
    for i, (c, t) in enumerate([(ROJO, "Actividad crítica (holgura = 0)"),
                                (AZUL, "Actividad con holgura")]):
        o.append(f'<rect x="{LEFT + i*290:.0f}" y="{ly-10}" width="20" height="13" rx="3" '
                 f'fill="{ROJO_BG if i==0 else AZUL_BG}" stroke="{c}" stroke-width="1.8"/>')
        o.append(f'<text x="{LEFT + i*290 + 27:.0f}" y="{ly}" font-size="10.5" '
                 f'fill="{GRIS}">{su.escape(t)}</text>')
    o.append(f'<path d="M {LEFT+560:.0f} {ly-5} l 30 0" stroke="{GRIS}" stroke-width="1.6" '
             f'stroke-dasharray="7 4"/>')
    o.append(f'<text x="{LEFT+597:.0f}" y="{ly}" font-size="10.5" fill="{GRIS}">'
             f'Precedencia que salta más de un nivel</text>')
    o.append(f'<text x="{W-LEFT}" y="{ly}" font-size="10.5" fill="{GRIS}" '
             f'text-anchor="end">d = duración en días hábiles · h = holgura total</text>')
    o.append('</svg>')
    open(BASE + "figura-8-red-pert.svg", "w", encoding="utf-8").write("\n".join(o))
    return W, H


wg, hg = gantt()
wp, hp = pert()
print(f"Gantt  {wg} x {hg}")
print(f"PERT   {wp} x {hp}")
