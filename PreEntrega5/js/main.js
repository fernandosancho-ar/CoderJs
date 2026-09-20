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
    
    console.log("===== DATOS DEL USUARIO PROMPTEADO ====="); 
    console.log("Nombre Completo: " + usuario.nombre + " " + usuario.apellido); 
    console.log("Año actual: " + anioActual); 
    console.log("Año de nacimiento: " + usuario.anioNacimiento); 
    console.log("Edad: " + edad); 
    console.log("Documento: " + usuario.numDocumento); 
    console.log("======================================="); }

////  Función para consultar si la persona es mayor o menor de edad //// Recibe la edad como parámetro.
function verificarMayorEdad(edad) {
    if (edad >= 18) {
        return "Sos mayor de edad.";
    } else {
        return "Sos menor de edad.";
    }
}

//// Función flecha para determinar la categoría de edad //// Recibe la edad como parámetro y retorna una categoría.
const categoriaEdad = (edad) => {
    if (edad < 18) {
        return "menor de edad";
    } else if (edad < 65) {
        return "adulto";
    } else {
        return "adulto mayor";
    }
};

//// Solicitar datos al usuario
const nombre = prompt("Ingrese su nombre");
const apellido = prompt("Ingrese su apellido");
const anioActual = parseInt(prompt("Ingrese el año actual en formato AAAA"));
const anioNacimiento = parseInt(prompt("Ingrese año de nacimiento en formato AAAA"));
const numDocumento = prompt("Ingrese número de documento");

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

//// Utilizamos el método calcularEdad() del objeto Usuario
const edad = usuario.calcularEdad(anioActual);

//// Mostrar los objetos creados en consola 
console.log("========== USUARIOS CREADOS =========="); 

for (const usuarioRegistrado of usuarios) { 
    console.log(usuarioRegistrado); 
    console.log( "Edad: " + usuarioRegistrado.calcularEdad(anioActual) 
); 
} 

console.log("=======================================");

//// Mostrar datos del usurio prompteado 

mostrarDatos(usuario, anioActual);

alert(
    "Hola " + usuario.nombre + ", tu apellido es " + usuario.apellido + " y tu edad es de " + edad + " años."
);

//// Bucle para realizar consultas
let continuar = true;
let volverMenu = false;
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

//// Switch para las diferentes opciones 
    switch (menu) {

        case 1:
            alert("Su edad es de " + usuario.calcularEdad(anioActual) + " años.");
            console.log("Ver edad");
            break;

        case 2:
            const menoroMayor = verificarMayorEdad(usuario.calcularEdad(anioActual));
            alert(menoroMayor);
            console.log("Consulta mayoria edad");
            break;

        case 3:
            const categoria = categoriaEdad(usuario.calcularEdad(anioActual));
            alert("Sos un " + categoria + ".");
            console.log("Consulta categoría de edad");
            break;

        case 4: 
            let gestionarDatos = true;
            console.log("Consulta gestor de datos"); 
            while (gestionarDatos) { 
                const opcionDatos = parseInt( 
                    prompt( 
                        "GESTOR DE DATOS\n\n" + 
                        "1 - Consultar un dato\n" + 
                        "2 - Modificar un dato\n" + 
                        "3 - Ver datos del usuario\n" + 
                        "4 - Volver al Menú anterior\n" + 
                        "0 - Salir" ) );
                
                switch (opcionDatos) { 

                    case 1: 
                        const datoConsultar = parseInt( 
                            prompt( 
                                "¿Qué dato querés consultar?\n\n" + 
                                "1 - Nombre\n" + 
                                "2 - Apellido\n" + 
                                "3 - Año de nacimiento\n" + 
                                "4 - Número de documento\n" + 
                                "5 - Edad\n" + 
                                "6 - Volver al Menú anterior\n" +
                                "0 - Salir" 
                            ) 
                        );
                        let datoSeleccionado;
                        let nombreDato;

                        switch (datoConsultar) {
                            case 1: 
                              datoSeleccionado = usuario.nombre; 
                              nombreDato = "Nombre"; 
                              break; 

                            case 2: 
                              datoSeleccionado = usuario.apellido; 
                              nombreDato = "Apellido";
                              break; 
                            
                            case 3: 
                              datoSeleccionado = usuario.anioNacimiento; 
                              nombreDato = "Año de nacimiento";
                              break; 
                            
                            case 4: 
                              datoSeleccionado = usuario.numDocumento; 
                              nombreDato = "Número de documento";
                              break; 
                            
                            case 5: 
                              datoSeleccionado = usuario.calcularEdad(anioActual); 
                              nombreDato = "Edad"; 
                              break; 

                            case 6:
                              gestionarDatos = false;
                              volverMenu = true;
                              break; 

                            case 0:
                              gestionarDatos = false;
                              continuar = false;
                              break;
                            
                            default: 
                              alert( "Opción incorrecta." ); 
                              break;
                        } 
                        if (continuar && datoSeleccionado !== undefined && datoConsultar !== 6 ) { 
                            alert( nombreDato + " registrado:\n\n" + datoSeleccionado ); 
                            console.log( "Consulta realizada: " + nombreDato + " = " + datoSeleccionado 

                            ); 
                        } 
                        break;
                        
                    case 2:

                        const datoModificar = parseInt(
                            prompt(
                                "¿Qué dato querés modificar?\n\n" +
                                "1 - Nombre\n" +
                                "2 - Apellido\n" +
                                "3 - Año de nacimiento\n" +
                                "4 - Número de documento\n" +
                                "5 - Volver al Menú anterior\n" +
                                "0 - Salir"
                            )
                        );
                        if (datoModificar === 5) {
                            break;
                        }
                        if (datoModificar === 0) {
                            gestionarDatos = false;
                            continuar = false;
                            break;
                        }
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

                            default:
                                alert("Opción incorrecta.");
                                break;
                        }
                        if (propiedadModificar !== undefined) {
                            const datoNuevo = prompt(
                                "El dato actual es:\n\n" +
                                datoActual +
                                "\n\nIngresá el nuevo valor:"
                            );
                            if (datoNuevo === null) {
                                gestionarDatos = false;
                                continuar = false;
                            } else {
                                const valorFinal =
                                    tipoDato === "numero"
                                        ? parseInt(datoNuevo)
                                        : datoNuevo;
                                usuario[propiedadModificar] = valorFinal;
                                alert("El dato fue modificado correctamente.");
                                console.log(
                                    "Dato modificado: " +
                                    propiedadModificar +
                                    " = " +
                                    usuario[propiedadModificar]
                                );
                            }
                        }
                        break;
                        
                    case 3: 
                        alert( 
                            "DATOS DEL USUARIO\n\n" + 
                            "Nombre: " + usuario.nombre + "\n" + 
                            "Apellido: " + usuario.apellido + "\n" + 
                            "Año de nacimiento: " + usuario.anioNacimiento + "\n" + 
                            "Número de documento: " + usuario.numDocumento + "\n" + 
                            "Edad: " + usuario.calcularEdad(anioActual) 
                        ); 
                        console.log("Datos actuales del usuario:"); 
                        console.log(usuario); 
                        break;
                        
                    case 4: 
                        gestionarDatos = false; 
                        volverMenu = true; 
                        break;  
                    
                    case 0:
                        gestionarDatos = false;
                        continuar = false;
                        break;                        
                        
                    default: alert( "Opción incorrecta. Seleccioná una opción del 1 al 4." ); 
                } 
            } 
            break;
        
        case 0: 
            continuar = false;
            alert("Gracias por utilizar el simulador.");
            console.log("El usuario salió del simulador.");
            break;

        default:
            alert("Opción incorrecta. Por favor, seleccione una opción del 1 al 5.");
            console.log("Opción incorrecta ingresada: " + menu);
}

//// Preguntar si desea realizar otra consulta 
    if (continuar && !volverMenu) {
        const nuevaConsulta = parseInt( 
            prompt( 
                "¿Desea realizar otra consulta?\n" + 
                "1 - Sí, realizar otra consulta\n" + 
                "2 - No, salir" ) 
        ); 

        if (nuevaConsulta === 2) { 
            continuar = false; 
            alert("Gracias por utilizar el simulador."); 
            console.log("El usuario salió del simulador."); 
        } 
    } 
}
