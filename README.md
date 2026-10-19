# CoderJs

Repositorio correspondiente al proceso de aprendizaje y desarrollo de proyectos en JavaScript durante el curso de **Coderhouse**.

El repositorio reúne las distintas pre-entregas realizadas a lo largo de la cursada, mostrando la evolución progresiva de los conocimientos, conceptos y herramientas incorporados en cada etapa.

## Estado del proyecto

**En desarrollo**

Actualmente se encuentra realizada la **Pre-Entrega 9 de 10**.

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
- Consulta de información de los socios.
- Búsqueda y filtrado de socios.
- Consulta de la cuota correspondiente según la categoría.
- Registro de pagos de cuotas y aptos físicos.
- Control de acceso al gimnasio según el estado de la cuota y del apto físico.
- Configuración de los valores de abono por categoría.

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
- Atajos de teclado: `Enter` para guardar y `Escape` para cancelar la edición.

### Gestión de fechas

Todas las fechas se ingresan y se muestran en formato `DD/MM/AAAA` (por ejemplo, `19/10/2026`).

El sistema contempla:

- Validación de fechas reales, rechazando valores inexistentes como `31/02/2020`.
- Registro de la fecha completa de nacimiento.
- Cálculo de la edad exacta de cada socio.
- Detección de cumpleaños del día, identificados con el símbolo 🎂 en la tabla de socios.

### Cuota mensual y morosidad

La cuota mensual debe abonarse entre el día 1 y el día 5 de cada mes.

El estado de pago de cada socio se calcula automáticamente a partir de la fecha del último pago:

| Estado | Descripción | Acceso |
|---|---|---|
| Al día | Abonó la cuota del mes actual. | Permitido |
| Pendiente | Abonó el mes anterior y todavía se encuentra dentro del plazo de pago del día 1 al 5. | Permitido |
| Moroso | Venció el plazo de pago sin abonar la cuota, o nunca registró un pago. | Denegado |

Cada socio dispone de un botón **Pago** que permite registrar la cuota mensual correspondiente al monto vigente de su categoría.

El sistema contempla las siguientes situaciones:

- Los pagos realizados después del día 5 se registran como fuera de término y permiten recuperar el acceso al gimnasio.
- Si la cuota del mes ya está abonada, se informa al usuario y se evita registrar un pago duplicado.
- El estado de pago se calcula automáticamente según la fecha del sistema.

### Apto físico

El apto físico tiene una validez de un año desde la fecha de presentación.

- Si el apto físico está vigente, el socio cumple con este requisito de acceso.
- Si venció o nunca se presentó uno, el estado figura como **Vencido** y se restringe el acceso.
- Cada socio dispone de un botón **Apto** para registrar un nuevo apto físico.
- También es posible ingresar la fecha de un apto anterior desde el formulario de edición.

### Control de acceso

El acceso al gimnasio depende de dos condiciones:

1. La cuota no debe encontrarse en estado Moroso.
2. El apto físico debe estar vigente.

Si alguna de estas condiciones no se cumple, el socio pierde el acceso y su fila se identifica mediante una barra roja en la tabla.

Los estados de cuota, apto físico y acceso no se almacenan como valores fijos: se calculan a partir de las fechas registradas y de la fecha del sistema. De esta manera, se mantienen actualizados automáticamente.

### Valores de abono

El sistema incluye un módulo para configurar el monto mensual de cada categoría:

- Menor.
- Adulto.
- Senior.

Los nuevos valores se aplican a los pagos que se registren a partir de su modificación.

### Simulador de fecha del sistema

Como el proyecto funciona actualmente como un simulador, es posible modificar la fecha del sistema para probar vencimientos y cambios de estado sin necesidad de esperar días reales.

Las opciones disponibles son:

- Avanzar un día.
- Retroceder un día.
- Avanzar un mes.
- Ingresar una fecha específica.
- Volver a la fecha actual.

Esta funcionalidad permite comprobar el comportamiento del sistema frente a vencimientos de cuotas, aptos físicos y cumpleaños.

### Sistema de avisos

El módulo de avisos, ubicado en la parte superior izquierda de la interfaz, reúne la información relevante para el usuario.

Incluye:

- Mensajes de éxito, error, advertencia e información para cada operación.
- Resumen diario del estado del período de pago.
- Cantidad de socios con pagos pendientes.
- Cantidad de socios morosos.
- Cantidad de socios con aptos físicos vencidos.
- Avisos de cumpleaños, visibles únicamente cuando hay socios que cumplen años ese día.

### Búsqueda y filtros

La tabla de socios incorpora herramientas para localizar información rápidamente.

**Buscador:** permite buscar por número de socio, nombre, apellido, documento o correo electrónico.

**Filtros disponibles:**

- Categoría: Menor, Adulto o Senior.
- Estado de cuota: al día, pendiente o moroso.
- Estado del apto físico: vencido.
- Acceso al gimnasio: con acceso o sin acceso.

Además, se muestra un contador con la cantidad de socios visibles respecto del total registrado.

### Persistencia de datos

La información se almacena en el `localStorage` del navegador, permitiendo conservar los socios y los valores de abono al recargar la página.

El sistema incluye las siguientes funcionalidades:

- Guardado automático de los cambios en los datos.
- Persistencia de los socios registrados y de los valores de abono.
- Botón **Restaurar DB** para recuperar los datos de ejemplo y descartar las modificaciones realizadas.
- Recuperación automática de los datos de ejemplo si la información almacenada no puede leerse, con un aviso visible para el usuario.

> **Nota:** los datos se almacenan localmente en el navegador. Esta implementación no utiliza actualmente una base de datos centralizada ni sincroniza la información entre distintos dispositivos.

### Interfaz de usuario

La interfaz está organizada en tres columnas para facilitar el acceso a las principales funcionalidades y reducir el desplazamiento vertical.

| Columna | Contenido |
|---|---|
| Izquierda | Avisos y formulario de socios. |
| Centro | Tabla de socios. |
| Derecha | Fecha del sistema, valores de abono y base de datos. |

Otras características de la interfaz:

- Tabla con altura adaptable a la ventana y encabezado fijo durante el desplazamiento.
- Diseño responsive, adaptable a distintos tamaños de pantalla.
- En pantallas medianas, la columna derecha se ubica debajo de las demás.
- En pantallas pequeñas, el contenido se organiza en una sola columna.
- Resaltado de la fila del socio recién agregado o modificado.

## Evolución futura

Como parte de la evolución del proyecto, se prevé incorporar nuevas funcionalidades:

- **Historial de pagos:** registrar y consultar los pagos realizados por cada socio, facilitando el seguimiento de la recaudación mensual.
- **Gestión de servicios:** asociar prestaciones a cada abono y determinar automáticamente cuáles están disponibles según la categoría del socio.
- **Autorización de menores:** gestionar las autorizaciones de adultos responsables para socios menores de edad.
- **Autogestión de socios:** permitir que los usuarios consulten y modifiquen los servicios o abonos asociados a sus cuentas.

Estas funcionalidades forman parte de la planificación futura y no necesariamente se encuentran implementadas en la versión actual.

## Objetivo del proyecto

Cada pre-entrega representa una etapa del proceso de aprendizaje y permite aplicar en el proyecto elegido los contenidos trabajados durante el curso.

El objetivo actual es completar las **10 pre-entregas previstas** y, posteriormente, utilizar los conocimientos adquiridos para desarrollar el Trabajo Final.

## Estructura del repositorio

La estructura actual del proyecto es la siguiente:

```text
CoderJs/
├── index.html
├── js/
│   └── main.js
├── css/
│   └── style.css
├── .gitignore
└── README.md
```

La estructura irá creciendo a medida que se incorporen las siguientes pre-entregas y nuevas funcionalidades.

## Tecnologías utilizadas

Actualmente, el proyecto utiliza las siguientes tecnologías y herramientas:

- **HTML:** estructura y contenido de la interfaz web.
- **CSS:** estilos, diseño visual y adaptación a distintos tamaños de pantalla.
- **JavaScript:** lógica de negocio, validaciones, manipulación del DOM y gestión de datos.
- **Git:** control de versiones.
- **GitHub:** alojamiento y seguimiento del repositorio.

---

