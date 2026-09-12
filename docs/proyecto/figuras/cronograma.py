#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Regenera cronograma.csv: quita la app movil, anade la curaduria del catalogo
y renumera de forma contigua por orden de inicio temprano."""
# Rutas resueltas respecto de la ubicacion de este script, para que el
# generador funcione desde cualquier directorio de trabajo.
import pathlib as _pl
_RAIZ = _pl.Path(__file__).resolve().parents[3]
_FIG = _RAIZ / "docs" / "proyecto"
_DAT = _pl.Path(__file__).resolve().parent / "_datos"
_DAT.mkdir(exist_ok=True)
import csv, io, copy, json

# Fuente: cronograma original de la formulacion, intacto. Nunca se sobrescribe.
SRC = str(_DAT / "cronograma-base.csv")
DST = str(_RAIZ / "docs/entregables/entrega-1/cronograma.csv")

rows = list(csv.DictReader(io.open(SRC, encoding='utf-8-sig'), delimiter=';'))
a = {r['Id'].strip(): dict(
        dur=int(r['Duración (días)']),
        pred=[p.strip() for p in (r['Predecesoras'] or '').split(',') if p.strip()],
        nom=r['Nombre de tarea'], resp=r['Responsable'], fase=r['Fase'])
     for r in rows}

# --- cambio 1: eliminar la aplicacion movil (fuera del alcance)
del a['22']
a['25']['pred'] = [p for p in a['25']['pred'] if p != '22']

# --- cambio 2: anadir la curaduria del catalogo
a['29'] = dict(dur=15, pred=['15'],
               nom='Curaduría y verificación normativa del catálogo de obligaciones',
               resp='Analista legal', fase='3. Diseño y desarrollo')
a['21']['pred'] = a['21']['pred'] + ['29']

# --- cambio 3: los responsables de desarrollo se mapean a los cuatro integrantes
RESP = {
    'Desarrollador backend': 'Líder técnico',
    'Desarrollador frontend': 'Director de proyecto',
    'Diseñador UX': 'Analista de mercado',
    'Analista legal': 'Analista legal y financiero',
}
for v in a.values():
    v['resp'] = RESP.get(v['resp'], v['resp'])

# --- cambio 4: el registro en el RNBD no es exigible (Decreto 090 de 2018)
a['26']['nom'] = ('Políticas de tratamiento de datos y verificación '
                  'del régimen de registro ante la SIC')


def cpm(x):
    ES, EF = {}, {}
    ch = True
    while ch:
        ch = False
        for k, v in x.items():
            if v['pred'] and any(p not in EF for p in v['pred']):
                continue
            es = max([EF[p] for p in v['pred']], default=0)
            if ES.get(k) != es:
                ES[k], EF[k] = es, es + v['dur']
                ch = True
    T = max(EF.values())
    succ = {k: [j for j, w in x.items() if k in w['pred']] for k in x}
    LF, LS = {}, {}
    ch = True
    while ch:
        ch = False
        for k, v in x.items():
            s = succ[k]
            if s and any(q not in LS for q in s):
                continue
            lf = min([LS[q] for q in s], default=T)
            if LF.get(k) != lf:
                LF[k], LS[k] = lf, lf - v['dur']
                ch = True
    return T, ES, EF, LS, LF


T, ES, EF, LS, LF = cpm(a)
orden = sorted(a, key=lambda k: (ES[k], int(k)))
mapa = {old: str(i + 1) for i, old in enumerate(orden)}

nuevo = {}
for old in orden:
    v = a[old]
    nuevo[mapa[old]] = dict(v, pred=sorted((mapa[p] for p in v['pred']), key=int))

T2, ES2, EF2, LS2, LF2 = cpm(nuevo)
assert T2 == T, "la renumeracion cambio la duracion"

with io.open(DST, 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.writer(f, delimiter=';')
    w.writerow(['Id', 'Nombre de tarea', 'Duración (días)', 'Predecesoras', 'Responsable',
                'Fase', 'Inicio (día)', 'Fin (día)', 'Holgura (días)', 'Ruta crítica'])
    for k in sorted(nuevo, key=int):
        v = nuevo[k]
        h = LF2[k] - EF2[k]
        w.writerow([k, v['nom'], v['dur'], ','.join(v['pred']), v['resp'], v['fase'],
                    ES2[k], EF2[k], h, 'Sí' if h == 0 else 'No'])

crit = [k for k in nuevo if LF2[k] - EF2[k] == 0]
print(f"Duración: {T2} días hábiles")
print(f"Actividades: {len(nuevo)}  ·  críticas: {len(crit)}")
print(f"Ruta crítica: {' → '.join(sorted(crit, key=int))}")
print("\nRenumeraciones:")
for o, n in sorted(mapa.items(), key=lambda t: int(t[1])):
    if o != n:
        print(f"   {o:>2} -> {n:>2}   {a[o]['nom'][:56]}")

json.dump({'act': {k: dict(nuevo[k], ES=ES2[k], EF=EF2[k], LS=LS2[k], LF=LF2[k],
                           holg=LF2[k]-EF2[k]) for k in nuevo}, 'T': T2},
          open(str(_DAT / "crono.json"), 'w'),
          ensure_ascii=False)
print("\ndatos guardados en crono.json")
