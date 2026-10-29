# Clipa · Demo local para presentar al cliente

Clipa es un nombre provisional para la idea: las marcas financian campañas de videos cortos, los creadores editan y envían clips, y el administrador verifica resultados y registra pagos.

Esta propuesta implementa los flujos del documento «Flujos de Proceso y Estados del Sistema · MVP 1.0». Está pensada para una presentación interactiva; no es una plataforma de producción.

## Paleta visual

La interfaz utiliza la paleta indicada para el proyecto: azul noche `#0B1020`, negro `#111111`, marfil `#F1EEE7`, amarillo ácido `#D6FF00` y gris neutro `#8C8C8C`. El azul noche estructura la navegación y los bloques destacados; el amarillo identifica acciones y acentos; el marfil sirve como fondo de lectura. Los tonos auxiliares son variaciones neutras para bordes, superficies y contraste. Los tokens se encuentran al inicio de `styles.css`.

## Abrir la demo

1. Abre `Iniciar-demo.cmd`.
2. En el navegador, visita **http://127.0.0.1:4173**.
3. Mantén abierta la ventana del servidor durante la presentación. Para detenerlo, pulsa Ctrl+C en ella.

El servidor utiliza Node.js, ya disponible en el equipo donde se preparó la demo. **No hay que instalar paquetes ni comprar servicios.** También puedes abrir directamente `index.html`; los recursos funcionan sin internet. El guardado en archivos locales depende del navegador, por lo que se recomienda la dirección local. Si Node no está instalado, el lanzador abre `index.html`.

La misma demo abierta con `localhost`, `127.0.0.1` o como archivo tiene guardados separados. Usa siempre la misma dirección y una sola pestaña para presentar. La interfaz no sincroniza pestañas simultáneas.

## Recorrido sugerido · 8–10 minutos

### 1. Descubrir la propuesta

La primera vista es **Creador → Explorar campañas**. Recorre las campañas, busca una marca, cambia de categoría y guarda una favorita. Abre una campaña para ver presupuesto, tarifa, mínimos, topes y reglas. En «Ver kit creativo» se pueden descargar un visual SVG y un brief de muestra.

### 2. Crear y financiar una campaña

En el selector de la esquina superior derecha, cambia a **Marca**. Pulsa «Crear campaña». Puedes guardarla como borrador, editarla después o enviarla. Al enviarla queda bloqueada y oculta para los creadores, con instrucciones bancarias ficticias y una referencia única.

Pulsa «Verificar como administrador» o cambia a **Administrador → Fondeo de campañas**. Confirma el monto recibido y activa la campaña. Ya aparecerá para los creadores. El monto debe coincidir con el presupuesto; los depósitos parciales y excedentes quedan fuera de esta demo.

### 3. Enviar y auditar un clip

Cambia a **Creador**, abre la campaña y pulsa «Enviar mi clip». Usa «Usar enlace de ejemplo», marca la aceptación del brief y envía. Se eliminan parámetros de rastreo y se comprueban duplicados en toda la plataforma, por identificador de video.

Cambia a **Administrador → Revisar clips**, abre el nuevo envío, introduce las visualizaciones y marca las verificaciones. La vista previa muestra el importe exacto. Al aprobar, el monto se descuenta del presupuesto y se refleja en la billetera del creador. Las actualizaciones posteriores requieren que pasen 48 horas del reloj simulado y remuneran solo el incremento, hasta el tope por video y el presupuesto disponible.

### 4. Completar un pago

Abre **Explorar la demo** en el menú lateral y pulsa **+14 días**. En **Creador → Mi billetera**, solicita el retiro y confirma: los fondos quedan reservados y no pueden retirarse otra vez.

En **Administrador → Pagos a creadores**, procesa la solicitud, confirma la revisión final y pulsa «Generar comprobante ficticio». Marca el pago como completado. Abre el comprobante y la vista previa del correo; puedes descargar un resumen en TXT.

### 5. Mostrar un caso de cuarentena

El clip inicial «Un café, mil ideas» está en cuarentena. Desde **Creador → Mis clips**, abre su alerta y adjunta una prueba de ejemplo antes de avanzar más de 48 horas. En **Administrador**, revisa las analíticas y aprueba o rechaza.

Si transcurren 48 horas sin pruebas, no se permiten nuevos adjuntos. El administrador debe cerrar el caso; no hay rechazo automático. El rechazo desde cuarentena suma un strike al creador de ejemplo. La bitácora muestra la decisión y el perfil conserva el conteo.

Para una reversión, abre la auditoría del clip inicial «De grano a historia» antes de liberar sus fondos. Pulsa «Revocar ganancias». El importe vuelve al presupuesto de la campaña.

### 6. Cerrar la presentación

En **Marca → Resultados** puedes mostrar métricas calculadas con las auditorías y descargar un CSV. Usa **Explorar la demo → Reiniciar demo** para recuperar el escenario inicial. El reinicio pide una confirmación porque elimina los cambios locales de esta demostración.

## Qué funciona

- Tres perfiles intercambiables, navegación, búsqueda, categorías y favoritos.
- Campañas en borrador, esperando fondos, activas, pausadas, agotadas y completadas.
- Presupuestos y ganancias calculados en centavos, sin saldos negativos ni redondeos flotantes de dinero.
- URLs completas de TikTok, Instagram Reels y YouTube Shorts; limpieza de rastreo y detección global de duplicados.
- Envíos, revisión, aprobación, cuarentena, pruebas y rechazo.
- Conteos incrementales cada 48 horas, mínimo de vistas, máximo por video y límite por presupuesto.
- Congelación de fondos retenidos durante cuarentena y reversión al presupuesto.
- Retención de 14 días por abono, saldo disponible, reserva del retiro, pago y comprobante.
- Resultados, notificaciones locales, bitácora, descargas y reloj de demostración.
- Diseño adaptable a escritorio y móvil, navegación por teclado, diálogos con manejo de foco y movimiento reducido.
- Guardado en `localStorage`, sin base de datos ni dependencias externas.

## Alcance de la simulación

Todos los valores son **USD ficticios**. No hay usuarios reales, autenticación, permisos de servidor, API de redes sociales, verificación automática de tráfico, scraping, pagos, bancos, correos ni conexión con Google Drive. Los links no se abren automáticamente. Los perfiles solo cambian la perspectiva de la misma demostración.

Los visuales de campaña son ilustraciones SVG incluidas en el proyecto. La vista de un clip es una maqueta, no un reproductor de contenido real. Los adjuntos guardan **solo nombre y fecha**, no los bytes del archivo. El comprobante y correo son vistas locales; la descarga es un resumen TXT sin validez bancaria. No ingreses datos personales o financieros reales.

El saldo inicial del creador tiene **184 USD disponibles** y **60 USD retenidos**. La fecha inicial es **28 de octubre de 2026**, a las 12:00 de Colombia. El reloj solo avanza mediante los controles de demo. No hay tareas en segundo plano; las transiciones se evalúan al avanzar el reloj, cargar la app o realizar una acción.

El código guarda datos bajo `clipa-demo-v1` y preferencias bajo `clipa-demo-ui-v1`. Borrar los datos del sitio elimina el escenario. No se cargan fuentes remotas, imágenes externas ni telemetría.

## Decisiones de producto adoptadas

El documento describe la retención tanto desde la aprobación como desde el fin de acumulación. Para presentar un comportamiento consistente, esta demo usa **abonos independientes**: cada aprobación o incremento comienza sus propios 14 días. Los incrementos nunca se liberan antes por la antigüedad del primer abono. Durante cuarentena, los fondos se congelan; al aprobar las pruebas, sus 14 días vuelven a comenzar.

El documento menciona una tarifa del creador y una de la marca sin definir comisión. Aquí se usa **una sola tarifa CPM**, de modo que el débito de la marca coincide con el crédito al creador. La comisión y la conversión USD/COP quedan por definir.

Se admiten nuevas auditorías cuando la campaña está activa; una revisión inicial pendiente puede aprobarse con la campaña pausada. Los nuevos envíos se bloquean al pausar. Solo administración puede reanudar.

Las ganancias con menos del mínimo de vistas son cero hasta una actualización válida. Si el importe supera el saldo restante de la campaña, se asigna únicamente el saldo disponible. Cuando se agota el presupuesto, la campaña pasa a agotada. Se completa cuando no quedan abonos retenidos o congelados; los retiros pueden seguir pendientes.

La reversión y congelación se limitan a clips cuyos abonos aún están retenidos. La recuperación de dinero ya liberado o pagado requeriría un flujo adicional en la versión real. El rechazo es definitivo para ese enlace.

Los días de pago 1 y 15 se comunican en pantalla. Para facilitar la presentación, el administrador puede simular pagos cualquier día. No se aplican suspensión automática por strikes, edición posterior al fondeo ni comisión de servicio, porque el alcance no define esas reglas.

## Archivos

- `index.html`: entrada de la aplicación.
- `styles.css`: diseño y adaptación a pantallas.
- `app.js`: vistas, formularios, navegación y guardado local.
- `engine.js`: reglas y transiciones de negocio independientes de la interfaz.
- `assets/`: ilustraciones y favicon locales.
- `server.cjs`: servidor estático restringido a `127.0.0.1`.
- `Iniciar-demo.cmd`: acceso de inicio en Windows.
- `tests/engine.test.cjs`: 25 pruebas de reglas de negocio con el ejecutor integrado de Node.js.

## Verificación realizada

Ejecuta `npm test` para las 25 pruebas de saldos, límites, duplicados, estados, cuarentena, retenciones y pagos. `npm run check` comprueba la sintaxis. Ninguno de los comandos instala paquetes.

Se probó además en navegador el recorrido completo entre perfiles: creación, fondeo, envío, aprobación, avance de 14 días, retiro, pago y comprobante/correo de ejemplo. También se verificaron la entrega y aprobación de pruebas de cuarentena, la persistencia al recargar y el diseño a 1440 y 390 píxeles, sin desbordamiento horizontal de página ni del diálogo de retiro.

Para un desarrollo posterior, estas pantallas sirven como prototipo funcional. La versión con datos y dinero reales requiere autenticación, base de datos, registro de auditoría en servidor, almacenamiento de archivos y decisiones operativas y de pagos.
