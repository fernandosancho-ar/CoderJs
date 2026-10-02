//// Clase Usuario
class Usuario {
    constructor(id, nombre, apellido, anioNacimiento, numDocumento) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.anioNacimiento = anioNacimiento;
        this.numDocumento = numDocumento;
    }

//// Método para calcular la edad del usuario
    calcularEdad(anioActual) {
        return anioActual - this.anioNacimiento;
    }
}

//// Función para mostrar los datos en consola //// Imprime datos ingresados en consola.
function mostrarDatos(usuario, anioActual) { 
    const edad = usuario.calcularEdad(anioActual); 
    
    console.log("===== DATOS DEL USUARIO PROMPTEADO ===="); 
    console.log("Nombre Completo: " + usuario.nombre + " " + usuario.apellido); 
    console.log("Año actual: " + anioActual); 
    console.log("Año de nacimiento: " + usuario.anioNacimiento); 
    console.log("Edad: " + edad); 
    console.log("Documento: " + usuario.numDocumento); 
    console.log("======================================="); }

//// Función para consultar un usuario
function consultarUsuario(usuarios, anioActual) {
    const documentoConsultar = prompt("Ingresá el número de documento del usuario que querés consultar:");
    if (documentoConsultar === null) {
        return;
    }
    const usuarioEncontrado = buscarUsuarioPorDocumento(
        usuarios,
        documentoConsultar
    );
    if (usuarioEncontrado !== null) {
        if (usuarios.includes(usuarioEncontrado)) {
            const posicion = usuarios.indexOf(usuarioEncontrado);
            alert(
                "Usuario encontrado.\n\n" +
                "ID: " + usuarioEncontrado.id + "\n" +
                "Posición em array: " + posicion + "\n" +
                "Nombre: " + usuarioEncontrado.nombre + "\n" +
                "Apellido: " + usuarioEncontrado.apellido + "\n" +
                "Documento: " + usuarioEncontrado.numDocumento + "\n" +
                "Edad: " + usuarioEncontrado.calcularEdad(anioActual)
            );
            console.log("Usuario encontrado en posición: " + posicion);
        }
    } else {
        alert("No se encontró ningún usuario con ese número de documento.");
    }
}

//// Función para buscar un usuario por documento 
function buscarUsuarioPorDocumento(usuarios, documento) {
    const usuarioEncontrado = usuarios.find(
        (usuarioRegistrado) => usuarioRegistrado.numDocumento === documento
    );
    if (usuarioEncontrado === undefined) {
        return null;
    }
    return usuarioEncontrado;
}

//// Función para agregar un usuario en una posición específica 
function agregarEnPosicion(usuarios, nuevoUsuario) {
    const posicion = parseInt(
        prompt(
            "Ingresá la posición donde querés agregar el usuario.\n\n" +
            "La primera posición es 0."
        )
    );
    if (
        isNaN(posicion) ||
        posicion < 0 ||
        posicion > usuarios.length
    ) {
        alert("La posición ingresada no es válida.");
        return;
    }
    usuarios.splice(posicion,0,nuevoUsuario);
    alert("El usuario fue agregado en la posición " + posicion + ".");
}

//// Función para verificar si un texto contiene números
function contieneNumeros(texto) {
    for (const caracter of texto) {
        if (caracter !== " " && !isNaN(caracter)) {
            return true;
        }
    }
    return false;
}

//// Función para verificar si un documento ya está registrado 
function documentoExiste(usuarios, documento) {
    return usuarios.some(
        (usuarioRegistrado) => usuarioRegistrado.numDocumento === documento
    );
}
 
//// Función para generar un nuevo id 
function generarNuevoId(usuarios) {
    const idMaximo = usuarios.reduce(
        (maximo, usuarioRegistrado) => {
            if (usuarioRegistrado.id > maximo) {
                return usuarioRegistrado.id;
            }
            return maximo;
        },
        0
    );
    return idMaximo + 1;
}

//// Función para agregar un nuevo usuario
function agregarUsuario(usuarios) {
    const nombreNuevo = prompt("Ingresá el nombre del nuevo usuario:");
    if (nombreNuevo === null) {
        return;
    }
    const apellidoNuevo = prompt("Ingresá el apellido del nuevo usuario:");
    if (apellidoNuevo === null) {
        return;
    }
    const anioNacimientoNuevo = parseInt(
        prompt("Ingresá el año de nacimiento del nuevo usuario:")
    );
    if (isNaN(anioNacimientoNuevo)) {
        alert("El año ingresado no es válido.");
        return;
    }
    const documentoNuevo = prompt("Ingresá el número de documento del nuevo usuario:");
    if (documentoNuevo === null) {
        return;
    }
    if (documentoExiste(usuarios, documentoNuevo)) {
        alert("Ya existe un usuario con ese número de documento.");
        return;
    }
    const nuevoId = generarNuevoId(usuarios);
    const nuevoUsuario = new Usuario(
        nuevoId,
        nombreNuevo,
        apellidoNuevo,
        anioNacimientoNuevo,
        documentoNuevo
    );
    const ubicacion = parseInt(
        prompt(
            "¿Dónde querés agregar el nuevo usuario?\n\n" +
            "1 - Al principio\n" +
            "2 - Al final\n" +
            "3 - En una posición específica"
        )
    );
    switch (ubicacion) {

        case 1:
            usuarios.unshift(nuevoUsuario);
            alert("El usuario fue agregado al principio del conjunto.");
            break;

        case 2:
            usuarios.push(nuevoUsuario);
            alert("El usuario fue agregado al final del conjunto.");
            break;

        case 3:
            agregarEnPosicion(usuarios, nuevoUsuario);
            break;

        default:
            alert("Opción incorrecta.");
            break;
    }
}

//// Función para eliminar el usuario 
function eliminarUsuario(usuarios) {
    const documentoEliminar = prompt("Ingresá el número de documento del usuario que querés eliminar:");
    if (documentoEliminar === null) {
        return;
    }
    const usuarioEncontrado = buscarUsuarioPorDocumento(
        usuarios,
        documentoEliminar
    );
    if (usuarioEncontrado === null) {
        alert("No se encontró ningún usuario con ese número de documento.");
        return;
    }
    if (usuarios.length === 1) {
        alert("No se puede eliminar el usuario.\n\n" + "La base de datos debe tener al menos un usuario.");
        return;
    }
    const posicion = usuarios.indexOf(usuarioEncontrado);
    const confirmar = confirm(
        "Vas a eliminar el siguiente usuario:\n\n" +
        "Nombre: " + usuarioEncontrado.nombre + "\n" +
        "Apellido: " + usuarioEncontrado.apellido + "\n" +
        "Documento: " + usuarioEncontrado.numDocumento + "\n\n" +
        "¿Querés continuar?"
    );
    if (!confirmar) {
        return;
    }
    usuarios.splice(posicion, 1);
    alert("El usuario fue eliminado correctamente.");
    console.log("Usuario eliminado:");
    console.log(usuarioEncontrado);
}

//// Función para mostrar todos los usuarios registraos
function mostrarUsuarios(usuarios, anioActual) {
    let datosUsuarios = "USUARIOS REGISTRADOS\n\n";
    usuarios.forEach((usuarioRegistrado) => {
        datosUsuarios +=
            "ID: " + usuarioRegistrado.id + "\n" +
            "Nombre: " + usuarioRegistrado.nombre + "\n" +
            "Apellido: " + usuarioRegistrado.apellido + "\n" +
            "Documento: " + usuarioRegistrado.numDocumento + "\n" +
            "Edad: " + usuarioRegistrado.calcularEdad(anioActual) + "\n\n";
    });
    alert(datosUsuarios);
    console.log(
        "========== USUARIOS REGISTRADOS =========="
    );
    usuarios.forEach((usuarioRegistrado) => {
        console.log(usuarioRegistrado);
    });
    console.log("==========================================");
}

//// Función para filtrar usuarios por categoría de edad 
function filtrarPorCategoria(usuarios, anioActual, categoria) {
    return usuarios.filter(
        (usuarioRegistrado) => categoriaEdad(usuarioRegistrado.calcularEdad(anioActual)) === categoria
    );
}

//// Función para consultar usuarios según la categoría elegida
function consultarUsuariosPorCategoria(usuarios, anioActual) {
    const opcionCategoria = parseInt(
        prompt(
            "¿Qué categoría querés ver?\n\n" +
            "1 - Menores de edad\n" +
            "2 - Adultos\n" +
            "3 - Adultos mayores\n" +
            "9 - Volver"
        )
    );
    let categoriaElegida;
    switch (opcionCategoria) {
        case 1:
            categoriaElegida = "menor de edad";
            break;
 
        case 2:
            categoriaElegida = "adulto";
            break;
 
        case 3:
            categoriaElegida = "adulto mayor";
            break;
 
        case 9:
            return;
 
        default:
            alert("Opción incorrecta.");
            return;
    }
    const usuariosFiltrados = filtrarPorCategoria(
        usuarios,
        anioActual,
        categoriaElegida
    );
    if (usuariosFiltrados.length === 0) {
        alert("No hay usuarios en la categoría: " + categoriaElegida + ".");
        return;
    }
    let datosFiltrados = "USUARIOS - CATEGORÍA: " + categoriaElegida + "\n\n";
    usuariosFiltrados.forEach((usuarioRegistrado) => {
        datosFiltrados +=
            "ID: " + usuarioRegistrado.id + "\n" +
            "Nombre: " + usuarioRegistrado.nombre + " " + usuarioRegistrado.apellido + "\n" +
            "Edad: " + usuarioRegistrado.calcularEdad(anioActual) + "\n\n";
    });
    alert(datosFiltrados);
    console.log("Consulta filtro por categoría: " + categoriaElegida);
    console.log(usuariosFiltrados);
}
 
//// Función para transformar los datos de los usuarios 
function transformarUsuarios(usuarios, anioActual) {
    return usuarios.map((usuarioRegistrado) => {
        return {
            nombreCompleto: usuarioRegistrado.nombre + " " + usuarioRegistrado.apellido,
            documento: usuarioRegistrado.numDocumento,
            edad: usuarioRegistrado.calcularEdad(anioActual),
            anioNacimiento: usuarioRegistrado.anioNacimiento
        };
    });
}
 
//// Función para mostrar los datos transformados
function mostrarDatosTransformados(usuarios, anioActual) {
    const datosTransformados = transformarUsuarios(
        usuarios,
        anioActual
    );
    let textoTransformado = "DATOS TRANSFORMADOS\n\n";
    datosTransformados.forEach((dato) => {
        textoTransformado +=
            " | Nombre Completo: " + dato.nombreCompleto +
            " | Documento: " + dato.documento +
            " | Edad: " + dato.edad +
            " | Año de nacimiento: " + dato.anioNacimiento + "\n";
    });
    alert(textoTransformado);
    console.log("========== DATOS TRANSFORMADOS ==========");
    console.log(datosTransformados);
    console.log("=========================================");
}
 
//// Función para consultar si la persona es mayor o menor de edad //// Recibe la edad como parámetro.
function verificarMayorEdad(edad) {
    if (edad >= 18) {
        return "Sos mayor de edad.";
    } else {
        return "Sos menor de edad.";
    }
}

//// Función para determinar la categoría de edad //// Recibe la edad como parámetro y retorna una categoría.
function categoriaEdad(edad) {
    if (edad < 18) {
        return "menor de edad";
    } else if (edad < 65) {
        return "adulto";
    } else {
        return "adulto mayor";
    }
}

//// Función para consultar la edad
function consultarEdad(usuario, anioActual) {
    const edad = usuario.calcularEdad(anioActual);
    alert("Su edad es de " + edad +" años.");
    console.log("Ver edad");
}

//// Función para consultar la mayoría de edad
function consultarMayorEdad(usuario, anioActual) {
    const edad = usuario.calcularEdad(anioActual);
    const resultado = verificarMayorEdad(edad);
    alert(resultado);
    console.log("Consulta mayoría de edad");
}

//// Función para consultar la categoría de edad
function consultarCategoria(usuario, anioActual) {
    const edad = usuario.calcularEdad(anioActual);
    const categoria = categoriaEdad(edad);
    alert("Sos un " + categoria + ".");
    console.log("Consulta categoría de edad");
}

//// Función para consultar un dato del usuario
function consultarDato(usuario, anioActual) {
    const datoConsultar = parseInt(
        prompt(
            "¿Qué dato querés consultar?\n\n" +
            "1 - Nombre\n" +
            "2 - Nombre\n" +
            "3 - Apellido\n" +
            "4 - Año de nacimiento\n" +
            "5 - Número de documento\n" +
            "6 - Edad\n" +
            "9 - Volver\n" +
            "0 - Salir"
        )
    );
    switch (datoConsultar) {
        case 1:
            alert("Id registrado:\n\n" + usuario.id);
            console.log("Consulta realizada: Id = " + usuario.Id);
            break;

        case 2:
            alert("Nombre registrado:\n\n" + usuario.nombre);
            console.log("Consulta realizada: Nombre = " + usuario.nombre);
            break;

        case 3:
            alert("Apellido registrado:\n\n" + usuario.apellido);
            console.log("Consulta realizada: Apellido = " + usuario.apellido);
            break;

        case 4:
            alert("Año de nacimiento registrado:\n\n" + usuario.anioNacimiento);
            console.log("Consulta realizada: Año de nacimiento = " + usuario.anioNacimiento);
            break;

        case 5:
            alert("Número de documento registrado:\n\n" + usuario.numDocumento);
            console.log("Consulta realizada: Número de documento = " + usuario.numDocumento);
            break;

        case 6:
            alert("Edad registrada:\n\n" + usuario.calcularEdad(anioActual));

            console.log("Consulta realizada: Edad = " + usuario.calcularEdad(anioActual));
            break;

        case 9:
            return "volver";

        case 0:
            return "salir";

        default:
            alert("Opción incorrecta.");
            break;
    }
}

//// Función para buscar los datos de un usuario a modificar
function modificarUsuario(usuarios, anioActual) {
    const documentoModificar = prompt("Ingresá el número de documento del usuario que querés modificar:");
    if (documentoModificar === null) {
        return anioActual;
    }
    const usuarioEncontrado = buscarUsuarioPorDocumento(
        usuarios, documentoModificar
    );
    if (usuarioEncontrado === null) {
        alert("No se encontró ningún usuario con ese número de documento.");
        return anioActual;
    }
    let modificando = true;
    while (modificando) {
        const resultadoModificacion = modificarDato(
            usuarioEncontrado, anioActual
        );
        if (resultadoModificacion === "salir") {
            return "salir";
        }
        if (resultadoModificacion === "volver") {
            modificando = false;
        }
    }
    return anioActual;
}

//// Función para modificar un dato del usuario
function modificarDato(usuario, anioActual) {

    const datoModificar = parseInt(
        prompt(
            "¿Qué dato querés modificar?\n\n" +
            "1 - Nombre\n" +
            "2 - Apellido\n" +
            "3 - Año de nacimiento\n" +
            "4 - Número de documento\n" +
            "9 - Volver\n" +
            "0 - Salir"
        )
    );
    let propiedadModificar;
    switch (datoModificar) {

        case 1:
            propiedadModificar = "nombre";
            break;

        case 2:
            propiedadModificar = "apellido";
            break;

        case 3:
            propiedadModificar = "anioNacimiento";
            break;

        case 4:
            propiedadModificar = "numDocumento";
            break;    

        case 9:
            return "volver";
            
        case 0:
            return "salir";    

        default:
            alert("Opción incorrecta.");
            return anioActual;
    }
    const datoNuevo = prompt(
        "El dato actual es:\n\n" + usuario[propiedadModificar] +
        "\n\nIngresá el nuevo valor:"
    );
    if (datoNuevo === null) {
        return anioActual;
    }
    if (datoNuevo === "") {
        alert("No ingresaste ningún valor. El dato no fue modificado.");
        return anioActual;
    }
    let valorFinal;
    if (propiedadModificar === "anioNacimiento") {
        if (isNaN(datoNuevo)) {
            alert("El año debe contener solo números. El dato no fue modificado.");
            return anioActual;
        }
        valorFinal = parseInt(datoNuevo);
    } else if (propiedadModificar === "numDocumento") {
        if (isNaN(datoNuevo)) {
            alert("El documento debe contener solo números. El dato no fue modificado.");
            return anioActual;
        }
        valorFinal = datoNuevo;
    } else {
        if (contieneNumeros(datoNuevo)) {
            alert("El nombre y el apellido no pueden contener números. El dato no fue modificado.");
            return anioActual;
        }
        valorFinal = datoNuevo;
    }
}

//// Función para mostrar los datos actuales del usuario
function mostrarDatosUsuario(usuario, anioActual) {
    alert("DATOS DEL USUARIO\n\n" +
        "Id: " + usuario.id + "\n" +
        "Nombre: " + usuario.nombre + "\n" +
        "Apellido: " + usuario.apellido + "\n" +
        "Año de nacimiento: " + usuario.anioNacimiento + "\n" +
        "Número de documento: " + usuario.numDocumento + "\n" +
        "Edad: " + usuario.calcularEdad(anioActual)
    );
    console.log("Datos actuales del usuario:");
    console.log(usuario);
}

//// Función para gestionar los datos del usuario
function gestionarDatos(usuarios, anioActual) {
    let gestionar = true;
    console.log("Consulta gestor de datos");
    while (gestionar) {
        const opcionDatos = parseInt(
            prompt(
                "GESTOR DE DATOS\n" +
                "1 - Consultar usuario\n" +
                "2 - Agregar usuario\n" +
                "3 - Eliminar usuario\n" +
                "4 - Modificar usuario\n" +
                "5 - Ver usuarios\n" +
                "6 - Filtrar usuarios por categoría\n" +
                "7 - Ver datos transformados\n" +
                "9 - Volver\n" +
                "0 - Salir"
            )
        );
        switch (opcionDatos) {
            case 1:
                consultarUsuario(usuarios,anioActual);
                break;

            case 2:
                agregarUsuario(usuarios);
                break;

            case 3:
                eliminarUsuario(usuarios);
                break;

            case 4:
                if (modificarUsuario(usuarios, anioActual) === "salir") {
                    return "salir";
                }
                break;    

            case 5:
                mostrarUsuarios(usuarios, anioActual);
                break;

            case 6:
                consultarUsuariosPorCategoria(usuarios, anioActual);
                break;
 
            case 7:
                mostrarDatosTransformados(usuarios,  anioActual);
                break;
 
            case 9:
                gestionar = false;
                break;

            case 0:
                return "salir";

            default:
                alert("Opción incorrecta.");
                break;
        }
    }
    return anioActual;
}

//// Función para modificar el año actual 
function modificarAnioActual(anioActual) {
    const nuevoAnioActual = parseInt(
        prompt("El año actual es " + anioActual + ".\n\n" +
            "Ingresá el nuevo año actual:")
    );
    if (isNaN(nuevoAnioActual)) {
        alert("El año ingresado no es válido.");
        return anioActual;
    }
    alert( "El año actual fue modificado correctamente.\n\n" +
        "Nuevo año actual: " + nuevoAnioActual
    );
    console.log("Año actual modificado: " + nuevoAnioActual);
    return nuevoAnioActual;
}

//// Función para abrir el gestor de datos desde el menú principal 
function abrirGestorDatos() {
    const resultadoGestor = gestionarDatos(
        usuarios, anioActual 
    );
    if (resultadoGestor === "salir") {
        continuar = false;
    } else {
        anioActual = resultadoGestor;
    }
}

//// Solicitar datos al usuario
let anioActual = parseInt(prompt("Ingrese el año actual en formato AAAA"));
const nombre = prompt( "Ingrese su nombre");
const apellido = prompt( "Ingrese su apellido");
const anioNacimiento = parseInt(prompt ("Ingrese año de nacimiento en formato AAAA"));
const numDocumento = prompt( "Ingrese número de documento");

//// Creación de objetos Usuario
const usuario = new Usuario(
    1,
    nombre,
    apellido,
    anioNacimiento,
    numDocumento
);

const usuario2 = new Usuario(
    2, 
    "Carlos",
    "Escudero",
    1985,
    "32123456"
);

const usuario3 = new Usuario(
    3,
    "Lucia",
    "Fernandez",
    2000,
    "40123456"
);

const usuario4 = new Usuario(
    4,
    "Jorge",
    "Gonzalez",
    1970,
    "25123456"
);

const usuario5 = new Usuario(
    5,
    "Mariana",
    "Rodriguez",
    1982,
    "27456789"
);

const usuario6 = new Usuario(
    6,
    "Carlos",
    "Fernandez",
    1990,
    "30987654"
);

const usuario7 = new Usuario(
    7,
    "Lucia",
    "Martinez",
    2020,
    "42123456"
);

const usuario8 = new Usuario(
    8,
    "Diego",
    "Ramirez",
    1958,
    "16345678"
);

const usuario9 = new Usuario(
    9,
    "Sofia",
    "Perez",
    1995,
    "38456789"
);

//// Array de objetos Usuario
const usuarios = [
    usuario,
    usuario2,
    usuario3,
    usuario4,
    usuario5,
    usuario6,
    usuario7,
    usuario8,
    usuario9    
];

//// Mostrar los objetos creados en consola
console.log( "========== USUARIOS CREADOS ==========" );
for (const usuarioRegistrado of usuarios) {
    console.log(usuarioRegistrado);
    console.log( "Edad: " + usuarioRegistrado.calcularEdad(anioActual));
}
console.log( "=======================================" );
 
//// Mostrar datos del usuario ingresado
mostrarDatos( usuario, anioActual);
 
//// Mostrar saludo inicial
const edad = usuario.calcularEdad(anioActual );
alert("Hola " + usuario.nombre + ", tu apellido es " + usuario.apellido + " y tu edad es de " + edad + " años.");

//// Bucle principal del simulador
let continuar = true;
console.log("========= CONSULTAS REALIZADAS =========");
while (continuar) {
    const menu = parseInt(
        prompt(
            "Ingrese una opción:\n" +
            "1 - Ver edad\n" +
            "2 - Consultar mayoría de edad\n" +
            "3 - Consultar categoría de edad\n" +
            "4 - Gestor de datos\n" +
            "5 - Modificar año actual\n" +
            "0 - Salir"
        )
    );

//// Switch principal del simulador
    switch (menu) {
        case 1:
            consultarEdad(usuario, anioActual );
            break;

        case 2:
            consultarMayorEdad(usuario, anioActual);
            break;

        case 3:
            consultarCategoria(usuario, anioActual );
            break;

        case 4:
            abrirGestorDatos();
            break;

        case 5:
            anioActual = modificarAnioActual(anioActual);
            break;

        case 0:
            continuar = false;
            break;

        default:
            alert( "Opción incorrecta. " + "Por favor, seleccione una opción del 0 al 4." );
            console.log("Opción incorrecta ingresada: " + menu);
            break;
    }

}

//// Mensaje salida del simulador
alert("Gracias por utilizar el simulador.");
console.log("El usuario salió del simulador.");