//// main.js: interfaz (DOM), notificaciones, eventos y arranque de la aplicación

//// Colores de las notificaciones Toastify y de los botones SweetAlert2
const coloresNotificacion = { exito: "#16a34a", error: "#dc2626", aviso: "#d97706", info: "#2563eb" };
const colorPrincipal = "#f97316";
const colorPeligro = "#dc2626";
const colorCancelar = "#64748b";

//// Cantidad de meses que se muestran en el detalle de recaudación
const cantidadMesesRecaudacion = 8;

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
            null,   // ultimoMesPago
            null,   // autorizacion
            []      // pagos
        );
        socios.push(nuevoSocio);
        idResaltado = nuevoSocio.id;
        const avisoMenor = requiereAutorizacion(nuevoSocio, fechaSistema)
            ? " Recorda cargar la autorización del adulto responsable."
            : "";
        notificar(`Se agregó a ${nombre} ${apellido} como socio N° ${nuevoSocio.id}. Registrá el primer pago con el botón "Pago".${avisoMenor}`, "exito");
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
//// El pago queda registrado en el historial del socio con el monto cobrado en ese momento
    socio.pagos.push({
        fecha: socio.fechaUltimoPago,
        mes: socio.ultimoMesPago,
        categoria,
        conceptos,
        total
    });
    idResaltado = id;
    guardarSocios();
    aplicarFiltros();
    let detalleAcceso = "";
    if (aptoVencido(socio, fechaSistema)) {
        detalleAcceso = " Todavía no tiene acceso: el apto físico está vencido.";
    } else if (autorizacionPendiente(socio, fechaSistema)) {
        detalleAcceso = " Todavía no tiene acceso: falta la autorización del adulto responsable.";
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

//// Función que arma la tabla del historial de pagos de un socio, del más reciente al más antiguo
function crearTablaHistorial(pagos) {
    if (pagos.length === 0) {
        return `<p class="nota-swal">Todavía no registra pagos.</p>`;
    }
//// Se copia el array con spread antes de invertirlo, porque reverse() modifica el array original
    const filas = [...pagos].reverse()
        .map(({ fecha, mes, conceptos, total }) => `
            <tr>
                <td>${fecha}</td>
                <td>${nombreMesCompleto(mes)}</td>
                <td>${conceptos.map(({ detalle }) => detalle).join(" + ")}</td>
                <td>${formatearMonto(total)}</td>
            </tr>
        `)
        .join("");
    const totalPagado = pagos.reduce((suma, { total }) => suma + total, 0);
    return `
        <table class="tabla-historial">
            <thead><tr><th>Fecha</th><th>Mes</th><th>Conceptos</th><th>Total</th></tr></thead>
            <tbody>${filas}</tbody>
            <tfoot><tr><td colspan="3">Total pagado (${pagos.length} ${pagos.length === 1 ? "pago" : "pagos"})</td><td>${formatearMonto(totalPagado)}</td></tr></tfoot>
        </table>
    `;
}

//// Función para mostrar la ficha del socio: datos, acceso, autorización e historial de pagos
async function mostrarFicha(id) {
    const socio = socios.find((socioRegistrado) => socioRegistrado.id === id);
    const { nombre, apellido, numDocumento, email, fechaNacimiento, fechaAlta, autorizacion, pagos } = socio;
    const edad = calcularEdad(socio, fechaSistema);
    const esMenor = requiereAutorizacion(socio, fechaSistema);
    const tieneAutorizacion = esMenor && autorizacion !== null;
    let textoAutorizacion = "No corresponde (mayor de edad)";
    if (esMenor) {
        textoAutorizacion = autorizacion === null
            ? `<span class="texto-alerta">Pendiente: no tiene acceso hasta que se cargue</span>`
            : `${autorizacion.nombre} ${autorizacion.apellido} (DNI ${autorizacion.numDocumento})<br>${autorizacion.email} · cargada el ${autorizacion.fecha}`;
    }
    const resultado = await Swal.fire({
        title: `${apellido}, ${nombre}`,
        html: `
            <dl class="ficha-datos">
                <dt>N° de socio</dt><dd>${id}</dd>
                <dt>Documento</dt><dd>${numDocumento}</dd>
                <dt>Email</dt><dd>${email}</dd>
                <dt>Nacimiento</dt><dd>${fechaNacimiento} (${edad} años)</dd>
                <dt>Fecha de alta</dt><dd>${fechaAlta}</dd>
                <dt>Categoría</dt><dd>${categoriaCuota(edad)}</dd>
                <dt>Acceso</dt><dd>${tieneAcceso(socio, fechaSistema) ? "Habilitado" : `<span class="texto-alerta">Sin acceso</span>`}</dd>
                <dt>Autorización</dt><dd>${textoAutorizacion}</dd>
            </dl>
            <h3 class="ficha-subtitulo">Historial de pagos</h3>
            ${crearTablaHistorial(pagos)}
        `,
        width: 720,
        confirmButtonText: "Cerrar",
        confirmButtonColor: colorCancelar,
//// Los botones de autorización solo aparecen si el socio es menor de edad.
//// "Anular" aparece solo si ya tiene una autorización cargada
        showDenyButton: esMenor,
        denyButtonText: tieneAutorizacion ? "Modificar autorización" : "Cargar autorización",
        denyButtonColor: colorPrincipal,
        showCancelButton: tieneAutorizacion,
        cancelButtonText: "Anular autorización",
        cancelButtonColor: colorPeligro
    });
    if (resultado.isDenied) {
        await cargarAutorizacion(id);
    }
//// Se distingue el botón "Anular" de cerrar el cuadro con Escape o haciendo clic afuera
    if (resultado.dismiss === Swal.DismissReason.cancel) {
        await anularAutorizacion(id);
    }
}

//// Función para cargar o modificar la autorización del adulto responsable de un socio menor
async function cargarAutorizacion(id) {
    const socio = socios.find((socioRegistrado) => socioRegistrado.id === id);
    const { nombre, apellido, autorizacion } = socio;
    const resultado = await Swal.fire({
        title: "Autorización del adulto responsable",
        html: `
            <p class="nota-swal">Socio menor de edad: ${nombre} ${apellido} (N° ${id})</p>
            <div class="formulario formulario-swal">
                <div class="campo">
                    <label for="swal-nombre">Nombre</label>
                    <input type="text" id="swal-nombre" placeholder="Ej: María" value="${autorizacion === null ? "" : autorizacion.nombre}">
                </div>
                <div class="campo">
                    <label for="swal-apellido">Apellido</label>
                    <input type="text" id="swal-apellido" placeholder="Ej: López" value="${autorizacion === null ? "" : autorizacion.apellido}">
                </div>
                <div class="campo campo-ancho">
                    <label for="swal-documento">Documento</label>
                    <input type="text" id="swal-documento" placeholder="Ej: 25123456" maxlength="8" value="${autorizacion === null ? "" : autorizacion.numDocumento}">
                </div>
                <div class="campo campo-ancho">
                    <label for="swal-email">Email de contacto</label>
                    <input type="text" id="swal-email" placeholder="Ej: maria@mail.com" value="${autorizacion === null ? "" : autorizacion.email}">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Guardar autorización",
        cancelButtonText: "Cancelar",
        confirmButtonColor: colorPrincipal,
        cancelButtonColor: colorCancelar,
        reverseButtons: true,
        focusConfirm: false,
//// preConfirm valida los datos antes de cerrar el cuadro: si hay un error, lo muestra y el cuadro sigue abierto
        preConfirm: () => {
            const datosResponsable = {
                nombre: document.getElementById("swal-nombre").value,
                apellido: document.getElementById("swal-apellido").value,
                numDocumento: document.getElementById("swal-documento").value,
                email: document.getElementById("swal-email").value.toLowerCase()
            };
            const { nombre, apellido, numDocumento, email } = datosResponsable;
            const error = validarAutorizacion(nombre, apellido, numDocumento, email);
            if (error !== "") {
                Swal.showValidationMessage(error);
                return false;
            }
            return datosResponsable;
        }
    });
    if (!resultado.isConfirmed) {
        return;
    }
    socio.autorizacion = { ...resultado.value, fecha: fechaATexto(fechaSistema) };
    idResaltado = id;
    guardarSocios();
    aplicarFiltros();
    const detalleAcceso = tieneAcceso(socio, fechaSistema) ? " Ya tiene acceso al gimnasio." : "";
    notificar(`Se registró la autorización de ${socio.autorizacion.nombre} ${socio.autorizacion.apellido} para ${nombre} ${apellido}.${detalleAcceso}`, "exito");
}

//// Función para anular la autorización de un menor, previa confirmación (por error de carga u otra eventualidad)
async function anularAutorizacion(id) {
    const socio = socios.find((socioRegistrado) => socioRegistrado.id === id);
    const { nombre, apellido, autorizacion } = socio;
    const confirmado = await confirmar({
        titulo: "¿Anular la autorización?",
        html: `Se va a anular la autorización de <strong>${autorizacion.nombre} ${autorizacion.apellido}</strong> para ${nombre} ${apellido}.<br>El socio no va a tener acceso al gimnasio hasta que se cargue una nueva.`,
        icono: "warning",
        textoConfirmar: "Sí, anular",
        peligro: true
    });
    if (!confirmado) {
        return;
    }
    socio.autorizacion = null;
    idResaltado = id;
    guardarSocios();
    aplicarFiltros();
    notificar(`Se anuló la autorización de ${nombre} ${apellido}. No tiene acceso hasta que se cargue una nueva.`, "aviso");
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
    const menoresSinAutorizacion = filtrarPorEstado(socios, "sin-autorizacion").length;
    const cumpleaneros = socios.filter((socio) => cumpleAnios(socio, fechaSistema));
    const periodo = fechaSistema.getDate() <= diaLimitePago
        ? `Período de pago abierto hasta el ${String(diaLimitePago).padStart(2, "0")}/${String(fechaSistema.getMonth() + 1).padStart(2, "0")}.`
        : `Período de pago de ${nombreMes(fechaSistema)} cerrado.`;
    resumen.innerHTML = `
        <li>${periodo}</li>
        <li><strong>${pendientes}</strong> con pago pendiente</li>
        <li><strong>${morosos}</strong> morosos</li>
        <li><strong>${aptosVencidos}</strong> con apto vencido</li>
        <li><strong>${menoresSinAutorizacion}</strong> ${menoresSinAutorizacion === 1 ? "menor" : "menores"} sin autorización</li>
    `;
    if (cumpleaneros.length > 0) {
        const nombres = cumpleaneros.map(({ nombre, apellido }) => `${nombre} ${apellido}`).join(", ");
        resumen.innerHTML += `<li class="aviso-cumple">🎂 ${cumpleaneros.length === 1 ? "Cumple" : "Cumplen"} años hoy: ${nombres}</li>`;
    }
}

//// Función para mostrar la recaudación de los últimos meses, hasta el mes de la fecha del sistema
function mostrarRecaudacion() {
    const todosLosPagos = obtenerTodosLosPagos(socios);
    const mesActual = numeroDeMes(fechaSistema);
    let filas = "";
    for (let mesesAtras = 0; mesesAtras < cantidadMesesRecaudacion; mesesAtras++) {
        const mes = numeroAMes(mesActual - mesesAtras);
        const { cantidad, total } = recaudacionDelMes(todosLosPagos, mes);
        filas += `
            <tr class="${mesesAtras === 0 ? "mes-actual" : ""}">
                <td>${nombreMesCompleto(mes)}</td>
                <td>${cantidad}</td>
                <td>${sociosSinPagar(socios, mes)}</td>
                <td>${formatearMonto(total)}</td>
            </tr>
        `;
    }
    Swal.fire({
        title: "Recaudación mensual",
        html: `
            <table class="tabla-recaudacion">
                <thead><tr><th>Mes</th><th>Pagos</th><th>Sin pagar</th><th>Total</th></tr></thead>
                <tbody>${filas}</tbody>
            </table>
            <p class="nota-swal">Pagos y total: se cuenta cada pago en el mes en que se cobró. Sin pagar: socios con la cuota de ese mes pendiente o morosa. Los socios eliminados no se incluyen.</p>
        `,
        confirmButtonText: "Cerrar",
        confirmButtonColor: colorCancelar
    });
}

//// Función para mostrar en el módulo de abonos lo recaudado en el mes de la fecha del sistema
function actualizarRecaudacionDelMes() {
    const { total } = recaudacionDelMes(obtenerTodosLosPagos(socios), numeroAMes(numeroDeMes(fechaSistema)));
    recaudacionMes.innerHTML = `Recaudado en ${nombreMes(fechaSistema)}: <strong>${formatearMonto(total)}</strong>`;
}

//// Función para editar los valores de abono en un cuadro de SweetAlert2 y guardarlos, previa confirmación de los cambios
async function editarValoresAbono() {
    if (!datosCargados) {
        notificar("No se pueden guardar cambios porque los datos no se cargaron. Usá el botón Restaurar DB para reintentar.", "error");
        return;
    }
    const campos = conceptosAbono
        .map(({ clave, etiqueta, detalle }) => `
            <div class="campo-linea">
                <label for="abono-${clave}">${etiqueta} <span class="opcional">(${detalle})</span></label>
                <input type="text" id="abono-${clave}" value="${precios[clave]}">
            </div>
        `)
        .join("");
    const resultado = await Swal.fire({
        title: "Valores de abono",
        html: `
            <p class="nota-swal">Cuota mensual por categoría, se paga del 1 al 5 de cada mes.</p>
            <div class="formulario-abonos formulario-swal">${campos}</div>
        `,
        showCancelButton: true,
        confirmButtonText: "Guardar valores",
        cancelButtonText: "Cancelar",
        confirmButtonColor: colorPrincipal,
        cancelButtonColor: colorCancelar,
        reverseButtons: true,
        focusConfirm: false,
//// preConfirm valida los valores antes de cerrar el cuadro: si hay un error, lo muestra y el cuadro sigue abierto
        preConfirm: () => {
            const valoresIngresados = {};
//// Se usa for...of (y no forEach) porque si un valor es inválido hay que cortar la función con return
            for (const { clave, etiqueta } of conceptosAbono) {
                const valor = document.getElementById(`abono-${clave}`).value;
                if (!esNumeroValido(valor) || parseInt(valor) <= 0) {
                    Swal.showValidationMessage(`El valor de ${etiqueta} debe ser un número mayor a 0, sin puntos ni signos.`);
                    return false;
                }
                valoresIngresados[clave] = parseInt(valor);
            }
            return valoresIngresados;
        }
    });
    if (!resultado.isConfirmed) {
        return;
    }
    const nuevos = resultado.value;
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
    recaudacionMes.innerHTML = "Cargando datos...";
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
    recaudacionMes.innerHTML = "Sin datos para mostrar.";
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
const botonValoresAbono = document.getElementById("btn-valores-abono");
const botonRecaudacion = document.getElementById("btn-recaudacion");
const recaudacionMes = document.getElementById("recaudacion-mes");

//// Conceptos de abono (se cargan desde data.json): clave en el objeto precios, nombre y detalle para mostrar
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
                    <button id="ficha-${id}" class="link-socio" title="Ver ficha e historial de pagos">${apellido}, ${nombre}</button>${marcaCumple}
                    <div class="detalle">${email}</div>
                </td>
                <td>${numDocumento}</td>
                <td>${edad}</td>
                <td>
                    <span class="categoria ${categoria.toLowerCase()}">${categoria}</span>
                    <div class="detalle">${formatearMonto(precios[categoria])}</div>
                    ${autorizacionPendiente(socio, fechaSistema) ? `<div class="detalle detalle-alerta">Sin autorización</div>` : ""}
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
        document.getElementById(`ficha-${id}`).addEventListener("click", () => mostrarFicha(id));
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
    actualizarRecaudacionDelMes();
}

//// Eventos de botones
botonGuardar.addEventListener("click", guardarSocio);
botonCancelar.addEventListener("click", cancelarEdicion);
botonRestaurar.addEventListener("click", restaurarBaseDeDatos);
botonValoresAbono.addEventListener("click", editarValoresAbono);
botonAplicarFecha.addEventListener("click", aplicarFechaEscrita);
botonDiaAnterior.addEventListener("click", () => moverDias(-1));
botonDiaSiguiente.addEventListener("click", () => moverDias(1));
botonMesSiguiente.addEventListener("click", avanzarMes);
botonHoy.addEventListener("click", () => cambiarFechaSistema(fechaDeHoy()));
botonRecaudacion.addEventListener("click", mostrarRecaudacion);

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
