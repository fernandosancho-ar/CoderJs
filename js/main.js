//// Mi Primer Script Interactivo


//// Clase Usuario
class Usuario {
    constructor(nombre, apellido, anioNacimiento, numDocumento) {
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

//// Función para consultar un usuario dentro de la colección
function consultarUsuario(usuarios, anioActual) {
    const documentoConsultar = prompt("Ingresá el número de documento del usuario que querés consultar:");
    if (documentoConsultar === null) {
        return;
    }
    let usuarioEncontrado = null;
    for (const usuarioRegistrado of usuarios) {
        if (usuarioRegistrado.numDocumento === documentoConsultar) {
            usuarioEncontrado = usuarioRegistrado;
            break;
        }
    }
    if (usuarioEncontrado !== null) {
        if (usuarios.includes(usuarioEncontrado)) {
            const posicion = usuarios.indexOf(usuarioEncontrado);
            alert(
                "Usuario encontrado.\n\n" +
                "Posición en la colección: " + posicion + "\n" +
                "Nombre: " + usuarioEncontrado.nombre + "\n" +
                "Apellido: " + usuarioEncontrado.apellido + "\n" +
                "Documento: " + usuarioEncontrado.numDocumento + "\n" +
                "Edad: " +
                usuarioEncontrado.calcularEdad(anioActual)
            );
            console.log("Usuario encontrado en posición: " + posicion);
        }
    } else {
        alert("No se encontró ningún usuario con ese número de documento.");
    }
}

//// Función para agregar un nuevo usuario a la colección
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
    const nuevoUsuario = new Usuario(
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
            alert("El usuario fue agregado al principio de la colección.");
            break;

        case 2:
            usuarios.push(nuevoUsuario);
            alert("El usuario fue agregado al final de la colección.");
            break;

        case 3: {
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
            usuarios.splice(
                posicion,
                0,
                nuevoUsuario
            );
            alert("El usuario fue agregado en la posición " + posicion + ".");
            break;
        }

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
    let usuarioEncontrado = null;
    for (const usuarioRegistrado of usuarios) {
        if (usuarioRegistrado.numDocumento === documentoEliminar) {
            usuarioEncontrado = usuarioRegistrado;
            break;
        }
    }
    if (usuarioEncontrado === null) {
        alert("No se encontró ningún usuario con ese número de documento.");
        return;
    }
    if (usuarios.length === 1) {
        alert("No se puede eliminar el usuario.\n\n" + "La colección debe tener al menos un usuario.");
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


//// Función para mostrar todos los usuarios de la colección
function mostrarUsuarios(usuarios, anioActual) {
    let datosUsuarios = "USUARIOS REGISTRADOS\n\n";
    for (const usuarioRegistrado of usuarios) {
        datosUsuarios +=
            "Nombre: " + usuarioRegistrado.nombre + "\n" +
            "Apellido: " + usuarioRegistrado.apellido + "\n" +
            "Documento: " + usuarioRegistrado.numDocumento + "\n" +
            "Edad: " + usuarioRegistrado.calcularEdad(anioActual) + "\n\n";
    }
    alert(datosUsuarios);
    console.log(
        "========== USUARIOS REGISTRADOS =========="
    );
    for (const usuarioRegistrado of usuarios) {
        console.log(usuarioRegistrado);
    }
    console.log("==========================================");
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
            "2 - Apellido\n" +
            "3 - Año de nacimiento\n" +
            "4 - Número de documento\n" +
            "5 - Edad\n" +
            "9 - Volver\n" +
            "0 - Salir"
        )
    );
    switch (datoConsultar) {
        case 1:
            alert("Nombre registrado:\n\n" + usuario.nombre);
            console.log("Consulta realizada: Nombre = " + usuario.nombre);
            break;

        case 2:
            alert("Apellido registrado:\n\n" + usuario.apellido);
            console.log("Consulta realizada: Apellido = " + usuario.apellido);
            break;

        case 3:
            alert("Año de nacimiento registrado:\n\n" + usuario.anioNacimiento);
            console.log("Consulta realizada: Año de nacimiento = " + usuario.anioNacimiento);
            break;

        case 4:
            alert("Número de documento registrado:\n\n" + usuario.numDocumento);
            console.log("Consulta realizada: Número de documento = " + usuario.numDocumento);
            break;

        case 5:
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
    let usuarioEncontrado = null;
    for (const usuarioRegistrado of usuarios) {
        if (usuarioRegistrado.numDocumento === documentoModificar) {
            usuarioEncontrado = usuarioRegistrado;
            break;
        }
    }
    if (usuarioEncontrado === null) {
        alert("No se encontró ningún usuario con ese número de documento.");
        return anioActual;
    }
    return modificarDato(
        usuarioEncontrado,
        anioActual
    );
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
    let datoActual;
    let tipoDato;

    switch (datoModificar) {

        case 1:
            propiedadModificar = "nombre";
            datoActual = usuario.nombre;
            tipoDato = "texto";
            break;

        case 2:
            propiedadModificar = "apellido";
            datoActual = usuario.apellido;
            tipoDato = "texto";
            break;

        case 3:
            propiedadModificar = "anioNacimiento";
            datoActual = usuario.anioNacimiento;
            tipoDato = "numero";
            break;

        case 4:
            propiedadModificar = "numDocumento";
            datoActual = usuario.numDocumento;
            tipoDato = "texto";
            break;

        case 9:
            return anioActual;
            
        case 0:
            return "salir";    

        default:
            alert("Opción incorrecta.");
            return anioActual;
    }

    const datoNuevo = prompt(
        "El dato actual es:\n\n" +
        datoActual +
        "\n\nIngresá el nuevo valor:"
    );

    if (datoNuevo === null) {
        return anioActual;
    }

    if (tipoDato === "anioActual") {

        const nuevoAnioActual = parseInt(datoNuevo);

        if (isNaN(nuevoAnioActual)) {

            alert(
                "El año ingresado no es válido."
            );

            return anioActual;
        }

        alert(
            "El año actual fue modificado correctamente."
        );

        console.log(
            "Año actual modificado: " +
            nuevoAnioActual
        );

        return nuevoAnioActual;
    }

    let valorFinal;

    if (tipoDato === "numero") {
        valorFinal = parseInt(datoNuevo);
    } else {
        valorFinal = datoNuevo;
    }

    usuario[propiedadModificar] = valorFinal;

    alert(
        "El dato fue modificado correctamente."
    );

    console.log(
        "Dato modificado: " +
        propiedadModificar +
        " = " +
        usuario[propiedadModificar]
    );

    return anioActual;
}

//// Función para mostrar los datos actuales del usuario
function mostrarDatosUsuario(usuario, anioActual) {
    alert("DATOS DEL USUARIO\n\n" +
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
                "GESTOR DE DATOS\n\n" +
                "1 - Consultar usuario\n" +
                "2 - Agregar usuario\n" +
                "3 - Eliminar usuario\n" +
                "4 - Modificar usuario\n" +
                "5 - Ver usuarios\n" +
                "9 - Volver\n" +
                "0 - Salir"
            )
        );
        switch (opcionDatos) {
            case 1:
                consultarUsuario(
                    usuarios,
                    anioActual
                );
                break;

            case 2:
                agregarUsuario(
                    usuarios
                );
                break;

            case 3:
                eliminarUsuario(
                    usuarios
                );
                break;

            case 4: {
                const resultadoModificacion = modificarUsuario(
                    usuarios,
                    anioActual
                );
                if (resultadoModificacion === "salir") {
                    return "salir";
                }
                anioActual = resultadoModificacion;
                break;
            }

            case 5:
                mostrarUsuarios(
                    usuarios,
                    anioActual
                );
                break;

            case 9:
                gestionar = false;
                break;

            case 0:
                return "salir";

            default:
                alert(
                    "Opción incorrecta."
                );
                break;
        }
    }
    return anioActual;
}

//// Solicitar datos al usuario
const nombre = prompt( "Ingrese su nombre");
const apellido = prompt( "Ingrese su apellido");
let anioActual = parseInt(prompt("Ingrese el año actual en formato AAAA"));
const anioNacimiento = parseInt(prompt ("Ingrese año de nacimiento en formato AAAA"));
const numDocumento = prompt( "Ingrese número de documento");

//// Creación de objetos Usuario
const usuario = new Usuario(
    nombre,
    apellido,
    anioNacimiento,
    numDocumento
);

const usuario2 = new Usuario(
    "Carlos",
    "Escudero",
    1985,
    "32123456"
);

const usuario3 = new Usuario(
    "Lucia",
    "Fernandez",
    2000,
    "40123456"
);

//// Array de objetos Usuario
const usuarios = [
    usuario,
    usuario2,
    usuario3
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
            const resultadoGestor = gestionarDatos(
                usuarios, anioActual 
            );
            if (resultadoGestor === "salir") {
                continuar = false;
            } else {
                anioActual = resultadoGestor;
            }
            break;

        case 5:
            const nuevoAnioActual = parseInt(
                prompt(
                    "El año actual es " + anioActual + ".\n\n" +
                    "Ingresá el nuevo año actual:"
                )
            );
            if (isNaN(nuevoAnioActual)) {
               alert("El año ingresado no es válido.");
            } else {
                anioActual = nuevoAnioActual;
                alert( "El año actual fue modificado correctamente.\n\n" +
                   "Nuevo año actual: " + anioActual
                );
                console.log("Año actual modificado: " + anioActual);
            }
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