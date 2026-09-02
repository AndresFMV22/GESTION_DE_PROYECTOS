# Alcance técnico — Alivia

**Proyecto:** Alivia — plataforma de gestión unificada de recordatorios para la vida adulta en Colombia
**Materia:** Gestión de Proyectos — Formulación y Evaluación de Proyectos · UPB
**Fecha:** 2 de septiembre de 2026
**Estado:** propuesta de alcance para aprobación del equipo

---

## 1. Qué es el producto

Alivia le recuerda a un adulto colombiano las obligaciones que se le olvidan y le cuestan dinero.

La diferencia con cualquier aplicación de tareas es que Alivia **llega con el calendario ya construido**. Las demás entregan una libreta en blanco y esperan que el usuario sepa cada cuánto se renueva el SOAT, cuándo vence la tecnomecánica o cuándo toca el predial. Eso no resuelve el problema, porque el problema nunca fue anotar: fue acordarse de que había algo que anotar.

En Alivia el usuario declara qué tiene —un carro, una vivienda, una mascota— y desde cuándo. La aplicación ya sabe que el SOAT vence en un año, y se lo recuerda antes de que pase.

**Frontera del alcance.** Todo lo que quepa dentro de *«la aplicación conoce por adelantado las obligaciones de la vida adulta colombiana y avisa a tiempo»* está dentro. Todo lo demás está fuera.

---

## 2. Criterio único de aceptación

> **El aviso debe llegar antes del vencimiento, no después.**

Este es el criterio contra el que se mide todo lo que se construya. Una aplicación que avisa tarde no es una versión imperfecta de Alivia: es otro producto, porque el usuario ya pagó la multa. Cualquier funcionalidad que no contribuya a que el aviso llegue a tiempo compite por el tiempo del equipo con la que sí.

---

## 3. Punto de partida: construcción desde cero

**El sistema se construye desde cero. No se reutiliza ningún componente de software del prototipo existente.**

Es una decisión tomada de forma consciente por el equipo, con las consecuencias evaluadas y aceptadas. Esta sección las deja por escrito para que no se descubran a mitad de la ejecución.

### 3.1 Qué se descarta

Se descarta la totalidad del prototipo previo: aproximadamente 4.700 líneas de código repartidas entre el servidor, la aplicación web y la aplicación para celular. Con ellas se descartan piezas que hoy funcionan —registro e ingreso de usuarios, gestión de recordatorios, la página de presentación y su panel principal— y que habrá que volver a construir.

### 3.2 Por qué se toma la decisión

**El modelo de información del prototipo no soporta el producto que se quiere.** Tres limitaciones son estructurales y no se resuelven con ajustes:

1. El catálogo de obligaciones —el diferenciador del producto— está escrito a mano dentro del código de la página web. No es información del sistema, no se puede corregir sin volver a publicar la aplicación, y no tiene dónde guardar el respaldo normativo que el proyecto se comprometió a documentar.
2. La suscripción no puede expresar una mensualidad. El sistema solo sabe si un módulo está activo o no; no sabe hasta cuándo. El modelo de negocio se basa en ingresos recurrentes que la información disponible no puede representar.
3. El aislamiento entre usuarios depende de que cada consulta al almacén de datos incluya manualmente el filtro correcto. Basta olvidarlo una vez para que un usuario vea los datos de otro. En una aplicación que va a manejar información de salud —categoría especial bajo la Ley 1581 de 2012— eso no es aceptable.

**El equipo debe poder sustentar lo que entrega.** El trabajo se evalúa con sustentación. Partir de una base heredada que el equipo no escribió obliga a defender decisiones que no tomó.

**La Entrega 2 exige ingeniería detallada coherente.** El entregable pide que la capacidad definida en la ingeniería, la demanda proyectada y las cifras del flujo de caja sean consistentes entre sí. Es más limpio derivar el sistema del diseño que justificar a posteriori un diseño que ya existía.

### 3.3 Consecuencias aceptadas

| Consecuencia | Magnitud | Cómo se afronta |
|---|---|---|
| Hay que reconstruir funcionalidad que ya operaba | Registro, ingreso, gestión de recordatorios, panel principal | Son componentes de complejidad baja y bien conocida; el prototipo demostró que no tienen riesgo técnico |
| El cronograma vigente no contempla reconstrucción | 114 días hábiles ya distribuidos en 28 actividades | Las actividades de desarrollo deben reestimarse; la fase de investigación de mercado no se ve afectada |
| Se pierde el trabajo visual de la página de presentación | Cerca del 41 % del código de la aplicación web previa | Se acepta: era código decorativo, no funcional, y el alcance nuevo no lo prioriza |
| Riesgo de repetir errores ya cometidos | Cinco defectos identificados en el prototipo | Se mitiga con la sección 4.1: los defectos conocidos entran como requisitos obligatorios del sistema nuevo |

### 3.4 Qué sí se conserva

Se descarta el código. **No se descarta el conocimiento.**

- **El catálogo de obligaciones como contenido.** Los plazos verificados de cada obligación colombiana —SOAT anual, tecnomecánica anual, predial, declaración de renta, controles médicos— son investigación de dominio, no software. Se conservan como insumo y se cargan en el sistema nuevo, ahora sí como información administrable y con su fuente normativa asociada.
- **Los hallazgos de la auditoría del prototipo.** Los defectos encontrados son conocimiento ganado: dicen exactamente qué hay que hacer bien. Se incorporan como requisitos en 4.1.
- **El modelo conceptual del dominio.** La estructura de módulos, categorías, obligaciones recurrentes y ciclos de reprogramación es correcta y se mantiene como punto de partida del diseño.

---

## 4. Alcance funcional

### 4.1 Requisitos derivados de la auditoría del prototipo

El prototipo se auditó antes de descartarlo. Estos cinco puntos son los errores que hicieron que no funcionara como producto. **Entran como requisitos obligatorios del sistema nuevo**, y son la razón por la que la auditoría valió la pena aunque el código se deseche.

1. **El cálculo del aviso parte de la anticipación, no del vencimiento.** El prototipo revisaba a diario las obligaciones ya vencidas, e ignoraba la preferencia de anticipación del usuario aunque la guardaba. El sistema nuevo debe buscar las obligaciones que vencen *dentro de la ventana de anticipación de cada usuario*.
2. **El registro de notificaciones refleja el resultado real del envío.** El prototipo escribía el aviso en la consola del servidor y lo registraba como enviado. La base de datos afirmaba que se había enviado algo que nunca salió. El sistema nuevo registra el estado verdadero: entregado, fallido o pendiente.
3. **Las obligaciones recurrentes se reprograman solas.** El prototipo guardaba la periodicidad y nunca la usaba: al marcar cumplido, el recordatorio se cerraba y no volvía. El sistema nuevo genera automáticamente la siguiente ocurrencia.
4. **El control de acceso a los módulos de pago se verifica en el servidor.** En el prototipo la restricción existía solo en la interfaz: cualquier usuario podía activar un módulo de pago sin pagarlo. La verificación debe ocurrir donde no se puede eludir.
5. **Ninguna acción destruye información del usuario sin confirmación.** El prototipo borraba los recordatorios al desactivar un módulo de pago, sin aviso ni forma de recuperarlos.

### 4.2 Recorrido del usuario

1. **Registro e ingreso.** Cuenta con correo y contraseña, con autorización explícita de tratamiento de datos personales.
2. **Selección de áreas.** El usuario elige qué áreas de su vida quiere gestionar: hogar, vehículo, familia (gratuitas) y salud, finanzas, mascotas, general (de pago).
3. **Carga del catálogo.** Al activar un área, la aplicación le presenta las obligaciones típicas de esa área con sus plazos reales. **Este es el momento crítico de la experiencia:** es donde se entrega el valor diferencial.
4. **Ajuste de fechas base.** El usuario indica los datos que solo él conoce: cuándo compró el carro, cuándo fue su último control médico. A partir de ahí el sistema calcula los vencimientos.
5. **Operación automática.** El sistema vigila los vencimientos a diario y avisa con la anticipación configurada.
6. **Cumplimiento y reprogramación.** Cuando el usuario marca una obligación como cumplida, el sistema la reprograma sola para el siguiente ciclo.

### 4.3 Los siete módulos

| Módulo | Plan | Contenido |
|---|---|---|
| Hogar | Gratuito | Impuesto predial, servicios, mantenimientos del inmueble |
| Vehículo | Gratuito | SOAT, revisión tecnomecánica, mantenimientos |
| Familia | Gratuito | Fechas familiares, matrículas escolares |
| Salud | De pago | Controles médicos, exámenes periódicos, vacunación |
| Finanzas | De pago | Declaración de renta, tarjetas, obligaciones tributarias |
| Mascotas | De pago | Vacunación, desparasitación, controles veterinarios |
| General | De pago | Recordatorios personalizados del usuario |

Los módulos de mayor impacto económico —vehículo y hogar— se mantienen gratuitos deliberadamente: es donde está la multa evitable, y no debe quedar detrás de un pago.

---

## 5. Componentes a construir

### 5.1 Gestión de cuentas

Registro con correo y contraseña, ingreso, sesión y perfil. Autorización explícita de tratamiento de datos personales en el momento del registro, conservada como evidencia. Aislamiento garantizado entre usuarios por diseño del sistema, no por disciplina de quien escribe cada consulta.

### 5.2 Catálogo de obligaciones

El componente más importante del alcance. Información administrable del sistema —no texto fijo dentro de la aplicación— con estos datos por cada obligación:

- Nombre y descripción
- Módulo y categoría a la que pertenece
- Periodicidad en días
- **Fuente normativa** que respalda esa periodicidad
- Si es una obligación con sanción legal o económica, o una tarea recomendada

El último campo permite separar lo que es el producto de lo que lo acompaña, y es lo que sostiene el argumento de valor frente al usuario y frente al jurado. Debe poder corregirse y ampliarse sin volver a publicar la aplicación, y debe ser el mismo catálogo para todos los clientes del sistema.

### 5.3 Gestión de recordatorios

Creación a partir del catálogo o de forma libre, edición, marcado de cumplimiento y eliminación. Al crear desde el catálogo, la fecha de vencimiento se calcula a partir de la fecha base que declara el usuario y de la periodicidad de la obligación. Al marcar cumplida una obligación recurrente, se genera automáticamente la siguiente ocurrencia.

### 5.4 Servicio de avisos

Revisión diaria programada que identifica las obligaciones próximas a vencer según la ventana de anticipación configurada por cada usuario, y emite el aviso por correo electrónico. Cada envío queda registrado con su resultado real, y no se repite un aviso ya entregado. La frecuencia es configurable por el usuario, en cumplimiento de la Ley 2300 de 2023 sobre contacto no consentido.

### 5.5 Módulos y suscripción

Activación y desactivación de módulos. Los módulos de pago requieren una suscripción con fecha de inicio y fecha de vencimiento, verificada en el servidor antes de conceder el acceso. El sistema distingue una suscripción vigente de una expirada. La desactivación conserva la información del usuario y solo suspende el acceso.

### 5.6 Pasarela de pagos en modo de pruebas

Integración que simula el cobro de la suscripción sin mover dinero real, suficiente para demostrar el flujo completo de conversión.

### 5.7 Interfaz web

Registro, ingreso, panel principal con las obligaciones próximas, vista por módulo, creación de recordatorios desde el catálogo y flujo de activación de módulos de pago. Diseño responsivo. Sin componentes decorativos costosos: el esfuerzo visual va a que la información se lea bien, no a efectos gráficos.

---

## 6. Lo que queda fuera del alcance

### 6.1 Fuera por decisión del proyecto

| Queda fuera | Razón |
|---|---|
| **Cobro real de dinero** | La pasarela queda simulada. Operar en modo real exige una persona jurídica constituida, y la constitución de la sociedad se deja formulada, no ejecutada. |
| **Conexión con entidades externas** (RUNT, DIAN, EPS, bancos) | Las fechas las declara el usuario. Consultar vencimientos automáticamente exige convenios que no están al alcance de un proyecto de curso. |
| **Publicación en tiendas de aplicaciones** | Requiere cuenta de desarrollador y procesos de revisión fuera del calendario académico. |
| **Asistente de inteligencia artificial** | No contribuye al criterio de aceptación. |
| **Otros idiomas y otros países** | El producto es específico de la normatividad colombiana; ese es justamente su diferenciador. |
| **Soporte técnico permanente y acuerdos de nivel de servicio** | No hay operación comercial. |

### 6.2 Recorte del alcance previsto

**La aplicación para celular sale de esta etapa.**

Al construir desde cero, sostener dos clientes en paralelo duplica el trabajo desde el primer día. El equipo son cuatro personas con dedicación parcial y todavía no se ha validado con usuarios reales que el producto sirva. Repartir el esfuerzo antes de saber eso es el peor momento posible para hacerlo.

**Alternativa si el equipo la quiere dentro:** limitarla a consultar los recordatorios y marcarlos como cumplidos. Crear y configurar se hace desde la web. Eso es una fracción del trabajo y conserva la presencia móvil que el proyecto declaró.

---

## 7. Entregables de software

1. Aplicación web funcional con los siete módulos, registro de usuarios y creación de recordatorios desde el catálogo.
2. Servicio de avisos con anticipación configurable y envío efectivo por correo.
3. Catálogo de obligaciones administrable, con periodicidad y fuente normativa documentada por cada entrada.
4. Control de acceso a módulos de pago verificado en el servidor, con suscripción con vigencia.
5. Pasarela de pagos integrada en modo de pruebas.
6. Registro de avisos enviados, como evidencia para medir el indicador de entrega.
7. Modelo de información documentado.
8. Código fuente documentado y desplegado en ambiente de pruebas.

---

## 8. Advertencias sobre el alcance

Estas condiciones afectan lo que se puede comprometer y conviene dejarlas escritas.

**La reconstrucción desde cero consume tiempo que el cronograma no tiene asignado.** El plan vigente distribuye 114 días hábiles en 28 actividades, dimensionadas cuando se contaba con una base existente. Las actividades de desarrollo deben reestimarse antes de dar el cronograma por firme. Es la consecuencia más costosa de la decisión de la sección 3 y la que más conviene atender primero.

**El catálogo actual no está validado.** Como no se realizaron las encuestas ni las entrevistas previstas, el listado de obligaciones que se conserva del prototipo salió del criterio del equipo y no del trabajo de campo. Se nota: hay entradas que son tareas domésticas —lavar el carro, revisar el pico y placa semanal— y no obligaciones con consecuencia legal o económica. Diluyen exactamente el argumento que sostiene el proyecto.

**Recomendación:** comprometer el producto con las obligaciones que tienen fecha límite y sanción —SOAT, tecnomecánica, predial, renta, controles médicos— y dejar el resto como acompañamiento opcional, claramente distinguido.

**La prueba piloto depende de que los avisos funcionen.** El objetivo específico 6 plantea un piloto con 50 usuarios midiendo retención y reducción del incumplimiento. Ninguna de las dos cosas se puede medir mientras el aviso no llegue. El piloto no es ejecutable antes de completar los componentes 5.2 y 5.4.

**El precio no se puede fijar todavía.** El análisis del entorno ya identificó el precio como la amenaza más crítica del proyecto: USD 9,99 equivalen a cerca de $40.000, más del doble de la competencia de referencia, frente a un consumidor documentadamente sensible al precio. Sin datos de disposición a pagar, ese número no tiene sustento. Debe tratarse como un valor provisional y no como una decisión tomada.

---

## 9. Resumen

Alivia se compromete con una sola cosa: **avisarle a tiempo a un adulto colombiano de las obligaciones que le cuestan dinero olvidar.**

El sistema se construye desde cero. Es una decisión consciente: el modelo de información del prototipo no soporta ni el catálogo administrable ni la suscripción con vigencia ni el aislamiento de datos que el producto exige, y el equipo debe poder sustentar lo que entrega. El costo —reconstruir funcionalidad que ya operaba y reestimar el cronograma— está identificado y aceptado.

Se descarta el código, no el conocimiento: los plazos verificados de las obligaciones colombianas y los defectos detectados en la auditoría del prototipo pasan al sistema nuevo, los primeros como contenido y los segundos como requisitos.

La parte difícil de este proyecto nunca fue programar. Fue averiguar y verificar cada cuánto vence realmente cada obligación en Colombia. Ese catálogo es lo que hace que Alivia sea Alivia y no una lista de tareas más.
