//// Clase Socio
class Socio {
    constructor(id, nombre, apellido, fechaNacimiento, numDocumento, email, fechaAlta, fechaUltimoApto, fechaUltimoPago) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
        this.numDocumento = numDocumento;
        this.email = email;
        this.fechaAlta = fechaAlta;
        this.fechaUltimoApto = fechaUltimoApto;
        this.fechaUltimoPago = fechaUltimoPago;
    }
}

//// Último día del mes para pagar la cuota sin perder el acceso
const diaLimitePago = 5;
 
//// Keys con las que se guardan los datos en el localStorage
const claveStorage = "socios-gimnasio-v2";
const claveCuotas = "cuotas-gimnasio";

//// Valores de cuota por defecto
const preciosIniciales = { Menor: 25000, Adulto: 38000, Senior: 30000 };
 
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
    if (socio.fechaUltimoPago === null) {
        return "Moroso";
    }
    const pago = textoAFecha(socio.fechaUltimoPago);
    const mesActual = fechaReferencia.getFullYear() * 12 + fechaReferencia.getMonth();
    const mesPago = pago.getFullYear() * 12 + pago.getMonth();
    if (mesPago >= mesActual) {
        return "Al día";
    }
    if (mesPago === mesActual - 1 && fechaReferencia.getDate() <= diaLimitePago) {
        return "Pendiente";
    }
    return "Moroso";
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

//// Función para mostrar un mensaje de feedback en pantalla 
function mostrarMensaje(texto, tipo) {
    mensaje.innerHTML = texto;
    mensaje.className = "mensaje " + tipo;
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

//// Función para pasar el formulario a modo edición con los datos del socio elegido
function iniciarEdicion(id) {
    socioEditando = socios.find((socio) => socio.id === id);
    const { nombre, apellido, fechaNacimiento, numDocumento, email, fechaUltimoApto } = socioEditando;
    inputNombre.value = nombre;
    inputApellido.value = apellido;
    inputNacimiento.value = fechaNacimiento;
    inputDocumento.value = numDocumento;
    inputEmail.value = email;
    inputApto.value = fechaUltimoApto ?? "";
    actualizarModoFormulario();
    mostrarMensaje(`Editando a ${nombre} ${apellido}. Modificá los datos y presioná "Guardar cambios".`, "info");
    inputNombre.focus();
//// Si la edición sigue abierta después de 10 segundos, se muestra un aviso (Entrega9)
    clearTimeout(temporizadorEdicion);
    temporizadorEdicion = setTimeout(() => {
        mostrarMensaje(`La edición del socio N° ${id} sigue abierta. Guardá o cancelá los cambios para evitar modificaciones involuntarias.`, "aviso");
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
function cancelarEdicion() {
    salirDeEdicion();
    mostrarMensaje("Se canceló la edición. No se guardaron cambios.", "aviso");
}

//// Función para guardar el formulario 
function guardarSocio() {
    const { nombre, apellido, fechaNacimiento, documento, email, fechaApto } = leerFormulario();
    const idExcluido = socioEditando?.id ?? null;
 
    const error = validarDatos(nombre, apellido, fechaNacimiento, documento, email, fechaApto, idExcluido);
    if (error !== "") {
        mostrarMensaje(error, "error");
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
            null
        );
        socios.push(nuevoSocio);
        idResaltado = nuevoSocio.id;
        mostrarMensaje(`Se agregó a ${nombre} ${apellido} como socio N° ${nuevoSocio.id}. Registrá el primer pago con el botón "Pago".`, "exito");
    } else {
        socioEditando.nombre = nombre;
        socioEditando.apellido = apellido;
        socioEditando.fechaNacimiento = fechaNacimiento;
        socioEditando.numDocumento = documento;
        socioEditando.email = email;
        socioEditando.fechaUltimoApto = fechaApto === "" ? null : fechaApto;
        idResaltado = socioEditando.id;
        mostrarMensaje(`Se guardaron los cambios del socio N° ${socioEditando.id}.`, "exito");
    }
    guardarSocios();
    salirDeEdicion();
    aplicarFiltros();
}
 
//// Función para eliminar un socio por su número de socio 
function eliminarSocio(id) {
    const socioEncontrado = socios.find((socio) => socio.id === id);
    const { nombre, apellido } = socioEncontrado;
    if (socioEditando?.id === id) {
        salirDeEdicion();
    }
    const posicion = socios.indexOf(socioEncontrado);
    socios.splice(posicion, 1);
    guardarSocios();
    aplicarFiltros();
    mostrarMensaje(`Se eliminó al socio N° ${id}, ${nombre} ${apellido}.`, "aviso");
}

//// Función para registrar el pago de la cuota del mes en la fecha del sistema
function registrarPago(id) {
    const socio = socios.find((socioRegistrado) => socioRegistrado.id === id);
    const { nombre, apellido } = socio;
    if (estadoCuota(socio, fechaSistema) === "Al día") {
        mostrarMensaje(`${nombre} ${apellido} ya tiene paga la cuota de ${nombreMes(fechaSistema)}.`, "aviso");
        return;
    }
    const categoria = categoriaCuota(calcularEdad(socio, fechaSistema));
    const monto = precios[categoria];
    const fueraDeTermino = fechaSistema.getDate() > diaLimitePago;
    socio.fechaUltimoPago = fechaATexto(fechaSistema);
    idResaltado = id;
    guardarSocios();
    aplicarFiltros();
    mostrarMensaje(
        `Se registró el pago de ${nombre} ${apellido}: cuota ${categoria} de ${nombreMes(fechaSistema)}, ${formatearMonto(monto)}.` +
        (fueraDeTermino ? " Pago fuera de término: se rehabilita el acceso." : ""),
        "exito"
    );
}

//// Función para registrar un apto físico nuevo con la fecha del sistema
function registrarApto(id) {
    const socio = socios.find((socioRegistrado) => socioRegistrado.id === id);
    const { nombre, apellido } = socio;
    socio.fechaUltimoApto = fechaATexto(fechaSistema);
    idResaltado = id;
    guardarSocios();
    aplicarFiltros();
    mostrarMensaje(`Se registró el apto físico de ${nombre} ${apellido}. Vence el ${fechaATexto(vencimientoApto(socio))}.`, "exito");
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
        mostrarMensaje("La fecha del sistema no es válida. Usá el formato DD/MM/AAAA.", "error");
        inputFechaSistema.value = fechaATexto(fechaSistema);
        return;
    }
    cambiarFechaSistema(textoAFecha(texto));
    mostrarMensaje(`Fecha del sistema: ${texto}.`, "info");
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

//// Función para mostrar el resumen del día en el módulo de avisos
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
    inputPrecioMenor.value = precios.Menor;
    inputPrecioAdulto.value = precios.Adulto;
    inputPrecioSenior.value = precios.Senior;
}

//// Función para guardar los valores de abono editados
function guardarValoresCuota() {
    const valores = {
        Menor: inputPrecioMenor.value,
        Adulto: inputPrecioAdulto.value,
        Senior: inputPrecioSenior.value
    };
    for (const [categoria, valor] of Object.entries(valores)) {
        if (!esNumeroValido(valor) || parseInt(valor) <= 0) {
            mostrarMensaje(`El valor del abono ${categoria} debe ser un número mayor a 0, sin puntos ni signos.`, "error");
            return;
        }
    }
    precios = {
        Menor: parseInt(valores.Menor),
        Adulto: parseInt(valores.Adulto),
        Senior: parseInt(valores.Senior)
    };
    guardarPrecios();
    aplicarFiltros();
    mostrarMensaje("Se actualizaron los valores de abono. Se aplican a los próximos pagos.", "exito");
}

//// Función para leer los socios guardados en el localStorage
function cargarSocios() {
    const sociosGuardados = JSON.parse(localStorage.getItem(claveStorage));
    return sociosGuardados?.map(
        ({ id, nombre, apellido, fechaNacimiento, numDocumento, email, fechaAlta, fechaUltimoApto, fechaUltimoPago }) =>
            new Socio(id, nombre, apellido, fechaNacimiento, numDocumento, email, fechaAlta, fechaUltimoApto, fechaUltimoPago)
    ) ?? crearSociosIniciales();
}

//// Función para guardar el array de socios en el localStorage
function guardarSocios() {
    localStorage.setItem(claveStorage, JSON.stringify(socios));
}

//// Función para leer los valores de cuota guardados
function cargarPrecios() {
    const preciosGuardados = JSON.parse(localStorage.getItem(claveCuotas));
    return preciosGuardados ?? { ...preciosIniciales };
}

//// Función para guardar los valores de cuota
function guardarPrecios() {
    localStorage.setItem(claveCuotas, JSON.stringify(precios));
}

//// Función para restaurar la base de datos con los socios y valores de ejemplo
function restaurarBaseDeDatos() {
    localStorage.clear();
    socios = crearSociosIniciales();
    precios = { ...preciosIniciales };
    guardarSocios();
    guardarPrecios();
    mostrarPrecios();
    salirDeEdicion();
    aplicarFiltros();
    mostrarMensaje("Se restauró la base de datos con los socios y valores de abono de ejemplo.", "aviso");
}

//// Creación de objetos Socio. El id es el número de socio y empieza en 10000.
function crearSociosIniciales() {
    return [
    new Socio(10000, "Carlos", "Escudero", "14/03/1985", "32123456", "carlos.escudero@mail.com", "10/03/2015", "12/02/2026", "02/10/2026"),
    new Socio(10001, "Lucia", "Fernandez", "22/07/2000", "40123456", "lucia.fernandez@mail.com", "22/07/2019", "05/06/2026", "05/10/2026"),
    new Socio(10002, "Jorge", "Gonzalez", "08/11/1970", "25123456", "jorge.gonzalez@mail.com", "15/01/2008", "20/09/2025", "03/08/2026"),
    new Socio(10003, "Mariana", "Rodriguez", "30/05/1982", "27456789", "mariana.rodriguez@mail.com", "30/05/2012", "11/03/2026", "01/10/2026"),
    new Socio(10004, "Carlos", "Fernandez", "18/02/1990", "30987654", "carlos.fernandez@mail.com", "18/02/2020", "25/11/2025", "04/09/2026"),
    new Socio(10005, "Lucia", "Martinez", "03/04/2012", "52123456", "lucia.martinez@mail.com", "01/03/2022", "15/02/2026", "03/10/2026"),
    new Socio(10006, "Diego", "Ramirez", "12/09/1958", "16345678", "diego.ramirez@mail.com", "12/09/1995", "02/08/2025", "03/10/2026"),
    new Socio(10007, "Sofia", "Perez", "19/10/1995", "38456789", "sofia.perez@mail.com", "08/11/2021", "14/04/2026", "10/07/2026"),
    new Socio(10008, "Martin", "Lopez", "14/04/2010", "50987123", "martin.lopez@mail.com", "14/04/2018", "20/01/2026", "06/10/2026"),
    new Socio(10009, "Ana", "Sosa", "25/06/1955", "11456321", "ana.sosa@mail.com", "25/06/1990", "30/12/2025", "02/10/2026"),
    new Socio(10010, "Pablo", "Acosta", "20/01/1998", "41234987", "pablo.acosta@mail.com", "20/01/2023", null, "08/09/2026"),
    new Socio(10011, "Valeria", "Romero", "05/10/1947", "5456123", "valeria.romero@mail.com", "05/10/1985", "10/05/2026", "04/10/2026"),
    new Socio(10012, "Federico", "Castro", "17/08/1992", "36789123", "federico.castro@mail.com", "17/08/2016", "03/07/2026", "05/06/2026"),
    new Socio(10013, "Camila", "Diaz", "12/02/2001", "42987654", "camila.diaz@mail.com", "12/02/2024", "12/02/2026", "09/10/2026"),
    new Socio(10014, "Roberto", "Alvarez", "28/03/1965", "18765432", "roberto.alvarez@mail.com", "28/03/2002", "15/10/2025", "01/10/2026"),
    new Socio(10015, "Florencia", "Benitez", "03/12/1989", "35678912", "florencia.benitez@mail.com", "03/12/2014", "21/08/2026", "02/09/2026"),
    new Socio(10016, "Nicolas", "Torres", "07/04/1997", "40567891", "nicolas.torres@mail.com", "07/04/2025", "07/04/2025", "08/10/2026"),
    new Socio(10017, "Gabriela", "Herrera", "19/09/1978", "26345678", "gabriela.herrera@mail.com", "19/09/2010", "22/10/2025", "03/10/2026"),
    new Socio(10018, "Matias", "Silva", "11/08/2005", "46789123", "matias.silva@mail.com", "11/08/2025", "11/08/2025", "11/08/2026"),
    new Socio(10019, "Daniela", "Molina", "15/03/2014", "62876543", "daniela.molina@mail.com", "15/03/2023", "18/03/2026", "05/10/2026"),
    new Socio(10020, "Andres", "Vega", "02/05/1952", "14567891", "andres.vega@mail.com", "02/05/1988", "09/09/2026", "06/05/2026"),
    new Socio(10021, "Julieta", "Suarez", "21/10/1999", "41876543", "julieta.suarez@mail.com", "01/09/2026", "01/09/2026", "02/10/2026")
    ];
}

//// Valores de cuota vigentes
let precios = { ...preciosIniciales };
 
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
const mensaje = document.getElementById("mensaje");
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
const botonGuardarPrecios = document.getElementById("btn-guardar-precios");

//// Clases CSS para cada estado de cuota
const clasesEstado = { "Al día": "al-dia", "Pendiente": "pendiente", "Moroso": "moroso" };

//// Función para dibujar la tabla de socios en pantalla
function renderizarSocios(lista) {
    cuerpoTabla.innerHTML = lista.length === 0
        ? `<tr><td colspan="8" class="sin-resultados">No hay socios para mostrar.</td></tr>`
        : "";
    lista.forEach((socio) => {
        const { id, nombre, apellido, numDocumento, email, fechaUltimoPago } = socio;
        const edad = calcularEdad(socio, fechaSistema);
        const categoria = categoriaCuota(edad);
        const estado = estadoCuota(socio, fechaSistema);
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
                    <div class="detalle">${fechaUltimoPago ?? "Sin pagos"}</div>
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

//// Carga inicial de los socios y renderizado
try {
    precios = cargarPrecios();
    socios = cargarSocios();
} catch (error) {
    localStorage.clear();
    precios = { ...preciosIniciales };
    socios = crearSociosIniciales();
    mostrarMensaje(`No se pudieron leer los datos guardados (${error.message}). <br><br> Se restauraron los socios de ejemplo.`, "error");
} finally {
    inputFechaSistema.value = fechaATexto(fechaSistema);
    mostrarPrecios();
    aplicarFiltros();
}

/* Recordatorio a trabajar cuando se desarrolle mejor la parte de vencimientos aptos medicos, autorizacion de menores, aranceles, etc
setTimeout(() => {
    if (mensaje.innerHTML === "") {
        const cantidadMenores = filtrarPorCategoria(socios, "Menor").length;
        mostrarMensaje(
            cantidadMenores === 0
                ? "Recordatorio: no hay socios menores de edad registrados."
                : `Recordatorio: hay ${cantidadMenores} ${cantidadMenores === 1 ? "socio menor" : "socios menores"} de edad. Verificá que tengan la autorización firmada de un adulto responsable.`,
            "info"
        );
    }
}, 3000);

*/