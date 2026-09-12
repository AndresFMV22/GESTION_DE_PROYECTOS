# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este repo

Base de conocimiento de la materia **Gestión de Proyectos (UPB, semestre 6)** y del proyecto que se formula en ella: **Alivia**, una plataforma de recordatorios de obligaciones de la vida adulta en Colombia.

**Aquí no hay código de producto.** Lo único ejecutable son los generadores de figuras en `docs/proyecto/figuras/`. La estructura y la convención de nombres están en `README.md`.

Todo está en español: documentación, mensajes de commit y, cuando exista, el código y los textos de UI. Mantenerlo así.

## Antes de trabajar, leer esto

Dos documentos mandan sobre cualquier otra fuente:

- **`docs/proyecto/alcance-tecnico.md`** — qué se construye y qué no.
- **`docs/entregables/entrega-1/revision.md`** — qué se decidió, qué se verificó contra su fuente y qué sigue abierto. Es lo primero que hay que leer para retomar el trabajo.

Puntos no negociables del alcance:

- **Criterio único de aceptación:** el aviso llega antes del vencimiento, no después.
- El catálogo de obligaciones es información administrable del sistema, nunca una constante en el código del cliente.
- La verificación de acceso a módulos de pago ocurre en el servidor.
- La base de datos se aprovisiona en **Estados Unidos**, no en Brasil: la Circular Externa 005 de 2017 de la SIC incluye al primero entre los países con nivel adecuado de protección de datos y no al segundo.
- Ninguna acción destruye información del usuario sin confirmación.
- La app móvil está fuera del alcance de esta etapa.

## El prototipo fue descartado

Existió una implementación previa (`GENERAL/backend`, `GENERAL/web`, `GENERAL/mobile`) con Express, React y Expo sobre Supabase. **Se eliminó del working tree por decisión del equipo**, documentada en `alcance-tecnico.md` §3: el modelo de información no soportaba el catálogo administrable, la suscripción con vigencia ni el aislamiento de datos que el producto exige.

Sigue en el historial de git (último commit con el código: `c6109f3`). Si hace falta consultarlo:

```bash
git show c6109f3:GENERAL/backend/src/controllers/reminderController.js
```

**No restaurarlo ni reutilizarlo sin decisión explícita del usuario.** Lo que valía la pena ya se rescató como documentación: el catálogo en `docs/proyecto/catalogo-obligaciones.md`, el modelo conceptual en su §5, y los defectos que lo hacían fallar convertidos en requisitos en `alcance-tecnico.md` §4.1.

## Trabajar con las figuras

Las nueve figuras del perfil se **generan por programa**, no se dibujan. Los scripts están en `docs/proyecto/figuras/` y su README explica el orden de ejecución y cómo exportar a PNG.

Reglas al tocarlas:

- **Se versiona solo el `.svg`.** Nada de PNG ni de `.drawio` en el repo.
- **Editar el generador, no el SVG.** El SVG es salida.
- **Renderizar y mirar el resultado antes de darlo por bueno.** Varios defectos reales —flechas invertidas, rótulos superpuestos, bandas que tapan conectores— solo se ven al renderizar. Con `google-chrome --headless --screenshot` basta.
- `cronograma.py` se ejecuta antes que `fig7-8-gantt-pert.py`, y lee de `_datos/cronograma-base.csv`, que **no se modifica nunca**.

## Trabajar con los documentos

Los HTML de `docs/proyecto/` son autocontenidos, sin build. El de los árboles lleva un aviso de obsolescencia en su parte de diagramas.

Las transcripciones de `docs/material-clase/` siguen un formato fijo de ocho secciones (`§1` procedencia y método … `§8` resumen ejecutivo). Si se agrega una nueva, seguir ese formato: extracción del OOXML, auditoría de seguridad, y una `§7` que declare qué es cita literal, qué es reconstrucción y qué no se pudo verificar. Varias contienen advertencias que importan: la 08 documenta un error aritmético del material de clase (declara 18 días de duración donde sus propios datos dan 15).

No inventar comandos de build, test ni lint: fuera de los generadores, no hay nada que ejecutar.

## Cómo se verifica aquí

El trabajo de esta base de conocimiento se sostiene en comprobar, no en suponer. Al añadir o revisar contenido:

- **Ir a la fuente primaria.** En la revisión de la Entrega 1, la prensa daba 83.000 profesionales de brecha digital y el MinTIC 85.000; dos precios de competidores tomados de blogs estaban mal; y un dato normativo sobre la revisión técnico-mecánica era falso y se había propagado a tres secciones.
- **Declarar lo que no se verificó.** Cada documento lleva su lista. No presentar como comprobado lo que se leyó en un resumen de búsqueda.
- **Recalcular los números citados.** Las cifras de CAGR, las multas en SMDLV y la ruta crítica se recomputaron; varias no cuadraban con lo declarado.

## Estado que conviene tener presente

- La **Entrega 1 está redactada pero sin entregar**. Bloquean dos cosas: los nombres de los cuatro integrantes y la fecha de inicio del proyecto, que hace falta para poner el eje del Gantt en fechas de calendario.
- El **trabajo de campo** (200 encuestas, 10 entrevistas, piloto de 50 usuarios) **no se ha hecho**. Bloquea el estudio de mercado de la Entrega 2, el precio y la validación del catálogo.
- El **precio de USD 9,99 no tiene sustento**, y el argumento que lo apoyaba —el ahorro en multas de tránsito— dejó de servir: ese aviso ya lo da gratis R5.
- La **competencia real es local**. R5 cubre el módulo vehicular gratis y con integración al RUNT. El terreno defendible es la cobertura de siete dominios, no el conocimiento local.
- El **cronograma son 114 días hábiles**, que son ~23 semanas y **no caben en un semestre**. Es plan de ejecución del proyecto, no calendario académico.
- La **capacidad instalada tope es de 100 usuarios activos**, limitada por el nivel gratuito del proveedor de correo.
