# Alivia — Gestión de Proyectos (UPB)

Base de conocimiento del proyecto **Alivia**, una plataforma de gestión unificada de recordatorios para la vida adulta en Colombia, desarrollada como trabajo final de la materia Gestión de Proyectos (Formulación y Evaluación de Proyectos), UPB.

Este repositorio contiene **documentación**, no código. El software se construye desde cero según el alcance definido en [`docs/proyecto/alcance-tecnico.md`](docs/proyecto/alcance-tecnico.md); el prototipo previo se descartó por decisión del equipo y permanece únicamente en el historial de git.

---

## Estructura

```
docs/
├── proyecto/          Definición del proyecto: qué es Alivia y qué se va a construir
├── entregables/       Entregas evaluables del curso, una carpeta por entrega
└── material-clase/    Transcripciones de las clases + sus presentaciones originales
assets/
└── marca/             Logotipos e identidad visual
```

### `docs/proyecto/`

| Archivo | Contenido |
|---|---|
| `alcance-tecnico.md` | **Documento de referencia.** Qué se construye, qué no, y las consecuencias aceptadas de construir desde cero |
| `catalogo-obligaciones.md` | Las obligaciones recurrentes colombianas con sus plazos. Es el diferenciador del producto y está sin validar |
| `arbol-problemas-objetivos.html` | Árbol de problemas, de objetivos y alternativas de solución |
| `analisis-riesgos.html` | Marco teórico y matriz de riesgos |

Los dos HTML son autocontenidos: se abren directo en el navegador, sin compilar nada.

### `docs/entregables/`

Una carpeta por entrega. Cada una guarda la guía oficial de la docente junto al trabajo del equipo, para que el criterio de evaluación y la respuesta vivan juntos.

- `entrega-1/` — Perfil del proyecto: guía, documento en HTML y Word, cronograma y requisitos
- `entrega-2/` — Estudio de mercado, ingeniería detallada y evaluación financiera *(solo la guía por ahora)*

### `docs/material-clase/`

Transcripciones de las presentaciones de clase, numeradas según el orden del curso. Cada archivo documenta un mazo completo con su procedencia, su contenido fiel y las inconsistencias detectadas. Las presentaciones originales están en `originales/`, con el mismo prefijo numérico que su transcripción.

> Las transcripciones 07 y 08 no tienen su `.pptx` en `originales/`: el archivo fuente de la 08 pesa 144 MB —el 93 % es un vídeo embebido— y no debe versionarse sin Git LFS.

---

## Convención de nombres

- **Minúsculas y `kebab-case`.** Sin espacios, sin tildes, sin `ñ`. Los nombres viajan por URLs, terminales y sistemas de archivos distintos; los caracteres especiales se rompen en el camino.
- **Prefijo numérico solo donde hay secuencia real.** El material de clase lo lleva porque el orden de las clases es información. El resto no lo lleva porque no la hay.
- **El nombre describe el contenido, no su formato ni su versión.** `perfil-proyecto.html`, no `entrega1-alivia-final-v2.html`.
- **Un archivo y su fuente comparten prefijo.** `04-problem-analysis-tree-method.md` ↔ `originales/04-identificacion-de-problemas.pptx`.

> **Inconsistencia conocida:** los archivos de `material-clase/` tienen nombre en inglés y el resto del repositorio está en español. Se conservaron así para no romper referencias existentes. Renombrarlos es una decisión pendiente del equipo.

---

## Estado del proyecto

| Frente | Estado |
|---|---|
| Entrega 1 — Perfil del proyecto | Entregada |
| Alcance técnico | Definido, pendiente de aprobación del equipo |
| Software | **Sin iniciar.** Construcción desde cero |
| Trabajo de campo (200 encuestas, 10 entrevistas) | **Sin iniciar.** Bloquea el estudio de mercado de la Entrega 2 |
| Catálogo de obligaciones | Borrador de 45 entradas, ninguna con fuente normativa verificada |
| Entrega 2 | Pendiente |

**Riesgos abiertos**, detallados en el alcance técnico §8:

1. El cronograma de 114 días hábiles se dimensionó contando con una base de software existente. Al construir desde cero hay que reestimarlo.
2. La prueba piloto con 50 usuarios no es ejecutable hasta que las notificaciones funcionen.
3. El precio de USD 9,99 no tiene sustento sin datos de disposición a pagar, y el análisis del entorno ya lo señaló como la amenaza más crítica del proyecto.
