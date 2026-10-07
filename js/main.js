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
    return valor !== "" && !isNaN(valor);
}

//// Función para validar un email 
function esEmailValido(valor) {
    return valor !== "" && valor.includes("@") && valor.includes(".") && !valor.includes(" ");
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
    if (edad < 18) {
        return "Menor";
    } else if (edad < 65) {
        return "Adulto";
    } else {
        return "Senior";
    }
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
        const nombreCompleto = (socio.nombre + " " + socio.apellido).toLowerCase();
        return socio.id.toString().includes(texto) ||
            nombreCompleto.includes(texto) ||
            socio.numDocumento.includes(texto) ||
            socio.email.includes(texto);
    });
}

//// Función para validar los datos del formulario 
function validarDatos(nombre, apellido, anioNacimiento, documento, email, idExcluido) {
    if (!esTextoValido(nombre)) {
        return "El nombre es obligatorio y solo puede contener letras.";
    }
    if (!esTextoValido(apellido)) {
        return "El apellido es obligatorio y solo puede contener letras.";
    }
    if (!esNumeroValido(anioNacimiento)) {
        return "El año de nacimiento es obligatorio y solo puede contener números.";
    }
    if (parseInt(anioNacimiento) > anioActual) {
        return "El año de nacimiento no puede ser posterior a " + anioActual + ".";
    }
    if (!esNumeroValido(documento)) {
        return "El documento es obligatorio y solo puede contener números.";
    }
    if (documentoExiste(socios, documento, idExcluido)) {
        return "Ya existe otro socio con el documento " + documento + ".";
    }
    if (!esEmailValido(email)) {
        return "El email no es válido. Debe tener el formato nombre@dominio.com.";
    }
    if (emailExiste(socios, email, idExcluido)) {
        return "Ya existe otro socio con el email " + email + ".";
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

//// Función para pasar el formulario a modo edición con los datos del socio elegido
function iniciarEdicion(id) {
    socioEditando = socios.find((socio) => socio.id === id);
    inputNombre.value = socioEditando.nombre;
    inputApellido.value = socioEditando.apellido;
    inputAnio.value = socioEditando.anioNacimiento;
    inputDocumento.value = socioEditando.numDocumento;
    inputEmail.value = socioEditando.email;
    tituloFormulario.innerHTML = `Editando socio N° ${socioEditando.id}`;
    botonGuardar.innerHTML = "Guardar cambios";
    botonCancelar.hidden = false;
    mostrarMensaje(`Editando a ${socioEditando.nombre} ${socioEditando.apellido}. Modificá los datos y presioná "Guardar cambios".`, "info");
    inputNombre.focus();
}

//// Función para volver el formulario a modo "agregar"
function salirDeEdicion() {
    socioEditando = null;
    tituloFormulario.innerHTML = "Nuevo socio";
    botonGuardar.innerHTML = "+ Agregar socio";
    botonCancelar.hidden = true;
    limpiarFormulario();
}

//// Función para cancelar la edición sin guardar cambios
function cancelarEdicion() {
    salirDeEdicion();
    mostrarMensaje("Se canceló la edición. No se guardaron cambios.", "aviso");
}

//// Función para guardar el formulario 
function guardarSocio() {
    const nombre = inputNombre.value;
    const apellido = inputApellido.value;
    const anioNacimiento = inputAnio.value;
    const documento = inputDocumento.value;
    const email = inputEmail.value.toLowerCase();

    let idExcluido = null;
    if (socioEditando !== null) {
        idExcluido = socioEditando.id;
    }

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
    salirDeEdicion();
    aplicarFiltros();
}

//// Función para eliminar un socio por su número de socio 
function eliminarSocio(id) {
    const socioEncontrado = socios.find((socio) => socio.id === id);
    const confirmado = confirm(
        `¿Seguro que querés eliminar al socio N° ${socioEncontrado.id}, ${socioEncontrado.nombre} ${socioEncontrado.apellido}?\n\n` +
        "Esta acción no se puede deshacer."
    );
    if (!confirmado) {
        return;
    }
    if (socioEditando !== null && socioEditando.id === id) {
        salirDeEdicion();
    }
    const posicion = socios.indexOf(socioEncontrado);
    socios.splice(posicion, 1);
    aplicarFiltros();
    mostrarMensaje(`Se eliminó al socio N° ${socioEncontrado.id}, ${socioEncontrado.nombre} ${socioEncontrado.apellido}.`, "aviso");
}

//// Creación de objetos Socio. El id es el número de socio y empieza en 10000.
const socios = [
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
    new Socio(10011, "Valeria", "Romero", 1987, "33456123", "valeria.romero@mail.com")
];

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

//// Función para dibujar la tabla de socios en pantalla
function renderizarSocios(lista) {
    cuerpoTabla.innerHTML = "";
    if (lista.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="7" class="sin-resultados">No hay socios para mostrar.</td></tr>`;
    }
    lista.forEach((socio) => {
        const edad = socio.calcularEdad(anioActual);
        const categoria = categoriaCuota(edad);
        let claseFila = "";
        if (socio.id === idResaltado) {
            claseFila = "resaltado";
        }
        cuerpoTabla.innerHTML += `
            <tr class="${claseFila}">
                <td class="col-numero">${socio.id}</td>
                <td>${socio.apellido}, ${socio.nombre}</td>
                <td>${socio.numDocumento}</td>
                <td>${socio.email}</td>
                <td>${edad}</td>
                <td><span class="categoria ${categoria.toLowerCase()}">${categoria}</span></td>
                <td class="col-acciones">
                    <button id="editar-${socio.id}" class="btn-editar">Editar</button>
                    <button id="eliminar-${socio.id}" class="btn-eliminar">Eliminar</button>
                </td>
            </tr>
        `;
    });
//// Asignar los eventos a los botones de cada fila 
    lista.forEach((socio) => {
        const botonEditar = document.getElementById(`editar-${socio.id}`);
        const botonEliminar = document.getElementById(`eliminar-${socio.id}`);
        botonEditar.addEventListener("click", () => iniciarEdicion(socio.id));
        botonEliminar.addEventListener("click", () => eliminarSocio(socio.id));
    });
    contador.innerHTML = `Mostrando ${lista.length} de ${socios.length} socios`;
//// El resaltado se muestra una sola vez
    idResaltado = null;
}

//// Función para aplicar la búsqueda y el filtro de categoría antes de renderizar
function aplicarFiltros() {
    let resultado = socios;
    const texto = inputBuscar.value.toLowerCase();
    if (texto !== "") {
        resultado = buscarPorTexto(resultado, texto);
    }
    const categoria = selectCategoria.value;
    if (categoria !== "todas") {
        resultado = filtrarPorCategoria(resultado, categoria);
    }
    renderizarSocios(resultado);
}

//// Eventos de botones
botonGuardar.addEventListener("click", guardarSocio);
botonCancelar.addEventListener("click", cancelarEdicion);

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
