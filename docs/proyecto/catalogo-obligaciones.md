# Catálogo de obligaciones recurrentes

**Estado:** borrador sin validar — ver §1
**Origen:** rescatado del prototipo descartado (`web/src/data/templates.js`), donde vivía como constante del código
**Destino:** este contenido alimenta el catálogo administrable descrito en el alcance técnico §5.2

---

## 1. Advertencia sobre este documento

Este catálogo se conserva porque es **investigación de dominio, no software**: son los plazos de las obligaciones colombianas, y volver a averiguarlos cuesta trabajo aunque el código que los contenía se haya descartado.

Dicho eso, **el catálogo no está validado**. Se construyó con el criterio del equipo, no con trabajo de campo, y ninguna de sus 45 entradas tiene todavía la fuente normativa que el proyecto se comprometió a documentar. Este archivo es el punto de partida de esa curaduría, no su resultado.

Dos problemas visibles a simple vista:

- **Hay tareas domésticas mezcladas con obligaciones.** «Lavado y aspirado cada 14 días» o «revisar pendientes cada 7 días» no son obligaciones olvidables con consecuencia: son rutinas. Diluyen el argumento que sostiene el producto.
- **Algunos intervalos son dudosos.** «Revisar pico y placa cada 7 días» no describe un vencimiento sino una restricción rotativa; no encaja en el modelo de recordatorio recurrente.

---

## 2. Clasificación propuesta

El alcance técnico exige que cada entrada declare si es una **obligación con sanción** o una **tarea recomendada**. Esa distinción es la que permite separar el producto de lo que lo acompaña.

| Tipo | Definición | Peso en el producto |
|---|---|---|
| **Obligación** | Tiene fecha límite y una consecuencia legal o económica por incumplir | Es el producto |
| **Recomendada** | Conviene hacerla con cierta periodicidad, pero no hay sanción | Acompaña |

---

## 3. Obligaciones con consecuencia

Estas son las que sostienen la propuesta de valor. **Prioridad alta de curaduría.**

| Obligación | Módulo | Intervalo | Consecuencia de incumplir | Fuente normativa |
|---|---|---|---|---|
| Renovar SOAT | Vehículo | 365 d | Comparendo de 30 SMDLV (≈ $1.750.890 en 2026) | Ley 769 de 2002 — **verificar artículo** |
| Revisión tecnomecánica | Vehículo | 365 d | Comparendo de 15 SMDLV (≈ $875.460 en 2026) | Ley 769 de 2002 — **verificar artículo** |
| Declaración de renta | Finanzas | 365 d | Sanción por extemporaneidad e intereses de mora | **Pendiente** — Estatuto Tributario, calendario DIAN |
| Impuesto predial | Hogar | 365 d | Intereses de mora; el plazo y el descuento por pronto pago varían por municipio | **Pendiente** — acuerdo municipal aplicable |
| Pago de tarjeta de crédito | Finanzas | 30 d | Intereses de mora y reporte a centrales de riesgo | **Pendiente** — contrato con la entidad |
| Pago de servicios públicos | Finanzas | 30 d | Suspensión del servicio y costo de reconexión | **Pendiente** — Ley 142 de 1994 |
| Matrícula escolar | Familia | 365 d | Pérdida del cupo | **Pendiente** — calendario de cada institución |
| Vacunación antirrábica de mascotas | Mascotas | 365 d | Obligatoria en Colombia | **Pendiente** — verificar norma nacional y distrital |

> **Ninguna de estas fuentes está verificada.** Las dos primeras tienen respaldo parcial en la Entrega 1 (cálculo de las multas sobre el salario mínimo de 2026), pero el artículo específico no se comprobó. Verificarlas es trabajo pendiente y es lo que le da valor al catálogo.

---

## 4. Tareas recomendadas

Sin sanción asociada. Útiles, pero no son el argumento del producto.

### Vehículo

| Tarea | Intervalo |
|---|---|
| Cambio de aceite y filtro | 180 d |
| Revisión de frenos | 180 d |
| Rotación de llantas | 180 d |
| Cambio de llantas | 730 d |
| Revisión de luces | 90 d |
| Cambio de batería | 1.095 d |
| Lavado y aspirado | 14 d — *candidata a eliminar* |
| Revisar pico y placa | 7 d — *candidata a eliminar: no es un vencimiento* |

### Hogar

| Tarea | Intervalo |
|---|---|
| Revisar refrigeradora | 180 d |
| Revisión del calentador | 180 d |
| Cambio de focos | 365 d |
| Cambio de baterías de dispositivos | 365 d |
| Mantenimiento general | 180 d |
| Limpieza del tanque de agua | 365 d |
| Revisión de instalación de gas | 365 d — *posible obligación: verificar si la revisión periódica es exigible* |

### Salud

| Tarea | Intervalo |
|---|---|
| Chequeo médico general | 365 d |
| Consulta odontológica | 180 d |
| Examen de vista | 365 d |
| Exámenes de laboratorio de control | 180 d |
| Vacunación anual | 365 d |
| Donación de sangre | 90 d |

### Finanzas

| Tarea | Intervalo |
|---|---|
| Revisar extractos bancarios | 30 d |
| Ahorro mensual | 30 d |

### Familia

| Tarea | Intervalo |
|---|---|
| Cumpleaños familiar | 365 d |
| Aniversario | 365 d |
| Reunión de padres | 90 d |
| Día del padre / de la madre | 365 d |
| Navidad y fin de año | 365 d |
| Semana Santa | 365 d |

### Mascotas

| Tarea | Intervalo |
|---|---|
| Vacuna polivalente | 365 d |
| Desparasitación | 90 d |
| Chequeo veterinario | 180 d |
| Compra de alimento | 30 d |
| Baño y peluquería | 45 d |

### General

| Tarea | Intervalo |
|---|---|
| Revisar pendientes | 7 d — *candidata a eliminar* |
| Planificar la semana | 7 d — *candidata a eliminar* |
| Revisión mensual de metas | 30 d — *candidata a eliminar* |

---

## 5. Modelo conceptual del dominio

Se conserva del prototipo por ser correcto, independientemente del código que lo implementaba.

**Módulos** (7) — Áreas de vida. Cada uno es gratuito o de pago.
**Categorías** — Agrupación dentro de un módulo (SOAT, Tecnomecánica, Frenos…). El prototipo definía 25.
**Obligación del catálogo** — Plantilla: nombre, descripción, módulo, categoría, intervalo en días, fuente normativa, tipo (obligación o recomendada).
**Recordatorio del usuario** — Instancia de una obligación para una persona concreta, con su fecha base, su fecha de vencimiento calculada, su anticipación de aviso y su estado de cumplimiento.
**Registro de avisos** — Evidencia de cada notificación emitida, con su resultado real.

Los siete módulos y su plan están definidos en el alcance técnico §4.3. Conviene recordar que la definición inicial de base de datos del prototipo tenía invertidos los planes de Familia y General respecto del modelo de negocio: es un error a no repetir.

---

## 6. Trabajo pendiente sobre este catálogo

1. Verificar la fuente normativa de las ocho obligaciones de §3 y registrar el artículo exacto.
2. Decidir qué tareas de §4 se conservan y cuáles se eliminan por no aportar al criterio de aceptación.
3. Validar el listado con el trabajo de campo previsto en el objetivo específico 1 (200 encuestas, 10 entrevistas) para saber cuáles se olvidan de verdad.
4. Completar hasta al menos 40 entradas verificadas, que es la meta comprometida en el alcance.
