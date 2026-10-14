//// Clase Socio
class Socio {
    constructor(id, nombre, apellido, anioNacimiento, numDocumento, email) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.anioNacimiento = anioNacimiento;
        this.numDocumento = numDocumento;
        this.email = email;
    }

//// Método para calcular la edad del socio
    calcularEdad(anioActual) {
        return anioActual - this.anioNacimiento;
    }
}

//// Año actual del simulador
const anioActual = 2026;

//// Key con la que se guardan los socios en el localStorage
const claveStorage = "socios-gimnasio";

//// Función para verificar si un texto contiene números
function contieneNumeros(texto) {
    for (const caracter of texto) {
        if (caracter !== " " && !isNaN(caracter)) {
            return true;
        }
    }
    return false;
}

//// Función para validar un texto
function esTextoValido(valor) {
    return valor !== "" && !contieneNumeros(valor);
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
        (socio) => categoriaCuota(socio.calcularEdad(anioActual)) === categoria
    );
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
function validarDatos(nombre, apellido, anioNacimiento, documento, email, idExcluido) {
    if (hayCamposVacios(nombre, apellido, anioNacimiento, documento, email)) {
        return "Completá todos los campos.";
    }
    if (!esTextoValido(nombre)) {
        return "El nombre es obligatorio y solo puede contener letras.";
    }
    if (!esTextoValido(apellido)) {
        return "El apellido es obligatorio y solo puede contener letras.";
    }
        if (!esNumeroValido(anioNacimiento) || parseInt(anioNacimiento) < 1900 || parseInt(anioNacimiento) > anioActual) {
        return `El año de nacimiento debe ser un número entre 1900 y ${anioActual}.`;
    }
    if (!esNumeroValido(documento)) {
        return "El documento solo puede contener números, sin signos, puntos ni espacios.";
    }
    if (documento.length < 7 || documento.length > 8) {
        return "El documento debe tener entre 7 y 8 dígitos.";
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
    inputAnio.value = "";
    inputDocumento.value = "";
    inputEmail.value = "";
    inputNombre.focus();
}

//// Función para leer los valores del formulario 
function leerFormulario() {
    return {
        nombre: inputNombre.value,
        apellido: inputApellido.value,
        anioNacimiento: inputAnio.value,
        documento: inputDocumento.value,
        email: inputEmail.value.toLowerCase()
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
    const { nombre, apellido, anioNacimiento, numDocumento, email } = socioEditando;
    inputNombre.value = nombre;
    inputApellido.value = apellido;
    inputAnio.value = anioNacimiento;
    inputDocumento.value = numDocumento;
    inputEmail.value = email;
    actualizarModoFormulario();
    mostrarMensaje(`Editando a ${nombre} ${apellido}. Modificá los datos y presioná "Guardar cambios".`, "info");
    inputNombre.focus();
}

//// Función para volver el formulario a modo "agregar"
function salirDeEdicion() {
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
    const { nombre, apellido, anioNacimiento, documento, email } = leerFormulario();
    const idExcluido = socioEditando?.id ?? null;
 
    const error = validarDatos(nombre, apellido, anioNacimiento, documento, email, idExcluido);
    if (error !== "") {
        mostrarMensaje(error, "error");
        return;
    }
 
    if (socioEditando === null) {
        const nuevoSocio = new Socio(
            generarNuevoId(socios),
            nombre,
            apellido,
            parseInt(anioNacimiento),
            documento,
            email
        );
        socios.push(nuevoSocio);
        idResaltado = nuevoSocio.id;
        mostrarMensaje(`Se agregó a ${nombre} ${apellido} como socio N° ${nuevoSocio.id}.`, "exito");
    } else {
        socioEditando.nombre = nombre;
        socioEditando.apellido = apellido;
        socioEditando.anioNacimiento = parseInt(anioNacimiento);
        socioEditando.numDocumento = documento;
        socioEditando.email = email;
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

//// Función para leer los socios guardados en el localStorage
function cargarSocios() {
    const sociosGuardados = JSON.parse(localStorage.getItem(claveStorage));
    return sociosGuardados?.map(
        ({ id, nombre, apellido, anioNacimiento, numDocumento, email }) =>
            new Socio(id, nombre, apellido, anioNacimiento, numDocumento, email)
    ) ?? crearSociosIniciales();
}

//// Función para guardar el array de socios en el localStorage
function guardarSocios() {
    localStorage.setItem(claveStorage, JSON.stringify(socios));
}

//// Función para restaurar la base de datos con los socios de ejemplo
function restaurarBaseDeDatos() {
    socios = crearSociosIniciales();
    guardarSocios();
    salirDeEdicion();
    aplicarFiltros();
    mostrarMensaje("Se restauró la base de datos con los socios de ejemplo.", "aviso");
}

//// Creación de objetos Socio. El id es el número de socio y empieza en 10000.
function crearSociosIniciales() {
    return [
    new Socio(10000, "Carlos", "Escudero", 1985, "32123456", "carlos.escudero@mail.com"),
    new Socio(10001, "Lucia", "Fernandez", 2000, "40123456", "lucia.fernandez@mail.com"),
    new Socio(10002, "Jorge", "Gonzalez", 1970, "25123456", "jorge.gonzalez@mail.com"),
    new Socio(10003, "Mariana", "Rodriguez", 1982, "27456789", "mariana.rodriguez@mail.com"),
    new Socio(10004, "Carlos", "Fernandez", 1990, "30987654", "carlos.fernandez@mail.com"),
    new Socio(10005, "Lucia", "Martinez", 2012, "52123456", "lucia.martinez@mail.com"),
    new Socio(10006, "Diego", "Ramirez", 1958, "16345678", "diego.ramirez@mail.com"),
    new Socio(10007, "Sofia", "Perez", 1995, "38456789", "sofia.perez@mail.com"),
    new Socio(10008, "Martin", "Lopez", 2010, "50987123", "martin.lopez@mail.com"),
    new Socio(10009, "Ana", "Sosa", 1955, "11456321", "ana.sosa@mail.com"),
    new Socio(10010, "Pablo", "Acosta", 1998, "41234987", "pablo.acosta@mail.com"),
    new Socio(10011, "Valeria", "Romero", 1947, "5456123", "valeria.romero@mail.com"),
    new Socio(10012, "Federico", "Castro", 1992, "36789123", "federico.castro@mail.com"),
    new Socio(10013, "Camila", "Diaz", 2001, "42987654", "camila.diaz@mail.com"),
    new Socio(10014, "Roberto", "Alvarez", 1965, "18765432", "roberto.alvarez@mail.com"),
    new Socio(10015, "Florencia", "Benitez", 1989, "35678912", "florencia.benitez@mail.com"),
    new Socio(10016, "Nicolas", "Torres", 1997, "40567891", "nicolas.torres@mail.com"),
    new Socio(10017, "Gabriela", "Herrera", 1978, "26345678", "gabriela.herrera@mail.com"),
    new Socio(10018, "Matias", "Silva", 2005, "46789123", "matias.silva@mail.com"),
    new Socio(10019, "Daniela", "Molina", 2014, "62876543", "daniela.molina@mail.com"),
    new Socio(10020, "Andres", "Vega", 1952, "14567891", "andres.vega@mail.com"),
    new Socio(10021, "Julieta", "Suarez", 1999, "41876543", "julieta.suarez@mail.com")
    ];
}

//// Array de socios con el que trabaja el simulador 
let socios = cargarSocios();

//// Socio que se está editando .
let socioEditando = null;

//// Número de socio a resaltar en la tabla después de agregarlo o modificarlo
let idResaltado = null;

//// Selección de elementos del DOM
const tituloFormulario = document.getElementById("titulo-formulario");
const inputNombre = document.getElementById("nombre");
const inputApellido = document.getElementById("apellido");
const inputAnio = document.getElementById("anio-nacimiento");
const inputDocumento = document.getElementById("documento");
const inputEmail = document.getElementById("email");
const botonGuardar = document.getElementById("btn-guardar");
const botonCancelar = document.getElementById("btn-cancelar");
const inputBuscar = document.getElementById("buscar");
const selectCategoria = document.getElementById("filtro-categoria");
const cuerpoTabla = document.getElementById("cuerpo-tabla");
const mensaje = document.getElementById("mensaje");
const contador = document.querySelector("#contador");
const botonRestaurar = document.getElementById("btn-restaurar");

//// Función para dibujar la tabla de socios en pantalla
function renderizarSocios(lista) {
    cuerpoTabla.innerHTML = lista.length === 0
        ? `<tr><td colspan="7" class="sin-resultados">No hay socios para mostrar.</td></tr>`
        : "";
    lista.forEach((socio) => {
        const { id, nombre, apellido, numDocumento, email } = socio;
        const edad = socio.calcularEdad(anioActual);
        const categoria = categoriaCuota(edad);
        const claseFila = id === idResaltado ? "resaltado" : "";
        cuerpoTabla.innerHTML += `
            <tr class="${claseFila}">
                <td class="col-numero">${id}</td>
                <td>${apellido}, ${nombre}</td>
                <td>${numDocumento}</td>
                <td>${email}</td>
                <td>${edad}</td>
                <td><span class="categoria ${categoria.toLowerCase()}">${categoria}</span></td>
                <td class="col-acciones">
                    <button id="editar-${id}" class="btn-editar">Editar</button>
                    <button id="eliminar-${id}" class="btn-eliminar">Eliminar</button>
                </td>
            </tr>
        `;
    });
//// Asignar los eventos a los botones de cada fila 
    lista.forEach(({ id }) => {
        const botonEditar = document.getElementById(`editar-${id}`);
        const botonEliminar = document.getElementById(`eliminar-${id}`);
        botonEditar.addEventListener("click", () => iniciarEdicion(id));
        botonEliminar.addEventListener("click", () => eliminarSocio(id));
    });
    contador.innerHTML = `Mostrando ${lista.length} de ${socios.length} ${socios.length === 1 ? "socio" : "socios"}`;
//// El resaltado se muestra una sola vez
    idResaltado = null;
}

//// Función para aplicar la búsqueda y el filtro de categoría antes de renderizar
function aplicarFiltros() {
    const texto = inputBuscar.value.toLowerCase();
    const categoria = selectCategoria.value;
    const porTexto = texto !== "" ? buscarPorTexto(socios, texto) : socios;
    const resultado = categoria !== "todas" ? filtrarPorCategoria(porTexto, categoria) : porTexto;
    renderizarSocios(resultado);
}

//// Eventos de botones
botonGuardar.addEventListener("click", guardarSocio);
botonCancelar.addEventListener("click", cancelarEdicion);
botonRestaurar.addEventListener("click", restaurarBaseDeDatos);

//// Eventos de teclado en el formulario 
const inputsFormulario = [inputNombre, inputApellido, inputAnio, inputDocumento, inputEmail];
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

//// Eventos del buscador y del filtro
inputBuscar.addEventListener("keyup", aplicarFiltros);
selectCategoria.addEventListener("change", aplicarFiltros);

//// Renderizado inicial
aplicarFiltros();
