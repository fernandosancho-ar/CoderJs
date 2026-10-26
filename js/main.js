//// Clase Socio
class Socio {
    constructor(id, nombre, apellido, fechaNacimiento, numDocumento, email, fechaAlta, fechaUltimoApto, fechaUltimoPago, ultimoMesPago) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
        this.numDocumento = numDocumento;
        this.email = email;
        this.fechaAlta = fechaAlta;
        this.fechaUltimoApto = fechaUltimoApto;
        this.fechaUltimoPago = fechaUltimoPago;   
        this.ultimoMesPago = ultimoMesPago;       
    }
}

//// Último día del mes para pagar la cuota sin perder el acceso
const diaLimitePago = 5;
 
//// Keys con las que se guardan los datos en el localStorage
const claveStorage = "socios-gimnasio";
const claveCuotas = "cuotas-gimnasio";

//// Archivo JSON que emula la base de datos inicial (socios y valores de abono)
const rutaDatos = "./data.json";

//// Demora simulada de la carga
const demoraSimulada = 800;

//// Colores de las notificaciones Toastify y de los botones SweetAlert2
const coloresNotificacion = { exito: "#16a34a", error: "#dc2626", aviso: "#d97706", info: "#2563eb" };
const colorPrincipal = "#f97316";
const colorPeligro = "#dc2626";
const colorCancelar = "#64748b";
 
const nombresMeses = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

//// Convierte "DD/MM/AAAA" en un objeto
function textoAFecha(texto) {
    const [dia, mes, anio] = texto.split("/").map(Number);
    return new Date(anio, mes - 1, dia);
}

//// Convierte un objeto Date en "DD/MM/AAAA"
function fechaATexto(fecha) {
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    return `${dia}/${mes}/${fecha.getFullYear()}`;
}

//// Verifica que el texto tenga formato DD/MM/AAAA y que la fecha exista (ej: rechaza 31/02/2020)
function esFechaValida(texto) {
    const partes = texto.split("/");
    if (partes.length !== 3) {
        return false;
    }
    const [dia, mes, anio] = partes;
    if (dia.length !== 2 || mes.length !== 2 || anio.length !== 4) {
        return false;
    }
    if (!esNumeroValido(dia) || !esNumeroValido(mes) || !esNumeroValido(anio)) {
        return false;
    }
    return fechaATexto(textoAFecha(texto)) === texto;
}

//// Devuelve la fecha de hoy sin hora
function fechaDeHoy() {
    const ahora = new Date();
    return new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
}
 
//// Devuelve el nombre del mes de una fecha
function nombreMes(fecha) {
    return nombresMeses[fecha.getMonth()];
}
 
//// Convierte un mes "MM/AAAA" en un número para poder comparar y sumar meses
function mesANumero(textoMes) {
    const [mes, anio] = textoMes.split("/").map(Number);
    return anio * 12 + (mes - 1);
}

//// Convierte el número de mes en "MM/AAAA"
function numeroAMes(numero) {
    const mes = String((numero % 12) + 1).padStart(2, "0");
    return `${mes}/${Math.floor(numero / 12)}`;
}

//// Devuelve el número de mes de una fecha
function numeroDeMes(fecha) {
    return fecha.getFullYear() * 12 + fecha.getMonth();
}

//// Devuelve el nombre y año de un mes "MM/AAAA", por ejemplo "julio 2026"
function nombreMesCompleto(textoMes) {
    const [mes, anio] = textoMes.split("/").map(Number);
    return `${nombresMeses[mes - 1]} ${anio}`;
}

//// Formatea un monto en pesos
function formatearMonto(monto) {
    return "$" + monto.toLocaleString("es-AR");
}

//// Función para calcular la edad del socio
function calcularEdad(socio, fechaReferencia) {
    const nacimiento = textoAFecha(socio.fechaNacimiento);
    const edad = fechaReferencia.getFullYear() - nacimiento.getFullYear();
    const yaCumplio = fechaReferencia.getMonth() > nacimiento.getMonth() ||
        (fechaReferencia.getMonth() === nacimiento.getMonth() && fechaReferencia.getDate() >= nacimiento.getDate());
    return yaCumplio ? edad : edad - 1;
}

//// Función para saber si el socio cumple años
function cumpleAnios(socio, fechaReferencia) {
    const nacimiento = textoAFecha(socio.fechaNacimiento);
    return nacimiento.getDate() === fechaReferencia.getDate() &&
        nacimiento.getMonth() === fechaReferencia.getMonth();
}

//// Función que devuelve la fecha de vencimiento del apto
function vencimientoApto(socio) {
    if (socio.fechaUltimoApto === null) {
        return null;
    }
    const vencimiento = textoAFecha(socio.fechaUltimoApto);
    vencimiento.setFullYear(vencimiento.getFullYear() + 1);
    return vencimiento;
}

//// Función para saber si el apto está vencido o  nunca se presento
function aptoVencido(socio, fechaReferencia) {
    const vencimiento = vencimientoApto(socio);
    return vencimiento === null || fechaReferencia >= vencimiento;
}

//// Función para saber el estado de la cuota
function estadoCuota(socio, fechaReferencia) {
    if (socio.ultimoMesPago === null) {
        return "Moroso";
    }
    const mesActual = numeroDeMes(fechaReferencia);
    const mesPago = mesANumero(socio.ultimoMesPago);
    if (mesPago >= mesActual) {
        return "Al día";
    }
    if (mesPago === mesActual - 1 && fechaReferencia.getDate() <= diaLimitePago) {
        return "Pendiente";
    }
    return "Moroso";
}

//// Función para saber cuántas cuotas debe el socio, contando la del mes actual
function cuotasAdeudadas(socio, fechaReferencia) {
    if (socio.ultimoMesPago === null) {
        return 1;
    }
    return Math.max(0, numeroDeMes(fechaReferencia) - mesANumero(socio.ultimoMesPago));
}

//// Función para saber si el socio tiene que pagar reinscripción:
function requiereReinscripcion(socio, fechaReferencia) {
    return socio.ultimoMesPago !== null && cuotasAdeudadas(socio, fechaReferencia) >= 2;
}

//// Función para saber si el socio tiene que pagar inscripción: es su primer pago
function requiereInscripcion(socio) {
    return socio.ultimoMesPago === null;
}

//// Función para saber si el socio puede ingresar al gimnasio
function tieneAcceso(socio, fechaReferencia) {
    return estadoCuota(socio, fechaReferencia) !== "Moroso" && !aptoVencido(socio, fechaReferencia);
}

//// Función para verificar si un texto tiene solo letras y espacios
function esSoloLetras(texto) {
    let tieneLetra = false;
    for (const caracter of texto) {
        const esLetra = caracter.toLowerCase() !== caracter.toUpperCase();
        if (!esLetra && caracter !== " ") {
            return false;
        }
        if (esLetra) {
            tieneLetra = true;
        }
    }
    return tieneLetra;
}

//// Función para validar un texto
function esTextoValido(valor) {
    return valor !== "" && esSoloLetras(valor);
}

//// Función para validar un número
function esNumeroValido(valor) {
    if (valor === "") {
        return false;
    }
    for (const caracter of valor) {
        if (caracter === " " || isNaN(caracter)) {
            return false;
        }
    }
    return true;
}

//// Función para validar un email 
function esEmailValido(valor) {
    return valor !== "" && valor.includes("@") && valor.includes(".") && !valor.includes(" ");
}

//// Función para verificar si algún campo quedó vacío 
function hayCamposVacios(...valores) {
    return valores.some((valor) => valor === "");
}

//// Función para verificar si un documento ya está registrado 
function documentoExiste(socios, documento, idExcluido) {
    return socios.some(
        (socioRegistrado) => socioRegistrado.numDocumento === documento && socioRegistrado.id !== idExcluido
    );
}

//// Función para verificar si un email ya está registrado 
function emailExiste(socios, email, idExcluido) {
    return socios.some(
        (socioRegistrado) => socioRegistrado.email === email && socioRegistrado.id !== idExcluido
    );
}

//// Función para generar un nuevo id / número de socio 
function generarNuevoId(socios) {
    const idMaximo = socios.reduce(
        (maximo, socioRegistrado) => {
            if (socioRegistrado.id > maximo) {
                return socioRegistrado.id;
            }
            return maximo;
        },
        9999
    );
    return idMaximo + 1;
}

//// Función para determinar la categoría de cuota según la edad
function categoriaCuota(edad) {
    return edad < 18 ? "Menor"
        : edad < 65 ? "Adulto"
        : "Senior";
}

//// Función para filtrar socios por categoría de cuota
function filtrarPorCategoria(lista, categoria) {
    return lista.filter(
        (socio) => categoriaCuota(calcularEdad(socio, fechaSistema)) === categoria
    );
}

//// Función para filtrar socios por estado de cuota o de apto
function filtrarPorEstado(lista, estado) {
    return lista.filter((socio) => {
        if (estado === "apto-vencido") {
            return aptoVencido(socio, fechaSistema);
        }
        if (estado === "sin-acceso") {
            return !tieneAcceso(socio, fechaSistema);
        }
        return estadoCuota(socio, fechaSistema) === estado;
    });
}

//// Función para buscar socios por número de socio, nombre, apellido, documento o email
function buscarPorTexto(lista, texto) {
    return lista.filter((socio) => {
        const { id, nombre, apellido, numDocumento, email } = socio;
        const nombreCompleto = (nombre + " " + apellido).toLowerCase();
        return id.toString().includes(texto) ||
            nombreCompleto.includes(texto) ||
            numDocumento.includes(texto) ||
            email.includes(texto);
    });
}

//// Función para validar los datos del formulario 
function validarDatos(nombre, apellido, fechaNacimiento, documento, email, fechaApto, idExcluido) {
    if (hayCamposVacios(nombre, apellido, fechaNacimiento, documento, email)) {
        return "Completá todos los campos obligatorios.";
    }
    if (!esTextoValido(nombre)) {
        return "El nombre es obligatorio y solo puede contener letras.";
    }
    if (!esTextoValido(apellido)) {
        return "El apellido es obligatorio y solo puede contener letras.";
    }
    if (!esFechaValida(fechaNacimiento) ||
        textoAFecha(fechaNacimiento).getFullYear() < 1900 ||
        textoAFecha(fechaNacimiento) > fechaSistema) {
        return `La fecha de nacimiento debe tener formato DD/MM/AAAA y estar entre 01/01/1900 y ${fechaATexto(fechaSistema)}.`;
    }
    if (!esNumeroValido(documento) || documento.length < 7 || documento.length > 8) {
        return "El documento debe tener 7 u 8 dígitos, sin puntos, signos ni espacios.";
    }
    if (documentoExiste(socios, documento, idExcluido)) {
        return `Ya existe otro socio con el documento ${documento}.`;
    }
    if (!esEmailValido(email)) {
        return "El email no es válido. Debe tener el formato nombre@dominio.com.";
    }
    if (emailExiste(socios, email, idExcluido)) {
        return `Ya existe otro socio con el email ${email}.`;
    }
    if (fechaApto !== "" && (!esFechaValida(fechaApto) || textoAFecha(fechaApto) > fechaSistema)) {
        return "La fecha del apto físico debe tener formato DD/MM/AAAA y no puede ser posterior a hoy. Si no tiene, dejala vacía.";
    }
    return "";
}

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

//// Función para convertir los datos de un socio (del JSON o del localStorage) en un objeto Socio
function crearSocio({ id, nombre, apellido, fechaNacimiento, numDocumento, email, fechaAlta, fechaUltimoApto, fechaUltimoPago, ultimoMesPago }) {
    return new Socio(id, nombre, apellido, fechaNacimiento, numDocumento, email, fechaAlta, fechaUltimoApto, fechaUltimoPago, ultimoMesPago);
}

//// Función para leer un dato del localStorage. Si está dañado, lo descarta y devuelve null
function leerDelStorage(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave));
    } catch (error) {
        localStorage.removeItem(clave);
        notificar("Algunos datos guardados estaban dañados y se descartaron.", "aviso");
        return null;
    }
}

//// Función para guardar el array de socios en el localStorage
function guardarSocios() {
    localStorage.setItem(claveStorage, JSON.stringify(socios));
}

//// Función para guardar los valores de abono en el localStorage
function guardarPrecios() {
    localStorage.setItem(claveCuotas, JSON.stringify(precios));
}

//// Función que devuelve una promesa que se resuelve después de x milisegundos
function esperar(milisegundos) {
    return new Promise((resolve) => setTimeout(resolve, milisegundos));
}

//// Función para traer los datos iniciales desde el archivo JSON con fetch
async function obtenerDatosIniciales() {
    await esperar(demoraSimulada);
    const respuesta = await fetch(rutaDatos);
    if (!respuesta.ok) {
        throw new Error(`No se encontró el archivo ${rutaDatos} (error ${respuesta.status}).`);
    }
    const datos = await respuesta.json();
    if (datos.socios === undefined || datos.abonos === undefined) {
        throw new Error(`El archivo ${rutaDatos} no tiene el formato esperado.`);
    }
    return datos;
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

//// Función para cargar los datos: trae data.json y, si hay cambios guardados en el localStorage, usa esos.
async function cargarDatos() {
    mostrarCargando();
    try {
        const datos = await obtenerDatosIniciales();
        const sociosGuardados = leerDelStorage(claveStorage);
        const preciosGuardados = leerDelStorage(claveCuotas);
        socios = (sociosGuardados ?? datos.socios).map(crearSocio);
        precios = { ...datos.abonos, ...preciosGuardados };
        guardarSocios();
        guardarPrecios();
        contenido.classList.remove("cargando");
        mostrarPrecios();
        aplicarFiltros();
        if (sociosGuardados === null) {
            notificar(`Se cargaron ${socios.length} socios desde ${rutaDatos}.`, "info");
        }
        return true;
    } catch (error) {
        mostrarErrorCarga(error);
        const resultado = await Swal.fire({
            title: "No se pudieron cargar los datos",
            html: `Revisá tu conexión o que el archivo exista y volvé a intentar.<p class="nota-swal">${error.message}</p>`,
            icon: "error",
            confirmButtonText: "Reintentar",
            confirmButtonColor: colorPrincipal,
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        if (resultado.isConfirmed) {
            return await cargarDatos();
        }
        return false;
    }
}

//// Función para restaurar la base de datos desde data.json, previa confirmación
async function restaurarBaseDeDatos() {
    const confirmado = await confirmar({
        titulo: "¿Restaurar la base de datos?",
        html: `Se van a borrar <strong>todos los cambios guardados</strong> (altas, bajas, pagos, aptos y valores de abono) y se vuelven a cargar los datos de <code>${rutaDatos}</code>.`,
        icono: "warning",
        textoConfirmar: "Sí, restaurar",
        peligro: true
    });
    if (!confirmado) {
        return;
    }
    salirDeEdicion();
    localStorage.clear();
    await cargarDatos();
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
const inputPrecioMenor = document.getElementById("precio-menor");
const inputPrecioAdulto = document.getElementById("precio-adulto");
const inputPrecioSenior = document.getElementById("precio-senior");
const inputPrecioInscripcion = document.getElementById("precio-inscripcion");
const inputPrecioReinscripcion = document.getElementById("precio-reinscripcion");
const botonGuardarPrecios = document.getElementById("btn-guardar-precios");

//// Conceptos de abono: clave en el objeto precios, nombre para mostrar e input del formulario
const conceptosAbono = [
    { clave: "Menor", etiqueta: "Menor", input: inputPrecioMenor },
    { clave: "Adulto", etiqueta: "Adulto", input: inputPrecioAdulto },
    { clave: "Senior", etiqueta: "Senior", input: inputPrecioSenior },
    { clave: "Inscripcion", etiqueta: "Inscripción", input: inputPrecioInscripcion },
    { clave: "Reinscripcion", etiqueta: "Reinscripción", input: inputPrecioReinscripcion }
];

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
