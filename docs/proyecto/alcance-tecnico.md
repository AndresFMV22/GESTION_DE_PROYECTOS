# Alcance técnico — Alivia

**Proyecto:** Alivia — plataforma de gestión unificada de recordatorios para la vida adulta en Colombia
**Materia:** Gestión de Proyectos — Formulación y Evaluación de Proyectos · UPB
**Fecha:** 2 de septiembre de 2026
**Estado:** propuesta de alcance para aprobación del equipo
**Última revisión:** 23 de septiembre de 2026, al fijar el stack técnico y el ambiente de ejecución

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
- Periodicidad, expresada como intervalo de calendario y no como número de días
- **Qué norma hace obligatoria** esa obligación
- **Qué fija su sanción**, que no siempre es la misma norma
- **De dónde sale la fecha**: una norma, un calendario territorial, un contrato, una factura, el reglamento de una institución o una recomendación profesional
- Si es una obligación con sanción legal o económica, o una tarea recomendada

El penúltimo campo permite separar lo que es el producto de lo que lo acompaña, y es lo que sostiene el argumento de valor frente al usuario y frente al jurado. El catálogo debe poder corregirse y ampliarse sin volver a publicar la aplicación, y debe ser el mismo para todos los clientes del sistema.

> **Corrección del 24 de septiembre de 2026.** Este punto pedía antes un único campo, «*fuente normativa que respalda esa periodicidad*», y una «periodicidad en días». Al construir el catálogo y verificar las fuentes una por una se comprobó que **ninguna de las dos cosas se puede cumplir tal como estaban escritas**. El detalle está en la sección 12.

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
8. Código fuente documentado, con ambiente de ejecución local reproducible por cualquier integrante del equipo. **No hay despliegue:** ver la sección 11.

---

## 8. Advertencias sobre el alcance

Estas condiciones afectan lo que se puede comprometer y conviene dejarlas escritas.

**La reconstrucción desde cero consume tiempo que el cronograma no tiene asignado.** El plan vigente distribuye 114 días hábiles en 28 actividades, dimensionadas cuando se contaba con una base existente. Las actividades de desarrollo deben reestimarse antes de dar el cronograma por firme. Es la consecuencia más costosa de la decisión de la sección 3 y la que más conviene atender primero.

**El catálogo actual no está validado.** Como no se realizaron las encuestas ni las entrevistas previstas, el listado de obligaciones que se conserva del prototipo salió del criterio del equipo y no del trabajo de campo. Se nota: hay entradas que son tareas domésticas —lavar el carro, revisar el pico y placa semanal— y no obligaciones con consecuencia legal o económica. Diluyen exactamente el argumento que sostiene el proyecto.

**Recomendación:** comprometer el producto con las obligaciones que tienen fecha límite y sanción —SOAT, tecnomecánica, predial, renta, controles médicos— y dejar el resto como acompañamiento opcional, claramente distinguido.

**La prueba piloto quedó eliminada.** La materia descartó el piloto con usuarios reales, así que el objetivo específico 7 —50 usuarios, retención a 14 días, porcentaje de avisos cumplidos— ya no tiene actividad que lo ejecute. Lo que se pierde con él es la única evidencia empírica de que el producto sirve. Lo que lo sustituye como evidencia del criterio único de aceptación se define en la sección 11.5, y es más débil: demuestra que el aviso llega a tiempo, no que a alguien le importe recibirlo.

**El precio no se puede fijar todavía.** El análisis del entorno identificó el precio como uno de los riesgos críticos: la hipótesis inicial de USD 9,99 equivale a cerca de $40.000, entre 1,4 y 2 veces la tarifa de Todoist Pro según se compare contra su plan mensual de USD 7 o su plan anual de USD 60. Sin datos de disposición a pagar, ese número no tiene sustento y el análisis lo descarta como hipótesis de partida.

**Y el argumento que lo sostenía ya no sirve.** El ahorro de una multa de tránsito no justifica pagar una suscripción, porque ese aviso está disponible gratis en aplicaciones especializadas (ver la sección 10.1). La disposición a pagar debe sustentarse en la cobertura transversal de los siete dominios, no en el ahorro vehicular.

---

## 9. Resumen

Alivia se compromete con una sola cosa: **avisarle a tiempo a un adulto colombiano de las obligaciones que le cuestan dinero olvidar.**

El sistema se construye desde cero. Es una decisión consciente: el modelo de información del prototipo no soporta ni el catálogo administrable ni la suscripción con vigencia ni el aislamiento de datos que el producto exige, y el equipo debe poder sustentar lo que entrega. El costo —reconstruir funcionalidad que ya operaba y reestimar el cronograma— está identificado y aceptado.

Se descarta el código, no el conocimiento: los plazos verificados de las obligaciones colombianas y los defectos detectados en la auditoría del prototipo pasan al sistema nuevo, los primeros como contenido y los segundos como requisitos.

La parte difícil de este proyecto nunca fue programar. Fue averiguar y verificar cada cuánto vence realmente cada obligación en Colombia. Ese catálogo es lo que hace que Alivia sea Alivia y no una lista de tareas más.

---

## 10. Qué cambió tras la revisión de la Entrega 1

La revisión de septiembre de 2026 produjo hallazgos que afectan a este alcance. El detalle completo está en `docs/entregables/entrega-1/revision.md`.

### 10.1 El diferenciador es más estrecho de lo que este documento supone

Este alcance afirma que el catálogo curado de obligaciones colombianas es lo que hace defendible al producto. **Sigue siendo cierto, pero no en todos los dominios.**

En el dominio vehicular ya existe **R5**, una aplicación colombiana gratuita que avisa del vencimiento del SOAT, la técnico-mecánica y la licencia, se conecta al RUNT para traer las fechas sola, y acumula más de 41.000 calificaciones. Es decir: el módulo donde vive la multa de $1.750.890 está cubierto, gratis y mejor conectado de lo que este proyecto puede estarlo, porque la integración con el RUNT está fuera de alcance.

**Consecuencia sobre el criterio de construcción:** la curaduría del catálogo debe priorizar hogar, familia y finanzas, donde no se identificó especialista. El módulo vehicular pasa a ser condición de paridad y no gancho de adquisición. El terreno defendible del producto es la **agregación de siete dominios**, no el conocimiento local en sí mismo.

### 10.2 El registro de bases de datos ante la SIC no es exigible

El Decreto 090 de 2018 limita esa obligación a sociedades con activos superiores a 100.000 UVT, unos $5.237 millones en 2026. Las obligaciones sustantivas —autorización previa, política de tratamiento, atención de reclamos y estándar reforzado para datos sensibles— **sí aplican siempre** y siguen siendo requisito del sistema.

### 10.3 La base de datos debe aprovisionarse en Estados Unidos

La Circular Externa 005 de 2017 de la SIC incluye a Estados Unidos entre los países con nivel adecuado de protección de datos y **no incluye a Brasil**. Alojar en São Paulo, pese a su menor latencia, obligaría a la vía excepcional de autorización expresa para cada transferencia, un estándar muy exigente con datos de salud.

Es una restricción de diseño, no una preferencia.

### 10.4 La capacidad instalada tiene un techo de 100 usuarios

El nivel gratuito del proveedor de correo admite **100 envíos diarios**. Con un aviso consolidado por usuario y día, ese es el número máximo de usuarios activos que el sistema soporta sin pasar al plan de pago. Es el recurso que primero se agota, antes que la base de datos, y es el techo que cualquier proyección de crecimiento debe respetar.

### 10.5 El punto 5.7 necesita un matiz

El componente de interfaz web (5.7) dice «sin componentes decorativos costosos». Se mantiene, pero conviene precisar dónde sí hay que invertir: **la configuración inicial y el primer aviso recibido son los dos momentos de verdad del servicio**. Si la carga inicial del catálogo es confusa, el usuario abandona antes de recibir un solo aviso y el producto nunca demuestra para qué sirve.

---

## 11. Stack técnico y ambiente de ejecución

### 11.1 La condición que determina todo lo demás: no hay despliegue

**El sistema se ejecuta únicamente en la máquina de cada integrante. No se despliega en internet.** Es una decisión acordada con la docencia de la materia y afecta a la selección de herramientas más que cualquier consideración técnica.

La consecuencia inmediata es que los proveedores seleccionados en el perfil de la Entrega 1 —Supabase, Vercel, Railway y Resend— dejan de ser el ambiente donde corre el software y pasan a ser **la arquitectura de despliegue prevista**: la respuesta documentada a «dónde viviría esto si se pusiera en producción». El análisis de proveedores de la Entrega 1 no se retira ni pierde validez; cambia de estatus. Lo que se construye ahora corre en local.

Esto no es un recorte de alcance funcional. Los siete entregables de software de la sección 7 se mantienen íntegros; lo único que cambia es dónde se ejecutan.

### 11.2 El stack

| Capa | Elección | Por qué |
|---|---|---|
| Base de datos | PostgreSQL 16 en contenedor, con seguridad a nivel de fila | Es el motor que ya eligió el perfil; el esquema es portable sin reescritura |
| Servidor | Node.js con Express y TypeScript | El equipo ya conoce el ecosistema; los tipos pagan su costo en un dominio hecho de fechas |
| Autenticación | Propia: contraseña con Argon2 y sesión por token firmado | Código del equipo, defendible en sustentación |
| Interfaz web | React con Vite y TypeScript | Sin marco de trabajo adicional: el despliegue era el problema que resolvían, y ya no existe |
| Correo | **Mailpit** en contenedor | Servidor de correo de captura: bandeja única, sin salida a internet, sin cuenta en ningún servicio |
| Programación de tareas | Proceso periódico dentro del servidor, con disparo manual | Ver 11.4 |
| Pasarela de pagos | Simulador propio | Ver 11.6 |
| Reproducibilidad | Composición de contenedores, semillas de datos y migraciones versionadas | Ver 11.7 |

Son **dos contenedores**: base de datos y correo. El servidor y la interfaz corren directamente. Levantar el ambiente completo debe ser un comando.

**Lo que se descarta y por qué:**

- **El stack local completo de Supabase.** Existe y funciona, pero levanta del orden de ocho contenedores y arrastra su servicio de autenticación y su capa de API automática. Son piezas que el equipo no escribiría y tendría que defender igualmente, justo lo que la sección 3.2 dice que hay que evitar. Con PostgreSQL directo, todo lo que hay es código propio.
- **React Native y Expo.** Ya estaban fuera desde 6.2.
- **Un marco de trabajo con renderizado en servidor.** Resuelve problemas de despliegue y de posicionamiento en buscadores que este proyecto no tiene.

**Coherencia con la Entrega 1:** el criterio de selección declarado en el perfil fue elegir Supabase *«por usar PostgreSQL estándar, lo que permite migrar a Neon, Railway o a un servidor propio sin reescribir el modelo de datos»*. Trabajar contra PostgreSQL local no contradice ese criterio: lo ejerce.

### 11.3 El aislamiento entre usuarios se implementa en la base de datos

Es la decisión de arquitectura con más consecuencias del proyecto y la que sostiene el punto 5.1.

El requisito dice que el aislamiento debe estar garantizado **por diseño del sistema, no por disciplina de quien escribe cada consulta**. Eso significa seguridad a nivel de fila en PostgreSQL: políticas que filtran por el usuario del contexto de la transacción, aplicadas por el motor, no por el programador.

**La regla que lo hace funcionar o fracasar:** el servidor se conecta a la base de datos con un rol que *está sujeto* a esas políticas, y fija la identidad del usuario dentro de la transacción antes de consultar. Si en cualquier punto el servidor se conecta como superusuario o como dueño de las tablas, la seguridad a nivel de fila se ignora por completo y el defecto 3 de la sección 3.2 queda reconstruido con más pasos y más confianza injustificada.

Consecuencia práctica: no puede existir un camino de acceso a datos de usuario que no pase por el contexto de transacción. La única excepción es el proceso de avisos, que por definición lee obligaciones de todos los usuarios; ese proceso usa un rol distinto, con permisos explícitos y acotados a lo que necesita, y nunca atiende peticiones de la web.

La verificación de acceso a los módulos de pago (requisito 4.1.4) se apoya en lo mismo: la vigencia de la suscripción se comprueba en el servidor y se refleja en las políticas, no en la interfaz.

### 11.4 El servicio de avisos en ambiente local

Tres exigencias que no aparecían en ningún documento anterior y sin las cuales el componente 5.4 no es demostrable ni verificable:

1. **Bandeja única de captura.** Todos los correos de todos los usuarios llegan a Mailpit, que los retiene y los muestra en su interfaz web sin reenviarlos a ninguna dirección real. No hay riesgo de escribirle por error a un tercero con datos de prueba, ni límite de envíos, ni necesidad de conexión.
2. **El reloj debe ser inyectable.** El producto entero es aritmética de fechas. Si la lógica consulta la fecha del sistema directamente, no hay forma de probar una ventana de anticipación de treinta días sin cambiarle la hora al computador, ni de demostrarla en una sustentación. La fecha de referencia entra como parámetro.
3. **La evaluación diaria debe poder dispararse a demanda**, además de correr programada. Nadie espera a mañana a las ocho para ver si el sistema funciona.

El registro del resultado real de cada envío (requisito 4.1.2) se vuelve exigible aquí: contra un servidor de correo de verdad, el envío ocurre o lanza error. Deja de existir la posibilidad de anotar como entregado algo que solo se imprimió en consola.

### 11.5 Qué sustituye a la prueba piloto como evidencia

Eliminado el piloto, el criterio único de aceptación de la sección 2 se queda sin comprobación empírica. Lo que lo reemplaza es una comprobación automatizada, y conviene ser explícito sobre qué demuestra y qué no.

Mailpit expone una interfaz de consulta programable sobre los mensajes que recibe. Eso permite una prueba que siembra obligaciones con vencimientos conocidos, ejecuta la evaluación diaria con una fecha de referencia controlada, y verifica contra la bandeja que el aviso existe, que corresponde al usuario correcto y que salió **antes** del vencimiento. El criterio de aceptación pasa de ser una frase en un documento a una comprobación que falla en rojo, y el entregable 6 —registro de avisos como evidencia del indicador de entrega— se mide contra esos datos.

**Lo que esta evidencia no demuestra:** que el aviso le sirva a alguien. Retención, utilidad percibida y disposición a pagar eran precisamente lo que el piloto iba a medir, y ninguna encuesta ni prueba automatizada las sustituye. La Entrega 2 debe declararlo así y no presentar la cobertura de pruebas como validación de mercado.

### 11.6 Pasarela de pagos simulada

Sin despliegue no hay dirección pública a la que una pasarela real pueda notificar el resultado de un cobro, que es el mecanismo del que depende toda integración de pagos. Las herramientas de reenvío a la máquina local existen, pero exigen cuenta en el proveedor y conexión a internet durante la sustentación.

El punto 5.6 solo pide simular el cobro sin mover dinero real. Se implementa como un módulo propio que reproduce los estados del flujo —iniciado, aprobado, rechazado, expirado— y permite forzar cada uno. Demuestra la conversión completa, funciona sin red y no añade dependencias externas. La integración con una pasarela real queda documentada como trabajo futuro, junto con la arquitectura de despliegue prevista.

### 11.7 Reproducibilidad entre los cuatro integrantes

Con cuatro personas y cero despliegue, el ambiente de desarrollo *es* el ambiente de producción, y «en mi máquina funciona» se come el cronograma. Es requisito, no comodidad:

- Composición de contenedores para base de datos y correo, con versiones fijadas.
- Migraciones de esquema versionadas en el repositorio, aplicables desde cero.
- Datos de semilla que incluyan el catálogo de obligaciones y usuarios de prueba.
- Plantilla de variables de entorno. Ningún secreto en el repositorio, ni siquiera de pruebas.

### 11.8 Qué no cambia en la formulación del proyecto

Tres cosas que la decisión de no desplegar **no** deroga, y que conviene no borrar por error:

- **La capacidad instalada sigue siendo de 100 usuarios activos** (sección 10.4). Ese techo viene del límite de cien correos diarios del proveedor previsto para producción. Mailpit no tiene límite, pero sustituir el techo por «ninguno» dejaría a la Entrega 2 sin el número que ancla la coherencia entre capacidad, demanda proyectada y flujo de caja. El proveedor de producción declarado se mantiene, y con él su techo.
- **La base de datos se aprovisionaría en Estados Unidos** (sección 10.3). En ejecución local no hay transferencia internacional de datos y la restricción no se activa, pero sigue siendo la decisión de diseño para la arquitectura prevista, y por el mismo motivo normativo.
- **Las obligaciones sustantivas de protección de datos siguen aplicando al diseño**: autorización previa, política de tratamiento, atención de reclamos y estándar reforzado para el módulo de salud. Que los datos sean de prueba no cambia cómo debe estar construido el sistema.

### 11.9 Lo que falta por verificar

Declarado explícitamente, según la práctica de este repositorio:

- **Nada de esto se ha ejecutado todavía.** El stack está decidido sobre el papel. Antes de darlo por firme hay que levantar los dos contenedores y recorrer el camino completo —obligación próxima a vencer, evaluación diaria, envío, bandeja, consulta programable— al menos una vez.
- **Las versiones concretas** de cada pieza están sin fijar.
- **El comportamiento de la seguridad a nivel de fila bajo el patrón de contexto por transacción** debe probarse con dos usuarios reales en la base antes de construir nada encima. Es el supuesto del que cuelga el punto 5.1.


---

## 12. Lo que la construcción corrigió de este alcance

Tres afirmaciones de este documento resultaron falsas al implementarlas. Se corrigen aquí en lugar de dejarlas, porque este documento manda sobre el código y una especificación imposible de cumplir empuja a inventar los datos que faltan.

### 12.1 «La fuente normativa que respalda esa periodicidad» no existe para casi ninguna obligación

Al verificar las fuentes en el texto de cada norma aparece que el catálogo estaba confundiendo **tres cosas distintas**: qué norma hace algo obligatorio, qué norma fija la sanción por incumplirlo, y qué fija la fecha. La tercera, en la mayoría de los casos, **no es una norma**.

| Obligación | Qué la hace obligatoria | Qué fija su sanción | **Qué fija la fecha** |
|---|---|---|---|
| Revisión tecnomecánica | Ley 769 de 2002, arts. 51 y 52 | art. 131, literal C.35 — 15 SMLDV | **La norma.** La única del catálogo |
| SOAT | Ley 769 de 2002, art. 42 | art. 131, literal D.2 — 30 SMLDV | **La póliza.** El código de tránsito no menciona la vigencia anual |
| Impuesto predial | Acuerdo de cada municipio | Intereses de mora | **El calendario del municipio** |
| Declaración de renta | Estatuto Tributario | Sanción por extemporaneidad | **El calendario anual de la DIAN**, por dígitos del NIT |
| Vacunación antirrábica | Decreto 2257 de 1986, arts. 33 y 55 | Autoridad sanitaria | **Un lineamiento ministerial.** El decreto *delega* expresamente la periodicidad |
| Servicios públicos | Ley 142 de 1994 | art. 140 — suspensión del servicio | **La factura de cada empresa.** La ley dice cuándo pueden cortar, no cuándo hay que pagar |
| Tarjeta de crédito | — | Contrato: intereses y centrales de riesgo | **El contrato.** No hay norma |
| Matrícula escolar | — | Reglamento de la institución | **El calendario de cada colegio** |

**De las ocho obligaciones con consecuencia, sólo una tiene su plazo fijado por una norma.** Exigir un campo llamado «fuente normativa de la periodicidad» para las ocho obliga a dejarlo vacío o a rellenarlo con una norma que no dice lo que se le atribuye. Lo segundo es peor, porque queda con aspecto de dato verificado.

El catálogo construido separa los tres campos. Cada obligación declara de dónde sale su fecha, y `origen_plazo` distingue entre norma, calendario territorial, contrato, factura, institución educativa y práctica recomendada.

**Esto no debilita el diferenciador del producto: lo precisa.** El valor nunca estuvo en poder citar un artículo, sino en que la aplicación sepa cuándo vence cada cosa. Que el plazo del SOAT salga de la póliza y no de la ley no lo hace menos cierto ni menos útil; lo que hace falta es no presentarlo como legal cuando no lo es.

### 12.2 Las 32 tareas recomendadas nunca fueron verificables

Una tarea sin sanción no tiene norma que la respalde. «Cambio de aceite cada 180 días» sale del manual del fabricante; «chequeo médico anual», de recomendación profesional. Contarlas entre las fuentes pendientes de verificar planteaba un objetivo imposible: el número real de fuentes a verificar eran **ocho**, no cuarenta, y las ocho están verificadas.

### 12.3 «Periodicidad en días» es insuficiente

El SOAT vence el mismo día del año siguiente, y 365 días se desplazan un día en cada bisiesto. El predial y la renta no tienen periodicidad relativa en absoluto: vencen en fechas de calendario fijadas por norma territorial, según la comuna del predio en Medellín y según los dos últimos dígitos del NIT en la renta. Y la tecnomecánica no tiene una sola periodicidad, sino una por tipo de vehículo.

El modelo construido usa intervalos de calendario, un desfase para el primer vencimiento y una tabla de calendarios territoriales. El detalle está en `docs/modelo-datos.md` del repositorio de código.

### 12.4 Dos datos que vuelven al documento

La revisión de la Entrega 1 retiró los códigos de infracción **D.2** y **C.35** del cuerpo del documento por haberse tomado de prensa y no del artículo 131 de la Ley 769 de 2002 (ver `docs/entregables/entrega-1/revision.md`, sección 6).

**Quedan confirmados en el texto de la ley**, en el Gestor Normativo de Función Pública:

- **D.2** — «Conducir sin portar los seguros ordenados por la ley. Además, el vehículo será inmovilizado.» Grupo D: **30 SMLDV**.
- **C.35** — «No realizar la revisión técnico-mecánica en el plazo legal establecido o cuando el vehículo no se encuentre en adecuadas condiciones técnico-mecánicas o de emisiones contaminantes, aun cuando porte los certificados correspondientes.» Grupo C: **15 SMLDV**.

El artículo 131 está modificado por el artículo 21 de la Ley 1383 de 2010. Ambos códigos pueden volver al cuerpo del perfil.

### 12.5 Una advertencia para quien vuelva sobre las normas de tránsito

El artículo 12 de la **Ley 1383 de 2010** dice que todo vehículo nuevo se somete a la primera revisión tecnomecánica a los dos años, sin distinguir tipo. **Está superado.** El texto vigente del artículo 52 es el del artículo 179 de la **Ley 2294 de 2023**, y distingue: quinto año para el particular que no sea motocicleta, dos años para servicio público y motocicletas.

Consultar la Ley 1383 sin mirar sus modificaciones posteriores produce un dato falso con aspecto de fuente primaria.
