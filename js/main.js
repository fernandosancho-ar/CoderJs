//// main.js: interfaz (DOM), notificaciones, eventos y arranque de la aplicación

//// Colores de las notificaciones Toastify y de los botones SweetAlert2
const coloresNotificacion = { exito: "#16a34a", error: "#dc2626", aviso: "#d97706", info: "#2563eb" };
const colorPrincipal = "#f97316";
const colorPeligro = "#dc2626";
const colorCancelar = "#64748b";

//// Función para mostrar una notificación con Toastify
function notificar(texto, tipo) {
    Toastify({
        text: texto,
        duration: tipo === "error" ? 6000 : 4000,
        gravity: "top",
        position: "left",
        close: true,
        stopOnFocus: true,
        style: { background: coloresNotificacion[tipo] }
    }).showToast();
}

//// Función para pedir una confirmación con SweetAlert2. Devuelve true si el usuario acepta
async function confirmar({ titulo, html, icono = "question", textoConfirmar, peligro = false, textoCancelar = "Cancelar" }) {
    const resultado = await Swal.fire({
        title: titulo,
        html: html,
        icon: icono,
        showCancelButton: true,
        confirmButtonText: textoConfirmar,
        cancelButtonText: textoCancelar,
        confirmButtonColor: peligro ? colorPeligro : colorPrincipal,
        cancelButtonColor: colorCancelar,
        reverseButtons: true,
        focusCancel: peligro
    });
    return resultado.isConfirmed;
}

//// Función que arma una tabla de conceptos y montos para mostrar en los cuadros de confirmación
function crearDesglose(conceptos, total) {
    const filas = conceptos
        .map(({ detalle, monto }) => `<tr><td>${detalle}</td><td>${formatearMonto(monto)}</td></tr>`)
        .join("");
    return `
        <table class="desglose">
            ${filas}
            <tr class="desglose-total"><td>Total</td><td>${formatearMonto(total)}</td></tr>
        </table>
    `;
}

//// Función para limpiar los inputs del formulario
function limpiarFormulario() {
    inputNombre.value = "";
    inputApellido.value = "";
    inputNacimiento.value = "";
    inputDocumento.value = "";
    inputEmail.value = "";
    inputApto.value = "";
    inputNombre.focus();
}

//// Función para leer los valores del formulario 
function leerFormulario() {
    return {
        nombre: inputNombre.value,
        apellido: inputApellido.value,
        fechaNacimiento: inputNacimiento.value,
        documento: inputDocumento.value,
        email: inputEmail.value.toLowerCase(),
        fechaApto: inputApto.value
    };
}

//// Función para actualizar el título y los botones según el modo del formulario 
function actualizarModoFormulario() {
    const editando = socioEditando !== null;
    tituloFormulario.innerHTML = editando ? `Editando socio N° ${socioEditando.id}` : "Nuevo socio";
    botonGuardar.innerHTML = editando ? "Guardar cambios" : "+ Agregar socio";
    botonCancelar.hidden = !editando;
}

//// Función para saber si el formulario tiene cambios sin guardar mientras se edita un socio
function hayCambiosSinGuardar() {
    if (socioEditando === null) {
        return false;
    }
    const { nombre, apellido, fechaNacimiento, documento, email, fechaApto } = leerFormulario();
    return nombre !== socioEditando.nombre ||
        apellido !== socioEditando.apellido ||
        fechaNacimiento !== socioEditando.fechaNacimiento ||
        documento !== socioEditando.numDocumento ||
        email !== socioEditando.email ||
        fechaApto !== (socioEditando.fechaUltimoApto ?? "");
}

//// Función que pide confirmación antes de descartar cambios sin guardar.
async function confirmarDescarteDeCambios() {
    if (!hayCambiosSinGuardar()) {
        return true;
    }
    return await confirmar({
        titulo: "¿Descartar los cambios?",
        html: `Modificaste datos del socio N° ${socioEditando.id} que todavía no guardaste.`,
        icono: "warning",
        textoConfirmar: "Descartar cambios",
        textoCancelar: "Seguir editando",
        peligro: true
    });
}

//// Función para pasar el formulario a modo edición con los datos del socio elegido
async function iniciarEdicion(id) {
    if (!(await confirmarDescarteDeCambios())) {
        return;
    }
    socioEditando = socios.find((socio) => socio.id === id);
    const { nombre, apellido, fechaNacimiento, numDocumento, email, fechaUltimoApto } = socioEditando;
    inputNombre.value = nombre;
    inputApellido.value = apellido;
    inputNacimiento.value = fechaNacimiento;
    inputDocumento.value = numDocumento;
    inputEmail.value = email;
    inputApto.value = fechaUltimoApto ?? "";
    actualizarModoFormulario();
    notificar(`Editando a ${nombre} ${apellido}. Modificá los datos y presioná "Guardar cambios".`, "info");
    inputNombre.focus();
    clearTimeout(temporizadorEdicion);
    temporizadorEdicion = setTimeout(() => {
        notificar(`La edición del socio N° ${id} sigue abierta. Guardá o cancelá los cambios para evitar modificaciones involuntarias.`, "aviso");
    }, 10000);
}

//// Función para volver el formulario a modo "agregar"
function salirDeEdicion() {
    clearTimeout(temporizadorEdicion);
    socioEditando = null;
    actualizarModoFormulario();
    limpiarFormulario();
}

//// Función para cancelar la edición sin guardar cambios
async function cancelarEdicion() {
    if (!(await confirmarDescarteDeCambios())) {
        return;
    }
    salirDeEdicion();
    notificar("Se canceló la edición. No se guardaron cambios.", "aviso");
}

//// Función para guardar el formulario 
function guardarSocio() {
    if (!datosCargados) {
        notificar("No se pueden guardar cambios porque los datos no se cargaron. Usá el botón Restaurar DB para reintentar.", "error");
        return;
    }
    const { nombre, apellido, fechaNacimiento, documento, email, fechaApto } = leerFormulario();
    const idExcluido = socioEditando?.id ?? null;
    const error = validarDatos(nombre, apellido, fechaNacimiento, documento, email, fechaApto, idExcluido);
    if (error !== "") {
        notificar(error, "error");
        return;
    }
    if (socioEditando === null) {
        const nuevoSocio = new Socio(
            generarNuevoId(socios),
            nombre,
            apellido,
            fechaNacimiento,
            documento,
            email,
            fechaATexto(fechaSistema),
            fechaApto === "" ? null : fechaApto,
            null,   // fechaUltimoPago
            null    // ultimoMesPago
        );
        socios.push(nuevoSocio);
        idResaltado = nuevoSocio.id;
        notificar(`Se agregó a ${nombre} ${apellido} como socio N° ${nuevoSocio.id}. Registrá el primer pago (incluye inscripción) con el botón "Pago".`, "exito");
    } else {
        socioEditando.nombre = nombre;
        socioEditando.apellido = apellido;
        socioEditando.fechaNacimiento = fechaNacimiento;
        socioEditando.numDocumento = documento;
        socioEditando.email = email;
        socioEditando.fechaUltimoApto = fechaApto === "" ? null : fechaApto;
        idResaltado = socioEditando.id;
        notificar(`Se guardaron los cambios del socio N° ${socioEditando.id}.`, "exito");
    }
    guardarSocios();
    salirDeEdicion();
    aplicarFiltros();
}

//// Función para eliminar un socio por su número de socio, previa confirmación
async function eliminarSocio(id) {
    const socioEncontrado = socios.find((socio) => socio.id === id);
    const { nombre, apellido } = socioEncontrado;
    const confirmado = await confirmar({
        titulo: "¿Eliminar socio?",
        html: `Se va a eliminar a <strong>${nombre} ${apellido}</strong> (socio N° ${id}).<br>Esta acción no se puede deshacer.`,
        icono: "warning",
        textoConfirmar: "Sí, eliminar",
        peligro: true
    });
    if (!confirmado) {
        return;
    }
    if (socioEditando?.id === id) {
        salirDeEdicion();
    }
    const posicion = socios.indexOf(socioEncontrado);
    socios.splice(posicion, 1);
    guardarSocios();
    aplicarFiltros();
    notificar(`Se eliminó al socio N° ${id}, ${nombre} ${apellido}.`, "aviso");
}

//// Función para registrar el pago de la cuota del mes actual.
async function registrarPago(id) {
    const socio = socios.find((socioRegistrado) => socioRegistrado.id === id);
    const { nombre, apellido } = socio;
    if (estadoCuota(socio, fechaSistema) === "Al día") {
        notificar(`${nombre} ${apellido} ya tiene paga la cuota de ${nombreMes(fechaSistema)}.`, "aviso");
        return;
    }
    const categoria = categoriaCuota(calcularEdad(socio, fechaSistema));
    const conceptos = [{ detalle: `Cuota ${categoria} de ${nombreMes(fechaSistema)}`, monto: precios[categoria] }];
    if (requiereInscripcion(socio)) {
        conceptos.push({ detalle: "Inscripción", monto: precios.Inscripcion });
    }
    if (requiereReinscripcion(socio, fechaSistema)) {
        conceptos.push({ detalle: "Reinscripción", monto: precios.Reinscripcion });
    }
    const total = conceptos.reduce((suma, { monto }) => suma + monto, 0);
    const confirmado = await confirmar({
        titulo: "Registrar pago",
        html: `<p>${nombre} ${apellido} · Socio N° ${id}</p>${crearDesglose(conceptos, total)}`,
        textoConfirmar: `Cobrar ${formatearMonto(total)}`
    });
    if (!confirmado) {
        return;
    }
    const estabaMoroso = estadoCuota(socio, fechaSistema) === "Moroso" && !requiereInscripcion(socio);
    socio.ultimoMesPago = numeroAMes(numeroDeMes(fechaSistema));
    socio.fechaUltimoPago = fechaATexto(fechaSistema);
    idResaltado = id;
    guardarSocios();
    aplicarFiltros();
    let detalleAcceso = "";
    if (aptoVencido(socio, fechaSistema)) {
        detalleAcceso = " Todavía no tiene acceso: el apto físico está vencido.";
    } else if (estabaMoroso) {
        detalleAcceso = " Se rehabilita el acceso.";
    }
    notificar(`Pago registrado: ${nombre} ${apellido}, ${formatearMonto(total)}.${detalleAcceso}`, "exito");
}

//// Función para registrar un apto físico nuevo con la fecha del sistema
function registrarApto(id) {
    const socio = socios.find((socioRegistrado) => socioRegistrado.id === id);
    const { nombre, apellido } = socio;
    socio.fechaUltimoApto = fechaATexto(fechaSistema);
    idResaltado = id;
    guardarSocios();
    aplicarFiltros();
    notificar(`Se registró el apto físico de ${nombre} ${apellido}. Vence el ${fechaATexto(vencimientoApto(socio))}.`, "exito");
}

//// Función para cambiar la fecha con la que se trabaja
function cambiarFechaSistema(nuevaFecha) {
    fechaSistema = nuevaFecha;
    inputFechaSistema.value = fechaATexto(fechaSistema);
    aplicarFiltros();
}

//// Función para aplicar la fecha escrita en el input
function aplicarFechaEscrita() {
    const texto = inputFechaSistema.value;
    if (!esFechaValida(texto)) {
        notificar("La fecha del sistema no es válida. Usá el formato DD/MM/AAAA.", "error");
        inputFechaSistema.value = fechaATexto(fechaSistema);
        return;
    }
    cambiarFechaSistema(textoAFecha(texto));
    notificar(`Fecha del sistema: ${texto}.`, "info");
}

//// Función para mover la fecha del sistema x días
function moverDias(cantidad) {
    const nuevaFecha = new Date(fechaSistema);
    nuevaFecha.setDate(nuevaFecha.getDate() + cantidad);
    cambiarFechaSistema(nuevaFecha);
}

//// Función para avanzar un mes 
function avanzarMes() {
    const dia = fechaSistema.getDate();
    let nuevaFecha = new Date(fechaSistema.getFullYear(), fechaSistema.getMonth() + 1, dia);
    if (nuevaFecha.getDate() !== dia) {
        nuevaFecha = new Date(fechaSistema.getFullYear(), fechaSistema.getMonth() + 2, 0);
    }
    cambiarFechaSistema(nuevaFecha);
}

//// Función para mostrar el resumen del día
function actualizarResumen() {
    const pendientes = filtrarPorEstado(socios, "Pendiente").length;
    const morosos = filtrarPorEstado(socios, "Moroso").length;
    const aptosVencidos = filtrarPorEstado(socios, "apto-vencido").length;
    const cumpleaneros = socios.filter((socio) => cumpleAnios(socio, fechaSistema));
    const periodo = fechaSistema.getDate() <= diaLimitePago
        ? `Período de pago abierto hasta el ${String(diaLimitePago).padStart(2, "0")}/${String(fechaSistema.getMonth() + 1).padStart(2, "0")}.`
        : `Período de pago de ${nombreMes(fechaSistema)} cerrado.`;
    resumen.innerHTML = `
        <li>${periodo}</li>
        <li><strong>${pendientes}</strong> con pago pendiente</li>
        <li><strong>${morosos}</strong> morosos</li>
        <li><strong>${aptosVencidos}</strong> con apto vencido</li>
    `;
    if (cumpleaneros.length > 0) {
        const nombres = cumpleaneros.map(({ nombre, apellido }) => `${nombre} ${apellido}`).join(", ");
        resumen.innerHTML += `<li class="aviso-cumple">🎂 ${cumpleaneros.length === 1 ? "Cumple" : "Cumplen"} años hoy: ${nombres}</li>`;
    }
}

//// Función para mostrar los valores de abono en los inputs
function mostrarPrecios() {
    conceptosAbono.forEach(({ clave, input }) => {
        input.value = precios[clave];
    });
}

//// Función para guardar los valores de abono editados, previa confirmación de los cambios
async function guardarValoresCuota() {
    if (!datosCargados) {
        notificar("No se pueden guardar cambios porque los datos no se cargaron. Usá el botón Restaurar DB para reintentar.", "error");
        return;
    }
    const nuevos = {};
//// Se usa for...of (y no forEach) porque si un valor es inválido hay que cortar la función con return
    for (const { clave, etiqueta, input } of conceptosAbono) {
        if (!esNumeroValido(input.value) || parseInt(input.value) <= 0) {
            notificar(`El valor de ${etiqueta} debe ser un número mayor a 0, sin puntos ni signos.`, "error");
            input.focus();
            return;
        }
        nuevos[clave] = parseInt(input.value);
    }
    const cambios = conceptosAbono.filter(({ clave }) => nuevos[clave] !== precios[clave]);
    if (cambios.length === 0) {
        notificar("No hay cambios en los valores de abono.", "info");
        return;
    }
    const filas = cambios
        .map(({ clave, etiqueta }) => `<tr><td>${etiqueta}</td><td>${formatearMonto(precios[clave])} → <strong>${formatearMonto(nuevos[clave])}</strong></td></tr>`)
        .join("");
    const confirmado = await confirmar({
        titulo: "¿Actualizar valores de abono?",
        html: `<table class="desglose">${filas}</table><p class="nota-swal">Los nuevos valores se aplican a los próximos pagos.</p>`,
        textoConfirmar: "Guardar valores"
    });
    if (!confirmado) {
        mostrarPrecios();
        return;
    }
    precios = { ...precios, ...nuevos };
    guardarPrecios();
    aplicarFiltros();
    notificar("Se actualizaron los valores de abono. Se aplican a los próximos pagos.", "exito");
}

//// Función para mostrar el estado "Cargando..." y bloquear los controles mientras tanto
function mostrarCargando() {
    contenido.classList.add("cargando");
    cuerpoTabla.innerHTML = `
        <tr><td colspan="8" class="estado-carga"><span class="spinner"></span> Cargando socios...</td></tr>
    `;
    contador.innerHTML = "";
    resumen.innerHTML = `<li>Cargando datos...</li>`;
}

//// Función para mostrar en la tabla que la carga falló
function mostrarErrorCarga(error) {
    cuerpoTabla.innerHTML = `
        <tr><td colspan="8" class="estado-carga error-carga">
            No se pudieron cargar los socios.
            <div class="detalle">${error.message}</div>
        </td></tr>
    `;
    resumen.innerHTML = `<li>Sin datos para mostrar.</li>`;
}

//// Valores de abono vigentes (se cargan desde data.json o del localStorage)
let precios = {};

//// Fecha con la que trabaja el simulador (arranca en la fecha real de hoy)
let fechaSistema = fechaDeHoy();

//// Array de socios con el que trabaja el simulador 
let socios = [];

//// Socio que se está editando 
let socioEditando = null;

//// temporizador de edicion abierta
let temporizadorEdicion = null;

//// Número de socio a resaltar en la tabla después de agregarlo o modificarlo
let idResaltado = null;

//// Indica si los datos se cargaron bien, evita guardar cambios sobre datos vacíos si la carga falló
let datosCargados = false;

//// Selección de elementos del DOM
const tituloFormulario = document.getElementById("titulo-formulario");
const inputNombre = document.getElementById("nombre");
const inputApellido = document.getElementById("apellido");
const inputNacimiento = document.getElementById("fecha-nacimiento");
const inputDocumento = document.getElementById("documento");
const inputEmail = document.getElementById("email");
const inputApto = document.getElementById("fecha-apto");
const botonGuardar = document.getElementById("btn-guardar");
const botonCancelar = document.getElementById("btn-cancelar");
const inputBuscar = document.getElementById("buscar");
const selectCategoria = document.getElementById("filtro-categoria");
const selectEstado = document.getElementById("filtro-estado");
const cuerpoTabla = document.getElementById("cuerpo-tabla");
const contenido = document.querySelector(".contenido");
const contador = document.querySelector("#contador");
const botonRestaurar = document.getElementById("btn-restaurar");
const inputFechaSistema = document.getElementById("fecha-sistema");
const botonAplicarFecha = document.getElementById("btn-aplicar-fecha");
const botonDiaAnterior = document.getElementById("btn-dia-anterior");
const botonDiaSiguiente = document.getElementById("btn-dia-siguiente");
const botonMesSiguiente = document.getElementById("btn-mes-siguiente");
const botonHoy = document.getElementById("btn-hoy");
const resumen = document.getElementById("resumen");
const botonGuardarPrecios = document.getElementById("btn-guardar-precios");

//// Conceptos de abono (se cargan desde data.json): clave en el objeto precios, nombre para mostrar e input del formulario
let conceptosAbono = [];

//// Clases CSS para cada estado de cuota
const clasesEstado = { "Al día": "al-dia", "Pendiente": "pendiente", "Moroso": "moroso" };

//// Función para dibujar la tabla de socios en pantalla
function renderizarSocios(lista) {
    cuerpoTabla.innerHTML = lista.length === 0
        ? `<tr><td colspan="8" class="sin-resultados">No hay socios para mostrar.</td></tr>`
        : "";
    lista.forEach((socio) => {
        const { id, nombre, apellido, numDocumento, email, ultimoMesPago } = socio;
        const edad = calcularEdad(socio, fechaSistema);
        const categoria = categoriaCuota(edad);
        const estado = estadoCuota(socio, fechaSistema);
        const detallePago = ultimoMesPago === null ? "Sin pagos" : `Pagó hasta ${ultimoMesPago}`;
        let cargoExtra = "";
        if (requiereInscripcion(socio)) {
            cargoExtra = "Debe inscripción";
        } else if (requiereReinscripcion(socio, fechaSistema)) {
            cargoExtra = "Debe reinscripción";
        }
        const apto = aptoVencido(socio, fechaSistema);
        const vencimiento = vencimientoApto(socio);
        const claseFila = [
            id === idResaltado ? "resaltado" : "",
            tieneAcceso(socio, fechaSistema) ? "" : "sin-acceso"
        ].join(" ");
        const marcaCumple = cumpleAnios(socio, fechaSistema)
            ? ` <span class="cumple" title="¡Cumple años hoy!">🎂</span>`
            : "";
        cuerpoTabla.innerHTML += `
            <tr class="${claseFila}">
                <td class="col-numero">${id}</td>
                <td>
                    ${apellido}, ${nombre}${marcaCumple}
                    <div class="detalle">${email}</div>
                </td>
                <td>${numDocumento}</td>
                <td>${edad}</td>
                <td>
                    <span class="categoria ${categoria.toLowerCase()}">${categoria}</span>
                    <div class="detalle">${formatearMonto(precios[categoria])}</div>
                </td>
                <td>
                    <span class="estado ${clasesEstado[estado]}">${estado}</span>
                    <div class="detalle">${detallePago}</div>
                    ${cargoExtra === "" ? "" : `<div class="detalle detalle-alerta">${cargoExtra}</div>`}
                </td>
                <td>
                    <span class="estado ${apto ? "vencido" : "vigente"}">${apto ? "Vencido" : "Vigente"}</span>
                    <div class="detalle">${vencimiento === null ? "Sin apto" : "Vence " + fechaATexto(vencimiento)}</div>
                </td>
                <td class="col-acciones">
                    <div class="acciones-grilla">
                        <button id="pago-${id}" class="btn-pago">Pago</button>
                        <button id="apto-${id}" class="btn-apto">Apto</button>
                        <button id="editar-${id}" class="btn-editar">Editar</button>
                        <button id="eliminar-${id}" class="btn-eliminar">Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
    });
//// Asignar los eventos a los botones de cada fila 
    lista.forEach(({ id }) => {
        document.getElementById(`pago-${id}`).addEventListener("click", () => registrarPago(id));
        document.getElementById(`apto-${id}`).addEventListener("click", () => registrarApto(id));
        document.getElementById(`editar-${id}`).addEventListener("click", () => iniciarEdicion(id));
        document.getElementById(`eliminar-${id}`).addEventListener("click", () => eliminarSocio(id));
    });
    contador.innerHTML = `Mostrando ${lista.length} de ${socios.length} ${socios.length === 1 ? "socio" : "socios"}`;
//// El resaltado se muestra una sola vez
    idResaltado = null;
}

//// Función para aplicar la búsqueda y el filtro de categoría antes de renderizar
function aplicarFiltros() {
    const texto = inputBuscar.value.toLowerCase();
    const categoria = selectCategoria.value;
    const estado = selectEstado.value;
    let resultado = texto !== "" ? buscarPorTexto(socios, texto) : socios;
    resultado = categoria !== "todas" ? filtrarPorCategoria(resultado, categoria) : resultado;
    resultado = estado !== "todos" ? filtrarPorEstado(resultado, estado) : resultado;
    renderizarSocios(resultado);
    actualizarResumen();
}

//// Eventos de botones
botonGuardar.addEventListener("click", guardarSocio);
botonCancelar.addEventListener("click", cancelarEdicion);
botonRestaurar.addEventListener("click", restaurarBaseDeDatos);
botonGuardarPrecios.addEventListener("click", guardarValoresCuota);
botonAplicarFecha.addEventListener("click", aplicarFechaEscrita);
botonDiaAnterior.addEventListener("click", () => moverDias(-1));
botonDiaSiguiente.addEventListener("click", () => moverDias(1));
botonMesSiguiente.addEventListener("click", avanzarMes);
botonHoy.addEventListener("click", () => cambiarFechaSistema(fechaDeHoy()));

//// Eventos de teclado en el formulario 
const inputsFormulario = [inputNombre, inputApellido, inputNacimiento, inputDocumento, inputEmail, inputApto];
inputsFormulario.forEach((input) => {
    input.addEventListener("keyup", (evento) => {
        if (evento.key === "Enter") {
            guardarSocio();
        }
        if (evento.key === "Escape" && socioEditando !== null) {
            cancelarEdicion();
        }
    });
});
inputFechaSistema.addEventListener("keyup", (evento) => {
    if (evento.key === "Enter") {
        aplicarFechaEscrita();
    }
});

//// Eventos del buscador y del filtro
inputBuscar.addEventListener("keyup", aplicarFiltros);
selectCategoria.addEventListener("change", aplicarFiltros);
selectEstado.addEventListener("change", aplicarFiltros);

//// Carga inicial: muestra la fecha del sistema y trae los datos de forma asíncrona
inputFechaSistema.value = fechaATexto(fechaSistema);
cargarDatos();

/* Recordatorio a trabajar cuando se desarrolle mejor la parte de vencimientos aptos medicos, autorizacion de menores, aranceles, etc
setTimeout(() => {
    {
        const cantidadMenores = filtrarPorCategoria(socios, "Menor").length;
        notificar(
            cantidadMenores === 0
                ? "Recordatorio: no hay socios menores de edad registrados."
                : `Recordatorio: hay ${cantidadMenores} ${cantidadMenores === 1 ? "socio menor" : "socios menores"} de edad. Verificá que tengan la autorización firmada de un adulto responsable.`,
            "info"
        );
    }
}, 3000);

*/