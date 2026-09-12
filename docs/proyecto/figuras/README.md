# Generadores de las figuras

Cada figura del perfil se produce por programa a partir de un cálculo o de una
estructura de datos declarada, no se dibuja a mano. Los `.svg` de
`docs/proyecto/` son la salida; estos scripts son la fuente.

## Cómo regenerar

Desde cualquier directorio, con Python 3 y sin dependencias externas:

```bash
python3 docs/proyecto/figuras/cronograma.py        # primero: recalcula el CSV y el CPM
python3 docs/proyecto/figuras/fig2-3-arboles.py
python3 docs/proyecto/figuras/fig4-mapa-competitivo.py
python3 docs/proyecto/figuras/fig5-diagrama-proceso.py
python3 docs/proyecto/figuras/fig6-blueprint-servicio.py
python3 docs/proyecto/figuras/fig7-8-gantt-pert.py  # depende de cronograma.py
python3 docs/proyecto/figuras/fig9-mapa-riesgos.py
```

`cronograma.py` debe ejecutarse antes que `fig7-8-gantt-pert.py`: produce
`_datos/crono.json`, que es de donde el Gantt y la red PERT leen las fechas
tempranas, las tardías y las holguras.

## Qué genera cada uno

| Script | Salida | Sección |
|---|---|---|
| `cronograma.py` | `docs/entregables/entrega-1/cronograma.csv` y `_datos/crono.json` | 11 |
| `fig2-3-arboles.py` | Figuras 2 y 3 — árbol de problemas y de objetivos | 3 |
| `fig4-mapa-competitivo.py` | Figura 4 — mapa de posicionamiento | 7 |
| `fig5-diagrama-proceso.py` | Figura 5 — entradas, proceso y salidas | 10 |
| `fig6-blueprint-servicio.py` | Figura 6 — blueprint con línea de visibilidad | 10 |
| `fig7-8-gantt-pert.py` | Figuras 7 y 8 — Gantt y red PERT | 11 |
| `fig9-mapa-riesgos.py` | Figura 9 — mapa probabilidad-impacto | 12 |

## Convertir a PNG para insertar en Word

Los `.svg` se insertan directamente en Word 2016 o posterior. Si alguna versión
los rasteriza mal, se exportan a PNG con Chrome en modo headless:

```bash
google-chrome --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=<ancho>,<alto> \
  --screenshot=figura.png --default-background-color=FFFFFF \
  "file://$PWD/docs/proyecto/figura-N.svg"
```

El ancho y el alto los imprime cada script al ejecutarse. El factor de escala 2
da una resolución suficiente para impresión.

## Comprobaciones incorporadas

Los generadores no solo dibujan, verifican:

- `cronograma.py` recalcula la ruta crítica por CPM y **comprueba por asserción**
  que la renumeración de actividades no altera la duración del proyecto.
- `fig2-3-arboles.py` **comprueba por asserción** que las dos figuras son espejo
  exacto: mismo número de cajas, misma geometría y mismas aristas.
- `fig4-mapa-competitivo.py` avisa si dos competidores quedan a menos de 46 px,
  para detectar rótulos superpuestos.
- `fig9-mapa-riesgos.py` contrasta el nivel declarado de cada riesgo contra la
  regla de la matriz e informa de las discrepancias.

## Datos de partida

`_datos/cronograma-base.csv` es el cronograma original de la formulación, con
29 actividades y antes de los cambios de alcance. **No se modifica.**
`cronograma.py` lo lee, aplica las transformaciones documentadas en su cabecera
y escribe el cronograma vigente. Así el proceso es repetible y se puede auditar
qué cambió respecto del plan inicial.
