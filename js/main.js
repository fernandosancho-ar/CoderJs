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

//// Función para modificar un dato del usuario
function modificarDato(usuario, anioActual) {

    const datoModificar = parseInt(
        prompt(
            "¿Qué dato querés modificar?\n\n" +
            "1 - Nombre\n" +
            "2 - Apellido\n" +
            "3 - Año de nacimiento\n" +
            "4 - Número de documento\n" +
            "5 - Año actual\n" +
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

        case 5:
            datoActual = anioActual;
            tipoDato = "anioActual";
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

//// Función para mostrar el contenido del array
function mostrarArray(array) {
    let datosActualizados = "Datos en el Array\n\n";
    for (const dato of array) {
        datosActualizados += "- " + dato + "\n";
    }
    return datosActualizados;
}

//// Función para consultar un dato dentro del array
function consultarArray(array) {
    const datoConsultar = prompt("Ingresá el dato que querés buscar:");
    if (datoConsultar === null) {
        return;
    }
    if (array.includes(datoConsultar)) {
        const posicion = array.indexOf(datoConsultar);
        alert(
            "El dato está registrado.\n\n" +
            "Valor: " + datoConsultar + "\n" +
            "Posición dentro de la lista: " + posicion
        );
        console.log( "Dato encontrado en posición: " + posicion );
    } else {

        alert("El dato no se encuentra registrado.");
    }
}

//// Función para agregar un dato al array
function agregarDatoArray(array) {
    const nuevoDato = prompt( "AGREGAR DATO\n\n" +
        "Ingresá el nuevo dato que querés agregar:"
    );
    if (nuevoDato === null) {
        return;
    }
    const prioridad = parseInt(
        prompt(
            "¿Querés agregar este dato al principio del array?\n\n" +
            "1 - Sí\n" +
            "2 - No"
        )
    );
    if (prioridad === 1) {
        array.unshift(nuevoDato);
        alert( "El dato fue agregado en el primer lugar del array.");
    } else if (prioridad === 2) {
        array.push(nuevoDato);
        alert("El dato fue agregado correctamente.");
    } else {
        alert( "Opción incorrecta." );
    }
}

//// Función para eliminar el último dato del array
function eliminarDatoArray(array) {
    if (array.length > 0) {
        const datoEliminado = array.pop();
        alert(
            "Se ha eliminado el elemento: " +
            datoEliminado
        );
        const reemplazar = parseInt(
            prompt(
                "¿Querés reemplazar el dato eliminado?\n\n" +
                "1 - Sí\n" +
                "2 - No"
            )
        );

        if (reemplazar === 1) {
            const datoReemplazo = prompt(
                "Ingresá el nuevo dato:"
            );

            if (datoReemplazo !== null) {
                array.push(datoReemplazo);
                alert("El dato fue reemplazado correctamente.");
            }
        }

    } else {
        alert("No hay datos disponibles para eliminar.");
    }
}

//// Función para modificar un dato dentro del array
function modificarDatoArray(array) {
    const datoActual = prompt("Ingresá el dato que querés modificar:");
    if (datoActual === null) {
        return;
    }
    const posicion = array.indexOf(datoActual);
    if (posicion !== -1) {
        const datoNuevo = prompt(
            "El dato actual es:\n\n" +
            datoActual +
            "\n\nIngresá el nuevo valor:"
        );
        if (datoNuevo !== null) {
            array.splice(posicion,1,datoNuevo);
            alert("El dato fue modificado correctamente.");
        }
    } else {
        alert(
            "El dato no se encuentra registrado."
        );
    }
}

//// Función para gestionar las operaciones del array
function gestionarArray(array) {
    let gestionar = true;
    while (gestionar) {
        const opcionArray = parseInt(
            prompt(
                "GESTOR DE ARRAY\n\n" +
                "1 - Consultar un dato\n" +
                "2 - Agregar un dato\n" +
                "3 - Eliminar el último dato\n" +
                "4 - Modificar un dato\n" +
                "5 - Ver datos del Array\n" +
                "9 - Volver\n" +
                "0 - Salir"
            )
        );
        switch (opcionArray) {
            case 1:
                consultarArray(array);
                break;

            case 2:
                agregarDatoArray(array);
                break;
            
            case 3:
                eliminarDatoArray(array);
                break;

            case 4:
                modificarDatoArray(array);
                break;

            case 5:
                alert(mostrarArray(array));
                console.log("Contenido actual del array:");
                console.log(array);
                break;

            case 9:
                gestionar = false;
                break;

            case 0:
                return "salir";

            default:
                alert("Opción incorrecta." );
                break;
        }
    }
}

//// Función para gestionar los datos del usuario
function gestionarDatos(usuario, anioActual, datosUsuario) {
    let gestionar = true;
    console.log( "Consulta gestor de datos" );
    while (gestionar) {
        const opcionDatos = parseInt(
            prompt(
                "GESTOR DE DATOS\n\n" +
                "1 - Consultar un dato\n" +
                "2 - Modificar un dato\n" +
                "3 - Ver datos del usuario\n" +
                "4 - Gestionar Array\n" +
                "9 - Volver\n" +
                "0 - Salir"
            )
        );
        switch (opcionDatos) {
            case 1:
                consultarDato(usuario,anioActual);
                break;

            case 2: {
                const resultadoModificacion = modificarDato(usuario,anioActual);
                if (resultadoModificacion === "salir") {
                    return "salir";
                }

    anioActual = resultadoModificacion;
    break;
}

            case 3:
                mostrarDatosUsuario( usuario, anioActual);
                break;

            case 4: {
                const resultadoArray = gestionarArray(
                 datosUsuario
                );
                if (resultadoArray === "salir") {
                    return "salir";
                }
                break;
            }

            case 9:
                gestionar = false;
                break;

            case 0:
                return "salir";

            default:
                alert( "Opción incorrecta." );
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

//// Array de datos del usuario
let datosUsuario = [
    usuario.nombre,
    usuario.apellido,
    usuario.anioNacimiento,
    usuario.numDocumento
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
                usuario, anioActual, datosUsuario
            );
            if (resultadoGestor === "salir") {
                continuar = false;
            } else {
                anioActual = resultadoGestor;
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

    //// Preguntar si desea realizar otra consulta
    if (continuar) {
        const nuevaConsulta = parseInt(
            prompt(
                "¿Desea realizar otra consulta?\n" +
                "1 - Sí, realizar otra consulta\n" +
                "2 - No, salir" )
        );

        if (nuevaConsulta === 2) {
            continuar = false;
        }
    }
}

//// Mensaje salida del simulador
alert("Gracias por utilizar el simulador.");
console.log("El usuario salió del simulador.");