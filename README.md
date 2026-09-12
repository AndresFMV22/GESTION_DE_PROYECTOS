# Alivia — Gestión de Proyectos (UPB)

Base de conocimiento del proyecto **Alivia**, una plataforma de gestión unificada de recordatorios para la vida adulta en Colombia, desarrollada como trabajo final de la materia Gestión de Proyectos (Formulación y Evaluación de Proyectos), UPB.

Este repositorio contiene **documentación**, no código. El software se construye desde cero según el alcance definido en [`docs/proyecto/alcance-tecnico.md`](docs/proyecto/alcance-tecnico.md); el prototipo previo se descartó por decisión del equipo y permanece únicamente en el historial de git.

---

## Estructura

```
docs/
├── proyecto/          Definición del proyecto, figuras y generadores
│   └── figuras/       Scripts que producen los SVG y el cronograma
├── entregables/       Entregas evaluables del curso, una carpeta por entrega
└── material-clase/    Transcripciones de las clases + sus presentaciones originales
assets/
└── marca/             Logotipos e identidad visual
```

### `docs/proyecto/`

| Archivo | Contenido |
|---|---|
| `alcance-tecnico.md` | **Documento de referencia.** Qué se construye, qué no, y las consecuencias aceptadas de construir desde cero |
| `catalogo-obligaciones.md` | Las obligaciones recurrentes colombianas con sus plazos y la prioridad de curaduría. Es el diferenciador del producto y está sin validar |
| `figura-*.svg` | Las nueve figuras del perfil. Se regeneran con los scripts de `figuras/` |
| `figuras/` | Generadores en Python, sin dependencias. Ver su [README](docs/proyecto/figuras/README.md) |
| `arbol-problemas-objetivos.html` | Análisis de alternativas y marco conceptual. **Sus árboles están obsoletos**, sustituidos por las figuras 2 y 3 |
| `analisis-riesgos.html` | Marco teórico de riesgos |

Los HTML son autocontenidos: se abren directo en el navegador, sin compilar nada.

### `docs/entregables/`

Una carpeta por entrega, con la guía oficial de la docente junto al trabajo del equipo.

- **`entrega-1/`** — Perfil del proyecto. Contiene el documento en Word, la guía, el cronograma, los requisitos extraídos de la guía y [`revision.md`](docs/entregables/entrega-1/revision.md), que registra las decisiones, los hallazgos verificados y lo que queda pendiente.
- **`entrega-2/`** — Estudio de mercado, ingeniería detallada y evaluación financiera *(solo la guía por ahora)*.

> **Empieza por `entrega-1/revision.md`** si retomas el trabajo. Es el único sitio donde está consolidado qué se decidió y por qué.

### `docs/material-clase/`

Transcripciones de las presentaciones de clase, numeradas según el orden del curso. Cada archivo documenta un mazo completo con su procedencia, su contenido fiel y las inconsistencias detectadas. Las presentaciones originales están en `originales/`, con el mismo prefijo numérico.

> Las transcripciones 07 y 08 no tienen su `.pptx` en `originales/`: el archivo fuente de la 08 pesa 144 MB —el 93 % es un vídeo embebido— y no debe versionarse sin Git LFS.

---

## Convención de nombres

- **Minúsculas y `kebab-case`.** Sin espacios, sin tildes, sin `ñ`.
- **Prefijo numérico solo donde hay secuencia real.** El material de clase y las figuras lo llevan porque el orden es información. El resto no.
- **El nombre describe el contenido, no su formato ni su versión.** `perfil-proyecto.html`, no `entrega1-alivia-final-v2.html`.
- **Un archivo y su fuente comparten prefijo.** `04-problem-analysis-tree-method.md` ↔ `originales/04-identificacion-de-problemas.pptx`.
- **Las figuras se versionan solo en `.svg`.** Los PNG se generan cuando hacen falta; ver el README de `figuras/`.

> **Inconsistencia conocida:** los archivos de `material-clase/` tienen nombre en inglés y el resto del repositorio está en español. Renombrarlos es una decisión pendiente del equipo.

---

## Estado del proyecto

| Frente | Estado |
|---|---|
| Entrega 1 — Perfil del proyecto | **Redactada, sin entregar.** Faltan los integrantes y la fecha de inicio |
| Alcance técnico | Definido, actualizado tras la revisión de la Entrega 1 |
| Software | **Sin iniciar.** Construcción desde cero |
| Trabajo de campo (200 encuestas, 10 entrevistas) | **Sin iniciar.** Bloquea el estudio de mercado de la Entrega 2 |
| Catálogo de obligaciones | Borrador de 45 entradas, ninguna con fuente normativa verificada |
| Entrega 2 | Pendiente |

**Riesgos abiertos**, detallados en `entrega-1/revision.md`:

1. **La competencia real es local y gratuita.** R5 cubre el módulo vehicular con integración al RUNT y más de 41.000 calificaciones. El terreno defendible del proyecto es la cobertura de siete dominios, no el conocimiento local.
2. **El precio no tiene sustento** y el argumento que lo apoyaba —el ahorro en multas de tránsito— dejó de servir, porque ese aviso ya es gratuito.
3. **El trabajo de campo no se ha hecho**, y de él dependen el precio, la validación del catálogo y la prueba piloto.
4. **La capacidad instalada tope es de 100 usuarios activos**, limitada por el nivel gratuito del proveedor de correo.
