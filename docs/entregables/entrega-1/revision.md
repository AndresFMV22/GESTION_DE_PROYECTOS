# Revisión de la Entrega 1 — decisiones, hallazgos y pendientes

**Fecha de la revisión:** 11 de septiembre de 2026
**Alcance:** las doce secciones del perfil, revisadas una a una contra la guía oficial, la rúbrica y el material de clase.

Este documento **no contiene el texto del perfil** —ese vive en `perfil-proyecto.docx`—. Contiene lo que no queda registrado allí: qué se decidió, por qué, qué datos se verificaron contra su fuente, qué se corrigió y qué sigue abierto. Es lo que hace falta para retomar el trabajo o para sustentarlo ante el jurado.

---

## 1. Estado de la entrega

| Frente | Estado |
|---|---|
| Redacción de las 12 secciones | Completa |
| Figuras | 9, todas generadas por programa. Ver `docs/proyecto/figuras/` |
| Cronograma | Regenerado: 28 actividades, 114 días hábiles, 17 críticas |
| **Integrantes** | **Sin diligenciar.** Bloquea la entrega |
| **Fecha de inicio del proyecto** | **Sin fijar.** El eje del Gantt está en días hábiles, no en fechas |
| Trabajo de campo | Sin iniciar |

---

## 2. Decisiones tomadas

Cada una cambió el contenido de varias secciones. Se registran con su razón para poder defenderlas.

### 2.1 La aplicación móvil sale del alcance

El equipo son cuatro personas con dedicación parcial y el producto no está validado con usuarios. Sostener dos clientes en paralelo reparte el esfuerzo antes de saber si el producto sirve.

**Afecta a:** objetivo general y objetivo 4 (§4), alcance (§5), competencia (§7, se retiró React Native), ingeniería (§10), cronograma (§11, se eliminó la actividad de desarrollo móvil), conclusiones (§12).

### 2.2 El precio queda por definir en todo el documento

Antes el PESTEL hablaba de «el precio actual de USD 9,99» mientras otras tres secciones lo daban por definir. Ahora los USD 9,99 se nombran como la hipótesis inicial que el análisis del entorno **descarta**, y el precio se fija con disposición a pagar medida en campo.

**Afecta a:** §1, §3 (justificación económica), §6, §7, §12.

### 2.3 Se añade un objetivo específico para el catálogo

El catálogo curado es el diferenciador declarado del producto y un medio raíz del árbol de objetivos, pero no tenía objetivo propio ni tiempo asignado. Ahora es el objetivo específico 2 y la actividad 17 del cronograma, con 15 días.

**Consecuencia:** los objetivos pasaron de 7 a 8, y el que define el precio pasó de ser el 7 al 8.

### 2.4 Los 114 días hábiles son plan de ejecución, no calendario académico

114 días hábiles son unas 23 semanas; un semestre son 16 a 18. La restricción de tiempo de §5 decía que ambos eran equivalentes, lo cual es falso. Ahora se distingue: el trabajo académico cierra en el semestre, la ejecución completa tomaría 114 días hábiles desde su inicio efectivo.

### 2.5 El piloto mide retención a 14 días, no a 30

El piloto dura 10 días hábiles, que son 14 de calendario. Medir retención a 30 días era imposible. Extenderlo a 22 días hábiles habría llevado el proyecto a 126 días.

También se sustituyó la meta de «reducción ≥ 25% del incumplimiento autorreportado»: en dos semanas casi ninguna obligación anual vence, así que no hay incumplimiento observable. La métrica nueva es el porcentaje de avisos entregados que el usuario marca como cumplidos.

### 2.6 El terreno competitivo se reposiciona hacia la agregación

Ver §3.1 de este documento. La diferenciación deja de ser «conocemos los plazos colombianos» y pasa a ser «cubrimos siete dominios y los especialistas cubren uno».

---

## 3. Hallazgos verificados

Todos comprobados contra su fuente durante la revisión. Los que no se pudieron verificar están en la sección 6.

### 3.1 🔴 R5 ocupa gratis el módulo de mayor valor

**R5**, de Grupo R5, es una aplicación colombiana gratuita que avisa del vencimiento del SOAT, la revisión técnico-mecánica, la licencia de conducción y las multas. Se integra con el **RUNT** y con la Secretaría de Movilidad de Bogotá, de modo que trae las fechas sola. Tiene **4,9 sobre 5 con más de 41.000 calificaciones**.

Esto invalidó la afirmación de la matriz FODA de que «ningún competidor ofrece plantillas colombianas», y obligó a reposicionar la diferenciación del proyecto. R5 es vertical por modelo de negocio —vive de vender SOAT— y no tiene incentivo para cubrir hogar, salud o mascotas.

**En sentido contrario, es la mejor evidencia disponible de que el problema existe:** 41.000 personas calificaron una aplicación dedicada exclusivamente a no olvidar un trámite.

Se identificó también **AIMEDIC**, colombiana y gratuita, para el dominio salud, en fase de preinscripción. Y varias aplicaciones gratuitas de carnet veterinario con recordatorios, ninguna de origen colombiano verificado. **No se buscaron especialistas en finanzas ni en hogar.**

### 3.2 🔴 La revisión técnico-mecánica no se exige desde el segundo año en carros

El documento afirmaba que sí. Es falso: **en carros particulares la primera revisión es al quinto año** desde la matrícula; lo del segundo año aplica a **motocicletas**. Para 2026, los particulares matriculados entre 2022 y 2026 están exentos.

Importa porque es un error sobre el dominio en el que el proyecto reclama su ventaja. Aparecía en tres sitios: §2.1, §3.1 y el supuesto de §5. Se corrigió en los tres y se convirtió en argumento: si el propio equipo se equivocó en el plazo, eso demuestra que el desconocimiento de los ciclos es real.

**Consecuencia de producto:** la plantilla de tecnomecánica no puede ser un intervalo fijo de 365 días; necesita el tipo de vehículo y el año de matrícula.

### 3.3 🔴 El registro en el RNBD no es exigible a este proyecto

El **Decreto 090 de 2018** redujo el universo de obligados: solo deben inscribir sus bases de datos las sociedades y entidades sin ánimo de lucro con **activos totales superiores a 100.000 UVT**, más las personas jurídicas públicas. Con la UVT de 2026 en **$52.374** (Resolución 000238 de 2025 de la DIAN), el umbral son **$5.237 millones en activos**.

El documento lo trataba como trámite obligatorio en cuatro sitios. Las obligaciones sustantivas —autorización previa, política de tratamiento, atención de reclamos, estándar reforzado para datos sensibles— **sí aplican siempre**.

### 3.4 Estados Unidos sí, Brasil no: decisión de infraestructura

La **Circular Externa 005 de 2017** de la SIC lista los países con nivel adecuado de protección de datos. **Estados Unidos figura; Brasil no.**

De ahí sale una decisión que no es de precio ni de rendimiento sino jurídica: **la base de datos se aprovisiona en una región de Estados Unidos**, aunque São Paulo daría menor latencia. La circular añade que incluso hacia países de la lista hay que demostrar medidas apropiadas de seguridad.

### 3.5 Exclusión de IVA sobre computación en la nube

El **numeral 21 del artículo 476** del Estatuto Tributario excluye del IVA el suministro de páginas web, servidores y computación en la nube, y la doctrina de la DIAN lo ha entendido aplicable a modelos de software como servicio. Si aplica a la suscripción, el precio al consumidor no carga 19%.

**No está confirmado para una suscripción de consumo.** Requiere asesoría tributaria, que se añadió a los servicios profesionales de §8.

### 3.6 Precios de competidores: los dos estaban mal

| Competidor | Decía el documento | Valor verificado |
|---|---|---|
| Todoist Pro | USD 5 al mes | **USD 7 mensual, USD 60 anual** (≈ USD 5/mes anualizado), desde el 10-dic-2025 |
| TickTick Premium | USD 35,99 al año | **USD 49,99 al año** |

Ambas cifras venían de blogs de reseñas de herramientas. El «más del doble de Todoist» solo era cierto contra la tarifa anual. Se sustituyeron por las páginas oficiales.

### 3.7 Cifras de mercado: correctas, con el periodo mal declarado

Fortune Business Insights y Grand View Research confirman las cuatro cifras del documento. Lo que faltaba es que **ambos CAGR corresponden a 2026 en adelante**, no desde 2025: 9,94% para 2026–2034 y 15,6% para 2026–2033. Sin ese dato, quien rehaga la cuenta desde 2025 encuentra un desajuste.

### 3.8 Cifras colombianas del sector

**Fedesoft (2025):** la industria de software y TI alcanzó en 2024 ventas por **$44,25 billones**, con **6.805 empresas** y **406.000 empleados**, y exportaciones de servicios informáticos por **USD 1.758 millones**.

**MinTIC y Fedesoft:** brecha nacional de **85.000 profesionales** de tecnología. Ojo: la prensa reportó 83.000; la fuente oficial dice 85.000.

**Multas de tránsito 2026**, sobre un salario mínimo de $1.750.905: SOAT vencido 30 SMDLV ≈ **$1.750.890**; sin revisión técnico-mecánica 15 SMDLV ≈ **$875.452** (el documento decía $875.460).

**UVB 2026 = $12.110** (Resolución 3488 de 2025 de MinHacienda), así que la inscripción del documento privado en Cámara de Comercio, 6 UVB, son **$72.660** exactos.

**Códigos CIIU** verificados: 6201 «Actividades de desarrollo de sistemas informáticos» y 6311 «Procesamiento de datos, alojamiento (hosting) y actividades relacionadas», establecidos por la Resolución 66 de 2012 del DANE.

### 3.9 Techos técnicos que fijan la capacidad instalada

| Recurso | Techo del nivel gratuito |
|---|---|
| Supabase | 500 MB, 50.000 usuarios activos mensuales, **se pausa tras una semana de inactividad** |
| Resend | 3.000 correos al mes **con tope de 100 diarios** |

**El recurso que primero se agota es el correo: 100 usuarios activos.** Ese es el límite real de la capacidad instalada y el techo que la proyección de ventas de la Entrega 2 no puede superar.

La pausa de Supabase merece nota: §8.2 descartaba a Render precisamente por ese comportamiento y luego seleccionaba Supabase Free, que hace lo mismo. No compromete la operación porque la evaluación diaria cuenta como actividad, pero había que decirlo.

---

## 4. Cambios al cronograma

Base: `docs/proyecto/figuras/_datos/cronograma-base.csv`, con 29 actividades. Transformaciones aplicadas por `cronograma.py`:

| Cambio | Efecto |
|---|---|
| Eliminada «Desarrollo de la aplicación móvil» | Ninguno sobre la duración: tenía 9 días de holgura |
| Añadida «Curaduría del catálogo», 15 días, tras la actividad 15 | Días 44 a 59, holgura de 9. No entra en la ruta crítica |
| Renumeración contigua de 1 a 28 | Solo cambian cuatro: 29→17, 17→18, 18→21, 21→22 |
| Renombrada la actividad 26 | El RNBD deja de ser un trámite comprometido |
| Responsables de desarrollo mapeados a los cuatro integrantes | Las nueve etiquetas anteriores se reducen a cuatro personas |

**Resultado: 28 actividades, 114 días hábiles, 17 críticas.** Duración y ruta crítica sin cambios respecto del plan original.

**Ruta crítica:** 1 → 2 → 3 → 7 → 10 → 11 → 12 → 13 → 15 → 16 → 19 → 20 → 22 → 24 → 25 → 27 → 28

**Mayores holguras:** actividad 23 con 15 días (reserva del equipo técnico), actividad 17 con 9, actividades 18 y 21 con 8 cada una.

---

## 5. Inventario de figuras

Las nueve son elaboración propia y se regeneran con los scripts de `docs/proyecto/figuras/`.

| Figura | Contenido | Sección | Dónde se inserta |
|---|---|---|---|
| 1 | Línea de tiempo del sector, 1998–2026 | 2 | Fin de 2.1. **Pendiente de diagramar** |
| 2 | Árbol de problemas | 3 | 3.1 |
| 3 | Árbol de objetivos | 3 | 3.2 |
| 4 | Mapa de posicionamiento competitivo | 7 | Fin de 7.1, tras la tabla |
| 5 | Diagrama de proceso entradas-proceso-salidas | 10 | 10.1 |
| 6 | Blueprint del servicio con línea de visibilidad | 10 | 10.2 |
| 7 | Diagrama de Gantt | 11 | 11.3 |
| 8 | Red PERT | 11 | 11.4 |
| 9 | Mapa de riesgos probabilidad-impacto | 12 | 12.2, tras la tabla |

**La Figura 1 es la única que falta.** Su contenido está redactado en el texto de §2.1, listo para diagramar en PowerPoint o SmartArt: cinco hitos en secuencia horizontal.

---

## 6. Lo que no se verificó

Lista explícita para que nadie asuma que está comprobado.

- **Los códigos de infracción D.2 (SOAT) y C.35 (tecnomecánica)** se tomaron de prensa, no del artículo 131 de la Ley 769 de 2002. **Por eso se retiraron del cuerpo del documento** y solo quedaron los múltiplos de SMDLV, que sí están confirmados.
- **Las cifras de DataReportal** (41,1 millones de usuarios de internet, 77,3% de penetración, 78,3 millones de conexiones móviles) se verificaron en una fuente colombiana que reproduce el informe, no en el informe original.
- **Tarifas de Mercado Pago**, tomadas de comparadores; las propias fuentes advierten que cambian con frecuencia.
- **Precios de Firebase, Neon, Render y SendGrid**, que son las alternativas descartadas de §8.
- **El rango de $200.000 a $1.500.000 de la matrícula mercantil**, la tarifa del registro de marca y el porcentaje del impuesto de registro, que varía por departamento.
- **Si la SIC admite registro voluntario en el RNBD** para entidades no obligadas.
- **El compromiso de energía renovable** de las regiones concretas de Supabase, Vercel y Railway, que la primera medida de mitigación ambiental da por disponible.
- **Especialistas colombianos en los dominios de finanzas y hogar.** No se buscaron.

---

## 7. Pendientes para cerrar la entrega

### Bloqueantes

1. **Los cuatro nombres de los integrantes.** Aparecen como `[COMPLETAR]` en la portada y en la ficha técnica. Los roles ya están repartidos y el cronograma los usa.
2. **La fecha de inicio del proyecto.** La guía pide un Gantt con «barras por actividad y fecha»; el eje está en días hábiles. Con una fecha de arranque, el generador produce el eje en calendario.

### Importantes

3. **La Figura 1**, línea de tiempo del sector.
4. **Actualizar la fecha de la portada del Word**, que dice 10 de agosto de 2026.
5. **Revisar las referencias que apuntan a la raíz del sitio** en vez de al documento: DANE, Minsalud y Seguros Sura.
6. **Retirar de la lista de referencias** `alfred_ (2026)`, `AIToolPick (2026)` y `SNLegal (2026)`, sustituidas por fuentes oficiales.

### Riesgo asumido

7. **La guía rechaza los cronogramas «elaborados a mano en lugar de software especializado».** Las figuras 7 y 8 se generan por programa a partir de un cálculo CPM, no se dibujan, pero un evaluador puede no distinguirlo. Decisión tomada del equipo. Mitigaciones aplicadas: el pie de figura declara el método, y `cronograma.csv` se entrega como anexo importable a MS Project y GanttProject. Blindarlo del todo costaría importar el CSV en GanttProject y adjuntar esa exportación.

---

## 8. Documentos anexos y su estado

| Archivo | Estado |
|---|---|
| `cronograma.csv` | **Vigente.** Regenerado con los cambios de la sección 4 |
| `perfil-proyecto.docx` | El documento que se entrega |
| `perfil-proyecto.html` | **Divergente.** No es una exportación del Word: tiene prosa distinta y no incorpora ninguna de las correcciones de esta revisión. Hay que decidir si se actualiza o se archiva |
| `../../proyecto/arbol-problemas-objetivos.html` | **Obsoleto en su parte de árboles.** Muestra la versión anterior, con causas redactadas como ausencia de la solución. Las figuras 2 y 3 lo sustituyen. Conserva un análisis de alternativas que no está en otro sitio |
| `../../proyecto/analisis-riesgos.html` | Marco teórico de riesgos. No revisado en esta iteración |
