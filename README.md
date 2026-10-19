CoderJs

Repositorio correspondiente al proceso de aprendizaje y desarrollo de proyectos en JavaScript durante el curso.
El repositorio reúne las distintas pre-entregas realizadas a lo largo de la cursada, mostrando la evolución progresiva de los conocimientos, conceptos y herramientas incorporados en cada etapa.

Estado del proyecto

En desarrollo
Actualmente se encuentra realizada la Pre-Entrega 7 de 10.

Sobre el proyecto

El proyecto comenzó como una práctica orientada a los fundamentos de JavaScript, utilizando inicialmente herramientas básicas como console.log, alert, prompt y otras funcionalidades propias del lenguaje.
A medida que avanzó el curso, el proyecto fue evolucionando mediante la incorporación de nuevos conceptos y herramientas, llegando actualmente a una etapa de integración con el DOM (Document Object Model).
Esta nueva etapa permite dejar atrás la interacción basada principalmente en la consola y los cuadros de diálogo del navegador para comenzar a trabajar con una interfaz web interactiva, donde el usuario puede ingresar, consultar y modificar información directamente desde la página.
Durante el desarrollo, el proyecto evolucionó hasta convertirse en un prototipo de sistema de gestión de socios para un gimnasio: Gimnasio Harry Trotter.

El objetivo es desarrollar una plataforma que permita al personal del gimnasio administrar la información de sus socios y realizar diferentes operaciones, entre ellas:

El objetivo es desarrollar una plataforma que permita al personal del gimnasio administrar la información de sus socios y realizar diferentes operaciones, entre ellas:

Alta de nuevos socios.
Baja de socios existentes.
Modificación de los datos de un socio.
Consulta de información de los socios.
Búsqueda y filtrado de socios.
Consulta de la cuota correspondiente según la categoría del socio.
Registro de pagos de cuota y de aptos físicos.
Control de acceso según el estado de la cuota y del apto físico.
Configuración de los valores de abono por categoría.

Actualmente, los socios se clasifican en tres categorías según su edad:
Menor (Hasta 17 años)
Adulto (De 18 a 64 años)
Senior (65 años o más)

Gestión de socios
Formulario para dar de alta socios nuevos y editar los existentes, con validación de cada campo: nombre y apellido solo con letras, documento de 7 u 8 dígitos sin repetir, email con formato válido y sin repetir.
Cada socio tiene un número de socio que se genera automáticamente a partir del 10000.
Al dar de alta un socio se registra automáticamente su fecha de alta.
Aviso automático si la edición de un socio queda abierta más de 10 segundos.
Atajos de teclado en el formulario: Enter para guardar y Escape para cancelar la edición.

Fechas
Todas las fechas se cargan y se guardan con el formato DD/MM/AAAA (por ejemplo, 19/10/2026).
Se valida que la fecha exista realmente (por ejemplo, se rechaza el 31/02/2020).
La fecha de nacimiento es completa (ya no solo el año). Con ella se calcula la edad exacta de cada socio y se detectan los cumpleaños del día, que se marcan con 🎂 en la tabla.

Cuota mensual y morosos
La cuota se paga del 1 al 5 de cada mes. A partir de la fecha del último pago, cada socio tiene uno de estos estados:

Al día	Pagó la cuota del mes actual.	Sí
Pendiente	Pagó el mes anterior y todavía está dentro del plazo (día 1 al 5).	Sí
Moroso	Se pasó el plazo sin pagar, o nunca registró un pago.	No

Cada socio tiene un botón Pago que registra la cuota del mes con el monto de su categoría.
Si el pago se hace después del día 5, se registra como fuera de término y el socio recupera el acceso.
Si la cuota del mes ya está paga, el sistema avisa en lugar de registrar un pago duplicado.

Apto físico
El apto físico tiene una validez de un año desde la fecha en que se presentó.
Si se vence, o si el socio nunca presentó uno, figura como Vencido y pierde el acceso al gimnasio.
Cada socio tiene un botón Apto para registrar un apto nuevo. También se puede cargar la fecha de un apto anterior desde el formulario de edición.

Control de acceso
Un socio tiene acceso al gimnasio solo si su cuota no está en estado Moroso y su apto físico está vigente. Las filas de los socios sin acceso se marcan con una barra roja en la tabla.
Los estados no se guardan: se calculan cada vez a partir de las fechas, así que siempre están actualizados según el día.

Valores de abono
Módulo para modificar el monto mensual de cada categoría (Menor, Adulto y Senior).
Los nuevos valores se aplican a los pagos que se registren a partir de ese momento.

Fecha del sistema (simulador)
Como el proyecto actualmente es un simulador, la fecha con la que trabaja se puede modificar para probar los vencimientos sin esperar días reales:
Avanzar o retroceder un día.
Avanzar un mes.
Escribir una fecha puntual.
Volver a la fecha de hoy.

Avisos
Módulo ubicado en la parte superior izquierda que reúne:
Los mensajes de cada operación: éxito, error, aviso o información.
Un resumen del día con el estado del período de pago, la cantidad de socios con pago pendiente, morosos y con apto vencido.
Los cumpleaños del día. Este aviso solo aparece si algún socio cumple años.

Búsqueda y filtros
Buscador por número de socio, nombre, apellido, documento o email.
Filtro por categoría de socio.
Filtro por estado: al día, pago pendiente, morosos, apto vencido o sin acceso.
Contador de socios mostrados sobre el total.

Persistencia de datos
Los socios y los valores de abono se guardan en el localStorage del navegador, por lo que se mantienen al recargar la página.
Botón Restaurar DB para volver a cargar los socios y valores de ejemplo, descartando todos los cambios.
Si los datos guardados no se pueden leer, el sistema restaura automáticamente los datos de ejemplo y lo informa en pantalla.

Interfaz
Diseño en tres columnas para reducir el scroll:
Izquierda: avisos y formulario de socio.
Centro: tabla de socios.
Derecha: fecha del sistema, valores de abono y base de datos.
La tabla ajusta su alto a la ventana y mantiene el encabezado fijo al desplazarse.
Diseño adaptable a distintos tamaños de pantalla: en pantallas medianas la columna derecha pasa abajo, y en pantallas chicas todo se ubica en una sola columna.
Resaltado de la fila del socio recién agregado o modificado.

Evolución futura
Como parte de la evolución futura del proyecto, se prevé:
Incorporar un historial de pagos por socio, para consultar la recaudación mensual.
Gestionar los servicios asociados a cada abono, pudiendo determinar automáticamente las prestaciones disponibles según la categoría del socio.
Gestionar la autorización de adultos responsables para los socios menores de edad.
Permitir que los usuarios de la plataforma puedan consultar y modificar los servicios o abonos asociados a su cuenta.

Objetivo del proyecto

Cada pre-entrega representa una etapa del proceso de aprendizaje y permite aplicar en el proyecto elegido, los contenidos trabajados durante el curso.
El objetivo actual es completar las 10 pre-entregas previstas y, posteriormente, utilizar los conocimientos adquiridos para desarrollar el Trabajo Final.

Estructura del repositorio
~~~text
CoderJs/
│
│── index.html
├──js/
│  └── main.js
├──css/
│  └── style.css
│
├── .gitignore
└── README.md
~~~
La estructura irá creciendo a medida que se incorporen las siguientes pre-entregas.

Tecnologías

Actualmente el proyecto utiliza:

HTML
CSS
JavaScript
Git
GitHub




