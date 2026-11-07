# CoderJs

Repositorio correspondiente al proceso de aprendizaje y desarrollo de proyectos en JavaScript durante el curso de **Coderhouse**.

El repositorio reúne las distintas pre-entregas realizadas a lo largo de la cursada, mostrando la evolución progresiva de los conocimientos, conceptos y herramientas incorporados en cada etapa, hasta llegar al proyecto final.

## Estado del proyecto

**Proyecto final**

Se completaron las **10 pre-entregas** del curso y el proyecto se encuentra en su versión final: un simulador de gestión de socios para un gimnasio que integra todas las herramientas de JavaScript trabajadas durante la cursada.

## Sobre el proyecto

El proyecto comenzó como una práctica orientada a los fundamentos de JavaScript, utilizando herramientas básicas como `console.log()`, `alert()`, `prompt()` y otras funcionalidades propias del lenguaje.

A medida que avanzó el curso, se incorporaron nuevos conceptos y herramientas hasta llegar a la integración con el **DOM (Document Object Model)**. Esta etapa permite dejar atrás la interacción basada principalmente en la consola y los cuadros de diálogo del navegador para comenzar a trabajar con una interfaz web interactiva.

De esta manera, el usuario puede ingresar, consultar y modificar información directamente desde la página.

Durante su desarrollo, el proyecto evolucionó hasta convertirse en un prototipo de sistema de gestión de socios para un gimnasio ficticio: **Gimnasio Harry Trotter**.

## Funcionalidades

### Gestión de socios

El sistema permite administrar la información de los socios y realizar las siguientes operaciones:

- Alta de nuevos socios.
- Baja de socios existentes.
- Modificación de los datos de un socio.
- Consulta de información de los socios a través de su ficha.
- Búsqueda y filtrado de socios.
- Consulta de la cuota correspondiente según la categoría.
- Registro de pagos de cuotas y aptos físicos.
- Historial de pagos de cada socio y seguimiento de la recaudación mensual.
- Gestión de autorizaciones de adultos responsables para socios menores de edad.
- Control de acceso al gimnasio según el estado de la cuota, del apto físico y, en el caso de los menores, de la autorización.
- Configuración de los valores de abono por categoría, inscripción y reinscripción.
- Carga inicial de los datos desde un archivo JSON.

Cada socio tiene un número de identificación generado automáticamente a partir del **10000** y una fecha de alta registrada al momento de su incorporación.

Los socios se clasifican en tres categorías según su edad:

| Categoría | Edad |
|---|---|
| Menor | Hasta 17 años |
| Adulto | De 18 a 64 años |
| Senior | 65 años o más |

#### Validación de datos

El formulario de alta y edición incluye las siguientes validaciones:

- Nombre y apellido obligatorios, con caracteres alfabéticos.
- Documento de 7 u 8 dígitos, sin duplicados.
- Correo electrónico con formato válido y sin duplicados.
- Validación de los datos antes de guardar los cambios.
- Aviso automático si la edición de un socio permanece abierta durante más de 10 segundos.
- Confirmación antes de descartar los cambios sin guardar de una edición.
- Atajos de teclado: `Enter` para guardar y `Escape` para cancelar la edición.

Al dar de alta a un socio menor de edad, el sistema recuerda que debe cargarse la autorización de un adulto responsable.

### Ficha del socio

Al hacer clic en el nombre de un socio en la tabla, se abre su ficha con la siguiente información:

- Número de socio.
- Documento.
- Correo electrónico.
- Fecha de nacimiento y edad.
- Fecha de alta.
- Categoría.
- Acceso al gimnasio: **Habilitado** o **Sin acceso**.
- Autorización del adulto responsable:
  - Si el socio es mayor de edad, figura como "No corresponde".
  - Si es menor y no tiene autorización, figura como **Pendiente**.
  - Si es menor y tiene autorización, se muestran el nombre, apellido, documento y correo electrónico del responsable, junto con la fecha en que se cargó.
- **Historial de pagos**, del más reciente al más antiguo, con la fecha de cada pago, el mes abonado, los conceptos cobrados (cuota, inscripción o reinscripción) y el total, además del total pagado y la cantidad de pagos.

Los botones de la ficha dependen de la situación del socio:

| Situación | Botones |
|---|---|
| Mayor de edad | Cerrar |
| Menor sin autorización | Cerrar · Cargar autorización |
| Menor con autorización | Cerrar · Modificar autorización · Anular autorización |

### Autorización de menores

Los socios menores de edad necesitan la autorización de un adulto responsable para acceder al gimnasio.

- La autorización se carga desde la ficha del socio, en un formulario que solicita **nombre**, **apellido**, **documento** y **correo electrónico de contacto** del responsable.
- Los datos se validan con las mismas reglas que el alta de socios: nombre y apellido con caracteres alfabéticos, documento de 7 u 8 dígitos y correo electrónico con formato válido. Si hay un error, se informa dentro del mismo formulario sin cerrarlo.
- La autorización registra automáticamente la fecha en que se cargó.
- Puede **modificarse** en cualquier momento, con los datos actuales precargados.
- Puede **anularse** (por un error de carga o cualquier otra eventualidad), previa confirmación. Al anularla, el socio pierde el acceso hasta que se cargue una nueva.
- Los menores sin autorización se identifican en la tabla con la marca **"Sin autorización"** debajo de su categoría.
- Cuando el socio cumple 18 años, la autorización deja de ser un requisito, ya que la categoría se calcula según la edad.

### Gestión de fechas

Todas las fechas se ingresan y se muestran en formato `DD/MM/AAAA` (por ejemplo, `19/10/2026`).

El sistema contempla:

- Validación de fechas reales, rechazando valores inexistentes como `31/02/2020`.
- Registro de la fecha completa de nacimiento.
- Cálculo de la edad exacta de cada socio.
- Detección de cumpleaños del día, identificados con el símbolo 🎂 en la tabla de socios.

### Cuota mensual y morosidad

La cuota mensual debe abonarse entre el día 1 y el día 5 de cada mes.

El estado de pago de cada socio se calcula automáticamente a partir del último mes abonado:

| Estado | Descripción | Acceso |
|---|---|---|
| Al día | Abonó la cuota del mes actual. | Permitido |
| Pendiente | Abonó el mes anterior y todavía se encuentra dentro del plazo de pago del día 1 al 5. | Permitido |
| Moroso | Venció el plazo de pago sin abonar la cuota, o nunca registró un pago. | Denegado |

Cada socio dispone de un botón **Pago** que permite registrar la cuota mensual correspondiente al monto vigente de su categoría.

Antes de registrar el pago, se muestra un cuadro de confirmación con el detalle de los conceptos a cobrar y el total.

El sistema contempla las siguientes situaciones:

- En el **primer pago** de un socio nuevo se cobra, además de la cuota, la **inscripción**.
- Si el socio dejó pasar **al menos un mes completo sin pagar**, al regularizar su situación abona la **reinscripción** más la cuota del mes actual.
- Los pagos realizados después del día 5 se registran como fuera de término y permiten recuperar el acceso al gimnasio.
- Si la cuota del mes ya está abonada, se informa al usuario y se evita registrar un pago duplicado.
- Si después del pago el socio todavía no tiene acceso (por apto físico vencido o autorización pendiente), la notificación lo indica.
- El estado de pago se calcula automáticamente según la fecha del sistema.

Cada pago registrado se guarda en el **historial del socio** con la fecha, el mes abonado, la categoría, los conceptos y el total cobrado. Como el monto queda guardado, una modificación posterior de los valores de abono no altera los pagos ya realizados.

### Apto físico

El apto físico tiene una validez de un año desde la fecha de presentación.

- Si el apto físico está vigente, el socio cumple con este requisito de acceso.
- Si venció o nunca se presentó uno, el estado figura como **Vencido** y se restringe el acceso.
- Cada socio dispone de un botón **Apto** para registrar un nuevo apto físico.
- También es posible ingresar la fecha de un apto anterior desde el formulario de edición.

### Control de acceso

El acceso al gimnasio depende de tres condiciones:

1. La cuota no debe encontrarse en estado Moroso.
2. El apto físico debe estar vigente.
3. Si el socio es menor de edad, debe tener cargada la autorización de un adulto responsable.

Si alguna de estas condiciones no se cumple, el socio pierde el acceso y su fila se identifica mediante una barra roja en la tabla.

Los estados de cuota, apto físico, autorización y acceso no se almacenan como valores fijos: se calculan a partir de los datos registrados y de la fecha del sistema. De esta manera, se mantienen actualizados automáticamente.

### Abonos y recaudación

El módulo **Abonos y recaudación**, ubicado en la columna derecha, reúne la información contable del gimnasio. Muestra lo **recaudado en el mes** de la fecha del sistema y ofrece dos botones:

**Valores de abono:** abre un cuadro para consultar y modificar los montos vigentes:

- Cuota mensual Menor (hasta 17 años).
- Cuota mensual Adulto (18 a 64 años).
- Cuota mensual Senior (65 años o más).
- Inscripción (se cobra en el primer pago).
- Reinscripción (se cobra tras un mes completo sin pagar).

Los valores se validan dentro del mismo cuadro antes de cerrarlo. Si hubo cambios, se muestra una confirmación con el valor anterior y el nuevo de cada concepto modificado. Los nuevos valores se aplican a los pagos que se registren a partir de su modificación.

**Recaudación:** abre un cuadro con el detalle de los últimos 6 meses, hasta el mes de la fecha del sistema:

| Columna | Descripción |
|---|---|
| Mes | Mes del detalle. El mes actual aparece resaltado. |
| Pagos | Cantidad de pagos cobrados en ese mes. |
| Sin pagar | Cantidad de socios con la cuota de ese mes pendiente o morosa. Solo se cuentan los socios que ya estaban dados de alta en ese mes. |
| Total | Monto total cobrado en ese mes. |

Cada pago se cuenta en el mes en que se cobró. Los pagos de los socios eliminados no se incluyen.

### Simulador de fecha del sistema

Como el proyecto funciona actualmente como un simulador, es posible modificar la fecha del sistema para probar vencimientos y cambios de estado sin necesidad de esperar días reales.

Las opciones disponibles son:

- Avanzar un día.
- Retroceder un día.
- Avanzar un mes.
- Ingresar una fecha específica.
- Volver a la fecha actual.

Esta funcionalidad permite comprobar el comportamiento del sistema frente a vencimientos de cuotas, aptos físicos, cumpleaños y cambios de categoría por edad.

### Resumen del día

El módulo **Resumen del día**, ubicado en la parte superior izquierda de la interfaz, muestra la situación general según la fecha del sistema.

Incluye:

- Estado del período de pago.
- Cantidad de socios con pagos pendientes.
- Cantidad de socios morosos.
- Cantidad de socios con aptos físicos vencidos.
- Cantidad de menores sin autorización.
- Avisos de cumpleaños, visibles únicamente cuando hay socios que cumplen años ese día.

### Notificaciones y confirmaciones

El proyecto integra dos librerías externas, incorporadas mediante CDN, que reemplazan las alertas nativas del navegador:

**Toastify:** muestra notificaciones breves de éxito, error, advertencia e información para cada operación (socio agregado, pago registrado, autorización cargada, errores de validación, etc.).

**SweetAlert2:** muestra cuadros de confirmación y formularios para las acciones importantes:

- Eliminar un socio.
- Restaurar la base de datos.
- Registrar un pago, con el detalle de los conceptos y el total a cobrar.
- Descartar los cambios sin guardar de una edición.
- Consultar la ficha del socio y su historial de pagos.
- Cargar o modificar la autorización de un menor, con validación dentro del formulario.
- Anular la autorización de un menor.
- Consultar y modificar los valores de abono.
- Consultar la recaudación mensual.
- Reintentar o cancelar la carga de datos si se produce un error.

### Búsqueda y filtros

La tabla de socios incorpora herramientas para localizar información rápidamente.

**Buscador:** permite buscar por número de socio, nombre, apellido, documento o correo electrónico.

**Filtros disponibles:**

- Categoría: Menor, Adulto o Senior.
- Estado de cuota: al día, pago pendiente o moroso.
- Estado del apto físico: vencido.
- Acceso al gimnasio: sin acceso.
- Autorización: menores sin autorización.

Además, se muestra un contador con la cantidad de socios visibles respecto del total registrado.

### Carga de datos

Los datos iniciales se encuentran en el archivo **`data/data.json`**, que emula la base de datos del sistema. Incluye:

- Los socios, con su **historial de pagos** y, en el caso de los menores, su **autorización**.
- Los valores de abono vigentes.
- Los conceptos de abono (cuotas por categoría, inscripción y reinscripción), con el nombre y la descripción que se muestran en la interfaz.

La carga funciona de la siguiente manera:

- Al abrir la página, la información se obtiene mediante **`fetch`** con **`async/await`**.
- Mientras los datos cargan, la tabla muestra un indicador de carga y los controles permanecen deshabilitados.
- Si existen cambios guardados en el `localStorage`, se utilizan en lugar de los datos del archivo JSON.
- Los errores de carga (archivo inexistente, respuesta no exitosa o fallas de red) se capturan con un bloque **`try/catch`**. El error se informa en la tabla y mediante un cuadro que permite **reintentar** o **cancelar** la carga.
- Un bloque **`finally`** vuelve a habilitar la interfaz en todos los casos (carga exitosa, error o reintento cancelado), para que nunca quede bloqueada.
- Si la carga falló, el sistema impide guardar cambios hasta que los datos se carguen correctamente, para no sobrescribir la información guardada con datos vacíos. Se puede volver a intentar con el botón **Restaurar DB**.

### Persistencia de datos

Los cambios realizados se almacenan en el `localStorage` del navegador, permitiendo conservar la información al recargar la página.

El sistema incluye las siguientes funcionalidades:

- Guardado automático de los cambios en los datos.
- Persistencia de los socios registrados, su historial de pagos, las autorizaciones de menores y los valores de abono.
- Botón **Restaurar DB** para volver a cargar los datos de `data/data.json` y descartar las modificaciones realizadas, previa confirmación.
- Si la información almacenada no puede leerse, se descarta y se utilizan los datos de `data/data.json`, con un aviso visible para el usuario.
- Los datos guardados con versiones anteriores del proyecto, que no tenían historial de pagos ni autorizaciones, se adaptan automáticamente al cargarse.

> **Nota:** el navegador puede leer el archivo `data/data.json`, pero no modificarlo; para eso sería necesario un servidor. Por ese motivo, los cambios se guardan localmente en el navegador. Esta implementación no utiliza actualmente una base de datos centralizada ni sincroniza la información entre distintos dispositivos.

### Interfaz de usuario

La interfaz está organizada en tres columnas para facilitar el acceso a las principales funcionalidades y reducir el desplazamiento vertical.

| Columna | Contenido |
|---|---|
| Izquierda | Resumen del día y formulario de socios. |
| Centro | Tabla de socios. |
| Derecha | Fecha del sistema, abonos y recaudación, y base de datos. |

Otras características de la interfaz:

- Encabezado con el logo del gimnasio, que también se utiliza como ícono de la pestaña del navegador (favicon).
- Nombre de cada socio como enlace a su ficha.
- Botones de acción de cada socio (Pago, Apto, Editar y Eliminar) agrupados en una grilla de dos por dos.
- Tabla con altura adaptable a la ventana y encabezado fijo durante el desplazamiento.
- Leyenda debajo de la tabla que explica el significado de las filas marcadas en rojo.
- Diseño responsive, adaptable a distintos tamaños de pantalla.
- En pantallas medianas, la columna derecha se ubica debajo de las demás.
- En pantallas pequeñas, el contenido se organiza en una sola columna.
- Resaltado de la fila del socio recién agregado o modificado.

## Objetivo del proyecto

Cada pre-entrega representó una etapa del proceso de aprendizaje y permitió aplicar en el proyecto elegido los contenidos trabajados durante el curso.

Una vez completadas las **10 pre-entregas**, el proyecto final integra todos esos conocimientos en un simulador completo: manipulación del DOM, funciones de orden superior, persistencia con `localStorage`, carga asíncrona de datos con `fetch` y el uso de librerías externas.

## Estructura del repositorio

La estructura del proyecto es la siguiente:

```text
CoderJs/
├── index.html
├── data/
│   └── data.json
├── js/
│   ├── socios.js
│   ├── datos.js
│   └── main.js
├── assets/
│   └── HarryTrotterGymPoster.png
├── css/
│   └── style.css
├── .gitignore
└── README.md
```

El código JavaScript está dividido en tres archivos, cada uno con una responsabilidad:

| Archivo | Contenido |
|---|---|
| `js/socios.js` | Clase `Socio`, manejo de fechas, reglas de cuota, apto físico, autorización y acceso, cálculos de recaudación, validaciones y filtros. |
| `js/datos.js` | Carga de datos desde `data/data.json` con `fetch` y persistencia en el `localStorage`. |
| `js/main.js` | Interfaz: manipulación del DOM, notificaciones, cuadros de diálogo, eventos y arranque de la aplicación. |

Los archivos se cargan en ese orden, ya que `main.js` utiliza funciones de los otros dos e inicia la carga de datos.

## Cómo ejecutar el proyecto

Como los datos se cargan con `fetch` desde `data/data.json`, la página **no funciona si se abre el archivo `index.html` con doble clic**, ya que el navegador bloquea la lectura de archivos locales mediante `file://`.

Es necesario abrirla desde un servidor, por ejemplo:

- **Live Server** en VS Code: clic derecho sobre `index.html` → *Open with Live Server*.
- **GitHub Pages**.

## Tecnologías utilizadas

El proyecto utiliza las siguientes tecnologías y herramientas:

- **HTML:** estructura y contenido de la interfaz web.
- **CSS:** estilos, diseño visual y adaptación a distintos tamaños de pantalla.
- **JavaScript:** lógica de negocio, validaciones, manipulación del DOM, gestión de datos, persistencia con `localStorage` y carga asíncrona con `fetch` y `async/await`.
- **JSON:** archivo de datos que emula la base de datos inicial.
- **[Toastify](https://github.com/apvarun/toastify-js):** notificaciones breves.
- **[SweetAlert2](https://sweetalert2.github.io/):** cuadros de confirmación y formularios.
- **Git:** control de versiones.
- **GitHub:** alojamiento y seguimiento del repositorio.

---
